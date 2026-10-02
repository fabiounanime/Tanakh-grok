/**
 * Pluggable Bible API client (stub).
 *
 * Licensed Portuguese editions (NVI, NVT, ARC current, etc.) must NOT be
 * scraped or embedded. Integrate a licensed provider behind env flags, e.g.:
 *
 *   VITE_BIBLE_API_ENABLED=true
 *   VITE_BIBLE_API_PROVIDER=api.bible   # or "dbp" (Digital Bible Platform)
 *   VITE_BIBLE_API_KEY=...             # never commit real keys
 *   VITE_BIBLE_API_BIBLE_NVI=<id>
 *   VITE_BIBLE_API_BIBLE_NVT=<id>
 *   VITE_BIBLE_API_BIBLE_ARC=<id>
 *
 * Preferred providers (documented; not implemented until keys exist):
 *   - api.Bible (https://scripture.api.bible/) — American Bible Society
 *   - Digital Bible Platform / Faith Comes By Hearing (https://4.dbt.io/)
 *
 * This module only reads Vite env at build time and reports readiness.
 * Fetch helpers are stubs that throw until a provider is wired.
 */

import { getPtVersionMeta } from '../data/versions.js';

const ENABLED = String(import.meta.env.VITE_BIBLE_API_ENABLED || '').toLowerCase() === 'true';
const PROVIDER = String(import.meta.env.VITE_BIBLE_API_PROVIDER || '').trim();
const API_KEY = String(import.meta.env.VITE_BIBLE_API_KEY || '').trim();

const BIBLE_ID_ENV = {
  nvi: 'VITE_BIBLE_API_BIBLE_NVI',
  nvt: 'VITE_BIBLE_API_BIBLE_NVT',
  arc: 'VITE_BIBLE_API_BIBLE_ARC',
};

function bibleIdFor(versionId) {
  const envName = BIBLE_ID_ENV[versionId];
  if (!envName) return '';
  const fromEnv = String(import.meta.env[envName] || '').trim();
  if (fromEnv) return fromEnv;
  const meta = getPtVersionMeta(versionId);
  return String(meta?.apiBibleId || '').trim();
}

/** True when API flag + key + provider are set (no network call). */
export function isBibleApiConfigured() {
  return Boolean(ENABLED && API_KEY && PROVIDER);
}

export function getBibleApiConfig() {
  return {
    enabled: ENABLED,
    provider: PROVIDER || null,
    hasKey: Boolean(API_KEY),
    configured: isBibleApiConfigured(),
  };
}

/**
 * A licensed catalog entry is selectable only when the API is configured
 * and a bible id is mapped for that version id.
 */
export function isApiVersionReady(version) {
  if (!version || version.source !== 'api') return false;
  if (!isBibleApiConfigured()) return false;
  return Boolean(bibleIdFor(version.id));
}

/**
 * Fetch chapter verses from the configured provider.
 * Stub: throws until a real provider adapter is implemented.
 * @returns {Promise<Array<{ verse: number, text: string }>>}
 */
export async function fetchApiChapter(_versionId, _bookId, _chapter) {
  if (!isBibleApiConfigured()) {
    throw new Error('Bible API not configured (set VITE_BIBLE_API_* env).');
  }
  throw new Error(
    `Bible API provider "${PROVIDER}" is not wired yet. See README — Licensed versions via API.`
  );
}
