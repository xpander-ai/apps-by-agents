document.addEventListener('DOMContentLoaded', () => {
  console.log('Prompter App loaded');

  const form = document.getElementById('prompter-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Rewrite button clicked');
  });

  const formalityInput = document.getElementById('formality');
  const formalityValue = document.getElementById('formality-value');
  formalityInput.addEventListener('input', () => {
    formalityValue.textContent = formalityInput.value;
  });
});