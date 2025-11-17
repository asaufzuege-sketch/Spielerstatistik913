# Spielerstatistik913

Eine webbasierte Anwendung zur Erfassung und Verwaltung von Spielerstatistiken für Eishockeyteams.

## 🌐 Live Demo

Die Anwendung ist über GitHub Pages verfügbar:
**https://asaufzuege-sketch.github.io/Spielerstatistik913/**

## 📋 Funktionen

- **Team-Verwaltung**: Verwaltung mehrerer Teams (bis zu 3 Teams)
- **Spielerauswahl**: Auswahl aktiver Spieler für Statistikerfassung
- **Echtzeit-Statistiken**: Erfassung von Schüssen, Toren, Assists, +/-, Faceoffs, Penalties
- **Timer**: Eiszeit-Tracking für einzelne Spieler
- **Goal Map**: Visualisierung von Torschüssen auf einem Spielfeld
- **Goal Value**: Bewertung der Torgefährlichkeit
- **Season View**: Saisonübersicht mit kumulierten Statistiken
- **Season Map**: Visualisierung der Saisondaten auf dem Spielfeld
- **Export/Import**: CSV-Export und -Import von Spiel- und Saisondaten

## 🚀 Deployment

### GitHub Pages Einstellungen

Die Seite wird automatisch über GitHub Pages bereitgestellt:

1. **Branch**: `main`
2. **Source**: Root-Verzeichnis (`/`)
3. **URL**: https://asaufzuege-sketch.github.io/Spielerstatistik913/

### Dateistruktur

```
/
├── index.html                      # Haupt-HTML-Datei
├── style.css                       # Haupt-Stylesheet
├── season_table_styles.css         # Styles für Season/Goal Value Tabellen
├── season_map_momentum.css         # Styles für Season Map Momentum
├── app.js                          # Haupt-App Initialisierung
├── config.js                       # Globale Konfiguration
├── helpers.js                      # Hilfsfunktionen
├── storage.js                      # LocalStorage Management
├── timer.js                        # Timer-Logik
├── csv-handler.js                  # CSV Import/Export
├── team-selection.js               # Team-Verwaltung
├── player-selection.js             # Spielerauswahl
├── stats-table.js                  # Spielstatistiken
├── season-table.js                 # Saisonstatistiken
├── goal-map.js                     # Goal Map Visualisierung
├── season-map.js                   # Season Map Visualisierung
├── goal-value.js                   # Goal Value Berechnung
├── marker-handler.js               # Marker-Verwaltung für Maps
├── season_table_ui_patch.js        # UI Patches für Season Table
├── season_map_momentum.js          # Momentum-Visualisierung
└── *.png                           # Spielfeld und Tor-Grafiken
```

### Lokale Entwicklung

Die Anwendung ist eine reine clientseitige Webanwendung und benötigt keinen Build-Prozess:

1. Klonen Sie das Repository:
   ```bash
   git clone https://github.com/asaufzuege-sketch/Spielerstatistik913.git
   cd Spielerstatistik913
   ```

2. Öffnen Sie `index.html` in einem modernen Webbrowser oder verwenden Sie einen lokalen Webserver:
   ```bash
   # Mit Python 3
   python3 -m http.server 8000
   
   # Mit Node.js (http-server)
   npx http-server
   ```

3. Öffnen Sie `http://localhost:8000` im Browser

### Datenpersistenz

Alle Daten werden im Browser-LocalStorage gespeichert:
- Team-Konfigurationen
- Spielerstatistiken
- Saisondaten
- Timer-Stati
- Goal Map Marker

**Wichtig**: Daten werden nicht zwischen Geräten synchronisiert und gehen beim Löschen des Browser-Caches verloren.

## 🔧 Technische Details

- **Keine Abhängigkeiten**: Reines Vanilla JavaScript (ES6+)
- **Externe Bibliotheken** (via CDN):
  - jsPDF 2.5.1 (PDF-Export)
  - html2canvas 1.4.1 (Screenshot-Export)
- **Browser-Anforderungen**: Moderne Browser mit LocalStorage und ES6-Support
- **Responsive Design**: Optimiert für Desktop und Tablet

## 📝 Lizenz

Dieses Projekt ist für den internen Gebrauch bestimmt.
