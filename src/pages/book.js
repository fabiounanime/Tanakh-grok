import { getBookById } from '../data/books.js';
import { hasDemoContent } from '../data/verses.js';
import { routes, navigate } from '../utils/router.js';

export function renderBook(root, { bookId }) {
  const book = getBookById(bookId);
  if (!book) {
    root.innerHTML = `
      <header class="app-header">
        <button class="btn-icon" type="button" data-back aria-label="Voltar">←</button>
        <h1>Livro não encontrado</h1>
      </header>
      <main class="page"><p class="hint">Este livro não existe no índice.</p></main>
    `;
    root.querySelector('[data-back]')?.addEventListener('click', () => navigate('/biblia'));
    return;
  }

  const cells = Array.from({ length: book.chapters }, (_, i) => {
    const n = i + 1;
    const demo = hasDemoContent(book.id, n) ? ' has-demo' : '';
    return `<a class="${demo.trim()}" href="${routes.reading(book.id, n)}" title="Capítulo ${n}">${n}</a>`;
  }).join('');

  root.innerHTML = `
    <header class="app-header">
      <button class="btn-icon" type="button" data-back aria-label="Voltar">←</button>
      <h1>${book.name}</h1>
    </header>
    <main class="page">
      <p class="hint">
        Escolha um capítulo.
        ${book.id === 'gen' || book.id === 'jhn'
          ? ' Capítulos com conteúdo de demonstração estão destacados.'
          : ' Conteúdo completo será adicionado depois — por enquanto os capítulos abrem como placeholder.'}
      </p>
      <div class="chapter-grid" role="navigation" aria-label="Capítulos de ${book.name}">
        ${cells}
      </div>
    </main>
  `;

  root.querySelector('[data-back]')?.addEventListener('click', () => navigate('/biblia'));
}
