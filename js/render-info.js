const APP_VERSION = '1.0';

// Was das Kassenbuch kann -- steht im Info-Reiter als Karte "Funktionen".
// WICHTIG: Das ist NICHT der Changelog. Hier steht der ZUSTAND ("ein
// archiviertes Konto laesst sich wieder aktivieren"), dort die Aenderung ("laesst
// sich JETZT wieder aktivieren"). Wer eine Funktion umbaut oder abschaltet,
// zieht diesen Text mit.
const APP_FUNKTIONEN = [
  {
    title: 'Buchen',
    items: [
      'Einnahme, Ausgabe und Umbuchung zwischen zwei Konten — jeweils mit Datum, Betrag, Kategorie und Beschreibung.',
      'Der runde Knopf unten rechts legt von jedem Reiter aus eine neue Buchung an.',
      'An jede Buchung lässt sich ein Belegfoto hängen; es wird auf 1280 Pixel verkleinert gespeichert.'
    ]
  },
  {
    title: 'Übersicht',
    items: [
      'Oben stehen der Gesamtsaldo über alle Konten sowie Einnahmen, Ausgaben und die Differenz des laufenden Monats.',
      'Der Saldo in der Kopfzeile läuft in jedem Reiter mit.',
      'Ganz unten steht ein freies Notizfeld für Merkposten und offene Beträge. Es speichert sich beim Tippen von selbst.'
    ]
  },
  {
    title: 'Buchungen durchsehen',
    items: [
      'Die Liste lässt sich nach Monat, Konto und Kategorie eingrenzen.',
      'Jede Buchung lässt sich antippen, ändern oder löschen; ein angehängter Beleg wird dabei mit angezeigt.'
    ]
  },
  {
    title: 'Budgets',
    items: [
      'Je Kategorie lässt sich ein monatliches Budget setzen.',
      'Ein Balken zeigt, wie viel davon im gewählten Monat schon verbraucht ist. Mit den Pfeilen wechselt man den Monat.'
    ]
  },
  {
    title: 'Konten',
    items: [
      'Beliebig viele Konten und Kassen, jedes mit eigenem Saldo und Startbestand.',
      'Ein Konto, das nicht mehr gebraucht wird, lässt sich archivieren statt löschen — es verschwindet aus den Karten, steht aber unten im Abschnitt „Archivierte Konten“ und lässt sich dort wieder aktivieren.',
      'Ein archiviertes Konto zählt im Gesamtsaldo weiter mit; die Summe der archivierten Konten steht in ihrem Abschnitt.'
    ]
  },
  {
    title: 'Kategorien',
    items: [
      'Kategorien für Einnahmen und Ausgaben sind frei anlegbar, getrennt nach Art.',
      'Eine Kategorie, auf die schon gebucht wurde, bleibt in den alten Buchungen stehen.'
    ]
  },
  {
    title: 'Sichern und wiederherstellen',
    items: [
      'Alle Daten als JSON-Datei sichern und wieder einlesen. Für Tabellenprogramme gibt es zusätzlich einen CSV-Export.',
      'Beim ersten Öffnen an einem Tag legt die App von selbst einen Stand in der Backup-Historie an. Jeder Stand lässt sich wiederherstellen oder als Datei herunterladen.',
      'Die Belegfotos liegen nicht in der JSON-Sicherung. Sie lassen sich getrennt als ZIP-Datei sichern, mit einstellbarer Bildqualität.'
    ]
  },
  {
    title: 'Unterwegs',
    items: [
      'Die App funktioniert offline und lässt sich auf den Home-Bildschirm legen.',
      'Auf dem iPad ist das nicht nur bequem: Als Home-Bildschirm-App räumt Safari die gespeicherten Daten nicht nach sieben Tagen ohne Nutzung weg.'
    ]
  },
  {
    title: 'Wo die Daten liegen',
    items: [
      'Alles bleibt auf diesem Gerät — es gibt keinen Server, kein Konto und keine Anmeldung.',
      'Damit gibt es auch keinen Abgleich zwischen zwei Geräten und keine Wiederherstellung von außen. Wer die Browserdaten löscht, löscht das Kassenbuch.',
      'Deshalb: regelmäßig eine JSON-Datei sichern und an einen anderen Ort legen.'
    ]
  }
];

const APP_CHANGELOG = [
  {
    version: '1.10',
    groups: [
      {
        title: 'Reihenfolge innerhalb eines Tages',
        items: [
          'Eine bearbeitete Buchung behält ihren Platz in der Liste. Vorher sprang sie nach jedem Bearbeiten innerhalb ihres Tages ganz nach oben, als wäre sie gerade erst angelegt worden.',
        ],
      },
    ],
  },
  {
    version: '1.9',
    groups: [
      {
        title: 'Sicherungen',
        items: [
          'Vor dem Wiederherstellen einer Sicherung legt die App jetzt zuerst eine Sicherung des aktuellen Stands an — wie schon beim Import. Ein Fehlgriff lässt sich so rückgängig machen.',
          'Eine Datei, die keine Kassenbuch-Sicherung ist, wird beim Import abgelehnt. Vorher leerte eine fremde JSON-Datei alle Konten, Kategorien und Buchungen.',
        ],
      },
    ],
  },
  {
    version: '1.8',
    groups: [
      {
        title: 'Wenn der Speicher voll wird',
        items: [
          'Ist der Speicher des Geräts voll, startet die App trotzdem und meldet es. Vorher blieb die Seite leer — ohne Reiter und ohne Weg zum Export.',
          'Damit neue Buchungen Platz haben, verwirft die App dann die älteste automatische Sicherung und sagt es dazu.',
          'Scheitert das Speichern einer Buchung doch, bleibt der Dialog offen und es kommt eine Meldung, statt dass nichts passiert.',
        ],
      },
    ],
  },
  {
    version: '1.7',
    groups: [
      {
        title: 'CSV-Export für Excel',
        items: [
          'Die Beträge im CSV-Export stehen jetzt mit Komma (12,50). Vorher stand dort ein Punkt, und das deutsche Excel machte aus „12.05“ den 12. Mai und aus „12.50“ einen Text, der in keiner Summe mitzählte.',
        ],
      },
    ],
  },
  {
    version: '1.6',
    groups: [
      {
        title: 'Im Info-Reiter steht jetzt, was die App kann',
        items: [
          'Die Liste der Änderungen und die Versionsnummer sind aus dem Info-Reiter verschwunden.',
          'Stattdessen steht dort die Karte „Funktionen“: was die App kann, nach Themen geordnet.',
          'Was sich geändert hat, steht weiterhin in den Neuigkeiten auf der Startseite der Tools-Übersicht.',
        ],
      },
    ],
  },
  {
    version: '1.5',
    groups: [
      {
        title: 'Behoben',
        items: [
          'Sechs Knöpfe trugen nur ein Symbol und hatten damit für ein Vorleseprogramm keinen Namen: die beiden Pfeile zum Monatswechsel bei den Budgets, das Herunterladen und das Löschen einer Sicherung, und die beiden Plus-Knöpfe für eine neue Kategorie.',
          'Sie tragen jetzt einen Namen, der vorgelesen wird. Am Bildschirm ändert sich nichts.',
        ],
      },
    ],
  },
  {
    version: '1.4',
    groups: [
      {
        title: 'Behoben',
        items: [
          'Ein archiviertes Konto lässt sich wieder aktivieren. Im Reiter Konten steht dafür unten der Abschnitt „Archivierte Konten“ — antippen, und im Dialog steht statt „Archivieren“ jetzt „Wieder aktivieren“.',
          'Vorher war ein Druck auf „Archivieren“ endgültig. Der Knopf sitzt im selben Dialog wie „Speichern“, und Karten gab es nur für nicht-archivierte Konten. Der einzige Ausweg war: alles als Datei sichern, die Datei von Hand ändern und wieder einlesen.',
          'Der Gesamtsaldo oben passt wieder zu dem, was man sieht. Ein archiviertes Konto zählt weiter mit — bisher stand oben Geld, das auf keiner Karte mehr auftauchte, ohne jeden Hinweis woher. Jetzt steht die Summe der archivierten Konten in ihrem Abschnitt, und die Rückfrage beim Archivieren sagt es dazu.',
          'Eine Umbuchung mit einem archivierten Konto zeigt wieder dessen Namen statt eines Fragezeichens.',
        ],
      },
    ],
  },
  {
    version: '1.3',
    groups: [
      {
        title: 'Behoben',
        items: [
          'Die automatischen Backups entstehen jetzt wirklich von selbst — einmal beim ersten Öffnen an einem Tag.',
          'Vorher passierte das nie. Ein Stand kam nur zustande, wenn man in den Einstellungen auf „Backup jetzt anlegen“ drückte oder eine Datei einlas. Buchen, Ändern, Löschen: nichts davon legte etwas an. Die leere Liste sah aus wie „noch nichts passiert“, war aber „passiert nie“ — und genau darauf verlässt man sich, wenn der Browser die Daten weggeräumt hat.',
          'Auf der Karte steht jetzt, wann ein Stand entsteht und wie viele behalten werden.',
        ],
      },
    ],
  },
  {
    version: '1.2',
    groups: [
      {
        title: 'Geändert',
        items: [
          'Der Knopf „Zurück zum Dashboard“ oben ist weg — das Kassenbuch ist ein eigenständiges Werkzeug und hängt an keiner Tool-Übersicht.',
        ],
      },
    ],
  },
  {
    version: '1.1',
    groups: [
      {
        title: 'Neu',
        items: [
          'Notizfeld unten auf der Übersicht — für Merkposten, offene Beträge und was noch zu buchen ist.',
          'Die Notiz speichert sich beim Tippen von selbst und liegt mit in der JSON-Sicherung und in der Backup-Historie.',
        ],
      },
    ],
  },
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
          'Übersicht mit Gesamtsaldo sowie Einnahmen, Ausgaben und Differenz des laufenden Monats.',
          'Buchungsliste nach Monat, Konto und Kategorie eingrenzen.',
          'Monatliche Budgets je Kategorie mit Fortschrittsanzeige.',
        ],
      },
      {
        title: 'Sichern',
        items: [
          'Export und Import als JSON-Datei, Export als CSV für Excel.',
          'Automatische Backup-Historie — jeder gesicherte Stand lässt sich wiederherstellen oder als Datei herunterladen.',
          'Alle Belegfotos gebündelt als ZIP-Datei sichern; die Bildqualität ist einstellbar.',
        ],
      },
      {
        title: 'Unterwegs',
        items: [
          'Funktioniert offline und lässt sich auf den Home-Bildschirm legen.',
          'Alle Daten bleiben auf diesem Gerät — es gibt keinen Server und kein Konto.',
        ],
      },
    ],
  },
];

// Die Aenderungsliste steht seit 07.09.2026 NICHT mehr im Info-Reiter -- dort
// steht nur noch, was die App kann. APP_CHANGELOG bleibt trotzdem gepflegt: es
// ist die Quelle fuer die grosse Anleitung und fuer die Neuigkeiten auf der
// Startseite der Tools-Uebersicht. Aus demselben Grund ist auch die
// Versionspille aus der Ueberschrift verschwunden.
//
// Die Karte "Funktionen" nutzt dieselben CSS-Klassen wie frueher die
// Aenderungsliste (.changelog-group, .changelog-group-title), damit sie sich
// nicht von den anderen Karten unterscheidet.
function renderInfo() {
  const view = document.getElementById('view-info');
  if (!view) return;

  const funktionenHtml = APP_FUNKTIONEN.map(g => `
    <div class="changelog-group">
      <div class="changelog-group-title">${escapeHtml(g.title)}</div>
      <ul>${g.items.map(i => `<li>${escapeHtml(i)}</li>`).join('')}</ul>
    </div>
  `).join('');

  view.innerHTML = `
    <div class="card">
      <h2>Über das Kassenbuch</h2>
      <p class="info-text">
        Dein persönliches Haushaltsbuch. Alle Daten bleiben lokal auf diesem Gerät —
        es gibt keinen Server und kein Konto. Denk deshalb an regelmäßige Sicherungen
        über „Einstellungen“.
      </p>
    </div>
    <div class="card">
      <h2>Funktionen</h2>
      <div id="funktionen-list">${funktionenHtml}</div>
    </div>
  `;
}
