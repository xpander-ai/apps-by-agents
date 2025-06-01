/**
 * Convert length between supported units.
 * Supported units: m, km, cm, mm, mi, yd, ft, in.
 *
 * @param {number} value - The numeric value to convert.
 * @param {string} fromUnit - The unit of the input value.
 * @param {string} toUnit - The unit of the output value.
 * @returns {number} - The converted numeric value.
 * @throws {Error} - If an unsupported unit is provided.
 */
export function convertLength(value, fromUnit, toUnit) {
  const unitToMeters = {
    m: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    mi: 1609.344,
    yd: 0.9144,
    ft: 0.3048,
    in: 0.0254,
  };

  const fromFactor = unitToMeters[fromUnit];
  const toFactor = unitToMeters[toUnit];

  if (fromFactor == null) {
    throw new Error(`Unsupported length unit: ${fromUnit}`);
  }
  if (toFactor == null) {
    throw new Error(`Unsupported length unit: ${toUnit}`);
  }

  return (value * fromFactor) / toFactor;
}

/**
 * Convert weight between supported units.
 * Supported units: g, kg, mg, lb, oz.
 *
 * @param {number} value - The numeric value to convert.
 * @param {string} fromUnit - The unit of the input value.
 * @param {string} toUnit - The unit of the output value.
 * @returns {number} - The converted numeric value.
 * @throws {Error} - If an unsupported unit is provided.
 */
export function convertWeight(value, fromUnit, toUnit) {
  const unitToGrams = {
    g: 1,
    kg: 1000,
    mg: 0.001,
    lb: 453.59237,
    oz: 28.349523125,
  };

  const fromFactor = unitToGrams[fromUnit];
  const toFactor = unitToGrams[toUnit];

  if (fromFactor == null) {
    throw new Error(`Unsupported weight unit: ${fromUnit}`);
  }
  if (toFactor == null) {
    throw new Error(`Unsupported weight unit: ${toUnit}`);
  }

  return (value * fromFactor) / toFactor;
}

/**
 * Convert temperature between supported scales.
 * Supported scales: celsius (C), fahrenheit (F), kelvin (K).
 *
 * @param {number} value - The temperature value to convert.
 * @param {string} fromScale - The scale of the input temperature.
 * @param {string} toScale - The scale of the output temperature.
 * @returns {number} - The converted temperature value.
 * @throws {Error} - If an unsupported temperature scale is provided.
 */
export function convertTemperature(value, fromScale, toScale) {
  const normalize = (scale) => {
    switch (scale.toLowerCase()) {
      case 'c':
      case 'celsius':
        return 'celsius';
      case 'f':
      case 'fahrenheit':
        return 'fahrenheit';
      case 'k':
      case 'kelvin':
        return 'kelvin';
      default:
        return null;
    }
  };

  const from = normalize(fromScale);
  const to = normalize(toScale);

  if (!from) {
    throw new Error(`Unsupported temperature scale: ${fromScale}`);
  }
  if (!to) {
    throw new Error(`Unsupported temperature scale: ${toScale}`);
  }

  let celsiusValue;

  // Convert from source to Celsius
  switch (from) {
    case 'celsius':
      celsiusValue = value;
      break;
    case 'fahrenheit':
      celsiusValue = (value - 32) * (5 / 9);
      break;
    case 'kelvin':
      celsiusValue = value - 273.15;
      break;
  }

  // Convert from Celsius to target scale
  switch (to) {
    case 'celsius':
      return celsiusValue;
    case 'fahrenheit':
      return celsiusValue * (9 / 5) + 32;
    case 'kelvin':
      return celsiusValue + 273.15;
  }
}