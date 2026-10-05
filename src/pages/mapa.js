import { books } from '../data/books.js';
import {
  NODES,
  TRAIL,
  POSITIONS,
  childrenOf,
  nodeById,
  dimmedIds,
} from '../data/origins.js';
import { routes } from '../utils/router.js';

const STORAGE_KEY = 'biblia-origens.mapa.v1';
const WORLD = 1680;
const CENTER = WORLD / 2;

const BOOKS_BY_LENGTH = [...books].sort((a, b) => b.name.length - a.name.length);

function loadStudied() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return new Set(Array.isArray(raw) ? raw.filter((id) => typeof id === 'string') : []);
  } catch {
    return new Set();
  }
}

function saveStudied(studied) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...studied]));
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"');
}

function citeTarget(cite) {
  const book = BOOKS_BY_LENGTH.find((item) => cite.startsWith(item.name));
  if (!book) return null;
  const rest = cite.slice(book.name.length).trim();
  const match = rest.match(/^(\d+)[.:](\d+)/);
  if (!match) return null;
  return {
    href: routes.readingVerse(book.id, Number(match[1]), Number(match[2])),
    label: cite,
  };
}

function prefersList() {
  return window.matchMedia('(max-width: 759px)').matches;
}

export function renderMapa(root) {
  const state = {
    selected: 'origens',
    filter: null,
    query: '',
    mode: prefersList() ? 'lista' : 'mapa',
    studied: loadStudied(),
    cam: { x: 0, y: 0, scale: 0.45 },
    pointers: new Map(),
  };

  root.innerHTML = `
    <main class="page page--mapa">
      <header class="mapa-bar">
        <div class="mapa-bar__top">
          <div>
            <p class="mapa-bar__kicker">Bíblia Origens</p>
            <h1>Mapa mental</h1>
          </div>
          <div class="mapa-bar__tools">
            <span class="mapa-progress" data-progress>0/${NODES.length}</span>
            <button type="button" class="mapa-mode" data-mode>Lista</button>
          </div>
        </div>
        <label class="mapa-search">
          <span class="sr-only">Buscar no mapa</span>
          <input type="search" placeholder="Buscar criação, Noé, promessa…" data-search />
        </label>
        <div class="mapa-chips" data-chips></div>
      </header>
      <div class="mapa-stage" data-stage hidden>
        <div class="mapa-world" data-world></div>
      </div>
      <div class="mapa-list" data-list></div>
      <section class="mapa-sheet" data-sheet aria-live="polite"></section>
    </main>
  `;

  const stage = root.querySelector('[data-stage]');
  const world = root.querySelector('[data-world]');
  const list = root.querySelector('[data-list]');
  const sheet = root.querySelector('[data-sheet]');
  const chips = root.querySelector('[data-chips]');
  const search = root.querySelector('[data-search]');
  const modeBtn = root.querySelector('[data-mode]');
  const progress = root.querySelector('[data-progress]');

  const branches = childrenOf('origens');

  function paintChips() {
    const items = [{ id: null, title: 'Tudo' }, ...branches];
    chips.innerHTML = items
      .map((item) => {
        const on = state.filter === item.id;
        return `<button type="button" class="mapa-chip${on ? ' is-on' : ''}" data-filter="${item.id ?? ''}">${escapeHtml(item.title)}</button>`;
      })
      .join('');
  }

  function paintWorld() {
    const dimmed = dimmedIds(state.filter, state.query);
    const lines = NODES.filter((node) => node.parentId)
      .map((node) => {
        const a = POSITIONS.get(node.parentId);
        const b = POSITIONS.get(node.id);
        if (!a || !b) return '';
        const hot = !dimmed.has(node.id) && !dimmed.has(node.parentId);
        return `<line x1="${CENTER + a.x}" y1="${CENTER + a.y}" x2="${CENTER + b.x}" y2="${CENTER + b.y}" class="${hot ? 'is-hot' : ''}" />`;
      })
      .join('');
    const nodes = NODES.map((node) => {
      const p = POSITIONS.get(node.id);
      if (!p) return '';
      const kind = p.depth === 0 ? 'root' : p.depth === 1 ? 'branch' : 'leaf';
      const classes = [
        'mapa-node',
        `mapa-node--${kind}`,
        state.selected === node.id ? 'is-selected' : '',
        state.studied.has(node.id) ? 'is-studied' : '',
        dimmed.has(node.id) ? 'is-dim' : '',
      ]
        .filter(Boolean)
        .join(' ');
      return `<button type="button" class="${classes}" data-id="${node.id}" style="left:${CENTER + p.x}px;top:${CENTER + p.y}px">
        <span>${escapeHtml(node.title)}</span>
        ${kind !== 'leaf' ? '' : `<small>${escapeHtml(node.kicker)}</small>`}
      </button>`;
    }).join('');
    world.innerHTML = `<svg class="mapa-lines" viewBox="0 0 ${WORLD} ${WORLD}" aria-hidden="true">${lines}</svg>${nodes}`;
    applyCam(false);
  }

  function paintList() {
    const dimmed = dimmedIds(state.filter, state.query);
    const blocks = branches
      .filter((branch) => !dimmed.has(branch.id))
      .map((branch) => {
        const leaves = childrenOf(branch.id)
          .filter((leaf) => !dimmed.has(leaf.id))
          .map((leaf) => leafButton(leaf))
          .join('');
        return `<section class="mapa-branch">
          ${leafButton(branch)}
          <div class="mapa-leaves">${leaves}</div>
        </section>`;
      })
      .join('');
    list.innerHTML = blocks || `<p class="mapa-empty">Nada encontrado.</p>`;
  }

  function leafButton(node) {
    const on = state.selected === node.id ? ' is-selected' : '';
    const done = state.studied.has(node.id) ? ' is-studied' : '';
    return `<button type="button" class="mapa-row${on}${done}" data-id="${node.id}">
      <span>${escapeHtml(node.title)}</span>
      <small>${escapeHtml(node.kicker)}</small>
    </button>`;
  }

  function paintSheet() {
    const node = nodeById(state.selected);
    const trail = TRAIL.findIndex((item) => item.id === node.id);
    const next = TRAIL[trail + 1];
    const refs = node.refs
      .map((ref) => {
        const target = citeTarget(ref.cite);
        const cite = target
          ? `<a class="mapa-ref__cite" href="${target.href}">${escapeHtml(ref.cite)}</a>`
          : `<span class="mapa-ref__cite">${escapeHtml(ref.cite)}</span>`;
        return `<li>${cite}<p>${escapeHtml(ref.text)}</p></li>`;
      })
      .join('');
    const done = state.studied.has(node.id);
    sheet.innerHTML = `
      <p class="mapa-sheet__era">${escapeHtml(node.era)}</p>
      <h2>${escapeHtml(node.title)}</h2>
      <p class="mapa-sheet__kicker">${escapeHtml(node.kicker)}</p>
      <p>${escapeHtml(node.summary)}</p>
      <ul class="mapa-points">${node.points.map((point) => `<li>${escapeHtml(point)}</li>`).join('')}</ul>
      <ul class="mapa-refs">${refs}</ul>
      <p class="mapa-reflection">${escapeHtml(node.reflection)}</p>
      <div class="mapa-sheet__actions">
        <button type="button" class="btn-gold" data-studied>${done ? 'Estudado' : 'Marcar como estudado'}</button>
        ${next ? `<button type="button" class="mapa-next" data-next="${next.id}">Seguir · ${escapeHtml(next.title)}</button>` : ''}
      </div>
    `;
    progress.textContent = `${state.studied.size}/${NODES.length}`;
  }

  function applyMode() {
    const mapOn = state.mode === 'mapa';
    stage.hidden = !mapOn;
    list.hidden = mapOn;
    modeBtn.textContent = mapOn ? 'Lista' : 'Mapa';
    root.querySelector('.page--mapa')?.classList.toggle('is-map', mapOn);
  }

  function applyCam(animate) {
    world.style.transition = animate ? 'transform 420ms cubic-bezier(.2,.7,.2,1)' : 'none';
    world.style.transform = `translate(${state.cam.x}px, ${state.cam.y}px) scale(${state.cam.scale})`;
  }

  function fit() {
    const width = stage.clientWidth || window.innerWidth;
    const height = stage.clientHeight || Math.max(320, window.innerHeight * 0.55);
    const scale = Math.min((width - 32) / WORLD, (height - 32) / WORLD, 1);
    state.cam.scale = Math.max(0.22, scale);
    state.cam.x = (width - WORLD * state.cam.scale) / 2;
    state.cam.y = (height - WORLD * state.cam.scale) / 2;
    applyCam(false);
  }

  function focusSelected() {
    const p = POSITIONS.get(state.selected);
    if (!p || state.mode !== 'mapa') return;
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    const scale = state.selected === 'origens' ? state.cam.scale : Math.min(1.15, Math.max(state.cam.scale, 0.72));
    state.cam.scale = scale;
    state.cam.x = width / 2 - (CENTER + p.x) * scale;
    state.cam.y = height / 2 - (CENTER + p.y) * scale;
    applyCam(true);
  }

  function select(id) {
    state.selected = id;
    paintWorld();
    paintList();
    paintSheet();
    focusSelected();
  }

  function render() {
    paintChips();
    paintWorld();
    paintList();
    paintSheet();
    applyMode();
    if (state.mode === 'mapa') requestAnimationFrame(fit);
  }

  chips.addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    state.filter = button.getAttribute('data-filter') || null;
    render();
  });

  search.addEventListener('input', () => {
    state.query = search.value;
    paintWorld();
    paintList();
  });

  modeBtn.addEventListener('click', () => {
    state.mode = state.mode === 'mapa' ? 'lista' : 'mapa';
    applyMode();
    if (state.mode === 'mapa') requestAnimationFrame(() => {
      fit();
      focusSelected();
    });
  });

  root.addEventListener('click', (event) => {
    const node = event.target.closest('[data-id]');
    if (node && root.contains(node)) {
      select(node.getAttribute('data-id'));
      return;
    }
    if (event.target.closest('[data-studied]')) {
      if (state.studied.has(state.selected)) state.studied.delete(state.selected);
      else state.studied.add(state.selected);
      saveStudied(state.studied);
      paintWorld();
      paintList();
      paintSheet();
      return;
    }
    const next = event.target.closest('[data-next]');
    if (next) select(next.getAttribute('data-next'));
  });

  stage.addEventListener('pointerdown', (event) => {
    if (event.target.closest('.mapa-node')) return;
    stage.setPointerCapture(event.pointerId);
    state.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  });
  stage.addEventListener('pointermove', (event) => {
    const prev = state.pointers.get(event.pointerId);
    if (!prev) return;
    state.cam.x += event.clientX - prev.x;
    state.cam.y += event.clientY - prev.y;
    state.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    applyCam(false);
  });
  const end = (event) => state.pointers.delete(event.pointerId);
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);
  stage.addEventListener(
    'wheel',
    (event) => {
      event.preventDefault();
      const next = Math.min(1.6, Math.max(0.2, state.cam.scale * (event.deltaY > 0 ? 0.92 : 1.08)));
      const rect = stage.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      const wx = (px - state.cam.x) / state.cam.scale;
      const wy = (py - state.cam.y) / state.cam.scale;
      state.cam.scale = next;
      state.cam.x = px - wx * next;
      state.cam.y = py - wy * next;
      applyCam(false);
    },
    { passive: false },
  );

  render();
}
