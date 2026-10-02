import { books } from '../data/books.js';
import { getVerses } from '../data/verses.js';
import { navigate, routes } from '../utils/router.js';
import {
  listMarksGroupedByBook,
  setMark,
  removeSavedMark,
  formatRelativeWhen,
} from '../utils/storage.js';

function lookupSnippet(bookId, chapter, verse) {
  const v = getVerses(bookId, chapter).find((x) => x.verse === verse);
  return v?.portuguese || '';
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderFavorites(root) {
  const paint = () => {
    const groups = listMarksGroupedByBook({ books, lookupSnippet });
    const total = groups.reduce((n, g) => n + g.items.length, 0);

    let body;
    if (!total) {
      body = `
        <div class="placeholder-page">
          <div class="big-ico" aria-hidden="true">★</div>
          <h2>Nenhuma marcação</h2>
          <p>Na leitura, toque em um versículo e escolha <strong>Marcar</strong> ou <strong>Marcar e salvar</strong>. Suas marcações aparecerão aqui, na ordem dos livros da Bíblia.</p>
          <p class="placeholder-links"><a class="link-gold" href="${routes.biblia()}">Abrir Bíblia</a></p>
        </div>`;
    } else {
      body = groups
        .map((g) => {
          const cards = g.items
            .map((m) => {
              const when = formatRelativeWhen(m.savedAt || m.markedAt);
              return `
              <article class="mark-card mark-card--row">
                <a class="mark-card__link" href="${routes.reading(m.bookId, m.chapter)}">
                  <div class="mark-card__top">
                    <span class="mark-card__ref">${escapeHtml(m.ref)}</span>
                    ${when ? `<span class="mark-card__when">${escapeHtml(when)}</span>` : ''}
                  </div>
                  ${
                    m.snippet
                      ? `<p class="mark-card__snippet">${escapeHtml(m.snippet)}</p>`
                      : '<p class="mark-card__snippet mark-card__snippet--muted">Sem texto de demonstração</p>'
                  }
                </a>
                <button
                  type="button"
                  class="mark-card__remove"
                  data-remove-mark="${escapeHtml(m.id)}"
                  data-book="${escapeHtml(m.bookId)}"
                  data-chapter="${m.chapter}"
                  data-verse="${m.verse}"
                  aria-label="Remover marcação ${escapeHtml(m.ref)}"
                  title="Remover"
                >×</button>
              </article>`;
            })
            .join('');
          return `
            <section class="marks-group" aria-labelledby="marks-${escapeHtml(g.bookId)}">
              <h2 class="marks-group__title" id="marks-${escapeHtml(g.bookId)}">${escapeHtml(
                g.bookName
              )} <span class="marks-group__count">${g.items.length}</span></h2>
              <div class="mark-list">${cards}</div>
            </section>`;
        })
        .join('');
    }

    root.innerHTML = `
      <header class="app-header">
        <button class="btn-icon" type="button" data-back aria-label="Voltar">←</button>
        <h1>Minhas marcações</h1>
      </header>
      <main class="page page--marks">
        ${
          total
            ? `<p class="hint">${total} versículo${total === 1 ? '' : 's'} · ordem dos livros</p>`
            : ''
        }
        ${body}
      </main>
    `;

    root.querySelector('[data-back]')?.addEventListener('click', () => navigate('/'));
    root.querySelectorAll('[data-remove-mark]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute('data-remove-mark');
        const bookId = btn.getAttribute('data-book');
        const chapter = Number(btn.getAttribute('data-chapter'));
        const verse = Number(btn.getAttribute('data-verse'));
        setMark(bookId, chapter, verse, false);
        removeSavedMark(id);
        paint();
      });
    });
  };

  paint();
}
