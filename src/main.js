import { AudioProcessor } from '@/audioProcessor.js';
import { MotionHandler } from '@/motionHandler.js';
import { FusionLogic } from '@/fusionLogic.js';
import { CanvasPainter } from '@/canvasPainter.js';
import { Perlin } from '@/perlin.js';

window.addEventListener('load', () => {
  const startBtn = document.getElementById('start-btn');
  const canvas = document.getElementById('canvas');
  let painter;

  startBtn.addEventListener('click', async () => {
    startBtn.style.display = 'none';
    const audio = new AudioProcessor();
    await audio.init();
    const motion = new MotionHandler();
    motion.init();
    const fusion = new FusionLogic();
    painter = new CanvasPainter(canvas, new Perlin());
    window.addEventListener('resize', () => painter.resize());

    function animate() {
      const audioData = audio.getFrequencyData();
      const motionData = motion.getMotion();
      fusion.update(audioData, motionData);
      painter.paint(fusion.getParams());
      requestAnimationFrame(animate);
    }
    animate();
  });
});