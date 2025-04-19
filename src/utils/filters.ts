// Kalman filter for position smoothing
export const createKalmanFilter = () => ({
  q: 0.0015,
  r: 1.2,
  p: [1.0, 1.0] as [number, number],
  v: [0, 0] as [number, number],
  lastPos: null as [number, number] | null,
  lastTime: 0,
  heading: null as number | null,
  speed: 0,

  reset() {
    this.p = [1.0, 1.0];
    this.v = [0, 0];
    this.lastPos = null;
    this.lastTime = 0;
    this.heading = null;
    this.speed = 0;
  }
});

// Low-pass filter for altitude smoothing
export const createLowPassFilter = (alpha = 0.15) => ({
  alpha,
  lastValue: null as number | null,

  filter(value: number): number {
    if (this.lastValue === null) {
      this.lastValue = value;
      return value;
    }

    const filtered = this.lastValue + this.alpha * (value - this.lastValue);
    this.lastValue = filtered;
    return filtered;
  },

  reset() {
    this.lastValue = null;
  }
});