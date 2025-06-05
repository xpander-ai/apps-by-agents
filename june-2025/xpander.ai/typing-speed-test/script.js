const textDisplay = document.getElementById('text-display');
const textInput = document.getElementById('text-input');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');
const timerElement = document.getElementById('time');
const wpmElement = document.getElementById('wpm-value');
const accuracyElement = document.getElementById('accuracy-value');

let timer;
let timeLeft = 60;
let startTime;
let targetText = '';

const texts = [
  'The quick brown fox jumps over the lazy dog.',
  'Hello world, welcome to the typing speed test.',
  'Practice makes perfect, keep typing every day.',
  'JavaScript is a versatile programming language.',
  'Coding challenges improve your problem solving skills.',
];

function getRandomText() {
  return texts[Math.floor(Math.random() * texts.length)];
}

function startTest() {
  resetTest();
  targetText = getRandomText();
  textDisplay.textContent = targetText;
  textInput.disabled = false;
  textInput.focus();
  startTime = Date.now();
  timer = setInterval(updateTimer, 1000);
  startButton.disabled = true;
  resetButton.disabled = false;
}

function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const time = timeLeft - elapsed;
  timerElement.textContent = time >= 0 ? time : 0;
  if (time <= 0) {
    endTest();
  }
}

function calculateResults() {
  const entered = textInput.value;
  const wordsTyped = entered.trim().split(/\s+/).length;
  const wpm = Math.round((wordsTyped / (timeLeft / 60)));
  let correctChars = 0;
  for (let i = 0; i < entered.length; i++) {
    if (entered[i] === targetText[i]) correctChars++;
  }
  const accuracy = Math.round((correctChars / targetText.length) * 100);
  return { wpm, accuracy };
}

function endTest() {
  clearInterval(timer);
  const { wpm, accuracy } = calculateResults();
  wpmElement.textContent = wpm;
  accuracyElement.textContent = accuracy;
  textInput.disabled = true;
  startButton.disabled = false;
}

function resetTest() {
  clearInterval(timer);
  timerElement.textContent = timeLeft;
  wpmElement.textContent = 0;
  accuracyElement.textContent = 0;
  textInput.value = '';
  textInput.disabled = true;
  startButton.disabled = false;
  resetButton.disabled = true;
}

startButton.addEventListener('click', startTest);
resetButton.addEventListener('click', resetTest);