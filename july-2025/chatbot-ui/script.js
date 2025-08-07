document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const inputEl = document.getElementById('user-input');
  const text = inputEl.value.trim();
  if (!text) return;
  addMessage(text, 'user');
  inputEl.value = '';
  // Placeholder for bot response
  setTimeout(() => {
    addMessage('Bot response goes here...', 'bot');
  }, 500);
}

function addMessage(text, sender) {
  const messagesEl = document.getElementById('messages');
  const msgEl = document.createElement('div');
  msgEl.classList.add('message', sender);
  msgEl.textContent = text;
  messagesEl.appendChild(msgEl);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}