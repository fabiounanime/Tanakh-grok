import { getBookById } from '../data/books.js';
import { getVersesForVersion } from '../data/verses.js';
import { FIXED_PT_VERSION } from '../data/versions.js';
import { navigate } from '../utils/router.js';
import {
  getSavedTab,
  saveTab,
  isMarked,
  setMark,
  saveMarkEntry,
  getDevocionais,
  createDevocional,
  associateVerseToDevocional,
  getFontScale,
  setFontScale,
  bumpFontScale,
  FONT_SCALE_MIN,
  FONT_SCALE_MAX,
  FONT_SCALE_STEP,
} from '../utils/storage.js';

const TAB_LABELS = {
  portuguese: 'Português',
  hebrew: 'Hebraico',
  transliteration: 'Transliteração',
};

export function renderReading(root, { bookId, chapter, verse: deepLinkVerse = null } = {}) {
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
  // Português = local original rendering only (verses.js portuguese column).
  // No version picker; no Almeida / ACF / RA / NVI / bible-api.com.
  let verses = [];
  let activeTab = getSavedTab();
  let sheetVerse = null;
  const deepLinkNum =
    deepLinkVerse != null && Number.isFinite(Number(deepLinkVerse))
      ? Number(deepLinkVerse)
      : null;
  let activeVerse = deepLinkNum;
  let pendingDeepLink = deepLinkNum;

  function loadVerses() {
    verses = getVersesForVersion(book.id, cap, FIXED_PT_VERSION);
    if (activeVerse == null || !verses.some((v) => v.verse === activeVerse)) {
      activeVerse = verses[0]?.verse ?? null;
    }
    paint();
  }

  const paint = () => {
    const prevDisabled = cap <= 1;
    const nextDisabled = cap >= book.chapters;
    const firstVerse = verses[0]?.verse ?? null;
    const lastVerse = verses[verses.length - 1]?.verse ?? null;
    if (activeVerse === null || !verses.some((v) => v.verse === activeVerse)) {
      activeVerse = firstVerse;
    }
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
          <p>Ainda não há tradução do original em português para ${escapeHtml(
            book.name
          )} ${cap}. Hebraico e Transliteração também serão preenchidos quando o capítulo estiver disponível.</p>
        </div>`;
    } else {
      const { className, field, dirNote } = tabConfig(activeTab, verses[0]?.originalLang);
      const verseOptions = verses
        .map(
          (v) =>
            `<option value="${v.verse}" ${
              activeVerse === v.verse ? 'selected' : ''
            }>Versículo ${v.verse}</option>`
        )
        .join('');
      const verseNavigation = `
        <div class="verse-navigation" aria-label="Navegação de versículos">
          <button
            type="button"
            class="verse-nav-btn"
            data-prev-verse
            ${activeVerse === firstVerse ? 'disabled' : ''}
            aria-label="Versículo anterior"
          >‹ Anterior</button>
          <label class="verse-jump">
            <span>Ir para</span>
            <select data-verse-jump aria-label="Ir para versículo">${verseOptions}</select>
          </label>
          <button
            type="button"
            class="verse-nav-btn"
            data-next-verse
            ${activeVerse === lastVerse ? 'disabled' : ''}
            aria-label="Próximo versículo"
          >Próximo ›</button>
        </div>`;
      const items = verses
        .map((v) => {
          const text = v[field] || '—';
          const marked = isMarked(book.id, cap, v.verse);
          const isActive = activeVerse === v.verse;
          return `
            <span
              class="verse${marked ? ' verse--marked' : ''}${isActive ? ' verse--active' : ''}"
              data-verse="${v.verse}"
              role="button"
              tabindex="0"
              aria-posinset="${v.verse}"
              aria-current="${isActive ? 'true' : 'false'}"
              aria-label="Versículo ${v.verse}"
            ><sup class="v-num" aria-hidden="true">${v.verse}</sup><span class="v-text" lang="${langAttr(
              activeTab,
              v.originalLang
            )}">${escapeHtml(text)}</span></span>`;
        })
        .join('');
      body = `
        <article class="bible-page ${className}" data-dir="${dirNote}" dir="${
          dirNote === 'rtl' ? 'rtl' : 'ltr'
        }">
          <h2 class="chapter-heading">
            <span class="chapter-heading__book">${escapeHtml(book.name)}</span>
            <span class="chapter-heading__num">${cap}</span>
          </h2>
          <div class="bible-columns">
            <div class="verse-flow" role="list">${items}</div>
          </div>
        </article>
        ${verseNavigation}`;
    }

    root.innerHTML = `
      <header class="app-header">
        <button class="btn-icon" type="button" data-back aria-label="Voltar aos capítulos">←</button>
        <h1>${escapeHtml(book.name)}</h1>
        <div class="font-size-controls" role="group" aria-label="Tamanho da fonte">
          <button type="button" data-font-dec aria-label="Diminuir fonte" title="Diminuir fonte">A−</button>
          <button type="button" class="font-btn--plus" data-font-inc aria-label="Aumentar fonte" title="Aumentar fonte">A+</button>
        </div>
      </header>
      <main class="page page--reading">
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
        ${
          activeTab === 'portuguese'
            ? `<p class="version-banner" aria-live="polite">Português · tradução do original</p>`
            : ''
        }
        <div role="tabpanel">${body}</div>
      </main>
      <div class="sheet-backdrop" id="verse-sheet" hidden>
        <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="verse-sheet-title">
          <div class="sheet__handle" aria-hidden="true"></div>
          <h3 class="sheet__title" id="verse-sheet-title">Versículo</h3>
          <p class="sheet__ref" data-sheet-ref></p>
          <p class="sheet__snippet" data-sheet-snip></p>
          <div class="sheet__actions">
            <button type="button" class="sheet-option" data-action="marcar">
              <strong>Marcar</strong>
              <span>Destacar este versículo na leitura</span>
            </button>
            <button type="button" class="sheet-option" data-action="salvar">
              <strong>Marcar e salvar</strong>
              <span>Destacar e guardar nas marcações</span>
            </button>
            <button type="button" class="sheet-option" data-action="associar">
              <strong>Marcar e associar a uma devocional</strong>
              <span>Vincular a uma reflexão existente ou nova</span>
            </button>
            <button type="button" class="sheet-option sheet-option--muted" data-action="desmarcar" hidden>
              <strong>Remover marcação</strong>
              <span>Tirar o destaque deste versículo</span>
            </button>
          </div>
          <button type="button" class="sheet__cancel" data-sheet-close>Cancelar</button>
        </div>
      </div>
      <div class="sheet-backdrop" id="devo-picker" hidden>
        <div class="sheet" role="dialog" aria-modal="true" aria-label="Associar a devocional">
          <div class="sheet__handle" aria-hidden="true"></div>
          <h3 class="sheet__title">Associar a uma devocional</h3>
          <div class="sheet__body" data-devo-list></div>
          <button type="button" class="sheet-option sheet-option--accent" data-devo-new>
            <strong>Criar nova devocional</strong>
            <span>Com este versículo já vinculado</span>
          </button>
          <button type="button" class="sheet__cancel" data-devo-close>Cancelar</button>
        </div>
      </div>
      <div class="toast" id="reading-toast" hidden role="status"></div>
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
    root.querySelector('[data-prev-verse]')?.addEventListener('click', () => {
      const index = verses.findIndex((v) => v.verse === activeVerse);
      if (index > 0) focusVerse(verses[index - 1].verse);
    });
    root.querySelector('[data-next-verse]')?.addEventListener('click', () => {
      const index = verses.findIndex((v) => v.verse === activeVerse);
      if (index >= 0 && index < verses.length - 1) focusVerse(verses[index + 1].verse);
    });
    root.querySelector('[data-verse-jump]')?.addEventListener('change', (e) => {
      focusVerse(Number(e.target.value));
    });
    root.querySelectorAll('[data-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeTab = btn.getAttribute('data-tab');
        saveTab(activeTab);
        paint();
      });
    });

    root.querySelectorAll('.verse[data-verse]').forEach((el) => {
      const open = () => {
        activeVerse = Number(el.getAttribute('data-verse'));
        syncVerseNavigation();
        openVerseSheet(activeVerse);
      };
      el.addEventListener('click', open);
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      });
    });

    bindSheets();
    bindFontControls();
    bindPinchZoom();
    syncFontButtons();
  };


  let pinchCleanup = null;
  let pinchRaf = 0;
  let pinchPending = null;

  function syncFontButtons() {
    const scale = getFontScale();
    const dec = root.querySelector('[data-font-dec]');
    const inc = root.querySelector('[data-font-inc]');
    if (dec) dec.disabled = scale <= FONT_SCALE_MIN + 1e-9;
    if (inc) inc.disabled = scale >= FONT_SCALE_MAX - 1e-9;
  }

  function bindFontControls() {
    root.querySelector('[data-font-dec]')?.addEventListener('click', () => {
      bumpFontScale(-FONT_SCALE_STEP);
      syncFontButtons();
    });
    root.querySelector('[data-font-inc]')?.addEventListener('click', () => {
      bumpFontScale(FONT_SCALE_STEP);
      syncFontButtons();
    });
  }

  function touchDistance(a, b) {
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  }

  function flushPinchScale() {
    pinchRaf = 0;
    if (pinchPending == null) return;
    setFontScale(pinchPending);
    pinchPending = null;
    syncFontButtons();
  }

  function queuePinchScale(scale) {
    pinchPending = scale;
    if (pinchRaf) return;
    pinchRaf = requestAnimationFrame(flushPinchScale);
  }

  function bindPinchZoom() {
    if (typeof pinchCleanup === 'function') {
      pinchCleanup();
      pinchCleanup = null;
    }
    const target = root.querySelector('.bible-page') || root.querySelector('.page--reading');
    if (!target) return;

    let startDist = 0;
    let startScale = 1;
    let pinching = false;

    const onStart = (e) => {
      if (e.touches.length === 2) {
        pinching = true;
        startDist = touchDistance(e.touches[0], e.touches[1]) || 1;
        startScale = getFontScale();
      }
    };

    const onMove = (e) => {
      if (!pinching || e.touches.length !== 2) return;
      e.preventDefault();
      const d = touchDistance(e.touches[0], e.touches[1]);
      if (!d || !startDist) return;
      const next = startScale * (d / startDist);
      queuePinchScale(next);
    };

    const onEnd = (e) => {
      if (e.touches.length < 2) {
        pinching = false;
        if (pinchPending != null) flushPinchScale();
      }
    };

    target.addEventListener('touchstart', onStart, { passive: true });
    target.addEventListener('touchmove', onMove, { passive: false });
    target.addEventListener('touchend', onEnd, { passive: true });
    target.addEventListener('touchcancel', onEnd, { passive: true });

    pinchCleanup = () => {
      target.removeEventListener('touchstart', onStart);
      target.removeEventListener('touchmove', onMove);
      target.removeEventListener('touchend', onEnd);
      target.removeEventListener('touchcancel', onEnd);
      if (pinchRaf) {
        cancelAnimationFrame(pinchRaf);
        pinchRaf = 0;
      }
    };
  }

  function focusVerse(verseNum, { behavior = 'smooth' } = {}) {
    if (!verses.some((v) => v.verse === verseNum)) return;
    activeVerse = verseNum;
    root.querySelectorAll('.verse--active').forEach((el) => {
      el.classList.remove('verse--active');
      el.setAttribute('aria-current', 'false');
    });
    const target = root.querySelector(`[data-verse="${verseNum}"]`);
    const jump = root.querySelector('[data-verse-jump]');
    if (jump) jump.value = String(verseNum);
    if (target) {
      target.classList.add('verse--active');
      target.setAttribute('aria-current', 'true');
    }
    syncVerseNavigation();
    target?.scrollIntoView({ behavior, block: 'center' });
    target?.focus({ preventScroll: true });
  }

  function syncVerseNavigation() {
    const index = verses.findIndex((v) => v.verse === activeVerse);
    const prev = root.querySelector('[data-prev-verse]');
    const next = root.querySelector('[data-next-verse]');
    if (prev) prev.disabled = index <= 0;
    if (next) next.disabled = index < 0 || index >= verses.length - 1;
  }

  function showToast(msg) {
    const toast = root.querySelector('#reading-toast');
    if (!toast) return;
    toast.hidden = false;
    toast.textContent = msg;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => {
      toast.hidden = true;
    }, 2200);
  }

  function versePayload(verseNum) {
    const v = verses.find((x) => x.verse === verseNum);
    if (!v) return null;
    const { field } = tabConfig(activeTab, v.originalLang);
    return {
      bookId: book.id,
      chapter: cap,
      verse: verseNum,
      ref: `${book.name} ${cap}:${verseNum}`,
      snippet: v.portuguese || v[field] || '',
    };
  }

  function openVerseSheet(verseNum) {
    sheetVerse = versePayload(verseNum);
    if (!sheetVerse) return;
    const sheet = root.querySelector('#verse-sheet');
    const refEl = root.querySelector('[data-sheet-ref]');
    const snipEl = root.querySelector('[data-sheet-snip]');
    const unmarkBtn = root.querySelector('[data-action="desmarcar"]');
    if (refEl) refEl.textContent = sheetVerse.ref;
    if (snipEl) snipEl.textContent = sheetVerse.snippet;
    const marked = isMarked(book.id, cap, verseNum);
    if (unmarkBtn) unmarkBtn.hidden = !marked;
    if (sheet) sheet.hidden = false;
  }

  function closeVerseSheet() {
    const sheet = root.querySelector('#verse-sheet');
    if (sheet) sheet.hidden = true;
  }

  function openDevoPicker() {
    const picker = root.querySelector('#devo-picker');
    const listEl = root.querySelector('[data-devo-list]');
    const list = getDevocionais();
    if (listEl) {
      if (!list.length) {
        listEl.innerHTML =
          '<p class="hint">Você ainda não tem devocionais. Crie uma nova abaixo.</p>';
      } else {
        listEl.innerHTML = list
          .map(
            (d) => `
            <button type="button" class="sheet-option" data-devo-pick="${escapeHtml(d.id)}">
              <strong>${escapeHtml(d.title)}</strong>
              <span>${(d.verseRefs || []).length} versículo(s)</span>
            </button>`
          )
          .join('');
        listEl.querySelectorAll('[data-devo-pick]').forEach((btn) => {
          btn.addEventListener('click', () => {
            if (!sheetVerse) return;
            associateVerseToDevocional(btn.getAttribute('data-devo-pick'), sheetVerse);
            picker.hidden = true;
            closeVerseSheet();
            paint();
            showToast('Versículo associado à devocional.');
          });
        });
      }
    }
    if (picker) picker.hidden = false;
  }

  function bindSheets() {
    root.querySelector('[data-sheet-close]')?.addEventListener('click', closeVerseSheet);
    root.querySelector('#verse-sheet')?.addEventListener('click', (e) => {
      if (e.target.id === 'verse-sheet') closeVerseSheet();
    });

    root.querySelector('[data-action="marcar"]')?.addEventListener('click', () => {
      if (!sheetVerse) return;
      setMark(sheetVerse.bookId, sheetVerse.chapter, sheetVerse.verse, true);
      closeVerseSheet();
      paint();
      showToast('Versículo marcado.');
    });

    root.querySelector('[data-action="salvar"]')?.addEventListener('click', () => {
      if (!sheetVerse) return;
      saveMarkEntry(sheetVerse);
      closeVerseSheet();
      paint();
      showToast('Marcado e salvo.');
    });

    root.querySelector('[data-action="associar"]')?.addEventListener('click', () => {
      if (!sheetVerse) return;
      setMark(sheetVerse.bookId, sheetVerse.chapter, sheetVerse.verse, true);
      openDevoPicker();
    });

    root.querySelector('[data-action="desmarcar"]')?.addEventListener('click', () => {
      if (!sheetVerse) return;
      setMark(sheetVerse.bookId, sheetVerse.chapter, sheetVerse.verse, false);
      closeVerseSheet();
      paint();
      showToast('Marcação removida.');
    });

    root.querySelector('[data-devo-close]')?.addEventListener('click', () => {
      const picker = root.querySelector('#devo-picker');
      if (picker) picker.hidden = true;
    });
    root.querySelector('#devo-picker')?.addEventListener('click', (e) => {
      if (e.target.id === 'devo-picker') e.target.hidden = true;
    });
    root.querySelector('[data-devo-new]')?.addEventListener('click', () => {
      if (!sheetVerse) return;
      const created = createDevocional({
        title: `Reflexão — ${sheetVerse.ref}`,
        body: '',
        verseRefs: [sheetVerse],
      });
      setMark(sheetVerse.bookId, sheetVerse.chapter, sheetVerse.verse, true);
      navigate(`/devocionais/${created.id}`);
    });
  }

  loadVerses();
  if (pendingDeepLink != null) {
    const targetVerse = pendingDeepLink;
    pendingDeepLink = null;
    const go = () => focusVerse(targetVerse, { behavior: 'auto' });
    requestAnimationFrame(() => requestAnimationFrame(go));
    setTimeout(go, 120);
  }
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
