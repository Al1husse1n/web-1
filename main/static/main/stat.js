// Sample result data (mock)
const result = {
  wpm: 82,
  accuracy: 97,
  raw: 86,
  characters: "321 / 5 / 0 / 0",
  consistency: 89,
  time: "30s",
  testType: "time 30 · english",
  other: "valid"
};

// Inject data into UI
document.getElementById("wpm").textContent = result.wpm;
document.getElementById("acc").textContent = result.accuracy + "%";
document.getElementById("raw").textContent = result.raw;
document.getElementById("characters").textContent = result.characters;
document.getElementById("consistency").textContent = result.consistency + "%";
document.getElementById("time").textContent = result.time;
document.getElementById("testType").textContent = result.testType;
document.getElementById("other").textContent = result.other;

// Buttons (placeholder behavior)
document.getElementById("retake").onclick = () => {
  alert("Retake test");
};

document.getElementById("next").onclick = () => {
  alert("Next test");
};
