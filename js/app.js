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
  flushNotes();
  activeView = view;
  document.querySelectorAll('.view').forEach(el => el.classList.toggle('active', el.dataset.view === view));
  document.querySelectorAll('.tab-btn').forEach(btn => {
    const aktiv = btn.dataset.view === view;
    btn.classList.toggle('active', aktiv);
    // Vorleseprogramm: der aktive Reiter ist nicht nur an der Farbe erkennbar (Abnahme 21.09.2026, D8).
    if (aktiv) btn.setAttribute('aria-current', 'page'); else btn.removeAttribute('aria-current');
  });
  VIEW_RENDERERS[view]();
}

function rerenderAll() {
  flushNotes();
  updateHeaderBalance();
  VIEW_RENDERERS[activeView]();
}

function init() {
  // ⚠️ Beides darf init() nie abbrechen: vorher stand bei vollem Speicher eine
  // leere Seite da, ohne Reiter und ohne Weg zum Export (Bugjagd 23.09.2026, T7-7).
  try {
    seedDefaultsIfEmpty();
  } catch (e) {
    toast('Speichern nicht möglich: ' + e.message, 8000);
  }
  // Die "automatischen Backups" entstehen hier -- einmal je Tag beim Öffnen.
  try {
    autoBackupIfDue();
  } catch (e) {
    toast('Automatische Sicherung nicht möglich: ' + e.message, 8000);
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });

  document.getElementById('fabAdd').addEventListener('click', () => openTxnModal({ type: 'expense' }));

  wireTxnModal();
  wireAccountModal();
  wireBudgetModal();
  wireImportInput();

  // iOS friert die PWA beim Wegwischen ein, ohne 'unload' zu feuern.
  window.addEventListener('pagehide', flushNotes);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) flushNotes();
  });

  switchView('uebersicht');
  updateHeaderBalance();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}

document.addEventListener('DOMContentLoaded', init);
