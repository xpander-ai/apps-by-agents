// DeepPersona App Logic
const questions = [
  { key: 'social', emojiLeft: '😶', labelLeft: 'Introversion', emojiRight: '😃', labelRight: 'Extraversion', keywordsLeft: ['Reflective','Reserved','Focused'], keywordsRight: ['Outgoing','Energetic','Friendly'] },
  { key: 'logic', emojiLeft: '❤️', labelLeft: 'Emotion', emojiRight: '🧠', labelRight: 'Logic', keywordsLeft: ['Empathetic','Compassionate','Intuitive'], keywordsRight: ['Analytical','Rational','Objective'] },
  { key: 'creativity', emojiLeft: '📐', labelLeft: 'Practicality', emojiRight: '🎨', labelRight: 'Creativity', keywordsLeft: ['Grounded','Structured','Organized'], keywordsRight: ['Innovative','Imaginative','Curious'] },
  { key: 'planning', emojiLeft: '🎲', labelLeft: 'Spontaneous', emojiRight: '🗓️', labelRight: 'Planned', keywordsLeft: ['Flexible','Adaptable','Impulsive'], keywordsRight: ['Methodical','Organized','Disciplined'] },
  { key: 'adventure', emojiLeft: '🛑', labelLeft: 'Cautious', emojiRight: '🌟', labelRight: 'Adventurous', keywordsLeft: ['Prudent','Careful','Analytical'], keywordsRight: ['Bold','Daring','Curious'] },
  { key: 'independence', emojiLeft: '🤝', labelLeft: 'Social', emojiRight: '🚀', labelRight: 'Independent', keywordsLeft: ['Cooperative','Supportive','Friendly'], keywordsRight: ['Self-reliant','Autonomous','Determined'] },
  { key: 'intuitive', emojiLeft: '📊', labelLeft: 'Analytical', emojiRight: '✨', labelRight: 'Intuitive', keywordsLeft: ['Logical','Detail-oriented','Systematic'], keywordsRight: ['Holistic','Imaginative','Innovative'] },
  { key: 'stability', emojiLeft: '😰', labelLeft: 'Anxious', emojiRight: '😌', labelRight: 'Calm', keywordsLeft: ['Sensitive','Vigilant','Restless'], keywordsRight: ['Serene','Collected','Composed'] },
  { key: 'detail', emojiLeft: '🌐', labelLeft: 'Big-picture', emojiRight: '🔍', labelRight: 'Detail-oriented', keywordsLeft: ['Visionary','Strategic','Broad-minded'], keywordsRight: ['Precise','Thorough','Meticulous'] },
  { key: 'decision', emojiLeft: '💗', labelLeft: 'Feeling', emojiRight: '🧩', labelRight: 'Thinking', keywordsLeft: ['Compassionate','Empathetic','Harmonious'], keywordsRight: ['Objective','Logical','Analytical'] }
];

let currentIndex = 0;
const answers = [];

// DOM Elements
const questionHolder = document.getElementById('question-holder');
const questionText = document.getElementById('question-text');
const labelLeft = document.getElementById('label-left');
const labelRight = document.getElementById('label-right');
const answerSlider = document.getElementById('answer-slider');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const questionnaire = document.getElementById('questionnaire');
const summaryEl = document.getElementById('summary');

function showQuestion(index) {
  const q = questions[index];
  questionText.textContent = `Question ${index + 1} of ${questions.length}: How do you usually see yourself?`;
  labelLeft.innerHTML = `${q.emojiLeft} ${q.labelLeft}`;
  labelRight.innerHTML = `${q.emojiRight} ${q.labelRight}`;
  answerSlider.value = answers[index] !== undefined ? answers[index] : 50;
  prevBtn.disabled = index === 0;
  nextBtn.textContent = index === questions.length - 1 ? 'View Results' : 'Next';
  questionHolder.classList.remove('opacity-0');
  questionHolder.classList.add('opacity-100');
}

prevBtn.addEventListener('click', () => {
  answers[currentIndex] = parseInt(answerSlider.value, 10);
  currentIndex--;
  questionHolder.classList.add('opacity-0');
  setTimeout(() => showQuestion(currentIndex), 300);
});

nextBtn.addEventListener('click', () => {
  answers[currentIndex] = parseInt(answerSlider.value, 10);
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    questionHolder.classList.add('opacity-0');
    setTimeout(() => showQuestion(currentIndex), 300);
  } else {
    questionnaire.classList.add('hidden');
    summaryEl.classList.remove('hidden');
    displaySummary();
  }
});

// Initialize
showQuestion(currentIndex);

function displaySummary() {
  if (window.OPENAI_API_KEY) {
    callOpenAI({ questions, answers }).then(data => renderSummary(data));
  } else {
    fetch('mock/personality_responses.json')
      .then(res => res.json())
      .then(data => renderSummary(data))
      .catch(err => console.error('Failed to load mock data', err));
  }
}

function renderSummary(data) {
  document.getElementById('avatar').src = data.avatar;
  const analysisContainer = document.getElementById('analysis');
  data.paragraphs.forEach(p => {
    const para = document.createElement('p');
    para.textContent = p;
    analysisContainer.appendChild(para);
  });
  const strengthsList = document.getElementById('strengths-list');
  data.strengths.forEach(s => {
    const li = document.createElement('li');
    li.textContent = s;
    strengthsList.appendChild(li);
  });
  const weaknessesList = document.getElementById('weaknesses-list');
  data.weaknesses.forEach(w => {
    const li = document.createElement('li');
    li.textContent = w;
    weaknessesList.appendChild(li);
  });
  const keywordsContainer = document.getElementById('keywords-list');
  data.keywords.forEach(k => {
    const span = document.createElement('span');
    span.className = 'keyword';
    span.textContent = k;
    keywordsContainer.appendChild(span);
  });
  document.getElementById('download-btn').addEventListener('click', () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', 'profile.json');
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
  document.getElementById('share-btn').addEventListener('click', () => {
    const text = data.paragraphs.join('\n\n');
    navigator.clipboard.writeText(text).then(() => {
      alert('Profile copied to clipboard');
    });
  });
}

// Optional: call OpenAI API for live analysis
async function callOpenAI({ questions, answers }) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${window.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful AI that analyzes personality test results.' },
        { role: 'user', content: JSON.stringify({ questions, answers }) }
      ],
      max_tokens: 500
    })
  });
  const res = await response.json();
  return JSON.parse(res.choices[0].message.content);
}