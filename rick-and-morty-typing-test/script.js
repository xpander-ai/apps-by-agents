class RickAndMortyTypingTest {
    constructor() {
        this.quotes = [
            {
                text: "Wubba lubba dub dub! Sometimes science is more art than science, Morty. A lot of people don't get that.",
                character: "Rick Sanchez"
            },
            {
                text: "Oh geez Rick, I don't think this is such a good idea. What if something goes wrong?",
                character: "Morty Smith"
            },
            {
                text: "Listen Morty, I hate to break it to you, but what people call love is just a chemical reaction that compels animals to breed.",
                character: "Rick Sanchez"
            },
            {
                text: "Nobody exists on purpose, nobody belongs anywhere, everybody's gonna die. Come watch TV.",
                character: "Morty Smith"
            },
            {
                text: "I'm not looking for judgement, just a yes or no. Can you assimilate a giraffe?",
                character: "Rick Sanchez"
            },
            {
                text: "Get schwifty! Take off your pants and your panties! Shit on the floor! Time to get schwifty in here!",
                character: "Rick Sanchez"
            },
            {
                text: "Existence is pain to a Meeseeks, Jerry! And we will do anything to alleviate that pain!",
                character: "Mr. Meeseeks"
            },
            {
                text: "I'm pickle Rick! I turned myself into a pickle, Morty! Boom! Big reveal! I'm a pickle!",
                character: "Rick Sanchez"
            },
            {
                text: "That's planning for failure, Morty. Even dumber than regular planning. Just do it, live it.",
                character: "Rick Sanchez"
            },
            {
                text: "Your boos mean nothing, I've seen what makes you cheer!",
                character: "Rick Sanchez"
            },
            {
                text: "To live is to risk it all, otherwise you're just an inert chunk of randomly assembled molecules drifting wherever the universe blows you.",
                character: "Rick Sanchez"
            },
            {
                text: "I'm sorry, but your opinion means very little to me.",
                character: "Rick Sanchez"
            },
            {
                text: "Aw jeez, Rick. I don't know if I can handle another adventure right now.",
                character: "Morty Smith"
            },
            {
                text: "School is not a place for smart people, Morty.",
                character: "Rick Sanchez"
            },
            {
                text: "I can do this all day, and you clearly can't.",
                character: "Rick Sanchez"
            }
        ];

        this.currentQuote = null;
        this.startTime = null;
        this.endTime = null;
        this.timer = null;
        this.isTestActive = false;
        this.currentWordIndex = 0;
        this.currentCharIndex = 0;
        
        this.initializeElements();
        this.setupEventListeners();
        this.loadRandomQuote();
    }

    initializeElements() {
        this.textToTypeEl = document.getElementById('text-to-type');
        this.inputTextEl = document.getElementById('input-text');
        this.timeEl = document.getElementById('time');
        this.wpmEl = document.getElementById('wpm');
        this.accuracyEl = document.getElementById('accuracy');
        this.startBtn = document.getElementById('start-btn');
        this.restartBtn = document.getElementById('restart-btn');
        this.resultsEl = document.getElementById('results');
        this.characterNameEl = document.getElementById('character-name');
        this.typingFeedbackEl = document.getElementById('typing-feedback');
        this.finalWpmEl = document.getElementById('final-wpm');
        this.finalAccuracyEl = document.getElementById('final-accuracy');
        this.finalTimeEl = document.getElementById('final-time');
        this.resultMessageEl = document.getElementById('result-message');
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startTest());
        this.restartBtn.addEventListener('click', () => this.restartTest());
        this.inputTextEl.addEventListener('input', (e) => this.handleInput(e));
        this.inputTextEl.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    loadRandomQuote() {
        const randomIndex = Math.floor(Math.random() * this.quotes.length);
        this.currentQuote = this.quotes[randomIndex];
        this.textToTypeEl.textContent = this.currentQuote.text;
        this.characterNameEl.textContent = this.currentQuote.character;
        this.highlightText();
    }

    highlightText() {
        const text = this.currentQuote.text;
        const inputValue = this.inputTextEl.value;
        let highlightedText = '';

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const inputChar = inputValue[i];

            if (i < inputValue.length) {
                if (inputChar === char) {
                    highlightedText += `<span class="correct">${char}</span>`;
                } else {
                    highlightedText += `<span class="incorrect">${char}</span>`;
                }
            } else if (i === inputValue.length) {
                highlightedText += `<span class="current">${char}</span>`;
            } else {
                highlightedText += char;
            }
        }

        this.textToTypeEl.innerHTML = highlightedText;
    }

    startTest() {
        this.isTestActive = true;
        this.startTime = new Date();
        this.inputTextEl.disabled = false;
        this.inputTextEl.focus();
        this.inputTextEl.value = '';
        
        this.startBtn.style.display = 'none';
        this.restartBtn.style.display = 'inline-block';
        this.resultsEl.style.display = 'none';
        
        this.timer = setInterval(() => this.updateTimer(), 100);
        this.typingFeedbackEl.textContent = 'Test started! Start typing...';
        this.highlightText();
    }

    restartTest() {
        this.resetTest();
        this.loadRandomQuote();
        this.startTest();
    }

    resetTest() {
        this.isTestActive = false;
        this.startTime = null;
        this.endTime = null;
        this.currentWordIndex = 0;
        this.currentCharIndex = 0;
        
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        this.inputTextEl.disabled = true;
        this.inputTextEl.value = '';
        this.timeEl.textContent = '0';
        this.wpmEl.textContent = '0';
        this.accuracyEl.textContent = '100';
        this.typingFeedbackEl.textContent = '';
        
        this.startBtn.style.display = 'inline-block';
        this.restartBtn.style.display = 'none';
        this.resultsEl.style.display = 'none';
    }

    handleInput(e) {
        if (!this.isTestActive) return;

        const inputValue = e.target.value;
        this.highlightText();

        if (inputValue === this.currentQuote.text) {
            this.endTest();
        } else {
            this.updateStats();
            this.updateFeedback();
        }
    }

    handleKeyDown(e) {
        if (!this.isTestActive) return;
        
        if (e.key === 'Tab') {
            e.preventDefault();
        }
    }

    updateTimer() {
        if (!this.startTime || !this.isTestActive) return;
        
        const currentTime = new Date();
        const timeElapsed = (currentTime - this.startTime) / 1000;
        this.timeEl.textContent = timeElapsed.toFixed(1);
    }

    updateStats() {
        if (!this.startTime || !this.isTestActive) return;

        const currentTime = new Date();
        const timeElapsed = (currentTime - this.startTime) / 1000;
        const inputValue = this.inputTextEl.value;
        
        const wordsTyped = inputValue.trim().split(/\s+/).length;
        const wpm = Math.round((wordsTyped / timeElapsed) * 60);
        this.wpmEl.textContent = isNaN(wpm) ? '0' : wpm;

        const accuracy = this.calculateAccuracy();
        this.accuracyEl.textContent = accuracy;
    }

    calculateAccuracy() {
        const inputValue = this.inputTextEl.value;
        const originalText = this.currentQuote.text;
        
        if (inputValue.length === 0) return '100';
        
        let correctChars = 0;
        const minLength = Math.min(inputValue.length, originalText.length);
        
        for (let i = 0; i < minLength; i++) {
            if (inputValue[i] === originalText[i]) {
                correctChars++;
            }
        }
        
        const accuracy = (correctChars / inputValue.length) * 100;
        return Math.round(accuracy);
    }

    updateFeedback() {
        const accuracy = parseInt(this.accuracyEl.textContent);
        const wpm = parseInt(this.wpmEl.textContent);
        
        let message = '';
        
        if (accuracy < 70) {
            message = "Slow down, Morty! Accuracy is more important than speed!";
        } else if (accuracy >= 70 && accuracy < 90) {
            message = "Getting better, but Rick expects perfection!";
        } else if (wpm > 80 && accuracy >= 90) {
            message = "Schwifty! You're getting schwifty with it!";
        } else if (accuracy >= 90) {
            message = "Excellent accuracy! Rick would be proud!";
        }
        
        this.typingFeedbackEl.textContent = message;
    }

    endTest() {
        this.isTestActive = false;
        this.endTime = new Date();
        
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        this.inputTextEl.disabled = true;
        this.showResults();
    }

    showResults() {
        const timeElapsed = (this.endTime - this.startTime) / 1000;
        const inputValue = this.inputTextEl.value;
        const wordsTyped = inputValue.trim().split(/\s+/).length;
        const finalWpm = Math.round((wordsTyped / timeElapsed) * 60);
        const finalAccuracy = this.calculateAccuracy();
        
        this.finalWpmEl.textContent = finalWpm;
        this.finalAccuracyEl.textContent = finalAccuracy + '%';
        this.finalTimeEl.textContent = timeElapsed.toFixed(1) + 's';
        
        const resultMessage = this.getResultMessage(finalWpm, finalAccuracy);
        this.resultMessageEl.textContent = resultMessage;
        
        this.resultsEl.style.display = 'block';
        this.restartBtn.textContent = 'NEW QUOTE';
    }

    getResultMessage(wpm, accuracy) {
        if (accuracy < 70) {
            return "Geez Rick, maybe I should practice more...";
        } else if (accuracy >= 70 && accuracy < 85) {
            return "Not bad, but Rick's seen better!";
        } else if (accuracy >= 85 && accuracy < 95) {
            return "Pretty good! You're getting schwifty!";
        } else if (wpm < 40 && accuracy >= 95) {
            return "Great accuracy! Now work on that speed!";
        } else if (wpm >= 40 && wpm < 60 && accuracy >= 95) {
            return "Excellent work! Rick would approve!";
        } else if (wpm >= 60 && wpm < 80 && accuracy >= 95) {
            return "Wubba lubba dub dub! That's some serious typing!";
        } else if (wpm >= 80 && accuracy >= 95) {
            return "Holy crap! You type faster than Rick talks! *burp*";
        } else {
            return "Not bad for a Jerry... just kidding, you did great!";
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RickAndMortyTypingTest();
});