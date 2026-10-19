# Prüfungen-Tool

Eine Webanwendung, mit der du dich gezielter auf deine **IHK-Prüfung** vorbereiten kannst. Statt komplette Prüfungs-PDFs durchzuarbeiten, extrahiert das Tool die Aufgabenstellungen und lässt dich gezielt nach relevanten Aufgaben suchen.

## Hintergrund

Dieses Projekt wurde im Rahmen meiner Ausbildung bei **Pfefferwerk** entwickelt. Ziel war es, ein praxisnahes Tool zu bauen, das die eigene Prüfungsvorbereitung effizienter macht, und dabei den gesamten Weg von der Idee bis zur fertigen Anwendung selbst umzusetzen.

## Features

- 📄 **PDF-Upload**: Prüfungs-PDFs direkt über die Weboberfläche hochladen
- ✂️ **Automatische Extraktion**: Ein Python-Script liest die PDFs aus und zieht die Aufgabenstellungen heraus
- 🔍 **Gezielte Suche**: Relevante Aufgaben schnell finden und effizienter lernen
- 💾 **Datenspeicherung**: Aufgaben werden über PocketBase gespeichert
- 🎨 **Modernes UI**: Umgesetzt mit Material UI

## Tech-Stack

| Bereich | Technologie |
| --- | --- |
| Frontend | [Next.js](https://nextjs.org/) 13, React 18, TypeScript |
| UI | [Material UI](https://mui.com/) |
| Datenbank | [PocketBase](https://pocketbase.io/) |
| PDF-Verarbeitung | Python-Script (Aufruf via `python-shell`) |
| Datei-Upload | Formidable |
| Deployment | Docker |

## So funktioniert es

1. Du lädst eine Prüfungs-PDF über die Seite hoch.
2. Next.js nimmt die Datei entgegen (`formidable`) und startet das Python-Script aus `scripts/` (`python-shell`).
3. Das Script extrahiert die Aufgabenstellungen aus der PDF.
4. Die Aufgaben werden gespeichert und sind über die Suche abrufbar.

## Voraussetzungen

- [Node.js](https://nodejs.org/) (empfohlen: 18 oder neuer)
- Python 3 mit den Bibliotheken des Scripts: `[z. B. PyPDF2 / pdfplumber, bitte ergänzen]`
- Eine laufende [PocketBase](https://pocketbase.io/)-Instanz

## Installation

```bash
# Repository klonen
git clone https://github.com/Maximo0/Pruefungen-tool.git
cd Pruefungen-tool

# Node-Abhängigkeiten installieren
npm install

# Python-Abhängigkeiten installieren
pip install [benötigte Pakete]
```

## Konfiguration

Lege eine Datei `.env.local` im Projektordner an:

```env
# [Bitte an dein Projekt anpassen]
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
```

## Entwicklung starten

```bash
npm run dev
```

Anschließend ist die Seite unter [http://localhost:3000](http://localhost:3000) erreichbar.

## Mit Docker starten

```bash
docker build -t pruefungen-tool .
docker run -p 3000:3000 pruefungen-tool
```

## Projektstruktur

```
Pruefungen-tool/
├── components/   # Wiederverwendbare React-Komponenten
├── helpers/      # Hilfsfunktionen
├── pages/        # Next.js-Seiten und API-Routen
├── scripts/      # Python-Script zur PDF-Verarbeitung
├── types/        # TypeScript-Typdefinitionen
├── Dockerfile
└── package.json
```

## Hinweis zu Prüfungsunterlagen

Die Prüfungs-PDFs sind nicht Teil dieses Repositories. Bitte nutze nur Unterlagen, die du rechtmäßig erhalten hast, und beachte die Urheberrechte der IHK.

## Lizenz

[z. B. MIT-Lizenz, bitte ergänzen oder Abschnitt entfernen]
