function getAccountBalance(accountId) {
  const account = getAccounts().find(a => a.id === accountId);
  if (!account) return 0;
  let balance = account.startBalance || 0;
  for (const t of getTransactions()) {
    if (t.type === 'income' && t.accountId === accountId) balance += t.amount;
    else if (t.type === 'expense' && t.accountId === accountId) balance -= t.amount;
    else if (t.type === 'transfer') {
      if (t.fromAccountId === accountId) balance -= t.amount;
      if (t.toAccountId === accountId) balance += t.amount;
    }
  }
  return balance;
}

function getTotalBalance() {
  return getAccounts().reduce((sum, a) => sum + getAccountBalance(a.id), 0);
}

function getMonthRange(year, month) {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  return prefix;
}

function getMonthSummary(year, month) {
  const prefix = getMonthRange(year, month);
  const txns = getTransactions().filter(t => t.date.startsWith(prefix));
  const income = txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  return { income, expense, diff: income - expense };
}

function getBudgetProgress(category, year, month) {
  const prefix = getMonthRange(year, month);
  const spent = getTransactions()
    .filter(t => t.type === 'expense' && t.category === category && t.date.startsWith(prefix))
    .reduce((sum, t) => sum + t.amount, 0);
  const budget = getBudgets().find(b => b.category === category);
  const limit = budget ? budget.limit : 0;
  const percent = limit > 0 ? Math.min(100, (spent / limit) * 100) : 0;
  return { spent, limit, percent, over: limit > 0 && spent > limit };
}

function sortedTransactionsDesc() {
  return getTransactions().slice().sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return (b.createdAt || '').localeCompare(a.createdAt || '');
  });
}
