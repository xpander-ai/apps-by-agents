/**
 * Utility functions for mapping and clamping values.
 */
export function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}