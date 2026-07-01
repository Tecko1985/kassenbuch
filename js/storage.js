const STORAGE_KEYS = {
  accounts: 'kassenbuch_accounts',
  catIncome: 'kassenbuch_categories_income',
  catExpense: 'kassenbuch_categories_expense',
  transactions: 'kassenbuch_transactions',
  budgets: 'kassenbuch_budgets',
  backups: 'kassenbuch_backups',
  receiptQuality: 'kassenbuch_receipt_quality',
};

const RECEIPT_QUALITY_PRESETS = {
  klein: { label: 'Klein (schnell, wenig Speicher)', maxDim: 800, quality: 0.6 },
  mittel: { label: 'Mittel (empfohlen)', maxDim: 1280, quality: 0.7 },
  gross: { label: 'Groß (mehr Details, mehr Speicher)', maxDim: 1920, quality: 0.85 },
};

function getReceiptQuality() {
  const v = loadJson(STORAGE_KEYS.receiptQuality, 'mittel');
  return RECEIPT_QUALITY_PRESETS[v] ? v : 'mittel';
}
function setReceiptQuality(v) {
  saveJson(STORAGE_KEYS.receiptQuality, RECEIPT_QUALITY_PRESETS[v] ? v : 'mittel');
}

const MAX_BACKUPS = 10;

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveJson(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function seedDefaultsIfEmpty() {
  if (localStorage.getItem(STORAGE_KEYS.accounts) === null) {
    saveJson(STORAGE_KEYS.accounts, [
      { id: genId('acc'), name: 'Bar', icon: '💶', startBalance: 0, archived: false },
    ]);
  }
  if (localStorage.getItem(STORAGE_KEYS.catIncome) === null) {
    saveJson(STORAGE_KEYS.catIncome, ['Gehalt', 'Geschenk', 'Sonstiges']);
  }
  if (localStorage.getItem(STORAGE_KEYS.catExpense) === null) {
    saveJson(STORAGE_KEYS.catExpense, ['Lebensmittel', 'Miete', 'Transport', 'Freizeit', 'Sonstiges']);
  }
  if (localStorage.getItem(STORAGE_KEYS.transactions) === null) {
    saveJson(STORAGE_KEYS.transactions, []);
  }
  if (localStorage.getItem(STORAGE_KEYS.budgets) === null) {
    saveJson(STORAGE_KEYS.budgets, []);
  }
  if (localStorage.getItem(STORAGE_KEYS.backups) === null) {
    saveJson(STORAGE_KEYS.backups, []);
  }
}

// ── Accounts ─────────────────────────────────────────────────────────────
function getAccounts() { return loadJson(STORAGE_KEYS.accounts, []); }
function saveAccounts(arr) { saveJson(STORAGE_KEYS.accounts, arr); }

function upsertAccount(account) {
  const accounts = getAccounts();
  const idx = accounts.findIndex(a => a.id === account.id);
  if (idx >= 0) accounts[idx] = account;
  else accounts.push(account);
  saveAccounts(accounts);
}

function archiveAccount(id) {
  const accounts = getAccounts();
  const acc = accounts.find(a => a.id === id);
  if (acc) acc.archived = true;
  saveAccounts(accounts);
}

// ── Categories ───────────────────────────────────────────────────────────
function getCategories(type) {
  return loadJson(type === 'income' ? STORAGE_KEYS.catIncome : STORAGE_KEYS.catExpense, []);
}
function saveCategories(type, arr) {
  saveJson(type === 'income' ? STORAGE_KEYS.catIncome : STORAGE_KEYS.catExpense, arr);
}
function addCategory(type, name) {
  const cats = getCategories(type);
  if (cats.includes(name)) return false;
  cats.push(name);
  saveCategories(type, cats);
  return true;
}
function deleteCategory(type, name) {
  const cats = getCategories(type).filter(c => c !== name);
  saveCategories(type, cats);
}

// ── Transactions ─────────────────────────────────────────────────────────
function getTransactions() { return loadJson(STORAGE_KEYS.transactions, []); }
function saveTransactions(arr) { saveJson(STORAGE_KEYS.transactions, arr); }

function upsertTransaction(txn) {
  const txns = getTransactions();
  const idx = txns.findIndex(t => t.id === txn.id);
  if (idx >= 0) txns[idx] = txn;
  else txns.push(txn);
  saveTransactions(txns);
}

function deleteTransaction(id) {
  saveTransactions(getTransactions().filter(t => t.id !== id));
}

// ── Budgets ──────────────────────────────────────────────────────────────
function getBudgets() { return loadJson(STORAGE_KEYS.budgets, []); }
function saveBudgets(arr) { saveJson(STORAGE_KEYS.budgets, arr); }

function upsertBudget(category, limit) {
  const budgets = getBudgets();
  const idx = budgets.findIndex(b => b.category === category);
  if (idx >= 0) budgets[idx].limit = limit;
  else budgets.push({ category, limit });
  saveBudgets(budgets);
}

function deleteBudget(category) {
  saveBudgets(getBudgets().filter(b => b.category !== category));
}

// ── Full data export/import (used by Export/Import & auto-backups) ───────
function getAllData() {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    accounts: getAccounts(),
    categories: { income: getCategories('income'), expense: getCategories('expense') },
    transactions: getTransactions(),
    budgets: getBudgets(),
  };
}

function restoreAllData(data) {
  if (!data || typeof data !== 'object') throw new Error('Ungültiges Datenformat');
  saveAccounts(Array.isArray(data.accounts) ? data.accounts : []);
  saveCategories('income', data.categories?.income ?? []);
  saveCategories('expense', data.categories?.expense ?? []);
  saveTransactions(Array.isArray(data.transactions) ? data.transactions : []);
  saveBudgets(Array.isArray(data.budgets) ? data.budgets : []);
}

// ── Backup history ───────────────────────────────────────────────────────
function getBackups() { return loadJson(STORAGE_KEYS.backups, []); }

function pushBackup() {
  const backups = getBackups();
  backups.push({ date: new Date().toISOString(), data: getAllData() });
  while (backups.length > MAX_BACKUPS) backups.shift();
  saveJson(STORAGE_KEYS.backups, backups);
}

function deleteBackup(date) {
  saveJson(STORAGE_KEYS.backups, getBackups().filter(b => b.date !== date));
}
