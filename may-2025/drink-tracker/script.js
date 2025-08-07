// Initialize drink counters
let drinkCounts = {
    'coke-zero': 0,
    'fanta-zero': 0,
    'sparkling-water': 0
};

// Initialize last consumed times
let lastConsumed = {
    'coke-zero': null,
    'fanta-zero': null,
    'sparkling-water': null
};

// Mock data for demonstration
const mockData = {
    'coke-zero': {
        count: 3,
        lastConsumed: new Date(new Date().setHours(new Date().getHours() - 2))
    },
    'fanta-zero': {
        count: 1,
        lastConsumed: new Date(new Date().setHours(new Date().getHours() - 4))
    },
    'sparkling-water': {
        count: 5,
        lastConsumed: new Date(new Date().setMinutes(new Date().getMinutes() - 30))
    }
};

// DOM Elements
const cokeZeroBtn = document.querySelector('#coke-zero .add-btn');
const fantaZeroBtn = document.querySelector('#fanta-zero .add-btn');
const sparklingWaterBtn = document.querySelector('#sparkling-water .add-btn');
const mockDataToggle = document.getElementById('mock-data-toggle');

// Event Listeners
cokeZeroBtn.addEventListener('click', () => incrementDrink('coke-zero'));
fantaZeroBtn.addEventListener('click', () => incrementDrink('fanta-zero'));
sparklingWaterBtn.addEventListener('click', () => incrementDrink('sparkling-water'));
mockDataToggle.addEventListener('change', toggleMockData);

// Load data from localStorage if available
function loadData() {
    const savedData = localStorage.getItem('drinkTrackerData');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Check if the saved data is from today
        const savedDate = new Date(parsedData.date);
        const today = new Date();
        
        if (savedDate.toDateString() === today.toDateString()) {
            drinkCounts = parsedData.counts;
            
            // Convert saved date strings back to Date objects
            for (const drink in parsedData.lastConsumed) {
                if (parsedData.lastConsumed[drink]) {
                    lastConsumed[drink] = new Date(parsedData.lastConsumed[drink]);
                }
            }
            
            updateUI();
        } else {
            // Reset for a new day
            resetData();
        }
    }
}

// Save data to localStorage
function saveData() {
    const dataToSave = {
        date: new Date(),
        counts: drinkCounts,
        lastConsumed: lastConsumed
    };
    localStorage.setItem('drinkTrackerData', JSON.stringify(dataToSave));
}

// Reset data for a new day
function resetData() {
    drinkCounts = {
        'coke-zero': 0,
        'fanta-zero': 0,
        'sparkling-water': 0
    };
    
    lastConsumed = {
        'coke-zero': null,
        'fanta-zero': null,
        'sparkling-water': null
    };
    
    saveData();
    updateUI();
}

// Increment drink count
function incrementDrink(drinkType) {
    drinkCounts[drinkType]++;
    lastConsumed[drinkType] = new Date();
    
    // Add animation effect
    const drinkElement = document.getElementById(drinkType);
    drinkElement.classList.add('pulse');
    setTimeout(() => {
        drinkElement.classList.remove('pulse');
    }, 500);
    
    saveData();
    updateUI();
}

// Update UI with current counts
function updateUI() {
    // Update individual drink counts
    document.getElementById('coke-zero-count').textContent = drinkCounts['coke-zero'];
    document.getElementById('fanta-zero-count').textContent = drinkCounts['fanta-zero'];
    document.getElementById('sparkling-water-count').textContent = drinkCounts['sparkling-water'];
    
    // Update summary table
    document.getElementById('coke-zero-total').textContent = drinkCounts['coke-zero'];
    document.getElementById('fanta-zero-total').textContent = drinkCounts['fanta-zero'];
    document.getElementById('sparkling-water-total').textContent = drinkCounts['sparkling-water'];
    
    // Update last consumed times
    document.getElementById('coke-zero-time').textContent = formatTime(lastConsumed['coke-zero']);
    document.getElementById('fanta-zero-time').textContent = formatTime(lastConsumed['fanta-zero']);
    document.getElementById('sparkling-water-time').textContent = formatTime(lastConsumed['sparkling-water']);
    
    // Update statistics
    updateStatistics();
}

// Format time for display
function formatTime(date) {
    if (!date) return '-';
    
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) {
        return 'Just now';
    } else if (diffMins < 60) {
        return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
}

// Update statistics section
function updateStatistics() {
    const totalDrinks = drinkCounts['coke-zero'] + drinkCounts['fanta-zero'] + drinkCounts['sparkling-water'];
    document.getElementById('total-drinks').textContent = totalDrinks;
    
    // Find most popular drink
    let mostPopular = '-';
    let maxCount = 0;
    
    for (const drink in drinkCounts) {
        if (drinkCounts[drink] > maxCount) {
            maxCount = drinkCounts[drink];
            mostPopular = formatDrinkName(drink);
        }
    }
    
    if (maxCount === 0) {
        mostPopular = '-';
    }
    
    document.getElementById('most-popular').textContent = mostPopular;
}

// Format drink name for display
function formatDrinkName(drinkId) {
    switch (drinkId) {
        case 'coke-zero':
            return 'Coke Zero';
        case 'fanta-zero':
            return 'Fanta Zero';
        case 'sparkling-water':
            return 'Sparkling Water';
        default:
            return drinkId;
    }
}

// Toggle between real and mock data
function toggleMockData() {
    if (mockDataToggle.checked) {
        // Save current real data
        localStorage.setItem('tempRealData', JSON.stringify({
            counts: {...drinkCounts},
            lastConsumed: {...lastConsumed}
        }));
        
        // Apply mock data
        for (const drink in mockData) {
            drinkCounts[drink] = mockData[drink].count;
            lastConsumed[drink] = mockData[drink].lastConsumed;
        }
    } else {
        // Restore real data
        const realData = JSON.parse(localStorage.getItem('tempRealData'));
        if (realData) {
            drinkCounts = realData.counts;
            
            // Convert saved date strings back to Date objects
            for (const drink in realData.lastConsumed) {
                if (realData.lastConsumed[drink]) {
                    lastConsumed[drink] = new Date(realData.lastConsumed[drink]);
                } else {
                    lastConsumed[drink] = null;
                }
            }
        }
    }
    
    updateUI();
}

// Add pulse animation style
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .pulse {
        animation: pulse 0.5s ease-in-out;
    }
`;
document.head.appendChild(style);

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadData();
});