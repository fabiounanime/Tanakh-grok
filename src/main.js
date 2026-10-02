import './styles/main.css';
import { startRouter, onRouteChange, parseHash, routes } from './utils/router.js';
import { renderHome } from './pages/home.js';
import { renderBiblia } from './pages/biblia.js';
import { renderBook } from './pages/book.js';
import { renderReading } from './pages/reading.js';
import { renderFavorites } from './pages/favorites.js';
import { renderSettings } from './pages/settings.js';
import { renderPlaceholder } from './pages/placeholder.js';

const app = document.getElementById('app');

const ICO = {
  biblia: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 5c4-2 8-2 8 0v14c0-2 4-2 8 0V5c-4-2-8-2-8 0"/><path d="M12 5v14"/></svg>`,
  agenda: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>`,
  home: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5z"/></svg>`,
  mensagens: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4V6z"/></svg>`,
  conta: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="8" r="3.5"/><path d="M5 19c1.5-3.5 4-5 7-5s5.5 1.5 7 5"/></svg>`,
};

function ensureShell() {
  if (document.getElementById('page-root')) return;
  app.innerHTML = `
    <div id="page-root"></div>
    <nav class="bottom-nav" aria-label="Navegação principal">
      <a href="${routes.biblia()}" data-nav="biblia">
        <span class="nav-ico" aria-hidden="true">${ICO.biblia}</span>
        <span>Bíblia</span>
      </a>
      <a href="${routes.agenda()}" data-nav="agenda">
        <span class="nav-ico" aria-hidden="true">${ICO.agenda}</span>
        <span>Agenda</span>
      </a>
      <a href="${routes.home()}" data-nav="home" class="nav-home">
        <span class="nav-home-btn" aria-hidden="true">${ICO.home}</span>
        <span class="nav-home-label">Home</span>
      </a>
      <a href="${routes.mensagens()}" data-nav="mensagens">
        <span class="nav-ico" aria-hidden="true">${ICO.mensagens}</span>
        <span>Mensagens</span>
      </a>
      <a href="${routes.conta()}" data-nav="conta">
        <span class="nav-ico" aria-hidden="true">${ICO.conta}</span>
        <span>Conta</span>
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
    agenda: 'agenda',
    mensagens: 'mensagens',
    conta: 'conta',
    favorites: 'conta',
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
    case 'agenda':
      renderPlaceholder(pageRoot, 'agenda');
      break;
    case 'mensagens':
      renderPlaceholder(pageRoot, 'mensagens');
      break;
    case 'conta':
      renderPlaceholder(pageRoot, 'conta');
      break;
    case 'favorites':
      renderFavorites(pageRoot);
      break;
    case 'settings':
      renderSettings(pageRoot);
      break;
    case 'home':
    default:
      renderHome(pageRoot);
      break;
  }

  window.scrollTo(0, 0);
}

onRouteChange(render);
startRouter();

if (!location.hash) {
  location.hash = '#/';
} else {
  render(parseHash());
}
