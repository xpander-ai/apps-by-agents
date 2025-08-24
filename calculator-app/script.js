document.addEventListener('DOMContentLoaded', () => {
  const display = document.getElementById('display');
  const buttons = document.querySelectorAll('.buttons button');
  const toggleSettingsBtn = document.getElementById('toggle-settings');
  const panelContent = document.getElementById('panel-content');
  const iterationsSlider = document.getElementById('monte-carlo-iterations');
  const iterationsValue = document.getElementById('iterations-value');
  const presetButtons = document.querySelectorAll('.preset-btn');
  const sectionHeaders = document.querySelectorAll('.section-header');
  const monteCarloBtn = document.getElementById('monte-carlo-btn');
  const clearHistoryBtn = document.getElementById('clear-history');
  const historyContent = document.getElementById('history-content');

  let calculationHistory = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
  let favoriteCalculations = new Set(JSON.parse(localStorage.getItem('favoriteCalculations') || '[]'));
  
  let settings = {
    iterations: 10000,
    statisticalAnalysis: true,
    confidenceIntervals: false,
    varianceAnalysis: false
  };

  // Initialize UI
  updateHistoryDisplay();
  updateIterationsDisplay();

  // Basic calculator functionality
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.getAttribute('data-value');
      if (value) {
        handleInput(value);
      }
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
      calculate();
      return;
    }
    display.value += input;
  }

  function calculate() {
    try {
      const expression = display.value;
      const result = eval(expression);
      display.value = result || '';
      
      // Add to history
      addToHistory(expression, result);
    } catch {
      display.value = 'Error';
    }
  }

  // Monte Carlo simulation
  monteCarloBtn.addEventListener('click', () => {
    if (!display.value || display.value === 'Error') {
      display.value = 'Enter expression first';
      return;
    }
    
    const expression = display.value;
    runMonteCarloSimulation(expression);
  });

  function runMonteCarloSimulation(expression) {
    const iterations = settings.iterations;
    const results = [];
    const startTime = performance.now();

    // Simulate variations in the calculation
    for (let i = 0; i < iterations; i++) {
      try {
        // Add small random variations to simulate uncertainty
        const variation = 1 + (Math.random() - 0.5) * 0.01; // ±0.5% variation
        const modifiedExpression = expression.replace(/\d+\.?\d*/g, (match) => {
          return (parseFloat(match) * variation).toFixed(4);
        });
        
        const result = eval(modifiedExpression);
        if (!isNaN(result)) {
          results.push(result);
        }
      } catch (e) {
        // Skip invalid iterations
      }
    }

    const endTime = performance.now();
    const executionTime = endTime - startTime;

    if (results.length === 0) {
      display.value = 'Simulation failed';
      return;
    }

    // Calculate statistics
    const mean = results.reduce((a, b) => a + b, 0) / results.length;
    const variance = results.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / results.length;
    const stdDev = Math.sqrt(variance);
    
    let simulationResult = {
      expression: expression,
      mean: mean,
      iterations: iterations,
      executionTime: executionTime.toFixed(2) + 'ms',
      isMonteCarlo: true
    };

    if (settings.statisticalAnalysis) {
      simulationResult.stdDev = stdDev;
      simulationResult.min = Math.min(...results);
      simulationResult.max = Math.max(...results);
    }

    if (settings.confidenceIntervals) {
      const sortedResults = results.sort((a, b) => a - b);
      const lowerIndex = Math.floor(results.length * 0.025);
      const upperIndex = Math.floor(results.length * 0.975);
      simulationResult.confidenceInterval = {
        lower: sortedResults[lowerIndex],
        upper: sortedResults[upperIndex]
      };
    }

    if (settings.varianceAnalysis) {
      simulationResult.variance = variance;
      simulationResult.coefficientOfVariation = (stdDev / Math.abs(mean)) * 100;
    }

    display.value = mean.toFixed(6);
    addToHistory(expression, simulationResult);
  }

  // Settings panel functionality
  toggleSettingsBtn.addEventListener('click', () => {
    panelContent.classList.toggle('collapsed');
    toggleSettingsBtn.textContent = panelContent.classList.contains('collapsed') ? '▶' : '▼';
  });

  // Section collapsing
  sectionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const sectionName = header.getAttribute('data-section');
      const content = document.getElementById(sectionName + '-content');
      const icon = header.querySelector('.collapse-icon');
      
      content.classList.toggle('collapsed');
      icon.classList.toggle('rotated');
    });
  });

  // Iterations slider
  iterationsSlider.addEventListener('input', (e) => {
    settings.iterations = parseInt(e.target.value);
    updateIterationsDisplay();
  });

  function updateIterationsDisplay() {
    iterationsValue.textContent = settings.iterations.toLocaleString();
  }

  // Preset buttons
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.getAttribute('data-preset');
      
      // Remove active class from all buttons
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Set iterations based on preset
      switch (preset) {
        case 'quick':
          settings.iterations = 5000;
          break;
        case 'accurate':
          settings.iterations = 50000;
          break;
        case 'tournament':
          settings.iterations = 10000;
          break;
      }
      
      iterationsSlider.value = settings.iterations;
      updateIterationsDisplay();
    });
  });

  // Toggle switches
  const toggles = ['statistical-analysis', 'confidence-intervals', 'variance-analysis'];
  toggles.forEach(toggleId => {
    const toggle = document.getElementById(toggleId);
    toggle.addEventListener('change', () => {
      const settingName = toggleId.replace('-', '').replace('-', '');
      const camelCase = settingName.replace(/-./g, x => x[1].toUpperCase());
      settings[camelCase] = toggle.checked;
    });
  });

  // History functionality
  function addToHistory(expression, result) {
    const historyItem = {
      id: Date.now(),
      expression: expression,
      result: result,
      timestamp: new Date().toLocaleString(),
      isFavorite: false
    };

    calculationHistory.unshift(historyItem);
    
    // Limit history to 50 items
    if (calculationHistory.length > 50) {
      calculationHistory = calculationHistory.slice(0, 50);
    }

    localStorage.setItem('calculationHistory', JSON.stringify(calculationHistory));
    updateHistoryDisplay();
  }

  function updateHistoryDisplay() {
    if (calculationHistory.length === 0) {
      historyContent.innerHTML = '<div class="history-placeholder">No calculations yet</div>';
      return;
    }

    historyContent.innerHTML = calculationHistory.map(item => {
      const resultDisplay = typeof item.result === 'object' && item.result.isMonteCarlo
        ? `Monte Carlo: ${item.result.mean.toFixed(6)} (${item.result.iterations.toLocaleString()} iterations)`
        : item.result;

      const favoriteClass = item.isFavorite ? 'favorited' : '';
      
      return `
        <div class="history-item" data-id="${item.id}">
          <div class="history-item-content">
            <div class="history-item-expression">${item.expression}</div>
            <div class="history-item-result">${resultDisplay}</div>
            <div class="history-item-timestamp">${item.timestamp}</div>
          </div>
          <div class="history-item-actions">
            <button class="favorite-btn ${favoriteClass}" onclick="toggleFavorite(${item.id})">★</button>
            <button class="reuse-btn" onclick="reuseCalculation('${item.expression}')">↻</button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Global functions for history actions
  window.toggleFavorite = function(id) {
    const item = calculationHistory.find(item => item.id === id);
    if (item) {
      item.isFavorite = !item.isFavorite;
      
      if (item.isFavorite) {
        favoriteCalculations.add(id);
      } else {
        favoriteCalculations.delete(id);
      }
      
      localStorage.setItem('calculationHistory', JSON.stringify(calculationHistory));
      localStorage.setItem('favoriteCalculations', JSON.stringify([...favoriteCalculations]));
      updateHistoryDisplay();
    }
  };

  window.reuseCalculation = function(expression) {
    display.value = expression;
  };

  // Clear history
  clearHistoryBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all calculation history?')) {
      calculationHistory = [];
      favoriteCalculations.clear();
      localStorage.removeItem('calculationHistory');
      localStorage.removeItem('favoriteCalculations');
      updateHistoryDisplay();
    }
  });
});