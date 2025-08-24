class PokerCommunityCards {
    constructor() {
        this.suits = ['♠', '♥', '♦', '♣'];
        this.ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        this.deck = this.generateDeck();
        this.availableCards = [...this.deck];
        this.communityCards = {
            'flop-1': null,
            'flop-2': null,
            'flop-3': null,
            'turn': null,
            'river': null
        };
        this.history = [];
        this.historyIndex = -1;
        this.draggedCard = null;
        
        this.init();
    }

    generateDeck() {
        const deck = [];
        for (const suit of this.suits) {
            for (const rank of this.ranks) {
                deck.push({
                    rank,
                    suit,
                    id: `${rank}-${suit}`,
                    color: (suit === '♥' || suit === '♦') ? 'red' : 'black'
                });
            }
        }
        return deck;
    }

    init() {
        this.renderDeck();
        this.attachEventListeners();
        this.updateStatus();
        this.saveState();
    }

    renderDeck() {
        const deckContainer = document.getElementById('card-deck');
        deckContainer.innerHTML = '';

        this.availableCards.forEach(card => {
            const cardElement = this.createCardElement(card);
            deckContainer.appendChild(cardElement);
        });

        this.updateCardsRemaining();
    }

    createCardElement(card, isInSlot = false) {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${card.color}${isInSlot ? ' in-slot' : ''}`;
        cardElement.draggable = true;
        cardElement.dataset.cardId = card.id;
        
        cardElement.innerHTML = `
            <div class="card-rank">${card.rank}</div>
            <div class="card-suit">${card.suit}</div>
        `;

        this.attachCardEvents(cardElement, card, isInSlot);
        return cardElement;
    }

    attachCardEvents(cardElement, card, isInSlot) {
        cardElement.addEventListener('dragstart', (e) => {
            this.draggedCard = card;
            cardElement.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', card.id);
        });

        cardElement.addEventListener('dragend', () => {
            cardElement.classList.remove('dragging');
            this.draggedCard = null;
        });

        if (isInSlot) {
            cardElement.addEventListener('click', () => {
                this.returnCardToDeck(card);
            });

            cardElement.addEventListener('dblclick', () => {
                this.addCardFlipAnimation(cardElement);
            });
        }
    }

    attachEventListeners() {
        // Button event listeners
        document.getElementById('deal-btn').addEventListener('click', () => this.dealRandomCards());
        document.getElementById('shuffle-btn').addEventListener('click', () => this.shuffleDeck());
        document.getElementById('clear-btn').addEventListener('click', () => this.clearBoard());
        document.getElementById('undo-btn').addEventListener('click', () => this.undo());
        document.getElementById('redo-btn').addEventListener('click', () => this.redo());
        document.getElementById('save-btn').addEventListener('click', () => this.saveToFile());
        document.getElementById('load-btn').addEventListener('click', () => this.loadFromFile());

        // Drop zone event listeners
        const cardSlots = document.querySelectorAll('.card-slot');
        cardSlots.forEach(slot => {
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
                
                if (this.draggedCard && !slot.classList.contains('occupied')) {
                    this.placeCardInSlot(this.draggedCard, slot.dataset.position);
                }
            });
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
                    case 's':
                        e.preventDefault();
                        this.saveToFile();
                        break;
                    case 'o':
                        e.preventDefault();
                        this.loadFromFile();
                        break;
                }
            } else if (e.key === 'Delete' || e.key === 'Backspace') {
                this.clearBoard();
            }
        });
    }

    placeCardInSlot(card, position) {
        // Save state for undo functionality
        this.saveState();

        // Remove card from available cards
        this.availableCards = this.availableCards.filter(c => c.id !== card.id);
        
        // If there was already a card in this slot, return it to deck
        if (this.communityCards[position]) {
            this.availableCards.push(this.communityCards[position]);
        }

        // Place new card
        this.communityCards[position] = card;

        // Update visual representation
        this.updateSlot(position, card);
        this.renderDeck();
        this.updateStatus();
        this.addParticleEffect(position);
        this.showToast('Card placed successfully!', 'success');
    }

    updateSlot(position, card) {
        const slot = document.querySelector(`[data-position="${position}"]`);
        slot.innerHTML = '';
        slot.classList.add('occupied');
        
        if (card) {
            const cardElement = this.createCardElement(card, true);
            cardElement.classList.add('dealing');
            slot.appendChild(cardElement);
        } else {
            slot.classList.remove('occupied');
            slot.innerHTML = '<span class="slot-label">' + this.getSlotNumber(position) + '</span>';
        }
    }

    getSlotNumber(position) {
        const slotNumbers = {
            'flop-1': '1',
            'flop-2': '2', 
            'flop-3': '3',
            'turn': '4',
            'river': '5'
        };
        return slotNumbers[position] || '';
    }

    returnCardToDeck(card) {
        this.saveState();

        // Find which position this card is in
        const position = Object.keys(this.communityCards).find(pos => 
            this.communityCards[pos]?.id === card.id
        );

        if (position) {
            this.communityCards[position] = null;
            this.availableCards.push(card);
            this.updateSlot(position, null);
            this.renderDeck();
            this.updateStatus();
            this.showToast('Card returned to deck', 'success');
        }
    }

    dealRandomCards() {
        this.saveState();
        this.addShuffleAnimation();

        const positions = ['flop-1', 'flop-2', 'flop-3', 'turn', 'river'];
        let dealIndex = 0;

        const dealNext = () => {
            if (dealIndex < positions.length && this.availableCards.length > 0) {
                const position = positions[dealIndex];
                
                // If slot is already occupied, return card to deck first
                if (this.communityCards[position]) {
                    this.availableCards.push(this.communityCards[position]);
                }

                // Deal random card
                const randomIndex = Math.floor(Math.random() * this.availableCards.length);
                const card = this.availableCards.splice(randomIndex, 1)[0];
                this.communityCards[position] = card;
                
                this.updateSlot(position, card);
                this.addParticleEffect(position);
                
                dealIndex++;
                setTimeout(dealNext, 300);
            } else {
                this.renderDeck();
                this.updateStatus();
                this.showToast('Random cards dealt!', 'success');
            }
        };

        setTimeout(dealNext, 500);
    }

    shuffleDeck() {
        this.addShuffleAnimation();
        
        // Fisher-Yates shuffle
        for (let i = this.availableCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.availableCards[i], this.availableCards[j]] = [this.availableCards[j], this.availableCards[i]];
        }

        setTimeout(() => {
            this.renderDeck();
            this.showToast('Deck shuffled!', 'success');
        }, 1000);
    }

    clearBoard() {
        this.saveState();

        // Return all cards to deck
        Object.keys(this.communityCards).forEach(position => {
            if (this.communityCards[position]) {
                this.availableCards.push(this.communityCards[position]);
                this.communityCards[position] = null;
                this.updateSlot(position, null);
            }
        });

        this.renderDeck();
        this.updateStatus();
        this.showToast('Board cleared', 'warning');
    }

    saveState() {
        const state = {
            communityCards: JSON.parse(JSON.stringify(this.communityCards)),
            availableCards: [...this.availableCards]
        };

        // Remove any states after current index (for redo functionality)
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(state);
        this.historyIndex++;

        // Limit history size
        if (this.history.length > 50) {
            this.history.shift();
            this.historyIndex--;
        }

        this.updateHistoryButtons();
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.restoreState(this.history[this.historyIndex]);
            this.showToast('Action undone', 'success');
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.restoreState(this.history[this.historyIndex]);
            this.showToast('Action redone', 'success');
        }
    }

    restoreState(state) {
        this.communityCards = JSON.parse(JSON.stringify(state.communityCards));
        this.availableCards = [...state.availableCards];

        // Update visual representation
        Object.keys(this.communityCards).forEach(position => {
            this.updateSlot(position, this.communityCards[position]);
        });

        this.renderDeck();
        this.updateStatus();
        this.updateHistoryButtons();
    }

    updateHistoryButtons() {
        document.getElementById('undo-btn').disabled = this.historyIndex <= 0;
        document.getElementById('redo-btn').disabled = this.historyIndex >= this.history.length - 1;
    }

    saveToFile() {
        const gameState = {
            communityCards: this.communityCards,
            availableCards: this.availableCards,
            timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(gameState, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `poker-state-${new Date().getTime()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showToast('Game state saved!', 'success');
    }

    loadFromFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const gameState = JSON.parse(e.target.result);
                        this.loadGameState(gameState);
                        this.showToast('Game state loaded!', 'success');
                    } catch (error) {
                        this.showToast('Error loading file!', 'error');
                    }
                };
                reader.readAsText(file);
            }
        });
        
        input.click();
    }

    loadGameState(gameState) {
        this.saveState();
        
        this.communityCards = gameState.communityCards || {};
        this.availableCards = gameState.availableCards || [...this.deck];

        // Update visual representation
        Object.keys(this.communityCards).forEach(position => {
            this.updateSlot(position, this.communityCards[position]);
        });

        this.renderDeck();
        this.updateStatus();
    }

    updateCardsRemaining() {
        document.getElementById('cards-remaining').textContent = this.availableCards.length;
    }

    updateStatus() {
        this.updateCardsRemaining();
        
        const communityCount = Object.values(this.communityCards).filter(card => card !== null).length;
        document.getElementById('action-status').textContent = 
            `Community cards: ${communityCount}/5 | Ready to play`;
        
        document.getElementById('history-status').textContent = 
            `History: ${this.history.length} actions`;
    }

    addCardFlipAnimation(cardElement) {
        cardElement.classList.add('flipping');
        setTimeout(() => {
            cardElement.classList.remove('flipping');
        }, 600);
    }

    addShuffleAnimation() {
        const deckContainer = document.getElementById('card-deck');
        const cards = deckContainer.querySelectorAll('.card');
        
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('shuffle-animation');
                setTimeout(() => {
                    card.classList.remove('shuffle-animation');
                }, 1000);
            }, index * 50);
        });
    }

    addParticleEffect(position) {
        const slot = document.querySelector(`[data-position="${position}"]`);
        const rect = slot.getBoundingClientRect();
        const animationLayer = document.getElementById('animation-layer');

        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = (rect.left + rect.width / 2) + 'px';
            particle.style.top = (rect.top + rect.height / 2) + 'px';
            particle.style.transform = `translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px)`;
            
            animationLayer.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
    }

    showToast(message, type = 'success') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'slideInRight 0.3s ease-out reverse';
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PokerCommunityCards();
});

// Add touch support for mobile devices
document.addEventListener('DOMContentLoaded', () => {
    let touchCard = null;
    let touchOffset = { x: 0, y: 0 };

    document.addEventListener('touchstart', (e) => {
        const card = e.target.closest('.card');
        if (card && !card.classList.contains('in-slot')) {
            touchCard = card;
            const touch = e.touches[0];
            const rect = card.getBoundingClientRect();
            touchOffset.x = touch.clientX - rect.left;
            touchOffset.y = touch.clientY - rect.top;
            card.style.position = 'fixed';
            card.style.zIndex = '10000';
            card.style.pointerEvents = 'none';
            e.preventDefault();
        }
    });

    document.addEventListener('touchmove', (e) => {
        if (touchCard) {
            const touch = e.touches[0];
            touchCard.style.left = (touch.clientX - touchOffset.x) + 'px';
            touchCard.style.top = (touch.clientY - touchOffset.y) + 'px';
            e.preventDefault();
        }
    });

    document.addEventListener('touchend', (e) => {
        if (touchCard) {
            const touch = e.changedTouches[0];
            const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
            const slot = elementBelow?.closest('.card-slot');
            
            if (slot && !slot.classList.contains('occupied')) {
                // Simulate drop
                const cardId = touchCard.dataset.cardId;
                const app = window.pokerApp;
                if (app) {
                    const card = app.availableCards.find(c => c.id === cardId);
                    if (card) {
                        app.placeCardInSlot(card, slot.dataset.position);
                    }
                }
            }
            
            // Reset card position
            touchCard.style.position = '';
            touchCard.style.zIndex = '';
            touchCard.style.left = '';
            touchCard.style.top = '';
            touchCard.style.pointerEvents = '';
            touchCard = null;
        }
    });
});

// Store app instance globally for touch events
window.addEventListener('DOMContentLoaded', () => {
    window.pokerApp = new PokerCommunityCards();
});