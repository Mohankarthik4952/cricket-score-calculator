/* ===============================
   GLOBAL VARIABLES
================================ */
let caller = ""; // team who calls
let call = ""; // HEADS / TAILS
let winner = ""; // toss winner

let teamA = "";
let teamB = "";

/* ===============================
   LOAD TEAMS AFTER PAGE LOAD
================================ */
document.addEventListener("DOMContentLoaded", () => {
  teamA = localStorage.getItem("teamA") || "Team 1";
  teamB = localStorage.getItem("teamB") || "Team 2";

  document.getElementById("teams").innerText = `${teamA} vs ${teamB}`;
});

/* ===============================
   SELECT CALLER
================================ */
function setCaller(t, e) {
  caller = t === "A" ? teamA : teamB;

  // remove active class
  document
    .querySelectorAll(".caller-btn")
    .forEach((btn) => btn.classList.remove("active"));

  // highlight selected
  e.target.classList.add("active");
}

/* ===============================
   SELECT HEADS / TAILS
================================ */
function setCall(c, e) {
  call = c;

  document
    .querySelectorAll(".call-btn")
    .forEach((btn) => btn.classList.remove("active"));

  e.target.classList.add("active");
}

/* ===============================
   FLIP COIN
================================ */
function flipCoin() {
  if (!caller || !call) {
    alert("Please select team and call first!");
    return;
  }

  // random toss result
  let result = Math.random() < 0.5 ? "HEADS" : "TAILS";

  document.getElementById("result").innerText = `Result: ${result}`;

  // determine winner
  if (call === result) {
    winner = caller;
  } else {
    winner = caller === teamA ? teamB : teamA;
  }

  document.getElementById("winner").innerText = `Winner: ${winner}`;

  // show decision buttons
  document.getElementById("decision").classList.remove("hidden");
}

/* ===============================
   BAT / BOWL DECISION
================================ */
function choose(choice) {
  let batting, bowling;

  if (choice === "bat") {
    batting = winner;
    bowling = winner === teamA ? teamB : teamA;
  } else {
    bowling = winner;
    batting = winner === teamA ? teamB : teamA;
  }

  // store teams
  localStorage.setItem("battingTeam", batting);
  localStorage.setItem("bowlingTeam", bowling);

  // go to match page
  window.location.href = "match.html";
}
