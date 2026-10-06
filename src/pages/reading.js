import { getBookById } from '../data/books.js';
import {
  loadVersesForVersion,
  getChapterNotes,
  getChapterOriginalLang,
  originalLangLabel,
  getBookData,
} from '../data/verses.js';
import { lookupGloss, findFormInBook, tokenizeOriginal } from '../data/lexicon.js';
import { FIXED_PT_VERSION } from '../data/versions.js';
import { navigate, routes } from '../utils/router.js';
import { shareVerseCard } from '../utils/shareCard.js';
import {
  isMarked,
  setMark,
  saveMarkEntry,
  getDevocionais,
  createDevocional,
  associateVerseToDevocional,
  getFontScale,
  setFontScale,
  bumpFontScale,
  setLastRead,
  FONT_SCALE_MIN,
  FONT_SCALE_MAX,
  FONT_SCALE_STEP,
} from '../utils/storage.js';

const TRANSLIT_KEY = 'biblia-tanakh:showTranslit';
const ORIGINAL_KEY = 'biblia-tanakh:showOriginal';
let pendingChapterTurn = null;

function readShowTranslit() {
  return localStorage.getItem(TRANSLIT_KEY) === '1';
}

function readShowOriginal() {
  return localStorage.getItem(ORIGINAL_KEY) !== '0';
}

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
  let sheetVerse = null;
  let cardObserver = null;
  const deepLinkNum =
    deepLinkVerse != null && Number.isFinite(Number(deepLinkVerse))
      ? Number(deepLinkVerse)
      : null;
  let activeVerse = deepLinkNum;
  let pendingDeepLink = deepLinkNum;

  async function loadVerses() {
    paintLoading();
    try {
      verses = await loadVersesForVersion(book.id, cap, FIXED_PT_VERSION);
    } catch (err) {
      console.error(err);
      verses = [];
    }
    if (activeVerse == null || !verses.some((v) => v.verse === activeVerse)) {
      activeVerse = verses[0]?.verse ?? null;
    }
    paint();
    rememberRead(activeVerse);
  }

  function paintLoading() {
    root.innerHTML = `
      <header class="app-header">
        <button class="btn-icon" type="button" data-back aria-label="Voltar aos capítulos">←</button>
        <h1>${escapeHtml(book.name)}</h1>
      </header>
      <main class="page page--reading">
        <p class="hint" style="padding:1rem">Carregando capítulo…</p>
      </main>`;
    root.querySelector('[data-back]')?.addEventListener('click', () =>
      navigate(`/livro/${book.id}`)
    );
  }

  const paint = () => {
    const prevDisabled = cap <= 1;
    const nextDisabled = cap >= book.chapters;
    const firstVerse = verses[0]?.verse ?? null;
    const lastVerse = verses[verses.length - 1]?.verse ?? null;
    if (activeVerse === null || !verses.some((v) => v.verse === activeVerse)) {
      activeVerse = firstVerse;
    }
    const chapterLang = getChapterOriginalLang(book.id, cap, verses);
    const originalLabel = originalLangLabel(chapterLang);
    const showTr = readShowTranslit();
    const showOrig = readShowOriginal();
    const notes = getChapterNotes(book.id, cap);
    const chapterOptions = Array.from({ length: book.chapters }, (_, i) => {
      const n = i + 1;
      return `<option value="${n}" ${n === cap ? 'selected' : ''}>${n}</option>`;
    }).join('');

    let body;
    if (!verses.length) {
      body = `
        <div class="placeholder-chapter">
          <strong>Capítulo em breve</strong>
          <p>Ainda não há texto para ${escapeHtml(book.name)} ${cap}.</p>
        </div>`;
    } else {
      const navFirst = verses[0]?.verse ?? null;
      if (activeVerse == null || !verses.some((v) => v.verse === activeVerse)) {
        activeVerse = navFirst;
      }
      const items = verses
        .map((v) => {
          const lang = v.originalLang || chapterLang;
          const rtl = lang === 'he' || lang === 'arc';
          const langCode = lang === 'el' ? 'el' : lang === 'arc' ? 'arc' : 'he';
          const pt = (v.portuguese || '').trim();
          const orig = (v.original || '').trim();
          const tr = (v.transliteration || '').trim();
          const marked = isMarked(book.id, cap, v.verse);
          const isActive = activeVerse === v.verse;
          const ptInner = pt
            ? escapeHtml(pt)
            : '<span class="verse-pt__soon">Português em breve</span>';
          return `
            <span
              class="verse verse-card${marked ? ' verse--marked' : ''}${isActive ? ' verse--active' : ''}"
              data-verse="${v.verse}"
              role="button"
              tabindex="0"
              aria-posinset="${v.verse}"
              aria-current="${isActive ? 'true' : 'false'}"
              aria-label="Versículo ${v.verse}"
            ><span class="verse-pt"><sup class="v-num">${v.verse}</sup><span class="v-text" lang="pt">${ptInner}</span></span>${
              orig
                ? `<span class="verse-orig" lang="${langCode}" dir="${rtl ? 'rtl' : 'ltr'}">${renderOriginalWords(orig)}</span>`
                : ''
            }${tr ? `<span class="verse-tr" lang="la">${escapeHtml(tr)}</span>` : ''}</span>`;
        })
        .join('');
      const notesHtml = notes.length
        ? `<aside class="chapter-notes" aria-label="Notas do capítulo">
            <h3 class="chapter-notes__title">Notas e observações</h3>
            <ul class="chapter-notes__list">
              ${notes.map((n) => `<li>${escapeHtml(n)}</li>`).join('')}
            </ul>
          </aside>`
        : '';
      body = `
        <div class="verse-flow" role="list">${items}</div>
        ${notesHtml}`;
    }

    const enterTurn = pendingChapterTurn;
    pendingChapterTurn = null;
    const turnClass =
      enterTurn === 'next' ? ' is-turn-in-next' : enterTurn === 'prev' ? ' is-turn-in-prev' : '';

    root.innerHTML = `
      <header class="app-header reading-top">
        <button class="btn-icon" type="button" data-back aria-label="Voltar aos capítulos">←</button>
        <div class="reading-top__tools">
          <button type="button" class="origin-tr${showOrig ? ' is-on' : ''}" data-original aria-pressed="${showOrig ? 'true' : 'false'}">${escapeHtml(originalLabel)}</button>
          <button type="button" class="origin-tr${showTr ? ' is-on' : ''}" data-translit aria-pressed="${showTr ? 'true' : 'false'}">transliterado</button>
          <div class="font-size-controls" role="group" aria-label="Tamanho da fonte">
            <button type="button" data-font-dec aria-label="Diminuir fonte" title="Diminuir fonte">A−</button>
            <button type="button" class="font-btn--plus" data-font-inc aria-label="Aumentar fonte" title="Aumentar fonte">A+</button>
          </div>
        </div>
        <nav class="reading-address" aria-label="Endereço da leitura">
          <button type="button" data-go-books>Bíblia</button>
          <span class="reading-address__sep" aria-hidden="true">/</span>
          <button type="button" data-go-book>${escapeHtml(book.name)}</button>
          <span class="reading-address__sep" aria-hidden="true">/</span>
          <label class="reading-address__cap">
            Cap.
            <select data-chapter-jump aria-label="Escolher capítulo">${chapterOptions}</select>
          </label>
        </nav>
      </header>
      <main class="page page--reading${showOrig ? ' is-original' : ''}${showTr ? ' is-translit' : ''}${turnClass}">
        <div>${body}</div>
      </main>
      <div class="sheet-backdrop" id="verse-sheet" hidden>
        <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="verse-sheet-title">
          <div class="sheet__handle" aria-hidden="true"></div>
          <h3 class="sheet__title" id="verse-sheet-title">Versículo</h3>
          <p class="sheet__ref" data-sheet-ref></p>
          <p class="sheet__snippet" data-sheet-snip></p>
          <div class="sheet__words" data-sheet-words></div>
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
              <strong>Associar a um devocional</strong>
              <span>Marca o versículo e vincula a uma reflexão</span>
            </button>
            <button type="button" class="sheet-option" data-action="enviar">
              <strong>Enviar cartão</strong>
              <span>Imagem com o português e o original</span>
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
      <div class="sheet-backdrop" id="word-sheet" hidden>
        <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="word-sheet-title">
          <div class="sheet__handle" aria-hidden="true"></div>
          <h3 class="sheet__title" id="word-sheet-title" data-word-title>Palavra</h3>
          <div data-word-body></div>
          <button type="button" class="sheet-option" data-word-share>
            <strong>Enviar cartão</strong>
            <span>Imagem deste versículo</span>
          </button>
          <button type="button" class="sheet__cancel" data-word-close>Fechar</button>
        </div>
      </div>
      <div class="toast" id="reading-toast" hidden role="status"></div>
    `;

    root.querySelector('[data-back]')?.addEventListener('click', () =>
      navigate(`/livro/${book.id}`)
    );
    root.querySelector('[data-go-books]')?.addEventListener('click', () => navigate('/biblia'));
    root.querySelector('[data-go-book]')?.addEventListener('click', () => navigate(`/livro/${book.id}`));
    root.querySelector('[data-chapter-jump]')?.addEventListener('change', (e) => {
      const next = Number(e.target.value);
      if (next && next !== cap) navigate(`/ler/${book.id}/${next}`);
    });
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
    root.querySelector('[data-original]')?.addEventListener('click', () => {
      const next = !readShowOriginal();
      localStorage.setItem(ORIGINAL_KEY, next ? '1' : '0');
      const page = root.querySelector('.page--reading');
      const btn = root.querySelector('[data-original]');
      page?.classList.toggle('is-original', next);
      btn?.classList.toggle('is-on', next);
      btn?.setAttribute('aria-pressed', next ? 'true' : 'false');
    });
    root.querySelector('[data-translit]')?.addEventListener('click', () => {
      const next = !readShowTranslit();
      localStorage.setItem(TRANSLIT_KEY, next ? '1' : '0');
      const page = root.querySelector('.page--reading');
      const btn = root.querySelector('[data-translit]');
      page?.classList.toggle('is-translit', next);
      btn?.classList.toggle('is-on', next);
      btn?.setAttribute('aria-pressed', next ? 'true' : 'false');
    });

    root.querySelectorAll('.verse[data-verse]').forEach((el) => {
      const verseNum = () => Number(el.getAttribute('data-verse'));
      const open = (event) => {
        const lex = event?.target?.closest?.('[data-lex]');
        activeVerse = verseNum();
        syncVerseNavigation();
        openVerseSheet(activeVerse, lex ? lex.getAttribute('data-lex') : '');
      };
      el.addEventListener('click', open);
      el.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open(event);
        }
      });
    });

    if (cardObserver) cardObserver.disconnect();
    const cards = [...root.querySelectorAll('.verse-card')];
    if (cards.length && 'IntersectionObserver' in window) {
      cardObserver = new IntersectionObserver(
        (entries) => {
          const best = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (!best) return;
          const n = Number(best.target.getAttribute('data-verse'));
          if (!Number.isFinite(n) || n === activeVerse) return;
          activeVerse = n;
          cards.forEach((card) => {
            const on = Number(card.getAttribute('data-verse')) === n;
            card.classList.toggle('verse--active', on);
            card.setAttribute('aria-current', on ? 'true' : 'false');
          });
          const jump = root.querySelector('[data-verse-jump]');
          if (jump) jump.value = String(n);
          syncVerseNavigation();
          rememberRead(n);
        },
        { threshold: [0.55, 0.75] }
      );
      cards.forEach((card) => cardObserver.observe(card));
    }

    bindSheets();
    bindFontControls();
    bindPinchZoom();
    bindChapterSwipe();
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

  let swipeCleanup = null;

  function bindChapterSwipe() {
    if (typeof swipeCleanup === 'function') {
      swipeCleanup();
      swipeCleanup = null;
    }
    const target = root.querySelector('.page--reading');
    if (!target) return;

    let startX = 0;
    let startY = 0;
    let tracking = false;
    let locked = false;
    let swallowClick = false;

    const interactive = (node) =>
      node instanceof Element &&
      Boolean(node.closest('button, a, input, select, textarea, label'));

    const turnChapter = (direction) => {
      if (locked) return;
      const delta = direction === 'next' ? 1 : -1;
      const dest = cap + delta;
      const page = root.querySelector('.page--reading');
      if (dest < 1 || dest > book.chapters) {
        if (!page) return;
        page.classList.remove('is-turn-bounce-next', 'is-turn-bounce-prev');
        void page.offsetWidth;
        page.classList.add(direction === 'next' ? 'is-turn-bounce-next' : 'is-turn-bounce-prev');
        return;
      }
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce || !page) {
        navigate(`/ler/${book.id}/${dest}`);
        return;
      }
      locked = true;
      page.classList.add(direction === 'next' ? 'is-turn-out-next' : 'is-turn-out-prev');
      pendingChapterTurn = direction;
      window.setTimeout(() => {
        locked = false;
        navigate(`/ler/${book.id}/${dest}`);
      }, 160);
    };

    const onClickCapture = (event) => {
      if (!swallowClick) return;
      swallowClick = false;
      event.preventDefault();
      event.stopPropagation();
    };

    const onStart = (event) => {
      if (window.matchMedia('(min-width: 1024px)').matches) return;
      if (event.touches.length !== 1) {
        tracking = false;
        return;
      }
      if (root.querySelector('#verse-sheet:not([hidden]), #word-sheet:not([hidden]), #devo-picker:not([hidden])')) return;
      if (interactive(event.target)) return;
      const touch = event.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      tracking = true;
    };

    const onEnd = (event) => {
      if (!tracking) return;
      tracking = false;
      const touch = event.changedTouches[0];
      if (!touch) return;
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (Math.abs(dx) < 72 || Math.abs(dx) < Math.abs(dy) * 1.35) return;
      swallowClick = true;
      turnChapter(dx < 0 ? 'next' : 'prev');
    };

    const onCancel = () => {
      tracking = false;
    };

    root.addEventListener('click', onClickCapture, true);
    target.addEventListener('touchstart', onStart, { passive: true });
    target.addEventListener('touchend', onEnd, { passive: true });
    target.addEventListener('touchcancel', onCancel, { passive: true });
    swipeCleanup = () => {
      root.removeEventListener('click', onClickCapture, true);
      target.removeEventListener('touchstart', onStart);
      target.removeEventListener('touchend', onEnd);
      target.removeEventListener('touchcancel', onCancel);
    };
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
    rememberRead(verseNum);
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

  let rememberTimer = 0;

  function rememberRead(verseNum = activeVerse) {
    const verse = verses.find((item) => item.verse === verseNum);
    window.clearTimeout(rememberTimer);
    rememberTimer = window.setTimeout(() => {
      setLastRead({
        bookId: book.id,
        bookName: book.name,
        chapter: cap,
        verse: verseNum || 1,
        snippet: verse?.portuguese || '',
      });
    }, 200);
  }

  function openWordSheet(verseNum, word) {
    const verse = verses.find((item) => item.verse === verseNum);
    if (!verse) return;
    const sheet = root.querySelector('#word-sheet');
    const title = root.querySelector('[data-word-title]');
    const body = root.querySelector('[data-word-body]');
    if (!sheet || !title || !body) return;
    sheet.dataset.verse = String(verseNum);
    const lang = verse.originalLang || verse.lang || 'he';
    if (!word) {
      const words = tokenizeOriginal(verse.original);
      title.textContent = `${book.name} ${cap}:${verseNum}`;
      body.innerHTML = words.length
        ? `<p class="hint">Toque uma palavra do original.</p><div class="lex-picks">${words
            .map(
              (item) =>
                `<button type="button" class="lex-pick" data-lex-pick="${escapeHtml(item)}">${escapeHtml(item)}</button>`
            )
            .join('')}</div>`
        : '<p class="hint">Este versículo não tem texto original.</p>';
      body.querySelectorAll('[data-lex-pick]').forEach((btn) => {
        btn.addEventListener('click', () => openWordSheet(verseNum, btn.getAttribute('data-lex-pick')));
      });
      sheet.hidden = false;
      return;
    }
    const info = lookupGloss(word, lang);
    const hits = findFormInBook(getBookData(book.id), info.key, lang, 24);
    title.textContent = word;
    const gloss = info.gloss
      ? `${info.prefixed ? 'A palavra leva um prefixo. O sentido da base é: ' : ''}${info.gloss}`
      : 'Esta lista ainda não tem a glosa desta forma. Abaixo está a mesma forma escrita neste livro.';
    body.innerHTML = `
      <p class="lex-form">Forma: ${escapeHtml(info.key || word)}</p>
      ${info.root ? `<p class="lex-root">Raiz: ${escapeHtml(info.root)}</p>` : ''}
      <p class="lex-gloss">${escapeHtml(gloss)}</p>
      <h4 class="lex-hits-title">A mesma forma em ${escapeHtml(book.name)}</h4>
      ${
        hits.length
          ? `<ul class="lex-hits">${hits
              .map(
                (hit) => `<li><a href="${routes.readingVerse(book.id, hit.chapter, hit.verse)}">${escapeHtml(book.name)} ${hit.chapter}:${hit.verse}</a><span>${escapeHtml((hit.portuguese || hit.original || '').slice(0, 120))}</span></li>`
              )
              .join('')}</ul>`
          : '<p class="hint">Nenhuma ocorrência desta forma neste livro.</p>'
      }`;
    sheet.hidden = false;
  }

  async function sendVerseCard(verseNum) {
    const verse = verses.find((item) => item.verse === verseNum);
    if (!verse) return;
    const lang = verse.originalLang || verse.lang || 'he';
    try {
      const mode = await shareVerseCard({
        ref: `${book.name} ${cap}:${verseNum}`,
        portuguese: verse.portuguese || '',
        original: verse.original || '',
        rtl: lang === 'he' || lang === 'arc',
      });
      showToast(mode === 'shared' ? 'Cartão pronto para enviar.' : 'Cartão guardado na imagem.');
    } catch (err) {
      if (err?.name === 'AbortError') return;
      showToast('Não deu para criar o cartão.');
    }
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
    return {
      bookId: book.id,
      chapter: cap,
      verse: verseNum,
      ref: `${book.name} ${cap}:${verseNum}`,
      snippet: v.portuguese || v.original || '',
    };
  }

  function wordDetailHtml(verse, word) {
    const lang = verse.originalLang || verse.lang || 'he';
    const info = lookupGloss(word, lang);
    const hits = findFormInBook(getBookData(book.id), info.key, lang, 24);
    const gloss = info.gloss
      ? `${info.prefixed ? 'A palavra leva um prefixo. O sentido da base é: ' : ''}${info.gloss}`
      : 'Esta lista ainda não tem a glosa desta forma. Abaixo está a mesma forma escrita neste livro.';
    return `
      <p class="lex-form">Forma: ${escapeHtml(info.key || word)}</p>
      ${info.root ? `<p class="lex-root">Raiz: ${escapeHtml(info.root)}</p>` : ''}
      <p class="lex-gloss">${escapeHtml(gloss)}</p>
      <h4 class="lex-hits-title">A mesma forma em ${escapeHtml(book.name)}</h4>
      ${
        hits.length
          ? `<ul class="lex-hits">${hits
              .map(
                (hit) => `<li><a href="${routes.readingVerse(book.id, hit.chapter, hit.verse)}">${escapeHtml(book.name)} ${hit.chapter}:${hit.verse}</a><span>${escapeHtml((hit.portuguese || hit.original || '').slice(0, 120))}</span></li>`
              )
              .join('')}</ul>`
          : '<p class="hint">Nenhuma ocorrência desta forma neste livro.</p>'
      }`;
  }

  function fillSheetWords(verseNum, focusWord) {
    const box = root.querySelector('[data-sheet-words]');
    const verse = verses.find((item) => item.verse === verseNum);
    if (!box || !verse) return;
    const words = tokenizeOriginal(verse.original);
    if (!words.length) {
      box.innerHTML = '';
      return;
    }
    const lang = verse.originalLang || verse.lang || 'he';
    box.innerHTML = `
      <p class="sheet__words-label">Palavras em ${escapeHtml(originalLangLabel(lang))}</p>
      <div class="lex-picks">${words
        .map((item) => {
          const on = focusWord && item === focusWord;
          return `<button type="button" class="lex-pick${on ? ' is-on' : ''}" data-lex-pick="${escapeHtml(item)}">${escapeHtml(item)}</button>`;
        })
        .join('')}</div>
      <div class="sheet__lex">${focusWord ? wordDetailHtml(verse, focusWord) : '<p class="hint">Toque uma palavra para ver o sentido.</p>'}</div>`;
    box.querySelectorAll('[data-lex-pick]').forEach((btn) => {
      btn.addEventListener('click', () => fillSheetWords(verseNum, btn.getAttribute('data-lex-pick') || ''));
    });
  }

  function openVerseSheet(verseNum, focusWord = '') {
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
    fillSheetWords(verseNum, focusWord);
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
    root.querySelector('[data-action="enviar"]')?.addEventListener('click', () => {
      if (!sheetVerse) return;
      const verseNum = sheetVerse.verse;
      closeVerseSheet();
      sendVerseCard(verseNum);
    });
    root.querySelector('[data-word-close]')?.addEventListener('click', () => {
      const sheet = root.querySelector('#word-sheet');
      if (sheet) sheet.hidden = true;
    });
    root.querySelector('#word-sheet')?.addEventListener('click', (event) => {
      if (event.target.id === 'word-sheet') event.target.hidden = true;
    });
    root.querySelector('[data-word-share]')?.addEventListener('click', () => {
      const sheet = root.querySelector('#word-sheet');
      const verseNum = Number(sheet?.dataset.verse);
      if (sheet) sheet.hidden = true;
      sendVerseCard(verseNum);
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

function renderOriginalWords(text) {
  return String(text)
    .split(/(\s+|־)/)
    .map((part) => {
      if (!part || /^\s+$/.test(part) || part === '־') return escapeHtml(part);
      const token = part.replace(/^[.,;:!?«»"'()]+|[.,;:!?«»"'()׃׀]+$/g, '');
      if (!token) return escapeHtml(part);
      return `<span class="lex-word" data-lex="${escapeHtml(token)}">${escapeHtml(part)}</span>`;
    })
    .join('');
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
