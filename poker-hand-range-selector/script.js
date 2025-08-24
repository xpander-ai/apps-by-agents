class PokerRangeSelector {
    constructor() {
        this.selectedHands = new Set();
        this.villainHands = new Set();
        this.handStrengths = this.initializeHandStrengths();
        this.totalCombos = 1326; // Total possible starting hand combinations
        this.currentMode = 'hero'; // 'hero' or 'villain'
        
        this.init();
    }

    init() {
        this.createHandGrid();
        this.setupEventListeners();
        this.updateStats();
    }

    // Hand strength rankings based on poker theory
    initializeHandStrengths() {
        const strengths = {};
        
        // Premium hands (Tier 1)
        const premiumHands = ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AQs', 'AJs', 'ATs', 'AKo'];
        premiumHands.forEach(hand => strengths[hand] = 1);
        
        // Strong hands (Tier 2)
        const strongHands = ['TT', '99', '88', 'AQo', 'AJo', 'ATo', 'KQs', 'KJs', 'KTs', 'QJs', 'QTs', 'JTs'];
        strongHands.forEach(hand => strengths[hand] = 2);
        
        // Playable hands (Tier 3)
        const playableHands = ['77', '66', '55', '44', '33', '22', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                              'KQo', 'KJo', 'KTo', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s',
                              'QJo', 'QTo', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s', 'Q4s', 'Q3s', 'Q2s',
                              'JTo', 'J9s', 'J8s', 'J7s', 'J6s', 'J5s', 'J4s', 'J3s', 'J2s',
                              'T9s', 'T8s', 'T7s', 'T6s', 'T5s', 'T4s', 'T3s', 'T2s'];
        playableHands.forEach(hand => strengths[hand] = 3);
        
        // Marginal hands (Tier 4)
        const marginalHands = ['A9o', 'A8o', 'A7o', 'A6o', 'A5o', 'A4o', 'A3o', 'A2o',
                              'K9o', 'K8o', 'K7o', 'K6o', 'K5o', 'K4o', 'K3o', 'K2o',
                              'Q9o', 'Q8o', 'Q7o', 'Q6o', 'Q5o', 'Q4o', 'Q3o', 'Q2o',
                              'J9o', 'J8o', 'J7o', 'J6o', 'J5o', 'J4o', 'J3o', 'J2o',
                              '98s', '97s', '96s', '95s', '94s', '93s', '92s',
                              '87s', '86s', '85s', '84s', '83s', '82s',
                              '76s', '75s', '74s', '73s', '72s',
                              '65s', '64s', '63s', '62s',
                              '54s', '53s', '52s',
                              '43s', '42s',
                              '32s'];
        marginalHands.forEach(hand => strengths[hand] = 4);
        
        // Weak hands (Tier 5) - remaining offsuit hands
        const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
        for (let i = 0; i < ranks.length; i++) {
            for (let j = i + 1; j < ranks.length; j++) {
                const hand = ranks[i] + ranks[j] + 'o';
                if (!strengths[hand]) {
                    strengths[hand] = 5;
                }
            }
        }
        
        return strengths;
    }

    createHandGrid() {
        const grid = document.getElementById('hand-grid');
        const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
        
        grid.innerHTML = '';
        
        for (let i = 0; i < 13; i++) {
            for (let j = 0; j < 13; j++) {
                const cell = document.createElement('div');
                cell.className = 'hand-cell';
                
                let hand;
                if (i === j) {
                    // Pocket pairs
                    hand = ranks[i] + ranks[i];
                } else if (i < j) {
                    // Suited hands (upper right)
                    hand = ranks[i] + ranks[j] + 's';
                } else {
                    // Offsuit hands (lower left)
                    hand = ranks[j] + ranks[i] + 'o';
                }
                
                cell.textContent = hand;
                cell.dataset.hand = hand;
                
                // Add strength class for color coding
                const strength = this.handStrengths[hand] || 5;
                cell.classList.add(`strength-${strength}`);
                
                cell.addEventListener('click', (e) => this.toggleHand(e, hand));
                cell.addEventListener('mouseenter', (e) => this.showHandInfo(e, hand));
                
                grid.appendChild(cell);
            }
        }
    }

    toggleHand(event, hand) {
        const cell = event.target;
        const currentSet = this.currentMode === 'hero' ? this.selectedHands : this.villainHands;
        
        if (currentSet.has(hand)) {
            currentSet.delete(hand);
            cell.classList.remove(`selected-${this.currentMode}`);
        } else {
            currentSet.add(hand);
            cell.classList.add(`selected-${this.currentMode}`);
        }
        
        this.updateStats();
    }

    showHandInfo(event, hand) {
        // Could add tooltip with hand strength info
        const strength = this.handStrengths[hand] || 5;
        const strengthNames = ['', 'Premium', 'Strong', 'Playable', 'Marginal', 'Weak'];
        event.target.title = `${hand} - ${strengthNames[strength]}`;
    }

    setupEventListeners() {
        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.applyPreset(e.target.dataset.range));
        });

        // Percentage slider
        const slider = document.getElementById('range-percentage');
        slider.addEventListener('input', (e) => this.applyPercentageRange(parseInt(e.target.value)));

        // Mode switching (hero/villain)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'v' || e.key === 'V') {
                this.toggleMode();
            }
        });

        // Copy to villain
        document.getElementById('copy-to-villain').addEventListener('click', () => this.copyToVillain());

        // Calculate equity
        document.getElementById('calculate-equity').addEventListener('click', () => this.calculateEquity());
    }

    toggleMode() {
        this.currentMode = this.currentMode === 'hero' ? 'villain' : 'hero';
        document.body.classList.toggle('villain-mode', this.currentMode === 'villain');
        this.updateGridDisplay();
    }

    updateGridDisplay() {
        document.querySelectorAll('.hand-cell').forEach(cell => {
            const hand = cell.dataset.hand;
            cell.classList.remove('selected-hero', 'selected-villain');
            
            if (this.selectedHands.has(hand)) {
                cell.classList.add('selected-hero');
            }
            if (this.villainHands.has(hand)) {
                cell.classList.add('selected-villain');
            }
        });
    }

    applyPreset(preset) {
        this.selectedHands.clear();
        
        const presets = {
            tight: this.getTightRange(),
            loose: this.getLooseRange(),
            aggressive: this.getAggressiveRange(),
            clear: []
        };
        
        if (presets[preset]) {
            presets[preset].forEach(hand => this.selectedHands.add(hand));
        }
        
        this.updateGridDisplay();
        this.updateStats();
    }

    getTightRange() {
        // ~15% of hands - very tight range
        return ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', 'AKs', 'AQs', 'AJs', 'ATs', 'KQs', 'KJs', 'QJs', 'JTs', 'T9s', '98s', '87s', '76s', 'AKo', 'AQo', 'AJo', 'KQo'];
    }

    getLooseRange() {
        // ~35% of hands - loose range
        const loose = [];
        Object.keys(this.handStrengths).forEach(hand => {
            if (this.handStrengths[hand] <= 3) {
                loose.push(hand);
            }
        });
        // Add some marginal hands
        loose.push('A9o', 'A8o', 'A7o', 'K9o', 'K8o', 'Q9o', 'Q8o', 'J9o', 'T8o', '97o', '86o', '75o', '64o', '53o');
        return loose;
    }

    getAggressiveRange() {
        // ~25% of hands - aggressive/polarized range
        const aggressive = [];
        Object.keys(this.handStrengths).forEach(hand => {
            if (this.handStrengths[hand] <= 2) {
                aggressive.push(hand);
            }
        });
        // Add suited connectors and some bluffs
        aggressive.push('T9s', '98s', '87s', '76s', '65s', '54s', '43s', '32s', 'A5s', 'A4s', 'A3s', 'A2s', 'K5s', 'K4s', 'K3s', 'K2s');
        return aggressive;
    }

    applyPercentageRange(percentage) {
        this.selectedHands.clear();
        
        // Sort hands by strength
        const handsByStrength = Object.keys(this.handStrengths).sort((a, b) => {
            return this.handStrengths[a] - this.handStrengths[b];
        });
        
        const targetCombos = Math.floor((percentage / 100) * this.totalCombos);
        let currentCombos = 0;
        
        for (const hand of handsByStrength) {
            const combos = this.getHandCombos(hand);
            if (currentCombos + combos <= targetCombos) {
                this.selectedHands.add(hand);
                currentCombos += combos;
            } else {
                break;
            }
        }
        
        this.updateGridDisplay();
        this.updateStats();
    }

    getHandCombos(hand) {
        if (hand.length === 2) return 6; // Pocket pairs
        if (hand.includes('s')) return 4; // Suited
        if (hand.includes('o')) return 12; // Offsuit
        return 0;
    }

    updateStats() {
        const heroCombos = this.calculateTotalCombos(this.selectedHands);
        const villainCombos = this.calculateTotalCombos(this.villainHands);
        const heroPercentage = ((heroCombos / this.totalCombos) * 100).toFixed(1);
        const villainPercentage = ((villainCombos / this.totalCombos) * 100).toFixed(1);
        
        document.getElementById('combo-count').textContent = heroCombos;
        document.getElementById('percentage-display').textContent = `${heroPercentage}%`;
        document.getElementById('range-percentage').value = heroPercentage;
        
        document.getElementById('hero-combos').textContent = heroCombos;
        document.getElementById('hero-percentage').textContent = `${heroPercentage}%`;
        document.getElementById('villain-combos').textContent = villainCombos;
        document.getElementById('villain-percentage').textContent = `${villainPercentage}%`;
        
        // Update selected hands display
        const selectedHandsDiv = document.getElementById('selected-hands');
        selectedHandsDiv.innerHTML = Array.from(this.selectedHands).sort().map(hand => 
            `<span class="hand-tag">${hand}</span>`
        ).join('');
    }

    calculateTotalCombos(handSet) {
        return Array.from(handSet).reduce((total, hand) => {
            return total + this.getHandCombos(hand);
        }, 0);
    }

    copyToVillain() {
        this.villainHands.clear();
        this.selectedHands.forEach(hand => this.villainHands.add(hand));
        this.updateGridDisplay();
        this.updateStats();
    }

    calculateEquity() {
        if (this.selectedHands.size === 0 || this.villainHands.size === 0) {
            alert('Please select ranges for both Hero and Villain');
            return;
        }

        // Simplified equity calculation (in a real application, you'd use a proper equity calculator)
        const heroEquity = this.estimateEquity(this.selectedHands, this.villainHands);
        const villainEquity = 100 - heroEquity;

        this.displayEquityResults(heroEquity, villainEquity);
        this.createEquityHeatmap();
    }

    estimateEquity(heroRange, villainRange) {
        // Simplified equity estimation based on hand strength
        // In reality, this would require complex combinatorial calculations
        let heroTotal = 0;
        let villainTotal = 0;
        
        heroRange.forEach(hand => {
            const strength = 6 - (this.handStrengths[hand] || 5);
            heroTotal += strength * this.getHandCombos(hand);
        });
        
        villainRange.forEach(hand => {
            const strength = 6 - (this.handStrengths[hand] || 5);
            villainTotal += strength * this.getHandCombos(hand);
        });
        
        const totalStrength = heroTotal + villainTotal;
        return totalStrength > 0 ? (heroTotal / totalStrength * 100) : 50;
    }

    displayEquityResults(heroEquity, villainEquity) {
        document.getElementById('equity-results').style.display = 'block';
        document.getElementById('hero-equity-bar').style.width = `${heroEquity}%`;
        document.getElementById('villain-equity-bar').style.width = `${villainEquity}%`;
        document.getElementById('hero-equity-num').textContent = `${heroEquity.toFixed(1)}%`;
        document.getElementById('villain-equity-num').textContent = `${villainEquity.toFixed(1)}%`;
    }

    createEquityHeatmap() {
        const heatmapContainer = document.getElementById('heatmap-container');
        const heatmapGrid = document.getElementById('heatmap-grid');
        
        heatmapContainer.style.display = 'block';
        heatmapGrid.innerHTML = '';
        
        const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
        
        for (let i = 0; i < 13; i++) {
            for (let j = 0; j < 13; j++) {
                const cell = document.createElement('div');
                cell.className = 'heatmap-cell';
                
                let hand;
                if (i === j) {
                    hand = ranks[i] + ranks[i];
                } else if (i < j) {
                    hand = ranks[i] + ranks[j] + 's';
                } else {
                    hand = ranks[j] + ranks[i] + 'o';
                }
                
                const equity = this.calculateHandEquity(hand);
                cell.textContent = `${equity}%`;
                cell.dataset.equity = equity;
                
                // Color coding based on equity
                if (equity >= 70) cell.classList.add('equity-high');
                else if (equity >= 50) cell.classList.add('equity-medium');
                else cell.classList.add('equity-low');
                
                heatmapGrid.appendChild(cell);
            }
        }
    }

    calculateHandEquity(hand) {
        // Simplified hand vs range equity calculation
        if (!this.villainHands.size) return 50;
        
        const handStrength = 6 - (this.handStrengths[hand] || 5);
        let villainStrengthTotal = 0;
        let villainCombos = 0;
        
        this.villainHands.forEach(villainHand => {
            const strength = 6 - (this.handStrengths[villainHand] || 5);
            const combos = this.getHandCombos(villainHand);
            villainStrengthTotal += strength * combos;
            villainCombos += combos;
        });
        
        const avgVillainStrength = villainCombos > 0 ? villainStrengthTotal / villainCombos : 3;
        const equity = (handStrength / (handStrength + avgVillainStrength)) * 100;
        
        return Math.max(15, Math.min(85, Math.round(equity)));
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new PokerRangeSelector();
    
    // Add keyboard shortcuts info
    document.addEventListener('keydown', (e) => {
        if (e.key === '?' && e.shiftKey) {
            alert('Keyboard Shortcuts:\n\nV - Toggle between Hero/Villain mode\n? - Show this help');
        }
    });
});