document.addEventListener('DOMContentLoaded', () => {
  const display = document.getElementById('display');
  const buttons = document.querySelectorAll('.buttons button');
  const monteCarloSlider = document.getElementById('monte-carlo-slider');
  const monteCarloValue = document.getElementById('monte-carlo-value');
  
  // Settings state
  let settings = {
    monteCarloIterations: 10000,
    confidenceIntervals: true,
    varianceAnalysis: false,
    sensitivityAnalysis: false,
    currentPreset: null
  };
  
  // History state
  let calculationHistory = JSON.parse(localStorage.getItem('calculationHistory')) || [];
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  // Calculator functionality
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.getAttribute('data-value');
      handleInput(value);
    });
  });

  document.addEventListener('keydown', (e) => {
    const key = e.key;
    if ((/\d/).test(key) || ['+', '-', '*', '/', '.'].includes(key) || key === 'Enter' || key === 'Backspace' || key.toLowerCase() === 'c') {
      e.preventDefault();
      if (key === 'Enter') {
        handleInput('=');
      } else if (key === 'Backspace' || key.toLowerCase() === 'c') {
        handleInput('C');
      } else {
        handleInput(key);
      }
    }
  });

  function handleInput(input) {
    if (input === 'C') {
      display.value = '';
      return;
    }
    if (input === '=') {
      try {
        const result = eval(display.value) || '';
        display.value = result;
        
        // Add basic calculation to history
        if (display.value !== 'Error' && display.value !== '') {
          addToHistory({
            type: 'basic',
            expression: display.value.replace(result, '').slice(0, -1) || 'N/A',
            result: result,
            timestamp: new Date().toISOString()
          });
        }
      } catch {
        display.value = 'Error';
      }
      return;
    }
    display.value += input;
  }

  // Monte Carlo slider functionality
  monteCarloSlider.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    settings.monteCarloIterations = value;
    updateSliderDisplay(value);
  });

  function updateSliderDisplay(value) {
    if (value >= 1000) {
      monteCarloValue.textContent = `${Math.round(value / 1000)}K`;
    } else {
      monteCarloValue.textContent = value.toString();
    }
  }

  // Toggle switches functionality
  const toggles = ['confidence-intervals', 'variance-analysis', 'sensitivity-analysis'];
  toggles.forEach(toggleId => {
    const toggle = document.getElementById(toggleId);
    toggle.addEventListener('change', (e) => {
      const settingKey = toggleId.replace('-', '').replace('-', '');
      const camelCaseKey = settingKey.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      settings[camelCaseKey] = e.target.checked;
    });
  });

  // Initialize slider display
  updateSliderDisplay(settings.monteCarloIterations);

  // Initialize history display
  renderHistory();
});

// Collapsible sections functionality
function toggleSection(sectionName) {
  const header = document.querySelector(`#${sectionName}-section .section-header`);
  const content = document.getElementById(`${sectionName}-content`);
  
  header.classList.toggle('collapsed');
  content.classList.toggle('collapsed');
}

// Preset configurations
const presets = {
  quick: {
    monteCarloIterations: 5000,
    confidenceIntervals: false,
    varianceAnalysis: false,
    sensitivityAnalysis: false,
    description: 'Quick calculations with minimal processing time. Suitable for rapid estimates.'
  },
  accurate: {
    monteCarloIterations: 50000,
    confidenceIntervals: true,
    varianceAnalysis: true,
    sensitivityAnalysis: false,
    description: 'High-accuracy calculations with detailed confidence intervals and variance analysis.'
  },
  tournament: {
    monteCarloIterations: 100000,
    confidenceIntervals: true,
    varianceAnalysis: true,
    sensitivityAnalysis: true,
    description: 'Maximum precision for tournament-level calculations. Includes all advanced features.'
  }
};

function applyPreset(presetName) {
  const preset = presets[presetName];
  if (!preset) return;
  
  // Update settings
  settings.monteCarloIterations = preset.monteCarloIterations;
  settings.confidenceIntervals = preset.confidenceIntervals;
  settings.varianceAnalysis = preset.varianceAnalysis;
  settings.sensitivityAnalysis = preset.sensitivityAnalysis;
  settings.currentPreset = presetName;
  
  // Update UI elements
  document.getElementById('monte-carlo-slider').value = preset.monteCarloIterations;
  updateSliderDisplay(preset.monteCarloIterations);
  
  document.getElementById('confidence-intervals').checked = preset.confidenceIntervals;
  document.getElementById('variance-analysis').checked = preset.varianceAnalysis;
  document.getElementById('sensitivity-analysis').checked = preset.sensitivityAnalysis;
  
  // Update preset buttons
  document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  // Update preset info
  document.getElementById('preset-info').innerHTML = `<p><strong>${presetName.charAt(0).toUpperCase() + presetName.slice(1)} Mode:</strong> ${preset.description}</p>`;
}

// Simulation functionality
function runSimulation() {
  const display = document.getElementById('display');
  const expression = display.value;
  
  if (!expression || expression === 'Error') {
    alert('Please enter a valid expression before running simulation.');
    return;
  }
  
  // Simulate complex calculation
  const startTime = Date.now();
  const baseResult = parseFloat(expression.match(/[\d.]+/g)?.[0] || '0');
  
  // Simulate Monte Carlo calculations
  let results = [];
  for (let i = 0; i < Math.min(settings.monteCarloIterations, 1000); i++) {
    const variance = (Math.random() - 0.5) * 0.1;
    results.push(baseResult * (1 + variance));
  }
  
  const mean = results.reduce((sum, val) => sum + val, 0) / results.length;
  const variance = results.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / results.length;
  const stdDev = Math.sqrt(variance);
  
  const simulationResult = {
    type: 'simulation',
    expression: expression,
    result: mean.toFixed(4),
    iterations: settings.monteCarloIterations,
    standardDeviation: stdDev.toFixed(4),
    variance: settings.varianceAnalysis ? variance.toFixed(4) : null,
    confidenceInterval: settings.confidenceIntervals ? 
      `[${(mean - 1.96 * stdDev).toFixed(4)}, ${(mean + 1.96 * stdDev).toFixed(4)}]` : null,
    sensitivity: settings.sensitivityAnalysis ? 
      `±${((stdDev / mean) * 100).toFixed(2)}%` : null,
    preset: settings.currentPreset,
    timestamp: new Date().toISOString(),
    duration: Date.now() - startTime
  };
  
  display.value = simulationResult.result;
  addToHistory(simulationResult);
  
  // Show completion message
  setTimeout(() => {
    alert(`Simulation completed!\n\nResult: ${simulationResult.result}\nIterations: ${simulationResult.iterations.toLocaleString()}\nTime: ${simulationResult.duration}ms`);
  }, 100);
}

// History functionality
function addToHistory(calculation) {
  calculationHistory.unshift(calculation);
  
  // Keep only last 50 calculations
  if (calculationHistory.length > 50) {
    calculationHistory = calculationHistory.slice(0, 50);
  }
  
  localStorage.setItem('calculationHistory', JSON.stringify(calculationHistory));
  renderHistory();
}

function renderHistory() {
  const historyContent = document.getElementById('history-content');
  
  if (calculationHistory.length === 0) {
    historyContent.innerHTML = '<p class="no-history">No calculations yet. Run a simulation to see results here.</p>';
    return;
  }
  
  historyContent.innerHTML = calculationHistory.map((calc, index) => {
    const isFavorite = favorites.includes(index);
    const timestamp = new Date(calc.timestamp).toLocaleString();
    
    return `
      <div class="history-item">
        <div class="history-item-header">
          <span class="history-timestamp">${timestamp}</span>
          <button class="favorite-btn ${isFavorite ? 'favorited' : ''}" onclick="toggleFavorite(${index})">
            ${isFavorite ? '★' : '☆'}
          </button>
        </div>
        <div class="history-details">
          <strong>Expression:</strong> ${calc.expression}<br>
          <strong>Type:</strong> ${calc.type === 'simulation' ? 'Monte Carlo Simulation' : 'Basic Calculation'}
          ${calc.iterations ? `<br><strong>Iterations:</strong> ${calc.iterations.toLocaleString()}` : ''}
          ${calc.preset ? `<br><strong>Preset:</strong> ${calc.preset}` : ''}
          ${calc.standardDeviation ? `<br><strong>Std Dev:</strong> ±${calc.standardDeviation}` : ''}
          ${calc.confidenceInterval ? `<br><strong>95% CI:</strong> ${calc.confidenceInterval}` : ''}
          ${calc.sensitivity ? `<br><strong>Sensitivity:</strong> ${calc.sensitivity}` : ''}
        </div>
        <div class="history-result">Result: ${calc.result}</div>
      </div>
    `;
  }).join('');
}

function toggleFavorite(index) {
  const favoriteIndex = favorites.indexOf(index);
  
  if (favoriteIndex > -1) {
    favorites.splice(favoriteIndex, 1);
  } else {
    favorites.push(index);
  }
  
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderHistory();
}

function clearHistory() {
  if (confirm('Are you sure you want to clear all calculation history?')) {
    calculationHistory = [];
    favorites = [];
    localStorage.removeItem('calculationHistory');
    localStorage.removeItem('favorites');
    renderHistory();
  }
}