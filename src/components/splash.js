/**
 * Cold-start splash: once per browser/PWA session (sessionStorage).
 * Markup may already exist in index.html for instant paint; CSS/JS are
 * bundled so Workbox precaches them for offline.
 */

const STORAGE_KEY = 'tanakh-splash-seen';
const SLOGAN = 'Uma Palavra. Três formas de ler. Mais perto do original.\nPortuguês • Hebraico • Transliteração';

function prefersReducedMotion() {
  return (
    typeof matchMedia === 'function' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function alreadyShownThisSession() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function markShown() {
  try {
    sessionStorage.setItem(STORAGE_KEY, '1');
  } catch {
    /* private mode / blocked storage — still show once this load */
  }
}

function ensureSplash() {
  let el = document.getElementById('splash');
  if (el) return el;

  el = document.createElement('div');
  el.id = 'splash';
  el.className = 'splash';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-label', 'Bíblia Tanakh');
  el.innerHTML = `
    <div class="splash__inner">
      <span class="splash__mark" aria-hidden="true">✦</span>
      <p class="splash__title">Bíblia Tanakh</p>
      <p class="splash__slogan">${SLOGAN.split('\n').map((line) => `<span class="splash__slogan-line">${line}</span>`).join('')}</p>
    </div>
  `;
  document.body.appendChild(el);
  return el;
}

function removeSplash(el) {
  if (el && el.parentNode) el.remove();
}

/**
 * Show / animate the splash overlay (if needed), then remove.
 * Resolves when Home (or the current route) is revealed.
 * @returns {Promise<void>}
 */
export function runSplash() {
  const splash = ensureSplash();

  if (alreadyShownThisSession()) {
    removeSplash(splash);
    return Promise.resolve();
  }

  markShown();

  // Reset opacity from critical HTML paint, then run entrance animation.
  splash.classList.remove('splash--out', 'splash--play', 'splash--reduced');
  void splash.offsetWidth;

  const reduced = prefersReducedMotion();
  if (reduced) {
    splash.classList.add('splash--reduced');
  } else {
    splash.classList.add('splash--play');
  }

  const holdMs = reduced ? 450 : 2200;
  const fadeMs = reduced ? 200 : 420;

  return new Promise((resolve) => {
    window.setTimeout(() => {
      splash.classList.add('splash--out');
      window.setTimeout(() => {
        removeSplash(splash);
        resolve();
      }, fadeMs);
    }, holdMs);
  });
}

export { SLOGAN };
