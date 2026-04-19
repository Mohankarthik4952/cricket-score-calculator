/* ===============================
   BALLS → OVERS (e.g., 17 → 2.5)
================================ */
function overs(balls) {
  let o = Math.floor(balls / 6);
  let b = balls % 6;
  return `${o}.${b}`;
}

/* ===============================
   STRIKE RATE
================================ */
function strikeRate(runs, balls) {
  if (!balls || balls === 0) return "0.0";
  return ((runs / balls) * 100).toFixed(1);
}

/* ===============================
   RUN RATE (TEAM)
================================ */
function runRate(runs, balls) {
  if (!balls || balls === 0) return "0.00";
  return ((runs / balls) * 6).toFixed(2);
}

/* ===============================
   REQUIRED RUN RATE
================================ */
function requiredRunRate(runsNeeded, ballsLeft) {
  if (!ballsLeft || ballsLeft === 0) return "0.00";
  return ((runsNeeded / ballsLeft) * 6).toFixed(2);
}

/* ===============================
   CLAMP VALUE (SAFE LIMITS)
================================ */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/* ===============================
   SAFE PARSE INT
================================ */
function toInt(value, fallback = 0) {
  let n = parseInt(value);
  return isNaN(n) ? fallback : n;
}

/* ===============================
   FORMAT SCORE (runs/wickets)
================================ */
function formatScore(runs, wickets) {
  return `${runs}/${wickets}`;
}
