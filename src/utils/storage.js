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
}

/** @returns {Devocional} */
export function createDevocional({ title = '', body = '', verseRefs = [] } = {}) {
  const now = new Date().toISOString();
  const item = {
    id: uid(),
    title: String(title || '').trim() || 'Sem título',
    body: String(body || ''),
    verseRefs: Array.isArray(verseRefs) ? verseRefs : [],
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
