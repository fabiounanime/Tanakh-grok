import { getBookById } from '../data/books.js';
import {
  ensureBookLoaded,
  hasDemoContent,
  hasPortugueseContent,
  originalLangLabel,
  getChapterOriginalLang,
} from '../data/verses.js';
import { routes, navigate } from '../utils/router.js';

export async function renderBook(root, { bookId }) {
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

  root.innerHTML = `
    <header class="app-header">
      <button class="btn-icon" type="button" data-back aria-label="Voltar">←</button>
      <h1>${book.name}</h1>
    </header>
    <main class="page"><p class="hint">Carregando capítulos…</p></main>
  `;
  root.querySelector('[data-back]')?.addEventListener('click', () => navigate('/biblia'));

  await ensureBookLoaded(book.id);

  const defaultLang = book.originalLang || (book.testament === 'NT' ? 'el' : 'he');
  const langName = originalLangLabel(defaultLang);

  const cells = Array.from({ length: book.chapters }, (_, i) => {
    const n = i + 1;
    const hasOrig = hasDemoContent(book.id, n);
    const hasPt = hasPortugueseContent(book.id, n);
    const cls = [hasOrig ? 'has-demo' : '', hasPt ? 'has-pt' : ''].filter(Boolean).join(' ');
    const chLang = getChapterOriginalLang(book.id, n);
    const titleBits = [`Capítulo ${n}`];
    if (hasOrig) titleBits.push(originalLangLabel(chLang));
    if (hasPt) titleBits.push('Português');
    return `<a class="${cls}" href="${routes.reading(book.id, n)}" title="${titleBits.join(' · ')}">${n}</a>`;
  }).join('');

  root.innerHTML = `
    <header class="app-header">
      <button class="btn-icon" type="button" data-back aria-label="Voltar">←</button>
      <h1>${book.name}</h1>
    </header>
    <main class="page">
      <p class="hint">
        Escolha um capítulo. Texto original (${langName}) e transliteração estão disponíveis
        para todos os capítulos. Capítulos com português completo ficam destacados.
      </p>
      <div class="chapter-grid" role="navigation" aria-label="Capítulos de ${book.name}">
        ${cells}
      </div>
    </main>
  `;

  root.querySelector('[data-back]')?.addEventListener('click', () => navigate('/biblia'));
}
