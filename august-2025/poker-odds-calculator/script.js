class PokerOddsCalculator {
    constructor() {
        this.suits = ['♠', '♥', '♦', '♣'];
        this.ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        this.deck = this.createDeck();
        this.usedCards = new Set();
        this.gameState = {
            playerCards: [null, null],
            communityCards: {
                'flop-1': null,
                'flop-2': null,
                'flop-3': null,
                'turn': null,
                'river': null
            }
        };
        this.history = [];
        this.historyIndex = -1;
        this.maxHistorySize = 50;
        
        this.init();
    }

    init() {
        this.renderDeck();
        this.setupEventListeners();
        this.saveState();
        this.calculateOdds();
    }

    createDeck() {
        const deck = [];
        this.suits.forEach(suit => {
            this.ranks.forEach(rank => {
                deck.push({ suit, rank });
            });
        });
        return deck;
    }

    renderDeck() {
        const deckContainer = document.getElementById('cardDeck');
        deckContainer.innerHTML = '';
        
        this.deck.forEach((card, index) => {
            if (!this.usedCards.has(this.getCardKey(card))) {
                const cardElement = this.createCardElement(card, index);
                deckContainer.appendChild(cardElement);
            }
        });
    }

    createCardElement(card, index) {
        const cardElement = document.createElement('div');
        cardElement.className = `playing-card ${this.getCardColor(card.suit)}`;
        cardElement.draggable = true;
        cardElement.dataset.card = this.getCardKey(card);
        cardElement.style.setProperty('--card-index', index);
        
        cardElement.innerHTML = `
            <div class="card-top">
                <div class="card-rank">${card.rank}</div>
                <div class="card-suit">${card.suit}</div>
            </div>
            <div class="card-center">${card.suit}</div>
            <div class="card-bottom">
                <div class="card-rank">${card.rank}</div>
                <div class="card-suit">${card.suit}</div>
            </div>
        `;

        this.setupCardDragEvents(cardElement);
        return cardElement;
    }

    setupCardDragEvents(cardElement) {
        cardElement.addEventListener('dragstart', (e) => {
            cardElement.classList.add('dragging');
            e.dataTransfer.setData('text/plain', cardElement.dataset.card);
            e.dataTransfer.effectAllowed = 'move';
        });

        cardElement.addEventListener('dragend', () => {
            cardElement.classList.remove('dragging');
        });
    }

    setupEventListeners() {
        // Setup drop zones
        document.querySelectorAll('.card-slot').forEach(slot => {
            this.setupDropZone(slot);
        });

        // Control buttons
        document.getElementById('dealRandom').addEventListener('click', () => this.dealRandom());
        document.getElementById('clearBoard').addEventListener('click', () => this.clearBoard());
        document.getElementById('undo').addEventListener('click', () => this.undo());
        document.getElementById('redo').addEventListener('click', () => this.redo());
        document.getElementById('save').addEventListener('click', () => this.showSaveLoadModal());
        document.getElementById('load').addEventListener('click', () => this.showSaveLoadModal());

        // Modal events
        document.getElementById('saveState').addEventListener('click', () => this.saveStateWithName());
        document.querySelector('.close').addEventListener('click', () => this.hideSaveLoadModal());
        
        // Close modal when clicking outside
        document.getElementById('saveLoadModal').addEventListener('click', (e) => {
            if (e.target.id === 'saveLoadModal') {
                this.hideSaveLoadModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'z':
                        e.preventDefault();
                        if (e.shiftKey) {
                            this.redo();
                        } else {
                            this.undo();
                        }
                        break;
                    case 'r':
                        e.preventDefault();
                        this.dealRandom();
                        break;
                    case 's':
                        e.preventDefault();
                        this.showSaveLoadModal();
                        break;
                }
            }
        });
    }

    setupDropZone(slot) {
        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            slot.classList.add('drag-over');
        });

        slot.addEventListener('dragleave', () => {
            slot.classList.remove('drag-over');
        });

        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.classList.remove('drag-over');
            
            const cardKey = e.dataTransfer.getData('text/plain');
            if (cardKey && !slot.classList.contains('occupied')) {
                this.placeCard(cardKey, slot.dataset.position);
            }
        });

        // Double-click to remove card
        slot.addEventListener('dblclick', () => {
            if (slot.classList.contains('occupied')) {
                this.removeCard(slot.dataset.position);
            }
        });
    }

    placeCard(cardKey, position) {
        if (this.usedCards.has(cardKey)) {
            this.showToast('Card already in use!', 'error');
            return;
        }

        const card = this.parseCardKey(cardKey);
        const slot = document.querySelector(`[data-position="${position}"]`);
        
        // Save state before making changes
        this.saveState();
        
        // Update game state
        if (position.startsWith('player')) {
            const index = parseInt(position.split('-')[1]) - 1;
            this.gameState.playerCards[index] = card;
        } else {
            this.gameState.communityCards[position] = card;
        }
        
        // Mark card as used
        this.usedCards.add(cardKey);
        
        // Update UI
        this.updateSlot(slot, card);
        this.renderDeck();
        this.calculateOdds();
        
        // Add flip animation
        slot.querySelector('.playing-card').classList.add('flip-animation');
        setTimeout(() => {
            const cardElement = slot.querySelector('.playing-card');
            if (cardElement) {
                cardElement.classList.remove('flip-animation');
            }
        }, 600);
        
        this.showToast(`Placed ${card.rank}${card.suit}`, 'success');
    }

    removeCard(position) {
        this.saveState();
        
        let card;
        if (position.startsWith('player')) {
            const index = parseInt(position.split('-')[1]) - 1;
            card = this.gameState.playerCards[index];
            this.gameState.playerCards[index] = null;
        } else {
            card = this.gameState.communityCards[position];
            this.gameState.communityCards[position] = null;
        }
        
        if (card) {
            this.usedCards.delete(this.getCardKey(card));
            const slot = document.querySelector(`[data-position="${position}"]`);
            this.clearSlot(slot);
            this.renderDeck();
            this.calculateOdds();
            this.showToast(`Removed ${card.rank}${card.suit}`, 'info');
        }
    }

    updateSlot(slot, card) {
        slot.classList.add('occupied');
        slot.innerHTML = `
            <div class="playing-card ${this.getCardColor(card.suit)}">
                <div class="card-top">
                    <div class="card-rank">${card.rank}</div>
                    <div class="card-suit">${card.suit}</div>
                </div>
                <div class="card-center">${card.suit}</div>
                <div class="card-bottom">
                    <div class="card-rank">${card.rank}</div>
                    <div class="card-suit">${card.suit}</div>
                </div>
            </div>
        `;
    }

    clearSlot(slot) {
        slot.classList.remove('occupied');
        slot.innerHTML = `<span class="slot-label">${this.getSlotLabel(slot.dataset.position)}</span>`;
    }

    getSlotLabel(position) {
        const labels = {
            'player-1': 'Card 1',
            'player-2': 'Card 2',
            'flop-1': 'Flop 1',
            'flop-2': 'Flop 2',
            'flop-3': 'Flop 3',
            'turn': 'Turn',
            'river': 'River'
        };
        return labels[position] || position;
    }

    dealRandom() {
        this.saveState();
        this.clearBoard(false); // Don't save state again
        
        // Add shuffle animation
        const deckContainer = document.getElementById('cardDeck');
        deckContainer.classList.add('shuffling');
        
        setTimeout(() => {
            deckContainer.classList.remove('shuffling');
            
            const availableCards = this.deck.filter(card => !this.usedCards.has(this.getCardKey(card)));
            const shuffled = this.shuffleArray([...availableCards]);
            
            // Deal player cards
            for (let i = 0; i < 2; i++) {
                if (shuffled.length > 0) {
                    const card = shuffled.pop();
                    const position = `player-${i + 1}`;
                    this.gameState.playerCards[i] = card;
                    this.usedCards.add(this.getCardKey(card));
                    
                    const slot = document.querySelector(`[data-position="${position}"]`);
                    this.updateSlot(slot, card);
                }
            }
            
            // Deal community cards
            const communityPositions = ['flop-1', 'flop-2', 'flop-3', 'turn', 'river'];
            communityPositions.forEach(position => {
                if (shuffled.length > 0) {
                    const card = shuffled.pop();
                    this.gameState.communityCards[position] = card;
                    this.usedCards.add(this.getCardKey(card));
                    
                    const slot = document.querySelector(`[data-position="${position}"]`);
                    this.updateSlot(slot, card);
                }
            });
            
            this.renderDeck();
            this.calculateOdds();
            this.showToast('Random cards dealt!', 'success');
        }, 500);
    }

    clearBoard(saveState = true) {
        if (saveState) this.saveState();
        
        this.usedCards.clear();
        this.gameState.playerCards = [null, null];
        Object.keys(this.gameState.communityCards).forEach(key => {
            this.gameState.communityCards[key] = null;
        });
        
        document.querySelectorAll('.card-slot').forEach(slot => {
            this.clearSlot(slot);
        });
        
        this.renderDeck();
        this.calculateOdds();
        if (saveState) this.showToast('Board cleared!', 'info');
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Undo/Redo functionality
    saveState() {
        const state = JSON.parse(JSON.stringify({
            gameState: this.gameState,
            usedCards: Array.from(this.usedCards)
        }));
        
        // Remove future history if we're not at the end
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        
        this.history.push(state);
        
        // Limit history size
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
        } else {
            this.historyIndex++;
        }
        
        this.updateUndoRedoButtons();
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.restoreState(this.history[this.historyIndex]);
            this.showToast('Undo successful', 'info');
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.restoreState(this.history[this.historyIndex]);
            this.showToast('Redo successful', 'info');
        }
    }

    restoreState(state) {
        this.gameState = JSON.parse(JSON.stringify(state.gameState));
        this.usedCards = new Set(state.usedCards);
        
        // Update UI
        document.querySelectorAll('.card-slot').forEach(slot => {
            const position = slot.dataset.position;
            let card;
            
            if (position.startsWith('player')) {
                const index = parseInt(position.split('-')[1]) - 1;
                card = this.gameState.playerCards[index];
            } else {
                card = this.gameState.communityCards[position];
            }
            
            if (card) {
                this.updateSlot(slot, card);
            } else {
                this.clearSlot(slot);
            }
        });
        
        this.renderDeck();
        this.calculateOdds();
        this.updateUndoRedoButtons();
    }

    updateUndoRedoButtons() {
        document.getElementById('undo').disabled = this.historyIndex <= 0;
        document.getElementById('redo').disabled = this.historyIndex >= this.history.length - 1;
    }

    // Save/Load functionality
    showSaveLoadModal() {
        this.updateSavedStatesList();
        document.getElementById('saveLoadModal').style.display = 'block';
    }

    hideSaveLoadModal() {
        document.getElementById('saveLoadModal').style.display = 'none';
        document.getElementById('stateName').value = '';
    }

    updateSavedStatesList() {
        const savedStates = this.getSavedStates();
        const list = document.getElementById('savedStatesList');
        
        if (savedStates.length === 0) {
            list.innerHTML = '<p style="color: rgba(255,255,255,0.7)">No saved states</p>';
            return;
        }
        
        list.innerHTML = savedStates.map(state => `
            <div class="saved-state-item">
                <span>${state.name}</span>
                <div>
                    <button onclick="poker.loadState('${state.name}')">Load</button>
                    <button class="delete-btn" onclick="poker.deleteState('${state.name}')">Delete</button>
                </div>
            </div>
        `).join('');
    }

    saveStateWithName() {
        const name = document.getElementById('stateName').value.trim();
        if (!name) {
            this.showToast('Please enter a state name', 'error');
            return;
        }
        
        const savedStates = this.getSavedStates();
        const existingIndex = savedStates.findIndex(state => state.name === name);
        
        const stateData = {
            name,
            gameState: this.gameState,
            usedCards: Array.from(this.usedCards),
            timestamp: new Date().toISOString()
        };
        
        if (existingIndex >= 0) {
            savedStates[existingIndex] = stateData;
        } else {
            savedStates.push(stateData);
        }
        
        localStorage.setItem('pokerStates', JSON.stringify(savedStates));
        this.updateSavedStatesList();
        document.getElementById('stateName').value = '';
        this.showToast(`State "${name}" saved!`, 'success');
    }

    loadState(name) {
        const savedStates = this.getSavedStates();
        const state = savedStates.find(s => s.name === name);
        
        if (state) {
            this.saveState(); // Save current state to history first
            this.gameState = JSON.parse(JSON.stringify(state.gameState));
            this.usedCards = new Set(state.usedCards);
            
            // Update UI
            document.querySelectorAll('.card-slot').forEach(slot => {
                const position = slot.dataset.position;
                let card;
                
                if (position.startsWith('player')) {
                    const index = parseInt(position.split('-')[1]) - 1;
                    card = this.gameState.playerCards[index];
                } else {
                    card = this.gameState.communityCards[position];
                }
                
                if (card) {
                    this.updateSlot(slot, card);
                } else {
                    this.clearSlot(slot);
                }
            });
            
            this.renderDeck();
            this.calculateOdds();
            this.hideSaveLoadModal();
            this.showToast(`State "${name}" loaded!`, 'success');
        }
    }

    deleteState(name) {
        const savedStates = this.getSavedStates();
        const filteredStates = savedStates.filter(state => state.name !== name);
        localStorage.setItem('pokerStates', JSON.stringify(filteredStates));
        this.updateSavedStatesList();
        this.showToast(`State "${name}" deleted!`, 'info');
    }

    getSavedStates() {
        const saved = localStorage.getItem('pokerStates');
        return saved ? JSON.parse(saved) : [];
    }

    // Poker odds calculation
    calculateOdds() {
        const playerCards = this.gameState.playerCards.filter(card => card !== null);
        const communityCards = Object.values(this.gameState.communityCards).filter(card => card !== null);
        
        if (playerCards.length === 0) {
            this.updateResults('-', '-', '-');
            return;
        }
        
        const allCards = [...playerCards, ...communityCards];
        const handStrength = this.getHandStrength(allCards);
        const outs = this.calculateOuts(playerCards, communityCards);
        const winProbability = this.calculateWinProbability(playerCards, communityCards);
        
        this.updateResults(handStrength, winProbability, outs);
    }

    getHandStrength(cards) {
        if (cards.length < 2) return 'High Card';
        
        const ranks = cards.map(card => this.getRankValue(card.rank));
        const suits = cards.map(card => card.suit);
        
        // Count ranks and suits
        const rankCounts = {};
        const suitCounts = {};
        
        ranks.forEach(rank => {
            rankCounts[rank] = (rankCounts[rank] || 0) + 1;
        });
        
        suits.forEach(suit => {
            suitCounts[suit] = (suitCounts[suit] || 0) + 1;
        });
        
        const sortedRanks = Object.keys(rankCounts).map(Number).sort((a, b) => b - a);
        const rankCountValues = Object.values(rankCounts).sort((a, b) => b - a);
        const maxSuitCount = Math.max(...Object.values(suitCounts));
        
        // Check for straight
        const isStraight = this.isStraight(sortedRanks);
        const isFlush = maxSuitCount >= 5;
        
        // Determine hand strength
        if (isStraight && isFlush) {
            return sortedRanks.includes(14) ? 'Royal Flush' : 'Straight Flush';
        } else if (rankCountValues[0] === 4) {
            return 'Four of a Kind';
        } else if (rankCountValues[0] === 3 && rankCountValues[1] === 2) {
            return 'Full House';
        } else if (isFlush) {
            return 'Flush';
        } else if (isStraight) {
            return 'Straight';
        } else if (rankCountValues[0] === 3) {
            return 'Three of a Kind';
        } else if (rankCountValues[0] === 2 && rankCountValues[1] === 2) {
            return 'Two Pair';
        } else if (rankCountValues[0] === 2) {
            return 'One Pair';
        } else {
            return 'High Card';
        }
    }

    isStraight(sortedRanks) {
        if (sortedRanks.length < 5) return false;
        
        for (let i = 0; i <= sortedRanks.length - 5; i++) {
            let consecutive = true;
            for (let j = 1; j < 5; j++) {
                if (sortedRanks[i + j] !== sortedRanks[i] - j) {
                    consecutive = false;
                    break;
                }
            }
            if (consecutive) return true;
        }
        
        // Check for A-2-3-4-5 straight (wheel)
        if (sortedRanks.includes(14) && sortedRanks.includes(2) && 
            sortedRanks.includes(3) && sortedRanks.includes(4) && sortedRanks.includes(5)) {
            return true;
        }
        
        return false;
    }

    calculateOuts(playerCards, communityCards) {
        if (playerCards.length !== 2) return 0;
        
        const allCards = [...playerCards, ...communityCards];
        const remainingCards = 52 - allCards.length;
        
        if (remainingCards <= 0) return 0;
        
        // Simple outs calculation based on common scenarios
        const ranks = allCards.map(card => this.getRankValue(card.rank));
        const suits = allCards.map(card => card.suit);
        
        const rankCounts = {};
        const suitCounts = {};
        
        ranks.forEach(rank => {
            rankCounts[rank] = (rankCounts[rank] || 0) + 1;
        });
        
        suits.forEach(suit => {
            suitCounts[suit] = (suitCounts[suit] || 0) + 1;
        });
        
        let outs = 0;
        
        // Flush draw
        const maxSuitCount = Math.max(...Object.values(suitCounts));
        if (maxSuitCount === 4) {
            outs += 9; // 13 - 4 cards of the same suit
        }
        
        // Straight draw (simplified)
        if (this.hasOpenEndedStraightDraw(ranks)) {
            outs += 8;
        } else if (this.hasGutshotStraightDraw(ranks)) {
            outs += 4;
        }
        
        // Pair draws
        const pairCount = Object.values(rankCounts).filter(count => count === 2).length;
        if (pairCount === 0 && communityCards.length > 0) {
            outs += 6; // Two overcards
        }
        
        return Math.min(outs, remainingCards);
    }

    hasOpenEndedStraightDraw(ranks) {
        // Simplified check for open-ended straight draw
        const uniqueRanks = [...new Set(ranks)].sort((a, b) => a - b);
        if (uniqueRanks.length < 4) return false;
        
        for (let i = 0; i <= uniqueRanks.length - 4; i++) {
            let consecutive = 0;
            for (let j = 1; j < 4; j++) {
                if (uniqueRanks[i + j] === uniqueRanks[i] + j) {
                    consecutive++;
                } else {
                    break;
                }
            }
            if (consecutive === 3) return true;
        }
        return false;
    }

    hasGutshotStraightDraw(ranks) {
        // Simplified check for gutshot straight draw
        const uniqueRanks = [...new Set(ranks)].sort((a, b) => a - b);
        if (uniqueRanks.length < 4) return false;
        
        // Check for gaps in 4-card sequences
        for (let i = 0; i <= uniqueRanks.length - 3; i++) {
            let gaps = 0;
            let span = uniqueRanks[i + 2] - uniqueRanks[i];
            if (span === 4) {
                // Check if there's exactly one gap
                for (let j = 1; j < 3; j++) {
                    if (uniqueRanks[i + j] !== uniqueRanks[i] + j) {
                        gaps++;
                    }
                }
                if (gaps === 1) return true;
            }
        }
        return false;
    }

    calculateWinProbability(playerCards, communityCards) {
        if (playerCards.length !== 2) return '0%';
        
        const cardsDealt = playerCards.length + communityCards.length;
        const cardsRemaining = 5 - communityCards.length;
        
        if (cardsRemaining <= 0) {
            // All community cards are dealt, calculate actual hand strength
            const allCards = [...playerCards, ...communityCards];
            const strength = this.getHandStrength(allCards);
            return this.getHandStrengthPercentage(strength);
        }
        
        // Simplified probability calculation
        const outs = this.calculateOuts(playerCards, communityCards);
        const cardsLeft = 47 - communityCards.length; // 52 - 2 player cards - community cards
        
        let probability;
        if (cardsRemaining === 2) {
            // Turn and river to come
            probability = (outs * 4) - ((outs - 8) * 0.17);
        } else if (cardsRemaining === 1) {
            // Only river to come
            probability = (outs * 2) + 2;
        } else {
            // Pre-flop or other scenarios
            probability = this.getPreFlopWinRate(playerCards);
        }
        
        return Math.min(100, Math.max(0, probability)).toFixed(1) + '%';
    }

    getHandStrengthPercentage(strength) {
        const percentages = {
            'Royal Flush': '100%',
            'Straight Flush': '99%',
            'Four of a Kind': '95%',
            'Full House': '85%',
            'Flush': '70%',
            'Straight': '60%',
            'Three of a Kind': '45%',
            'Two Pair': '30%',
            'One Pair': '20%',
            'High Card': '10%'
        };
        return percentages[strength] || '0%';
    }

    getPreFlopWinRate(playerCards) {
        if (playerCards.length !== 2) return 0;
        
        const ranks = playerCards.map(card => this.getRankValue(card.rank));
        const suits = playerCards.map(card => card.suit);
        const isPair = ranks[0] === ranks[1];
        const isSuited = suits[0] === suits[1];
        
        if (isPair) {
            if (ranks[0] >= 14) return 85; // AA
            if (ranks[0] >= 13) return 82; // KK
            if (ranks[0] >= 12) return 80; // QQ
            if (ranks[0] >= 11) return 78; // JJ
            if (ranks[0] >= 10) return 75; // TT
            if (ranks[0] >= 8) return 65;  // 88-99
            return 55; // Low pairs
        }
        
        const highCard = Math.max(...ranks);
        const lowCard = Math.min(...ranks);
        const gap = highCard - lowCard;
        
        let baseWinRate = 0;
        if (highCard >= 14) baseWinRate = 65; // Ace high
        else if (highCard >= 13) baseWinRate = 60; // King high
        else if (highCard >= 12) baseWinRate = 55; // Queen high
        else if (highCard >= 11) baseWinRate = 50; // Jack high
        else baseWinRate = 40; // Lower cards
        
        // Adjust for suitedness and connectedness
        if (isSuited) baseWinRate += 3;
        if (gap <= 1) baseWinRate += 2; // Connected
        if (gap <= 3) baseWinRate += 1; // Semi-connected
        
        return Math.min(85, baseWinRate);
    }

    getRankValue(rank) {
        const values = {
            'A': 14, 'K': 13, 'Q': 12, 'J': 11,
            '10': 10, '9': 9, '8': 8, '7': 7, '6': 6,
            '5': 5, '4': 4, '3': 3, '2': 2
        };
        return values[rank] || 0;
    }

    updateResults(handStrength, winProbability, outs) {
        document.getElementById('handStrength').textContent = handStrength;
        document.getElementById('winProbability').textContent = winProbability;
        document.getElementById('outs').textContent = outs;
    }

    // Utility functions
    getCardKey(card) {
        return `${card.rank}${card.suit}`;
    }

    parseCardKey(cardKey) {
        const suit = cardKey.slice(-1);
        const rank = cardKey.slice(0, -1);
        return { rank, suit };
    }

    getCardColor(suit) {
        return ['♥', '♦'].includes(suit) ? 'red' : 'black';
    }

    showToast(message, type = 'info') {
        // Remove existing toasts
        document.querySelectorAll('.toast').forEach(toast => toast.remove());
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize the poker calculator when the page loads
let poker;
document.addEventListener('DOMContentLoaded', () => {
    poker = new PokerOddsCalculator();
});