import { books } from '../data/books.js';
import { routes } from '../utils/router.js';

function filterBooks(query, testament) {
  const q = query.trim().toLowerCase();
  return books.filter((b) => {
    if (testament === 'AT' && b.testament !== 'AT') return false;
    if (testament === 'NT' && b.testament !== 'NT') return false;
    if (!q) return true;
    return (
      b.name.toLowerCase().includes(q) ||
      b.shortName.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q)
    );
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderBiblia(root, { query = '', testament = 'all' } = {}) {
  const filtered = filterBooks(query, testament);

  const chips = [
    { id: 'all', label: 'Todos' },
    { id: 'AT', label: 'Antigo Testamento' },
    { id: 'NT', label: 'Novo Testamento' },
  ]
    .map(
      (c) => `
      <button type="button" class="chip ${testament === c.id ? 'active' : ''}" data-filter="${c.id}">
        ${c.label}
      </button>`
    )
    .join('');

  const items = filtered
    .map(
      (b) => `
      <li>
        <a class="book-tile" href="${routes.book(b.id)}">
          <span class="book-tile__name">${b.name}</span>
          <span class="book-tile__meta">${b.chapters} cap.</span>
          <span class="book-tile__chev" aria-hidden="true">›</span>
        </a>
      </li>`
    )
    .join('');

  root.innerHTML = `
    <main class="page page--biblia">
      <header class="biblia-header">
        <div class="biblia-title">
          <span class="biblia-title__ico" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5c4-2 8-2 8 0v14c0-2 4-2 8 0V5c-4-2-8-2-8 0"/><path d="M12 5v14"/></svg>
          </span>
          <h1>Bíblia</h1>
        </div>
      </header>

      <div class="search-wrap">
        <span class="search-ico" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
        </span>
        <input
          type="search"
          id="book-search"
          placeholder="Buscar livro…"
          value="${escapeHtml(query)}"
          autocomplete="off"
          aria-label="Buscar livro"
        />
      </div>

      <div class="chip-row" role="group" aria-label="Filtrar por testamento">
        ${chips}
      </div>

      ${
        filtered.length
          ? `<ul class="book-tiles">${items}</ul>`
          : `<p class="empty-search">Nenhum livro encontrado para “${escapeHtml(query)}”.</p>`
      }
    </main>
  `;

  const input = root.querySelector('#book-search');
  input?.addEventListener('input', (e) => {
    renderBiblia(root, { query: e.target.value, testament });
    const next = root.querySelector('#book-search');
    if (next) {
      next.focus();
      const len = next.value.length;
      next.setSelectionRange(len, len);
    }
  });

  root.querySelectorAll('[data-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      renderBiblia(root, {
        query: root.querySelector('#book-search')?.value || '',
        testament: btn.getAttribute('data-filter'),
      });
    });
  });
}
