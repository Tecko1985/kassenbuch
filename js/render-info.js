const APP_VERSION = '1.0';

const CHANGELOG = [
  {
    version: '1.0',
    groups: [
      {
        title: 'Buchen',
        items: [
          'Einnahmen, Ausgaben und Umbuchungen mit Datum, Betrag, Kategorie und Beschreibung erfassen.',
          'Frei anlegbare Kategorien, mehrere Konten und Kassen mit eigenem Saldo.',
          'Belegfotos direkt an eine Buchung hängen.',
        ],
      },
      {
        title: 'Überblick behalten',
        items: [
          'Monatliche Budgets je Kategorie mit Fortschrittsanzeige.',
          'Übersicht mit Gesamtsaldo und Monatsstatistik.',
        ],
      },
      {
        title: 'Sichern',
        items: [
          'Export und Import als JSON-Datei, Export als CSV für Excel.',
          'Automatische Backup-Historie.',
          'Funktioniert offline und lässt sich auf den Home-Bildschirm legen.',
        ],
      },
      {
        title: 'Bedienung am Handy',
        items: [
          'Eingabefelder sind mindestens 16 Pixel groß, damit der iPhone-Browser beim Antippen nicht ungefragt in die Seite hineinzoomt und verschoben stehen bleibt.',
          'Die Kopfzeile bricht auf schmalen Bildschirmen um, statt seitlich herauszuragen und den Titel anzuschneiden.',
        ],
      },
    ],
  },
];

function renderInfo() {
  const view = document.getElementById('view-info');

  const changelogHtml = APP_CHANGELOG.map(entry => `
    <div class="changelog-entry">
      <div class="changelog-version">Version ${escapeHtml(entry.version)}</div>
      ${entry.groups.map(g => `
        <div class="changelog-group">
          <div class="changelog-group-title">${escapeHtml(g.title)}</div>
          <ul>${g.items.map(i => `<li>${escapeHtml(i)}</li>`).join('')}</ul>
        </div>
      `).join('')}
    </div>
  `).join('');

  view.innerHTML = `
    <div class="card">
      <h2>Über das Kassenbuch <span class="version-badge" id="version-badge-2"></span></h2>
      <p class="info-text">
        Dein persönliches Haushaltsbuch. Alle Daten bleiben lokal auf diesem Gerät —
        es gibt keinen Server und kein Konto. Denk deshalb an regelmäßige Sicherungen
        über „Einstellungen“.
      </p>
    </div>
    <div class="card">
      <h2>Änderungen</h2>
      ${changelogHtml}
    </div>
  `;

  // Erst nach dem Rendern -- #version-badge-2 entsteht oben.
  document.querySelectorAll('#version-badge, #version-badge-2').forEach(el => {
    if (el) el.textContent = 'v' + APP_VERSION;
  });
}
