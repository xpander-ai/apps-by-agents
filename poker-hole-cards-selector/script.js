class PokerCardSelector {
    constructor() {
        this.suits = {
            'S': { symbol: '♠', name: 'Spades', class: 'suit-spades' },
            'H': { symbol: '♥', name: 'Hearts', class: 'suit-hearts' },
            'D': { symbol: '♦', name: 'Diamonds', class: 'suit-diamonds' },
            'C': { symbol: '♣', name: 'Clubs', class: 'suit-clubs' }
        };
        
        this.ranks = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
        
        this.selectedCards = {
            card1: null,
            card2: null
        };
        
        this.handRankings = {
            'AA': { name: 'Pocket Aces', strength: 'Premium', odds: '220:1' },
            'KK': { name: 'Pocket Kings', strength: 'Premium', odds: '220:1' },
            'QQ': { name: 'Pocket Queens', strength: 'Premium', odds: '220:1' },
            'JJ': { name: 'Pocket Jacks', strength: 'Strong', odds: '220:1' },
            'AKs': { name: 'Big Slick (Suited)', strength: 'Premium', odds: '331:1' },
            'AK': { name: 'Big Slick', strength: 'Strong', odds: '82:1' },
            'AQs': { name: 'Big Chick (Suited)', strength: 'Strong', odds: '331:1' },
            'AQ': { name: 'Big Chick', strength: 'Playable', odds: '82:1' },
            'AJs': { name: 'Ajax (Suited)', strength: 'Strong', odds: '331:1' },
            'AJ': { name: 'Ajax', strength: 'Playable', odds: '82:1' }
        };
        
        this.init();
    }
    
    init() {
        this.createCardGrids();
        this.setupEventListeners();
        this.updateDisplay();
    }
    
    createCardGrids() {
        const card1Grid = document.getElementById('card1-grid');
        const card2Grid = document.getElementById('card2-grid');
        
        this.populateCardGrid(card1Grid, 'card1');
        this.populateCardGrid(card2Grid, 'card2');
    }
    
    populateCardGrid(grid, cardSlot) {
        grid.innerHTML = '';
        
        for (const rank of this.ranks) {
            for (const [suitKey, suitData] of Object.entries(this.suits)) {
                const cardValue = rank + suitKey;
                const cardElement = document.createElement('div');
                cardElement.className = 'card-option';
                cardElement.dataset.card = cardValue;
                
                // Check if card is already selected
                const otherSlot = cardSlot === 'card1' ? 'card2' : 'card1';
                const isDisabled = this.selectedCards[otherSlot] === cardValue;
                
                if (isDisabled) {
                    cardElement.classList.add('disabled');
                }
                
                cardElement.innerHTML = `
                    <div class="card-rank">${rank}</div>
                    <div class="card-suit ${suitData.class}">${suitData.symbol}</div>
                `;
                
                if (!isDisabled) {
                    cardElement.addEventListener('click', () => this.selectCard(cardSlot, cardValue));
                }
                
                grid.appendChild(cardElement);
            }
        }
    }
    
    selectCard(slot, cardValue) {
        this.selectedCards[slot] = cardValue;
        this.updateCardDisplay(slot, cardValue);
        this.closeDropdown(slot);
        this.updateCardGrids();
        this.updateHandDisplay();
        this.updateStats();
    }
    
    updateCardDisplay(slot, cardValue) {
        const dropdown = document.getElementById(`${slot}-dropdown`);
        const selectedCard = dropdown.querySelector('.selected-card');
        const cardDisplay = selectedCard.querySelector('.card-display');
        
        if (cardValue) {
            const rank = cardValue.slice(0, -1);
            const suit = cardValue.slice(-1);
            const suitData = this.suits[suit];
            
            cardDisplay.innerHTML = `
                <span class="card-rank">${rank}</span>
                <span class="card-suit ${suitData.class}">${suitData.symbol}</span>
            `;
            selectedCard.classList.add('has-card');
        } else {
            cardDisplay.textContent = 'Select Card';
            selectedCard.classList.remove('has-card');
        }
    }
    
    updateCardGrids() {
        this.createCardGrids();
    }
    
    updateHandDisplay() {
        const handDisplay = document.getElementById('hand-display');
        const handInfo = document.getElementById('hand-info');
        
        handDisplay.innerHTML = '';
        
        for (let i = 1; i <= 2; i++) {
            const cardValue = this.selectedCards[`card${i}`];
            const cardElement = document.createElement('div');
            
            if (cardValue) {
                const rank = cardValue.slice(0, -1);
                const suit = cardValue.slice(-1);
                const suitData = this.suits[suit];
                
                cardElement.className = 'display-card';
                cardElement.innerHTML = `
                    <div class="card-rank">${rank}</div>
                    <div class="card-suit ${suitData.class}">${suitData.symbol}</div>
                `;
            } else {
                cardElement.className = 'empty-card';
                cardElement.textContent = '?';
            }
            
            handDisplay.appendChild(cardElement);
        }
        
        // Update hand name
        const handName = this.getHandName();
        const handNameElement = handInfo.querySelector('.hand-name');
        const handStrengthElement = handInfo.querySelector('.hand-strength');
        
        if (handName.name) {
            handNameElement.textContent = handName.name;
            handStrengthElement.textContent = handName.strength ? `Strength: ${handName.strength}` : '';
        } else {
            handNameElement.textContent = this.selectedCards.card1 && this.selectedCards.card2 ? 
                this.getSimpleHandName() : 'No cards selected';
            handStrengthElement.textContent = '';
        }
    }
    
    getHandName() {
        if (!this.selectedCards.card1 || !this.selectedCards.card2) {
            return { name: null };
        }
        
        const card1 = this.selectedCards.card1;
        const card2 = this.selectedCards.card2;
        
        const rank1 = card1.slice(0, -1);
        const rank2 = card2.slice(0, -1);
        const suit1 = card1.slice(-1);
        const suit2 = card2.slice(-1);
        
        const isSuited = suit1 === suit2;
        const isPair = rank1 === rank2;
        
        if (isPair) {
            const handKey = rank1 + rank1;
            return this.handRankings[handKey] || { name: `Pocket ${rank1}s`, strength: 'Pair' };
        }
        
        // Sort ranks for consistent lookup
        const ranks = [rank1, rank2].sort((a, b) => {
            const rankOrder = { 'A': 14, 'K': 13, 'Q': 12, 'J': 11, '10': 10, '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2 };
            return rankOrder[b] - rankOrder[a];
        });
        
        const handKey = isSuited ? ranks.join('') + 's' : ranks.join('');
        return this.handRankings[handKey] || { name: null };
    }
    
    getSimpleHandName() {
        const card1 = this.selectedCards.card1;
        const card2 = this.selectedCards.card2;
        
        const rank1 = card1.slice(0, -1);
        const rank2 = card2.slice(0, -1);
        const suit1 = card1.slice(-1);
        const suit2 = card2.slice(-1);
        
        const isSuited = suit1 === suit2;
        const isPair = rank1 === rank2;
        
        if (isPair) {
            return `Pocket ${rank1}s`;
        }
        
        const ranks = [rank1, rank2].sort((a, b) => {
            const rankOrder = { 'A': 14, 'K': 13, 'Q': 12, 'J': 11, '10': 10, '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2 };
            return rankOrder[b] - rankOrder[a];
        });
        
        return `${ranks.join('')}${isSuited ? ' suited' : ' offsuit'}`;
    }
    
    updateStats() {
        const handTypeElement = document.getElementById('hand-type');
        const suitedStatusElement = document.getElementById('suited-status');
        const handOddsElement = document.getElementById('hand-odds');
        
        if (!this.selectedCards.card1 || !this.selectedCards.card2) {
            handTypeElement.textContent = '-';
            suitedStatusElement.textContent = '-';
            handOddsElement.textContent = '-';
            return;
        }
        
        const card1 = this.selectedCards.card1;
        const card2 = this.selectedCards.card2;
        
        const rank1 = card1.slice(0, -1);
        const rank2 = card2.slice(0, -1);
        const suit1 = card1.slice(-1);
        const suit2 = card2.slice(-1);
        
        const isSuited = suit1 === suit2;
        const isPair = rank1 === rank2;
        
        handTypeElement.textContent = isPair ? 'Pocket Pair' : 'Unpaired';
        suitedStatusElement.textContent = isPair ? 'N/A' : (isSuited ? 'Suited' : 'Offsuit');
        
        const handInfo = this.getHandName();
        handOddsElement.textContent = handInfo.odds || 'Variable';
    }
    
    setupEventListeners() {
        // Dropdown toggles
        document.getElementById('card1-dropdown').addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown-menu')) {
                this.toggleDropdown('card1');
            }
        });
        
        document.getElementById('card2-dropdown').addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown-menu')) {
                this.toggleDropdown('card2');
            }
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.card-dropdown')) {
                this.closeAllDropdowns();
            }
        });
        
        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const cards = btn.dataset.cards.split(',');
                this.setPresetCards(cards[0], cards[1]);
            });
        });
        
        // Action buttons
        document.getElementById('clear-btn').addEventListener('click', () => {
            this.clearSelection();
        });
        
        document.getElementById('random-btn').addEventListener('click', () => {
            this.selectRandomHand();
        });
    }
    
    toggleDropdown(slot) {
        const dropdown = document.getElementById(`${slot}-dropdown`);
        const isOpen = dropdown.classList.contains('open');
        
        this.closeAllDropdowns();
        
        if (!isOpen) {
            dropdown.classList.add('open');
        }
    }
    
    closeDropdown(slot) {
        const dropdown = document.getElementById(`${slot}-dropdown`);
        dropdown.classList.remove('open');
    }
    
    closeAllDropdowns() {
        document.querySelectorAll('.card-dropdown').forEach(dropdown => {
            dropdown.classList.remove('open');
        });
    }
    
    setPresetCards(card1, card2) {
        this.selectedCards.card1 = card1;
        this.selectedCards.card2 = card2;
        
        this.updateCardDisplay('card1', card1);
        this.updateCardDisplay('card2', card2);
        this.updateCardGrids();
        this.updateHandDisplay();
        this.updateStats();
        this.closeAllDropdowns();
    }
    
    clearSelection() {
        this.selectedCards.card1 = null;
        this.selectedCards.card2 = null;
        
        this.updateCardDisplay('card1', null);
        this.updateCardDisplay('card2', null);
        this.updateCardGrids();
        this.updateHandDisplay();
        this.updateStats();
        this.closeAllDropdowns();
    }
    
    selectRandomHand() {
        const allCards = [];
        for (const rank of this.ranks) {
            for (const suit of Object.keys(this.suits)) {
                allCards.push(rank + suit);
            }
        }
        
        // Shuffle and pick two cards
        const shuffled = allCards.sort(() => 0.5 - Math.random());
        const card1 = shuffled[0];
        const card2 = shuffled[1];
        
        this.setPresetCards(card1, card2);
    }
}

// Initialize the card selector when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PokerCardSelector();
});

// Add some nice animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.card-selector-section, .preset-section, .stats-section');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});