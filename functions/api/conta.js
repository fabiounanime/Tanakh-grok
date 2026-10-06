async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 120000, hash: 'SHA-256' },
    key,
    256
  );
  return btoa(String.fromCharCode(...new Uint8Array(bits)));
}

function bytesToB64(bytes) {
  return btoa(String.fromCharCode(...bytes));
}

function b64ToBytes(value) {
  const raw = atob(value);
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}

async function readUser(env, email) {
  const raw = await env.ORIGENS.get(`user:${email}`);
  return raw ? JSON.parse(raw) : null;
}

export async function onRequestPost({ request, env }) {
  if (!env.ORIGENS) return Response.json({ error: 'sem-nuvem' }, { status: 503 });

  let body = {};
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'pedido' }, { status: 400 });
  }

  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  const mode = body.mode === 'criar' ? 'criar' : 'entrar';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) {
    return Response.json({ error: 'dados' }, { status: 400 });
  }

  const existing = await readUser(env, email);
  if (mode === 'criar') {
    if (existing) return Response.json({ error: 'existe' }, { status: 409 });
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const user = {
      email,
      salt: bytesToB64(salt),
      hash: await hashPassword(password, salt),
      createdAt: new Date().toISOString(),
    };
    await env.ORIGENS.put(`user:${email}`, JSON.stringify(user));
  } else {
    if (!existing) return Response.json({ error: 'entrar' }, { status: 401 });
    const hash = await hashPassword(password, b64ToBytes(existing.salt));
    if (hash !== existing.hash) return Response.json({ error: 'entrar' }, { status: 401 });
  }

  const token = crypto.randomUUID() + crypto.randomUUID();
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 60;
  await env.ORIGENS.put(`session:${token}`, JSON.stringify({ email, exp }), { expirationTtl: 60 * 60 * 24 * 60 });
  return Response.json({ token, email });
}
