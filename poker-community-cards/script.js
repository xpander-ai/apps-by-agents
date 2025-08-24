class PokerCommunityCards {
    constructor() {
        this.suits = ['♠', '♣', '♥', '♦'];
        this.values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        this.deck = this.createDeck();
        this.boardState = {
            'flop-1': null,
            'flop-2': null,
            'flop-3': null,
            'turn': null,
            'river': null
        };
        this.history = [];
        this.historyIndex = -1;
        this.usedCards = new Set();
        
        this.init();
    }

    createDeck() {
        const deck = [];
        this.suits.forEach(suit => {
            this.values.forEach(value => {
                deck.push({ value, suit, id: `${value}${suit}` });
            });
        });
        return deck;
    }

    init() {
        this.renderDeck();
        this.setupEventListeners();
        this.saveState();
        this.updateCardCount();
    }

    renderDeck() {
        const deckElement = document.getElementById('cardDeck');
        deckElement.innerHTML = '';

        this.deck.forEach(card => {
            const cardElement = this.createCardElement(card);
            deckElement.appendChild(cardElement);
        });
    }

    createCardElement(card) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'playing-card';
        cardDiv.draggable = true;
        cardDiv.dataset.cardId = card.id;
        
        const isRed = card.suit === '♥' || card.suit === '♦';
        
        cardDiv.innerHTML = `
            <div class="card-face">
                <div class="card-value ${isRed ? 'red' : 'black'}">${card.value}</div>
                <div class="card-suit ${isRed ? 'red' : 'black'}">${card.suit}</div>
            </div>
            <div class="card-back"></div>
        `;

        if (this.usedCards.has(card.id)) {
            cardDiv.classList.add('used');
        }

        return cardDiv;
    }

    setupEventListeners() {
        // Drag and drop for cards
        const cardDeck = document.getElementById('cardDeck');
        cardDeck.addEventListener('dragstart', this.handleDragStart.bind(this));
        cardDeck.addEventListener('dragend', this.handleDragEnd.bind(this));

        // Drop zones
        const cardSlots = document.querySelectorAll('.card-slot');
        cardSlots.forEach(slot => {
            slot.addEventListener('dragover', this.handleDragOver.bind(this));
            slot.addEventListener('dragleave', this.handleDragLeave.bind(this));
            slot.addEventListener('drop', this.handleDrop.bind(this));
            slot.addEventListener('click', this.handleSlotClick.bind(this));
        });

        // Control buttons
        document.getElementById('dealBtn').addEventListener('click', this.dealRandomCards.bind(this));
        document.getElementById('clearBtn').addEventListener('click', this.clearBoard.bind(this));
        document.getElementById('undoBtn').addEventListener('click', this.undo.bind(this));
        document.getElementById('redoBtn').addEventListener('click', this.redo.bind(this));
        document.getElementById('shuffleBtn').addEventListener('click', this.shuffleDeck.bind(this));
        document.getElementById('saveBtn').addEventListener('click', () => this.openModal('save'));
        document.getElementById('loadBtn').addEventListener('click', () => this.openModal('load'));

        // Modal events
        document.getElementById('modalClose').addEventListener('click', this.closeModal.bind(this));
        document.getElementById('modalCancel').addEventListener('click', this.closeModal.bind(this));
        document.getElementById('modalAction').addEventListener('click', this.handleModalAction.bind(this));

        // Close modal on outside click
        document.getElementById('saveLoadModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeModal();
            }
        });
    }

    handleDragStart(e) {
        if (!e.target.classList.contains('playing-card') || e.target.classList.contains('used')) {
            e.preventDefault();
            return;
        }

        e.target.classList.add('dragging');
        e.dataTransfer.setData('text/plain', e.target.dataset.cardId);
        e.dataTransfer.effectAllowed = 'move';
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        e.currentTarget.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');

        const cardId = e.dataTransfer.getData('text/plain');
        const slot = e.currentTarget;
        const position = slot.dataset.position;

        if (this.boardState[position]) {
            this.showMessage('Slot is already occupied!', 'error');
            return;
        }

        this.placeCard(cardId, position);
    }

    handleSlotClick(e) {
        const slot = e.currentTarget;
        const position = slot.dataset.position;
        
        if (this.boardState[position]) {
            this.removeCard(position);
        }
    }

    placeCard(cardId, position) {
        this.saveState();
        
        const card = this.deck.find(c => c.id === cardId);
        if (!card) return;

        this.boardState[position] = card;
        this.usedCards.add(cardId);
        
        this.renderCardInSlot(card, position);
        this.updateCardInDeck(cardId);
        this.updateCardCount();
        this.animateCardFlip(position);
    }

    removeCard(position) {
        const card = this.boardState[position];
        if (!card) return;

        this.saveState();
        
        this.boardState[position] = null;
        this.usedCards.delete(card.id);
        
        this.clearSlot(position);
        this.updateCardInDeck(card.id);
        this.updateCardCount();
    }

    renderCardInSlot(card, position) {
        const slot = document.querySelector(`[data-position="${position}"]`);
        const isRed = card.suit === '♥' || card.suit === '♦';
        
        slot.innerHTML = `
            <div class="playing-card">
                <div class="card-face">
                    <div class="card-value ${isRed ? 'red' : 'black'}">${card.value}</div>
                    <div class="card-suit ${isRed ? 'red' : 'black'}">${card.suit}</div>
                </div>
            </div>
        `;
        
        slot.classList.add('occupied');
        slot.dataset.card = card.id;
    }

    clearSlot(position) {
        const slot = document.querySelector(`[data-position="${position}"]`);
        slot.innerHTML = '<div class="slot-placeholder">Drag card here</div>';
        slot.classList.remove('occupied');
        slot.dataset.card = '';
    }

    updateCardInDeck(cardId) {
        const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
        if (cardElement) {
            if (this.usedCards.has(cardId)) {
                cardElement.classList.add('used');
            } else {
                cardElement.classList.remove('used');
            }
        }
    }

    animateCardFlip(position) {
        const slot = document.querySelector(`[data-position="${position}"]`);
        const cardElement = slot.querySelector('.playing-card');
        if (cardElement) {
            cardElement.classList.add('flipping');
            setTimeout(() => {
                cardElement.classList.remove('flipping');
            }, 600);
        }
    }

    dealRandomCards() {
        this.saveState();
        this.clearBoard(false);
        
        const availableCards = this.deck.filter(card => !this.usedCards.has(card.id));
        if (availableCards.length < 5) {
            this.showMessage('Not enough cards available!', 'error');
            return;
        }

        const shuffledCards = [...availableCards].sort(() => Math.random() - 0.5);
        const positions = ['flop-1', 'flop-2', 'flop-3', 'turn', 'river'];
        
        positions.forEach((position, index) => {
            setTimeout(() => {
                this.placeCard(shuffledCards[index].id, position);
            }, index * 300);
        });
    }

    shuffleDeck() {
        const deckElement = document.getElementById('cardDeck');
        deckElement.classList.add('shuffling');
        
        setTimeout(() => {
            this.deck.sort(() => Math.random() - 0.5);
            this.renderDeck();
            deckElement.classList.remove('shuffling');
            this.showMessage('Deck shuffled!', 'success');
        }, 1000);
    }

    clearBoard(saveState = true) {
        if (saveState) this.saveState();
        
        Object.keys(this.boardState).forEach(position => {
            const card = this.boardState[position];
            if (card) {
                this.usedCards.delete(card.id);
                this.boardState[position] = null;
                this.clearSlot(position);
                this.updateCardInDeck(card.id);
            }
        });
        
        this.updateCardCount();
    }

    saveState() {
        const state = {
            boardState: JSON.parse(JSON.stringify(this.boardState)),
            usedCards: new Set(this.usedCards)
        };
        
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(state);
        this.historyIndex++;
        
        if (this.history.length > 20) {
            this.history.shift();
            this.historyIndex--;
        }
        
        this.updateUndoRedoButtons();
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.restoreState(this.history[this.historyIndex]);
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.restoreState(this.history[this.historyIndex]);
        }
    }

    restoreState(state) {
        this.boardState = JSON.parse(JSON.stringify(state.boardState));
        this.usedCards = new Set(state.usedCards);
        
        Object.keys(this.boardState).forEach(position => {
            const card = this.boardState[position];
            if (card) {
                this.renderCardInSlot(card, position);
            } else {
                this.clearSlot(position);
            }
        });
        
        this.renderDeck();
        this.updateCardCount();
        this.updateUndoRedoButtons();
    }

    updateUndoRedoButtons() {
        document.getElementById('undoBtn').disabled = this.historyIndex <= 0;
        document.getElementById('redoBtn').disabled = this.historyIndex >= this.history.length - 1;
    }

    updateCardCount() {
        const remainingCards = this.deck.length - this.usedCards.size;
        document.getElementById('cardsRemaining').textContent = `${remainingCards} cards remaining`;
    }

    openModal(action) {
        const modal = document.getElementById('saveLoadModal');
        const title = document.getElementById('modalTitle');
        const saveSection = document.getElementById('saveSection');
        const loadSection = document.getElementById('loadSection');
        const actionButton = document.getElementById('modalAction');
        
        modal.classList.remove('hidden');
        
        if (action === 'save') {
            title.textContent = 'Save Board State';
            saveSection.style.display = 'block';
            loadSection.style.display = 'none';
            actionButton.textContent = 'Save';
            actionButton.dataset.action = 'save';
        } else {
            title.textContent = 'Load Board State';
            saveSection.style.display = 'none';
            loadSection.style.display = 'block';
            actionButton.textContent = 'Load';
            actionButton.dataset.action = 'load';
            this.populateLoadOptions();
        }
    }

    closeModal() {
        document.getElementById('saveLoadModal').classList.add('hidden');
    }

    handleModalAction() {
        const action = document.getElementById('modalAction').dataset.action;
        
        if (action === 'save') {
            this.saveToSlot();
        } else {
            this.loadFromSlot();
        }
    }

    saveToSlot() {
        const slot = document.getElementById('saveSlotSelect').value;
        const name = document.getElementById('saveSlotName').value || `Save ${new Date().toLocaleString()}`;
        
        const saveData = {
            name,
            timestamp: Date.now(),
            boardState: this.boardState,
            usedCards: Array.from(this.usedCards)
        };
        
        localStorage.setItem(`pokerSave_${slot}`, JSON.stringify(saveData));
        this.showMessage('Board state saved!', 'success');
        this.closeModal();
    }

    loadFromSlot() {
        const slot = document.getElementById('loadSlotSelect').value;
        if (!slot) return;
        
        const saveData = localStorage.getItem(`pokerSave_${slot}`);
        if (!saveData) {
            this.showMessage('No save data found!', 'error');
            return;
        }
        
        try {
            const data = JSON.parse(saveData);
            this.saveState();
            
            this.boardState = data.boardState;
            this.usedCards = new Set(data.usedCards);
            
            Object.keys(this.boardState).forEach(position => {
                const card = this.boardState[position];
                if (card) {
                    this.renderCardInSlot(card, position);
                } else {
                    this.clearSlot(position);
                }
            });
            
            this.renderDeck();
            this.updateCardCount();
            this.showMessage('Board state loaded!', 'success');
            this.closeModal();
        } catch (error) {
            this.showMessage('Error loading save data!', 'error');
        }
    }

    populateLoadOptions() {
        const select = document.getElementById('loadSlotSelect');
        select.innerHTML = '';
        
        ['slot1', 'slot2', 'slot3'].forEach(slot => {
            const saveData = localStorage.getItem(`pokerSave_${slot}`);
            const option = document.createElement('option');
            option.value = slot;
            
            if (saveData) {
                try {
                    const data = JSON.parse(saveData);
                    option.textContent = `${slot.toUpperCase()}: ${data.name}`;
                } catch {
                    option.textContent = `${slot.toUpperCase()}: (Corrupted)`;
                }
            } else {
                option.textContent = `${slot.toUpperCase()}: (Empty)`;
                option.disabled = true;
            }
            
            select.appendChild(option);
        });
    }

    showMessage(text, type = 'success') {
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new PokerCommunityCards();
});