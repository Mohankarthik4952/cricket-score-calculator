/* ===============================
   LOAD DATA
================================ */
/* ===============================
   PAGE ACCESS CONTROL
================================ */
if (
  !localStorage.getItem("teamA") ||
  !localStorage.getItem("teamB") ||
  !localStorage.getItem("battingTeam") ||
  !localStorage.getItem("bowlingTeam")
) {
  alert("Please start match from home page!");

  window.location.href = "index.html";
}

let teamA = localStorage.getItem("teamA");
let teamB = localStorage.getItem("teamB");

let teamAPlayers = JSON.parse(localStorage.getItem("teamAPlayers")) || [];
let teamBPlayers = JSON.parse(localStorage.getItem("teamBPlayers")) || [];

let bat = localStorage.getItem("battingTeam");
let bowl = localStorage.getItem("bowlingTeam");

let oversLimit = parseInt(localStorage.getItem("overs")) * 6;

/* ===============================
   SELECT BATTING PLAYERS
================================ */
let battingPlayers = bat === teamA ? teamAPlayers : teamBPlayers;

if (battingPlayers.length < 2) {
  battingPlayers = ["Player1", "Player2", "Player3"];
}

/* ===============================
   PLAYER OBJECT
================================ */
let players = battingPlayers.map((name) => ({
  name,
  runs: 0,
  balls: 0,
  out: false,
  howOut: "",
}));

/* ===============================
   MATCH STATE
================================ */
let striker = 0;
let nonStriker = 1;
let next = 2;

let runs = 0,
  wickets = 0,
  balls = 0;
let innings = 1,
  target = 0;

let battingStarted = false;
let waitingForNextBatsman = false;

/* ===============================
   OVER TRACKING
================================ */
let currentOverRuns = 0;
let overHistory = [];

/* ===============================
   UNDO HISTORY
================================ */
let history = [];

function saveState() {
  history.push({
    runs,
    wickets,
    balls,
    striker,
    nonStriker,
    next,
    players: JSON.parse(JSON.stringify(players)),
    currentOverRuns,
    overHistory: JSON.parse(JSON.stringify(overHistory)),
  });
}

/* ===============================
   LOAD BATSMAN
================================ */
function loadBatsmanSelection() {
  let s = document.getElementById("strikerSelect");
  let n = document.getElementById("nonStrikerSelect");

  players.forEach((p, i) => {
    s.add(new Option(p.name, i));
    n.add(new Option(p.name, i));
  });
}

/* ===============================
   START
================================ */
function startBatting() {
  let s = parseInt(document.getElementById("strikerSelect").value);
  let n = parseInt(document.getElementById("nonStrikerSelect").value);

  if (s === n) return alert("Select different players!");

  striker = s;
  nonStriker = n;
  battingStarted = true;

  update();
}

/* ===============================
   UPDATE UI
================================ */
function update() {
  let s = players[striker];
  let n = players[nonStriker];

  document.getElementById("score").innerText = `${runs}/${wickets}`;
  document.getElementById("overs").innerText = "Overs: " + overs(balls);

  document.getElementById("striker").innerText = s.name;
  document.getElementById("strikerScore").innerText =
    `${s.runs} (${s.balls})${s.out ? ` (${s.howOut})` : ""} | SR: ${strikeRate(s.runs, s.balls)}`;

  document.getElementById("nonStriker").innerText = n.name;
  document.getElementById("nonStrikerScore").innerText =
    `${n.runs} (${n.balls})${n.out ? ` (${n.howOut})` : ""} | SR: ${strikeRate(n.runs, n.balls)}`;

  document.getElementById("title").innerText =
    innings === 1 ? `${bat} vs ${bowl}` : `${bat} chasing ${target}`;

  /* CRR */
  document.getElementById("runRate").innerText = `CRR: ${runRate(runs, balls)}`;

  /* CHASE */
  if (innings === 2) {
    let runsNeeded = target - runs;
    let ballsLeft = oversLimit - balls;

    if (runsNeeded > 0) {
      document.getElementById("target").innerText =
        `Need ${runsNeeded} runs in ${ballsLeft} balls`;

      document.getElementById("reqRunRate").innerText =
        `RRR: ${requiredRunRate(runsNeeded, ballsLeft)}`;
    } else {
      document.getElementById("target").innerText =
        `${bat} won by ${ballsLeft} balls`;

      document.getElementById("reqRunRate").innerText = "";
    }
  }

  updateOverDisplay();
}

/* ===============================
   RUN
================================ */
function run(x) {
  if (!battingStarted) return alert("Select batsmen first!");
  if (waitingForNextBatsman) return alert("Select next batsman!");

  saveState();

  let s = players[striker];

  runs += x;
  balls++;
  currentOverRuns += x;

  s.runs += x;
  s.balls++;

  if (x % 2 === 1) swapStrike();

  checkOver();

  if (innings === 2 && runs >= target) {
    update();
    setTimeout(endMatch, 800);
    return;
  }

  checkInnings();
  update();
}

/* ===============================
   NORMAL OUT (bowled/catch)
================================ */
function out(type = "bowled") {
  if (!battingStarted) return alert("Start first!");
  if (waitingForNextBatsman) return alert("Select next batsman!");

  saveState();

  let s = players[striker];

  wickets++;
  balls++;

  s.out = true;
  s.howOut = type;
  s.balls++;

  if (next < players.length) {
    waitingForNextBatsman = true;
    showNextBatsmanOptions();
  } else {
    checkInnings();
  }

  update();
}

/* ===============================
   RUN OUT (STRIKER/NON)
================================ */
function runOut(who) {
  if (!battingStarted) return alert("Start first!");
  if (waitingForNextBatsman) return alert("Select next batsman!");

  saveState();

  let index = who === "striker" ? striker : nonStriker;
  let p = players[index];

  wickets++;
  balls++;

  p.out = true;
  p.howOut = who === "striker" ? "runout (striker)" : "runout (non-striker)";
  p.balls++;

  if (index === striker) {
    if (next < players.length) {
      waitingForNextBatsman = true;
      showNextBatsmanOptions();
    } else {
      checkInnings();
    }
  } else {
    if (next < players.length) {
      nonStriker = next++;
    } else {
      checkInnings();
    }
  }

  update();
}

/* ===============================
   NEXT BATSMAN
================================ */
function showNextBatsmanOptions() {
  let box = document.getElementById("nextBatsmanBox");
  let select = document.getElementById("nextBatsmanSelect");

  select.innerHTML = "";

  players.forEach((p, i) => {
    if (!p.out && i !== striker && i !== nonStriker) {
      select.add(new Option(p.name, i));
    }
  });

  box.classList.remove("hidden");
}

function confirmNextBatsman() {
  let index = parseInt(document.getElementById("nextBatsmanSelect").value);

  striker = index;
  next++;

  waitingForNextBatsman = false;
  document.getElementById("nextBatsmanBox").classList.add("hidden");

  update();
}

/* ===============================
   STRIKE
================================ */
function swapStrike() {
  [striker, nonStriker] = [nonStriker, striker];
}

/* ===============================
   OVER
================================ */
function checkOver() {
  if (balls % 6 === 0) {
    overHistory.push({
      over: Math.floor(balls / 6),
      runs: currentOverRuns,
    });

    currentOverRuns = 0;
    swapStrike();
  }
}

/* ===============================
   OVER DISPLAY
================================ */
function updateOverDisplay() {
  let div = document.getElementById("overSummary");
  if (!div) return;

  div.innerHTML = overHistory
    .map((o) => `<p>Over ${o.over} → ${o.runs} runs</p>`)
    .join("");
}

/* ===============================
   INNINGS
================================ */
function checkInnings() {
  if (balls >= oversLimit || wickets === players.length - 1) {
    if (innings === 1) {
      target = runs + 1;
      innings = 2;

      runs = wickets = balls = 0;
      [bat, bowl] = [bowl, bat];

      players = (bat === teamA ? teamAPlayers : teamBPlayers).map((name) => ({
        name,
        runs: 0,
        balls: 0,
        out: false,
        howOut: "",
      }));

      striker = 0;
      nonStriker = 1;
      next = 2;

      battingStarted = false;
      waitingForNextBatsman = false;

      overHistory = [];
      currentOverRuns = 0;

      document.getElementById("overSummary").innerHTML = "";
      document.getElementById("strikerSelect").innerHTML = "";
      document.getElementById("nonStrikerSelect").innerHTML = "";

      loadBatsmanSelection();
    } else {
      endMatch();
    }
  }
}

/* ===============================
   END MATCH
================================ */
function endMatch() {
  let result;

  if (runs >= target) {
    result = `${bat} won by ${oversLimit - balls} balls`;
  } else {
    result = `${bowl} won by ${target - 1 - runs} runs`;
  }

  localStorage.setItem("winner", result);

  if (bat === teamA) {
    localStorage.setItem("scoreA", `${runs}/${wickets}`);
    localStorage.setItem("scoreB", `${target - 1}`);
  } else {
    localStorage.setItem("scoreB", `${runs}/${wickets}`);
    localStorage.setItem("scoreA", `${target - 1}`);
  }

  window.location.href = "result.html";
}

/* ===============================
   SCORECARD
================================ */
function showScorecard() {
  let text = "Scorecard:\n\n";

  players.forEach((p) => {
    text += `${p.name} - ${p.runs} (${p.balls}) ${p.out ? `(${p.howOut})` : "not out"}\n`;
  });

  alert(text);
}

/* ===============================
   INIT
================================ */
loadBatsmanSelection();
update();
