/* ===============================
   PAGE LOAD
================================ */
window.onload = function () {
  createPlayerInputs("teamAPlayers");
  createPlayerInputs("teamBPlayers");

  loadPreviousData();
};

/* ===============================
   CREATE PLAYER INPUTS (11 MAX)
================================ */
function createPlayerInputs(containerId) {
  const container = document.getElementById(containerId);

  for (let i = 1; i <= 11; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Player " + i;
    input.className = "player-input";

    container.appendChild(input);
  }
}

/* ===============================
   LOAD PREVIOUS DATA (UX BOOST)
================================ */
function loadPreviousData() {
  let teamA = localStorage.getItem("teamA");
  let teamB = localStorage.getItem("teamB");
  let overs = localStorage.getItem("overs");

  if (teamA) document.getElementById("teamA").value = teamA;
  if (teamB) document.getElementById("teamB").value = teamB;
  if (overs) document.getElementById("overs").value = overs;

  // Load players if available
  let teamAPlayers = JSON.parse(localStorage.getItem("teamAPlayers")) || [];
  let teamBPlayers = JSON.parse(localStorage.getItem("teamBPlayers")) || [];

  fillPlayers("teamAPlayers", teamAPlayers);
  fillPlayers("teamBPlayers", teamBPlayers);
}

/* ===============================
   FILL PLAYER INPUTS
================================ */
function fillPlayers(containerId, players) {
  const inputs = document.querySelectorAll(`#${containerId} input`);

  inputs.forEach((input, index) => {
    if (players[index]) {
      input.value = players[index];
    }
  });
}

/* ===============================
   GET PLAYERS ARRAY
================================ */
function getPlayers(containerId) {
  const inputs = document.querySelectorAll(`#${containerId} input`);
  let players = [];

  inputs.forEach((input) => {
    if (input.value.trim() !== "") {
      players.push(input.value.trim());
    }
  });

  return players;
}

/* ===============================
   VALIDATION
================================ */
function validate(teamAPlayers, teamBPlayers) {
  if (teamAPlayers.length < 2) {
    alert("Team A must have at least 2 players");
    return false;
  }

  if (teamBPlayers.length < 2) {
    alert("Team B must have at least 2 players");
    return false;
  }

  return true;
}

/* ===============================
   START MATCH
================================ */
function startMatch() {
  let teamA = document.getElementById("teamA").value.trim() || "Team 1";
  let teamB = document.getElementById("teamB").value.trim() || "Team 2";
  let overs = parseInt(document.getElementById("overs").value);

  let teamAPlayers = getPlayers("teamAPlayers");
  let teamBPlayers = getPlayers("teamBPlayers");

  // Validate players
  if (!validate(teamAPlayers, teamBPlayers)) return;

  // Rules
  let rules = {
    sixOut: document.getElementById("sixOut").checked,
  };

  /* STORE DATA */
  localStorage.setItem("teamA", teamA);
  localStorage.setItem("teamB", teamB);
  localStorage.setItem("overs", overs);

  localStorage.setItem("teamAPlayers", JSON.stringify(teamAPlayers));
  localStorage.setItem("teamBPlayers", JSON.stringify(teamBPlayers));

  localStorage.setItem("rules", JSON.stringify(rules));

  /* RESET MATCH DATA */
  localStorage.removeItem("winner");
  localStorage.removeItem("scoreA");
  localStorage.removeItem("scoreB");

  /* NAVIGATE */
  window.location.href = "/toss.html";
}
