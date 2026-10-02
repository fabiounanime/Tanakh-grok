import { navigate, routes } from '../utils/router.js';

const META = {
  agenda: {
    title: 'Agenda',
    ico: '📅',
    body: 'Seus compromissos e lembretes de estudo aparecerão aqui. Esta tela é um placeholder.',
  },
  mensagens: {
    title: 'Mensagens',
    ico: '💬',
    body: 'Mensagens e anotações de pregação aparecerão aqui. Esta tela é um placeholder.',
  },
  conta: {
    title: 'Conta',
    ico: '👤',
    body: 'Perfil, preferências e ajustes da conta. Esta tela é um placeholder.',
  },
};

export function renderPlaceholder(root, key) {
  const meta = META[key] || { title: 'Em breve', ico: '✦', body: 'Em breve.' };
  root.innerHTML = `
    <header class="app-header">
      <button class="btn-icon" type="button" data-back aria-label="Voltar">←</button>
      <h1>${meta.title}</h1>
    </header>
    <main class="page">
      <div class="placeholder-page">
        <div class="big-ico" aria-hidden="true">${meta.ico}</div>
        <h2>Em breve</h2>
        <p>${meta.body}</p>
        ${
          key === 'conta'
            ? `<p class="placeholder-links"><a class="link-gold" href="${routes.settings()}">Abrir ajustes</a> · <a class="link-gold" href="${routes.favorites()}">Favoritos</a></p>`
            : ''
        }
      </div>
    </main>
  `;
  root.querySelector('[data-back]')?.addEventListener('click', () => navigate('/'));
}
