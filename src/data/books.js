/**
 * Índice completo — ordem protestante brasileira comum (Almeida).
 * chapters = número de capítulos (placeholder; só Gênesis e João têm versículos de demo).
 */
export const books = [
  // —— Antigo Testamento ——
  { id: 'gen', name: 'Gênesis', shortName: 'Gn', testament: 'AT', chapters: 50 },
  { id: 'exo', name: 'Êxodo', shortName: 'Ex', testament: 'AT', chapters: 40 },
  { id: 'lev', name: 'Levítico', shortName: 'Lv', testament: 'AT', chapters: 27 },
  { id: 'num', name: 'Números', shortName: 'Nm', testament: 'AT', chapters: 36 },
  { id: 'deu', name: 'Deuteronômio', shortName: 'Dt', testament: 'AT', chapters: 34 },
  { id: 'jos', name: 'Josué', shortName: 'Js', testament: 'AT', chapters: 24 },
  { id: 'jdg', name: 'Juízes', shortName: 'Jz', testament: 'AT', chapters: 21 },
  { id: 'rut', name: 'Rute', shortName: 'Rt', testament: 'AT', chapters: 4 },
  { id: '1sa', name: '1 Samuel', shortName: '1Sm', testament: 'AT', chapters: 31 },
  { id: '2sa', name: '2 Samuel', shortName: '2Sm', testament: 'AT', chapters: 24 },
  { id: '1ki', name: '1 Reis', shortName: '1Rs', testament: 'AT', chapters: 22 },
  { id: '2ki', name: '2 Reis', shortName: '2Rs', testament: 'AT', chapters: 25 },
  { id: '1ch', name: '1 Crônicas', shortName: '1Cr', testament: 'AT', chapters: 29 },
  { id: '2ch', name: '2 Crônicas', shortName: '2Cr', testament: 'AT', chapters: 36 },
  { id: 'ezr', name: 'Esdras', shortName: 'Ed', testament: 'AT', chapters: 10 },
  { id: 'neh', name: 'Neemias', shortName: 'Ne', testament: 'AT', chapters: 13 },
  { id: 'est', name: 'Ester', shortName: 'Et', testament: 'AT', chapters: 10 },
  { id: 'job', name: 'Jó', shortName: 'Jó', testament: 'AT', chapters: 42 },
  { id: 'psa', name: 'Salmos', shortName: 'Sl', testament: 'AT', chapters: 150 },
  { id: 'pro', name: 'Provérbios', shortName: 'Pv', testament: 'AT', chapters: 31 },
  { id: 'ecc', name: 'Eclesiastes', shortName: 'Ec', testament: 'AT', chapters: 12 },
  { id: 'sng', name: 'Cânticos', shortName: 'Ct', testament: 'AT', chapters: 8 },
  { id: 'isa', name: 'Isaías', shortName: 'Is', testament: 'AT', chapters: 66 },
  { id: 'jer', name: 'Jeremias', shortName: 'Jr', testament: 'AT', chapters: 52 },
  { id: 'lam', name: 'Lamentações', shortName: 'Lm', testament: 'AT', chapters: 5 },
  { id: 'ezk', name: 'Ezequiel', shortName: 'Ez', testament: 'AT', chapters: 48 },
  { id: 'dan', name: 'Daniel', shortName: 'Dn', testament: 'AT', chapters: 12 },
  { id: 'hos', name: 'Oséias', shortName: 'Os', testament: 'AT', chapters: 14 },
  { id: 'jol', name: 'Joel', shortName: 'Jl', testament: 'AT', chapters: 3 },
  { id: 'amo', name: 'Amós', shortName: 'Am', testament: 'AT', chapters: 9 },
  { id: 'oba', name: 'Obadias', shortName: 'Ob', testament: 'AT', chapters: 1 },
  { id: 'jon', name: 'Jonas', shortName: 'Jn', testament: 'AT', chapters: 4 },
  { id: 'mic', name: 'Miquéias', shortName: 'Mq', testament: 'AT', chapters: 7 },
  { id: 'nam', name: 'Naum', shortName: 'Na', testament: 'AT', chapters: 3 },
  { id: 'hab', name: 'Habacuque', shortName: 'Hc', testament: 'AT', chapters: 3 },
  { id: 'zep', name: 'Sofonias', shortName: 'Sf', testament: 'AT', chapters: 3 },
  { id: 'hag', name: 'Ageu', shortName: 'Ag', testament: 'AT', chapters: 2 },
  { id: 'zec', name: 'Zacarias', shortName: 'Zc', testament: 'AT', chapters: 14 },
  { id: 'mal', name: 'Malaquias', shortName: 'Ml', testament: 'AT', chapters: 4 },
  // —— Novo Testamento ——
  { id: 'mat', name: 'Mateus', shortName: 'Mt', testament: 'NT', chapters: 28 },
  { id: 'mrk', name: 'Marcos', shortName: 'Mc', testament: 'NT', chapters: 16 },
  { id: 'luk', name: 'Lucas', shortName: 'Lc', testament: 'NT', chapters: 24 },
  { id: 'jhn', name: 'João', shortName: 'Jo', testament: 'NT', chapters: 21 },
  { id: 'act', name: 'Atos', shortName: 'At', testament: 'NT', chapters: 28 },
  { id: 'rom', name: 'Romanos', shortName: 'Rm', testament: 'NT', chapters: 16 },
  { id: '1co', name: '1 Coríntios', shortName: '1Co', testament: 'NT', chapters: 16 },
  { id: '2co', name: '2 Coríntios', shortName: '2Co', testament: 'NT', chapters: 13 },
  { id: 'gal', name: 'Gálatas', shortName: 'Gl', testament: 'NT', chapters: 6 },
  { id: 'eph', name: 'Efésios', shortName: 'Ef', testament: 'NT', chapters: 6 },
  { id: 'php', name: 'Filipenses', shortName: 'Fp', testament: 'NT', chapters: 4 },
  { id: 'col', name: 'Colossenses', shortName: 'Cl', testament: 'NT', chapters: 4 },
  { id: '1th', name: '1 Tessalonicenses', shortName: '1Ts', testament: 'NT', chapters: 5 },
  { id: '2th', name: '2 Tessalonicenses', shortName: '2Ts', testament: 'NT', chapters: 3 },
  { id: '1ti', name: '1 Timóteo', shortName: '1Tm', testament: 'NT', chapters: 6 },
  { id: '2ti', name: '2 Timóteo', shortName: '2Tm', testament: 'NT', chapters: 4 },
  { id: 'tit', name: 'Tito', shortName: 'Tt', testament: 'NT', chapters: 3 },
  { id: 'phm', name: 'Filemom', shortName: 'Fm', testament: 'NT', chapters: 1 },
  { id: 'heb', name: 'Hebreus', shortName: 'Hb', testament: 'NT', chapters: 13 },
  { id: 'jas', name: 'Tiago', shortName: 'Tg', testament: 'NT', chapters: 5 },
  { id: '1pe', name: '1 Pedro', shortName: '1Pe', testament: 'NT', chapters: 5 },
  { id: '2pe', name: '2 Pedro', shortName: '2Pe', testament: 'NT', chapters: 3 },
  { id: '1jn', name: '1 João', shortName: '1Jo', testament: 'NT', chapters: 5 },
  { id: '2jn', name: '2 João', shortName: '2Jo', testament: 'NT', chapters: 1 },
  { id: '3jn', name: '3 João', shortName: '3Jo', testament: 'NT', chapters: 1 },
  { id: 'jud', name: 'Judas', shortName: 'Jd', testament: 'NT', chapters: 1 },
  { id: 'rev', name: 'Apocalipse', shortName: 'Ap', testament: 'NT', chapters: 22 },
];

export function getBookById(id) {
  return books.find((b) => b.id === id) ?? null;
}

export function getBooksByTestament(testament) {
  return books.filter((b) => b.testament === testament);
}
