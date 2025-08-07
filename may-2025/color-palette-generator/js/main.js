import { generatePalette } from './palette.js';

const paletteContainer = document.getElementById('palette');
const generateBtn = document.getElementById('generate');

generateBtn.addEventListener('click', () => {
  const colors = generatePalette(5);
  renderPalette(colors);
});

function renderPalette(colors) {
  paletteContainer.innerHTML = '';
  colors.forEach((color) => {
    const swatch = document.createElement('div');
    swatch.className = 'color-swatch';
    swatch.style.backgroundColor = color;

    const code = document.createElement('div');
    code.className = 'color-code';
    code.textContent = color;
    code.addEventListener('click', () => {
      copyToClipboard(color);
      const original = code.textContent;
      code.textContent = 'Copied!';
      setTimeout(() => {
        code.textContent = original;
      }, 1000);
    });

    swatch.appendChild(code);
    paletteContainer.appendChild(swatch);
  });
}

// Initial render
renderPalette(generatePalette(5));

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch((err) => console.error('Copy failed', err));
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}