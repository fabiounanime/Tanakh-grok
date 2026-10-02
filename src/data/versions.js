/**
 * Portuguese Bible version catalog.
 *
 * Active PT source for the reader: local `demo` — the app’s own direct
 * Portuguese rendering shipped in verses.js (pairs with Hebrew/Greek + translit).
 * No commercial edition name; banner: “Português · tradução do original”.
 *
 * Other catalog entries (Almeida / ACF / RA / NVI / licensed APIs) are dormant
 * and are NOT wired to the Português tab. HelioGiroto/Biblia-ARC MIT covers
 * software only — we never bundle ACF text.
 */

/** @typedef {'local'|'bible-api'|'abiblia-digital'|'api'} PtVersionSource */
/**
 * @typedef {object} PtVersion
 * @property {string} id
 * @property {string} label
 * @property {string} shortLabel
 * @property {'demo'|'public-domain'|'api-fetch'|'licensed'} license
 * @property {PtVersionSource} source  local | bible-api.com | ABíbliaDigital | licensed API
 * @property {string} [apiTranslation]  bible-api.com translation id (e.g. almeida)
 * @property {string} [abibliaVersion]  ABíbliaDigital version id (acf, ra, nvi)
 * @property {string} [apiBibleId]  provider bible id when source==='api'
 * @property {string} note
 */

/** @type {PtVersion[]} */
export const PT_VERSIONS = [
  {
    id: 'demo',
    label: 'tradução do original',
    shortLabel: 'Original',
    license: 'demo',
    source: 'local',
    note: 'Tradução direta do hebraico/aramaico/grego · embarcada no app',
  },
  {
    id: 'almeida1911',
    label: 'Almeida 1911 (local)',
    shortLabel: 'A1911',
    license: 'public-domain',
    source: 'local',
    note: 'Domínio público · Lisboa 1911 · PG 62383 (Gênesis 1)',
  },
  {
    id: 'almeida',
    label: 'João Ferreira de Almeida',
    shortLabel: 'Alm',
    license: 'public-domain',
    source: 'bible-api',
    apiTranslation: 'almeida',
    note: 'via bible-api.com · domínio público (sem chave)',
  },
  {
    id: 'acf',
    label: 'ACF (Almeida Corrigida Fiel)',
    shortLabel: 'ACF',
    license: 'api-fetch',
    source: 'abiblia-digital',
    abibliaVersion: 'acf',
    note: 'via ABíbliaDigital · GET /verses/acf/… (sem scraping; token opcional)',
  },
  {
    id: 'ra',
    label: 'RA (Almeida Revista e Atualizada)',
    shortLabel: 'RA',
    license: 'api-fetch',
    source: 'abiblia-digital',
    abibliaVersion: 'ra',
    note: 'via ABíbliaDigital · GET /verses/ra/… (sem scraping; token opcional)',
  },
  {
    id: 'nvi',
    label: 'NVI',
    shortLabel: 'NVI',
    license: 'api-fetch',
    source: 'abiblia-digital',
    abibliaVersion: 'nvi',
    note: 'via ABíbliaDigital · GET /verses/nvi/… (listada na API; token opcional)',
  },
  {
    id: 'nvt',
    label: 'NVT',
    shortLabel: 'NVT',
    license: 'licensed',
    source: 'api',
    apiBibleId: '',
    note: 'Requer licença / API',
  },
  {
    id: 'arc',
    label: 'ARC (ed. atual)',
    shortLabel: 'ARC',
    license: 'licensed',
    source: 'api',
    apiBibleId: '',
    note: 'Requer licença / API (texto moderno; não embarcado)',
  },
];

/**
 * Fixed PT source: local original Portuguese (verses.js `portuguese` column).
 * No version picker; no Almeida / ACF / RA / NVI APIs on the Português tab.
 */
export const FIXED_PT_VERSION = 'demo';
export const DEFAULT_PT_VERSION = FIXED_PT_VERSION;

/**
 * Runtime availability: local versions always on; API versions only when
 * the Bible API client reports configured + a mapped bible id.
 * @param {(version: PtVersion) => boolean} [apiReady]
 */
export function listPtVersions(apiReady) {
  return PT_VERSIONS.map((v) => {
    if (v.source === 'local') {
      return { ...v, available: true, statusNote: v.note };
    }
    if (v.source === 'bible-api' || v.source === 'abiblia-digital') {
      return { ...v, available: true, statusNote: v.note };
    }
    const ready = typeof apiReady === 'function' ? apiReady(v) : false;
    return {
      ...v,
      available: Boolean(ready),
      statusNote: ready
        ? 'Via API (licença configurada)'
        : 'Requer licença / API',
    };
  });
}

export function getPtVersionMeta(id) {
  return PT_VERSIONS.find((v) => v.id === id) || PT_VERSIONS[0];
}

/** Local / currently selectable without API. */
export function isLocallyAvailablePtVersion(id) {
  const v = getPtVersionMeta(id);
  return v?.source === 'local';
}

/**
 * Almeida Revista e Corrigida, Lisboa 1911 — Gênesis 1.
 * Source: Project Gutenberg ebook 62383 (public domain in the US).
 * Orthography preserved from the 1911 edition.
 */
export const ALMEIDA_1911 = {
  gen: {
    1: {
      1: 'No principio creou Deus os céus e a terra.',
      2: 'E a terra era sem fórma e vasia; e havia trevas sobre a face do abysmo: e o Espirito de Deus se movia sobre a face das aguas.',
      3: 'E disse Deus: Haja luz: e houve luz.',
      4: 'E viu Deus que era boa a luz: e fez Deus separação entre a luz e as trevas.',
      5: 'E Deus chamou á luz Dia; e ás trevas chamou Noite. E foi a tarde e a manhã, o dia primeiro.',
      6: 'E disse Deus: Haja uma expansão no meio das aguas, e haja separação entre aguas e aguas.',
      7: 'E fez Deus a expansão, e fez separação entre as aguas que estavam debaixo da expansão e as aguas que estavam sobre a expansão: e assim foi.',
      8: 'E chamou Deus á expansão Céus, e foi a tarde e a manhã o dia segundo.',
      9: 'E disse Deus: Ajuntem-se as aguas debaixo dos céus n’um logar; e appareça a porção secca: e assim foi.',
      10: 'E chamou Deus á porção secca Terra; e ao ajuntamento das aguas chamou Mares: e viu Deus que era bom.',
      11: 'Disse Deus: Produza a terra herva verde, herva que dê semente, arvore fructifera que dê fructo segundo a sua especie, cuja semente está n’ella sobre a terra: e assim foi.',
      12: 'E a terra produziu herva, herva dando semente conforme a sua especie, e a arvore fructifera, cuja semente está n’ella conforme a sua especie: e viu Deus que era bom.',
      13: 'E foi a tarde, e a manhã, o dia terceiro.',
      14: 'E disse Deus: Haja luminares na expansão dos céus, para haver separação entre o dia e a noite; e sejam elles para signaes e para tempos determinados e para dias e annos.',
      15: 'E sejam para luminares na expansão dos céus, para allumiar a terra: e assim foi.',
      16: 'E fez Deus os dois grandes luminares: o luminar maior para governar o dia, e o luminar menor para governar a noite; e as estrellas.',
      17: 'E Deus os poz na expansão dos céus para allumiar a terra,',
      18: 'E para governar o dia e a noite, e para fazer separação entre a luz e as trevas: e viu Deus que era bom.',
      19: 'E foi a tarde, e a manhã, o dia quarto.',
      20: 'E disse Deus: Produzam as aguas abundantemente reptis de alma vivente; e vôem as aves sobre a face da expansão dos céus.',
      21: 'E Deus creou as grandes balêas, e todo o reptil de alma vivente que as aguas abundantemente produziram conforme as suas especies; e toda a ave de azas conforme a sua especie: e viu Deus que era bom.',
      22: 'E Deus as abençoou, dizendo: Fructificae e multiplicae-vos, e enchei as aguas nos mares; e as aves se multipliquem na terra.',
      23: 'E foi a tarde, e a manhã, o dia quinto.',
      24: 'E disse Deus: Produza a terra alma vivente conforme a sua especie; gado e reptis, e bestas feras da terra conforme a sua especie: e assim foi.',
      25: 'E fez Deus as bestas feras da terra conforme a sua especie, e o gado conforme a sua especie, e todo o reptil da terra conforme a sua especie: e viu Deus que era bom.',
      26: 'E disse Deus: Façamos o homem á nossa imagem, conforme á nossa similhança: e domine sobre os peixes do mar, e sobre as aves dos céus, e sobre o gado, e sobre toda a terra, e sobre todo o reptil que se move sobre a terra.',
      27: 'E creou Deus o homem á sua imagem: á imagem de Deus o creou: macho e femea os creou.',
      28: 'E Deus os abençoou, e Deus lhes disse: Fructificae e multiplicae-vos, e enchei a terra, e sujeitae-a: e dominae sobre os peixes do mar, e sobre as aves dos céus, e sobre todo o animal que se move sobre a terra.',
      29: 'E disse Deus: Eis que vos tenho dado toda a herva que dá semente, que está sobre a face de toda a terra; e toda a arvore, em que ha fructo de arvore que dá semente, ser-vos-ha para mantimento.',
      30: 'E todo o animal da terra, e toda a ave dos céus, e todo o reptil da terra, em que ha alma vivente; toda a herva verde será para mantimento: e assim foi.',
      31: 'E viu Deus tudo quanto tinha feito, e eis que era muito bom: e foi a tarde, e a manhã, o dia sexto.',
    },
  },
};

/**
 * Look up Portuguese text for a shipped local version.
 * @returns {string|null} null if this version has no local text for the verse
 */
export function lookupPtVersionText(versionId, bookId, chapter, verse) {
  if (versionId === 'demo') return null; // caller uses verse.portuguese
  if (versionId === 'almeida1911') {
    const t = ALMEIDA_1911[bookId]?.[chapter]?.[verse];
    return typeof t === 'string' ? t : null;
  }
  return null;
}
