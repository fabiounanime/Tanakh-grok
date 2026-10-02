/**
 * Índice completo — ordem protestante brasileira comum (Almeida).
 * chapters = número de capítulos (ordem protestante BR). Original+transliteração: todos os 66; português: ver README / index.json.
 */
export const books = [
  // —— Antigo Testamento ——
  { id: 'gen', name: 'Gênesis', shortName: 'Gn', testament: 'AT', chapters: 50, originalLang: 'he' },
  { id: 'exo', name: 'Êxodo', shortName: 'Ex', testament: 'AT', chapters: 40, originalLang: 'he' },
  { id: 'lev', name: 'Levítico', shortName: 'Lv', testament: 'AT', chapters: 27, originalLang: 'he' },
  { id: 'num', name: 'Números', shortName: 'Nm', testament: 'AT', chapters: 36, originalLang: 'he' },
  { id: 'deu', name: 'Deuteronômio', shortName: 'Dt', testament: 'AT', chapters: 34, originalLang: 'he' },
  { id: 'jos', name: 'Josué', shortName: 'Js', testament: 'AT', chapters: 24, originalLang: 'he' },
  { id: 'jdg', name: 'Juízes', shortName: 'Jz', testament: 'AT', chapters: 21, originalLang: 'he' },
  { id: 'rut', name: 'Rute', shortName: 'Rt', testament: 'AT', chapters: 4, originalLang: 'he' },
  { id: '1sa', name: '1 Samuel', shortName: '1Sm', testament: 'AT', chapters: 31, originalLang: 'he' },
  { id: '2sa', name: '2 Samuel', shortName: '2Sm', testament: 'AT', chapters: 24, originalLang: 'he' },
  { id: '1ki', name: '1 Reis', shortName: '1Rs', testament: 'AT', chapters: 22, originalLang: 'he' },
  { id: '2ki', name: '2 Reis', shortName: '2Rs', testament: 'AT', chapters: 25, originalLang: 'he' },
  { id: '1ch', name: '1 Crônicas', shortName: '1Cr', testament: 'AT', chapters: 29, originalLang: 'he' },
  { id: '2ch', name: '2 Crônicas', shortName: '2Cr', testament: 'AT', chapters: 36, originalLang: 'he' },
  { id: 'ezr', name: 'Esdras', shortName: 'Ed', testament: 'AT', chapters: 10, originalLang: 'he' },
  { id: 'neh', name: 'Neemias', shortName: 'Ne', testament: 'AT', chapters: 13, originalLang: 'he' },
  { id: 'est', name: 'Ester', shortName: 'Et', testament: 'AT', chapters: 10, originalLang: 'he' },
  { id: 'job', name: 'Jó', shortName: 'Jó', testament: 'AT', chapters: 42, originalLang: 'he' },
  { id: 'psa', name: 'Salmos', shortName: 'Sl', testament: 'AT', chapters: 150, originalLang: 'he' },
  { id: 'pro', name: 'Provérbios', shortName: 'Pv', testament: 'AT', chapters: 31, originalLang: 'he' },
  { id: 'ecc', name: 'Eclesiastes', shortName: 'Ec', testament: 'AT', chapters: 12, originalLang: 'he' },
  { id: 'sng', name: 'Cânticos', shortName: 'Ct', testament: 'AT', chapters: 8, originalLang: 'he' },
  { id: 'isa', name: 'Isaías', shortName: 'Is', testament: 'AT', chapters: 66, originalLang: 'he' },
  { id: 'jer', name: 'Jeremias', shortName: 'Jr', testament: 'AT', chapters: 52, originalLang: 'he' },
  { id: 'lam', name: 'Lamentações', shortName: 'Lm', testament: 'AT', chapters: 5, originalLang: 'he' },
  { id: 'ezk', name: 'Ezequiel', shortName: 'Ez', testament: 'AT', chapters: 48, originalLang: 'he' },
  { id: 'dan', name: 'Daniel', shortName: 'Dn', testament: 'AT', chapters: 12, originalLang: 'he' },
  { id: 'hos', name: 'Oséias', shortName: 'Os', testament: 'AT', chapters: 14, originalLang: 'he' },
  { id: 'jol', name: 'Joel', shortName: 'Jl', testament: 'AT', chapters: 3, originalLang: 'he' },
  { id: 'amo', name: 'Amós', shortName: 'Am', testament: 'AT', chapters: 9, originalLang: 'he' },
  { id: 'oba', name: 'Obadias', shortName: 'Ob', testament: 'AT', chapters: 1, originalLang: 'he' },
  { id: 'jon', name: 'Jonas', shortName: 'Jn', testament: 'AT', chapters: 4, originalLang: 'he' },
  { id: 'mic', name: 'Miquéias', shortName: 'Mq', testament: 'AT', chapters: 7, originalLang: 'he' },
  { id: 'nam', name: 'Naum', shortName: 'Na', testament: 'AT', chapters: 3, originalLang: 'he' },
  { id: 'hab', name: 'Habacuque', shortName: 'Hc', testament: 'AT', chapters: 3, originalLang: 'he' },
  { id: 'zep', name: 'Sofonias', shortName: 'Sf', testament: 'AT', chapters: 3, originalLang: 'he' },
  { id: 'hag', name: 'Ageu', shortName: 'Ag', testament: 'AT', chapters: 2, originalLang: 'he' },
  { id: 'zec', name: 'Zacarias', shortName: 'Zc', testament: 'AT', chapters: 14, originalLang: 'he' },
  { id: 'mal', name: 'Malaquias', shortName: 'Ml', testament: 'AT', chapters: 4, originalLang: 'he' },
  // —— Novo Testamento ——
  { id: 'mat', name: 'Mateus', shortName: 'Mt', testament: 'NT', chapters: 28, originalLang: 'el' },
  { id: 'mrk', name: 'Marcos', shortName: 'Mc', testament: 'NT', chapters: 16, originalLang: 'el' },
  { id: 'luk', name: 'Lucas', shortName: 'Lc', testament: 'NT', chapters: 24, originalLang: 'el' },
  { id: 'jhn', name: 'João', shortName: 'Jo', testament: 'NT', chapters: 21, originalLang: 'el' },
  { id: 'act', name: 'Atos', shortName: 'At', testament: 'NT', chapters: 28, originalLang: 'el' },
  { id: 'rom', name: 'Romanos', shortName: 'Rm', testament: 'NT', chapters: 16, originalLang: 'el' },
  { id: '1co', name: '1 Coríntios', shortName: '1Co', testament: 'NT', chapters: 16, originalLang: 'el' },
  { id: '2co', name: '2 Coríntios', shortName: '2Co', testament: 'NT', chapters: 13, originalLang: 'el' },
  { id: 'gal', name: 'Gálatas', shortName: 'Gl', testament: 'NT', chapters: 6, originalLang: 'el' },
  { id: 'eph', name: 'Efésios', shortName: 'Ef', testament: 'NT', chapters: 6, originalLang: 'el' },
  { id: 'php', name: 'Filipenses', shortName: 'Fp', testament: 'NT', chapters: 4, originalLang: 'el' },
  { id: 'col', name: 'Colossenses', shortName: 'Cl', testament: 'NT', chapters: 4, originalLang: 'el' },
  { id: '1th', name: '1 Tessalonicenses', shortName: '1Ts', testament: 'NT', chapters: 5, originalLang: 'el' },
  { id: '2th', name: '2 Tessalonicenses', shortName: '2Ts', testament: 'NT', chapters: 3, originalLang: 'el' },
  { id: '1ti', name: '1 Timóteo', shortName: '1Tm', testament: 'NT', chapters: 6, originalLang: 'el' },
  { id: '2ti', name: '2 Timóteo', shortName: '2Tm', testament: 'NT', chapters: 4, originalLang: 'el' },
  { id: 'tit', name: 'Tito', shortName: 'Tt', testament: 'NT', chapters: 3, originalLang: 'el' },
  { id: 'phm', name: 'Filemom', shortName: 'Fm', testament: 'NT', chapters: 1, originalLang: 'el' },
  { id: 'heb', name: 'Hebreus', shortName: 'Hb', testament: 'NT', chapters: 13, originalLang: 'el' },
  { id: 'jas', name: 'Tiago', shortName: 'Tg', testament: 'NT', chapters: 5, originalLang: 'el' },
  { id: '1pe', name: '1 Pedro', shortName: '1Pe', testament: 'NT', chapters: 5, originalLang: 'el' },
  { id: '2pe', name: '2 Pedro', shortName: '2Pe', testament: 'NT', chapters: 3, originalLang: 'el' },
  { id: '1jn', name: '1 João', shortName: '1Jo', testament: 'NT', chapters: 5, originalLang: 'el' },
  { id: '2jn', name: '2 João', shortName: '2Jo', testament: 'NT', chapters: 1, originalLang: 'el' },
  { id: '3jn', name: '3 João', shortName: '3Jo', testament: 'NT', chapters: 1, originalLang: 'el' },
  { id: 'jud', name: 'Judas', shortName: 'Jd', testament: 'NT', chapters: 1, originalLang: 'el' },
  { id: 'rev', name: 'Apocalipse', shortName: 'Ap', testament: 'NT', chapters: 22, originalLang: 'el' },
];

export function getBookById(id) {
  return books.find((b) => b.id === id) ?? null;
}

export function getBooksByTestament(testament) {
  return books.filter((b) => b.testament === testament);
}

/**
 * Map app book ids → ABíbliaDigital Portuguese abbreviations
 * (GET /verses/{version}/{abbrev}/{chapter}).
 * @see https://www.abibliadigital.com.br/api
 */
const ABIBLIA_ABBREV = {
  gen: 'gn',
  exo: 'ex',
  lev: 'lv',
  num: 'nm',
  deu: 'dt',
  jos: 'js',
  jdg: 'jz',
  rut: 'rt',
  '1sa': '1sm',
  '2sa': '2sm',
  '1ki': '1rs',
  '2ki': '2rs',
  '1ch': '1cr',
  '2ch': '2cr',
  ezr: 'ed',
  neh: 'ne',
  est: 'et',
  job: 'jó',
  psa: 'sl',
  pro: 'pv',
  ecc: 'ec',
  sng: 'ct',
  isa: 'is',
  jer: 'jr',
  lam: 'lm',
  ezk: 'ez',
  dan: 'dn',
  hos: 'os',
  jol: 'jl',
  amo: 'am',
  oba: 'ob',
  jon: 'jn',
  mic: 'mq',
  nam: 'na',
  hab: 'hc',
  zep: 'sf',
  hag: 'ag',
  zec: 'zc',
  mal: 'ml',
  mat: 'mt',
  mrk: 'mc',
  luk: 'lc',
  jhn: 'jo',
  act: 'at',
  rom: 'rm',
  '1co': '1co',
  '2co': '2co',
  gal: 'gl',
  eph: 'ef',
  php: 'fp',
  col: 'cl',
  '1th': '1ts',
  '2th': '2ts',
  '1ti': '1tm',
  '2ti': '2tm',
  tit: 'tt',
  phm: 'fm',
  heb: 'hb',
  jas: 'tg',
  '1pe': '1pe',
  '2pe': '2pe',
  '1jn': '1jo',
  '2jn': '2jo',
  '3jn': '3jo',
  jud: 'jd',
  rev: 'ap',
};

/** @returns {string|null} ABíbliaDigital pt abbrev, or null if unknown */
export function toAbibliaAbbrev(bookId) {
  const id = String(bookId || '').trim().toLowerCase();
  return ABIBLIA_ABBREV[id] || null;
}

/** Default original-language code for a book (chapter may override for Dan/Ezra). */
export function getBookOriginalLang(bookId) {
  const b = getBookById(bookId);
  if (!b) return 'he';
  return b.originalLang || (b.testament === 'NT' ? 'el' : 'he');
}
