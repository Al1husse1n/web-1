const textDisplay = document.getElementById("text-display");
const textInput = document.getElementById("text-input");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const timeLeftEl = document.getElementById("time-left");
const restartBtn = document.getElementById("restartBtn");
const time15Btn = document.getElementById("time15");
const time30Btn = document.getElementById("time30");
const time60Btn = document.getElementById("time60");

let words = "";
let startTime = null;
let errors = 0;
let finished = false;
let selectedTime = 15; // seconds
let remainingTime = selectedTime;
let timerInterval = null;

async function fetchRandomWords() {
  try {
    const res = await fetch(
      "https://random-words-api.kushcreates.com/api?language=en&length=5&words=30"
    );
    const data = await res.json();

    // API returns array of objects → extract word
    words = data.map(item => item.word).join(" ");

    loadText();
  } catch (err) {
    console.error("Failed to fetch words", err);
  }
}

/* LOAD WORDS INTO BACKGROUND */
function loadText() {
  textDisplay.innerHTML = "";
  words.split("").forEach(char => {
    const span = document.createElement("span");
    span.innerText = char;
    textDisplay.appendChild(span);
  });
}

/* TYPING LOGIC */
textInput.addEventListener("input", () => {
  if (!startTime) {
    startTime = new Date();
    // start countdown when user begins typing
    startTimer();
  }

  const chars = textDisplay.querySelectorAll("span");
  const input = textInput.value.split("");
  errors = 0;

  chars.forEach((char, index) => {
    if (input[index] == null) {
      char.className = "";
    } else if (input[index] === char.innerText) {
      char.className = "correct";
    } else {
      char.className = "incorrect";
      errors++;
    }
  });

  if (input.length >= chars.length && !finished) {
    finished = true;
    endTest();
  }
});

restartBtn.addEventListener("click", () => {
  restartTest();
});

// initial
fetchRandomWords();

// Time selection handlers
function setSelectedTime(seconds, btn) {
  selectedTime = seconds;
  remainingTime = seconds;
  timeLeftEl.innerText = remainingTime;
  // update active class
  document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

time15Btn.onclick = () => setSelectedTime(15, time15Btn);
time30Btn.onclick = () => setSelectedTime(30, time30Btn);
time60Btn.onclick = () => setSelectedTime(60, time60Btn);

// set initial selection
setSelectedTime(selectedTime, time15Btn);

function calculateResults() {
  if (!startTime) return;
  const now = new Date();
  const timeTakenSeconds = Math.max((now - startTime) / 1000, 1);
  const charsTyped = textInput.value.length;
  const wordsTyped = charsTyped / 5;
  const minutes = timeTakenSeconds / 60;
  const wpm = Math.round(wordsTyped / minutes) || 0;

  // accuracy based on character-by-character comparison
  const chars = textDisplay.querySelectorAll('span');
  const input = textInput.value.split('');
  let correct = 0;
  chars.forEach((char, i) => {
    if (input[i] != null && input[i] === char.innerText) correct++;
  });
  const total = chars.length || 1;
  const accuracy = Math.max(0, Math.round((correct / total) * 100));

  wpmEl.innerText = wpm;
  accuracyEl.innerText = accuracy;
}


let tabPressed = false;

document.addEventListener("keydown", (e) => {

  if (e.key === "Tab") {
    e.preventDefault();
    tabPressed = true;
  }

  if (e.key === "Enter" && tabPressed) {
    e.preventDefault();
    restartTest();
    tabPressed = false;
  }

  if (e.key === "Escape") {
    openCommandLine();
  }

  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "p") {
    e.preventDefault();
    openCommandLine();
  }
});

function restartTest() {
  stopTimer();
  textInput.value = "";
  textInput.disabled = false;
  startTime = null;
  errors = 0;
  finished = false;
  wpmEl.innerText = 0;
  accuracyEl.innerText = 0;
  remainingTime = selectedTime;
  timeLeftEl.innerText = remainingTime;
  fetchRandomWords();
  textInput.focus();
}

function startTimer() {
  if (timerInterval) return;
  remainingTime = selectedTime;
  timeLeftEl.innerText = remainingTime;
  timerInterval = setInterval(() => {
    remainingTime -= 1;
    timeLeftEl.innerText = remainingTime;
    if (remainingTime <= 0) {
      endTest();
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function endTest() {
  stopTimer();
  finished = true;
  textInput.disabled = true;
  calculateResults();
}

function openCommandLine() {
  alert("Command line opened (feature coming soon 👀)");
}

const languages = [ "english", "french", "spanish","german","italian","portuguese", "arabic", "amharic", "swahili", "hindi", "chinese", "japanese", "korean","russian", "turkish"
];

const languageBtn = document.getElementById("languageBtn");
const languageMenu = document.getElementById("languageMenu");
const languageList = document.getElementById("languageList");
const languageSearch = document.getElementById("languageSearch");
const currentLanguage = document.getElementById("currentLanguage");

// Categories (UI mirrors languages dropdown)
const categories = ["All categories", "Wordle", "countries", "brainrot", "Sports", "animals", "Softwares", "Games"];
const categoryBtn = document.getElementById("categoryBtn");
const categoryMenu = document.getElementById("categoryMenu");
const categoryList = document.getElementById("categoryList");
const categorySearch = document.getElementById("categorySearch");
const currentCategory = document.getElementById("currentCategory");

function renderLanguages(filter = "") {
  languageList.innerHTML = "";
  languages
    .filter(lang => lang.includes(filter.toLowerCase()))
    .forEach(lang => {
      const div = document.createElement("div");
      div.className = "language-item";
      div.textContent = lang;
      div.onclick = () => {
        currentLanguage.textContent = lang;
        languageMenu.classList.add("hidden");
      };
      languageList.appendChild(div);
    });
}

function renderCategories(filter = "") {
  categoryList.innerHTML = "";
  categories
    .filter(cat => cat.toLowerCase().includes(filter.toLowerCase()))
    .forEach(cat => {
      const div = document.createElement("div");
      div.className = "language-item";
      div.textContent = cat;
      div.onclick = () => {
        currentCategory.textContent = cat;
        categoryMenu.classList.add("hidden");
      };
      categoryList.appendChild(div);
    });
}

languageBtn.onclick = () => {
  languageMenu.classList.toggle("hidden");
  languageSearch.value = "";
  renderLanguages();
};

categoryBtn.onclick = () => {
  categoryMenu.classList.toggle("hidden");
  categorySearch.value = "";
  renderCategories();
};

languageSearch.addEventListener("input", (e) => {
  renderLanguages(e.target.value);
});

categorySearch.addEventListener("input", (e) => {
  renderCategories(e.target.value);
});

// close when clicking outside
document.addEventListener("click", (e) => {
  if (!languageBtn.contains(e.target) && !languageMenu.contains(e.target)) {
    languageMenu.classList.add("hidden");
  }
  if (typeof categoryBtn !== 'undefined' && typeof categoryMenu !== 'undefined') {
    if (!categoryBtn.contains(e.target) && !categoryMenu.contains(e.target)) {
      categoryMenu.classList.add('hidden');
    }
  }
});

// initial
renderLanguages();
renderCategories();

const notifBtn = document.getElementById("notifBtn");
const loginBtn = document.getElementById("loginBtn");
const notifMenu = document.getElementById("notifMenu");
const loginMenu = document.getElementById("loginMenu");

notifBtn.onclick = (e) => {
  e.stopPropagation();
  notifMenu.classList.toggle("hidden");
  loginMenu.classList.add("hidden");
};

loginBtn.onclick = (e) => {
  e.stopPropagation();
  loginMenu.classList.toggle("hidden");
  notifMenu.classList.add("hidden");
};

// close when clicking outside
document.addEventListener("click", () => {
  notifMenu.classList.add("hidden");
  loginMenu.classList.add("hidden");
});