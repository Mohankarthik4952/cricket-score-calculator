/* ===============================
   LOAD RULES FROM STORAGE
================================ */
function getRules() {
  return JSON.parse(localStorage.getItem("rules")) || {};
}

/* ===============================
   APPLY RUN RULES
================================ */
function applyRunRules(runValue, context) {
  const rules = getRules();

  // Six = OUT rule
  if (rules.sixOut && runValue === 6) {
    return {
      type: "OUT",
      value: 0,
    };
  }

  return {
    type: "RUN",
    value: runValue,
  };
}

/* ===============================
   APPLY WICKET RULES
================================ */
function applyWicketRules(context) {
  const rules = getRules();

  // future rules can go here
  // example:
  // if (rules.noLBW && context.type === "LBW") return null;

  return {
    type: "WICKET",
  };
}

/* ===============================
   RULES DESCRIPTION (OPTIONAL)
================================ */
function getRulesSummary() {
  const rules = getRules();
  let summary = [];

  if (rules.sixOut) summary.push("Six = OUT");

  return summary.length > 0 ? summary.join(", ") : "No special rules";
}
