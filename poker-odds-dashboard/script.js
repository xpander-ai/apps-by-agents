class PokerOddsDashboard {
    constructor() {
        this.suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        this.ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        this.deck = this.createDeck();
        this.playerCards = [];
        this.communityCards = [];
        this.currentStreet = 'preflop'; // preflop, flop, turn, river
        this.equityHistory = [];
        this.pieChart = null;
        this.equityGraph = null;
        
        this.init();
    }

    createDeck() {
        const deck = [];
        for (const suit of this.suits) {
            for (const rank of this.ranks) {
                deck.push({ suit, rank });
            }
        }
        return deck;
    }

    init() {
        this.setupEventListeners();
        this.initCharts();
        this.dealNewHand();
    }

    setupEventListeners() {
        document.getElementById('deal-cards').addEventListener('click', () => this.dealNewHand());
        document.getElementById('next-street').addEventListener('click', () => this.nextStreet());
    }

    initCharts() {
        // Initialize Pie Chart
        const pieCtx = document.getElementById('probability-pie-chart').getContext('2d');
        this.pieChart = new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: ['Win', 'Tie', 'Lose'],
                datasets: [{
                    data: [33, 33, 34],
                    backgroundColor: [
                        'rgba(81, 207, 102, 0.8)',
                        'rgba(255, 212, 59, 0.8)',
                        'rgba(255, 107, 107, 0.8)'
                    ],
                    borderColor: [
                        'rgba(81, 207, 102, 1)',
                        'rgba(255, 212, 59, 1)',
                        'rgba(255, 107, 107, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: 'white'
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 1500
                }
            }
        });

        // Initialize Equity Graph
        const graphCtx = document.getElementById('equity-graph').getContext('2d');
        this.equityGraph = new Chart(graphCtx, {
            type: 'line',
            data: {
                labels: ['Pre-flop', 'Flop', 'Turn', 'River'],
                datasets: [{
                    label: 'Equity %',
                    data: [50, 50, 50, 50],
                    borderColor: 'rgba(116, 192, 252, 1)',
                    backgroundColor: 'rgba(116, 192, 252, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgba(116, 192, 252, 1)',
                    pointBorderColor: 'white',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            color: 'white',
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'white'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'white'
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    dealNewHand() {
        // Reset game state
        this.deck = this.createDeck();
        this.playerCards = [];
        this.communityCards = [];
        this.currentStreet = 'preflop';
        this.equityHistory = [];
        
        // Shuffle deck
        this.shuffleDeck();
        
        // Deal player cards
        this.playerCards = [this.drawCard(), this.drawCard()];
        
        // Update display
        this.renderCards();
        this.calculateAndUpdateOdds();
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    drawCard() {
        return this.deck.pop();
    }

    nextStreet() {
        switch (this.currentStreet) {
            case 'preflop':
                // Deal flop (3 cards)
                this.communityCards = [this.drawCard(), this.drawCard(), this.drawCard()];
                this.currentStreet = 'flop';
                break;
            case 'flop':
                // Deal turn (1 card)
                this.communityCards.push(this.drawCard());
                this.currentStreet = 'turn';
                break;
            case 'turn':
                // Deal river (1 card)
                this.communityCards.push(this.drawCard());
                this.currentStreet = 'river';
                break;
            case 'river':
                // Game over - deal new hand
                this.dealNewHand();
                return;
        }
        
        this.renderCards();
        this.calculateAndUpdateOdds();
    }

    renderCards() {
        // Render player cards
        const playerContainer = document.getElementById('player-cards');
        playerContainer.innerHTML = '';
        
        this.playerCards.forEach(card => {
            const cardEl = this.createCardElement(card);
            playerContainer.appendChild(cardEl);
        });
        
        // Render community cards
        const communityContainer = document.getElementById('community-cards');
        communityContainer.innerHTML = '';
        
        // Add community cards
        this.communityCards.forEach(card => {
            const cardEl = this.createCardElement(card);
            communityContainer.appendChild(cardEl);
        });
        
        // Add placeholder cards for remaining streets
        const remainingCards = 5 - this.communityCards.length;
        for (let i = 0; i < remainingCards; i++) {
            const cardEl = this.createCardElement(null, true);
            communityContainer.appendChild(cardEl);
        }
    }

    createCardElement(card, isBack = false) {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        
        if (isBack) {
            cardEl.className += ' back';
            cardEl.innerHTML = '🂠';
        } else {
            cardEl.className += ` ${card.suit}`;
            cardEl.innerHTML = `${card.rank}<br>${this.getSuitSymbol(card.suit)}`;
        }
        
        return cardEl;
    }

    getSuitSymbol(suit) {
        const symbols = {
            hearts: '♥',
            diamonds: '♦',
            clubs: '♣',
            spades: '♠'
        };
        return symbols[suit];
    }

    calculateAndUpdateOdds() {
        const odds = this.calculateOdds();
        const handStrength = this.evaluateHand();
        const outs = this.calculateOuts();
        
        // Update progress bars with animation
        this.updateProgressBars(odds);
        
        // Update pie chart
        this.updatePieChart(odds);
        
        // Update meters
        this.updateMeters(odds, handStrength);
        
        // Update hand strength indicator
        this.updateHandStrength(handStrength);
        
        // Update outs counter
        this.updateOuts(outs);
        
        // Update equity graph
        this.updateEquityGraph(odds.win);
        
        // Store equity for history
        this.equityHistory.push({
            street: this.currentStreet,
            equity: odds.win
        });
    }

    calculateOdds() {
        // Simplified odds calculation for demo
        // In a real implementation, you'd run Monte Carlo simulations
        const baseWinRate = this.getBaseWinRate();
        const handStrength = this.evaluateHand();
        const streetModifier = this.getStreetModifier();
        
        let winRate = baseWinRate * handStrength.multiplier * streetModifier;
        winRate = Math.max(5, Math.min(95, winRate)); // Clamp between 5-95%
        
        const tieRate = Math.random() * 10; // Random tie rate for demo
        const loseRate = 100 - winRate - tieRate;
        
        return {
            win: winRate,
            tie: tieRate,
            lose: loseRate
        };
    }

    getBaseWinRate() {
        // Simple calculation based on card ranks
        const playerRanks = this.playerCards.map(card => this.getCardValue(card.rank));
        const avgRank = playerRanks.reduce((sum, rank) => sum + rank, 0) / 2;
        
        // Higher cards = better base win rate
        return 20 + (avgRank / 13) * 40; // 20-60% base range
    }

    getCardValue(rank) {
        if (rank === 'A') return 14;
        if (rank === 'K') return 13;
        if (rank === 'Q') return 12;
        if (rank === 'J') return 11;
        return parseInt(rank) || 10;
    }

    getStreetModifier() {
        const modifiers = {
            preflop: 1.0,
            flop: 0.9,
            turn: 0.8,
            river: 1.0 // Final result
        };
        return modifiers[this.currentStreet];
    }

    evaluateHand() {
        const allCards = [...this.playerCards, ...this.communityCards];
        if (allCards.length < 2) return { type: 'High Card', level: 1, multiplier: 1.0 };
        
        // Simplified hand evaluation for demo
        const ranks = allCards.map(card => this.getCardValue(card.rank));
        const suits = allCards.map(card => card.suit);
        
        // Check for pairs, straights, flushes, etc.
        const rankCounts = {};
        ranks.forEach(rank => rankCounts[rank] = (rankCounts[rank] || 0) + 1);
        
        const counts = Object.values(rankCounts).sort((a, b) => b - a);
        const isFlush = suits.length >= 5 && this.hasFlush(suits);
        const isStraight = this.hasStraight(ranks);
        
        if (isStraight && isFlush) return { type: 'Straight Flush', level: 9, multiplier: 3.0 };
        if (counts[0] >= 4) return { type: 'Four of a Kind', level: 8, multiplier: 2.8 };
        if (counts[0] >= 3 && counts[1] >= 2) return { type: 'Full House', level: 7, multiplier: 2.5 };
        if (isFlush) return { type: 'Flush', level: 6, multiplier: 2.2 };
        if (isStraight) return { type: 'Straight', level: 5, multiplier: 2.0 };
        if (counts[0] >= 3) return { type: 'Three of a Kind', level: 4, multiplier: 1.8 };
        if (counts[0] >= 2 && counts[1] >= 2) return { type: 'Two Pair', level: 3, multiplier: 1.5 };
        if (counts[0] >= 2) return { type: 'Pair', level: 2, multiplier: 1.2 };
        
        return { type: 'High Card', level: 1, multiplier: 1.0 };
    }

    hasFlush(suits) {
        const suitCounts = {};
        suits.forEach(suit => suitCounts[suit] = (suitCounts[suit] || 0) + 1);
        return Object.values(suitCounts).some(count => count >= 5);
    }

    hasStraight(ranks) {
        const uniqueRanks = [...new Set(ranks)].sort((a, b) => a - b);
        if (uniqueRanks.length < 5) return false;
        
        for (let i = 0; i <= uniqueRanks.length - 5; i++) {
            let consecutive = true;
            for (let j = 1; j < 5; j++) {
                if (uniqueRanks[i + j] !== uniqueRanks[i] + j) {
                    consecutive = false;
                    break;
                }
            }
            if (consecutive) return true;
        }
        return false;
    }

    calculateOuts() {
        // Simplified outs calculation for demo
        const handStrength = this.evaluateHand();
        const remainingCards = this.deck.length;
        
        let outs = 0;
        
        if (handStrength.level <= 2) {
            outs = Math.floor(Math.random() * 15) + 5; // 5-20 outs for weak hands
        } else if (handStrength.level <= 5) {
            outs = Math.floor(Math.random() * 10) + 2; // 2-12 outs for medium hands
        } else {
            outs = Math.floor(Math.random() * 5); // 0-5 outs for strong hands
        }
        
        return Math.min(outs, remainingCards);
    }

    updateProgressBars(odds) {
        // Animate progress bars
        setTimeout(() => {
            document.getElementById('win-progress').style.width = `${odds.win}%`;
            document.getElementById('tie-progress').style.width = `${odds.tie}%`;
            document.getElementById('lose-progress').style.width = `${odds.lose}%`;
            
            document.getElementById('win-value').textContent = `${odds.win.toFixed(1)}%`;
            document.getElementById('tie-value').textContent = `${odds.tie.toFixed(1)}%`;
            document.getElementById('lose-value').textContent = `${odds.lose.toFixed(1)}%`;
        }, 100);
    }

    updatePieChart(odds) {
        this.pieChart.data.datasets[0].data = [odds.win, odds.tie, odds.lose];
        this.pieChart.update('active');
    }

    updateMeters(odds, handStrength) {
        // Update equity gauge
        const equityGauge = document.getElementById('equity-gauge');
        const equityValue = document.getElementById('equity-value');
        
        equityGauge.style.background = `conic-gradient(
            from 0deg,
            #51cf66 0deg ${odds.win * 3.6}deg,
            #1a1a1a ${odds.win * 3.6}deg 360deg
        )`;
        equityValue.textContent = `${odds.win.toFixed(1)}%`;
        
        // Update strength gauge
        const strengthGauge = document.getElementById('strength-gauge');
        const strengthValue = document.getElementById('strength-value');
        
        const strengthPercent = (handStrength.level / 9) * 100;
        strengthGauge.style.background = `conic-gradient(
            from 0deg,
            #ff8cc8 0deg ${strengthPercent * 3.6}deg,
            #1a1a1a ${strengthPercent * 3.6}deg 360deg
        )`;
        
        const strengthLabels = ['Very Low', 'Low', 'Fair', 'Good', 'Strong', 'Very Strong', 'Excellent', 'Exceptional', 'Maximum'];
        strengthValue.textContent = strengthLabels[Math.min(handStrength.level - 1, 8)];
    }

    updateHandStrength(handStrength) {
        // Update strength levels
        document.querySelectorAll('.level').forEach((level, index) => {
            level.classList.remove('active');
            if (index + 1 <= handStrength.level) {
                level.classList.add('active');
            }
        });
        
        // Update current hand type
        document.getElementById('current-hand-type').textContent = handStrength.type;
    }

    updateOuts(outs) {
        document.getElementById('outs-count').textContent = outs;
        
        // Update outs cards display
        const outsContainer = document.getElementById('outs-cards');
        outsContainer.innerHTML = '';
        
        // Show some random cards as potential outs (simplified for demo)
        for (let i = 0; i < Math.min(outs, 12); i++) {
            const randomSuit = this.suits[Math.floor(Math.random() * this.suits.length)];
            const randomRank = this.ranks[Math.floor(Math.random() * this.ranks.length)];
            const card = { suit: randomSuit, rank: randomRank };
            
            const cardEl = this.createCardElement(card);
            cardEl.classList.add('highlighted');
            outsContainer.appendChild(cardEl);
        }
    }

    updateEquityGraph(currentEquity) {
        const streetIndex = ['preflop', 'flop', 'turn', 'river'].indexOf(this.currentStreet);
        
        // Update the current street's equity
        this.equityGraph.data.datasets[0].data[streetIndex] = currentEquity;
        
        // Add some variation to future streets for visual appeal
        if (streetIndex < 3) {
            const variation = (Math.random() - 0.5) * 20;
            for (let i = streetIndex + 1; i < 4; i++) {
                this.equityGraph.data.datasets[0].data[i] = Math.max(0, Math.min(100, currentEquity + variation * (Math.random())));
            }
        }
        
        this.equityGraph.update('active');
    }
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PokerOddsDashboard();
});