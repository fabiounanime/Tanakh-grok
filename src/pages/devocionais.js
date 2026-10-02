import { routes, navigate } from '../utils/router.js';
import {
  getDevocionais,
  getDevocionalById,
  createDevocional,
  updateDevocional,
  deleteDevocional,
  getSavedMarks,
  formatRelativeWhen,
} from '../utils/storage.js';

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderDevocionais(root) {
  const list = getDevocionais();

  const cards = list.length
    ? list
        .map(
          (d) => `
      <a class="devo-card" href="${routes.devocional(d.id)}">
        <div class="devo-card__top">
          <h2 class="devo-card__title">${escapeHtml(d.title)}</h2>
          <span class="devo-card__when">${escapeHtml(formatRelativeWhen(d.updatedAt))}</span>
        </div>
        <p class="devo-card__snippet">${escapeHtml(
          (d.body || '').trim() || 'Sem anotações ainda.'
        ).slice(0, 140)}${(d.body || '').length > 140 ? '…' : ''}</p>
        <div class="devo-card__meta">
          ${(d.verseRefs || []).length
            ? `<span>${(d.verseRefs || []).length} versículo${
                (d.verseRefs || []).length === 1 ? '' : 's'
              }</span>`
            : '<span>Sem versículos</span>'}
        </div>
      </a>`
        )
        .join('')
    : `
    <div class="placeholder-page">
      <div class="big-ico" aria-hidden="true">✝</div>
      <h2>Nenhuma devocional ainda</h2>
      <p>Crie uma reflexão e associe versículos marcados da Bíblia.</p>
    </div>`;

  root.innerHTML = `
    <header class="app-header">
      <h1>Minhas Devocionais</h1>
      <button class="btn-gold btn-gold--sm" type="button" data-nova>Nova</button>
    </header>
    <main class="page page--devo">
      <div class="devo-list">${cards}</div>
    </main>
  `;

  root.querySelector('[data-nova]')?.addEventListener('click', () =>
    navigate('/devocionais/nova')
  );
}

export function renderDevocionalEdit(root, { id, isNew }) {
  const existing = !isNew && id ? getDevocionalById(id) : null;
  if (!isNew && !existing) {
    root.innerHTML = `
      <header class="app-header">
        <button class="btn-icon" type="button" data-back aria-label="Voltar">←</button>
        <h1>Não encontrada</h1>
      </header>
      <main class="page"><p class="hint">Esta devocional não existe mais.</p></main>
    `;
    root.querySelector('[data-back]')?.addEventListener('click', () =>
      navigate('/devocionais')
    );
    return;
  }

  let draft = existing
    ? {
        title: existing.title,
        body: existing.body,
        verseRefs: [...(existing.verseRefs || [])],
      }
    : { title: '', body: '', verseRefs: [] };

  const paint = () => {
    const refsHtml = draft.verseRefs.length
      ? draft.verseRefs
          .map((r, i) => {
            const href = routes.readingVerse(r.bookId, r.chapter, r.verse);
            return `
            <li class="devo-ref" data-ref-idx="${i}">
              <a class="devo-ref__link" href="${href}">
                <span class="devo-ref__label">${escapeHtml(r.ref)}</span>
                <span class="devo-ref__snip">${escapeHtml(r.snippet || '')}</span>
              </a>
              <button type="button" class="btn-icon deo-ref__rm" data-rm-ref="${i}" aria-label="Remover versículo">×</button>
            </li>`;
          })
          .join('')
      : `<li class="hint" style="list-style:none;padding:0.5rem 0">Nenhum versículo associado. Use “Adicionar marcação” ou marque na leitura.</li>`;

    root.innerHTML = `
      <header class="app-header">
        <button class="btn-icon" type="button" data-back aria-label="Voltar">←</button>
        <h1>${isNew ? 'Nova Devocional' : 'Editar Devocional'}</h1>
        <button class="btn-text" type="button" data-save>Salvar</button>
      </header>
      <main class="page page--devo-edit">
        <label class="field">
          <span class="field__label">Título</span>
          <input type="text" class="field__input" data-title maxlength="120"
            placeholder="Ex.: Reflexão sobre a Criação"
            value="${escapeHtml(draft.title)}" />
        </label>
        <label class="field">
          <span class="field__label">Anotações</span>
          <textarea class="field__textarea" data-body rows="8"
            placeholder="Escreva suas reflexões…">${escapeHtml(draft.body)}</textarea>
        </label>

        <div class="section-head" style="margin-top:1.25rem">
          <h2>Versículos vinculados</h2>
          <button type="button" class="link-gold" data-add-mark style="background:none;border:none;padding:0">Adicionar marcação</button>
        </div>
        <ul class="devo-refs">${refsHtml}</ul>

        ${
          !isNew
            ? `<button type="button" class="btn-danger" data-delete>Excluir devocional</button>`
            : ''
        }
      </main>
      <div class="sheet-backdrop" id="mark-picker" hidden>
        <div class="sheet" role="dialog" aria-label="Adicionar marcação">
          <div class="sheet__handle" aria-hidden="true"></div>
          <h3 class="sheet__title">Marcações salvas</h3>
          <div class="sheet__body" data-picker-list></div>
          <button type="button" class="sheet__cancel" data-picker-close>Fechar</button>
        </div>
      </div>
    `;

    root.querySelector('[data-back]')?.addEventListener('click', () =>
      navigate('/devocionais')
    );

    const titleEl = root.querySelector('[data-title]');
    const bodyEl = root.querySelector('[data-body]');
    titleEl?.addEventListener('input', () => {
      draft.title = titleEl.value;
    });
    bodyEl?.addEventListener('input', () => {
      draft.body = bodyEl.value;
    });

    root.querySelector('[data-save]')?.addEventListener('click', () => {
      draft.title = titleEl?.value ?? draft.title;
      draft.body = bodyEl?.value ?? draft.body;
      if (isNew) {
        const created = createDevocional(draft);
        navigate(`/devocionais/${created.id}`);
      } else {
        updateDevocional(existing.id, draft);
        navigate('/devocionais');
      }
    });

    root.querySelectorAll('[data-rm-ref]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const idx = Number(btn.getAttribute('data-rm-ref'));
        draft.verseRefs = draft.verseRefs.filter((_, i) => i !== idx);
        paint();
      });
    });

    root.querySelector('[data-delete]')?.addEventListener('click', () => {
      if (confirm('Excluir esta devocional?')) {
        deleteDevocional(existing.id);
        navigate('/devocionais');
      }
    });

    const picker = root.querySelector('#mark-picker');
    const openPicker = () => {
      const saved = getSavedMarks();
      const listEl = root.querySelector('[data-picker-list]');
      if (!listEl) return;
      if (!saved.length) {
        listEl.innerHTML =
          '<p class="hint">Nenhuma marcação salva. Na leitura, toque em um versículo e escolha “Marcar e salvar”.</p>';
      } else {
        listEl.innerHTML = saved
          .map((m) => {
            const already = draft.verseRefs.some(
              (r) =>
                r.bookId === m.bookId &&
                Number(r.chapter) === Number(m.chapter) &&
                Number(r.verse) === Number(m.verse)
            );
            return `
              <button type="button" class="sheet-option" data-pick="${escapeHtml(m.id)}" ${
                already ? 'disabled' : ''
              }>
                <strong>${escapeHtml(m.ref)}</strong>
                <span>${escapeHtml(m.snippet || '')}</span>
              </button>`;
          })
          .join('');
        listEl.querySelectorAll('[data-pick]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const mid = btn.getAttribute('data-pick');
            const m = saved.find((x) => x.id === mid);
            if (!m) return;
            draft.verseRefs.push({
              bookId: m.bookId,
              chapter: m.chapter,
              verse: m.verse,
              ref: m.ref,
              snippet: m.snippet,
            });
            picker.hidden = true;
            paint();
          });
        });
      }
      picker.hidden = false;
    };

    root.querySelector('[data-add-mark]')?.addEventListener('click', openPicker);
    root.querySelector('[data-picker-close]')?.addEventListener('click', () => {
      picker.hidden = true;
    });
    picker?.addEventListener('click', (e) => {
      if (e.target === picker) picker.hidden = true;
    });
  };

  paint();
}
