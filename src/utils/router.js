/**
 * Roteador hash: #/, #/biblia, #/livro/:id, #/ler/:id/:cap,
 * #/devocionais, #/devocionais/nova, #/devocionais/:id,
 * #/mensagens, #/conta, #/favoritos, #/ajustes
 */

const listeners = new Set();

export function parseHash() {
  const raw = (location.hash || '#/').replace(/^#/, '') || '/';
  const parts = raw.split('/').filter(Boolean);

  if (parts.length === 0) {
    return { name: 'home', params: {} };
  }
  if (parts[0] === 'biblia') {
    return { name: 'biblia', params: {} };
  }
  if (parts[0] === 'livro' && parts[1]) {
    return { name: 'book', params: { bookId: parts[1] } };
  }
  if (parts[0] === 'ler' && parts[1] && parts[2]) {
    const chapter = Number(parts[2]);
    return {
      name: 'reading',
      params: { bookId: parts[1], chapter: Number.isFinite(chapter) ? chapter : 1 },
    };
  }
  if (parts[0] === 'devocionais') {
    if (parts[1] === 'nova') {
      return { name: 'devocional-edit', params: { id: null, isNew: true } };
    }
    if (parts[1]) {
      return { name: 'devocional-edit', params: { id: parts[1], isNew: false } };
    }
    return { name: 'devocionais', params: {} };
  }
  // Legacy agenda → redirect conceptually to devotionals
  if (parts[0] === 'agenda') {
    return { name: 'devocionais', params: {} };
  }
  if (parts[0] === 'mensagens') {
    return { name: 'mensagens', params: {} };
  }
  if (parts[0] === 'conta') {
    return { name: 'conta', params: {} };
  }
  if (parts[0] === 'favoritos') {
    return { name: 'favorites', params: {} };
  }
  if (parts[0] === 'ajustes') {
    return { name: 'settings', params: {} };
  }
  return { name: 'home', params: {} };
}

export function navigate(path) {
  const hash = path.startsWith('#') ? path : `#${path.startsWith('/') ? path : `/${path}`}`;
  if (location.hash === hash) {
    notify();
  } else {
    location.hash = hash;
  }
}

export function onRouteChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify() {
  const route = parseHash();
  listeners.forEach((fn) => fn(route));
}

export function startRouter() {
  window.addEventListener('hashchange', notify);
  notify();
}

export const routes = {
  home: () => '#/',
  biblia: () => '#/biblia',
  book: (bookId) => `#/livro/${bookId}`,
  reading: (bookId, chapter) => `#/ler/${bookId}/${chapter}`,
  readingVerse: (bookId, chapter, verse) => `#/ler/${bookId}/${chapter}?v=${verse}`,
  devocionais: () => '#/devocionais',
  devocionalNova: () => '#/devocionais/nova',
  devocional: (id) => `#/devocionais/${id}`,
  mensagens: () => '#/mensagens',
  conta: () => '#/conta',
  favorites: () => '#/favoritos',
  settings: () => '#/ajustes',
};
