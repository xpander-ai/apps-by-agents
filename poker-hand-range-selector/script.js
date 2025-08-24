class PokerHandRangeSelector {
    constructor() {
        this.selectedHands = new Set();
        this.opponentHands = new Set();
        this.currentRange = 0;
        
        this.handMatrix = this.generateHandMatrix();
        this.handStrengths = this.calculateHandStrengths();
        this.presetRanges = this.definePresetRanges();
        
        this.init();
    }

    generateHandMatrix() {
        const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
        const matrix = [];
        
        for (let i = 0; i < 13; i++) {
            const row = [];
            for (let j = 0; j < 13; j++) {
                if (i === j) {
                    row.push(`${ranks[i]}${ranks[j]}`);
                } else if (i < j) {
                    row.push(`${ranks[i]}${ranks[j]}s`);
                } else {
                    row.push(`${ranks[j]}${ranks[i]}o`);
                }
            }
            matrix.push(row);
        }
        return matrix;
    }

    calculateHandStrengths() {
        const strengths = {};
        const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
        
        for (let i = 0; i < 13; i++) {
            for (let j = 0; j < 13; j++) {
                const hand = this.handMatrix[i][j];
                let strength;
                
                if (i === j) {
                    if (i <= 3) strength = 'premium';
                    else if (i <= 5) strength = 'strong'; 
                    else if (i <= 8) strength = 'playable';
                    else strength = 'marginal';
                } else if (i < j) {
                    if ((i === 0 && j <= 3) || (i === 1 && j <= 2)) strength = 'premium';
                    else if ((i === 0 && j <= 5) || (i === 1 && j <= 4) || (i === 2 && j === 3)) strength = 'strong';
                    else if ((i === 0) || (i <= 2 && j <= 6) || (i === 3 && j <= 5)) strength = 'playable';
                    else if (i <= 5 || (ranks[i] === ranks[j-1])) strength = 'marginal';
                    else strength = 'weak';
                } else {
                    if ((j === 0 && i <= 3) || (j === 1 && i === 2)) strength = 'strong';
                    else if ((j === 0 && i <= 6) || (j === 1 && i <= 4) || (j === 2 && i <= 4)) strength = 'playable';
                    else if (j === 0 || (j <= 3 && i <= 8)) strength = 'marginal';
                    else strength = 'weak';
                }
                
                strengths[hand] = strength;
            }
        }
        
        return strengths;
    }

    definePresetRanges() {
        return {
            tight: [
                'AA', 'KK', 'QQ', 'JJ', 'TT', '99',
                'AKs', 'AQs', 'AJs', 'ATs',
                'KQs', 'KJs', 'QJs',
                'AKo', 'AQo'
            ],
            loose: [
                'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
                'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                'KQs', 'KJs', 'KTs', 'K9s', 'K8s',
                'QJs', 'QTs', 'Q9s',
                'JTs', 'J9s',
                'T9s', 'T8s',
                '98s', '97s',
                '87s', '86s',
                '76s', '75s',
                '65s',
                'AKo', 'AQo', 'AJo', 'ATo', 'A9o',
                'KQo', 'KJo', 'KTo',
                'QJo', 'QTo',
                'JTo'
            ],
            aggressive: [
                'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55',
                'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                'KQs', 'KJs', 'KTs', 'K9s',
                'QJs', 'QTs', 'Q9s',
                'JTs', 'J9s', 'J8s',
                'T9s', 'T8s',
                '98s', '97s',
                '87s', '86s',
                '76s',
                'AKo', 'AQo', 'AJo', 'ATo',
                'KQo', 'KJo',
                'QJo'
            ]
        };
    }

    init() {
        this.createGrid();
        this.createHeatmap();
        this.attachEventListeners();
        this.updateDisplay();
    }

    createGrid() {
        const grid = document.getElementById('handGrid');
        grid.innerHTML = '';
        
        for (let i = 0; i < 13; i++) {
            for (let j = 0; j < 13; j++) {
                const hand = this.handMatrix[i][j];
                const cell = document.createElement('div');
                cell.className = `hand-cell ${this.handStrengths[hand]}`;
                cell.textContent = hand;
                cell.dataset.hand = hand;
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                cell.addEventListener('click', () => this.toggleHand(hand));
                cell.addEventListener('mouseenter', () => this.showHandInfo(hand));
                cell.addEventListener('mouseleave', () => this.hideHandInfo());
                
                grid.appendChild(cell);
            }
        }
    }

    createHeatmap() {
        const heatmap = document.getElementById('heatmapGrid');
        heatmap.innerHTML = '';
        
        for (let i = 0; i < 13; i++) {
            for (let j = 0; j < 13; j++) {
                const hand = this.handMatrix[i][j];
                const cell = document.createElement('div');
                cell.className = 'heatmap-cell';
                cell.textContent = '';
                cell.dataset.hand = hand;
                
                heatmap.appendChild(cell);
            }
        }
    }

    attachEventListeners() {
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const range = e.target.dataset.range;
                this.applyPresetRange(range);
            });
        });

        document.getElementById('rangeSlider').addEventListener('input', (e) => {
            this.currentRange = parseInt(e.target.value);
            this.applyPercentageRange();
            this.updatePercentageDisplay();
        });

        document.getElementById('opponentRange').addEventListener('change', (e) => {
            this.setOpponentRange(e.target.value);
        });
    }

    toggleHand(hand) {
        if (this.selectedHands.has(hand)) {
            this.selectedHands.delete(hand);
        } else {
            this.selectedHands.add(hand);
        }
        this.updateDisplay();
        this.calculateEquity();
    }

    applyPresetRange(range) {
        this.selectedHands.clear();
        
        if (range === 'clear') {
            this.updateDisplay();
            this.updatePercentageDisplay();
            return;
        }
        
        const hands = this.presetRanges[range];
        hands.forEach(hand => this.selectedHands.add(hand));
        
        this.currentRange = Math.round((this.selectedHands.size / 169) * 100);
        document.getElementById('rangeSlider').value = this.currentRange;
        
        this.updateDisplay();
        this.updatePercentageDisplay();
        this.calculateEquity();
    }

    applyPercentageRange() {
        const handRankings = this.getAllHandsRanked();
        const handsToSelect = Math.floor((this.currentRange / 100) * 169);
        
        this.selectedHands.clear();
        for (let i = 0; i < handsToSelect; i++) {
            this.selectedHands.add(handRankings[i]);
        }
        
        this.updateDisplay();
        this.calculateEquity();
    }

    getAllHandsRanked() {
        const rankings = [
            'AA', 'KK', 'QQ', 'JJ', 'AKs', 'TT', 'AQs', 'AJs', 'KQs', 'AKo', '99', 'ATs', 'AQo', 'KJs', 'KTs', 'QJs', 'KQo',
            '88', 'A9s', 'AJo', 'QTs', 'KJo', 'J9s', 'ATo', 'KTo', 'QJo', '77', 'A8s', 'K9s', 'A5s', 'A7s', 'A6s', 'QTo',
            'J8s', '66', 'T9s', 'A4s', 'Q9s', 'JTo', 'A3s', 'K8s', '98s', 'T8s', 'A2s', 'A9o', 'K7s', '87s', 'Q8s', '55',
            '97s', '76s', 'J7s', 'T7s', 'A8o', 'K9o', 'K6s', '96s', 'Q7s', '86s', '44', '75s', 'J9o', 'Q9o', 'K5s', 'T9o',
            '65s', 'A7o', 'K8o', 'J6s', '85s', '33', 'Q6s', '54s', 'K4s', 'A6o', 'Q5s', '74s', 'K7o', 'J8o', 'A5o', 'K3s',
            'J5s', '98o', '64s', 'A4o', 'K6o', 'T6s', '53s', '22', 'K2s', 'Q4s', 'J4s', 'T8o', 'A3o', '97o', '87o', 'Q8o',
            'T5s', '76s', 'J7o', 'Q3s', 'T4s', '43s', 'A2o', '86o', '96o', 'K5o', 'J3s', '75o', 'Q2s', '95s', '84s', 'T7o',
            '65o', 'J2s', '94s', '54o', 'Q7o', 'T3s', '85o', 'K4o', '93s', '42s', '74o', 'T2s', 'Q6o', '64o', '53o', '92s',
            'K3o', 'Q5o', 'J6o', '83s', '98s', 'T6o', '52s', '73s', 'K2o', '82s', '63s', 'J5o', 'Q4o', 'T5o', '84o', '43o',
            'Q3o', '72s', '32s', 'Q2o', '94o', 'J4o', '93o', 'T4o', 'J3o', '42o', 'T3o', 'J2o', '92o', 'T2o', '83o', '73o',
            '82o', '52o', '72o', '63o', '62s', '32o', '62o'
        ];
        return rankings;
    }

    setOpponentRange(range) {
        this.opponentHands.clear();
        
        if (range !== 'custom' && this.presetRanges[range]) {
            this.presetRanges[range].forEach(hand => this.opponentHands.add(hand));
        }
        
        this.calculateEquity();
    }

    showHandInfo(hand) {
        const strength = this.handStrengths[hand];
        const isSelected = this.selectedHands.has(hand);
        const equity = this.calculateHandEquity(hand);
        
        const info = `
            <strong>${hand}</strong><br>
            Strength: ${strength.charAt(0).toUpperCase() + strength.slice(1)}<br>
            ${isSelected ? '✓ Selected in range' : 'Not in range'}<br>
            Est. Equity vs Random: ${equity}%
        `;
        
        document.getElementById('handDetails').innerHTML = info;
    }

    hideHandInfo() {
        document.getElementById('handDetails').innerHTML = '<p>Hover over a hand to see details</p>';
    }

    calculateHandEquity(hand) {
        const equityMap = {
            'AA': 85, 'KK': 82, 'QQ': 80, 'JJ': 77, 'TT': 75, '99': 72, '88': 69, '77': 66,
            '66': 63, '55': 60, '44': 57, '33': 54, '22': 51,
            'AKs': 78, 'AQs': 75, 'AJs': 73, 'ATs': 70, 'A9s': 67, 'A8s': 65, 'A7s': 62,
            'A6s': 60, 'A5s': 60, 'A4s': 58, 'A3s': 57, 'A2s': 55,
            'AKo': 74, 'AQo': 71, 'AJo': 68, 'ATo': 65, 'A9o': 62,
            'KQs': 72, 'KJs': 69, 'KTs': 66, 'K9s': 63, 'K8s': 60,
            'KQo': 67, 'KJo': 64, 'KTo': 61,
            'QJs': 66, 'QTs': 63, 'Q9s': 60,
            'QJo': 61, 'QTo': 58,
            'JTs': 63, 'J9s': 60,
            'JTo': 58,
            'T9s': 60, '98s': 57, '87s': 54, '76s': 51, '65s': 48
        };
        
        return equityMap[hand] || Math.floor(Math.random() * 30) + 30;
    }

    updateDisplay() {
        document.querySelectorAll('.hand-cell').forEach(cell => {
            const hand = cell.dataset.hand;
            cell.classList.toggle('selected', this.selectedHands.has(hand));
        });
    }

    updatePercentageDisplay() {
        const percentage = Math.round((this.selectedHands.size / 169) * 100);
        document.getElementById('currentPercentage').textContent = `${percentage}%`;
    }

    calculateEquity() {
        if (this.selectedHands.size === 0 || this.opponentHands.size === 0) {
            document.getElementById('equityResults').innerHTML = '<p>Select both ranges to calculate equity</p>';
            this.updateHeatmap();
            return;
        }

        let totalEquity = 0;
        let combinations = 0;

        this.selectedHands.forEach(heroHand => {
            this.opponentHands.forEach(villainHand => {
                if (heroHand !== villainHand) {
                    const equity = this.calculateHeadsUpEquity(heroHand, villainHand);
                    totalEquity += equity;
                    combinations++;
                }
            });
        });

        const avgEquity = combinations > 0 ? (totalEquity / combinations).toFixed(1) : 0;
        
        const results = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                    <strong>Your Range</strong><br>
                    Hands: ${this.selectedHands.size}<br>
                    Percentage: ${Math.round((this.selectedHands.size / 169) * 100)}%
                </div>
                <div>
                    <strong>Opponent Range</strong><br>
                    Hands: ${this.opponentHands.size}<br>
                    Percentage: ${Math.round((this.opponentHands.size / 169) * 100)}%
                </div>
            </div>
            <div style="margin-top: 15px; padding: 10px; background: #e6f3ff; border-radius: 6px;">
                <strong>Average Equity: ${avgEquity}%</strong>
            </div>
        `;
        
        document.getElementById('equityResults').innerHTML = results;
        this.updateHeatmap();
    }

    calculateHeadsUpEquity(hand1, hand2) {
        const equities = {
            'AA': { 'KK': 81, 'QQ': 81, 'AK': 93, 'default': 85 },
            'KK': { 'AA': 19, 'QQ': 82, 'AK': 87, 'default': 82 },
            'QQ': { 'AA': 19, 'KK': 18, 'AK': 77, 'default': 80 },
            'AKs': { 'AA': 7, 'KK': 13, 'QQ': 23, 'default': 78 },
            'AKo': { 'AA': 7, 'KK': 13, 'QQ': 23, 'default': 74 }
        };
        
        const hand1Key = hand1.replace(/[so]$/, '');
        const hand2Key = hand2.replace(/[so]$/, '');
        
        if (equities[hand1] && equities[hand1][hand2Key]) {
            return equities[hand1][hand2Key];
        }
        
        return this.calculateHandEquity(hand1);
    }

    updateHeatmap() {
        const heatmapCells = document.querySelectorAll('.heatmap-cell');
        
        heatmapCells.forEach(cell => {
            const hand = cell.dataset.hand;
            let equity = 0;
            
            if (this.selectedHands.has(hand) && this.opponentHands.size > 0) {
                let totalEquity = 0;
                let count = 0;
                
                this.opponentHands.forEach(oppHand => {
                    if (hand !== oppHand) {
                        totalEquity += this.calculateHeadsUpEquity(hand, oppHand);
                        count++;
                    }
                });
                
                equity = count > 0 ? totalEquity / count : 0;
            }
            
            cell.textContent = equity > 0 ? Math.round(equity) + '%' : '';
            
            cell.className = 'heatmap-cell';
            if (equity >= 70) cell.classList.add('equity-high');
            else if (equity >= 60) cell.classList.add('equity-medium-high');
            else if (equity >= 50) cell.classList.add('equity-medium');
            else if (equity >= 40) cell.classList.add('equity-medium-low');
            else if (equity > 0) cell.classList.add('equity-low');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PokerHandRangeSelector();
});