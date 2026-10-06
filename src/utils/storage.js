import { FIXED_PT_VERSION, DEFAULT_PT_VERSION, isLocallyAvailablePtVersion, getPtVersionMeta } from '../data/versions.js';
import { isApiVersionReady } from './bibleApi.js';

export function isAvailablePtVersion(id) {
  const meta = getPtVersionMeta(id);
  if (!meta) return false;
  if (meta.source === 'local') return isLocallyAvailablePtVersion(id);
  if (meta.source === 'bible-api' || meta.source === 'abiblia-digital') return true;
  return isApiVersionReady(meta);
}


const TAB_KEY = 'biblia-tanakh:activeTab';
const MARKS_KEY = 'biblia-tanakh:marks';
const SAVED_MARKS_KEY = 'biblia-tanakh:savedMarks';
const DEVOCIONAIS_KEY = 'biblia-tanakh:devocionais';

const TAB_KEYS = new Set(['portuguese', 'hebrew', 'transliteration']);

export function getSavedTab() {
  const saved = localStorage.getItem(TAB_KEY);
  if (saved === 'original') return 'hebrew';
  return TAB_KEYS.has(saved) ? saved : 'portuguese';
}

export function saveTab(tab) {
  if (TAB_KEYS.has(tab)) localStorage.setItem(TAB_KEY, tab);
}


const PT_VERSION_KEY = 'biblia-tanakh:ptVersion';

/**
 * Portuguese is fixed to the app’s local original rendering (FIXED_PT_VERSION).
 * No version picker; ACF/RA/NVI/Almeida API selections are ignored.
 */
export function getPtVersion() {
  return FIXED_PT_VERSION || DEFAULT_PT_VERSION;
}

/** No-op while the picker is disabled — always keeps the local original source. */
export function setPtVersion(_id) {
  try {
    localStorage.setItem(PT_VERSION_KEY, FIXED_PT_VERSION);
  } catch {
    /* ignore quota */
  }
  return FIXED_PT_VERSION;
}



const FONT_SCALE_KEY = 'biblia-tanakh:fontScale';
export const FONT_SCALE_MIN = 0.8;
export const FONT_SCALE_MAX = 1.75;
export const FONT_SCALE_STEP = 0.1;
export const FONT_SCALE_DEFAULT = 1;

function clampFontScale(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return FONT_SCALE_DEFAULT;
  return Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, Math.round(x * 100) / 100));
}

export function getFontScale() {
  try {
    const raw = localStorage.getItem(FONT_SCALE_KEY);
    if (raw == null || raw === '') return FONT_SCALE_DEFAULT;
    return clampFontScale(raw);
  } catch {
    return FONT_SCALE_DEFAULT;
  }
}

export function setFontScale(scale) {
  const next = clampFontScale(scale);
  try {
    localStorage.setItem(FONT_SCALE_KEY, String(next));
  } catch {
    /* ignore quota */
  }
  applyFontScale(next);
  return next;
}

export function bumpFontScale(delta) {
  return setFontScale(getFontScale() + Number(delta || 0));
}

/** Apply CSS custom property used by verse text (all language tabs). */
export function applyFontScale(scale = getFontScale()) {
  const next = clampFontScale(scale);
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--reading-font-scale', String(next));
  }
  return next;
}


const LAST_READ_KEY = 'biblia-tanakh:lastRead';
const THEME_KEY = 'biblia-tanakh:theme';

export function getLastRead() {
  const data = readJson(LAST_READ_KEY, null);
  if (!data || !data.bookId || !data.chapter) return null;
  return data;
}

export function setLastRead(entry) {
  if (!entry?.bookId || !entry.chapter) return null;
  const next = {
    bookId: entry.bookId,
    bookName: entry.bookName || '',
    chapter: Number(entry.chapter),
    verse: Number(entry.verse) || 1,
    snippet: String(entry.snippet || '').slice(0, 180),
    at: new Date().toISOString(),
  };
  writeJson(LAST_READ_KEY, next);
  return next;
}

/** Persisted appearance. Dark is the default (current look). */
export function getTheme() {
  try {
    return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function applyTheme(theme = getTheme()) {
  const next = theme === 'light' ? 'light' : 'dark';
  if (typeof document === 'undefined') return next;
  document.documentElement.setAttribute('data-theme', next);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', next === 'light' ? '#f7f4ec' : '#050505');
  const apple = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
  if (apple) apple.setAttribute('content', next === 'light' ? 'default' : 'black-translucent');
  return next;
}

export function setTheme(theme) {
  const next = theme === 'light' ? 'light' : 'dark';
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    /* ignore quota */
  }
  return applyTheme(next);
}

export function toggleTheme() {
  return setTheme(getTheme() === 'light' ? 'dark' : 'light');
}


export function verseKey(bookId, chapter, verse) {
  return `${bookId}:${chapter}:${verse}`;
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/** @returns {Record<string, { bookId: string, chapter: number, verse: number, markedAt: string }>} */
export function getMarks() {
  const data = readJson(MARKS_KEY, {});
  return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
}

export function isMarked(bookId, chapter, verse) {
  return Boolean(getMarks()[verseKey(bookId, chapter, verse)]);
}

export function setMark(bookId, chapter, verse, marked = true) {
  const marks = getMarks();
  const key = verseKey(bookId, chapter, verse);
  if (marked) {
    marks[key] = {
      bookId,
      chapter: Number(chapter),
      verse: Number(verse),
      markedAt: new Date().toISOString(),
    };
  } else {
    delete marks[key];
  }
  writeJson(MARKS_KEY, marks);
  return marks;
}

export function toggleMark(bookId, chapter, verse) {
  const next = !isMarked(bookId, chapter, verse);
  setMark(bookId, chapter, verse, next);
  return next;
}

/** @returns {Array<{ id: string, bookId: string, chapter: number, verse: number, ref: string, snippet: string, savedAt: string }>} */
export function getSavedMarks() {
  const data = readJson(SAVED_MARKS_KEY, []);
  return Array.isArray(data) ? data : [];
}

export function saveMarkEntry({ bookId, chapter, verse, ref, snippet }) {
  const list = getSavedMarks();
  const id = verseKey(bookId, chapter, verse);
  const existing = list.findIndex((m) => m.id === id);
  const entry = {
    id,
    bookId,
    chapter: Number(chapter),
    verse: Number(verse),
    ref: ref || `${bookId} ${chapter}:${verse}`,
    snippet: snippet || '',
    savedAt: new Date().toISOString(),
  };
  if (existing >= 0) list[existing] = entry;
  else list.unshift(entry);
  writeJson(SAVED_MARKS_KEY, list);
  setMark(bookId, chapter, verse, true);
  return entry;
}

export function removeSavedMark(id) {
  const list = getSavedMarks().filter((m) => m.id !== id);
  writeJson(SAVED_MARKS_KEY, list);
  return list;
}

function uid() {
  return `d_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * @typedef {{ bookId: string, chapter: number, verse: number, ref: string, snippet: string }} VerseRef
 * @typedef {{ id: string, title: string, body: string, verseRefs: VerseRef[], createdAt: string, updatedAt: string }} Devocional
 */

/** @returns {Devocional[]} */
export function getDevocionais() {
  const data = readJson(DEVOCIONAIS_KEY, []);
  return Array.isArray(data) ? data : [];
}

/** @returns {Devocional | null} */
export function getDevocionalById(id) {
  return getDevocionais().find((d) => d.id === id) ?? null;
}

export function saveDevocionais(list) {
  writeJson(DEVOCIONAIS_KEY, list);
  if (getOfflineDevocionais()) {
    saveDevocionaisOffline().catch(() => {});
  }
  pushDevocionais().catch(() => {});
}

const SESSION_KEY = 'biblia-tanakh:session';

export function getSession() {
  const data = readJson(SESSION_KEY, null);
  return data?.token && data?.email ? data : null;
}

export function setSession(session) {
  if (!session?.token) {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
    return null;
  }
  writeJson(SESSION_KEY, { token: session.token, email: session.email });
  return getSession();
}

function authHeaders() {
  const session = getSession();
  if (!session) return null;
  return { Authorization: `Bearer ${session.token}`, 'Content-Type': 'application/json' };
}

function mergeDevocionais(local, remote) {
  const map = new Map();
  for (const item of [...(remote || []), ...(local || [])]) {
    if (!item?.id) continue;
    const prev = map.get(item.id);
    if (!prev || String(prev.updatedAt || '') < String(item.updatedAt || '')) map.set(item.id, item);
  }
  return [...map.values()].sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')));
}

export async function pushDevocionais() {
  const headers = authHeaders();
  if (!headers) return false;
  const res = await fetch('/api/sync', {
    method: 'PUT',
    headers,
    body: JSON.stringify({ devotionals: getDevocionais() }),
  });
  if (res.status === 401) setSession(null);
  return res.ok;
}

export async function pullDevocionais() {
  const headers = authHeaders();
  if (!headers) return getDevocionais();
  const res = await fetch('/api/sync', { headers });
  if (res.status === 401) {
    setSession(null);
    return getDevocionais();
  }
  if (!res.ok) return getDevocionais();
  const data = await res.json().catch(() => ({}));
  const merged = mergeDevocionais(getDevocionais(), data.devotionals);
  writeJson(DEVOCIONAIS_KEY, merged);
  await pushDevocionais();
  return merged;
}

export async function enterAccount({ email, password, mode }) {
  const res = await fetch('/api/conta', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, mode }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, error: data.error || 'rede' };
  setSession({ token: data.token, email: data.email });
  await pullDevocionais();
  return { ok: true, email: data.email };
}

const OFFLINE_CACHE = 'biblia-offline-v1';
const OFFLINE_DEVO_AT = 'biblia-tanakh:offlineDevocionaisAt';
const OFFLINE_DEVO_COUNT = 'biblia-tanakh:offlineDevocionaisCount';

export function getOfflineDevocionais() {
  try {
    const at = localStorage.getItem(OFFLINE_DEVO_AT);
    const count = Number(localStorage.getItem(OFFLINE_DEVO_COUNT) || 0);
    return at ? { at, count } : null;
  } catch {
    return null;
  }
}

export async function saveDevocionaisOffline() {
  const list = getDevocionais();
  if (typeof caches !== 'undefined') {
    const box = await caches.open(OFFLINE_CACHE);
    await box.put(
      new Request('/offline/devocionais.json'),
      new Response(JSON.stringify(list), {
        headers: { 'Content-Type': 'application/json' },
      })
    );
  }
  try {
    localStorage.setItem(OFFLINE_DEVO_AT, new Date().toISOString());
    localStorage.setItem(OFFLINE_DEVO_COUNT, String(list.length));
  } catch {
    /* ignore quota */
  }
  return list.length;
}

export async function restoreDevocionaisIfNeeded() {
  let raw = null;
  try {
    raw = localStorage.getItem(DEVOCIONAIS_KEY);
  } catch {
    return;
  }
  if (raw || typeof caches === 'undefined') return;
  try {
    const box = await caches.open(OFFLINE_CACHE);
    const hit = await box.match('/offline/devocionais.json');
    if (!hit) return;
    const list = await hit.json();
    if (Array.isArray(list)) writeJson(DEVOCIONAIS_KEY, list);
  } catch {
    /* ignore */
  }
}

/** @returns {Devocional} */
export function createDevocional({ title = '', body = '', verseRefs = [], outline = null, map = null } = {}) {
  const now = new Date().toISOString();
  const item = {
    id: uid(),
    title: String(title || '').trim() || 'Sem título',
    body: String(body || ''),
    verseRefs: Array.isArray(verseRefs) ? verseRefs : [],
    outline: outline && typeof outline === 'object' ? outline : null,
    map: map && typeof map === 'object' ? map : null,
    createdAt: now,
    updatedAt: now,
  };
  const list = getDevocionais();
  list.unshift(item);
  saveDevocionais(list);
  return item;
}

/** @returns {Devocional | null} */
export function updateDevocional(id, patch) {
  const list = getDevocionais();
  const idx = list.findIndex((d) => d.id === id);
  if (idx < 0) return null;
  const prev = list[idx];
  const next = {
    ...prev,
    ...patch,
    id: prev.id,
    createdAt: prev.createdAt,
    updatedAt: new Date().toISOString(),
  };
  if (patch.title !== undefined) {
    next.title = String(patch.title || '').trim() || 'Sem título';
  }
  if (patch.body !== undefined) next.body = String(patch.body || '');
  if (patch.verseRefs !== undefined) {
    next.verseRefs = Array.isArray(patch.verseRefs) ? patch.verseRefs : [];
  }
  list[idx] = next;
  saveDevocionais(list);
  return next;
}

export function deleteDevocional(id) {
  const list = getDevocionais().filter((d) => d.id !== id);
  saveDevocionais(list);
  return list;
}

/** Associate a verse ref to a devotional (no duplicates by verse key). */
export function associateVerseToDevocional(devocionalId, verseRef) {
  const d = getDevocionalById(devocionalId);
  if (!d) return null;
  const key = verseKey(verseRef.bookId, verseRef.chapter, verseRef.verse);
  const refs = [...(d.verseRefs || [])];
  if (!refs.some((r) => verseKey(r.bookId, r.chapter, r.verse) === key)) {
    refs.push({
      bookId: verseRef.bookId,
      chapter: Number(verseRef.chapter),
      verse: Number(verseRef.verse),
      ref: verseRef.ref || '',
      snippet: verseRef.snippet || '',
    });
  }
  setMark(verseRef.bookId, verseRef.chapter, verseRef.verse, true);
  return updateDevocional(devocionalId, { verseRefs: refs });
}


/**
 * Union of highlighted marks + saved marks, ordered by Protestant Brazilian
 * canon (books array order), then chapter, then verse. Grouped by bookId.
 * @param {{ books: Array<{id:string,name:string}>, lookupSnippet?: (bookId:string,chapter:number,verse:number)=>string }} opts
 * @returns {Array<{ bookId: string, bookName: string, items: Array<{ id: string, bookId: string, chapter: number, verse: number, ref: string, snippet: string, markedAt?: string, savedAt?: string }> }>}
 */
export function listMarksGroupedByBook({ books, lookupSnippet } = {}) {
  const bookList = Array.isArray(books) ? books : [];
  const order = new Map(bookList.map((b, i) => [b.id, i]));
  const nameOf = new Map(bookList.map((b) => [b.id, b.name]));
  const saved = getSavedMarks();
  const savedById = Object.fromEntries(saved.map((m) => [m.id, m]));
  const marks = getMarks();
  const byId = {};

  for (const m of Object.values(marks)) {
    if (!m || !m.bookId) continue;
    const id = verseKey(m.bookId, m.chapter, m.verse);
    const s = savedById[id];
    let snippet = (s && s.snippet) || '';
    if (!snippet && typeof lookupSnippet === 'function') {
      try {
        snippet = lookupSnippet(m.bookId, Number(m.chapter), Number(m.verse)) || '';
      } catch {
        snippet = '';
      }
    }
    const bookName = nameOf.get(m.bookId) || m.bookId;
    byId[id] = {
      id,
      bookId: m.bookId,
      chapter: Number(m.chapter),
      verse: Number(m.verse),
      ref: (s && s.ref) || `${bookName} ${m.chapter}:${m.verse}`,
      snippet,
      markedAt: m.markedAt,
      savedAt: s?.savedAt,
    };
  }

  // Include saved entries missing from marks (should be rare)
  for (const s of saved) {
    if (!s || byId[s.id]) continue;
    const bookName = nameOf.get(s.bookId) || s.bookId;
    byId[s.id] = {
      id: s.id,
      bookId: s.bookId,
      chapter: Number(s.chapter),
      verse: Number(s.verse),
      ref: s.ref || `${bookName} ${s.chapter}:${s.verse}`,
      snippet: s.snippet || '',
      savedAt: s.savedAt,
    };
  }

  const items = Object.values(byId).sort((a, b) => {
    const oa = order.has(a.bookId) ? order.get(a.bookId) : 9999;
    const ob = order.has(b.bookId) ? order.get(b.bookId) : 9999;
    if (oa !== ob) return oa - ob;
    if (a.chapter !== b.chapter) return a.chapter - b.chapter;
    return a.verse - b.verse;
  });

  const groups = [];
  let current = null;
  for (const item of items) {
    if (!current || current.bookId !== item.bookId) {
      current = {
        bookId: item.bookId,
        bookName: nameOf.get(item.bookId) || item.bookId,
        items: [],
      };
      groups.push(current);
    }
    current.items.push(item);
  }
  return groups;
}

export function formatRelativeWhen(iso) {
  if (!iso) return '';
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return '';
  const diff = Date.now() - t;
  const day = 86400000;
  if (diff < day) return 'Hoje';
  if (diff < 2 * day) return 'Ontem';
  if (diff < 7 * day) return 'Esta semana';
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });
}
