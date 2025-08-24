class PokerOddsDashboard {
    constructor() {
        this.suits = ['♠', '♥', '♦', '♣'];
        this.ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        this.deck = this.createDeck();
        this.playerCards = [];
        this.communityCards = [];
        this.currentStreet = 'preflop'; // preflop, flop, turn, river
        this.equityHistory = [];
        this.animationSpeed = 1000; // milliseconds
        
        this.initializeElements();
        this.bindEvents();
        this.initializeEquityGraph();
    }

    createDeck() {
        const deck = [];
        for (let suit of this.suits) {
            for (let rank of this.ranks) {
                deck.push({ rank, suit });
            }
        }
        return deck;
    }

    initializeElements() {
        // Control buttons
        this.dealButton = document.getElementById('deal-button');
        this.nextStreetButton = document.getElementById('next-street');
        this.resetButton = document.getElementById('reset-button');

        // Card containers
        this.playerCardsEl = document.getElementById('player-cards');
        this.communityCardsEl = document.getElementById('community-cards');

        // Progress bars
        this.winProgress = document.getElementById('win-progress');
        this.tieProgress = document.getElementById('tie-progress');
        this.loseProgress = document.getElementById('lose-progress');
        this.winPercentage = document.getElementById('win-percentage');
        this.tiePercentage = document.getElementById('tie-percentage');
        this.losePercentage = document.getElementById('lose-percentage');

        // Pie chart elements
        this.winArc = document.getElementById('win-arc');
        this.tieArc = document.getElementById('tie-arc');
        this.loseArc = document.getElementById('lose-arc');
        this.pieCenterText = document.getElementById('pie-center-text');

        // Meters
        this.winGauge = document.getElementById('win-gauge');
        this.strengthGauge = document.getElementById('strength-gauge');
        this.winMeterValue = document.getElementById('win-meter-value');
        this.strengthMeterValue = document.getElementById('strength-meter-value');

        // Hand strength
        this.strengthBar = document.getElementById('strength-bar');
        this.handStrengthText = document.getElementById('hand-strength-text');

        // Outs
        this.outsNumber = document.getElementById('outs-number');
        this.outsCards = document.getElementById('outs-cards');
        this.outsPercentage = document.getElementById('outs-percentage');

        // Equity graph
        this.equityCanvas = document.getElementById('equity-canvas');
        this.equityCtx = this.equityCanvas.getContext('2d');

        // History
        this.historyLog = document.getElementById('history-log');
    }

    bindEvents() {
        this.dealButton.addEventListener('click', () => this.dealNewHand());
        this.nextStreetButton.addEventListener('click', () => this.nextStreet());
        this.resetButton.addEventListener('click', () => this.resetGame());
    }

    dealNewHand() {
        this.deck = this.createDeck();
        this.playerCards = this.drawCards(2);
        this.communityCards = [];
        this.currentStreet = 'preflop';
        this.equityHistory = [];

        this.renderCards();
        this.updateAllMetrics();
        this.logAction('New hand dealt');

        this.nextStreetButton.disabled = false;
        this.dealButton.textContent = 'Deal New Hand';
    }

    nextStreet() {
        switch (this.currentStreet) {
            case 'preflop':
                this.communityCards = this.communityCards.concat(this.drawCards(3));
                this.currentStreet = 'flop';
                this.logAction('Flop revealed');
                break;
            case 'flop':
                this.communityCards = this.communityCards.concat(this.drawCards(1));
                this.currentStreet = 'turn';
                this.logAction('Turn revealed');
                break;
            case 'turn':
                this.communityCards = this.communityCards.concat(this.drawCards(1));
                this.currentStreet = 'river';
                this.logAction('River revealed');
                this.nextStreetButton.disabled = true;
                this.nextStreetButton.textContent = 'Hand Complete';
                break;
        }

        this.renderCards();
        this.updateAllMetrics();
    }

    drawCards(count) {
        const cards = [];
        for (let i = 0; i < count; i++) {
            if (this.deck.length === 0) break;
            const randomIndex = Math.floor(Math.random() * this.deck.length);
            cards.push(this.deck.splice(randomIndex, 1)[0]);
        }
        return cards;
    }

    renderCards() {
        // Render player cards
        this.playerCardsEl.innerHTML = '';
        this.playerCards.forEach((card, index) => {
            const cardEl = this.createCardElement(card);
            cardEl.classList.add('fade-in');
            cardEl.style.animationDelay = `${index * 0.1}s`;
            this.playerCardsEl.appendChild(cardEl);
        });

        // Render community cards
        this.communityCardsEl.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            if (i < this.communityCards.length) {
                const cardEl = this.createCardElement(this.communityCards[i]);
                cardEl.classList.add('fade-in');
                cardEl.style.animationDelay = `${i * 0.1}s`;
                this.communityCardsEl.appendChild(cardEl);
            } else {
                const placeholder = document.createElement('div');
                placeholder.classList.add('card-placeholder');
                placeholder.textContent = '?';
                this.communityCardsEl.appendChild(placeholder);
            }
        }
    }

    createCardElement(card) {
        const cardEl = document.createElement('div');
        cardEl.classList.add('card');
        
        if (card.suit === '♥' || card.suit === '♦') {
            cardEl.classList.add('hearts');
        } else {
            cardEl.classList.add('spades');
        }
        
        cardEl.innerHTML = `<div>${card.rank}<br>${card.suit}</div>`;
        return cardEl;
    }

    updateAllMetrics() {
        const odds = this.calculateOdds();
        const handStrength = this.calculateHandStrength();
        const outs = this.calculateOuts();

        this.updateProgressBars(odds);
        this.updatePieChart(odds);
        this.updateMeters(odds, handStrength);
        this.updateHandStrength(handStrength);
        this.updateOuts(outs);
        this.updateEquityGraph(odds);
    }

    calculateOdds() {
        // Simplified odds calculation for demonstration
        // In a real application, this would use Monte Carlo simulation
        const randomFactor = Math.random();
        const streetMultiplier = {
            'preflop': 0.8,
            'flop': 0.9,
            'turn': 0.95,
            'river': 1.0
        };

        const baseWin = (30 + Math.random() * 40) * streetMultiplier[this.currentStreet];
        const baseTie = Math.random() * 10;
        const baseLose = 100 - baseWin - baseTie;

        return {
            win: Math.max(0, Math.min(100, baseWin)),
            tie: Math.max(0, Math.min(100, baseTie)),
            lose: Math.max(0, Math.min(100, baseLose))
        };
    }

    calculateHandStrength() {
        // Simplified hand strength calculation
        if (this.playerCards.length === 0) return 0;
        
        const highCard = Math.max(...this.playerCards.map(card => this.ranks.indexOf(card.rank)));
        const isPair = this.playerCards[0].rank === this.playerCards[1].rank;
        const isSuited = this.playerCards[0].suit === this.playerCards[1].suit;
        
        let strength = (highCard / this.ranks.length) * 100;
        if (isPair) strength += 30;
        if (isSuited) strength += 10;
        
        return Math.min(100, strength);
    }

    calculateOuts() {
        // Simplified outs calculation
        const outsCount = Math.floor(Math.random() * 15) + 1;
        const remainingCards = 52 - this.playerCards.length - this.communityCards.length;
        const probability = (outsCount / remainingCards) * 100;
        
        // Generate some example out cards
        const outsCards = [];
        const availableCards = this.deck.slice(0, Math.min(outsCount, this.deck.length));
        
        return {
            count: outsCount,
            probability: probability,
            cards: availableCards
        };
    }

    updateProgressBars(odds) {
        // Animate progress bars
        setTimeout(() => {
            this.winProgress.style.width = `${odds.win}%`;
            this.winProgress.dataset.percentage = odds.win.toFixed(1);
            this.winPercentage.textContent = `${odds.win.toFixed(1)}%`;

            this.tieProgress.style.width = `${odds.tie}%`;
            this.tieProgress.dataset.percentage = odds.tie.toFixed(1);
            this.tiePercentage.textContent = `${odds.tie.toFixed(1)}%`;

            this.loseProgress.style.width = `${odds.lose}%`;
            this.loseProgress.dataset.percentage = odds.lose.toFixed(1);
            this.losePercentage.textContent = `${odds.lose.toFixed(1)}%`;
        }, 100);
    }

    updatePieChart(odds) {
        const circumference = 2 * Math.PI * 90; // radius = 90
        const winArcLength = (odds.win / 100) * circumference;
        const tieArcLength = (odds.tie / 100) * circumference;
        const loseArcLength = (odds.lose / 100) * circumference;

        // Animate pie chart arcs
        setTimeout(() => {
            this.winArc.style.strokeDasharray = `${winArcLength} ${circumference}`;
            this.winArc.style.transform = 'rotate(-90deg)';
            
            this.tieArc.style.strokeDasharray = `${tieArcLength} ${circumference}`;
            this.tieArc.style.transform = `rotate(${-90 + (odds.win / 100) * 360}deg)`;
            
            this.loseArc.style.strokeDasharray = `${loseArcLength} ${circumference}`;
            this.loseArc.style.transform = `rotate(${-90 + ((odds.win + odds.tie) / 100) * 360}deg)`;
            
            this.pieCenterText.textContent = `${odds.win.toFixed(0)}%`;
        }, 200);
    }

    updateMeters(odds, handStrength) {
        setTimeout(() => {
            this.winGauge.style.width = `${odds.win}%`;
            this.winMeterValue.textContent = `${odds.win.toFixed(1)}%`;
            
            this.strengthGauge.style.width = `${handStrength}%`;
            this.strengthMeterValue.textContent = `${handStrength.toFixed(1)}%`;
        }, 300);
    }

    updateHandStrength(strength) {
        setTimeout(() => {
            this.strengthBar.style.width = `${strength}%`;
            
            let strengthText = '';
            if (strength < 20) strengthText = 'Very Weak';
            else if (strength < 40) strengthText = 'Weak';
            else if (strength < 60) strengthText = 'Moderate';
            else if (strength < 80) strengthText = 'Strong';
            else strengthText = 'Very Strong';
            
            this.handStrengthText.textContent = strengthText;
        }, 400);
    }

    updateOuts(outs) {
        setTimeout(() => {
            // Update outs number with animation
            let currentOuts = 0;
            const increment = outs.count / 20;
            const timer = setInterval(() => {
                currentOuts += increment;
                if (currentOuts >= outs.count) {
                    currentOuts = outs.count;
                    clearInterval(timer);
                }
                this.outsNumber.textContent = Math.floor(currentOuts);
            }, 50);

            this.outsPercentage.textContent = `${outs.probability.toFixed(1)}% chance to improve`;
            
            // Render outs cards
            this.outsCards.innerHTML = '';
            outs.cards.forEach((card, index) => {
                if (index < 8) { // Limit display to 8 cards
                    const cardEl = this.createCardElement(card);
                    cardEl.classList.add('out-card');
                    cardEl.style.animationDelay = `${index * 0.1}s`;
                    this.outsCards.appendChild(cardEl);
                }
            });
            
            if (outs.cards.length > 8) {
                const moreEl = document.createElement('div');
                moreEl.classList.add('card', 'out-card');
                moreEl.innerHTML = `+${outs.cards.length - 8}`;
                this.outsCards.appendChild(moreEl);
            }
        }, 500);
    }

    initializeEquityGraph() {
        this.equityCtx.fillStyle = '#333';
        this.equityCtx.fillRect(0, 0, 600, 200);
        this.drawGridLines();
    }

    drawGridLines() {
        this.equityCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.equityCtx.lineWidth = 1;

        // Horizontal grid lines
        for (let i = 0; i <= 100; i += 20) {
            const y = (200 - 40) - (i / 100) * (200 - 40);
            this.equityCtx.beginPath();
            this.equityCtx.moveTo(40, y);
            this.equityCtx.lineTo(580, y);
            this.equityCtx.stroke();
        }

        // Vertical grid lines
        for (let i = 0; i <= 4; i++) {
            const x = 40 + (i / 4) * (580 - 40);
            this.equityCtx.beginPath();
            this.equityCtx.moveTo(x, 20);
            this.equityCtx.lineTo(x, 180);
            this.equityCtx.stroke();
        }

        // Labels
        this.equityCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.equityCtx.font = '12px Arial';
        this.equityCtx.fillText('Preflop', 50, 195);
        this.equityCtx.fillText('Flop', 180, 195);
        this.equityCtx.fillText('Turn', 310, 195);
        this.equityCtx.fillText('River', 440, 195);
    }

    updateEquityGraph(odds) {
        this.equityHistory.push({
            street: this.currentStreet,
            playerEquity: odds.win,
            opponentEquity: odds.lose
        });

        // Clear and redraw
        this.equityCtx.clearRect(0, 0, 600, 200);
        this.drawGridLines();

        if (this.equityHistory.length < 2) return;

        const streetPositions = {
            'preflop': 0,
            'flop': 1,
            'turn': 2,
            'river': 3
        };

        // Draw player equity line
        this.equityCtx.strokeStyle = '#4CAF50';
        this.equityCtx.lineWidth = 3;
        this.equityCtx.beginPath();

        this.equityHistory.forEach((point, index) => {
            const x = 40 + (streetPositions[point.street] / 3) * (580 - 40);
            const y = (200 - 40) - (point.playerEquity / 100) * (200 - 40);
            
            if (index === 0) {
                this.equityCtx.moveTo(x, y);
            } else {
                this.equityCtx.lineTo(x, y);
            }
        });
        this.equityCtx.stroke();

        // Draw opponent equity line
        this.equityCtx.strokeStyle = '#f44336';
        this.equityCtx.beginPath();

        this.equityHistory.forEach((point, index) => {
            const x = 40 + (streetPositions[point.street] / 3) * (580 - 40);
            const y = (200 - 40) - (point.opponentEquity / 100) * (200 - 40);
            
            if (index === 0) {
                this.equityCtx.moveTo(x, y);
            } else {
                this.equityCtx.lineTo(x, y);
            }
        });
        this.equityCtx.stroke();

        // Draw points
        this.equityHistory.forEach((point, index) => {
            const x = 40 + (streetPositions[point.street] / 3) * (580 - 40);
            const playerY = (200 - 40) - (point.playerEquity / 100) * (200 - 40);
            const opponentY = (200 - 40) - (point.opponentEquity / 100) * (200 - 40);

            // Player point
            this.equityCtx.fillStyle = '#4CAF50';
            this.equityCtx.beginPath();
            this.equityCtx.arc(x, playerY, 4, 0, 2 * Math.PI);
            this.equityCtx.fill();

            // Opponent point
            this.equityCtx.fillStyle = '#f44336';
            this.equityCtx.beginPath();
            this.equityCtx.arc(x, opponentY, 4, 0, 2 * Math.PI);
            this.equityCtx.fill();
        });
    }

    logAction(action) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${action}`;
        
        const p = document.createElement('p');
        p.textContent = logEntry;
        p.classList.add('slide-in');
        
        this.historyLog.appendChild(p);
        this.historyLog.scrollTop = this.historyLog.scrollHeight;
    }

    resetGame() {
        this.playerCards = [];
        this.communityCards = [];
        this.currentStreet = 'preflop';
        this.equityHistory = [];

        // Reset UI
        this.playerCardsEl.innerHTML = '<div class="card-placeholder">?</div><div class="card-placeholder">?</div>';
        this.communityCardsEl.innerHTML = '<div class="card-placeholder">?</div><div class="card-placeholder">?</div><div class="card-placeholder">?</div><div class="card-placeholder">?</div><div class="card-placeholder">?</div>';
        
        // Reset progress bars
        [this.winProgress, this.tieProgress, this.loseProgress].forEach(bar => {
            bar.style.width = '0%';
        });
        [this.winPercentage, this.tiePercentage, this.losePercentage].forEach(percentage => {
            percentage.textContent = '0%';
        });

        // Reset pie chart
        [this.winArc, this.tieArc, this.loseArc].forEach(arc => {
            arc.style.strokeDasharray = '0 565.48';
        });
        this.pieCenterText.textContent = '0%';

        // Reset meters
        [this.winGauge, this.strengthGauge].forEach(gauge => {
            gauge.style.width = '0%';
        });
        [this.winMeterValue, this.strengthMeterValue].forEach(value => {
            value.textContent = '0%';
        });

        // Reset hand strength
        this.strengthBar.style.width = '0%';
        this.handStrengthText.textContent = 'Click Deal to Start';

        // Reset outs
        this.outsNumber.textContent = '0';
        this.outsCards.innerHTML = '';
        this.outsPercentage.textContent = '0% chance to improve';

        // Reset equity graph
        this.initializeEquityGraph();

        // Reset buttons
        this.nextStreetButton.disabled = true;
        this.nextStreetButton.textContent = 'Next Street';
        this.dealButton.textContent = 'Deal New Hand';

        // Clear history
        this.historyLog.innerHTML = '<p>Game reset. Click "Deal New Hand" to begin.</p>';
    }
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PokerOddsDashboard();
});