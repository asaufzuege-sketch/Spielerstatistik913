// Haupt-App Initialisierung - KORRIGIERT
document.addEventListener("DOMContentLoaded", () => {
  console.log(`Spielerstatistik App v${App.version} wird geladen...`);
  
  // 1. Theme & Styles initialisieren
  App.initTheme();
  App.injectTableStyles();
  
  // 2. Pages registrieren
  App.pages = {
    teamSelection: document.getElementById("teamSelectionPage"),
    selection: document.getElementById("playerSelectionPage"),
    stats: document.getElementById("statsPage"),
    torbild: document.getElementById("torbildPage"),
    goalValue: document.getElementById("goalValuePage"),
    season: document.getElementById("seasonPage"),
    seasonMap: document.getElementById("seasonMapPage")
  };
  
  // 3. Daten aus LocalStorage laden
  App.storage.load();
  
  // 4. Alle Module initialisieren (Team Selection ZUERST!)
  App.teamSelection.init();
  App.timer.init();
  App.csvHandler.init();
  App.playerSelection.init();
  App.statsTable.init();
  App.seasonTable.init();
  App.goalMap.init();
  App.seasonMap.init();
  App.goalValue.init();
  
  // 5. Navigation Event Listeners
  document.getElementById("selectPlayersBtn")?.addEventListener("click", () => {
    App.showPage("selection");
  });
  
  document.getElementById("backToStatsBtn")?.addEventListener("click", () => {
    App.showPage("stats");
  });
  
  document.getElementById("backToStatsFromSeasonBtn")?.addEventListener("click", () => {
    App.showPage("stats");
  });
  
  document.getElementById("backToStatsFromSeasonMapBtn")?.addEventListener("click", () => {
    App.showPage("stats");
  });
  
  document.getElementById("backFromGoalValueBtn")?.addEventListener("click", () => {
    App.showPage("stats");
  });
  
  // Zurück zur Teamauswahl Button
  document.getElementById("backToTeamSelectionBtn")?.addEventListener("click", () => {
    // Speichere aktuelle Daten bevor zur Teamauswahl zurückgekehrt wird
    if (App.teamSelection.currentTeam) {
      App.teamSelection.saveCurrentTeamData();
    }
    App.showPage("teamSelection");
  });
  
  document.getElementById("torbildBtn")?.addEventListener("click", () => {
    App.showPage("torbild");
  });
  
  document.getElementById("goalValueBtn")?.addEventListener("click", () => {
    App.showPage("goalValue");
  });
  
  document.getElementById("seasonBtn")?.addEventListener("click", () => {
    App.showPage("season");
  });
  
  document.getElementById("seasonMapBtn")?.addEventListener("click", () => {
    App.showPage("seasonMap");
  });
  
  // 6. Export Season Button
  document.getElementById("exportSeasonFromStatsBtn")?.addEventListener("click", () => {
    if (App.seasonTable && typeof App.seasonTable.exportFromStats === 'function') {
      App.seasonTable.exportFromStats();
    }
  });
  
  // 7. Export CSV Button
  document.getElementById("exportBtn")?.addEventListener("click", () => {
    if (App.csvHandler && typeof App.csvHandler.exportStats === 'function') {
      App.csvHandler.exportStats();
    }
  });
  
  // 8. Reset Button (mit Team-Check)
  document.getElementById("resetBtn")?.addEventListener("click", () => {
    if (App.teamSelection.currentTeam) {
      App.teamSelection.resetCurrentTeam();
    } else if (App.statsTable && typeof App.statsTable.reset === 'function') {
      App.statsTable.reset();
    }
  });
  
  // 9. Delegierte Back-Button Handler
  document.addEventListener("click", (e) => {
    try {
      const btn = e.target.closest("button");
      if (!btn) return;
      
      const backIds = new Set([
        "backToStatsBtn",
        "backToStatsFromSeasonBtn",
        "backToStatsFromSeasonMapBtn",
        "backFromGoalValueBtn"
      ]);
      
      if (backIds.has(btn.id)) {
        App.showPage("stats");
        e.preventDefault();
        e.stopPropagation();
      }
      
      if (btn.id === "backToTeamSelectionBtn") {
        if (App.teamSelection.currentTeam) {
          App.teamSelection.saveCurrentTeamData();
        }
        App.showPage("teamSelection");
        e.preventDefault();
        e.stopPropagation();
      }
    } catch (err) {
      console.warn("Back button delegation failed:", err);
    }
  }, true);
  
  // 10. Initiale Seite anzeigen
  const savedTeam = localStorage.getItem("currentTeam");
  const lastPage = App.storage.getCurrentPage();
  
  let initialPage;
  if (!savedTeam) {
    // Kein Team ausgewählt -> Teamauswahl
    initialPage = "teamSelection";
  } else {
    // Team vorhanden, lade Team-Daten
    App.teamSelection.currentTeam = savedTeam;
    App.data.currentTeam = savedTeam;
    App.teamSelection.loadTeamData(savedTeam);
    
    // Prüfe ob Spieler ausgewählt sind
    if (!App.data.selectedPlayers || App.data.selectedPlayers.length === 0) {
      initialPage = "selection";
    } else if (lastPage && lastPage !== "teamSelection") {
      initialPage = lastPage;
    } else {
      initialPage = "stats";
    }
    
    // Update Team-Displays
    const teamName = App.teamSelection.teams[savedTeam]?.name || savedTeam;
    const currentTeamDisplay = document.getElementById("currentTeamDisplay");
    const statsTeamDisplay = document.getElementById("statsTeamDisplay");
    
    if (currentTeamDisplay) currentTeamDisplay.textContent = teamName;
    if (statsTeamDisplay) statsTeamDisplay.textContent = teamName;
  }
  
  App.showPage(initialPage);
  
  // 11. Timer Persistenz
  App.restoreActiveTimers();
  
  // 12. Daten vor Seitenabschluss speichern
  window.addEventListener("beforeunload", () => {
    try {
      if (App.teamSelection.currentTeam) {
        App.teamSelection.saveCurrentTeamData();
      }
      App.storage.saveAll();
      App.teamSelection.saveTeams();
      App.saveActiveTimersState();
      localStorage.setItem("timerSeconds", String(App.timer.seconds));
      
      if (App.goalValue) {
        localStorage.setItem("goalValueOpponents", JSON.stringify(App.goalValue.getOpponents()));
        localStorage.setItem("goalValueData", JSON.stringify(App.goalValue.getData()));
        localStorage.setItem("goalValueBottom", JSON.stringify(App.goalValue.getBottom()));
      }
    } catch (e) {
      console.warn("Save on unload failed:", e);
    }
  });
  
  // 13. Page Visibility API
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      App.saveActiveTimersState();
    } else {
      App.restoreActiveTimers();
    }
  });
  
  console.log("✅ App erfolgreich geladen!");
});

// Timer Persistenz Funktionen
App.saveActiveTimersState = function() {
  try {
    const activeTimerNames = Object.keys(App.data.activeTimers);
    const teamId = App.teamSelection.currentTeam || App.data.currentTeam || "team1";
    localStorage.setItem(`activeTimerPlayers_${teamId}`, JSON.stringify(activeTimerNames));
    console.log("Active timers saved:", activeTimerNames);
  } catch (e) {
    console.warn("Failed to save timer state:", e);
  }
};

App.restoreActiveTimers = function() {
  try {
    const teamId = App.teamSelection.currentTeam || App.data.currentTeam || "team1";
    const activeTimerNames = JSON.parse(localStorage.getItem(`activeTimerPlayers_${teamId}`) || "[]");
    
    // Alle bestehenden Timer stoppen
    Object.values(App.data.activeTimers).forEach(timer => {
      if (timer) clearInterval(timer);
    });
    App.data.activeTimers = {};
    
    // Timer für gespeicherte Spieler wiederherstellen
    activeTimerNames.forEach(playerName => {
      if (App.data.selectedPlayers.find(p => p.name === playerName)) {
        App.startPlayerTimer(playerName);
        console.log("Restored timer for:", playerName);
      }
    });
  } catch (e) {
    console.warn("Failed to restore timer state:", e);
  }
};

App.startPlayerTimer = function(playerName) {
  if (App.data.activeTimers[playerName]) {
    clearInterval(App.data.activeTimers[playerName]);
  }
  
  App.data.activeTimers[playerName] = setInterval(() => {
    App.data.playerTimes[playerName] = (App.data.playerTimes[playerName] || 0) + 1;
    App.storage.savePlayerTimes();
    
    // Update Display wenn auf Stats Seite
    if (App.storage.getCurrentPage() === "stats") {
      const timeTd = document.querySelector(`.ice-time-cell[data-player="${playerName}"]`);
      if (timeTd) {
        const sec = App.data.playerTimes[playerName];
        timeTd.textContent = App.helpers.formatTimeMMSS(sec);
        App.statsTable.updateIceTimeColors();
      }
    }
  }, 1000);
  
  // Visual Update bei Seitenwechsel
  App.updateTimerVisuals();
};

App.updateTimerVisuals = function() {
  // Timer visuelle Updates nur wenn auf Stats Seite
  if (App.storage.getCurrentPage() !== "stats") return;
  
  Object.keys(App.data.activeTimers).forEach(playerName => {
    const row = document.querySelector(`tr[data-player="${playerName}"]`);
    const nameTd = row?.querySelector("td:nth-child(2)");
    
    if (row && nameTd) {
      row.style.background = "#005c2f";
      nameTd.style.background = "#005c2f";
    }
  });
};
