const textElement = document.getElementById('text-to-type');
const inputElement = document.getElementById('input-text');
const timeElement = document.getElementById('time');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const restartBtn = document.getElementById('restart-btn');

const texts = [
  "The quick brown fox jumps over the lazy dog.",
  "Pack my box with five dozen liquor jugs.",
  "How vexingly quick daft zebras jump."
];

let startTime, timerInterval;

function chooseText() {
  const randomIndex = Math.floor(Math.random() * texts.length);
  textElement.textContent = texts[randomIndex];
}

function startTimer() {
  timeElement.textContent = '0';
  wpmElement.textContent = '0';
  startTime = new Date();
  timerInterval = setInterval(updateTime, 1000);
}

function updateTime() {
  const elapsed = Math.floor((new Date() - startTime) / 1000);
  timeElement.textContent = elapsed;
}

function calculateWPM() {
  const wordsTyped = inputElement.value.trim().split(/\s+/).length;
  const elapsedMinutes = (new Date() - startTime) / 1000 / 60;
  const wpm = Math.round(wordsTyped / elapsedMinutes) || 0;
  wpmElement.textContent = wpm;
}

function calculateAccuracy() {
  const target = textElement.textContent;
  const inputText = inputElement.value;
  let correctChars = 0;
  for (let i = 0; i < inputText.length; i++) {
    if (inputText[i] === target[i]) {
      correctChars++;
    }
  }
  const accuracy = Math.round((correctChars / target.length) * 100) || 0;
  accuracyElement.textContent = accuracy;
}

inputElement.addEventListener('input', () => {
  if (!startTime) startTimer();
  calculateAccuracy();
  if (inputElement.value === textElement.textContent) {
    clearInterval(timerInterval);
    calculateWPM();
    calculateAccuracy();
    inputElement.disabled = true;
  }
});

restartBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  inputElement.disabled = false;
  inputElement.value = '';
  chooseText();
  startTime = null;
  timeElement.textContent = '0';
  wpmElement.textContent = '0';
  accuracyElement.textContent = '0';
});

chooseText();