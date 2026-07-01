// IndexedDB-Speicher für Belegfotos (localStorage ist für Bilder zu klein).
const RECEIPTS_DB_NAME = 'kassenbuch_receipts_db';
const RECEIPTS_STORE = 'receipts';

let receiptsDbPromise = null;

function openReceiptsDb() {
  if (receiptsDbPromise) return receiptsDbPromise;
  receiptsDbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(RECEIPTS_DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(RECEIPTS_STORE, { keyPath: 'txnId' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return receiptsDbPromise;
}

async function saveReceipt(txnId, dataUrl) {
  const db = await openReceiptsDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(RECEIPTS_STORE, 'readwrite');
    tx.objectStore(RECEIPTS_STORE).put({ txnId, dataUrl, savedAt: new Date().toISOString() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getReceipt(txnId) {
  const db = await openReceiptsDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(RECEIPTS_STORE, 'readonly');
    const req = tx.objectStore(RECEIPTS_STORE).get(txnId);
    req.onsuccess = () => resolve(req.result ? req.result.dataUrl : null);
    req.onerror = () => reject(req.error);
  });
}

async function deleteReceipt(txnId) {
  const db = await openReceiptsDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(RECEIPTS_STORE, 'readwrite');
    tx.objectStore(RECEIPTS_STORE).delete(txnId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getReceiptsStorageInfo() {
  const db = await openReceiptsDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(RECEIPTS_STORE, 'readonly');
    const req = tx.objectStore(RECEIPTS_STORE).getAll();
    req.onsuccess = () => {
      const rows = req.result || [];
      const bytes = rows.reduce((sum, r) => sum + (r.dataUrl ? r.dataUrl.length : 0), 0);
      resolve({ count: rows.length, bytes });
    };
    req.onerror = () => reject(req.error);
  });
}

async function getAllReceiptsRaw() {
  const db = await openReceiptsDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(RECEIPTS_STORE, 'readonly');
    const req = tx.objectStore(RECEIPTS_STORE).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

async function deleteAllReceipts() {
  const db = await openReceiptsDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(RECEIPTS_STORE, 'readwrite');
    tx.objectStore(RECEIPTS_STORE).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
