// Browser state
const browserState = {
  historyStack: [],
  currentIndex: -1,
  isLoading: false,
  currentUrl: '',
  pageTitle: 'New Tab'
};

// DOM elements
const backButton = document.getElementById('backButton');
const forwardButton = document.getElementById('forwardButton');
const refreshButton = document.getElementById('refreshButton');
const urlInput = document.getElementById('urlInput');
const goButton = document.getElementById('goButton');
const browserFrame = document.getElementById('browserFrame');
const loadingBar = document.getElementById('loadingBar');
const tabTitle = document.getElementById('tabTitle');

// URL validation and formatting
function formatUrl(input) {
  const trimmed = input.trim();
  
  // If it looks like a search query, use Google
  if (!trimmed.includes('.') && !trimmed.startsWith('http')) {
    return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
  }
  
  // Add protocol if missing
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return `https://${trimmed}`;
  }
  
  return trimmed;
}

// Extract domain from URL for display
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

// Show loading state
function showLoading() {
  browserState.isLoading = true;
  loadingBar.classList.remove('hidden');
  loadingBar.classList.add('loading-animation');
  refreshButton.innerHTML = '<i class="fas fa-times text-sm"></i>';
}

// Hide loading state
function hideLoading() {
  browserState.isLoading = false;
  loadingBar.classList.add('hidden');
  loadingBar.classList.remove('loading-animation');
  refreshButton.innerHTML = '<i class="fas fa-redo text-sm"></i>';
}

// Update tab title
function updateTabTitle(url) {
  const domain = extractDomain(url);
  tabTitle.textContent = domain || 'New Tab';
  document.title = `${domain} - Mock Browser`;
}

// Navigate to a URL and update history
function navigateTo(input) {
  const url = formatUrl(input);
  
  // Update history
  if (browserState.currentIndex < browserState.historyStack.length - 1) {
    browserState.historyStack.splice(browserState.currentIndex + 1);
  }
  browserState.historyStack.push(url);
  browserState.currentIndex = browserState.historyStack.length - 1;
  browserState.currentUrl = url;
  
  // Update UI
  urlInput.value = url;
  updateTabTitle(url);
  showLoading();
  
  // Load the page
  browserFrame.src = url;
  updateButtons();
  
  // Simulate loading time
  setTimeout(hideLoading, 2000);
}

// Go back in history
function goBack() {
  if (browserState.currentIndex > 0) {
    browserState.currentIndex--;
    const url = browserState.historyStack[browserState.currentIndex];
    browserState.currentUrl = url;
    urlInput.value = url;
    updateTabTitle(url);
    showLoading();
    browserFrame.src = url;
    updateButtons();
    setTimeout(hideLoading, 1500);
  }
}

// Go forward in history
function goForward() {
  if (browserState.currentIndex < browserState.historyStack.length - 1) {
    browserState.currentIndex++;
    const url = browserState.historyStack[browserState.currentIndex];
    browserState.currentUrl = url;
    urlInput.value = url;
    updateTabTitle(url);
    showLoading();
    browserFrame.src = url;
    updateButtons();
    setTimeout(hideLoading, 1500);
  }
}

// Refresh current page
function refresh() {
  if (browserState.isLoading) {
    // Stop loading
    browserFrame.src = 'about:blank';
    hideLoading();
  } else {
    // Refresh
    if (browserState.currentUrl) {
      showLoading();
      browserFrame.src = browserState.currentUrl;
      setTimeout(hideLoading, 1500);
    }
  }
}

// Update button states
function updateButtons() {
  backButton.disabled = browserState.currentIndex <= 0;
  forwardButton.disabled = browserState.currentIndex >= browserState.historyStack.length - 1;
}

// Focus URL bar with Cmd/Ctrl+L
function handleKeyboardShortcuts(e) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
    e.preventDefault();
    urlInput.select();
  }
  if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
    e.preventDefault();
    refresh();
  }
}

// Event listeners
goButton.addEventListener('click', () => {
  navigateTo(urlInput.value);
});

backButton.addEventListener('click', goBack);
forwardButton.addEventListener('click', goForward);
refreshButton.addEventListener('click', refresh);

// URL input handlers
urlInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    navigateTo(urlInput.value);
  }
});

// Focus URL bar on click
urlInput.addEventListener('focus', () => {
  urlInput.select();
});

// Keyboard shortcuts
document.addEventListener('keydown', handleKeyboardShortcuts);

// Initialize with a default state
document.addEventListener('DOMContentLoaded', () => {
  updateButtons();
});
