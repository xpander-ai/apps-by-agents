class PokerGame {
    constructor() {
        this.deck = [];
        this.communityCards = [];
        this.players = [
            { name: 'Player 1', hand: [], handStrength: 0, outs: 0 },
            { name: 'Player 2', hand: [], handStrength: 0, outs: 0 }
        ];
        this.gamePhase = 'preflop'; // preflop, flop, turn, river
        this.equityHistory = [];
        
        this.initializeDeck();
        this.setupEventListeners();
        this.initializeCharts();
        
        // Start first game automatically
        this.newGame();
    }

    initializeDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
        
        this.fullDeck = [];
        suits.forEach(suit => {
            ranks.forEach(rank => {
                this.fullDeck.push({
                    rank: rank,
                    suit: suit,
                    value: this.getCardValue(rank),
                    display: rank + suit,
                    color: (suit === '♥' || suit === '♦') ? 'red' : 'black'
                });
            });
        });
    }

    getCardValue(rank) {
        if (rank === 'A') return 14;
        if (rank === 'K') return 13;
        if (rank === 'Q') return 12;
        if (rank === 'J') return 11;
        if (rank === 'T') return 10;
        return parseInt(rank);
    }

    shuffleDeck() {
        this.deck = [...this.fullDeck];
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    dealCard() {
        return this.deck.pop();
    }

    setupEventListeners() {
        document.getElementById('new-game-btn').addEventListener('click', () => this.newGame());
        document.getElementById('deal-flop-btn').addEventListener('click', () => this.dealFlop());
        document.getElementById('deal-turn-btn').addEventListener('click', () => this.dealTurn());
        document.getElementById('deal-river-btn').addEventListener('click', () => this.dealRiver());
    }

    newGame() {
        this.shuffleDeck();
        this.communityCards = [];
        this.gamePhase = 'preflop';
        this.equityHistory = [];
        
        // Deal hole cards
        this.players.forEach(player => {
            player.hand = [this.dealCard(), this.dealCard()];
            player.handStrength = 0;
            player.outs = 0;
        });

        this.updateUI();
        this.calculateOdds();
        this.updateButtons();
    }

    dealFlop() {
        if (this.gamePhase !== 'preflop') return;
        
        // Burn one card
        this.dealCard();
        
        // Deal flop
        this.communityCards.push(this.dealCard(), this.dealCard(), this.dealCard());
        this.gamePhase = 'flop';
        
        this.updateUI();
        this.calculateOdds();
        this.updateButtons();
    }

    dealTurn() {
        if (this.gamePhase !== 'flop') return;
        
        // Burn one card
        this.dealCard();
        
        // Deal turn
        this.communityCards.push(this.dealCard());
        this.gamePhase = 'turn';
        
        this.updateUI();
        this.calculateOdds();
        this.updateButtons();
    }

    dealRiver() {
        if (this.gamePhase !== 'turn') return;
        
        // Burn one card
        this.dealCard();
        
        // Deal river
        this.communityCards.push(this.dealCard());
        this.gamePhase = 'river';
        
        this.updateUI();
        this.calculateOdds();
        this.updateButtons();
    }

    updateButtons() {
        document.getElementById('deal-flop-btn').disabled = this.gamePhase !== 'preflop';
        document.getElementById('deal-turn-btn').disabled = this.gamePhase !== 'flop';
        document.getElementById('deal-river-btn').disabled = this.gamePhase !== 'turn';
    }

    updateUI() {
        // Update player hands
        this.players.forEach((player, index) => {
            const prefix = index === 0 ? 'p1' : 'p2';
            this.displayCard(`${prefix}-card1`, player.hand[0]);
            this.displayCard(`${prefix}-card2`, player.hand[1]);
            
            const handName = this.getHandName(this.evaluateHand(player.hand.concat(this.communityCards)));
            document.getElementById(`${prefix}-hand-name`).textContent = handName;
        });

        // Update community cards
        const cardPositions = ['flop1', 'flop2', 'flop3', 'turn', 'river'];
        cardPositions.forEach((position, index) => {
            if (this.communityCards[index]) {
                this.displayCard(position, this.communityCards[index]);
            } else {
                this.hideCard(position);
            }
        });

        // Update remaining deck visualization
        this.updateRemainingDeck();
    }

    displayCard(elementId, card) {
        const element = document.getElementById(elementId);
        element.textContent = card.display;
        element.className = `card ${card.color}`;
        element.style.opacity = '1';
        element.style.transform = 'rotateY(0deg)';
    }

    hideCard(elementId) {
        const element = document.getElementById(elementId);
        element.className = 'card hidden';
        element.textContent = '';
        element.style.opacity = '0';
    }

    calculateOdds() {
        if (this.gamePhase === 'river') {
            // Game is over, calculate final results
            const p1Hand = this.evaluateHand(this.players[0].hand.concat(this.communityCards));
            const p2Hand = this.evaluateHand(this.players[1].hand.concat(this.communityCards));
            
            let p1Win = 0, p2Win = 0, tie = 0;
            
            if (p1Hand.strength > p2Hand.strength) {
                p1Win = 100;
            } else if (p2Hand.strength > p1Hand.strength) {
                p2Win = 100;
            } else {
                tie = 100;
            }
            
            this.updateProbabilities(p1Win, p2Win, tie);
            this.players[0].outs = 0;
            this.players[1].outs = 0;
        } else {
            // Monte Carlo simulation for odds calculation
            const results = this.monteCarloSimulation(10000);
            this.updateProbabilities(results.p1Win, results.p2Win, results.tie);
            this.calculateOuts();
        }

        this.updateHandStrengths();
        this.updateEquityGraph();
    }

    monteCarloSimulation(iterations) {
        let p1Wins = 0, p2Wins = 0, ties = 0;
        
        for (let i = 0; i < iterations; i++) {
            const simulatedCommunity = this.simulateRemainingCards();
            const p1Hand = this.evaluateHand(this.players[0].hand.concat(simulatedCommunity));
            const p2Hand = this.evaluateHand(this.players[1].hand.concat(simulatedCommunity));
            
            if (p1Hand.strength > p2Hand.strength || 
                (p1Hand.strength === p2Hand.strength && this.compareKickers(p1Hand, p2Hand) > 0)) {
                p1Wins++;
            } else if (p2Hand.strength > p1Hand.strength || 
                      (p1Hand.strength === p2Hand.strength && this.compareKickers(p1Hand, p2Hand) < 0)) {
                p2Wins++;
            } else {
                ties++;
            }
        }
        
        return {
            p1Win: (p1Wins / iterations) * 100,
            p2Win: (p2Wins / iterations) * 100,
            tie: (ties / iterations) * 100
        };
    }

    simulateRemainingCards() {
        const usedCards = this.players[0].hand.concat(this.players[1].hand, this.communityCards);
        const availableCards = this.fullDeck.filter(card => 
            !usedCards.some(used => used.rank === card.rank && used.suit === card.suit)
        );
        
        const remainingSlots = 5 - this.communityCards.length;
        const simulatedCards = [...this.communityCards];
        
        // Shuffle available cards and take what we need
        for (let i = availableCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [availableCards[i], availableCards[j]] = [availableCards[j], availableCards[i]];
        }
        
        for (let i = 0; i < remainingSlots; i++) {
            simulatedCards.push(availableCards[i]);
        }
        
        return simulatedCards;
    }

    evaluateHand(cards) {
        if (cards.length < 5) return { strength: 0, kickers: [] };
        
        // Get best 5-card combination
        const combinations = this.getCombinations(cards, 5);
        let bestHand = { strength: 0, kickers: [] };
        
        combinations.forEach(combo => {
            const hand = this.evaluateSpecificHand(combo);
            if (hand.strength > bestHand.strength) {
                bestHand = hand;
            }
        });
        
        return bestHand;
    }

    getCombinations(array, size) {
        if (size > array.length) return [];
        if (size === array.length) return [array];
        if (size === 1) return array.map(item => [item]);
        
        const combinations = [];
        for (let i = 0; i <= array.length - size; i++) {
            const head = array[i];
            const tailCombinations = this.getCombinations(array.slice(i + 1), size - 1);
            tailCombinations.forEach(tail => {
                combinations.push([head, ...tail]);
            });
        }
        return combinations;
    }

    evaluateSpecificHand(cards) {
        const sortedCards = cards.sort((a, b) => b.value - a.value);
        const suits = cards.map(c => c.suit);
        const values = cards.map(c => c.value);
        
        const isFlush = suits.every(suit => suit === suits[0]);
        const isStraight = this.isStraight(values);
        const valueCounts = this.getValueCounts(values);
        
        // Royal Flush
        if (isFlush && isStraight && values.includes(14) && values.includes(13)) {
            return { strength: 9, kickers: [] };
        }
        
        // Straight Flush
        if (isFlush && isStraight) {
            return { strength: 8, kickers: [Math.max(...values)] };
        }
        
        // Four of a Kind
        if (valueCounts.some(count => count === 4)) {
            const fourKind = values.find(v => values.filter(val => val === v).length === 4);
            const kicker = values.find(v => v !== fourKind);
            return { strength: 7, kickers: [fourKind, kicker] };
        }
        
        // Full House
        if (valueCounts.includes(3) && valueCounts.includes(2)) {
            const threeKind = values.find(v => values.filter(val => val === v).length === 3);
            const pair = values.find(v => values.filter(val => val === v).length === 2);
            return { strength: 6, kickers: [threeKind, pair] };
        }
        
        // Flush
        if (isFlush) {
            return { strength: 5, kickers: sortedCards.map(c => c.value) };
        }
        
        // Straight
        if (isStraight) {
            return { strength: 4, kickers: [Math.max(...values)] };
        }
        
        // Three of a Kind
        if (valueCounts.includes(3)) {
            const threeKind = values.find(v => values.filter(val => val === v).length === 3);
            const kickers = values.filter(v => v !== threeKind).sort((a, b) => b - a);
            return { strength: 3, kickers: [threeKind, ...kickers] };
        }
        
        // Two Pair
        const pairs = values.filter((v, i, arr) => arr.filter(val => val === v).length === 2)
                           .filter((v, i, arr) => arr.indexOf(v) === i)
                           .sort((a, b) => b - a);
        if (pairs.length === 2) {
            const kicker = values.find(v => !pairs.includes(v));
            return { strength: 2, kickers: [...pairs, kicker] };
        }
        
        // One Pair
        if (pairs.length === 1) {
            const kickers = values.filter(v => v !== pairs[0]).sort((a, b) => b - a);
            return { strength: 1, kickers: [pairs[0], ...kickers] };
        }
        
        // High Card
        return { strength: 0, kickers: sortedCards.map(c => c.value) };
    }

    isStraight(values) {
        const sorted = [...new Set(values)].sort((a, b) => a - b);
        if (sorted.length !== 5) return false;
        
        // Check for regular straight
        for (let i = 1; i < sorted.length; i++) {
            if (sorted[i] - sorted[i-1] !== 1) {
                // Check for A-2-3-4-5 straight
                if (!(sorted[0] === 2 && sorted[1] === 3 && sorted[2] === 4 && sorted[3] === 5 && sorted[4] === 14)) {
                    return false;
                }
            }
        }
        return true;
    }

    getValueCounts(values) {
        const counts = {};
        values.forEach(value => {
            counts[value] = (counts[value] || 0) + 1;
        });
        return Object.values(counts);
    }

    compareKickers(hand1, hand2) {
        for (let i = 0; i < Math.max(hand1.kickers.length, hand2.kickers.length); i++) {
            const k1 = hand1.kickers[i] || 0;
            const k2 = hand2.kickers[i] || 0;
            if (k1 !== k2) return k1 - k2;
        }
        return 0;
    }

    getHandName(hand) {
        const names = [
            'High Card', 'Pair', 'Two Pair', 'Three of a Kind', 
            'Straight', 'Flush', 'Full House', 'Four of a Kind', 
            'Straight Flush', 'Royal Flush'
        ];
        return names[hand.strength] || 'High Card';
    }

    calculateOuts() {
        this.players.forEach((player, index) => {
            player.outs = this.calculatePlayerOuts(player);
            document.getElementById(`${index === 0 ? 'p1' : 'p2'}-outs`).textContent = player.outs;
        });
    }

    calculatePlayerOuts(player) {
        const currentHand = this.evaluateHand(player.hand.concat(this.communityCards));
        const usedCards = this.players[0].hand.concat(this.players[1].hand, this.communityCards);
        const availableCards = this.fullDeck.filter(card => 
            !usedCards.some(used => used.rank === card.rank && used.suit === card.suit)
        );
        
        let outs = 0;
        availableCards.forEach(card => {
            const newCommunity = [...this.communityCards, card];
            if (newCommunity.length <= 5) {
                const newHand = this.evaluateHand(player.hand.concat(newCommunity));
                if (newHand.strength > currentHand.strength) {
                    outs++;
                }
            }
        });
        
        return outs;
    }

    updateProbabilities(p1Win, p2Win, tie) {
        // Update progress bars with animation
        this.animateProgressBar('p1-win-bar', p1Win);
        this.animateProgressBar('p2-win-bar', p2Win);
        this.animateProgressBar('tie-bar', tie);
        
        // Update percentage text
        document.getElementById('p1-win-pct').textContent = p1Win.toFixed(1) + '%';
        document.getElementById('p2-win-pct').textContent = p2Win.toFixed(1) + '%';
        document.getElementById('tie-pct').textContent = tie.toFixed(1) + '%';
        
        // Update pie chart
        this.updatePieChart(p1Win, p2Win, tie);
        
        // Update circular meters
        this.updateCircularMeter('p1-meter', p1Win);
        this.updateCircularMeter('p2-meter', p2Win);
    }

    animateProgressBar(elementId, percentage) {
        const progressBar = document.querySelector(`#${elementId} .progress-fill`);
        progressBar.style.transition = 'width 0.5s ease-in-out';
        progressBar.style.width = percentage + '%';
        progressBar.setAttribute('data-percentage', percentage);
    }

    updateCircularMeter(elementId, percentage) {
        const meter = document.querySelector(`#${elementId} .meter-fill`);
        const valueSpan = document.querySelector(`#${elementId} .meter-value`);
        
        const circumference = 220;
        const offset = circumference - (percentage / 100) * circumference;
        
        meter.style.transition = 'stroke-dashoffset 0.5s ease-in-out';
        meter.style.strokeDashoffset = offset;
        valueSpan.textContent = percentage.toFixed(1) + '%';
    }

    updatePieChart(p1Win, p2Win, tie) {
        const svg = document.getElementById('pie-chart');
        // Clear existing slices
        const existingSlices = svg.querySelectorAll('.pie-slice');
        existingSlices.forEach(slice => slice.remove());
        
        const total = p1Win + p2Win + tie;
        if (total === 0) return;
        
        const data = [
            { value: p1Win, color: '#4CAF50', class: 'p1-slice' },
            { value: tie, color: '#FFC107', class: 'tie-slice' },
            { value: p2Win, color: '#2196F3', class: 'p2-slice' }
        ];
        
        let currentAngle = -90; // Start at top
        const radius = 80;
        const centerX = 100;
        const centerY = 100;
        
        data.forEach(segment => {
            if (segment.value > 0) {
                const angle = (segment.value / total) * 360;
                const slice = this.createPieSlice(centerX, centerY, radius, currentAngle, angle, segment.color, segment.class);
                svg.appendChild(slice);
                currentAngle += angle;
            }
        });
    }

    createPieSlice(centerX, centerY, radius, startAngle, angle, color, className) {
        const startAngleRad = (startAngle * Math.PI) / 180;
        const endAngleRad = ((startAngle + angle) * Math.PI) / 180;
        
        const x1 = centerX + radius * Math.cos(startAngleRad);
        const y1 = centerY + radius * Math.sin(startAngleRad);
        const x2 = centerX + radius * Math.cos(endAngleRad);
        const y2 = centerY + radius * Math.sin(endAngleRad);
        
        const largeArcFlag = angle > 180 ? 1 : 0;
        
        const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
        ].join(' ');
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('fill', color);
        path.setAttribute('class', `pie-slice ${className}`);
        path.style.transition = 'all 0.3s ease-in-out';
        
        return path;
    }

    updateHandStrengths() {
        this.players.forEach((player, index) => {
            const hand = this.evaluateHand(player.hand.concat(this.communityCards));
            const strength = (hand.strength / 9) * 100; // Convert to percentage
            const prefix = index === 0 ? 'p1' : 'p2';
            
            const strengthBar = document.getElementById(`${prefix}-strength`);
            const strengthText = document.getElementById(`${prefix}-strength-text`);
            
            strengthBar.style.transition = 'width 0.5s ease-in-out';
            strengthBar.style.width = strength + '%';
            strengthBar.setAttribute('data-strength', hand.strength);
            
            // Update color based on strength
            strengthBar.className = 'strength-fill';
            if (hand.strength >= 7) strengthBar.classList.add('excellent');
            else if (hand.strength >= 5) strengthBar.classList.add('strong');
            else if (hand.strength >= 3) strengthBar.classList.add('medium');
            else if (hand.strength >= 1) strengthBar.classList.add('weak');
            else strengthBar.classList.add('very-weak');
            
            strengthText.textContent = this.getHandName(hand);
        });
    }

    updateRemainingDeck() {
        const remainingDeckElement = document.getElementById('remaining-deck');
        remainingDeckElement.innerHTML = '';
        
        const usedCards = this.players[0].hand.concat(this.players[1].hand, this.communityCards);
        const availableCards = this.fullDeck.filter(card => 
            !usedCards.some(used => used.rank === card.rank && used.suit === card.suit)
        );
        
        // Show a sample of remaining cards
        const sampleSize = Math.min(20, availableCards.length);
        const sample = availableCards.slice(0, sampleSize);
        
        sample.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = `mini-card ${card.color}`;
            cardElement.textContent = card.display;
            remainingDeckElement.appendChild(cardElement);
        });
        
        if (availableCards.length > sampleSize) {
            const more = document.createElement('div');
            more.className = 'more-cards';
            more.textContent = `+${availableCards.length - sampleSize} more`;
            remainingDeckElement.appendChild(more);
        }
    }

    updateEquityGraph() {
        const canvas = document.getElementById('equity-chart');
        const ctx = canvas.getContext('2d');
        
        // Add current equity to history
        const p1Pct = parseFloat(document.getElementById('p1-win-pct').textContent) || 0;
        const p2Pct = parseFloat(document.getElementById('p2-win-pct').textContent) || 0;
        
        this.equityHistory.push({
            phase: this.gamePhase,
            p1: p1Pct,
            p2: p2Pct
        });
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (this.equityHistory.length < 2) return;
        
        // Draw grid
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= 10; i++) {
            const y = (i / 10) * canvas.height;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        // Draw equity lines
        const stepX = canvas.width / (this.equityHistory.length - 1);
        
        // Player 1 line
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 2;
        ctx.beginPath();
        this.equityHistory.forEach((point, index) => {
            const x = index * stepX;
            const y = canvas.height - (point.p1 / 100) * canvas.height;
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
        
        // Player 2 line
        ctx.strokeStyle = '#2196F3';
        ctx.beginPath();
        this.equityHistory.forEach((point, index) => {
            const x = index * stepX;
            const y = canvas.height - (point.p2 / 100) * canvas.height;
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
    }

    initializeCharts() {
        // Initialize empty pie chart
        this.updatePieChart(0, 0, 0);
        
        // Initialize equity graph
        const canvas = document.getElementById('equity-chart');
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PokerGame();
});