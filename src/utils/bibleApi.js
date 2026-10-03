/**
 * External Bible editions are not used.
 * Portuguese comes only from the local direct rendering.
 */

export function isApiVersionReady() {
  return false;
}

export async function fetchApiChapter() {
  throw new Error('Versões externas não estão disponíveis neste app.');
}
