document.addEventListener('DOMContentLoaded', () => {
  const display = document.getElementById('display');
  const buttons = document.querySelectorAll('.buttons button');

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
        display.value = eval(display.value) || '';
      } catch {
        display.value = 'Error';
      }
      return;
    }
    display.value += input;
  }
});