class PokerCardSelector {
    constructor() {
        this.suits = [
            { name: 'spades', symbol: '♠', class: 'spades' },
            { name: 'hearts', symbol: '♥', class: 'hearts' },
            { name: 'diamonds', symbol: '♦', class: 'diamonds' },
            { name: 'clubs', symbol: '♣', class: 'clubs' }
        ];
        
        this.ranks = [
            { name: 'A', display: 'A' },
            { name: 'K', display: 'K' },
            { name: 'Q', display: 'Q' },
            { name: 'J', display: 'J' },
            { name: '10', display: '10' },
            { name: '9', display: '9' },
            { name: '8', display: '8' },
            { name: '7', display: '7' },
            { name: '6', display: '6' },
            { name: '5', display: '5' },
            { name: '4', display: '4' },
            { name: '3', display: '3' },
            { name: '2', display: '2' }
        ];
        
        this.selectedCards = {
            card1: null,
            card2: null
        };
        
        this.presetHands = {
            'AA': [{ rank: 'A', suit: 'spades' }, { rank: 'A', suit: 'hearts' }],
            'KK': [{ rank: 'K', suit: 'spades' }, { rank: 'K', suit: 'hearts' }],
            'QQ': [{ rank: 'Q', suit: 'spades' }, { rank: 'Q', suit: 'hearts' }],
            'JJ': [{ rank: 'J', suit: 'spades' }, { rank: 'J', suit: 'hearts' }],
            'AK': [{ rank: 'A', suit: 'spades' }, { rank: 'K', suit: 'hearts' }],
            'AQ': [{ rank: 'A', suit: 'spades' }, { rank: 'Q', suit: 'hearts' }],
            'AJ': [{ rank: 'A', suit: 'spades' }, { rank: 'J', suit: 'hearts' }],
            'KQ': [{ rank: 'K', suit: 'spades' }, { rank: 'Q', suit: 'hearts' }],
            'KJ': [{ rank: 'K', suit: 'spades' }, { rank: 'J', suit: 'hearts' }],
            'QJ': [{ rank: 'Q', suit: 'spades' }, { rank: 'J', suit: 'hearts' }]
        };
        
        this.init();
    }
    
    init() {
        this.generateCardGrids();
        this.setupEventListeners();
    }
    
    generateCardGrids() {
        const card1Grid = document.getElementById('card1-grid');
        const card2Grid = document.getElementById('card2-grid');
        
        this.generateCardGrid(card1Grid, 'card1');
        this.generateCardGrid(card2Grid, 'card2');
    }
    
    generateCardGrid(container, cardSlot) {
        container.innerHTML = '';
        
        this.ranks.forEach(rank => {
            this.suits.forEach(suit => {
                const cardOption = document.createElement('div');
                cardOption.className = 'card-option';
                cardOption.dataset.rank = rank.name;
                cardOption.dataset.suit = suit.name;
                cardOption.dataset.cardSlot = cardSlot;
                
                const rankSpan = document.createElement('span');
                rankSpan.className = 'rank';
                rankSpan.textContent = rank.display;
                
                const suitSpan = document.createElement('span');
                suitSpan.className = `suit ${suit.class}`;
                suitSpan.textContent = suit.symbol;
                
                cardOption.appendChild(rankSpan);
                cardOption.appendChild(suitSpan);
                
                cardOption.addEventListener('click', (e) => this.selectCard(e));
                
                container.appendChild(cardOption);
            });
        });
        
        this.updateCardAvailability();
    }
    
    setupEventListeners() {
        // Dropdown toggles
        document.getElementById('card1-selector').addEventListener('click', (e) => {
            this.toggleDropdown('card1-dropdown', e);
        });
        
        document.getElementById('card2-selector').addEventListener('click', (e) => {
            this.toggleDropdown('card2-dropdown', e);
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown-container')) {
                this.closeAllDropdowns();
            }
        });
        
        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectPresetHand(e.target.dataset.hand);
            });
        });
        
        // Action buttons
        document.getElementById('clear-selection').addEventListener('click', () => {
            this.clearSelection();
        });
        
        document.getElementById('random-hand').addEventListener('click', () => {
            this.selectRandomHand();
        });
    }
    
    toggleDropdown(dropdownId, event) {
        event.stopPropagation();
        const dropdown = document.getElementById(dropdownId);
        const button = event.target.closest('.dropdown-btn');
        
        // Close other dropdowns
        document.querySelectorAll('.dropdown-content').forEach(d => {
            if (d.id !== dropdownId) {
                d.classList.remove('show');
                d.previousElementSibling.classList.remove('open');
            }
        });
        
        // Toggle current dropdown
        dropdown.classList.toggle('show');
        button.classList.toggle('open');
        
        if (dropdown.classList.contains('show')) {
            this.updateCardAvailability();
        }
    }
    
    closeAllDropdowns() {
        document.querySelectorAll('.dropdown-content').forEach(dropdown => {
            dropdown.classList.remove('show');
            dropdown.previousElementSibling.classList.remove('open');
        });
    }
    
    selectCard(event) {
        const cardOption = event.currentTarget;
        const rank = cardOption.dataset.rank;
        const suit = cardOption.dataset.suit;
        const cardSlot = cardOption.dataset.cardSlot;
        
        if (cardOption.classList.contains('disabled')) {
            return;
        }
        
        this.selectedCards[cardSlot] = { rank, suit };
        this.updateDisplay();
        this.closeAllDropdowns();
        this.updateCardAvailability();
        this.updateHandInfo();
    }
    
    updateDisplay() {
        this.updateCardDisplay('card1');
        this.updateCardDisplay('card2');
        this.updateDropdownButtonText('card1');
        this.updateDropdownButtonText('card2');
    }
    
    updateCardDisplay(cardSlot) {
        const displayElement = document.getElementById(`${cardSlot}-display`);
        const card = this.selectedCards[cardSlot];
        
        if (card) {
            const suit = this.suits.find(s => s.name === card.suit);
            displayElement.innerHTML = `
                <div class="card-display">
                    <span class="card-rank">${card.rank}</span>
                    <span class="card-suit ${suit.class}">${suit.symbol}</span>
                </div>
            `;
            displayElement.classList.add('has-card');
        } else {
            displayElement.innerHTML = `<span class="card-placeholder">Select ${cardSlot === 'card1' ? 'Card 1' : 'Card 2'}</span>`;
            displayElement.classList.remove('has-card');
        }
    }
    
    updateDropdownButtonText(cardSlot) {
        const button = document.getElementById(`${cardSlot}-selector`);
        const textElement = button.querySelector('.selected-text');
        const card = this.selectedCards[cardSlot];
        
        if (card) {
            const suit = this.suits.find(s => s.name === card.suit);
            textElement.innerHTML = `${card.rank}${suit.symbol}`;
        } else {
            textElement.textContent = 'Select Card';
        }
    }
    
    updateCardAvailability() {
        const allCardOptions = document.querySelectorAll('.card-option');
        
        allCardOptions.forEach(option => {
            const rank = option.dataset.rank;
            const suit = option.dataset.suit;
            const cardSlot = option.dataset.cardSlot;
            
            const isSelected = Object.values(this.selectedCards).some(card => 
                card && card.rank === rank && card.suit === suit
            );
            
            const isCurrentSlotSelection = this.selectedCards[cardSlot] && 
                this.selectedCards[cardSlot].rank === rank && 
                this.selectedCards[cardSlot].suit === suit;
            
            if (isSelected && !isCurrentSlotSelection) {
                option.classList.add('disabled');
            } else {
                option.classList.remove('disabled');
            }
        });
    }
    
    selectPresetHand(handName) {
        const hand = this.presetHands[handName];
        if (hand) {
            this.selectedCards.card1 = hand[0];
            this.selectedCards.card2 = hand[1];
            this.updateDisplay();
            this.updateCardAvailability();
            this.updateHandInfo();
        }
    }
    
    clearSelection() {
        this.selectedCards.card1 = null;
        this.selectedCards.card2 = null;
        this.updateDisplay();
        this.updateCardAvailability();
        this.hideHandInfo();
    }
    
    selectRandomHand() {
        const availableCards = [];
        this.ranks.forEach(rank => {
            this.suits.forEach(suit => {
                availableCards.push({ rank: rank.name, suit: suit.name });
            });
        });
        
        // Shuffle and select two random cards
        this.shuffleArray(availableCards);
        this.selectedCards.card1 = availableCards[0];
        this.selectedCards.card2 = availableCards[1];
        
        this.updateDisplay();
        this.updateCardAvailability();
        this.updateHandInfo();
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    updateHandInfo() {
        const card1 = this.selectedCards.card1;
        const card2 = this.selectedCards.card2;
        
        if (!card1 || !card2) {
            this.hideHandInfo();
            return;
        }
        
        const handInfo = this.analyzeHand(card1, card2);
        this.displayHandInfo(handInfo);
    }
    
    analyzeHand(card1, card2) {
        const rank1 = card1.rank;
        const rank2 = card2.rank;
        const suit1 = card1.suit;
        const suit2 = card2.suit;
        
        const isPair = rank1 === rank2;
        const isSuited = suit1 === suit2;
        
        let handName = '';
        let strength = '';
        
        if (isPair) {
            handName = `${rank1}${rank1}`;
            if (['A', 'K', 'Q', 'J'].includes(rank1)) {
                strength = 'Premium Pair';
            } else if (['10', '9', '8', '7'].includes(rank1)) {
                strength = 'Middle Pair';
            } else {
                strength = 'Small Pair';
            }
        } else {
            const ranks = [rank1, rank2].sort((a, b) => {
                const rankOrder = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
                return rankOrder.indexOf(a) - rankOrder.indexOf(b);
            });
            handName = `${ranks[0]}${ranks[1]}${isSuited ? 's' : 'o'}`;
            
            if (ranks.includes('A') && ['K', 'Q', 'J', '10'].includes(ranks[1])) {
                strength = 'Premium Hand';
            } else if (['K', 'Q', 'J'].every(r => ranks.includes(r) || !['K', 'Q', 'J'].includes(r))) {
                strength = 'Strong Hand';
            } else if (isSuited) {
                strength = 'Suited Hand';
            } else {
                strength = 'Marginal Hand';
            }
        }
        
        return {
            name: handName,
            strength: strength,
            suited: isSuited ? 'Yes' : 'No'
        };
    }
    
    displayHandInfo(handInfo) {
        const handInfoElement = document.getElementById('hand-info');
        const handNameElement = document.getElementById('hand-name');
        const handStrengthElement = document.getElementById('hand-strength');
        const handSuitedElement = document.getElementById('hand-suited');
        
        handNameElement.textContent = handInfo.name;
        handStrengthElement.textContent = handInfo.strength;
        handSuitedElement.textContent = handInfo.suited;
        
        handInfoElement.style.display = 'block';
    }
    
    hideHandInfo() {
        const handInfoElement = document.getElementById('hand-info');
        handInfoElement.style.display = 'none';
    }
}

// Initialize the poker card selector when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PokerCardSelector();
});