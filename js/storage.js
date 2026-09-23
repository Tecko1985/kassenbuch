const STORAGE_KEYS = {
  accounts: 'kassenbuch_accounts',
  catIncome: 'kassenbuch_categories_income',
  catExpense: 'kassenbuch_categories_expense',
  transactions: 'kassenbuch_transactions',
  budgets: 'kassenbuch_budgets',
  backups: 'kassenbuch_backups',
  receiptQuality: 'kassenbuch_receipt_quality',
  notes: 'kassenbuch_notes',
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

// ⚠️ Speicher voll (Bugjagd 23.09.2026, T7-7): die Backup-Historie (bis zu
// MAX_BACKUPS volle Kopien) liegt im selben localStorage wie der Bestand und
// ist sein Vielfaches. Reisst das Kontingent (~5 Mio. Zeichen), hat der
// Bestand Vorrang: die aelteste Sicherung wird verworfen und erneut versucht.
// Erst wenn keine Sicherung mehr da ist, geht der Fehler als verstaendliche
// Meldung an den Aufrufer.
function istSpeicherVoll(e) {
  return !!e && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e.code === 22 || e.code === 1014);
}

const SPEICHER_VOLL_TEXT = 'Der Speicher dieses Geräts ist voll. Bitte unter Einstellungen „Backup-Datei anlegen“ und alte Belegfotos löschen.';

let sicherungVerworfenGemeldet = false;

function verwirfAeltesteSicherung() {
  const backups = loadJson(STORAGE_KEYS.backups, []);
  if (!Array.isArray(backups) || !backups.length) return false;
  backups.shift();
  // Kleiner schreiben passt immer.
  localStorage.setItem(STORAGE_KEYS.backups, JSON.stringify(backups));
  if (!sicherungVerworfenGemeldet && typeof toast === 'function') {
    sicherungVerworfenGemeldet = true;
    toast('Speicher fast voll — die älteste automatische Sicherung wurde verworfen. Bitte bald „Backup-Datei anlegen“.', 6000);
  }
  return true;
}

function saveJson(key, data) {
  const text = JSON.stringify(data);
  for (;;) {
    try {
      localStorage.setItem(key, text);
      return;
    } catch (e) {
      if (!istSpeicherVoll(e)) throw e;
      if (key === STORAGE_KEYS.backups || !verwirfAeltesteSicherung()) throw new Error(SPEICHER_VOLL_TEXT);
    }
  }
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
  if (localStorage.getItem(STORAGE_KEYS.notes) === null) {
    saveJson(STORAGE_KEYS.notes, '');
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

// Der Rueckweg. Ohne ihn war ein versehentliches "Archivieren" endgueltig --
// der Knopf sitzt im selben Dialog wie "Speichern", und Karten gab es nur fuer
// nicht-archivierte Konten. Der einzige Ausweg war Export, Datei von Hand
// bearbeiten und Import, der den ganzen Bestand ersetzt.
function unarchiveAccount(id) {
  const accounts = getAccounts();
  const acc = accounts.find(a => a.id === id);
  if (acc) acc.archived = false;
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

// ── Notizen ─────────────────────────────────────────────────────────────
function getNotes() {
  const v = loadJson(STORAGE_KEYS.notes, '');
  return typeof v === 'string' ? v : '';
}
function saveNotes(text) { saveJson(STORAGE_KEYS.notes, String(text ?? '')); }

// ── Full data export/import (used by Export/Import & auto-backups) ───────
function getAllData() {
  return {
    version: 2,
    exportedAt: new Date().toISOString(),
    accounts: getAccounts(),
    categories: { income: getCategories('income'), expense: getCategories('expense') },
    transactions: getTransactions(),
    budgets: getBudgets(),
    notes: getNotes(),
  };
}

// Sieht die Datei aus wie eine Kassenbuch-Sicherung? Vorher reichte gueltiges
// JSON: eine fremde JSON-Datei leerte beim Import alle Konten, Kategorien und
// Buchungen (Bugjagd 23.09.2026, T7-12). Pflicht sind die beiden Listen, die
// jede Sicherung seit Version 1 traegt.
function istKassenbuchSicherung(data) {
  return !!data && typeof data === 'object' && !Array.isArray(data)
    && Array.isArray(data.accounts) && Array.isArray(data.transactions);
}

function restoreAllData(data) {
  if (!istKassenbuchSicherung(data)) throw new Error('Ungültiges Datenformat');
  saveAccounts(Array.isArray(data.accounts) ? data.accounts : []);
  saveCategories('income', data.categories?.income ?? []);
  saveCategories('expense', data.categories?.expense ?? []);
  saveTransactions(Array.isArray(data.transactions) ? data.transactions : []);
  saveBudgets(Array.isArray(data.budgets) ? data.budgets : []);
  // Sicherungen vor Version 2 kennen kein Notizfeld -- dann die vorhandene
  // Notiz stehen lassen statt sie still zu leeren.
  if (typeof data.notes === 'string') saveNotes(data.notes);
}

// ── Backup history ───────────────────────────────────────────────────────
function getBackups() { return loadJson(STORAGE_KEYS.backups, []); }

// Passt die neue Sicherung nicht mehr in den Speicher, fallen die aeltesten
// heraus, bis sie passt. Passt sie auch allein nicht, bleibt die gespeicherte
// Historie unveraendert und es kommt eine verstaendliche Meldung (vorher brach
// init() an dieser Stelle ab, und die App startete nicht mehr).
function pushBackup() {
  const backups = getBackups();
  backups.push({ date: new Date().toISOString(), data: getAllData() });
  while (backups.length > MAX_BACKUPS) backups.shift();
  for (;;) {
    try {
      localStorage.setItem(STORAGE_KEYS.backups, JSON.stringify(backups));
      return;
    } catch (e) {
      if (!istSpeicherVoll(e)) throw e;
      if (backups.length <= 1) throw new Error(SPEICHER_VOLL_TEXT);
      backups.shift();
    }
  }
}

function deleteBackup(date) {
  saveJson(STORAGE_KEYS.backups, getBackups().filter(b => b.date !== date));
}

// ── Automatische Sicherung ───────────────────────────────────────────────
// Die Karte heißt "Automatische Backups", der Info-Tab und die README sagen
// dasselbe zu -- entstanden ist ein Stand aber nur durch den Knopf "Backup
// jetzt anlegen" oder unmittelbar vor einem Import. Buchen, Ändern, Löschen,
// Kategorien pflegen: nichts davon legte je einen Stand an. Wer die leere
// Liste sah, hielt sie für "noch nichts passiert" statt "passiert nie".
// Ausgerechnet die iPad-Falle (ITP löscht nach 7 Tagen Inaktivität) trifft
// dann auf eine leere Historie.
//
// Fenster statt Stichtag: fällig ist eine Sicherung, wenn die jüngste älter
// als AUTO_BACKUP_MIN_STUNDEN ist. Ein Tag, an dem die App nicht geöffnet
// wurde, holt sich beim nächsten Öffnen nach, statt still ausgelassen zu
// werden. Kosten: ein JSON-Schnappschuss je Tag, gedeckelt durch MAX_BACKUPS.
const AUTO_BACKUP_MIN_STUNDEN = 24;

function autoBackupIfDue(jetzt) {
  const now = Number.isFinite(jetzt) ? jetzt : Date.now();
  // Ein Bestand ohne eine einzige Buchung hat nichts zu sichern. Sonst
  // stünden nach zehn Starts zehn identische Leerstände in der Historie und
  // verdrängten die brauchbaren.
  if (!getTransactions().length) return false;
  const backups = getBackups();
  const letzte = backups.length ? Date.parse(String(backups[backups.length - 1].date)) : NaN;
  if (Number.isFinite(letzte) && now - letzte < AUTO_BACKUP_MIN_STUNDEN * 3600000) return false;
  pushBackup();
  return true;
}
