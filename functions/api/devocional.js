export async function onRequestPost({ request, env }) {
  if (!env.GEMINI_API_KEY) {
    return Response.json({ error: 'sem-chave' }, { status: 503 });
  }

  let passage = '';
  try {
    const body = await request.json();
    passage = String(body?.passage || '').trim().slice(0, 2000);
  } catch {
    return Response.json({ error: 'pedido' }, { status: 400 });
  }
  if (!passage) return Response.json({ error: 'vazio' }, { status: 400 });

  const prompt = `Escreva uma devocional em português do Brasil, no estilo de uma pregação curta: gancho, ideia central, três movimentos com observação, ilustração e aplicação, aplicação final e conclusão. Use só o trecho ou tema enviado. Não invente versículo. Não copie Almeida, ACF, ARC, NVI nem outra versão comercial. Se precisar do texto bíblico, use apenas o que o leitor enviou. Mantenha YHWH, Elohim, El e Eloah quando aparecerem.

Devolva somente JSON com esta forma:
{"title":"","theme":"","baseText":"","centralIdea":"","related":[""],"movements":[{"title":"","verse":"","observation":"","illustration":"","application":"","transition":""}],"application":"","conclusion":""}
title até 80 caracteres. related com no máximo 4 referências. movements com 3 itens.`;

  const models = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-2.5-flash'];
  let response;
  let payload;
  for (const model of models) {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `${prompt}\n\nPassagem ou tema:\n${passage}` }] }],
          generationConfig: { temperature: 0.5, responseMimeType: 'application/json' },
        }),
      }
    );
    payload = await response.json().catch(() => ({}));
    if (response.ok) break;
    if (response.status !== 404) break;
  }

  if (!response?.ok) {
    const detail = String(payload?.error?.message || '').slice(0, 180);
    return Response.json({ error: 'ia', detail }, { status: 502 });
  }
  const raw = (payload?.candidates?.[0]?.content?.parts || []).map((part) => part.text || '').join('');
  let parsed;
  try {
    parsed = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, ''));
  } catch {
    return Response.json({ error: 'formato', detail: 'O Gemini respondeu fora do formato esperado.' }, { status: 502 });
  }

  const title = String(parsed.title || '').trim().slice(0, 120);
  const movements = Array.isArray(parsed.movements) ? parsed.movements.slice(0, 4) : [];
  if (!title || !movements.length) return Response.json({ error: 'formato' }, { status: 502 });

  const clean = (value, max) => String(value || '').trim().slice(0, max);
  const outline = {
    theme: clean(parsed.theme, 80),
    baseText: clean(parsed.baseText, 80),
    centralIdea: clean(parsed.centralIdea, 400),
    related: (Array.isArray(parsed.related) ? parsed.related : []).map((item) => clean(item, 80)).filter(Boolean).slice(0, 4),
    movements: movements.map((item) => ({
      title: clean(item.title, 80),
      verse: clean(item.verse, 80),
      observation: clean(item.observation, 700),
      illustration: clean(item.illustration, 400),
      application: clean(item.application, 400),
      transition: clean(item.transition, 240),
    })),
    application: clean(parsed.application, 700),
    conclusion: clean(parsed.conclusion, 500),
  };

  const lines = [
    outline.centralIdea ? `Ideia central: ${outline.centralIdea}` : '',
    outline.baseText ? `Texto-base: ${outline.baseText}` : '',
    outline.related.length ? `Textos relacionados: ${outline.related.join(', ')}` : '',
    ...outline.movements.map((item, index) =>
      [
        `${index + 1}. ${item.title}`,
        item.verse ? `Versículo: ${item.verse}` : '',
        item.observation,
        item.illustration ? `Ilustração: ${item.illustration}` : '',
        item.application ? `Aplicação: ${item.application}` : '',
        item.transition ? `Transição: ${item.transition}` : '',
      ]
        .filter(Boolean)
        .join('\n')
    ),
    outline.application ? `Aplicação\n${outline.application}` : '',
    outline.conclusion ? `Conclusão\n${outline.conclusion}` : '',
  ].filter(Boolean);
  const body = lines.join('\n\n').slice(0, 8000);

  const map = {
    center: title,
    nodes: [
      { id: 'ideia', parentId: null, title: 'Ideia central', kicker: outline.centralIdea },
      ...outline.movements.map((item, index) => ({
        id: `m${index}`,
        parentId: 'ideia',
        title: item.title || `Movimento ${index + 1}`,
        kicker: item.verse || item.application,
      })),
      { id: 'aplicar', parentId: 'ideia', title: 'Aplicação', kicker: outline.application },
      { id: 'fecho', parentId: 'ideia', title: 'Conclusão', kicker: outline.conclusion },
    ],
  };

  return Response.json({ title, body, outline, map });
}
