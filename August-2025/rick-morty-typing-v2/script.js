const quotes = {
    easy: [
        "Wubba lubba dub dub!",
        "I'm Pickle Rick!",
        "Get your shit together.",
        "Nobody exists on purpose.",
        "What is my purpose?",
        "Show me what you got!",
        "I'm Mr. Meeseeks!",
        "Existence is pain!",
        "Tiny Rick!",
        "Science, Morty!"
    ],
    medium: [
        "Listen, Morty, I hate to break it to you, but what people call love is just a chemical reaction.",
        "Sometimes science is more art than science, Morty. Lot of people don't get that.",
        "You're not going to believe this, because it usually never happens, but I made a mistake.",
        "I turned myself into a pickle, Morty! I'm Pickle Rick!",
        "Nobody exists on purpose, nobody belongs anywhere, everybody's gonna die. Come watch TV.",
        "The universe is basically an animal. It grazes on the ordinary.",
        "To live is to risk it all; otherwise you're just an inert chunk of randomly assembled molecules.",
        "I'm sorry, but your opinion means very little to me.",
        "Weddings are basically funerals with cake.",
        "School is not a place for smart people, Morty."
    ],
    hard: [
        "Listen, I'm not the nicest guy in the universe, because I'm the smartest, and being nice is something stupid people do to hedge their bets.",
        "The universe is a crazy, chaotic place. You know what the common factor is in all your dysfunctional relationships? It's you.",
        "When you know nothing matters, the universe is yours. And I've never met a universe that was into it.",
        "I know that new situations can be intimidating. You're looking around and it's all scary and different, but you know, meeting them head-on, charging into them like a bull - that's how we grow as people.",
        "You want to see how I paint a picture? You want to see the real me? You want to see what goes on behind the curtain? Then you're going to have to stop asking questions and start trusting me.",
        "Sometimes science is more art than science. A lot of people don't get that. But I'm not one of them. I'm a scientist. Because I invent, transform, create, and destroy for a living, and when I don't like something about the world, I change it.",
        "Nobody gets it. Nothing you think matters, matters. This isn't special. This is happening infinite times across infinite realities.",
        "Have fun with empowerment. It seems to make everyone that gets it really happy until they realize what they've lost.",
        "Life is effort and I'll stop when I die! Until then, I'm going to keep trying to make myself better.",
        "Your failures are your own, old man! I say, follow through! Who's with me?!"
    ]
};

const rickComments = {
    excellent: [
        "*BURP* Not bad for a Jerry. You might actually have some potential.",
        "Wow, you can type. Want a medal? Actually, that was pretty good.",
        "You're almost as fast as my portal gun. Almost.",
        "Impressive. You must be from a dimension where people actually give a shit about typing."
    ],
    good: [
        "Mediocre, Morty. Just like everything else in this dimension.",
        "*BURP* You're typing at a Jerry level. That's not a compliment.",
        "I've seen Gazorpazorps type faster, but whatever.",
        "Not terrible. You're like a C+ student in the multiverse of typing."
    ],
    poor: [
        "Jesus, Morty, are you typing with your feet?",
        "This is painful to watch. Like Jerry's life choices.",
        "*BURP* I've seen dead Cronenbergs with better motor skills.",
        "You type like you're wearing oven mitts. In a dimension where oven mitts are made of concrete."
    ]
};

let currentQuote = '';
let currentQuoteIndex = 0;
let startTime = null;
let timerInterval = null;
let timeRemaining = 60;
let correctChars = 0;
let totalChars = 0;
let errors = 0;

const rickCharacterIds = [1, 4, 19, 22, 27, 40, 55, 78, 85, 156, 169, 244, 265, 281, 293];
const mortyCharacterIds = [2, 14, 75, 78, 79, 169, 186, 200, 261, 276, 277, 281, 293, 361, 362];

const quoteDisplay = document.getElementById('quote-display');
const quoteInput = document.getElementById('quote-input');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const difficultySelect = document.getElementById('difficulty');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const errorsElement = document.getElementById('errors');
const resultsModal = document.getElementById('results-modal');
const closeModalBtn = document.getElementById('close-modal');

startBtn.addEventListener('click', startTest);
resetBtn.addEventListener('click', resetTest);
quoteInput.addEventListener('input', checkInput);
closeModalBtn.addEventListener('click', () => {
    resultsModal.classList.add('hidden');
    resetTest();
});

function startTest() {
    const difficulty = difficultySelect.value;
    const quotesList = quotes[difficulty];
    currentQuote = quotesList[Math.floor(Math.random() * quotesList.length)];
    
    displayQuote();
    
    quoteInput.disabled = false;
    quoteInput.focus();
    quoteInput.value = '';
    
    startBtn.disabled = true;
    resetBtn.disabled = false;
    difficultySelect.disabled = true;
    
    startTime = new Date().getTime();
    timeRemaining = 60;
    correctChars = 0;
    totalChars = 0;
    errors = 0;
    currentQuoteIndex = 0;
    
    quoteDisplay.classList.add('active');
    
    randomizeCharacterImages();
    
    timerInterval = setInterval(updateTimer, 1000);
}

function displayQuote() {
    quoteDisplay.innerHTML = '';
    const quoteText = document.createElement('div');
    quoteText.className = 'quote-text';
    
    currentQuote.split('').forEach((char, index) => {
        const charSpan = document.createElement('span');
        charSpan.textContent = char;
        charSpan.id = `char-${index}`;
        if (index === 0) charSpan.classList.add('current');
        quoteText.appendChild(charSpan);
    });
    
    quoteDisplay.appendChild(quoteText);
}

function checkInput() {
    const inputValue = quoteInput.value;
    const quoteChars = currentQuote.split('');
    
    totalChars = inputValue.length;
    correctChars = 0;
    
    for (let i = 0; i < quoteChars.length; i++) {
        const charSpan = document.getElementById(`char-${i}`);
        
        if (i < inputValue.length) {
            if (inputValue[i] === quoteChars[i]) {
                charSpan.classList.add('correct');
                charSpan.classList.remove('incorrect', 'current');
                correctChars++;
            } else {
                charSpan.classList.add('incorrect');
                charSpan.classList.remove('correct', 'current');
            }
        } else {
            charSpan.classList.remove('correct', 'incorrect', 'current');
            if (i === inputValue.length) {
                charSpan.classList.add('current');
            }
        }
    }
    
    currentQuoteIndex = inputValue.length;
    errors = totalChars - correctChars;
    
    updateStats();
    
    if (inputValue === currentQuote) {
        setTimeout(() => {
            nextQuote();
        }, 500);
    }
}

function nextQuote() {
    const difficulty = difficultySelect.value;
    const quotesList = quotes[difficulty];
    currentQuote = quotesList[Math.floor(Math.random() * quotesList.length)];
    
    displayQuote();
    quoteInput.value = '';
    currentQuoteIndex = 0;
}

function updateTimer() {
    timeRemaining--;
    timerElement.textContent = `${timeRemaining}s`;
    
    if (timeRemaining <= 0) {
        endTest();
    }
}

function updateStats() {
    const currentTime = new Date().getTime();
    const timeElapsed = (currentTime - startTime) / 1000 / 60;
    
    const wpm = Math.round((correctChars / 5) / timeElapsed);
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    
    wpmElement.textContent = wpm || 0;
    accuracyElement.textContent = `${accuracy}%`;
    errorsElement.textContent = errors;
}

function endTest() {
    clearInterval(timerInterval);
    quoteInput.disabled = true;
    quoteDisplay.classList.remove('active');
    
    const finalWpm = parseInt(wpmElement.textContent);
    const finalAccuracy = parseInt(accuracyElement.textContent);
    
    document.getElementById('final-wpm').textContent = finalWpm;
    document.getElementById('final-accuracy').textContent = `${finalAccuracy}%`;
    document.getElementById('final-errors').textContent = errors;
    
    let comment;
    if (finalWpm >= 60 && finalAccuracy >= 95) {
        comment = rickComments.excellent[Math.floor(Math.random() * rickComments.excellent.length)];
    } else if (finalWpm >= 40 && finalAccuracy >= 85) {
        comment = rickComments.good[Math.floor(Math.random() * rickComments.good.length)];
    } else {
        comment = rickComments.poor[Math.floor(Math.random() * rickComments.poor.length)];
    }
    
    document.getElementById('rick-comment').textContent = comment;
    resultsModal.classList.remove('hidden');
}

function resetTest() {
    clearInterval(timerInterval);
    
    quoteInput.value = '';
    quoteInput.disabled = true;
    
    startBtn.disabled = false;
    resetBtn.disabled = true;
    difficultySelect.disabled = false;
    
    timerElement.textContent = '60s';
    wpmElement.textContent = '0';
    accuracyElement.textContent = '100%';
    errorsElement.textContent = '0';
    
    quoteDisplay.classList.remove('active');
    quoteDisplay.innerHTML = '<span class="quote-text">Click "Start Test" to begin your interdimensional typing adventure!</span>';
    
    currentQuote = '';
    currentQuoteIndex = 0;
    startTime = null;
    timeRemaining = 60;
    correctChars = 0;
    totalChars = 0;
    errors = 0;
    
    randomizeCharacterImages();
}

function randomizeCharacterImages() {
    const floatingRick = document.querySelector('.floating-rick');
    const floatingMorty = document.querySelector('.floating-morty');
    
    const randomRickId = rickCharacterIds[Math.floor(Math.random() * rickCharacterIds.length)];
    const randomMortyId = mortyCharacterIds[Math.floor(Math.random() * mortyCharacterIds.length)];
    
    updateCharacterImage(floatingRick, randomRickId, 'rick');
    updateCharacterImage(floatingMorty, randomMortyId, 'morty');
}

function updateCharacterImage(element, characterId, characterType) {
    const imageUrl = `https://rickandmortyapi.com/api/character/avatar/${characterId}.jpeg`;
    
    const img = new Image();
    img.onload = function() {
        element.style.backgroundImage = `url('${imageUrl}')`;
    };
    
    img.onerror = function() {
        console.warn(`Failed to load character image for ID ${characterId}, using fallback`);
        const fallbackSvg = characterType === 'rick' 
            ? "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='%2369c8ec'/><text x='50' y='60' text-anchor='middle' font-size='30' fill='white'>R</text></svg>"
            : "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='%23ffeb3b'/><text x='50' y='60' text-anchor='middle' font-size='30' fill='black'>M</text></svg>";
        element.style.backgroundImage = `url('${fallbackSvg}')`;
    };
    
    img.src = imageUrl;
}

document.addEventListener('DOMContentLoaded', function() {
    randomizeCharacterImages();
});