import { routes } from '../utils/router.js';

const MARKINGS = [
  {
    ref: 'Gênesis 1:3',
    href: routes.reading('gen', 1),
    snippet: 'E disse Deus: Haja luz; e houve luz.',
    when: 'Hoje',
  },
  {
    ref: 'João 1:5',
    href: routes.reading('jhn', 1),
    snippet: 'E a luz resplandece nas trevas…',
    when: 'Ontem',
  },
  {
    ref: 'Gênesis 1:1',
    href: routes.reading('gen', 1),
    snippet: 'No princípio criou Deus os céus e a terra.',
    when: 'Esta semana',
  },
];

const ENCOURAGING = [
  {
    ref: 'João 1:4',
    href: routes.reading('jhn', 1),
    text: 'Nele estava a vida, e a vida era a luz dos homens.',
  },
  {
    ref: 'Gênesis 1:4',
    href: routes.reading('gen', 1),
    text: 'E viu Deus que a luz era boa.',
  },
  {
    ref: 'João 1:1',
    href: routes.reading('jhn', 1),
    text: 'No princípio era o Verbo, e o Verbo estava com Deus.',
  },
];

export function renderHome(root) {
  const markings = MARKINGS.map(
    (m) => `
    <a class="mark-card" href="${m.href}">
      <div class="mark-card__top">
        <span class="mark-card__ref">${m.ref}</span>
        <span class="mark-card__when">${m.when}</span>
      </div>
      <p class="mark-card__snippet">${m.snippet}</p>
    </a>`
  ).join('');

  const verses = ENCOURAGING.map(
    (v) => `
    <a class="verse-chip-card" href="${v.href}">
      <span class="verse-chip-card__ref">${v.ref}</span>
      <p class="verse-chip-card__text">${v.text}</p>
    </a>`
  ).join('');

  root.innerHTML = `
    <main class="page page--home">
      <header class="home-topbar">
        <div class="brand">
          <span class="brand__mark" aria-hidden="true">✦</span>
          <span class="brand__name">Bíblia</span>
        </div>
        <div class="home-topbar__actions">
          <button type="button" class="icon-btn" aria-label="Notificações" title="Notificações">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 9a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>
          </button>
          <div class="avatar" aria-hidden="true">F</div>
        </div>
      </header>

      <section class="greeting">
        <h1>Olá, <span class="greeting__name">Fabio</span></h1>
        <p class="greeting__sub">Prepare seu coração. Deus usa o que você prepara.</p>
      </section>

      <section class="hero-card" aria-labelledby="devocional-title">
        <p class="hero-card__label">CRIAR DEVOCIONAL</p>
        <h2 id="devocional-title" class="hero-card__title">Comece um tempo com a Palavra</h2>
        <p class="hero-card__body">Escreva reflexões, combine versículos e monte seu estudo diário.</p>
        <div class="hero-card__art" aria-hidden="true">
          <div class="hero-glow"></div>
          <svg class="hero-book" viewBox="0 0 120 80" fill="none">
            <path d="M10 16c18-10 42-10 50 0v48c-8-8-32-8-50 0V16z" fill="#2a2418" stroke="#FFC107" stroke-width="1.5"/>
            <path d="M110 16c-18-10-42-10-50 0v48c8-8 32-8 50 0V16z" fill="#1a160e" stroke="#FFC107" stroke-width="1.5"/>
            <path d="M60 16v48" stroke="#FFC107" stroke-width="1.2" opacity=".7"/>
          </svg>
        </div>
        <button type="button" class="btn-gold" data-devocional>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
          Criar Devocional
        </button>
      </section>

      <section class="section-block">
        <div class="section-head">
          <h2>Últimas marcações</h2>
          <a class="link-gold" href="${routes.biblia()}">Ver Bíblia</a>
        </div>
        <div class="mark-list">${markings}</div>
      </section>

      <section class="section-block">
        <div class="section-head">
          <h2>Versículos incentivadores</h2>
        </div>
        <div class="verse-scroll">${verses}</div>
      </section>

      <div class="toast" id="home-toast" hidden role="status"></div>
    </main>
  `;

  root.querySelector('[data-devocional]')?.addEventListener('click', () => {
    const toast = root.querySelector('#home-toast');
    if (!toast) return;
    toast.hidden = false;
    toast.textContent = 'Em breve: editor de Devocionais.';
    clearTimeout(toast._t);
    toast._t = setTimeout(() => {
      toast.hidden = true;
    }, 2400);
  });
}
