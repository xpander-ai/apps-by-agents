class PokerOddsCalculator {
    constructor() {
        this.suits = ['♠', '♥', '♦', '♣'];
        this.ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
        this.handTypes = {
            'HIGH_CARD': { rank: 1, name: 'High Card' },
            'PAIR': { rank: 2, name: 'Pair' },
            'TWO_PAIR': { rank: 3, name: 'Two Pair' },
            'THREE_OF_KIND': { rank: 4, name: 'Three of a Kind' },
            'STRAIGHT': { rank: 5, name: 'Straight' },
            'FLUSH': { rank: 6, name: 'Flush' },
            'FULL_HOUSE': { rank: 7, name: 'Full House' },
            'FOUR_OF_KIND': { rank: 8, name: 'Four of a Kind' },
            'STRAIGHT_FLUSH': { rank: 9, name: 'Straight Flush' },
            'ROYAL_FLUSH': { rank: 10, name: 'Royal Flush' }
        };
        
        this.initializeCharts();
        this.bindEvents();
        this.updateOdds();
    }

    bindEvents() {
        const selectors = document.querySelectorAll('select');
        selectors.forEach(select => {
            select.addEventListener('change', () => this.updateOdds());
        });

        const opponentSlider = document.getElementById('opponentSlider');
        opponentSlider.addEventListener('input', (e) => {
            document.getElementById('opponentCount').textContent = e.target.value;
            this.updateOdds();
        });
    }

    getSelectedCards() {
        const cards = [];
        const cardSelectors = document.querySelectorAll('.card-selector');
        
        cardSelectors.forEach(selector => {
            const rank = selector.querySelector('.card-rank').value;
            const suit = selector.querySelector('.card-suit').value;
            if (rank && suit) {
                cards.push({ rank, suit, id: rank + suit });
            }
        });
        
        return cards;
    }

    getPlayerHand() {
        const playerCards = [];
        const handSelectors = document.querySelectorAll('.hand-cards .card-selector');
        
        handSelectors.forEach(selector => {
            const rank = selector.querySelector('.card-rank').value;
            const suit = selector.querySelector('.card-suit').value;
            if (rank && suit) {
                playerCards.push({ rank, suit, id: rank + suit });
            }
        });
        
        return playerCards;
    }

    getCommunityCards() {
        const communityCards = [];
        const communitySelectors = document.querySelectorAll('.community-cards .card-selector');
        
        communitySelectors.forEach(selector => {
            const rank = selector.querySelector('.card-rank').value;
            const suit = selector.querySelector('.card-suit').value;
            if (rank && suit) {
                communityCards.push({ rank, suit, id: rank + suit });
            }
        });
        
        return communityCards;
    }

    createDeck() {
        const deck = [];
        this.suits.forEach(suit => {
            this.ranks.forEach(rank => {
                deck.push({ rank, suit, id: rank + suit });
            });
        });
        return deck;
    }

    getAvailableCards() {
        const selectedCards = this.getSelectedCards();
        const selectedIds = selectedCards.map(card => card.id);
        return this.createDeck().filter(card => !selectedIds.includes(card.id));
    }

    evaluateHand(cards) {
        if (cards.length < 5) return { type: 'HIGH_CARD', rank: 1, strength: 0 };
        
        const sortedCards = cards.sort((a, b) => {
            const aVal = this.ranks.indexOf(a.rank);
            const bVal = this.ranks.indexOf(b.rank);
            return bVal - aVal;
        });

        const ranks = sortedCards.map(card => card.rank);
        const suits = sortedCards.map(card => card.suit);
        
        const rankCounts = {};
        ranks.forEach(rank => {
            rankCounts[rank] = (rankCounts[rank] || 0) + 1;
        });
        
        const counts = Object.values(rankCounts).sort((a, b) => b - a);
        const isFlush = suits.every(suit => suit === suits[0]);
        const isStraight = this.isStraight(ranks);
        const isRoyalFlush = isFlush && isStraight && ranks.includes('A') && ranks.includes('K');

        if (isRoyalFlush) {
            return { type: 'ROYAL_FLUSH', rank: 10, strength: 100 };
        } else if (isFlush && isStraight) {
            return { type: 'STRAIGHT_FLUSH', rank: 9, strength: 95 };
        } else if (counts[0] === 4) {
            return { type: 'FOUR_OF_KIND', rank: 8, strength: 90 };
        } else if (counts[0] === 3 && counts[1] === 2) {
            return { type: 'FULL_HOUSE', rank: 7, strength: 85 };
        } else if (isFlush) {
            return { type: 'FLUSH', rank: 6, strength: 75 };
        } else if (isStraight) {
            return { type: 'STRAIGHT', rank: 5, strength: 70 };
        } else if (counts[0] === 3) {
            return { type: 'THREE_OF_KIND', rank: 4, strength: 60 };
        } else if (counts[0] === 2 && counts[1] === 2) {
            return { type: 'TWO_PAIR', rank: 3, strength: 45 };
        } else if (counts[0] === 2) {
            return { type: 'PAIR', rank: 2, strength: 25 };
        } else {
            return { type: 'HIGH_CARD', rank: 1, strength: 10 };
        }
    }

    isStraight(ranks) {
        const uniqueRanks = [...new Set(ranks)];
        if (uniqueRanks.length < 5) return false;

        const rankValues = uniqueRanks.map(rank => this.ranks.indexOf(rank)).sort((a, b) => a - b);
        
        for (let i = 0; i <= rankValues.length - 5; i++) {
            let consecutive = true;
            for (let j = 1; j < 5; j++) {
                if (rankValues[i + j] !== rankValues[i] + j) {
                    consecutive = false;
                    break;
                }
            }
            if (consecutive) return true;
        }
        
        // Check for A-2-3-4-5 straight
        if (ranks.includes('A') && ranks.includes('2') && ranks.includes('3') && ranks.includes('4') && ranks.includes('5')) {
            return true;
        }
        
        return false;
    }

    calculateOuts(playerCards, communityCards) {
        const allCards = [...playerCards, ...communityCards];
        const availableCards = this.getAvailableCards();
        const currentHand = this.evaluateHand(allCards);
        
        const outs = [];
        const outsInfo = {
            flush: 0,
            straight: 0,
            pair: 0,
            trips: 0,
            fullHouse: 0,
            total: 0
        };

        availableCards.forEach(card => {
            const newHand = this.evaluateHand([...allCards, card]);
            if (newHand.rank > currentHand.rank || 
                (newHand.rank === currentHand.rank && newHand.strength > currentHand.strength)) {
                outs.push(card);
                
                // Categorize outs
                if (newHand.type === 'FLUSH') outsInfo.flush++;
                else if (newHand.type === 'STRAIGHT') outsInfo.straight++;
                else if (newHand.type === 'FULL_HOUSE') outsInfo.fullHouse++;
                else if (newHand.type === 'THREE_OF_KIND') outsInfo.trips++;
                else if (newHand.type === 'PAIR' || newHand.type === 'TWO_PAIR') outsInfo.pair++;
            }
        });

        outsInfo.total = outs.length;
        return { outs, info: outsInfo };
    }

    calculateDrawProbabilities(playerCards, communityCards) {
        const allCards = [...playerCards, ...communityCards];
        const availableCards = this.getAvailableCards();
        
        let flushDraws = 0;
        let straightDraws = 0;
        
        // Count cards of each suit in current hand
        const suitCounts = {};
        allCards.forEach(card => {
            suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
        });
        
        // Check for flush draws (4 cards of same suit)
        Object.entries(suitCounts).forEach(([suit, count]) => {
            if (count === 4) {
                flushDraws = availableCards.filter(card => card.suit === suit).length;
            }
        });
        
        // Simplified straight draw calculation
        const ranks = allCards.map(card => this.ranks.indexOf(card.rank)).sort((a, b) => a - b);
        const uniqueRanks = [...new Set(ranks)];
        
        // Count potential straight completions
        straightDraws = this.calculateStraightOuts(uniqueRanks, availableCards);
        
        const remainingCards = communityCards.length < 5 ? (5 - communityCards.length) : 1;
        const totalRemaining = availableCards.length;
        
        return {
            flush: totalRemaining > 0 ? (flushDraws / totalRemaining) * 100 : 0,
            straight: totalRemaining > 0 ? (straightDraws / totalRemaining) * 100 : 0
        };
    }

    calculateStraightOuts(uniqueRanks, availableCards) {
        let outs = 0;
        
        // Check each possible straight completion
        for (let startRank = 0; startRank <= 8; startRank++) {
            const straightRanks = [startRank, startRank + 1, startRank + 2, startRank + 3, startRank + 4];
            const hasRanks = straightRanks.filter(rank => uniqueRanks.includes(rank));
            
            if (hasRanks.length >= 3) {
                const missingRanks = straightRanks.filter(rank => !uniqueRanks.includes(rank));
                missingRanks.forEach(rank => {
                    const rankName = this.ranks[rank];
                    const rankOuts = availableCards.filter(card => card.rank === rankName).length;
                    outs += rankOuts;
                });
            }
        }
        
        // Check A-2-3-4-5 straight
        const lowStraight = [0, 1, 2, 3, 12]; // 2,3,4,5,A
        const hasLowStraightRanks = lowStraight.filter(rank => uniqueRanks.includes(rank));
        if (hasLowStraightRanks.length >= 3) {
            const missingLowRanks = lowStraight.filter(rank => !uniqueRanks.includes(rank));
            missingLowRanks.forEach(rank => {
                const rankName = this.ranks[rank];
                const rankOuts = availableCards.filter(card => card.rank === rankName).length;
                outs += rankOuts;
            });
        }
        
        return Math.min(outs, availableCards.length);
    }

    simulateGame(playerCards, communityCards, opponents = 1, simulations = 10000) {
        let wins = 0;
        let ties = 0;
        let losses = 0;

        for (let i = 0; i < simulations; i++) {
            const availableCards = this.getAvailableCards();
            const shuffled = this.shuffleArray([...availableCards]);
            
            // Complete community cards
            const fullCommunity = [...communityCards];
            while (fullCommunity.length < 5 && shuffled.length > 0) {
                fullCommunity.push(shuffled.pop());
            }
            
            // Player's best hand
            const playerAllCards = [...playerCards, ...fullCommunity];
            const playerHand = this.getBestHand(playerAllCards);
            
            // Generate opponent hands
            const opponentHands = [];
            for (let opp = 0; opp < opponents; opp++) {
                if (shuffled.length >= 2) {
                    const oppCards = [shuffled.pop(), shuffled.pop()];
                    const oppAllCards = [...oppCards, ...fullCommunity];
                    opponentHands.push(this.getBestHand(oppAllCards));
                }
            }
            
            // Compare hands
            let playerWins = true;
            let isTie = false;
            
            opponentHands.forEach(oppHand => {
                const comparison = this.compareHands(playerHand, oppHand);
                if (comparison < 0) {
                    playerWins = false;
                } else if (comparison === 0) {
                    isTie = true;
                }
            });
            
            if (playerWins && !isTie) {
                wins++;
            } else if (isTie) {
                ties++;
            } else {
                losses++;
            }
        }
        
        return {
            win: (wins / simulations) * 100,
            tie: (ties / simulations) * 100,
            lose: (losses / simulations) * 100
        };
    }

    getBestHand(cards) {
        if (cards.length < 5) return this.evaluateHand(cards);
        
        let bestHand = { rank: 0, strength: 0 };
        
        // Generate all 5-card combinations
        const combinations = this.getCombinations(cards, 5);
        
        combinations.forEach(combination => {
            const hand = this.evaluateHand(combination);
            if (hand.rank > bestHand.rank || 
                (hand.rank === bestHand.rank && hand.strength > bestHand.strength)) {
                bestHand = hand;
            }
        });
        
        return bestHand;
    }

    getCombinations(array, size) {
        if (size === 1) return array.map(item => [item]);
        
        const combinations = [];
        for (let i = 0; i < array.length - size + 1; i++) {
            const head = array[i];
            const tailCombinations = this.getCombinations(array.slice(i + 1), size - 1);
            tailCombinations.forEach(tail => combinations.push([head, ...tail]));
        }
        
        return combinations;
    }

    compareHands(hand1, hand2) {
        if (hand1.rank > hand2.rank) return 1;
        if (hand1.rank < hand2.rank) return -1;
        if (hand1.strength > hand2.strength) return 1;
        if (hand1.strength < hand2.strength) return -1;
        return 0;
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    updateOdds() {
        const playerCards = this.getPlayerHand();
        const communityCards = this.getCommunityCards();
        const opponents = parseInt(document.getElementById('opponentSlider').value);
        
        if (playerCards.length < 2) {
            this.resetDisplay();
            return;
        }
        
        // Calculate odds
        const odds = this.simulateGame(playerCards, communityCards, opponents);
        
        // Update progress bars with animation
        this.animateProgressBar('winProgress', odds.win, 'winPercent');
        this.animateProgressBar('tieProgress', odds.tie, 'tiePercent');
        this.animateProgressBar('loseProgress', odds.lose, 'losePercent');
        
        // Update hand strength
        const allCards = [...playerCards, ...communityCards];
        const currentHand = this.evaluateHand(allCards);
        this.updateHandStrength(currentHand);
        
        // Update outs
        const outsData = this.calculateOuts(playerCards, communityCards);
        this.updateOuts(outsData);
        
        // Update draw probabilities
        const drawProbs = this.calculateDrawProbabilities(playerCards, communityCards);
        this.updateDrawMeters(drawProbs);
        
        // Update charts
        this.updatePieChart(odds);
        this.updateEquityChart(odds);
        
        // Add highlight effect to updated cards
        this.highlightUpdatedElements();
    }

    animateProgressBar(progressId, percentage, textId) {
        const progressBar = document.getElementById(progressId);
        const progressText = document.getElementById(textId);
        
        if (!progressBar || !progressText) return;
        
        // Animate the width
        progressBar.style.width = `${percentage}%`;
        
        // Animate the text with counting effect
        const currentText = progressText.textContent;
        const currentValue = parseFloat(currentText) || 0;
        const targetValue = percentage;
        
        const duration = 800;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentVal = currentValue + (targetValue - currentValue) * easeOutCubic;
            
            progressText.textContent = `${currentVal.toFixed(1)}%`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    updateHandStrength(hand) {
        const strengthFill = document.getElementById('strengthFill');
        const handType = document.getElementById('handType');
        
        if (!strengthFill || !handType) return;
        
        strengthFill.style.width = `${hand.strength}%`;
        handType.textContent = this.handTypes[hand.type]?.name || 'Unknown';
    }

    updateOuts(outsData) {
        const outsNumber = document.getElementById('outsNumber');
        const outsCards = document.getElementById('outsCards');
        
        if (!outsNumber || !outsCards) return;
        
        // Animate outs number
        const currentValue = parseInt(outsNumber.textContent) || 0;
        const targetValue = outsData.info.total;
        
        this.animateNumber(outsNumber, currentValue, targetValue, 600);
        
        // Update outs cards display
        outsCards.innerHTML = '';
        outsData.outs.slice(0, 12).forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'out-card';
            cardElement.textContent = `${card.rank}${card.suit}`;
            outsCards.appendChild(cardElement);
        });
    }

    updateDrawMeters(drawProbs) {
        this.updateCircularProgress('flushMeter', drawProbs.flush, 'flushValue');
        this.updateCircularProgress('straightMeter', drawProbs.straight, 'straightValue');
    }

    updateCircularProgress(meterId, percentage, valueId) {
        const meter = document.getElementById(meterId);
        const valueElement = document.getElementById(valueId);
        
        if (!meter || !valueElement) return;
        
        const degrees = (percentage / 100) * 360;
        meter.style.background = `conic-gradient(from 0deg, #4ecdc4 0deg, #4ecdc4 ${degrees}deg, rgba(255, 255, 255, 0.1) ${degrees}deg)`;
        
        // Animate value text
        const currentValue = parseFloat(valueElement.textContent) || 0;
        this.animateNumber(valueElement, currentValue, percentage, 600, '%');
    }

    animateNumber(element, start, end, duration, suffix = '') {
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentValue = start + (end - start) * easeOutCubic;
            
            element.textContent = `${Math.round(currentValue)}${suffix}`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    initializeCharts() {
        // Initialize Pie Chart
        const pieCtx = document.getElementById('oddsChart').getContext('2d');
        this.pieChart = new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: ['Win', 'Tie', 'Lose'],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: [
                        'rgba(78, 205, 196, 0.8)',
                        'rgba(255, 217, 61, 0.8)',
                        'rgba(255, 107, 107, 0.8)'
                    ],
                    borderColor: [
                        '#4ecdc4',
                        '#ffd93d',
                        '#ff6b6b'
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
                            color: '#ffffff',
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 800
                }
            }
        });

        // Initialize Equity Chart
        const equityCtx = document.getElementById('equityChart').getContext('2d');
        this.equityChart = new Chart(equityCtx, {
            type: 'line',
            data: {
                labels: ['Pre-flop', 'Flop', 'Turn', 'River'],
                datasets: [{
                    label: 'Win Probability',
                    data: [0, 0, 0, 0],
                    borderColor: '#4ecdc4',
                    backgroundColor: 'rgba(78, 205, 196, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
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
                            color: '#ffffff',
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
                            color: '#ffffff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                animation: {
                    duration: 800,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    updatePieChart(odds) {
        this.pieChart.data.datasets[0].data = [odds.win, odds.tie, odds.lose];
        this.pieChart.update('active');
    }

    updateEquityChart(odds) {
        const communityCards = this.getCommunityCards();
        const stage = Math.min(communityCards.length, 3);
        
        // Update the appropriate stage with current win probability
        const currentData = [...this.equityChart.data.datasets[0].data];
        currentData[stage] = odds.win;
        
        this.equityChart.data.datasets[0].data = currentData;
        this.equityChart.update('active');
    }

    highlightUpdatedElements() {
        const statsCards = document.querySelectorAll('.stats-card');
        statsCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('highlight');
                setTimeout(() => {
                    card.classList.remove('highlight');
                }, 1000);
            }, index * 100);
        });
    }

    resetDisplay() {
        // Reset progress bars
        ['winProgress', 'tieProgress', 'loseProgress'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.style.width = '0%';
        });
        
        // Reset text displays
        ['winPercent', 'tiePercent', 'losePercent'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = '0%';
        });
        
        // Reset other displays
        const outsNumber = document.getElementById('outsNumber');
        if (outsNumber) outsNumber.textContent = '0';
        
        const outsCards = document.getElementById('outsCards');
        if (outsCards) outsCards.innerHTML = '';
        
        const handType = document.getElementById('handType');
        if (handType) handType.textContent = 'High Card';
        
        const strengthFill = document.getElementById('strengthFill');
        if (strengthFill) strengthFill.style.width = '0%';
        
        // Reset charts
        this.pieChart.data.datasets[0].data = [0, 0, 0];
        this.pieChart.update();
        
        this.equityChart.data.datasets[0].data = [0, 0, 0, 0];
        this.equityChart.update();
    }
}

// Initialize the calculator when page loads
document.addEventListener('DOMContentLoaded', () => {
    new PokerOddsCalculator();
});