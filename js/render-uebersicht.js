function renderUebersicht() {
  const view = document.getElementById('view-uebersicht');
  const now = new Date();
  const { income, expense, diff } = getMonthSummary(now.getFullYear(), now.getMonth() + 1);
  const total = getTotalBalance();

  const recent = sortedTransactionsDesc().slice(0, 5);
  const accounts = getAccounts().filter(a => !a.archived);
  const recentHtml = recent.length ? recent.map(t => renderTxnItem(t, accounts)).join('') :
    `<div class="empty-state">Noch keine Buchungen erfasst.</div>`;

  view.innerHTML = `
    <div class="card">
      <h2>Gesamtsaldo</h2>
      <div class="stat-value">${formatCurrency(total)}</div>
    </div>
    <div class="card">
      <h2>Dieser Monat</h2>
      <div class="stat-row"><span class="stat-label">Einnahmen</span><span class="stat-value income">${formatCurrency(income)}</span></div>
      <div class="stat-row"><span class="stat-label">Ausgaben</span><span class="stat-value expense">${formatCurrency(expense)}</span></div>
      <div class="stat-row"><span class="stat-label">Differenz</span><span class="stat-value">${formatCurrency(diff)}</span></div>
    </div>
    <div class="card">
      <h2>Letzte Buchungen</h2>
      <div class="txn-list">${recentHtml}</div>
    </div>
  `;

  view.querySelectorAll('.txn-item').forEach(el => {
    el.addEventListener('click', () => openTxnModal({ id: el.dataset.id }));
  });
}

function updateHeaderBalance() {
  document.getElementById('headerBalance').textContent = formatCurrency(getTotalBalance());
}
