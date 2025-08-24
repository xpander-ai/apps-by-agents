class PokerOddsCalculator {
    constructor() {
        this.suits = ['♠', '♥', '♦', '♣'];
        this.ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
        this.deck = this.generateDeck();
        this.history = this.loadHistory();
        this.currentPreset = 'accurate';
        
        this.init();
    }
    
    init() {
        this.populateCardSelects();
        this.setupEventListeners();
        this.updateIterationsDisplay();
        this.renderHistory();
    }
    
    generateDeck() {
        const deck = [];
        for (let suit of this.suits) {
            for (let rank of this.ranks) {
                deck.push(rank + suit);
            }
        }
        return deck;
    }
    
    populateCardSelects() {
        const selects = document.querySelectorAll('.card-select');
        selects.forEach(select => {
            select.innerHTML = '<option value="">Select Card</option>';
            this.deck.forEach(card => {
                const option = document.createElement('option');
                option.value = card;
                option.textContent = card;
                select.appendChild(option);
            });
        });
    }
    
    setupEventListeners() {
        document.getElementById('calculate-btn').addEventListener('click', () => this.calculateOdds());
        document.getElementById('iterations-slider').addEventListener('input', (e) => {
            document.getElementById('iterations-value').textContent = parseInt(e.target.value).toLocaleString();
        });
        
        // Card selection validation
        document.querySelectorAll('.card-select').forEach(select => {
            select.addEventListener('change', () => this.validateCardSelection());
        });
    }
    
    validateCardSelection() {
        const selectedCards = new Set();
        const selects = document.querySelectorAll('.card-select');
        let isValid = true;
        
        selects.forEach(select => {
            if (select.value) {
                if (selectedCards.has(select.value)) {
                    select.style.borderColor = '#e74c3c';
                    isValid = false;
                } else {
                    select.style.borderColor = '';
                    selectedCards.add(select.value);
                }
            }
        });
        
        document.getElementById('calculate-btn').disabled = !isValid;
        return isValid;
    }
    
    calculateOdds() {
        if (!this.validateCardSelection()) return;
        
        const playerHand = this.getPlayerHand();
        const communityCards = this.getCommunityCards();
        const opponents = parseInt(document.getElementById('opponents-count').value);
        const iterations = parseInt(document.getElementById('iterations-slider').value);
        
        if (playerHand.length !== 2) {
            alert('Please select both cards for your hand');
            return;
        }
        
        const results = this.runMonteCarloSimulation(playerHand, communityCards, opponents, iterations);
        this.displayResults(results);
        this.saveToHistory(playerHand, communityCards, opponents, results);
    }
    
    getPlayerHand() {
        const hand = [];
        const card1 = document.getElementById('hand1-card1').value;
        const card2 = document.getElementById('hand1-card2').value;
        
        if (card1) hand.push(card1);
        if (card2) hand.push(card2);
        
        return hand;
    }
    
    getCommunityCards() {
        const cards = [];
        const cardIds = ['flop1', 'flop2', 'flop3', 'turn', 'river'];
        
        cardIds.forEach(id => {
            const card = document.getElementById(id).value;
            if (card) cards.push(card);
        });
        
        return cards;
    }
    
    runMonteCarloSimulation(playerHand, communityCards, opponents, iterations) {
        let wins = 0;
        let ties = 0;
        const usedCards = new Set([...playerHand, ...communityCards]);
        
        for (let i = 0; i < iterations; i++) {
            const availableDeck = this.deck.filter(card => !usedCards.has(card));
            const shuffled = this.shuffleArray([...availableDeck]);
            
            // Complete the community cards
            const fullBoard = [...communityCards];
            while (fullBoard.length < 5) {
                fullBoard.push(shuffled.shift());
            }
            
            // Deal opponent hands
            const opponentHands = [];
            for (let j = 0; j < opponents; j++) {
                opponentHands.push([shuffled.shift(), shuffled.shift()]);
            }
            
            // Evaluate hands
            const playerBest = this.evaluateHand([...playerHand, ...fullBoard]);
            const opponentBests = opponentHands.map(hand => 
                this.evaluateHand([...hand, ...fullBoard])
            );
            
            const allHandValues = [playerBest, ...opponentBests];
            const maxValue = Math.max(...allHandValues);
            const winnersCount = allHandValues.filter(value => value === maxValue).length;
            
            if (playerBest === maxValue) {
                if (winnersCount === 1) {
                    wins++;
                } else {
                    ties++;
                }
            }
        }
        
        const winPercent = (wins / iterations) * 100;
        const tiePercent = (ties / iterations) * 100;
        const handStrength = this.getHandStrength(playerHand, communityCards);
        
        return {
            winPercent: winPercent.toFixed(1),
            tiePercent: tiePercent.toFixed(1),
            handStrength,
            iterations
        };
    }
    
    evaluateHand(cards) {
        // Simplified hand evaluation - returns a numeric value for comparison
        const handRanks = this.getHandRanks(cards);
        const handSuits = this.getHandSuits(cards);
        
        // Check for flush
        const isFlush = Object.values(handSuits).some(count => count >= 5);
        
        // Check for straight
        const isStraight = this.isStraight(handRanks);
        
        // Count pairs, trips, etc.
        const rankCounts = Object.values(handRanks).sort((a, b) => b - a);
        
        // Royal flush
        if (isFlush && isStraight && Math.max(...Object.keys(handRanks).map(r => this.ranks.indexOf(r))) === 12) {
            return 900000;
        }
        
        // Straight flush
        if (isFlush && isStraight) {
            return 800000 + Math.max(...Object.keys(handRanks).map(r => this.ranks.indexOf(r)));
        }
        
        // Four of a kind
        if (rankCounts[0] === 4) {
            return 700000 + this.getKickerValue(handRanks, 4);
        }
        
        // Full house
        if (rankCounts[0] === 3 && rankCounts[1] === 2) {
            return 600000 + this.getKickerValue(handRanks, 3) * 100 + this.getKickerValue(handRanks, 2);
        }
        
        // Flush
        if (isFlush) {
            return 500000 + this.getFlushValue(cards);
        }
        
        // Straight
        if (isStraight) {
            return 400000 + Math.max(...Object.keys(handRanks).map(r => this.ranks.indexOf(r)));
        }
        
        // Three of a kind
        if (rankCounts[0] === 3) {
            return 300000 + this.getKickerValue(handRanks, 3);
        }
        
        // Two pair
        if (rankCounts[0] === 2 && rankCounts[1] === 2) {
            return 200000 + this.getTwoPairValue(handRanks);
        }
        
        // One pair
        if (rankCounts[0] === 2) {
            return 100000 + this.getKickerValue(handRanks, 2);
        }
        
        // High card
        return this.getHighCardValue(handRanks);
    }
    
    getHandRanks(cards) {
        const ranks = {};
        cards.forEach(card => {
            const rank = card.slice(0, -1);
            ranks[rank] = (ranks[rank] || 0) + 1;
        });
        return ranks;
    }
    
    getHandSuits(cards) {
        const suits = {};
        cards.forEach(card => {
            const suit = card.slice(-1);
            suits[suit] = (suits[suit] || 0) + 1;
        });
        return suits;
    }
    
    isStraight(handRanks) {
        const ranks = Object.keys(handRanks).map(r => this.ranks.indexOf(r)).sort((a, b) => a - b);
        
        // Check for regular straight
        for (let i = 0; i <= ranks.length - 5; i++) {
            let consecutive = 1;
            for (let j = i + 1; j < ranks.length; j++) {
                if (ranks[j] === ranks[j-1] + 1) {
                    consecutive++;
                    if (consecutive === 5) return true;
                } else if (ranks[j] !== ranks[j-1]) {
                    break;
                }
            }
        }
        
        // Check for A-2-3-4-5 straight (wheel)
        const wheelRanks = [0, 1, 2, 3, 12]; // 2,3,4,5,A
        if (wheelRanks.every(rank => ranks.includes(rank))) {
            return true;
        }
        
        return false;
    }
    
    getKickerValue(handRanks, pairSize) {
        let value = 0;
        const sorted = Object.entries(handRanks)
            .sort((a, b) => b[1] - a[1] || this.ranks.indexOf(b[0]) - this.ranks.indexOf(a[0]));
        
        sorted.forEach(([rank, count]) => {
            if (count === pairSize) {
                value += this.ranks.indexOf(rank) * 1000;
            } else {
                value += this.ranks.indexOf(rank);
            }
        });
        
        return value;
    }
    
    getTwoPairValue(handRanks) {
        const pairs = Object.entries(handRanks)
            .filter(([rank, count]) => count === 2)
            .map(([rank]) => this.ranks.indexOf(rank))
            .sort((a, b) => b - a);
        
        return pairs[0] * 100 + pairs[1];
    }
    
    getFlushValue(cards) {
        return cards.map(card => this.ranks.indexOf(card.slice(0, -1)))
                   .sort((a, b) => b - a)
                   .slice(0, 5)
                   .reduce((sum, rank, i) => sum + rank * Math.pow(13, 4 - i), 0);
    }
    
    getHighCardValue(handRanks) {
        return Object.keys(handRanks)
                    .map(rank => this.ranks.indexOf(rank))
                    .sort((a, b) => b - a)
                    .slice(0, 5)
                    .reduce((sum, rank, i) => sum + rank * Math.pow(13, 4 - i), 0);
    }
    
    getHandStrength(playerHand, communityCards) {
        if (communityCards.length === 0) {
            return this.getPreflopHandStrength(playerHand);
        }
        
        const allCards = [...playerHand, ...communityCards];
        const handValue = this.evaluateHand(allCards);
        
        if (handValue >= 900000) return "Royal Flush";
        if (handValue >= 800000) return "Straight Flush";
        if (handValue >= 700000) return "Four of a Kind";
        if (handValue >= 600000) return "Full House";
        if (handValue >= 500000) return "Flush";
        if (handValue >= 400000) return "Straight";
        if (handValue >= 300000) return "Three of a Kind";
        if (handValue >= 200000) return "Two Pair";
        if (handValue >= 100000) return "One Pair";
        return "High Card";
    }
    
    getPreflopHandStrength(hand) {
        const [card1, card2] = hand;
        const rank1 = card1.slice(0, -1);
        const rank2 = card2.slice(0, -1);
        const suit1 = card1.slice(-1);
        const suit2 = card2.slice(-1);
        
        const isPair = rank1 === rank2;
        const isSuited = suit1 === suit2;
        
        if (isPair) {
            return `Pair of ${rank1}s`;
        }
        
        return `${rank1}${rank2}${isSuited ? 's' : 'o'}`;
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    displayResults(results) {
        document.getElementById('win-prob').textContent = `${results.winPercent}%`;
        document.getElementById('tie-prob').textContent = `${results.tiePercent}%`;
        document.getElementById('hand-strength').textContent = results.handStrength;
        document.getElementById('results-section').style.display = 'block';
    }
    
    updateIterationsDisplay() {
        const slider = document.getElementById('iterations-slider');
        document.getElementById('iterations-value').textContent = parseInt(slider.value).toLocaleString();
    }
    
    saveToHistory(playerHand, communityCards, opponents, results) {
        const calculation = {
            id: Date.now(),
            timestamp: new Date().toLocaleString(),
            playerHand: playerHand.join(', '),
            communityCards: communityCards.join(', ') || 'None',
            opponents,
            winPercent: results.winPercent,
            tiePercent: results.tiePercent,
            handStrength: results.handStrength,
            iterations: results.iterations,
            favorite: false
        };
        
        this.history.unshift(calculation);
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }
        
        this.saveHistory();
        this.renderHistory();
    }
    
    loadHistory() {
        const saved = localStorage.getItem('poker-odds-history');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveHistory() {
        localStorage.setItem('poker-odds-history', JSON.stringify(this.history));
    }
    
    renderHistory() {
        const historyList = document.getElementById('history-list');
        
        if (this.history.length === 0) {
            historyList.innerHTML = '<p class="no-history">No calculations yet</p>';
            return;
        }
        
        historyList.innerHTML = this.history.map(calc => `
            <div class="history-item ${calc.favorite ? 'favorite' : ''}">
                <div class="history-header">
                    <span class="timestamp">${calc.timestamp}</span>
                    <div class="history-actions">
                        <button class="favorite-btn" onclick="calculator.toggleFavorite(${calc.id})" title="Toggle Favorite">
                            ${calc.favorite ? '★' : '☆'}
                        </button>
                        <button class="delete-btn" onclick="calculator.deleteCalculation(${calc.id})" title="Delete">×</button>
                    </div>
                </div>
                <div class="calculation-details">
                    <div><strong>Hand:</strong> ${calc.playerHand}</div>
                    <div><strong>Board:</strong> ${calc.communityCards}</div>
                    <div><strong>Opponents:</strong> ${calc.opponents}</div>
                    <div><strong>Win:</strong> ${calc.winPercent}% | <strong>Tie:</strong> ${calc.tiePercent}%</div>
                    <div><strong>Strength:</strong> ${calc.handStrength}</div>
                </div>
            </div>
        `).join('');
    }
    
    toggleFavorite(id) {
        const calc = this.history.find(c => c.id === id);
        if (calc) {
            calc.favorite = !calc.favorite;
            this.saveHistory();
            this.renderHistory();
        }
    }
    
    deleteCalculation(id) {
        this.history = this.history.filter(c => c.id !== id);
        this.saveHistory();
        this.renderHistory();
    }
    
    clearHistory() {
        if (confirm('Are you sure you want to clear all history?')) {
            this.history = [];
            this.saveHistory();
            this.renderHistory();
        }
    }
    
    exportHistory() {
        const data = this.history.map(calc => ({
            Timestamp: calc.timestamp,
            Hand: calc.playerHand,
            Board: calc.communityCards,
            Opponents: calc.opponents,
            'Win %': calc.winPercent,
            'Tie %': calc.tiePercent,
            'Hand Strength': calc.handStrength,
            Iterations: calc.iterations,
            Favorite: calc.favorite ? 'Yes' : 'No'
        }));
        
        const csv = this.convertToCSV(data);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `poker-odds-history-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }
    
    convertToCSV(data) {
        if (data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
        ].join('\n');
        
        return csvContent;
    }
}

// Global functions for HTML onclick handlers
function toggleSettings() {
    const content = document.getElementById('settings-content');
    const toggle = document.getElementById('settings-toggle');
    
    if (content.style.display === 'none' || !content.style.display) {
        content.style.display = 'block';
        toggle.textContent = '▲';
    } else {
        content.style.display = 'none';
        toggle.textContent = '▼';
    }
}

function toggleHistory() {
    const content = document.getElementById('history-content');
    const toggle = document.getElementById('history-toggle');
    
    if (content.style.display === 'none' || !content.style.display) {
        content.style.display = 'block';
        toggle.textContent = '▲';
    } else {
        content.style.display = 'none';
        toggle.textContent = '▼';
    }
}

function applyPreset(preset) {
    const presets = {
        quick: {
            iterations: 1000,
            potOdds: true,
            impliedOdds: false,
            positionAnalysis: false,
            rangeAnalysis: false,
            description: 'Quick mode: 1K iterations, basic calculations'
        },
        accurate: {
            iterations: 10000,
            potOdds: true,
            impliedOdds: true,
            positionAnalysis: true,
            rangeAnalysis: false,
            description: 'Accurate mode: 10K iterations with most calculations enabled'
        },
        tournament: {
            iterations: 50000,
            potOdds: true,
            impliedOdds: true,
            positionAnalysis: true,
            rangeAnalysis: true,
            description: 'Tournament mode: 50K iterations with all calculations enabled'
        }
    };
    
    const config = presets[preset];
    if (!config) return;
    
    // Update slider
    document.getElementById('iterations-slider').value = config.iterations;
    document.getElementById('iterations-value').textContent = config.iterations.toLocaleString();
    
    // Update toggles
    document.getElementById('pot-odds').checked = config.potOdds;
    document.getElementById('implied-odds').checked = config.impliedOdds;
    document.getElementById('position-analysis').checked = config.positionAnalysis;
    document.getElementById('range-analysis').checked = config.rangeAnalysis;
    
    // Update description
    document.getElementById('preset-description').textContent = config.description;
    
    // Update active button
    document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    calculator.currentPreset = preset;
}

function clearHistory() {
    calculator.clearHistory();
}

function exportHistory() {
    calculator.exportHistory();
}

// Initialize the calculator
let calculator;
document.addEventListener('DOMContentLoaded', () => {
    calculator = new PokerOddsCalculator();
});