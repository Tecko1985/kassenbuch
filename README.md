# 💶 Kassenbuch

Einnahmen und Ausgaben erfassen und gegenrechnen — über mehrere **Konten**
hinweg, mit **Kategorien** und einem **Monatslimit** je Budget. Ein privates
Werkzeug, kein Vereinsdokument.

**➡️ [Kassenbuch öffnen](https://sc1911heiligenstadt.github.io/kassenbuch/)**

## Was erfasst wird

Eine Buchung trägt **Datum**, **Betrag (€)**, eine **Beschreibung**, eine
**Kategorie** und das **Konto**. Umbuchungen laufen über **Von Konto** und
**Auf Konto**, ein **Beleg** lässt sich anhängen.

Ein Konto hat einen **Namen**, ein **Icon (Emoji)** und einen **Startsaldo (€)**;
je **Budget** lässt sich ein **Monatslimit (€)** setzen, an dem sich messen
lässt, ob der Monat im Rahmen bleibt.

## Wichtig: nicht die Vereinskasse

Die Vereinsfinanzen laufen über das
[Vereinsbudget](https://sc1911heiligenstadt.github.io/sc-heiligenstadt-budget/vereinsbudget.html)
und die
[Vereinsverwaltung](https://sc1911heiligenstadt.github.io/vereinsverwaltung/).
Das Kassenbuch hat damit nichts zu tun.

## Zugang

Dieses Werkzeug braucht **keine Anmeldung** über das Vereinskonto und steht
bewusst nicht auf der Kachelübersicht.

## Lokal starten

Über den Eintrag `kassenbuch` in `E:\.claude\launch.json` — der Server läuft dann auf `http://localhost:8420/`.

## Technik

Vanilla JavaScript ohne Build-Schritt — die Dateien werden so ausgeliefert, wie sie im Repo liegen. Veröffentlicht über GitHub Pages.

---

Ein Werkzeug des 1. SC 1911 Heiligenstadt. Alle Werkzeuge auf einen Blick: [Tools-Übersicht](https://sc1911heiligenstadt.github.io/ToolsUebersicht/) · Erklärungen im [Toolbox Wiki](https://sc1911heiligenstadt.github.io/Vereinswiki/).
