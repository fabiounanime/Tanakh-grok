/**
 * Bible text clients:
 * 1) bible-api.com — public-domain Almeida (no key)
 * 2) ABíbliaDigital — ACF / RA / NVI via GET /verses/{version}/{abbrev}/{chapter}
 *    Optional Bearer: VITE_ABIBLIA_TOKEN (20 req/hr/IP without token)
 * 3) Licensed providers (api.Bible / DBP) — stub until VITE_BIBLE_API_* is set
 *
 * Remote fetches cache in memory + localStorage so chapters remain readable
 * offline after the first successful fetch.
 */

import { toAbibliaAbbrev } from '../data/books.js';
import { getPtVersionMeta } from '../data/versions.js';

const ENABLED = String(import.meta.env.VITE_BIBLE_API_ENABLED || '').toLowerCase() === 'true';
const PROVIDER = String(import.meta.env.VITE_BIBLE_API_PROVIDER || '').trim();
const API_KEY = String(import.meta.env.VITE_BIBLE_API_KEY || '').trim();
const ABIBLIA_TOKEN = String(
  import.meta.env.VITE_ABIBLIA_TOKEN ||
    import.meta.env.VITE_ABIBLIA_DIGITAL_TOKEN ||
    ''
).trim();

const BIBLE_ID_ENV = {
  nvi: 'VITE_BIBLE_API_BIBLE_NVI',
  nvt: 'VITE_BIBLE_API_BIBLE_NVT',
  arc: 'VITE_BIBLE_API_BIBLE_ARC',
};

const BIBLE_API_BASE = 'https://bible-api.com';
const ABIBLIA_BASE = 'https://www.abibliadigital.com.br/api';
const LS_PREFIX = 'biblia-tanakh:bibleApi:';
/** @type {Map<string, Array<{ verse: number, text: string }>>} */
const memoryCache = new Map();

function bibleIdFor(versionId) {
  const envName = BIBLE_ID_ENV[versionId];
  if (!envName) return '';
  const fromEnv = String(import.meta.env[envName] || '').trim();
  if (fromEnv) return fromEnv;
  const meta = getPtVersionMeta(versionId);
  return String(meta?.apiBibleId || '').trim();
}

/** True when licensed API flag + key + provider are set (no network call). */
export function isBibleApiConfigured() {
  return Boolean(ENABLED && API_KEY && PROVIDER);
}

export function getBibleApiConfig() {
  return {
    enabled: ENABLED,
    provider: PROVIDER || null,
    hasKey: Boolean(API_KEY),
    configured: isBibleApiConfigured(),
    abibliaToken: Boolean(ABIBLIA_TOKEN),
  };
}

/**
 * Catalog entry is selectable:
 * - bible-api.com (public domain Almeida): always
 * - ABíbliaDigital (acf/ra/nvi): always (token optional for rate limit)
 * - licensed API: only when configured + bible id mapped
 */
export function isApiVersionReady(version) {
  if (!version || version.source === 'local') return false;
  if (version.source === 'bible-api') return true;
  if (version.source === 'abiblia-digital') return Boolean(version.abibliaVersion);
  if (version.source !== 'api') return false;
  if (!isBibleApiConfigured()) return false;
  return Boolean(bibleIdFor(version.id));
}

function chapterCacheKey(translation, bookId, chapter) {
  return `${translation}:${String(bookId).toUpperCase()}:${Number(chapter)}`;
}

function normalizeVerseText(text) {
  return String(text || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * @returns {Array<{ verse: number, text: string }>|null}
 */
function readChapterCache(key) {
  if (memoryCache.has(key)) return memoryCache.get(key);
  try {
    const raw = localStorage.getItem(LS_PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    memoryCache.set(key, parsed);
    return parsed;
  } catch {
    return null;
  }
}

function writeChapterCache(key, verses) {
  memoryCache.set(key, verses);
  try {
    localStorage.setItem(LS_PREFIX + key, JSON.stringify(verses));
  } catch {
    /* quota / private mode */
  }
}

/**
 * Fetch a chapter from bible-api.com (parameterized API).
 * Uses memory + localStorage cache; returns cache when offline after first fetch.
 * @param {string} translation  e.g. "almeida"
 * @param {string} bookId       app id (gen) or API id (GEN)
 * @param {number} chapter
 * @returns {Promise<Array<{ verse: number, text: string }>>}
 */
export async function fetchBibleApiComChapter(translation, bookId, chapter) {
  const t = String(translation || '').trim().toLowerCase();
  const book = String(bookId || '').trim().toUpperCase();
  const cap = Number(chapter);
  if (!t || !book || !Number.isFinite(cap) || cap < 1) {
    throw new Error('Parâmetros inválidos para bible-api.com.');
  }

  const key = chapterCacheKey(t, book, cap);
  const cached = readChapterCache(key);
  if (cached) return cached;

  const url = `${BIBLE_API_BASE}/data/${encodeURIComponent(t)}/${encodeURIComponent(book)}/${cap}`;
  let res;
  try {
    res = await fetch(url);
  } catch {
    throw new Error(
      'Sem conexão e este capítulo ainda não está em cache. Conecte-se e abra o capítulo uma vez.'
    );
  }
  if (!res.ok) {
    throw new Error(`bible-api.com respondeu ${res.status} ao buscar ${book} ${cap}.`);
  }
  const data = await res.json();
  const verses = (Array.isArray(data.verses) ? data.verses : [])
    .map((v) => ({
      verse: Number(v.verse),
      text: normalizeVerseText(v.text),
    }))
    .filter((v) => Number.isFinite(v.verse) && v.verse > 0)
    .sort((a, b) => a.verse - b.verse);

  if (!verses.length) {
    throw new Error(`Nenhum versículo retornado para ${book} ${cap}.`);
  }

  writeChapterCache(key, verses);
  return verses;
}

/**
 * Fetch a chapter from ABíbliaDigital.
 * GET /verses/{version}/{abbrev}/{chapter}
 * Optional Authorization: Bearer <VITE_ABIBLIA_TOKEN>
 * @param {string} version   acf | ra | nvi
 * @param {string} bookId    app book id (gen, jhn, …)
 * @param {number} chapter
 * @returns {Promise<Array<{ verse: number, text: string }>>}
 */
export async function fetchAbibliaDigitalChapter(version, bookId, chapter) {
  const ver = String(version || '').trim().toLowerCase();
  const abbrev = toAbibliaAbbrev(bookId);
  const cap = Number(chapter);
  if (!ver || !abbrev || !Number.isFinite(cap) || cap < 1) {
    throw new Error('Parâmetros inválidos para ABíbliaDigital.');
  }

  const cacheId = `abiblia:${ver}`;
  const key = chapterCacheKey(cacheId, abbrev, cap);
  const cached = readChapterCache(key);
  if (cached) return cached;

  const url = `${ABIBLIA_BASE}/verses/${encodeURIComponent(ver)}/${encodeURIComponent(
    abbrev
  )}/${cap}`;
  /** @type {RequestInit} */
  const init = { headers: { Accept: 'application/json' } };
  if (ABIBLIA_TOKEN) {
    init.headers = {
      ...init.headers,
      Authorization: `Bearer ${ABIBLIA_TOKEN}`,
    };
  }

  let res;
  try {
    res = await fetch(url, init);
  } catch {
    throw new Error(
      'Sem conexão e este capítulo ainda não está em cache. Conecte-se e abra o capítulo uma vez.'
    );
  }

  if (res.status === 409) {
    throw new Error(
      'Limite da ABíbliaDigital (20 req/h sem token). Defina VITE_ABIBLIA_TOKEN ou aguarde e tente de novo.'
    );
  }
  if (!res.ok) {
    throw new Error(
      `ABíbliaDigital respondeu ${res.status} ao buscar ${ver}/${abbrev}/${cap}.`
    );
  }

  const data = await res.json();
  const verses = (Array.isArray(data.verses) ? data.verses : [])
    .map((v) => ({
      verse: Number(v.number ?? v.verse),
      text: normalizeVerseText(v.text),
    }))
    .filter((v) => Number.isFinite(v.verse) && v.verse > 0)
    .sort((a, b) => a.verse - b.verse);

  if (!verses.length) {
    throw new Error(`Nenhum versículo retornado para ${ver} ${abbrev} ${cap}.`);
  }

  writeChapterCache(key, verses);
  return verses;
}

/**
 * Fetch chapter verses for a catalog API version id.
 * @returns {Promise<Array<{ verse: number, text: string }>>}
 */
export async function fetchApiChapter(versionId, bookId, chapter) {
  const meta = getPtVersionMeta(versionId);
  if (meta?.source === 'bible-api') {
    const translation = meta.apiTranslation || 'almeida';
    return fetchBibleApiComChapter(translation, bookId, chapter);
  }
  if (meta?.source === 'abiblia-digital') {
    const ver = meta.abibliaVersion || versionId;
    return fetchAbibliaDigitalChapter(ver, bookId, chapter);
  }

  if (!isBibleApiConfigured()) {
    throw new Error('Bible API not configured (set VITE_BIBLE_API_* env).');
  }
  throw new Error(
    `Bible API provider "${PROVIDER}" is not wired yet. See README — Licensed versions via API.`
  );
}

/** Peek cache without network (for UI hints). */
export function hasCachedBibleApiChapter(translation, bookId, chapter) {
  const key = chapterCacheKey(translation, bookId, chapter);
  return readChapterCache(key) != null;
}
