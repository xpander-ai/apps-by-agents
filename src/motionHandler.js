/**
 * Captures device motion or pointer movement and normalizes it.
 */
export class MotionHandler {
  constructor() {
    this.motion = { x: 0, y: 0 };
    this.handleOrientation = this.handleOrientation.bind(this);
  }

  init() {
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', this.handleOrientation);
    } else {
      window.addEventListener('mousemove', (e) => {
        this.motion.x = e.clientX / window.innerWidth;
        this.motion.y = e.clientY / window.innerHeight;
      });
    }
  }

  handleOrientation(event) {
    // beta: -180 to 180, gamma: -90 to 90
    this.motion.x = (event.beta || 0) / 180;
    this.motion.y = (event.gamma || 0) / 90;
  }

  getMotion() {
    return this.motion;
  }
}