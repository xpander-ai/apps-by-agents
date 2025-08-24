class PokerOddsCalculator {
    constructor() {
        this.suits = ['♠', '♥', '♦', '♣'];
        this.ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        this.deck = this.createDeck();
        this.playerCards = [];
        this.communityCards = [];
        this.playerCount = 2;
        this.results = null;
    }

    createDeck() {
        const deck = [];
        for (const suit of this.suits) {
            for (const rank of this.ranks) {
                deck.push({ rank, suit, value: this.getCardValue(rank) });
            }
        }
        return deck;
    }

    getCardValue(rank) {
        if (rank === 'A') return 14;
        if (rank === 'K') return 13;
        if (rank === 'Q') return 12;
        if (rank === 'J') return 11;
        return parseInt(rank);
    }

    parseCard(cardString) {
        const rank = cardString.slice(0, -1);
        const suit = cardString.slice(-1);
        return { rank, suit, value: this.getCardValue(rank) };
    }

    setPlayerCards(cards) {
        this.playerCards = cards.map(card => this.parseCard(card));
    }

    setCommunityCards(cards) {
        this.communityCards = cards.map(card => this.parseCard(card));
    }

    setPlayerCount(count) {
        this.playerCount = count;
    }

    calculateOdds() {
        const usedCards = [...this.playerCards, ...this.communityCards];
        const remainingDeck = this.deck.filter(card => 
            !usedCards.some(used => used.rank === card.rank && used.suit === card.suit)
        );

        const totalSimulations = 10000;
        let wins = 0;
        let ties = 0;

        for (let i = 0; i < totalSimulations; i++) {
            const result = this.simulateHand(remainingDeck);
            if (result === 'win') wins++;
            else if (result === 'tie') ties++;
        }

        this.results = {
            winPercentage: ((wins / totalSimulations) * 100).toFixed(2),
            tiePercentage: ((ties / totalSimulations) * 100).toFixed(2),
            losePercentage: (((totalSimulations - wins - ties) / totalSimulations) * 100).toFixed(2),
            totalSimulations
        };

        return this.results;
    }

    simulateHand(remainingDeck) {
        const shuffled = [...remainingDeck];
        this.shuffleArray(shuffled);

        const neededCommunityCards = 5 - this.communityCards.length;
        const simulatedCommunityCards = [...this.communityCards, ...shuffled.slice(0, neededCommunityCards)];
        
        const cardsUsed = neededCommunityCards;
        const playerHand = this.getBestHand([...this.playerCards, ...simulatedCommunityCards]);

        let bestOpponentHand = null;
        let opponentCardIndex = cardsUsed;

        for (let opponent = 1; opponent < this.playerCount; opponent++) {
            const opponentCards = shuffled.slice(opponentCardIndex, opponentCardIndex + 2);
            opponentCardIndex += 2;
            const opponentHand = this.getBestHand([...opponentCards, ...simulatedCommunityCards]);
            
            if (!bestOpponentHand || this.compareHands(opponentHand, bestOpponentHand) > 0) {
                bestOpponentHand = opponentHand;
            }
        }

        const comparison = this.compareHands(playerHand, bestOpponentHand);
        if (comparison > 0) return 'win';
        else if (comparison === 0) return 'tie';
        else return 'lose';
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    getBestHand(cards) {
        const combinations = this.getCombinations(cards, 5);
        let bestHand = null;
        let bestRank = -1;

        for (const combo of combinations) {
            const handRank = this.evaluateHand(combo);
            if (handRank.rank > bestRank) {
                bestRank = handRank.rank;
                bestHand = { cards: combo, ...handRank };
            }
        }

        return bestHand;
    }

    getCombinations(array, r) {
        const combinations = [];
        
        function combine(start, combo) {
            if (combo.length === r) {
                combinations.push([...combo]);
                return;
            }
            
            for (let i = start; i < array.length; i++) {
                combo.push(array[i]);
                combine(i + 1, combo);
                combo.pop();
            }
        }
        
        combine(0, []);
        return combinations;
    }

    evaluateHand(cards) {
        const sortedCards = [...cards].sort((a, b) => b.value - a.value);
        const suits = cards.map(card => card.suit);
        const values = sortedCards.map(card => card.value);
        
        const isFlush = suits.every(suit => suit === suits[0]);
        const isStraight = this.isStraight(values);
        const valueCounts = this.getValueCounts(values);
        const counts = Object.values(valueCounts).sort((a, b) => b - a);

        // Royal Flush
        if (isFlush && isStraight && values[0] === 14) {
            return { rank: 9, name: 'Royal Flush', highCards: values };
        }

        // Straight Flush
        if (isFlush && isStraight) {
            return { rank: 8, name: 'Straight Flush', highCards: values };
        }

        // Four of a Kind
        if (counts[0] === 4) {
            return { rank: 7, name: 'Four of a Kind', highCards: this.getHighCards(valueCounts, [4, 1]) };
        }

        // Full House
        if (counts[0] === 3 && counts[1] === 2) {
            return { rank: 6, name: 'Full House', highCards: this.getHighCards(valueCounts, [3, 2]) };
        }

        // Flush
        if (isFlush) {
            return { rank: 5, name: 'Flush', highCards: values };
        }

        // Straight
        if (isStraight) {
            return { rank: 4, name: 'Straight', highCards: values };
        }

        // Three of a Kind
        if (counts[0] === 3) {
            return { rank: 3, name: 'Three of a Kind', highCards: this.getHighCards(valueCounts, [3, 1, 1]) };
        }

        // Two Pair
        if (counts[0] === 2 && counts[1] === 2) {
            return { rank: 2, name: 'Two Pair', highCards: this.getHighCards(valueCounts, [2, 2, 1]) };
        }

        // One Pair
        if (counts[0] === 2) {
            return { rank: 1, name: 'One Pair', highCards: this.getHighCards(valueCounts, [2, 1, 1, 1]) };
        }

        // High Card
        return { rank: 0, name: 'High Card', highCards: values };
    }

    isStraight(values) {
        const uniqueValues = [...new Set(values)].sort((a, b) => b - a);
        if (uniqueValues.length !== 5) return false;

        // Check for A-2-3-4-5 straight (wheel)
        if (uniqueValues.join(',') === '14,5,4,3,2') return true;

        // Check for regular straight
        for (let i = 1; i < uniqueValues.length; i++) {
            if (uniqueValues[i-1] - uniqueValues[i] !== 1) return false;
        }
        return true;
    }

    getValueCounts(values) {
        const counts = {};
        for (const value of values) {
            counts[value] = (counts[value] || 0) + 1;
        }
        return counts;
    }

    getHighCards(valueCounts, pattern) {
        const groups = [];
        const entries = Object.entries(valueCounts).sort((a, b) => {
            if (b[1] !== a[1]) return b[1] - a[1]; // Sort by count first
            return b[0] - a[0]; // Then by value
        });

        for (let i = 0; i < pattern.length; i++) {
            const targetCount = pattern[i];
            const entry = entries.find(([value, count], index) => 
                count === targetCount && !groups.some(group => group.includes(parseInt(value)))
            );
            if (entry) {
                groups.push(Array(targetCount).fill(parseInt(entry[0])));
            }
        }

        return groups.flat();
    }

    compareHands(hand1, hand2) {
        if (hand1.rank !== hand2.rank) {
            return hand1.rank - hand2.rank;
        }

        // Compare high cards
        for (let i = 0; i < Math.min(hand1.highCards.length, hand2.highCards.length); i++) {
            if (hand1.highCards[i] !== hand2.highCards[i]) {
                return hand1.highCards[i] - hand2.highCards[i];
            }
        }

        return 0; // Tie
    }

    // Pre-flop odds calculation for quick estimates
    getPreFlopOdds() {
        if (this.playerCards.length !== 2) return null;

        const card1 = this.playerCards[0];
        const card2 = this.playerCards[1];
        const isPocket = card1.value === card2.value;
        const isSuited = card1.suit === card2.suit;
        const highCard = Math.max(card1.value, card2.value);
        const lowCard = Math.min(card1.value, card2.value);

        // Simplified pre-flop win rates against random hands
        let winRate = 0;

        if (isPocket) {
            if (highCard >= 13) winRate = 85; // AA, KK, QQ
            else if (highCard >= 11) winRate = 80; // JJ
            else if (highCard >= 9) winRate = 75; // TT, 99
            else if (highCard >= 7) winRate = 65; // 88, 77
            else winRate = 55; // 66 and below
        } else {
            const gap = highCard - lowCard;
            if (highCard === 14 && lowCard >= 10) winRate = isSuited ? 67 : 63; // AK, AQ, AJ, AT
            else if (highCard === 14 && lowCard >= 7) winRate = isSuited ? 60 : 55; // A9-A7
            else if (highCard >= 13 && lowCard >= 10) winRate = isSuited ? 63 : 58; // KQ, KJ, QJ
            else if (highCard >= 11 && gap <= 1) winRate = isSuited ? 58 : 53; // Connected high cards
            else if (isSuited && gap <= 4) winRate = 52; // Suited connectors/near connectors
            else winRate = Math.max(30, 50 - gap * 3); // Other hands
        }

        // Adjust for number of players
        const adjustment = Math.max(0, (this.playerCount - 2) * 3);
        return Math.max(10, winRate - adjustment);
    }
}

// UI Controller
class PokerUI {
    constructor() {
        this.calculator = new PokerOddsCalculator();
        this.initializeUI();
    }

    initializeUI() {
        this.createCardInputs();
        this.createPlayerCountSelector();
        this.createCalculateButton();
        this.createResultsDisplay();
    }

    createCardInputs() {
        const playerSection = document.getElementById('player-cards');
        const communitySection = document.getElementById('community-cards');

        // Player cards
        for (let i = 0; i < 2; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `Card ${i + 1} (e.g., A♠, K♥)`;
            input.className = 'card-input';
            input.id = `player-card-${i}`;
            playerSection.appendChild(input);
        }

        // Community cards
        for (let i = 0; i < 5; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `Flop/Turn/River ${i + 1}`;
            input.className = 'card-input community-card';
            input.id = `community-card-${i}`;
            communitySection.appendChild(input);
        }
    }

    createPlayerCountSelector() {
        const selector = document.getElementById('player-count');
        for (let i = 2; i <= 9; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i} players`;
            if (i === 2) option.selected = true;
            selector.appendChild(option);
        }
    }

    createCalculateButton() {
        const button = document.getElementById('calculate-btn');
        button.addEventListener('click', () => this.calculateOdds());
    }

    createResultsDisplay() {
        // Results will be populated dynamically
    }

    validateCardInput(cardString) {
        if (!cardString.trim()) return false;
        
        const suits = ['♠', '♥', '♦', '♣', 'S', 'H', 'D', 'C'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        
        const rank = cardString.slice(0, -1).toUpperCase();
        const suit = cardString.slice(-1);
        
        return ranks.includes(rank) && suits.includes(suit);
    }

    normalizeCardInput(cardString) {
        if (!cardString.trim()) return '';
        
        let rank = cardString.slice(0, -1).toUpperCase();
        let suit = cardString.slice(-1).toUpperCase();
        
        // Convert text suits to symbols
        const suitMap = { 'S': '♠', 'H': '♥', 'D': '♦', 'C': '♣' };
        if (suitMap[suit]) suit = suitMap[suit];
        
        return rank + suit;
    }

    getCardInputs() {
        const playerCards = [];
        const communityCards = [];
        
        // Get player cards
        for (let i = 0; i < 2; i++) {
            const input = document.getElementById(`player-card-${i}`).value;
            if (input.trim()) {
                const normalized = this.normalizeCardInput(input);
                if (this.validateCardInput(normalized)) {
                    playerCards.push(normalized);
                } else {
                    throw new Error(`Invalid card format: ${input}`);
                }
            }
        }
        
        // Get community cards
        for (let i = 0; i < 5; i++) {
            const input = document.getElementById(`community-card-${i}`).value;
            if (input.trim()) {
                const normalized = this.normalizeCardInput(input);
                if (this.validateCardInput(normalized)) {
                    communityCards.push(normalized);
                } else {
                    throw new Error(`Invalid card format: ${input}`);
                }
            }
        }
        
        return { playerCards, communityCards };
    }

    calculateOdds() {
        try {
            const { playerCards, communityCards } = this.getCardInputs();
            
            if (playerCards.length !== 2) {
                throw new Error('Please enter exactly 2 player cards');
            }

            const playerCount = parseInt(document.getElementById('player-count').value);
            
            this.calculator.setPlayerCards(playerCards);
            this.calculator.setCommunityCards(communityCards);
            this.calculator.setPlayerCount(playerCount);

            this.showCalculating();
            
            setTimeout(() => {
                const results = this.calculator.calculateOdds();
                const preFlop = this.calculator.getPreFlopOdds();
                this.displayResults(results, preFlop, playerCards, communityCards);
            }, 100);
            
        } catch (error) {
            this.displayError(error.message);
        }
    }

    showCalculating() {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = `
            <div class="calculating">
                <div class="spinner"></div>
                <p>Calculating odds...</p>
            </div>
        `;
        resultsDiv.style.display = 'block';
    }

    displayResults(results, preFlop, playerCards, communityCards) {
        const resultsDiv = document.getElementById('results');
        const handDescription = this.getHandDescription(playerCards, communityCards);
        
        resultsDiv.innerHTML = `
            <div class="results-content">
                <h3>📊 Poker Odds Results</h3>
                
                <div class="hand-info">
                    <h4>Your Hand: ${playerCards.join(' ')}</h4>
                    <p class="hand-description">${handDescription}</p>
                </div>
                
                <div class="odds-grid">
                    <div class="odds-item win">
                        <div class="odds-label">Win</div>
                        <div class="odds-value">${results.winPercentage}%</div>
                    </div>
                    <div class="odds-item tie">
                        <div class="odds-label">Tie</div>
                        <div class="odds-value">${results.tiePercentage}%</div>
                    </div>
                    <div class="odds-item lose">
                        <div class="odds-label">Lose</div>
                        <div class="odds-value">${results.losePercentage}%</div>
                    </div>
                </div>
                
                ${preFlop ? `
                    <div class="preflop-odds">
                        <h4>Pre-Flop Estimate</h4>
                        <p>~${preFlop.toFixed(1)}% win rate vs random hands</p>
                    </div>
                ` : ''}
                
                <div class="simulation-info">
                    <p>Based on ${results.totalSimulations.toLocaleString()} simulations</p>
                    ${communityCards.length < 5 ? '<p class="note">💡 Odds will become more accurate as more community cards are revealed</p>' : ''}
                </div>
            </div>
        `;
        resultsDiv.style.display = 'block';
    }

    getHandDescription(playerCards, communityCards) {
        const card1 = this.calculator.parseCard(playerCards[0]);
        const card2 = this.calculator.parseCard(playerCards[1]);
        
        const isPocket = card1.value === card2.value;
        const isSuited = card1.suit === card2.suit;
        const highCard = Math.max(card1.value, card2.value);
        const lowCard = Math.min(card1.value, card2.value);
        
        if (isPocket) {
            const cardName = card1.rank === 'A' ? 'Aces' : 
                           card1.rank === 'K' ? 'Kings' :
                           card1.rank === 'Q' ? 'Queens' :
                           card1.rank === 'J' ? 'Jacks' :
                           `Pocket ${card1.rank}s`;
            return `${cardName} - Premium pocket pair!`;
        } else {
            const gap = highCard - lowCard;
            let description = '';
            
            if (highCard === 14 && lowCard >= 12) {
                description = 'Premium high cards';
            } else if (gap <= 1) {
                description = isSuited ? 'Suited connector' : 'Connected cards';
            } else if (isSuited) {
                description = 'Suited cards';
            } else {
                description = 'Offsuit cards';
            }
            
            return description;
        }
    }

    displayError(message) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = `
            <div class="error">
                <h3>❌ Error</h3>
                <p>${message}</p>
                <div class="help">
                    <h4>Card Format Examples:</h4>
                    <ul>
                        <li>A♠ or AS (Ace of Spades)</li>
                        <li>K♥ or KH (King of Hearts)</li>
                        <li>10♦ or 10D (Ten of Diamonds)</li>
                        <li>2♣ or 2C (Two of Clubs)</li>
                    </ul>
                </div>
            </div>
        `;
        resultsDiv.style.display = 'block';
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new PokerUI();
});