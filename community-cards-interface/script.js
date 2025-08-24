class CommunityCardsInterface {
    constructor() {
        this.suits = ['♠', '♥', '♦', '♣'];
        this.ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        this.deck = [];
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
        this.dragPreview = null;
        
        this.initializeDeck();
        this.bindEvents();
        this.updateUndoRedoButtons();
        this.saveState();
    }

    initializeDeck() {
        this.deck = [];
        for (const suit of this.suits) {
            for (const rank of this.ranks) {
                this.deck.push({
                    suit,
                    rank,
                    id: `${rank}-${suit}`,
                    color: (suit === '♥' || suit === '♦') ? 'red' : 'black'
                });
            }
        }
        this.shuffleDeck();
        this.renderDeck();
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    renderDeck() {
        const deckElement = document.getElementById('cardDeck');
        deckElement.innerHTML = '';
        
        this.deck.forEach((card, index) => {
            const cardElement = this.createCardElement(card);
            cardElement.style.animationDelay = `${index * 0.02}s`;
            deckElement.appendChild(cardElement);
        });
    }

    createCardElement(card, isFlipped = false) {
        const cardElement = document.createElement('div');
        cardElement.className = `playing-card ${isFlipped ? 'flipped' : ''}`;
        cardElement.draggable = true;
        cardElement.dataset.cardId = card.id;
        
        cardElement.innerHTML = `
            <div class="card-face card-back"></div>
            <div class="card-face card-front ${card.color}">
                <div class="card-rank">${card.rank}</div>
                <div class="card-suit">${card.suit}</div>
                <div class="card-center">${card.suit}</div>
                <div style="transform: rotate(180deg);">
                    <div class="card-rank">${card.rank}</div>
                    <div class="card-suit">${card.suit}</div>
                </div>
            </div>
        `;
        
        this.addCardEvents(cardElement);
        return cardElement;
    }

    addCardEvents(cardElement) {
        cardElement.addEventListener('dragstart', (e) => this.handleDragStart(e));
        cardElement.addEventListener('dragend', (e) => this.handleDragEnd(e));
        cardElement.addEventListener('click', (e) => this.handleCardClick(e));
        
        // Touch events for mobile
        cardElement.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        cardElement.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        cardElement.addEventListener('touchend', (e) => this.handleTouchEnd(e));
    }

    handleCardClick(e) {
        const card = e.currentTarget;
        if (!card.classList.contains('flipped')) {
            this.flipCard(card);
        }
    }

    flipCard(cardElement) {
        cardElement.classList.add('flipping');
        setTimeout(() => {
            cardElement.classList.toggle('flipped');
            cardElement.classList.remove('flipping');
        }, 300);
    }

    handleDragStart(e) {
        this.draggedCard = e.currentTarget;
        this.draggedCard.classList.add('dragging');
        
        // Create drag preview
        this.createDragPreview(e.currentTarget);
        
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
        
        // Hide default drag image
        const emptyImg = new Image();
        emptyImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
        e.dataTransfer.setDragImage(emptyImg, 0, 0);
    }

    handleDragEnd(e) {
        if (this.draggedCard) {
            this.draggedCard.classList.remove('dragging');
            this.draggedCard = null;
        }
        this.removeDragPreview();
        this.clearDropZones();
    }

    createDragPreview(cardElement) {
        this.dragPreview = cardElement.cloneNode(true);
        this.dragPreview.id = 'dragPreview';
        this.dragPreview.className = 'drag-preview';
        this.dragPreview.style.width = cardElement.offsetWidth + 'px';
        this.dragPreview.style.height = cardElement.offsetHeight + 'px';
        document.body.appendChild(this.dragPreview);
    }

    removeDragPreview() {
        if (this.dragPreview) {
            this.dragPreview.remove();
            this.dragPreview = null;
        }
    }

    bindEvents() {
        // Button events
        document.getElementById('shuffleBtn').addEventListener('click', () => this.shuffleAndDeal());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetBoard());
        document.getElementById('undoBtn').addEventListener('click', () => this.undo());
        document.getElementById('redoBtn').addEventListener('click', () => this.redo());
        document.getElementById('saveBtn').addEventListener('click', () => this.showSaveModal());
        document.getElementById('loadBtn').addEventListener('click', () => this.showLoadModal());

        // Modal events
        document.getElementById('modalCancelBtn').addEventListener('click', () => this.hideModal());
        document.getElementById('modalConfirmBtn').addEventListener('click', () => this.handleModalConfirm());

        // Drag and drop for card slots
        const cardSlots = document.querySelectorAll('.card-slot');
        cardSlots.forEach(slot => {
            slot.addEventListener('dragover', (e) => this.handleDragOver(e));
            slot.addEventListener('drop', (e) => this.handleDrop(e));
            slot.addEventListener('dragenter', (e) => this.handleDragEnter(e));
            slot.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        });

        // Mouse move for drag preview
        document.addEventListener('mousemove', (e) => this.updateDragPreview(e));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    handleDragEnter(e) {
        e.preventDefault();
        if (e.currentTarget.classList.contains('card-slot') && !e.currentTarget.hasChildNodes()) {
            e.currentTarget.classList.add('drop-zone');
        }
    }

    handleDragLeave(e) {
        if (e.currentTarget.classList.contains('card-slot')) {
            e.currentTarget.classList.remove('drop-zone');
        }
    }

    handleDrop(e) {
        e.preventDefault();
        const slot = e.currentTarget;
        slot.classList.remove('drop-zone');
        
        if (this.draggedCard && !slot.hasChildNodes()) {
            this.saveState();
            
            const cardId = this.draggedCard.dataset.cardId;
            const card = this.deck.find(c => c.id === cardId);
            const position = slot.dataset.position;
            
            // Remove card from deck
            const cardIndex = this.deck.findIndex(c => c.id === cardId);
            if (cardIndex > -1) {
                this.deck.splice(cardIndex, 1);
            }
            
            // Add to community cards
            this.communityCards[position] = card;
            
            // Create new card element for the slot
            const newCard = this.createCardElement(card, true);
            newCard.classList.add('dealing');
            slot.appendChild(newCard);
            slot.classList.add('occupied');
            
            // Remove original card from deck
            this.draggedCard.remove();
            
            this.renderDeck();
        }
        
        this.clearDropZones();
    }

    clearDropZones() {
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.remove('drop-zone');
        });
    }

    updateDragPreview(e) {
        if (this.dragPreview) {
            this.dragPreview.style.left = (e.clientX - 35) + 'px';
            this.dragPreview.style.top = (e.clientY - 49) + 'px';
        }
    }

    shuffleAndDeal() {
        this.resetBoard();
        
        // Animate deck shuffle
        const deckElement = document.getElementById('cardDeck');
        deckElement.classList.add('shuffling');
        
        setTimeout(() => {
            deckElement.classList.remove('shuffling');
            this.shuffleDeck();
            this.renderDeck();
            
            // Auto-deal community cards
            setTimeout(() => this.dealCommunityCards(), 500);
        }, 500);
    }

    dealCommunityCards() {
        const positions = ['flop-1', 'flop-2', 'flop-3', 'turn', 'river'];
        let dealIndex = 0;
        
        const dealNext = () => {
            if (dealIndex < positions.length && this.deck.length > 0) {
                const position = positions[dealIndex];
                const card = this.deck.shift();
                
                this.communityCards[position] = card;
                
                const slot = document.querySelector(`[data-position="${position}"]`);
                const cardElement = this.createCardElement(card, true);
                cardElement.classList.add('dealing');
                
                slot.appendChild(cardElement);
                slot.classList.add('occupied');
                
                dealIndex++;
                setTimeout(dealNext, 200);
            }
        };
        
        this.saveState();
        dealNext();
        this.renderDeck();
    }

    resetBoard() {
        this.saveState();
        
        // Clear community cards
        Object.keys(this.communityCards).forEach(position => {
            this.communityCards[position] = null;
            const slot = document.querySelector(`[data-position="${position}"]`);
            slot.innerHTML = '';
            slot.classList.remove('occupied');
        });
        
        // Reset deck
        this.initializeDeck();
    }

    saveState() {
        const state = {
            deck: [...this.deck],
            communityCards: {...this.communityCards},
            timestamp: Date.now()
        };
        
        // Remove future history if we're not at the end
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(state);
        this.historyIndex++;
        
        // Limit history size
        if (this.history.length > 50) {
            this.history.shift();
            this.historyIndex--;
        }
        
        this.updateUndoRedoButtons();
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.restoreState(this.history[this.historyIndex]);
            this.updateUndoRedoButtons();
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.restoreState(this.history[this.historyIndex]);
            this.updateUndoRedoButtons();
        }
    }

    restoreState(state) {
        this.deck = [...state.deck];
        this.communityCards = {...state.communityCards};
        
        this.renderDeck();
        this.renderCommunityCards();
    }

    renderCommunityCards() {
        Object.keys(this.communityCards).forEach(position => {
            const slot = document.querySelector(`[data-position="${position}"]`);
            slot.innerHTML = '';
            slot.classList.remove('occupied');
            
            const card = this.communityCards[position];
            if (card) {
                const cardElement = this.createCardElement(card, true);
                slot.appendChild(cardElement);
                slot.classList.add('occupied');
            }
        });
    }

    updateUndoRedoButtons() {
        const undoBtn = document.getElementById('undoBtn');
        const redoBtn = document.getElementById('redoBtn');
        
        undoBtn.disabled = this.historyIndex <= 0;
        redoBtn.disabled = this.historyIndex >= this.history.length - 1;
    }

    showSaveModal() {
        const modal = document.getElementById('stateModal');
        const title = document.getElementById('modalTitle');
        const input = document.getElementById('stateNameInput');
        const confirmBtn = document.getElementById('modalConfirmBtn');
        
        title.textContent = 'Save Board State';
        input.classList.remove('hidden');
        input.value = `Board State ${new Date().toLocaleString()}`;
        confirmBtn.textContent = 'Save';
        confirmBtn.onclick = () => this.saveNamedState();
        
        modal.classList.remove('hidden');
        input.focus();
        input.select();
    }

    showLoadModal() {
        const modal = document.getElementById('stateModal');
        const title = document.getElementById('modalTitle');
        const input = document.getElementById('stateNameInput');
        const confirmBtn = document.getElementById('modalConfirmBtn');
        const statesList = document.getElementById('statesList');
        
        title.textContent = 'Load Board State';
        input.classList.add('hidden');
        confirmBtn.textContent = 'Load';
        confirmBtn.onclick = () => this.loadSelectedState();
        
        this.renderSavedStates();
        modal.classList.remove('hidden');
    }

    saveNamedState() {
        const name = document.getElementById('stateNameInput').value.trim();
        if (!name) return;
        
        const savedStates = this.getSavedStates();
        const state = {
            name,
            deck: [...this.deck],
            communityCards: {...this.communityCards},
            timestamp: Date.now()
        };
        
        savedStates[name] = state;
        localStorage.setItem('communityCardsStates', JSON.stringify(savedStates));
        
        this.hideModal();
    }

    loadSelectedState() {
        const selected = document.querySelector('.state-item.selected');
        if (!selected) return;
        
        const stateName = selected.dataset.stateName;
        const savedStates = this.getSavedStates();
        const state = savedStates[stateName];
        
        if (state) {
            this.deck = [...state.deck];
            this.communityCards = {...state.communityCards};
            this.renderDeck();
            this.renderCommunityCards();
            this.saveState();
        }
        
        this.hideModal();
    }

    getSavedStates() {
        const saved = localStorage.getItem('communityCardsStates');
        return saved ? JSON.parse(saved) : {};
    }

    renderSavedStates() {
        const statesList = document.getElementById('statesList');
        const savedStates = this.getSavedStates();
        
        statesList.innerHTML = '';
        
        Object.keys(savedStates).forEach(name => {
            const state = savedStates[name];
            const item = document.createElement('div');
            item.className = 'state-item';
            item.dataset.stateName = name;
            
            item.innerHTML = `
                <div class="state-name">${name}</div>
                <div class="state-date">${new Date(state.timestamp).toLocaleString()}</div>
            `;
            
            item.addEventListener('click', () => {
                document.querySelectorAll('.state-item').forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
            });
            
            statesList.appendChild(item);
        });
    }

    hideModal() {
        document.getElementById('stateModal').classList.add('hidden');
    }

    handleModalConfirm() {
        // This will be overridden by the specific modal functions
    }

    handleKeyboard(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
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
                    this.resetBoard();
                    break;
                case 's':
                    e.preventDefault();
                    this.showSaveModal();
                    break;
            }
        }
        
        if (e.key === 'Escape') {
            this.hideModal();
        }
    }

    // Touch support for mobile
    handleTouchStart(e) {
        this.touchStarted = true;
        this.startTouch = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    }

    handleTouchMove(e) {
        if (!this.touchStarted) return;
        
        e.preventDefault();
        const touch = e.touches[0];
        
        if (!this.draggedCard) {
            this.draggedCard = e.currentTarget;
            this.draggedCard.classList.add('dragging');
            this.createDragPreview(e.currentTarget);
        }
        
        if (this.dragPreview) {
            this.dragPreview.style.left = (touch.clientX - 35) + 'px';
            this.dragPreview.style.top = (touch.clientY - 49) + 'px';
        }
    }

    handleTouchEnd(e) {
        if (!this.touchStarted) return;
        
        this.touchStarted = false;
        
        const touch = e.changedTouches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        const slot = element?.closest('.card-slot');
        
        if (slot && this.draggedCard && !slot.hasChildNodes()) {
            // Simulate drop
            this.handleDrop({ 
                preventDefault: () => {}, 
                currentTarget: slot 
            });
        }
        
        this.handleDragEnd(e);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CommunityCardsInterface();
});