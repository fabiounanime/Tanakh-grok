/**
 * Cold-start splash: once per browser/PWA session (sessionStorage).
 * Markup may already exist in index.html for instant paint; CSS/JS are
 * bundled so Workbox precaches them for offline.
 */

const STORAGE_KEY = 'tanakh-splash-seen';
const SLOGAN = 'Sua fé, direto da fonte';
const SPLASH_DURATION_MS = 6000;

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

function prepareSlogan(el) {
  const slogan = el?.querySelector('.splash__slogan');
  const visual = slogan?.querySelector('.splash__slogan-text');
  if (!slogan || !visual || visual.dataset.lettersReady === '1') return;

  visual.dataset.lettersReady = '1';
  visual.textContent = '';
  Array.from(SLOGAN).forEach((character, index) => {
    const letter = document.createElement('span');
    letter.className = 'splash__slogan-char';
    letter.setAttribute('aria-hidden', 'true');
    letter.style.setProperty('--letter-delay', `${1.05 + index * 0.045}s`);
    letter.textContent = character;
    visual.appendChild(letter);
  });
}

function ensureSplash() {
  let el = document.getElementById('splash');
  if (el) {
    prepareSlogan(el);
    return el;
  }

  el = document.createElement('div');
  el.id = 'splash';
  el.className = 'splash';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-label', 'Bíblia Origens');
  el.innerHTML = `
    <div class="splash__inner">
      <img class="splash__art" src="/splash.jpg" alt="" width="2816" height="1536" fetchpriority="high" decoding="async" />
      <div class="splash__content">
        <p class="splash__slogan" aria-label="${SLOGAN}">
          <span class="splash__slogan-text" aria-hidden="true">${SLOGAN}</span>
        </p>
      </div>
      <div class="splash__spinner" role="status" aria-label="Carregando">
        <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
          <circle class="splash__spinner-track" cx="24" cy="24" r="18" />
          <circle class="splash__spinner-arc" cx="24" cy="24" r="18" />
        </svg>
      </div>
    </div>
  `;
  document.body.appendChild(el);
  prepareSlogan(el);
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

  // Hold long enough for the full art and letter reveal to be read, then fade.
  const fadeMs = reduced ? 200 : 500;
  const holdMs = reduced ? 500 : SPLASH_DURATION_MS - fadeMs;

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
