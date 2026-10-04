export async function onRequestPost({ request, env }) {
  if (!env.XAI_API_KEY) {
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

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.XAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'grok-3',
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content:
            'Você escreve um rascunho de devocional em português do Brasil, curto, para o app Bíblia Origens. Não copie Almeida, ACF, ARC, NVI nem outra versão comercial. Se citar o texto, use só o trecho que o leitor enviou. Mantenha YHWH, Elohim, El e Eloah quando aparecerem. Não invente versículo. Devolva somente JSON com as chaves title e body. title até 80 caracteres. body com dois ou três parágrafos, sem markdown.',
        },
        { role: 'user', content: passage },
      ],
    }),
  });

  if (!response.ok) {
    return Response.json({ error: 'ia' }, { status: 502 });
  }

  const payload = await response.json();
  const raw = payload?.choices?.[0]?.message?.content || '';
  let parsed;
  try {
    parsed = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, ''));
  } catch {
    return Response.json({ error: 'formato' }, { status: 502 });
  }

  const title = String(parsed.title || '').trim().slice(0, 120);
  const body = String(parsed.body || '').trim().slice(0, 4000);
  if (!title || !body) return Response.json({ error: 'formato' }, { status: 502 });
  return Response.json({ title, body });
}
