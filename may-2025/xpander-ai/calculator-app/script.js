(function(){
  const display = document.getElementById('display');
  let current = '';
  function updateDisplay() {
    display.textContent = current || '0';
  }
  function append(char) {
    if (char === '.' && current.slice(-1) === '.') return;
    current += char;
    updateDisplay();
  }
  function clearAll() {
    current = '';
    updateDisplay();
  }
  function backspace() {
    current = current.slice(0, -1);
    updateDisplay();
  }
  function calculate() {
    try {
      // eslint-disable-next-line no-eval
      const result = eval(current);
      current = String(result);
    } catch (e) {
      current = 'Error';
    }
    updateDisplay();
  }
  document.querySelector('.buttons').addEventListener('click', e => {
    const target = e.target;
    if (!target.matches('button')) return;
    const action = target.dataset.action;
    const value = target.textContent;
    if (!action) {
      append(value);
    } else if (action === 'clear') {
      clearAll();
    } else if (action === 'backspace') {
      backspace();
    } else if (action === 'operator') {
      append(target.textContent);
    } else if (action === 'equals') {
      calculate();
    }
  });
  document.addEventListener('keydown', e => {
    const key = e.key;
    if (/\d/.test(key) || key === '.') {
      append(key);
    } else if (['+','-','*','/'].includes(key)) {
      append(key);
    } else if (key === 'Enter' || key === '=') {
      e.preventDefault();
      calculate();
    } else if (key === 'Backspace') {
      backspace();
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
      clearAll();
    }
  });
  updateDisplay();
})();