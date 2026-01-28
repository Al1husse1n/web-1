// SAMPLE RESULT DATA (mock) — replace with DB values later
const sampleResult = {
  wpm: 125,
  accuracy: 96,
  raw: 128,
  characters: "321 / 5 / 0 / 0",
  consistency: 89,
  time: "30s",
  testType: "time 30 · english",
  other: "valid"
};

function populateStats(result) {
  const set = (id, value) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = value;
  };

  set('wpm', result.wpm);
  set('acc', result.accuracy + '%');
  set('raw', result.raw);
  set('characters', result.characters);
  set('consistency', result.consistency + '%');
  set('time', result.time);
  set('testType', result.testType);
  set('other', result.other);
}

document.addEventListener('DOMContentLoaded', () => {
  populateStats(sampleResult);

  // Buttons (placeholders)
  const retake = document.getElementById('retake');
  const next = document.getElementById('next');
  if (retake) retake.onclick = () => { alert('Retake test'); };
  if (next) next.onclick = () => { alert('Next test'); };
});
