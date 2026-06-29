# Kassenbuch

Persönliches Kassenbuch (Haushaltsbuch) als clientseitige PWA – läuft komplett lokal im Browser, ohne Backend und ohne Login. Gedacht für die Nutzung auf dem iPad (als Homescreen-Icon installierbar), funktioniert aber in jedem modernen Browser.

## Funktionen

- Buchungen (Einnahme / Ausgabe / Umbuchung) mit Datum, Betrag, Kategorie, Beschreibung
- Frei anlegbare/löschbare Kategorien
- Mehrere Konten/Kassen mit eigenem Saldo, Umbuchungen zwischen Konten
- Monatliche Budgets pro Kategorie mit Fortschrittsanzeige
- Übersicht mit Gesamtsaldo und Monatsstatistik
- Daten bleiben rein lokal (`localStorage`) – JSON-Export/Import als manuelles Backup, CSV-Export, automatische Backup-Historie
- Offline-fähig (Service Worker, Web App Manifest)

## Live-Versionen

- **Stabil** (`main`): https://tecko1985.github.io/kassenbuch/
- **Test** (`test`): https://tecko1985.github.io/kassenbuch/test/

Änderungen werden zuerst auf `test` gepusht und dort geprüft, bevor sie per Merge in `main` übernommen werden. Beide Branches werden automatisch per GitHub Actions (`.github/workflows/pages.yml`) auf GitHub Pages deployed.

## Lokal entwickeln/testen

Kein Build-Schritt nötig – einfach `index.html` über einen lokalen Webserver ausliefern (für Service-Worker-Tests reicht `file://` nicht aus):

```
powershell -File serve.ps1 -Port 8420
```

Danach `http://localhost:8420` öffnen.

## Auf dem iPad installieren

Test- oder Live-URL in Safari öffnen → Teilen-Menü → „Zum Home-Bildschirm“.

## Datenschutz

Es werden keine Finanzdaten im Repo oder auf einem Server gespeichert – alles bleibt lokal im Browser-Speicher des jeweiligen Geräts.
