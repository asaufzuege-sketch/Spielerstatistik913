// Team Selection Module - KORRIGIERT
App.teamSelection = {
  teams: {
    team1: { name: "Team 1", data: {} },
    team2: { name: "Team 2", data: {} },
    team3: { name: "Team 3", data: {} }
  },
  currentTeam: null,
  editingTeam: null,
  
  init() {
    console.log("Initialisiere Team Selection...");
    this.loadTeamsFromStorage();
    this.attachEventListeners();
    this.updateTeamDisplays();
  },
  
  attachEventListeners() {
    // Team Auswahl Buttons
    for (let i = 1; i <= 3; i++) {
      const btn = document.getElementById(`teamBtn${i}`);
      const editBtn = document.getElementById(`editBtn${i}`);
      
      if (btn) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.selectTeam(`team${i}`);
        });
      }
      
      if (editBtn) {
        editBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.openEditModal(`team${i}`);
        });
      }
    }
    
    // Modal Buttons
    const saveBtn = document.getElementById("saveTeamNameBtn");
    const cancelBtn = document.getElementById("cancelTeamEditBtn");
    const modal = document.getElementById("teamEditModal");
    
    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        this.saveTeamName();
      });
    }
    
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        this.closeEditModal();
      });
    }
    
    // Modal schließen bei Klick außerhalb
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.closeEditModal();
        }
      });
    }
  },
  
  selectTeam(teamId) {
    console.log(`Team ${teamId} ausgewählt`);
    
    // Speichere aktuelles Team wenn vorhanden
    if (this.currentTeam) {
      this.saveCurrentTeamData();
    }
    
    this.currentTeam = teamId;
    App.data.currentTeam = teamId;
    localStorage.setItem("currentTeam", teamId);
    
    // Lade Team-Daten
    this.loadTeamData(teamId);
    
    // Update Display
    const teamDisplay = document.getElementById("currentTeamDisplay");
    if (teamDisplay) {
      teamDisplay.textContent = this.teams[teamId].name;
    }
    
    const statsTeamDisplay = document.getElementById("statsTeamDisplay");
    if (statsTeamDisplay) {
      statsTeamDisplay.textContent = this.teams[teamId].name;
    }
    
    // Wechsel zur Spielerauswahl
    App.showPage("selection");
  },
  
  openEditModal(teamId) {
    this.editingTeam = teamId;
    const modal = document.getElementById("teamEditModal");
    const input = document.getElementById("teamNameInput");
    
    if (modal && input) {
      input.value = this.teams[teamId].name;
      modal.style.display = "flex";
      input.focus();
      input.select();
    }
  },
  
  closeEditModal() {
    const modal = document.getElementById("teamEditModal");
    if (modal) {
      modal.style.display = "none";
    }
    this.editingTeam = null;
  },
  
  saveTeamName() {
    const input = document.getElementById("teamNameInput");
    if (!input || !this.editingTeam) return;
    
    const newName = input.value.trim();
    if (newName) {
      this.teams[this.editingTeam].name = newName;
      this.saveTeams();
      this.updateTeamDisplays();
    }
    
    this.closeEditModal();
  },
  
  updateTeamDisplays() {
    for (let i = 1; i <= 3; i++) {
      const teamId = `team${i}`;
      const nameElement = document.getElementById(`teamName${i}`);
      if (nameElement) {
        nameElement.textContent = this.teams[teamId].name;
      }
    }
  },
  
  saveCurrentTeamData() {
    if (!this.currentTeam) return;
    
    const teamId = this.currentTeam;
    
    // Speichere alle Daten mit Team-Prefix
    localStorage.setItem(`selectedPlayers_${teamId}`, JSON.stringify(App.data.selectedPlayers || []));
    localStorage.setItem(`statsData_${teamId}`, JSON.stringify(App.data.statsData || {}));
    localStorage.setItem(`playerTimes_${teamId}`, JSON.stringify(App.data.playerTimes || {}));
    localStorage.setItem(`seasonData_${teamId}`, JSON.stringify(App.data.seasonData || {}));
    
    // Speichere Opponent Shots
    const shotCell = document.querySelector('.total-cell[data-cat="Shot"]');
    if (shotCell && shotCell.dataset.opp) {
      localStorage.setItem(`opponentShots_${teamId}`, shotCell.dataset.opp);
    }
    
    // Speichere aktive Timer
    const activeTimerPlayers = Object.keys(App.data.activeTimers || {});
    localStorage.setItem(`activeTimerPlayers_${teamId}`, JSON.stringify(activeTimerPlayers));
    
    console.log(`Daten für ${teamId} gespeichert`);
  },
  
  loadTeamData(teamId) {
    // Lade teamspezifische Daten
    const savedPlayers = localStorage.getItem(`selectedPlayers_${teamId}`);
    const savedStats = localStorage.getItem(`statsData_${teamId}`);
    const savedTimes = localStorage.getItem(`playerTimes_${teamId}`);
    const savedSeason = localStorage.getItem(`seasonData_${teamId}`);
    const savedOppShots = localStorage.getItem(`opponentShots_${teamId}`);
    const savedActiveTimers = localStorage.getItem(`activeTimerPlayers_${teamId}`);
    
    // Reset App Daten
    App.data.selectedPlayers = savedPlayers ? JSON.parse(savedPlayers) : [];
    App.data.statsData = savedStats ? JSON.parse(savedStats) : {};
    App.data.playerTimes = savedTimes ? JSON.parse(savedTimes) : {};
    App.data.seasonData = savedSeason ? JSON.parse(savedSeason) : {};
    
    // Stoppe alle Timer
    Object.values(App.data.activeTimers || {}).forEach(timer => {
      if (timer) clearInterval(timer);
    });
    App.data.activeTimers = {};
    
    // Restore aktive Timer wenn vorhanden
    if (savedActiveTimers) {
      try {
        const timerPlayers = JSON.parse(savedActiveTimers);
        timerPlayers.forEach(playerName => {
          if (App.data.selectedPlayers.some(p => p.name === playerName)) {
            if (typeof App.startPlayerTimer === 'function') {
              App.startPlayerTimer(playerName);
            }
          }
        });
      } catch (e) {
        console.warn("Fehler beim Wiederherstellen der Timer:", e);
      }
    }
    
    // Restore opponent shots (wird bei Table-Render angewendet)
    if (savedOppShots) {
      setTimeout(() => {
        const shotCell = document.querySelector('.total-cell[data-cat="Shot"]');
        if (shotCell) {
          shotCell.dataset.opp = savedOppShots;
          if (App.statsTable && typeof App.statsTable.updateTotals === 'function') {
            App.statsTable.updateTotals();
          }
        }
      }, 100);
    }
    
    console.log(`Daten für ${teamId} geladen`, {
      players: App.data.selectedPlayers.length,
      hasStats: Object.keys(App.data.statsData).length > 0
    });
  },
  
  saveTeams() {
    const teamsData = {};
    Object.keys(this.teams).forEach(teamId => {
      teamsData[teamId] = { name: this.teams[teamId].name };
    });
    localStorage.setItem("teams", JSON.stringify(teamsData));
  },
  
  loadTeamsFromStorage() {
    const saved = localStorage.getItem("teams");
    if (saved) {
      try {
        const teamsData = JSON.parse(saved);
        Object.keys(teamsData).forEach(teamId => {
          if (this.teams[teamId]) {
            this.teams[teamId].name = teamsData[teamId].name || this.teams[teamId].name;
          }
        });
      } catch (e) {
        console.warn("Fehler beim Laden der Teams:", e);
      }
    }
  },
  
  getCurrentTeam() {
    return this.currentTeam ? parseInt(this.currentTeam.replace('team', '')) : null;
  },
  
  resetCurrentTeam() {
    if (!this.currentTeam) {
      alert("Kein Team ausgewählt!");
      return false;
    }
    
    const teamName = this.teams[this.currentTeam].name;
    
    if (!confirm(`${teamName} Daten vollständig zurücksetzen? Diese Aktion kann nicht rückgängig gemacht werden.`)) {
      return false;
    }
    
    // Stoppe alle Timer
    Object.values(App.data.activeTimers || {}).forEach(timer => {
      if (timer) clearInterval(timer);
    });
    App.data.activeTimers = {};
    
    // Entferne teamspezifische Daten
    const keysToRemove = [
      `selectedPlayers_${this.currentTeam}`,
      `statsData_${this.currentTeam}`,
      `playerTimes_${this.currentTeam}`,
      `seasonData_${this.currentTeam}`,
      `opponentShots_${this.currentTeam}`,
      `activeTimerPlayers_${this.currentTeam}`
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Reset App Daten
    App.data.selectedPlayers = [];
    App.data.statsData = {};
    App.data.playerTimes = {};
    App.data.seasonData = {};
    
    // Refresh UI
    if (App.statsTable && typeof App.statsTable.render === 'function') {
      App.statsTable.render();
    }
    if (App.seasonTable && typeof App.seasonTable.render === 'function') {
      App.seasonTable.render();
    }
    
    console.log(`Reset abgeschlossen für ${teamName}`);
    alert(`${teamName} wurde zurückgesetzt.`);
    
    return true;
  }
};
