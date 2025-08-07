// Mock messages for testing
const mockMessages = [
  { role: 'assistant', content: 'Hello! I am a ChatGPT clone. How can I help you today?' }
];

let messages = [...mockMessages];

const apiKeyInput = document.getElementById('api-key-input');
const chatContainer = document.getElementById('chat');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const newChatButton = document.getElementById('new-chat');

function renderMessages() {
  chatContainer.innerHTML = '';
  messages.forEach(msg => {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', msg.role === 'user' ? 'user' : 'assistant');
    const avatarDiv = document.createElement('div');
    avatarDiv.classList.add('avatar');
    avatarDiv.textContent = msg.role === 'user' ? '🧑' : '🤖';
    const textDiv = document.createElement('div');
    textDiv.classList.add('text');
    textDiv.textContent = msg.content;
    msgDiv.appendChild(avatarDiv);
    msgDiv.appendChild(textDiv);
    chatContainer.appendChild(msgDiv);
  });
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function toggleSendButton() {
  sendButton.disabled = !userInput.value.trim();
}

async function handleSend() {
  const content = userInput.value.trim();
  if (!content) return;
  messages.push({ role: 'user', content });
  renderMessages();
  userInput.value = '';
  toggleSendButton();

  const apiKey = apiKeyInput.value.trim();
  if (apiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content }]
        })
      });
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || 'Error: No response from API';
      messages.push({ role: 'assistant', content: reply });
    } catch (err) {
      messages.push({ role: 'assistant', content: `Error: ${err.message}` });
    }
    renderMessages();
  } else {
    // Mock response
    setTimeout(() => {
      messages.push({ role: 'assistant', content: 'This is a mock response.' });
      renderMessages();
    }, 500);
  }
}

function startNewChat() {
  messages = [...mockMessages];
  renderMessages();
}

userInput.addEventListener('input', toggleSendButton);
sendButton.addEventListener('click', handleSend);
newChatButton.addEventListener('click', startNewChat);

window.addEventListener('load', () => {
  renderMessages();
});