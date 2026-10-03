/**
 * Portuguese source for the reader: the app's own direct rendering.
 * No commercial edition is catalogued or fetched.
 */

/** @typedef {'local'} PtVersionSource */
/**
 * @typedef {object} PtVersion
 * @property {string} id
 * @property {string} label
 * @property {string} shortLabel
 * @property {'demo'} license
 * @property {PtVersionSource} source
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
    note: 'Tradução direta do hebraico/aramaico/grego, embarcada no app',
  },
];

export const FIXED_PT_VERSION = 'demo';
export const DEFAULT_PT_VERSION = FIXED_PT_VERSION;

export function listPtVersions() {
  return PT_VERSIONS.map((v) => ({ ...v, available: true, statusNote: v.note }));
}

export function getPtVersionMeta(id) {
  return PT_VERSIONS.find((v) => v.id === id) || PT_VERSIONS[0];
}

export function isLocallyAvailablePtVersion(id) {
  return getPtVersionMeta(id)?.source === 'local';
}

/** No external edition is stored. */
export function lookupPtVersionText() {
  return null;
}
