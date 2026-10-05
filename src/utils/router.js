/**
 * Roteador hash: #/, #/biblia, #/livro/:id, #/ler/:id/:cap,
 * #/mapa, #/devocionais, #/devocionais/nova, #/devocionais/:id,
 * #/marcacoes, #/favoritos
 */

const listeners = new Set();
const REMOVED_ACCOUNT_ROUTES = new Set([
  'conta',
  'account',
  'login',
  'entrar',
  'senha',
  'password',
  'ajustes',
  'settings-account',
  'configuracoes-conta',
]);

export function parseHash() {
  const raw = (location.hash || '#/').replace(/^#/, '') || '/';
  const [pathPart, queryPart = ''] = raw.split('?');
  const parts = pathPart.split('/').filter(Boolean);
  const query = new URLSearchParams(queryPart);

  if (parts.length === 0 || REMOVED_ACCOUNT_ROUTES.has(parts[0])) {
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
    const verseRaw = query.get('v');
    const verseNum = verseRaw != null ? Number(verseRaw) : NaN;
    const verse = Number.isFinite(verseNum) && verseNum > 0 ? verseNum : null;
    return {
      name: 'reading',
      params: {
        bookId: parts[1],
        chapter: Number.isFinite(chapter) ? chapter : 1,
        verse,
      },
    };
  }
  if (parts[0] === 'mapa') {
    return { name: 'mapa', params: {} };
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
  if (parts[0] === 'marcacoes' || parts[0] === 'favoritos') {
    return { name: 'favorites', params: {} };
  }
  if (parts[0] === 'mensagens') {
    // Legacy: Mensagens removed from nav — send to marcações
    return { name: 'favorites', params: {} };
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
  const path = (location.hash || '#/').replace(/^#/, '').split('?')[0].split('/').filter(Boolean);
  if (path[0] && REMOVED_ACCOUNT_ROUTES.has(path[0])) {
    location.hash = '#/';
    return;
  }
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
  mapa: () => '#/mapa',
  devocionais: () => '#/devocionais',
  devocionalNova: () => '#/devocionais/nova',
  devocional: (id) => `#/devocionais/${id}`,
  mensagens: () => '#/marcacoes',
  marcacoes: () => '#/marcacoes',
  favorites: () => '#/marcacoes',
};
