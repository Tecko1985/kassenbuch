let budgetViewYear = new Date().getFullYear();
let budgetViewMonth = new Date().getMonth() + 1;

function renderBudgets() {
  const view = document.getElementById('view-budgets');
  const budgets = getBudgets();
  const expenseCats = getCategories('expense');

  const itemsHtml = budgets.length ? budgets.map(b => {
    const { spent, limit, percent, over } = getBudgetProgress(b.category, budgetViewYear, budgetViewMonth);
    const barClass = over ? 'over' : percent >= 80 ? 'warn' : 'ok';
    return `
      <div class="budget-item" data-category="${escapeHtml(b.category)}">
        <div class="budget-top">
          <span class="budget-cat">${escapeHtml(b.category)}</span>
          <span class="budget-amounts">${formatCurrency(spent)} / ${formatCurrency(limit)}</span>
        </div>
        <div class="budget-bar-bg"><div class="budget-bar-fill ${barClass}" style="width:${percent}%"></div></div>
      </div>
    `;
  }).join('') : `<div class="empty-state">Noch keine Budgets festgelegt.</div>`;

  const monthLabel = formatMonthLabel(`${budgetViewYear}-${String(budgetViewMonth).padStart(2, '0')}`);

  view.innerHTML = `
    <div class="card">
      <h2>Budgets</h2>
      <div class="month-switcher">
        <button type="button" id="budgetPrevMonth">‹</button>
        <span>${monthLabel}</span>
        <button type="button" id="budgetNextMonth">›</button>
      </div>
      <div id="budgetList">${itemsHtml}</div>
      <div class="modal-actions" style="margin-top:16px">
        <button type="button" class="btn-primary" id="newBudgetBtn" ${expenseCats.length === 0 ? 'disabled' : ''}>+ Budget</button>
      </div>
    </div>
  `;

  document.getElementById('budgetPrevMonth').addEventListener('click', () => { shiftBudgetMonth(-1); });
  document.getElementById('budgetNextMonth').addEventListener('click', () => { shiftBudgetMonth(1); });
  document.getElementById('newBudgetBtn').addEventListener('click', () => openBudgetModal(null));

  view.querySelectorAll('.budget-item').forEach(el => {
    el.addEventListener('click', () => openBudgetModal(el.dataset.category));
  });
}

function shiftBudgetMonth(delta) {
  budgetViewMonth += delta;
  if (budgetViewMonth > 12) { budgetViewMonth = 1; budgetViewYear++; }
  if (budgetViewMonth < 1) { budgetViewMonth = 12; budgetViewYear--; }
  renderBudgets();
}

function openBudgetModal(category) {
  const form = document.getElementById('budgetForm');
  form.reset();
  const allExpenseCats = getCategories('expense');
  const usedCats = getBudgets().map(b => b.category);
  const available = category ? allExpenseCats : allExpenseCats.filter(c => !usedCats.includes(c));

  populateSelect('budgetCategory', available.map(c => ({ value: c, label: c })));
  const deleteBtn = document.getElementById('budgetDeleteBtn');

  if (category) {
    const budget = getBudgets().find(b => b.category === category);
    document.getElementById('budgetCategory').value = category;
    document.getElementById('budgetCategory').disabled = true;
    document.getElementById('budgetLimit').value = budget?.limit ?? '';
    deleteBtn.style.display = '';
    deleteBtn.dataset.category = category;
  } else {
    document.getElementById('budgetCategory').disabled = false;
    deleteBtn.style.display = 'none';
  }

  openModal('budgetModalBackdrop');
}

function wireBudgetModal() {
  document.getElementById('budgetCancelBtn').addEventListener('click', () => closeModal('budgetModalBackdrop'));

  document.getElementById('budgetDeleteBtn').addEventListener('click', (e) => {
    const category = e.target.dataset.category;
    if (!category) return;
    if (!confirm(`Budget für „${category}" löschen?`)) return;
    deleteBudget(category);
    closeModal('budgetModalBackdrop');
    toast('Budget gelöscht');
    rerenderAll();
  });

  document.getElementById('budgetForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const category = document.getElementById('budgetCategory').value;
    const limit = parseFloat(document.getElementById('budgetLimit').value);
    if (!category) return toast('Bitte eine Kategorie wählen.');
    if (!limit || limit <= 0) return toast('Bitte ein gültiges Limit eingeben.');
    upsertBudget(category, limit);
    closeModal('budgetModalBackdrop');
    toast('Budget gespeichert');
    rerenderAll();
  });
}
