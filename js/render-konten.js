function renderKonten() {
  const view = document.getElementById('view-konten');
  const accounts = getAccounts().filter(a => !a.archived);

  const cardsHtml = accounts.length
    ? accounts.map(a => `
      <div class="account-card" data-id="${a.id}">
        <span class="account-icon">${escapeHtml(a.icon || '💰')}</span>
        <span class="account-name">${escapeHtml(a.name)}</span>
        <span class="account-balance">${formatCurrency(getAccountBalance(a.id))}</span>
      </div>
    `).join('')
    : `<div class="empty-state">Noch keine Konten angelegt.</div>`;

  view.innerHTML = `
    <div class="card">
      <h2>Konten</h2>
      <div id="accountList">${cardsHtml}</div>
      <div class="modal-actions" style="margin-top:16px">
        <button type="button" class="btn-secondary" id="newAccountBtn">+ Konto</button>
        <button type="button" class="btn-primary" id="transferBtn">⇄ Umbuchung</button>
      </div>
    </div>
  `;

  view.querySelectorAll('.account-card').forEach(card => {
    card.addEventListener('click', () => openAccountModal(card.dataset.id));
  });
  document.getElementById('newAccountBtn').addEventListener('click', () => openAccountModal(null));
  document.getElementById('transferBtn').addEventListener('click', () => openTxnModal({ type: 'transfer' }));
}

function openAccountModal(id) {
  const form = document.getElementById('accForm');
  form.reset();
  const archiveBtn = document.getElementById('accArchiveBtn');
  if (id) {
    const acc = getAccounts().find(a => a.id === id);
    document.getElementById('accId').value = acc.id;
    document.getElementById('accName').value = acc.name;
    document.getElementById('accIcon').value = acc.icon || '';
    document.getElementById('accStartBalance').value = acc.startBalance || 0;
    archiveBtn.style.display = '';
  } else {
    document.getElementById('accId').value = '';
    archiveBtn.style.display = 'none';
  }
  openModal('accModalBackdrop');
}

function wireAccountModal() {
  document.getElementById('accCancelBtn').addEventListener('click', () => closeModal('accModalBackdrop'));
  document.getElementById('accArchiveBtn').addEventListener('click', () => {
    const id = document.getElementById('accId').value;
    if (!id) return;
    if (!confirm('Dieses Konto archivieren? Bereits erfasste Buchungen bleiben erhalten.')) return;
    archiveAccount(id);
    closeModal('accModalBackdrop');
    toast('Konto archiviert');
    rerenderAll();
  });
  document.getElementById('accForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('accId').value || genId('acc');
    const name = document.getElementById('accName').value.trim();
    if (!name) return toast('Bitte einen Namen eingeben.');
    const existing = getAccounts().find(a => a.id === id);
    upsertAccount({
      id,
      name,
      icon: document.getElementById('accIcon').value.trim() || '💰',
      startBalance: parseFloat(document.getElementById('accStartBalance').value) || 0,
      // Beim Bearbeiten den Archiv-Status beibehalten — sonst würde ein
      // archiviertes Konto durch bloßes Speichern wieder aktiviert.
      archived: existing ? !!existing.archived : false,
    });
    closeModal('accModalBackdrop');
    toast('Konto gespeichert');
    rerenderAll();
  });
}
