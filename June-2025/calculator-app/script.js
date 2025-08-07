const display = document.getElementById('display');
const buttons = document.querySelectorAll('.buttons button');

buttons.forEach(button => {
  const action = button.dataset.action;
  const buttonText = button.textContent;

  button.addEventListener('click', () => {
    if (!action) {
      appendNumber(buttonText);
    } else if (action === 'operator') {
      appendOperator(buttonText);
    } else if (action === 'calculate') {
      calculate();
    } else if (action === 'clear') {
      clearDisplay();
    }
  });
});

function appendNumber(number) {
  display.value += number;
}

function appendOperator(operator) {
  const current = display.value;
  if (current === '' && operator !== '-') return;
  const lastChar = current[current.length - 1];
  if (['+', '-', '*', '/'].includes(lastChar)) {
    display.value = current.slice(0, -1) + operator;
  } else {
    display.value += operator;
  }
}

function calculate() {
  try {
    const result = Function('"use strict";return (' + display.value + ')')();
    display.value = result;
  } catch {
    alert('Invalid expression');
  }
}

function clearDisplay() {
  display.value = '';
}

document.addEventListener('keydown', (event) => {
  const key = event.key;
  if (/\d/.test(key)) {
    appendNumber(key);
  } else if (['+', '-', '*', '/'].includes(key)) {
    appendOperator(key);
  } else if (key === 'Enter') {
    calculate();
  } else if (key === 'Backspace' || key.toLowerCase() === 'c') {
    clearDisplay();
  }
});