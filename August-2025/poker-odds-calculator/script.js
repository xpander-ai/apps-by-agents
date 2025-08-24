class PokerOddsCalculator {
    constructor() {
        this.suits = ['♠', '♥', '♦', '♣'];
        this.ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
        this.rankValues = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
        this.handRankings = {
            'High Card': 1,
            'Pair': 2,
            'Two Pair': 3,
            'Three of a Kind': 4,
            'Straight': 5,
            'Flush': 6,
            'Full House': 7,
            'Four of a Kind': 8,
            'Straight Flush': 9,
            'Royal Flush': 10
        };
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('calculate-btn').addEventListener('click', () => this.calculateOdds());
        
        const cardSelects = document.querySelectorAll('.card-select');
        cardSelects.forEach(select => {
            select.addEventListener('change', () => this.validateCardSelection());
        });
    }

    validateCardSelection() {
        const usedCards = new Set();
        const cardSelects = document.querySelectorAll('.card-select');
        let duplicateFound = false;
        
        for (let i = 0; i < cardSelects.length; i += 2) {
            const rankSelect = cardSelects[i];
            const suitSelect = cardSelects[i + 1];
            
            if (rankSelect.value && suitSelect.value) {
                const card = rankSelect.value + suitSelect.value;
                if (usedCards.has(card)) {
                    duplicateFound = true;
                    rankSelect.style.borderColor = '#ff4444';
                    suitSelect.style.borderColor = '#ff4444';
                } else {
                    usedCards.add(card);
                    rankSelect.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    suitSelect.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }
            }
        }
        
        const calculateBtn = document.getElementById('calculate-btn');
        calculateBtn.disabled = duplicateFound;
        calculateBtn.textContent = duplicateFound ? 'Duplicate Cards Detected' : 'Calculate Odds';
    }

    getSelectedCards() {
        const cards = {
            playerHand: [],
            communityCards: []
        };

        const card1Rank = document.getElementById('card1-rank').value;
        const card1Suit = document.getElementById('card1-suit').value;
        const card2Rank = document.getElementById('card2-rank').value;
        const card2Suit = document.getElementById('card2-suit').value;

        if (card1Rank && card1Suit) {
            cards.playerHand.push({ rank: card1Rank, suit: card1Suit });
        }
        if (card2Rank && card2Suit) {
            cards.playerHand.push({ rank: card2Rank, suit: card2Suit });
        }

        const communityIds = ['flop1', 'flop2', 'flop3', 'turn', 'river'];
        communityIds.forEach(id => {
            const rank = document.getElementById(`${id}-rank`).value;
            const suit = document.getElementById(`${id}-suit`).value;
            if (rank && suit) {
                cards.communityCards.push({ rank, suit });
            }
        });

        return cards;
    }

    createDeck(usedCards = []) {
        const deck = [];
        const usedSet = new Set(usedCards.map(card => `${card.rank}${card.suit}`));
        
        for (const rank of this.ranks) {
            for (const suit of this.suits) {
                const cardStr = `${rank}${suit}`;
                if (!usedSet.has(cardStr)) {
                    deck.push({ rank, suit });
                }
            }
        }
        
        return deck;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    evaluateHand(cards) {
        if (cards.length < 5) return { rank: 0, name: 'Invalid Hand' };
        
        const sortedCards = cards.sort((a, b) => this.rankValues[b.rank] - this.rankValues[a.rank]);
        
        const isFlush = this.checkFlush(sortedCards);
        const straight = this.checkStraight(sortedCards);
        const rankCounts = this.getRankCounts(sortedCards);
        
        if (isFlush && straight.isStraight) {
            if (straight.highCard === 14) {
                return { rank: 10, name: 'Royal Flush', highCard: 14 };
            }
            return { rank: 9, name: 'Straight Flush', highCard: straight.highCard };
        }
        
        if (rankCounts.four) {
            return { rank: 8, name: 'Four of a Kind', highCard: this.rankValues[rankCounts.four] };
        }
        
        if (rankCounts.three && rankCounts.pair) {
            return { rank: 7, name: 'Full House', highCard: this.rankValues[rankCounts.three] };
        }
        
        if (isFlush) {
            return { rank: 6, name: 'Flush', highCard: this.rankValues[sortedCards[0].rank] };
        }
        
        if (straight.isStraight) {
            return { rank: 5, name: 'Straight', highCard: straight.highCard };
        }
        
        if (rankCounts.three) {
            return { rank: 4, name: 'Three of a Kind', highCard: this.rankValues[rankCounts.three] };
        }
        
        if (rankCounts.pairs && rankCounts.pairs.length === 2) {
            const highPair = Math.max(...rankCounts.pairs.map(rank => this.rankValues[rank]));
            return { rank: 3, name: 'Two Pair', highCard: highPair };
        }
        
        if (rankCounts.pair) {
            return { rank: 2, name: 'Pair', highCard: this.rankValues[rankCounts.pair] };
        }
        
        return { rank: 1, name: 'High Card', highCard: this.rankValues[sortedCards[0].rank] };
    }

    checkFlush(cards) {
        const suitCounts = {};
        cards.forEach(card => {
            suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
        });
        return Object.values(suitCounts).some(count => count >= 5);
    }

    checkStraight(cards) {
        const uniqueRanks = [...new Set(cards.map(card => this.rankValues[card.rank]))];
        uniqueRanks.sort((a, b) => b - a);
        
        for (let i = 0; i <= uniqueRanks.length - 5; i++) {
            let consecutive = true;
            for (let j = 0; j < 4; j++) {
                if (uniqueRanks[i + j] - uniqueRanks[i + j + 1] !== 1) {
                    consecutive = false;
                    break;
                }
            }
            if (consecutive) {
                return { isStraight: true, highCard: uniqueRanks[i] };
            }
        }
        
        if (uniqueRanks.includes(14) && uniqueRanks.includes(5) && uniqueRanks.includes(4) && 
            uniqueRanks.includes(3) && uniqueRanks.includes(2)) {
            return { isStraight: true, highCard: 5 };
        }
        
        return { isStraight: false };
    }

    getRankCounts(cards) {
        const counts = {};
        cards.forEach(card => {
            counts[card.rank] = (counts[card.rank] || 0) + 1;
        });
        
        const result = { pairs: [] };
        for (const [rank, count] of Object.entries(counts)) {
            if (count === 4) result.four = rank;
            else if (count === 3) result.three = rank;
            else if (count === 2) result.pairs.push(rank);
        }
        
        if (result.pairs.length === 1) result.pair = result.pairs[0];
        
        return result;
    }

    getBestHand(playerCards, communityCards) {
        const allCards = [...playerCards, ...communityCards];
        if (allCards.length < 5) return this.evaluateHand(allCards);
        
        let bestHand = { rank: 0 };
        
        const combinations = this.getCombinations(allCards, 5);
        for (const combination of combinations) {
            const hand = this.evaluateHand(combination);
            if (hand.rank > bestHand.rank || 
                (hand.rank === bestHand.rank && hand.highCard > bestHand.highCard)) {
                bestHand = hand;
            }
        }
        
        return bestHand;
    }

    getCombinations(arr, k) {
        if (k === 1) return arr.map(item => [item]);
        if (k === arr.length) return [arr];
        
        const combinations = [];
        for (let i = 0; i <= arr.length - k; i++) {
            const head = arr[i];
            const tailCombinations = this.getCombinations(arr.slice(i + 1), k - 1);
            tailCombinations.forEach(combination => {
                combinations.push([head, ...combination]);
            });
        }
        
        return combinations;
    }

    async calculateOdds() {
        const cards = this.getSelectedCards();
        const playerCount = parseInt(document.getElementById('player-count').value);
        
        if (cards.playerHand.length !== 2) {
            alert('Please select both of your hole cards.');
            return;
        }
        
        const loadingElement = document.getElementById('loading');
        const resultsElement = document.getElementById('results');
        
        loadingElement.style.display = 'block';
        resultsElement.style.display = 'none';
        
        setTimeout(async () => {
            const results = await this.runMonteCarloSimulation(cards, playerCount);
            this.displayResults(results);
            
            loadingElement.style.display = 'none';
            resultsElement.style.display = 'block';
        }, 100);
    }

    async runMonteCarloSimulation(cards, playerCount, iterations = 50000) {
        const { playerHand, communityCards } = cards;
        const usedCards = [...playerHand, ...communityCards];
        
        let wins = 0;
        let ties = 0;
        let losses = 0;
        let bestHandFreq = {};
        
        for (let i = 0; i < iterations; i++) {
            const deck = this.createDeck(usedCards);
            this.shuffleArray(deck);
            
            const fullCommunity = [...communityCards];
            while (fullCommunity.length < 5) {
                fullCommunity.push(deck.pop());
            }
            
            const playerBestHand = this.getBestHand(playerHand, fullCommunity);
            bestHandFreq[playerBestHand.name] = (bestHandFreq[playerBestHand.name] || 0) + 1;
            
            const opponentHands = [];
            for (let j = 1; j < playerCount; j++) {
                const opponentCards = [deck.pop(), deck.pop()];
                const opponentBestHand = this.getBestHand(opponentCards, fullCommunity);
                opponentHands.push(opponentBestHand);
            }
            
            let playerWins = true;
            let tie = false;
            
            for (const opponentHand of opponentHands) {
                if (opponentHand.rank > playerBestHand.rank || 
                    (opponentHand.rank === playerBestHand.rank && opponentHand.highCard > playerBestHand.highCard)) {
                    playerWins = false;
                    break;
                } else if (opponentHand.rank === playerBestHand.rank && opponentHand.highCard === playerBestHand.highCard) {
                    tie = true;
                }
            }
            
            if (playerWins && !tie) {
                wins++;
            } else if (tie) {
                ties++;
            } else {
                losses++;
            }
            
            if (i % 10000 === 0 && i > 0) {
                await new Promise(resolve => setTimeout(resolve, 1));
            }
        }
        
        const mostFrequentHand = Object.keys(bestHandFreq).reduce((a, b) => 
            bestHandFreq[a] > bestHandFreq[b] ? a : b
        );
        
        return {
            winProbability: (wins / iterations * 100).toFixed(2),
            tieProbability: (ties / iterations * 100).toFixed(2),
            loseProbability: (losses / iterations * 100).toFixed(2),
            bestHand: mostFrequentHand
        };
    }

    displayResults(results) {
        document.getElementById('win-prob').textContent = results.winProbability + '%';
        document.getElementById('tie-prob').textContent = results.tieProbability + '%';
        document.getElementById('lose-prob').textContent = results.loseProbability + '%';
        document.getElementById('best-hand').textContent = results.bestHand;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PokerOddsCalculator();
});