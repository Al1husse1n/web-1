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

async function fetchRandomWords({language= "en", category= null} = {}) {
  // show loading state while fetching
  loadText("Loading...");
  textInput.value = "";
  textInput.disabled = true;
  try {
    let res;
    if(language === "en" && category === null){
      res = await fetch(
      "/statement/"
    );
    }
    else if(language === "en"){
      res = await fetch(
      `/statement/?category=${category}`
      );
    }
    else if(category === null){
      res = await fetch(
      `/statement/?language=${language}`
      );
    }
    else if(language === null){
      alert("choose a valid language");
      return;
    }
    const data = await res.json();
    if(res.status===400){
      alert(data.error);
      console.error(data.error);
    }
    else if(res.status===500){
      alert("Something went wrong");
      console.error(data.error)
    }
    else{
      loadText(data.statement);
    }
  } catch (err) {
    alert("Something went wrong");
    console.error("Failed to fetch words", err);
  }
    finally {
      // ensure input is enabled after fetch attempt
      textInput.disabled = false;
    }
}

/* LOAD WORDS INTO BACKGROUND */
function loadText(statement) {
  textDisplay.innerHTML = "";
  statement.split("").forEach(char => {
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
    // enter minimal mode: hide UI except timer and statement
    document.body.classList.add('minimal-mode');
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
    // user finished before timer; mark finished but keep UI hidden until timer ends
    endTest(false);
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
  const minutes = timeTakenSeconds / 60;

  // character-level correctness (for accuracy)
  const chars = textDisplay.querySelectorAll('span');
  const input = textInput.value.split('');
  let correctChars = 0;
  chars.forEach((char, i) => {
    if (input[i] != null && input[i] === char.innerText) correctChars++;
  });
  const totalTyped = input.length;
  const accuracy = totalTyped === 0 ? 0 : Math.max(0, Math.round((correctChars / totalTyped) * 100));

  // word-level correctness (for WPM and incorrectWords)
  const originalText = Array.from(chars).map(c => c.innerText).join('').trim();
  const originalWords = originalText ? originalText.split(/\s+/) : [];
  const inputText = textInput.value.trim();
  const inputWords = inputText ? inputText.split(/\s+/) : [];

  let correctWords = 0;
  let incorrectWords = 0;
  inputWords.forEach((w, i) => {
    if (originalWords[i] && w === originalWords[i]) correctWords++;
    else incorrectWords++;
  });

  const wpm = minutes > 0 ? Math.round(correctWords / minutes) : 0;

  wpmEl.innerText = wpm;
  accuracyEl.innerText = accuracy;

  postStats(
    wpm,
    accuracy,
    originalText,
    correctWords,
    incorrectWords,
    timeTakenSeconds,
    currentCategory.textContent,
    currentLanguage.textContent
  );
}



async function postStats(wpm, accuracy, statement, correct_words, incorrect_words, time, category, language) {
  try {
    let res = await fetch('/statistics/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "wpm": wpm,
        "accuracy": accuracy,
        "statement": statement,
        "correct_words":correct_words,
        "incorrect_words":incorrect_words,
        "time":time,
        "category":category,
        "language":language
      })
    });
    let data = await res.json();
    if(data.errors){
      let errors = data.errors; 
      alert(Object.values(errors)[0]);
    }
    else if(res.status === 400){
      alert(data.error);
    }
    else if(res.status === 500){
      alert("something wrong happened");
      console.log(data.error);
    }
    else if(res.status === 200){
      const params = new URLSearchParams({
        wpm: wpm,
        accuracy: accuracy,
        statement_length: statement.length,
        correct_words:correct_words,
        incorrect_words:incorrect_words,
        time:time,
        category:category,
        language:language  
      });
      window.location.href = "/stat/?" + params.toString();
    }

  } catch (err) {
    console.error('postStats error:', err);
  }
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
  // exit minimal mode on manual restart
  document.body.classList.remove('minimal-mode');
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
      // timer reached zero — end test and exit minimal mode
      endTest(true);
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function endTest(byTimer = false) {
  stopTimer();
  finished = true;
  textInput.disabled = true;
  calculateResults();
  if (byTimer) {
    // timer finished — reveal UI again
    document.body.classList.remove('minimal-mode');
  }
}


const languages = { "English":"en", "French":"fr", "Spanish":"es", "german":"de", "italian":'it', "brazilian portuguese": "pt-br", "hindi": "hi", "chinese":"zh"};

const languageBtn = document.getElementById("languageBtn");
const languageMenu = document.getElementById("languageMenu");
const languageList = document.getElementById("languageList");
const languageSearch = document.getElementById("languageSearch");
const currentLanguage = document.getElementById("currentLanguage");

const categories = {"All categories":null, "Wordle":"wordle", "Countries":"countries", "Brainrot":"brainrot", "Sports":"sports", "Animals":"animals", "Softwares":"softwares", "Games":"games"};
const categoryBtn = document.getElementById("categoryBtn");
const categoryMenu = document.getElementById("categoryMenu");
const categoryList = document.getElementById("categoryList");
const categorySearch = document.getElementById("categorySearch");
const currentCategory = document.getElementById("currentCategory");

function renderLanguages(filter = "") {
  languageList.innerHTML = "";
  Object.keys(languages)
    .filter(lang => lang.toLowerCase().includes(filter.toLowerCase()))
    .forEach(lang => {
      const div = document.createElement("div");
      div.className = "language-item";
      div.textContent = lang;
      div.onclick = () => {
        currentLanguage.textContent = lang;
        languageMenu.classList.add("hidden");
        const cat = categories[currentCategory.textContent];
        fetchRandomWords({language: languages[lang], category: cat})
      };
      languageList.appendChild(div);
    });
}

function renderCategories(filter = "") {
  categoryList.innerHTML = "";
  Object.keys(categories)
    .filter(cat => cat.toLowerCase().includes(filter.toLowerCase()))
    .forEach(cat => {
      const div = document.createElement("div");
      div.className = "language-item";
      div.textContent = cat;
      div.onclick = () => {
        currentCategory.textContent = cat;
        categoryMenu.classList.add("hidden");
        const catCode = categories[cat];
        if (cat !== "All categories") {
          // force English and disable language selection when a specific category is chosen
          currentLanguage.textContent = "English";
          languageBtn.disabled = true;
          languageMenu.classList.add("hidden");
          fetchRandomWords({language: languages["English"], category: catCode});
        } else {
          // re-enable language selection for "All categories"
          languageBtn.disabled = false;
          const lang = languages[currentLanguage.textContent] || 'en';
          fetchRandomWords({language: lang, category: catCode});
        }
      };
      categoryList.appendChild(div);
    });
}

languageBtn.onclick = () => {
  if (languageBtn.disabled) return;
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


