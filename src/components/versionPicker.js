import { listPtVersions } from '../data/versions.js';
import { isApiVersionReady } from '../utils/bibleApi.js';
import { getPtVersion, setPtVersion } from '../utils/storage.js';

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function currentPtVersionMeta() {
  const versions = listPtVersions(isApiVersionReady);
  const id = getPtVersion();
  return versions.find((v) => v.id === id) || versions[0];
}

/** Compact pill button markup (caller inserts into header). */
export function versionPillHtml() {
  const v = currentPtVersionMeta();
  return `
    <button type="button" class="version-pill" data-open-version-picker aria-label="Versão em português" title="Versão em português">
      ${escapeHtml(v.shortLabel)}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
    </button>`;
}

/** Bottom-sheet markup for the Portuguese version list. */
export function versionSheetHtml() {
  const versions = listPtVersions(isApiVersionReady);
  const current = getPtVersion();
  const options = versions
    .map((v) => {
      const disabled = !v.available;
      const selected = v.id === current;
      return `
        <button
          type="button"
          class="sheet-option${selected ? ' sheet-option--selected' : ''}${disabled ? ' sheet-option--disabled' : ''}"
          data-pt-version="${escapeHtml(v.id)}"
          ${disabled ? 'disabled' : ''}
          aria-pressed="${selected}"
        >
          <strong>${escapeHtml(v.label)}${selected ? ' · atual' : ''}</strong>
          <span>${escapeHtml(v.statusNote || v.note)}</span>
        </button>`;
    })
    .join('');

  return `
    <div class="sheet-backdrop" id="pt-version-sheet" hidden>
      <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="pt-version-sheet-title">
        <div class="sheet__handle" aria-hidden="true"></div>
        <h3 class="sheet__title" id="pt-version-sheet-title">Versão em português</h3>
        <p class="sheet__hint">Afeta apenas a aba Português. Hebraico e Transliteração permanecem no texto original.</p>
        <div class="sheet__actions">${options}</div>
        <button type="button" class="sheet__cancel" data-version-close>Cancelar</button>
      </div>
    </div>`;
}

/**
 * Bind pill + sheet. onChange(id) after a successful selection.
 * @param {ParentNode} root
 * @param {{ onChange?: (id: string) => void }} [opts]
 */
export function bindVersionPicker(root, { onChange } = {}) {
  const sheet = root.querySelector('#pt-version-sheet');
  const open = () => {
    if (sheet) sheet.hidden = false;
  };
  const close = () => {
    if (sheet) sheet.hidden = true;
  };

  root.querySelectorAll('[data-open-version-picker]').forEach((btn) => {
    btn.addEventListener('click', open);
  });
  root.querySelector('[data-version-close]')?.addEventListener('click', close);
  sheet?.addEventListener('click', (e) => {
    if (e.target === sheet) close();
  });

  root.querySelectorAll('[data-pt-version]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      const id = btn.getAttribute('data-pt-version');
      if (!id) return;
      setPtVersion(id);
      close();
      if (typeof onChange === 'function') onChange(id);
    });
  });
}
