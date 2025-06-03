(function() {
  const workDuration = 25 * 60;
  const breakDuration = 5 * 60;
  let isRunning = false;
  let isWorkPeriod = true;
  let remainingTime = workDuration;
  let timerInterval = null;

  const timerEl = document.getElementById('timer');
  const startBtn = document.getElementById('start');
  const pauseBtn = document.getElementById('pause');
  const resetBtn = document.getElementById('reset');

  function updateDisplay() {
    const minutes = String(Math.floor(remainingTime / 60)).padStart(2, '0');
    const seconds = String(remainingTime % 60).padStart(2, '0');
    timerEl.textContent = `${minutes}:${seconds}`;
  }

  function switchPeriod() {
    isWorkPeriod = !isWorkPeriod;
    remainingTime = isWorkPeriod ? workDuration : breakDuration;
    updateDisplay();
  }

  function tick() {
    if (remainingTime <= 0) {
      switchPeriod();
    } else {
      remainingTime--;
      updateDisplay();
    }
  }

  function startTimer() {
    if (!isRunning) {
      isRunning = true;
      timerInterval = setInterval(tick, 1000);
    }
  }

  function pauseTimer() {
    if (isRunning) {
      clearInterval(timerInterval);
      isRunning = false;
    }
  }

  function resetTimer() {
    pauseTimer();
    isWorkPeriod = true;
    remainingTime = workDuration;
    updateDisplay();
  }

  startBtn.addEventListener('click', startTimer);
  pauseBtn.addEventListener('click', pauseTimer);
  resetBtn.addEventListener('click', resetTimer);

  updateDisplay();
})();