import { getBookById } from '../data/books.js';
import { getVerses } from '../data/verses.js';
import { routes, navigate } from '../utils/router.js';
import { getSavedTab, saveTab } from '../utils/storage.js';

const TAB_LABELS = {
  portuguese: 'Português',
  hebrew: 'Hebraico',
  transliteration: 'Transliteração',
};

export function renderReading(root, { bookId, chapter }) {
  const book = getBookById(bookId);
  if (!book) {
    root.innerHTML = `
      <header class="app-header">
        <button class="btn-icon" type="button" data-back aria-label="Voltar">←</button>
        <h1>Não encontrado</h1>
      </header>
      <main class="page page--reading"><p class="hint">Livro inválido.</p></main>
    `;
    root.querySelector('[data-back]')?.addEventListener('click', () => navigate('/'));
    return;
  }

  const cap = Math.min(Math.max(1, chapter || 1), book.chapters);
  const verses = getVerses(book.id, cap);
  let activeTab = getSavedTab();

  const paint = () => {
    const prevDisabled = cap <= 1;
    const nextDisabled = cap >= book.chapters;
    const tabsHtml = Object.entries(TAB_LABELS)
      .map(
        ([key, label]) =>
          `<button type="button" role="tab" data-tab="${key}" aria-selected="${
            activeTab === key
          }" class="${activeTab === key ? 'active' : ''}">${label}</button>`
      )
      .join('');

    let body;
    if (!verses.length) {
      body = `
        <div class="placeholder-chapter">
          <strong>Capítulo em breve</strong>
          <p>Ainda não há texto de demonstração para ${book.name} ${cap}. A navegação e as abas já funcionam; o conteúdo real será carregado depois.</p>
        </div>`;
    } else {
      const { className, field, dirNote } = tabConfig(activeTab, verses[0]?.originalLang);
      const items = verses
        .map((v) => {
          const text = v[field] || '—';
          return `
            <li>
              <span class="v-num" aria-hidden="true">${v.verse}</span>
              <span class="v-text" lang="${langAttr(activeTab, v.originalLang)}">${escapeHtml(
                text
              )}</span>
            </li>`;
        })
        .join('');
      body = `
        <ul class="verse-list ${className}" role="list" data-dir="${dirNote}">
          ${items}
        </ul>
        <p class="demo-footer">
          Texto português de exemplo (placeholder literal / estilo domínio público) — não é uma edição comercial publicada. Original hebraico/grego clássico de demonstração.
        </p>`;
    }

    root.innerHTML = `
      <header class="app-header">
        <button class="btn-icon" type="button" data-back aria-label="Voltar aos capítulos">←</button>
        <h1>${book.name}</h1>
      </header>
      <main class="page">
        <div class="reading-toolbar">
          <button
            class="btn-text"
            type="button"
            data-prev
            ${prevDisabled ? 'disabled' : ''}
            aria-label="Capítulo anterior"
          >‹ Ant.</button>
          <span class="chapter-label">Capítulo ${cap}</span>
          <button
            class="btn-text"
            type="button"
            data-next
            ${nextDisabled ? 'disabled' : ''}
            aria-label="Próximo capítulo"
          >Próx. ›</button>
        </div>
        <div class="tabs" role="tablist" aria-label="Modo de leitura">
          ${tabsHtml}
        </div>
        <div role="tabpanel">${body}</div>
      </main>
    `;

    root.querySelector('[data-back]')?.addEventListener('click', () =>
      navigate(`/livro/${book.id}`)
    );
    root.querySelector('[data-prev]')?.addEventListener('click', () => {
      if (cap > 1) navigate(`/ler/${book.id}/${cap - 1}`);
    });
    root.querySelector('[data-next]')?.addEventListener('click', () => {
      if (cap < book.chapters) navigate(`/ler/${book.id}/${cap + 1}`);
    });
    root.querySelectorAll('[data-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeTab = btn.getAttribute('data-tab');
        saveTab(activeTab);
        paint();
      });
    });
  };

  paint();
}

function tabConfig(tab, originalLang) {
  if (tab === 'hebrew') {
    const isHe = originalLang === 'he';
    return {
      className: isHe ? 'lang-he' : 'lang-el',
      field: 'original',
      dirNote: isHe ? 'rtl' : 'ltr',
    };
  }
  if (tab === 'transliteration') {
    return { className: 'lang-translit', field: 'transliteration', dirNote: 'ltr' };
  }
  return { className: 'lang-pt', field: 'portuguese', dirNote: 'ltr' };
}

function langAttr(tab, originalLang) {
  if (tab === 'hebrew') return originalLang === 'he' ? 'he' : 'el';
  if (tab === 'transliteration') return 'la';
  return 'pt';
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
