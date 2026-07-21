let activeView = 'uebersicht';

const VIEW_RENDERERS = {
  uebersicht: renderUebersicht,
  buchungen: renderBuchungen,
  budgets: renderBudgets,
  konten: renderKonten,
  einstellungen: renderEinstellungen,
  info: renderInfo,
};

function switchView(view) {
  activeView = view;
  document.querySelectorAll('.view').forEach(el => el.classList.toggle('active', el.dataset.view === view));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.view === view));
  VIEW_RENDERERS[view]();
}

function rerenderAll() {
  updateHeaderBalance();
  VIEW_RENDERERS[activeView]();
}

function init() {
  seedDefaultsIfEmpty();

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });

  const versionBadge = document.getElementById('version-badge');
  versionBadge.addEventListener('click', () => switchView('info'));
  versionBadge.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); switchView('info'); }
  });

  document.getElementById('fabAdd').addEventListener('click', () => openTxnModal({ type: 'expense' }));

  wireTxnModal();
  wireAccountModal();
  wireBudgetModal();
  wireImportInput();

  switchView('uebersicht');
  updateHeaderBalance();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}

document.addEventListener('DOMContentLoaded', init);
