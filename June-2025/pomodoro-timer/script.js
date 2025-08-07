let duration = 25 * 60;
let timerId;
const display = document.getElementById("timer");

function updateDisplay(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  display.textContent = `${m}:${s}`;
}

document.getElementById("start").addEventListener("click", () => {
  if (timerId) return;
  timerId = setInterval(() => {
    if (duration <= 0) {
      clearInterval(timerId);
      timerId = null;
      alert("Time's up!");
      return;
    }
    duration--;
    updateDisplay(duration);
  }, 1000);
});

document.getElementById("pause").addEventListener("click", () => {
  clearInterval(timerId);
  timerId = null;
});

document.getElementById("reset").addEventListener("click", () => {
  clearInterval(timerId);
  timerId = null;
  duration = 25 * 60;
  updateDisplay(duration);
});

updateDisplay(duration);