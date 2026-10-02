import { applyTheme, getTheme, toggleTheme } from '../utils/storage.js';

const ICON_INSTALL = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v10"/><path d="m8 9 4 4 4-4"/><path d="M5 17.5V19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1.5"/></svg>`;

const ICON_SUN = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.1 5.1l1.6 1.6M17.3 17.3l1.6 1.6M18.9 5.1l-1.6 1.6M6.7 17.3l-1.6 1.6"/></svg>`;

const ICON_MOON = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4 7 7 0 1 0 20 14.5z"/></svg>`;

let deferredPrompt = null;
let wired = false;

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.navigator.standalone === true
  );
}

function isIos() {
  const ua = navigator.userAgent || '';
  const iOS = /iPad|iPhone|iPod/.test(ua);
  const iPadOs = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return iOS || iPadOs;
}

function installHelpText() {
  if (isIos()) {
    return 'No iPhone ou iPad: abra no Safari, toque em Compartilhar e escolha “Adicionar à Tela de Início”.';
  }
  const ua = navigator.userAgent || '';
  const mobile = /Android|Mobile/i.test(ua);
  if (mobile) {
    return 'No Chrome ou no navegador do celular: abra o menu (⋮) e toque em “Instalar app” ou “Adicionar à tela inicial”.';
  }
  return 'No computador (Chrome ou Edge): use o ícone de instalar na barra de endereço, ou o menu do navegador → “Instalar Bíblia Origens”.';
}

function syncInstallVisibility() {
  document.documentElement.classList.toggle('is-installed', isStandalone());
}

function syncThemeButton(btn) {
  if (!btn) return;
  const light = getTheme() === 'light';
  btn.innerHTML = light ? ICON_MOON : ICON_SUN;
  btn.setAttribute('aria-label', light ? 'Ativar modo escuro' : 'Ativar modo claro');
  btn.setAttribute('title', light ? 'Modo escuro' : 'Modo claro');
}

function ensureHelpSheet() {
  let sheet = document.getElementById('install-help');
  if (sheet) return sheet;
  sheet = document.createElement('div');
  sheet.id = 'install-help';
  sheet.className = 'sheet-backdrop';
  sheet.hidden = true;
  sheet.innerHTML = `
    <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="install-help-title">
      <div class="sheet__handle" aria-hidden="true"></div>
      <h3 class="sheet__title" id="install-help-title">Instalar o app</h3>
      <p class="install-help__text" data-install-help></p>
      <button type="button" class="sheet__cancel" data-install-close>Fechar</button>
    </div>`;
  document.body.appendChild(sheet);
  const close = () => {
    sheet.hidden = true;
  };
  sheet.querySelector('[data-install-close]')?.addEventListener('click', close);
  sheet.addEventListener('click', (e) => {
    if (e.target === sheet) close();
  });
  return sheet;
}

function showInstallHelp() {
  const sheet = ensureHelpSheet();
  const text = sheet.querySelector('[data-install-help]');
  if (text) text.textContent = installHelpText();
  sheet.hidden = false;
}

async function onInstallClick() {
  if (isStandalone()) return;
  if (deferredPrompt) {
    try {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
    } catch {
      showInstallHelp();
    }
    deferredPrompt = null;
    return;
  }
  showInstallHelp();
}

/** Install + theme controls, fixed at the top right of every screen. */
export function mountChrome(shell) {
  applyTheme();
  syncInstallVisibility();

  if (!shell.querySelector('#chrome-actions')) {
    const bar = document.createElement('div');
    bar.id = 'chrome-actions';
    bar.className = 'chrome-actions';
    bar.innerHTML = `
      <button type="button" class="chrome-btn chrome-btn--install" data-install aria-label="Instalar aplicativo" title="Instalar aplicativo">
        ${ICON_INSTALL}
      </button>
      <button type="button" class="chrome-btn" data-theme aria-label="Ativar modo claro" title="Modo claro">
        ${ICON_SUN}
      </button>`;
    shell.appendChild(bar);
  }

  const installBtn = shell.querySelector('[data-install]');
  const themeBtn = shell.querySelector('[data-theme]');
  syncThemeButton(themeBtn);

  if (wired) return;
  wired = true;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    syncInstallVisibility();
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    syncInstallVisibility();
  });

  installBtn?.addEventListener('click', () => {
    onInstallClick();
  });
  themeBtn?.addEventListener('click', () => {
    toggleTheme();
    syncThemeButton(themeBtn);
  });
}
