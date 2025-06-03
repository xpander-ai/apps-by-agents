import { mapRange } from '@/utils.js';

/**
 * Fuses audio and motion data into visual parameters.
 */
export class FusionLogic {
  constructor() {
    this.params = { intensity: 0, hue: 0 };
  }

  update(audioData, motion) {
    const sum = audioData.reduce((a, b) => a + b, 0);
    const avg = sum / audioData.length;
    this.params.intensity = mapRange(avg, 0, 255, 0, 1);
    this.params.hue = mapRange(motion.x, -1, 1, 0, 360);
  }

  getParams() {
    return this.params;
  }
}