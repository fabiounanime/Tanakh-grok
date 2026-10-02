import { navigate } from '../utils/router.js';

export function renderFavorites(root) {
  root.innerHTML = `
    <header class="app-header">
      <button class="btn-icon" type="button" data-back aria-label="Voltar">←</button>
      <h1>Favoritos</h1>
    </header>
    <main class="page">
      <div class="placeholder-page">
        <div class="big-ico" aria-hidden="true">★</div>
        <h2>Em breve</h2>
        <p>Aqui você poderá salvar versículos e passagens favoritas. Esta tela é um placeholder.</p>
      </div>
    </main>
  `;
  root.querySelector('[data-back]')?.addEventListener('click', () => navigate('/'));
}
