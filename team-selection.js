// New team selection module

const teamBtn1 = document.getElementById('teamBtn1');
const teamBtn2 = document.getElementById('teamBtn2');
const teamBtn3 = document.getElementById('teamBtn3');
const currentTeamDisplay = document.getElementById('currentTeamDisplay');
const statsTeamDisplay = document.getElementById('statsTeamDisplay');

let currentTeam = '';

function updateDisplays() {
    currentTeamDisplay.textContent = `Current Team: ${currentTeam}`;
    // Update statsTeamDisplay with relevant statistics
    statsTeamDisplay.textContent = `Stats for ${currentTeam}: ...`;
}

teamBtn1.addEventListener('click', () => {
    currentTeam = 'Team 1';
    updateDisplays();
});

teamBtn2.addEventListener('click', () => {
    currentTeam = 'Team 2';
    updateDisplays();
});

teamBtn3.addEventListener('click', () => {
    currentTeam = 'Team 3';
    updateDisplays();
});