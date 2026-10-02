import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-400-italic.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import '@fontsource/noto-sans-hebrew/hebrew-400.css';
import '@fontsource/noto-sans-hebrew/hebrew-500.css';
import '@fontsource/noto-serif/greek-400.css';
import '@fontsource/noto-serif/greek-600.css';
import '@fontsource/noto-serif/latin-400.css';
import '@fontsource/noto-serif/latin-400-italic.css';
import '@fontsource/noto-serif/latin-600.css';
import './styles/main.css';
import { startRouter, onRouteChange, parseHash, routes } from './utils/router.js';
import { registerSW } from 'virtual:pwa-register';
import { runSplash } from './components/splash.js';
import { renderHome } from './pages/home.js';
import { renderBiblia } from './pages/biblia.js';
import { renderBook } from './pages/book.js';
import { renderReading } from './pages/reading.js';
import { renderFavorites } from './pages/favorites.js';
import { renderSettings } from './pages/settings.js';
import { renderPlaceholder } from './pages/placeholder.js';
import { renderDevocionais, renderDevocionalEdit } from './pages/devocionais.js';
import { applyFontScale } from './utils/storage.js';

const app = document.getElementById('app');

registerSW({ immediate: true });

applyFontScale();

const ICO = {
  biblia: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 5c4-2 8-2 8 0v14c0-2 4-2 8 0V5c-4-2-8-2-8 0"/><path d="M12 5v14"/></svg>`,
  devocionais: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 4h9a2 2 0 0 1 2 2v14l-5-3-5 3V6a2 2 0 0 1 2-2z"/><path d="M9 8h5M9 11h5"/></svg>`,
  home: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5z"/></svg>`,
  marcacoes: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M7 4h10a1 1 0 0 1 1 1v15l-6-3.5L6 20V5a1 1 0 0 1 1-1z"/><path d="M9 8h6M9 11h4"/></svg>`,
  conta: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="8" r="3.5"/><path d="M5 19c1.5-3.5 4-5 7-5s5.5 1.5 7 5"/></svg>`,
};

function ensureShell() {
  if (document.getElementById('page-root')) return;
  app.classList.add('app-shell');
  app.innerHTML = `
    <div id="page-root" class="page-root"></div>
    <nav class="bottom-nav" aria-label="Navegação principal">
      <a href="${routes.biblia()}" data-nav="biblia">
        <span class="nav-ico" aria-hidden="true">${ICO.biblia}</span>
        <span class="nav-label">Bíblia</span>
      </a>
      <a href="${routes.devocionais()}" data-nav="devocionais">
        <span class="nav-ico" aria-hidden="true">${ICO.devocionais}</span>
        <span class="nav-label">Devocionais</span>
      </a>
      <a href="${routes.home()}" data-nav="home" class="nav-home">
        <span class="nav-home-btn" aria-hidden="true">${ICO.home}</span>
        <span class="nav-home-label nav-label">Home</span>
      </a>
      <a href="${routes.marcacoes()}" data-nav="marcacoes">
        <span class="nav-ico" aria-hidden="true">${ICO.marcacoes}</span>
        <span class="nav-label">Marcações</span>
      </a>
      <a href="${routes.conta()}" data-nav="conta">
        <span class="nav-ico" aria-hidden="true">${ICO.conta}</span>
        <span class="nav-label">Conta</span>
      </a>
    </nav>
  `;
}

function setActiveNav(routeName) {
  const map = {
    home: 'home',
    biblia: 'biblia',
    book: 'biblia',
    reading: 'biblia',
    devocionais: 'devocionais',
    'devocional-edit': 'devocionais',
    marcacoes: 'marcacoes',
    conta: 'conta',
    favorites: 'marcacoes',
    settings: 'conta',
  };
  const active = map[routeName] || 'home';
  document.querySelectorAll('.bottom-nav a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('data-nav') === active);
  });
}

function render(route) {
  ensureShell();
  const pageRoot = document.getElementById('page-root');
  setActiveNav(route.name);

  switch (route.name) {
    case 'biblia':
      renderBiblia(pageRoot);
      break;
    case 'book':
      renderBook(pageRoot, route.params);
      break;
    case 'reading':
      renderReading(pageRoot, route.params);
      break;
    case 'devocionais':
      renderDevocionais(pageRoot);
      break;
    case 'devocional-edit':
      renderDevocionalEdit(pageRoot, route.params);
      break;
    case 'favorites':
      renderFavorites(pageRoot);
      break;
    case 'conta':
      renderPlaceholder(pageRoot, 'conta');
      break;
    case 'settings':
      renderSettings(pageRoot);
      break;
    case 'home':
    default:
      renderHome(pageRoot);
      break;
  }

  // Keep deep-linked verse in view (reading ?v=)
  if (!(route.name === 'reading' && route.params?.verse)) {
    window.scrollTo(0, 0);
  }
}

// Splash overlays the shell; Home (and other routes) mount underneath.
runSplash();

onRouteChange(render);
startRouter();

if (!location.hash) {
  location.hash = '#/';
} else {
  render(parseHash());
}
