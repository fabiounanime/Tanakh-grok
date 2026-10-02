/**
 * Cold-start splash: once per browser/PWA session (sessionStorage).
 * Markup may already exist in index.html for instant paint; CSS/JS are
 * bundled so Workbox precaches them for offline.
 */

const STORAGE_KEY = 'tanakh-splash-seen';
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
  el.setAttribute('aria-label', 'Bíblia Origens');
  el.innerHTML = `
    <div class="splash__inner">
      <div class="splash__spinner" role="status" aria-label="Carregando">
        <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
          <circle class="splash__spinner-track" cx="24" cy="24" r="18" />
          <circle class="splash__spinner-arc" cx="24" cy="24" r="18" />
        </svg>
      </div>
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

  // Keep the full, non-reduced splash close to three seconds: enough time
  // for the mark, name, slogan, and loader to read without feeling stalled.
  const holdMs = reduced ? 450 : 2550;
  const fadeMs = reduced ? 200 : 450;

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
