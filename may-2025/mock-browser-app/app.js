// History stack to track URLs
const historyStack = [];
let currentIndex = -1;

// DOM elements
const backButton = document.getElementById('backButton');
const forwardButton = document.getElementById('forwardButton');
const urlInput = document.getElementById('urlInput');
const goButton = document.getElementById('goButton');
const browserFrame = document.getElementById('browserFrame');

// Navigate to a URL and update history
function navigateTo(url) {
  if (currentIndex < historyStack.length - 1) {
    historyStack.splice(currentIndex + 1);
  }
  historyStack.push(url);
  currentIndex = historyStack.length - 1;
  browserFrame.src = url;
  updateButtons();
}

// Go back in history
function goBack() {
  if (currentIndex > 0) {
    currentIndex--;
    browserFrame.src = historyStack[currentIndex];
    updateButtons();
  }
}

// Go forward in history
function goForward() {
  if (currentIndex < historyStack.length - 1) {
    currentIndex++;
    browserFrame.src = historyStack[currentIndex];
    updateButtons();
  }
}

// Update button states
function updateButtons() {
  backButton.disabled = currentIndex <= 0;
  forwardButton.disabled = currentIndex >= historyStack.length - 1;
}

// Event listeners
goButton.addEventListener('click', () => {
  navigateTo(urlInput.value);
});
backButton.addEventListener('click', goBack);
forwardButton.addEventListener('click', goForward);

// Allow Enter key to trigger navigation
urlInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    navigateTo(urlInput.value);
  }
});
