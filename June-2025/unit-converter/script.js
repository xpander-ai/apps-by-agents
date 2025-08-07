function convertLength(value, fromUnit, toUnit) {
  const conversionsToMeters = { m: 1, km: 1000, mi: 1609.34 };
  const meters = value * conversionsToMeters[fromUnit];
  return meters / conversionsToMeters[toUnit];
}

function convertWeight(value, fromUnit, toUnit) {
  const conversionsToKilograms = { kg: 1, lb: 0.453592 };
  const kilograms = value * conversionsToKilograms[fromUnit];
  return kilograms / conversionsToKilograms[toUnit];
}

function convertTemperature(value, fromUnit, toUnit) {
  if (fromUnit === toUnit) return value;
  if (fromUnit === 'C' && toUnit === 'F') return (value * 9) / 5 + 32;
  if (fromUnit === 'F' && toUnit === 'C') return ((value - 32) * 5) / 9;
}

function setupConverter(idPrefix, convertFn) {
  const input = document.getElementById(`${idPrefix}-input`);
  const fromSelect = document.getElementById(`${idPrefix}-from`);
  const toSelect = document.getElementById(`${idPrefix}-to`);
  const button = document.getElementById(`${idPrefix}-convert-btn`);
  const resultOutput = document.getElementById(`${idPrefix}-result`);

  button.addEventListener('click', () => {
    const value = parseFloat(input.value);
    if (isNaN(value)) {
      resultOutput.textContent = '';
      return;
    }
    const result = convertFn(value, fromSelect.value, toSelect.value);
    resultOutput.textContent = result.toFixed(2);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupConverter('length', convertLength);
  setupConverter('weight', convertWeight);
  setupConverter('temperature', convertTemperature);
});