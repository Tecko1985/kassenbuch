# Kassenbuch (v1.1)

Persönliches Kassenbuch (Haushaltsbuch) als clientseitige PWA – läuft komplett lokal im Browser, ohne Backend und ohne Login. Gedacht für die Nutzung auf dem iPad (als Homescreen-Icon installierbar), funktioniert aber in jedem modernen Browser.

## Funktionen

- Buchungen (Einnahme / Ausgabe / Umbuchung) mit Datum, Betrag, Kategorie, Beschreibung
- Frei anlegbare/löschbare Kategorien
- Mehrere Konten/Kassen mit eigenem Saldo, Umbuchungen zwischen Konten
- Monatliche Budgets pro Kategorie mit Fortschrittsanzeige
- Übersicht mit Gesamtsaldo und Monatsstatistik
- Belegfotos zu Buchungen (Kamera/Fotomediathek), lokal gespeichert und mit der Buchung verknüpft
- Daten bleiben rein lokal (`localStorage`) – JSON-Export/Import als manuelles Backup, CSV-Export, automatische Backup-Historie
- Offline-fähig (Service Worker, Web App Manifest)

## Live-Version

- https://tecko1985.github.io/kassenbuch/

Wird automatisch per GitHub Actions (`.github/workflows/pages.yml`) bei jedem Push auf `main` auf GitHub Pages deployed.

## Lokal entwickeln/testen

Kein Build-Schritt nötig – einfach `index.html` über einen lokalen Webserver ausliefern (für Service-Worker-Tests reicht `file://` nicht aus):

```
powershell -File serve.ps1 -Port 8420
```

Danach `http://localhost:8420` öffnen.

## Auf dem iPad installieren

Live-URL in Safari öffnen → Teilen-Menü → „Zum Home-Bildschirm“.

**Wichtig:** Safaris „Intelligent Tracking Prevention“ löscht script-gespeicherte Daten (`localStorage`, IndexedDB – also auch alle Buchungen und Belegfotos) automatisch, wenn die Seite 7 Tage lang nicht geöffnet wurde. Als Home-Bildschirm-App zählt das nicht mehr als reiner Safari-Tab, daher ist die Installation auf dem Home-Bildschirm nicht nur praktisch, sondern auch wichtig für die Datensicherheit. Zusätzlich regelmäßig ein JSON-Backup anlegen (Einstellungen → „Datei anlegen“).

## Datenschutz

Es werden keine Finanzdaten im Repo oder auf einem Server gespeichert – alles bleibt lokal im Browser-Speicher des jeweiligen Geräts. Belegfotos werden lokal in IndexedDB gespeichert (komprimiert, max. 1280px) und sind **nicht** im JSON-Export enthalten – sie bleiben an das jeweilige Gerät/den jeweiligen Browser gebunden.
