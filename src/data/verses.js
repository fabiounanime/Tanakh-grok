/**
 * Versículos embarcados (camadas sincronizadas) — carregamento modular lazy.
 * Português: tradução direta do original (produto do app — não é edição comercial).
 * Hebraico/Aramaico: Westminster Leningrad Codex (domínio público).
 * Grego: Robinson-Pierpont Byzantine Majority Text (domínio público).
 * Transliteração: leitura fonética LTR gerada.
 */
import { FIXED_PT_VERSION } from './versions.js';

/** Lazy JSON modules: ./books/<id>.json (exclui index). */
const bookLoaders = import.meta.glob('./books/*.json');

/** @type {Map<string, object>} */
const cache = new Map();

/** @type {Promise<object>|null} */
let indexPromise = null;

function loaderKey(bookId) {
  return `./books/${bookId}.json`;
}

export async function loadBookIndex() {
  if (!indexPromise) {
    const loader = bookLoaders['./books/index.json'];
    indexPromise = loader
      ? loader().then((m) => m.default ?? m)
      : Promise.resolve({ books: [], ptComplete: [], ptPartial: [], ptNone: [] });
  }
  return indexPromise;
}

/**
 * @param {string} bookId
 * @returns {Promise<object|null>}
 */
export async function loadBook(bookId) {
  const id = String(bookId || '');
  if (cache.has(id)) return cache.get(id);
  const loader = bookLoaders[loaderKey(id)];
  if (!loader) return null;
  const mod = await loader();
  const data = mod?.default ?? mod;
  if (data?.id) cache.set(id, data);
  return data || null;
}

export function getBookData(bookId) {
  return cache.get(String(bookId || '')) || null;
}

/**
 * Chapter-level original language for mixed books (Daniel / Ezra / Jer 10:11).
 * @returns {'he'|'arc'|'el'}
 */
export function getChapterOriginalLang(bookId, chapter, verses) {
  if (Array.isArray(verses) && verses.length) {
    const counts = { he: 0, arc: 0, el: 0 };
    for (const v of verses) {
      const lang = v.lang || v.originalLang || 'he';
      if (counts[lang] != null) counts[lang] += 1;
    }
    if (counts.arc > 0 && counts.arc >= counts.he) return 'arc';
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (entries[0][1] > 0) return /** @type {'he'|'arc'|'el'} */ (entries[0][0]);
  }
  const book = getBookData(bookId);
  if (book?.defaultLang === 'el') return 'el';
  const ch = Number(chapter);
  if (bookId === 'dan') {
    if ((ch >= 3 && ch <= 7) || ch === 2) return 'arc';
  }
  if (bookId === 'ezr') {
    if (ch === 4 || ch === 5 || ch === 6 || ch === 7) return 'arc';
  }
  return book?.defaultLang === 'el' ? 'el' : 'he';
}

export function originalLangLabel(lang) {
  if (lang === 'el') return 'Grego';
  if (lang === 'arc') return 'Aramaico';
  return 'Hebraico';
}

export function getChapterNotes(bookId, chapter) {
  const book = getBookData(bookId);
  if (!book) return [];
  const ch = book.chapters?.find((c) => c.n === Number(chapter));
  return Array.isArray(ch?.notes) ? ch.notes : [];
}

function mapVerses(book, chapter) {
  if (!book) return [];
  const ch = book.chapters?.find((c) => c.n === Number(chapter));
  if (!ch) return [];
  return (ch.verses || []).map((v) => ({
    bookId: book.id,
    chapter: Number(chapter),
    verse: v.n,
    original: v.original || '',
    originalLang: v.lang || book.defaultLang || 'he',
    lang: v.lang || book.defaultLang || 'he',
    transliteration: v.transliteration || '',
    portuguese: v.portuguese || '',
  }));
}

/** Sync accessor — requires prior loadBook / loadVersesAsync. */
export function getVerses(bookId, chapter) {
  return mapVerses(getBookData(bookId), chapter);
}

export async function loadVersesAsync(bookId, chapter) {
  const book = await loadBook(bookId);
  return mapVerses(book, chapter);
}

export function hasDemoContent(bookId, chapter) {
  const verses = getVerses(bookId, chapter);
  if (!verses.length) return false;
  return verses.some((v) => v.original);
}

export function hasPortugueseContent(bookId, chapter) {
  return getVerses(bookId, chapter).some((v) => (v.portuguese || '').trim());
}

/** Prefetch book for chapter grid badges. */
export async function ensureBookLoaded(bookId) {
  return loadBook(bookId);
}

export function chapterCoverage(bookId, chapter) {
  const verses = getVerses(bookId, chapter);
  const total = verses.length;
  const withPt = verses.filter((v) => (v.portuguese || '').trim()).length;
  const withOrig = verses.filter((v) => (v.original || '').trim()).length;
  return { total, withPt, withOrig };
}

export function resolvePortuguese(verse) {
  if (!verse) return '';
  return verse.portuguese || '';
}

export function getVersesForVersion(bookId, chapter) {
  return getVerses(bookId, chapter).map((v) => ({
    ...v,
    portuguese: resolvePortuguese(v),
    portugueseSource: (v.portuguese || '').trim() ? 'demo' : 'missing',
  }));
}

export async function loadVersesForVersion(bookId, chapter) {
  await loadBook(bookId);
  return getVersesForVersion(bookId, chapter);
}

export function isRemotePtVersion() {
  return false;
}

export function mergeApiChapterVerses(bookId, chapter, apiVerses, versionId, opts = {}) {
  const local = getVerses(bookId, chapter);
  const byVerse = new Map(local.map((v) => [v.verse, v]));
  const fallbackLang = opts.originalLang === 'el' ? 'el' : 'he';
  return (Array.isArray(apiVerses) ? apiVerses : []).map(({ verse, text }) => {
    const base = byVerse.get(Number(verse));
    if (base) {
      return { ...base, portuguese: text, portugueseSource: versionId };
    }
    return {
      bookId,
      chapter: Number(chapter),
      verse: Number(verse),
      original: '',
      originalLang: fallbackLang,
      lang: fallbackLang,
      transliteration: '',
      portuguese: text,
      portugueseSource: versionId,
    };
  });
}

export const verses = [];
