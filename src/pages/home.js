import { routes, navigate } from '../utils/router.js';
import { getSavedMarks, formatRelativeWhen } from '../utils/storage.js';

const FALLBACK_MARKINGS = [
  {
    ref: 'Gênesis 1:3',
    href: routes.readingVerse('gen', 1, 3),
    snippet: 'E disse Deus: Haja luz; e houve luz.',
    when: 'Exemplo',
  },
  {
    ref: 'João 1:5',
    href: routes.readingVerse('jhn', 1, 5),
    snippet: 'E a luz resplandece nas trevas…',
    when: 'Exemplo',
  },
  {
    ref: 'Gênesis 1:1',
    href: routes.readingVerse('gen', 1, 1),
    snippet: 'No princípio criou Deus os céus e a terra.',
    when: 'Exemplo',
  },
];

const ENCOURAGING = [
  {
    ref: 'João 1:4',
    href: routes.readingVerse('jhn', 1, 4),
    text: 'Nele estava a vida, e a vida era a luz dos homens.',
  },
  {
    ref: 'Gênesis 1:4',
    href: routes.readingVerse('gen', 1, 4),
    text: 'E viu Deus que a luz era boa.',
  },
  {
    ref: 'João 1:1',
    href: routes.readingVerse('jhn', 1, 1),
    text: 'No princípio era o Verbo, e o Verbo estava com Deus.',
  },
];

export function renderHome(root) {
  const saved = getSavedMarks().slice(0, 6);
  const markingsSrc = saved.length
    ? saved.map((m) => ({
        ref: m.ref,
        href: routes.readingVerse(m.bookId, m.chapter, m.verse),
        snippet: m.snippet,
        when: formatRelativeWhen(m.savedAt),
      }))
    : FALLBACK_MARKINGS;

  const markings = markingsSrc
    .map(
      (m) => `
    <a class="mark-card" href="${m.href}">
      <div class="mark-card__top">
        <span class="mark-card__ref">${escapeHtml(m.ref)}</span>
        <span class="mark-card__when">${escapeHtml(m.when)}</span>
      </div>
      <p class="mark-card__snippet">${escapeHtml(m.snippet)}</p>
    </a>`
    )
    .join('');

  const verses = ENCOURAGING.map(
    (v) => `
    <a class="verse-chip-card" href="${v.href}">
      <span class="verse-chip-card__ref">${v.ref}</span>
      <p class="verse-chip-card__text">${v.text}</p>
    </a>`
  ).join('');

  root.innerHTML = `
    <main class="page page--home">
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
          <a class="link-gold" href="${routes.marcacoes()}">Ver todas</a>
        </div>
        <div class="mark-list">${markings}</div>
      </section>

      <section class="section-block">
        <div class="section-head">
          <h2>Versículos incentivadores</h2>
        </div>
        <div class="verse-scroll">${verses}</div>
      </section>
    </main>
  `;

  root.querySelector('[data-devocional]')?.addEventListener('click', () => {
    navigate('/devocionais/nova');
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
