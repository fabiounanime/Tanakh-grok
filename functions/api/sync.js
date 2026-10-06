async function sessionEmail(env, request) {
  const header = request.headers.get('Authorization') || '';
  const token = header.replace(/^Bearer\s+/i, '').trim();
  if (!token) return '';
  const raw = await env.ORIGENS.get(`session:${token}`);
  if (!raw) return '';
  const session = JSON.parse(raw);
  if (!session?.email || Number(session.exp) < Date.now()) return '';
  return session.email;
}

function cleanList(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && item.id)
    .slice(0, 200)
    .map((item) => ({
      id: String(item.id).slice(0, 80),
      title: String(item.title || '').slice(0, 120),
      body: String(item.body || '').slice(0, 8000),
      verseRefs: Array.isArray(item.verseRefs) ? item.verseRefs.slice(0, 40) : [],
      outline: item.outline && typeof item.outline === 'object' ? item.outline : null,
      map: item.map && typeof item.map === 'object' ? item.map : null,
      createdAt: String(item.createdAt || ''),
      updatedAt: String(item.updatedAt || ''),
    }));
}

export async function onRequestGet({ request, env }) {
  if (!env.ORIGENS) return Response.json({ error: 'sem-nuvem' }, { status: 503 });
  const email = await sessionEmail(env, request);
  if (!email) return Response.json({ error: 'entrar' }, { status: 401 });
  const raw = await env.ORIGENS.get(`devos:${email}`);
  return Response.json({ devotionals: raw ? JSON.parse(raw) : [] });
}

export async function onRequestPut({ request, env }) {
  if (!env.ORIGENS) return Response.json({ error: 'sem-nuvem' }, { status: 503 });
  const email = await sessionEmail(env, request);
  if (!email) return Response.json({ error: 'entrar' }, { status: 401 });
  let body = {};
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'pedido' }, { status: 400 });
  }
  const devotionals = cleanList(body.devotionals);
  await env.ORIGENS.put(`devos:${email}`, JSON.stringify(devotionals));
  return Response.json({ ok: true, count: devotionals.length });
}
