import { mapRange } from '@/utils.js';

/**
 * Renders visuals on a canvas using Perlin noise and fused parameters.
 */
export class CanvasPainter {
  constructor(canvas, perlin) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.perlin = perlin;
    this.resize();
    this.time = 0;
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  paint(params) {
    const { intensity, hue } = params;
    this.time += 0.005;
    const imageData = this.ctx.createImageData(this.width, this.height);
    const data = imageData.data;
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const n = this.perlin.noise(
          x / 100 + this.time * intensity,
          y / 100 + this.time * intensity
        );
        const v = mapRange(n, -1, 1, 0, 255);
        const i = (x + y * this.width) * 4;
        data[i] = v * intensity * Math.cos((hue * Math.PI) / 180);
        data[i + 1] = v;
        data[i + 2] = v * intensity * Math.sin((hue * Math.PI) / 180);
        data[i + 3] = 255;
      }
    }
    this.ctx.putImageData(imageData, 0, 0);
  }
}