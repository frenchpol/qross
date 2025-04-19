import { toast } from 'sonner';
import { GEOLOCATION } from '@/constants/map';
import type { Coordinates } from '@/types/location';
import * as turf from '@turf/turf';

// Enhanced Kalman filter with adaptive noise parameters
const kalmanFilter = {
  // Process noise - how much we trust the model's predictions
  q: 0.0015, // Reduced for smoother tracking
  // Measurement noise - how much we trust the GPS measurements
  r: 1.2,    // Increased to trust predictions more
  // State estimation uncertainty
  p: [1.0, 1.0], // Separate uncertainty for lat/lng
  // Estimated velocity (in degrees per second)
  v: [0, 0],
  // Last position and timestamp
  lastPos: null as [number, number] | null,
  lastTime: 0,
  // Heading and speed tracking
  heading: null as number | null,
  speed: 0,

  filter(measurement: [number, number], timestamp: number, accuracy: number): [number, number] {
    if (!this.lastPos) {
      this.lastPos = measurement;
      this.lastTime = timestamp;
      return measurement;
    }

    const dt = (timestamp - this.lastTime) / 1000; // Time delta in seconds
    this.lastTime = timestamp;

    // Adapt process noise based on accuracy and movement
    const accuracyFactor = Math.min(1, accuracy / GEOLOCATION.ACCURACY_THRESHOLD);
    const adaptiveQ = this.q * (1 + accuracyFactor);

    // Calculate current speed and heading
    const distance = turf.distance(
      turf.point(this.lastPos),
      turf.point(measurement),
      { units: 'kilometers' }
    ) * 1000; // Convert to meters
    
    const currentSpeed = distance / dt;
    this.speed = this.speed * 0.7 + currentSpeed * 0.3; // Smooth speed changes

    const bearing = turf.bearing(
      turf.point(this.lastPos),
      turf.point(measurement)
    );
    
    if (this.heading === null) {
      this.heading = bearing;
    } else {
      // Smooth heading changes
      const headingDiff = ((bearing - this.heading + 540) % 360) - 180;
      this.heading = (this.heading + headingDiff * 0.3 + 360) % 360;
    }

    // Predict next position based on velocity
    const predicted = [
      this.lastPos[0] + this.v[0] * dt,
      this.lastPos[1] + this.v[1] * dt
    ];

    // Update state uncertainty
    this.p[0] += adaptiveQ;
    this.p[1] += adaptiveQ;

    // Adapt measurement noise based on accuracy and speed
    const speedFactor = Math.min(1, this.speed / 2); // Speed in m/s
    const adaptiveR = this.r * (1 + accuracyFactor) * (1 + speedFactor);

    // Calculate Kalman gains
    const k = [
      this.p[0] / (this.p[0] + adaptiveR),
      this.p[1] / (this.p[1] + adaptiveR)
    ];

    // Update position estimate
    const position = [
      predicted[0] + k[0] * (measurement[0] - predicted[0]),
      predicted[1] + k[1] * (measurement[1] - predicted[1])
    ] as [number, number];

    // Update velocity estimate
    this.v = [
      (position[0] - this.lastPos[0]) / dt,
      (position[1] - this.lastPos[1]) / dt
    ];

    // Update uncertainty
    this.p[0] = (1 - k[0]) * this.p[0];
    this.p[1] = (1 - k[1]) * this.p[1];

    // Apply heading-based smoothing for high-speed movement
    if (this.speed > 1) { // Moving faster than 1 m/s
      const smoothedPosition = turf.destination(
        turf.point(this.lastPos),
        distance,
        this.heading
      );
      position[0] = position[0] * 0.7 + smoothedPosition.geometry.coordinates[0] * 0.3;
      position[1] = position[1] * 0.7 + smoothedPosition.geometry.coordinates[1] * 0.3;
    }

    this.lastPos = position;
    return position;
  },

  reset() {
    this.p = [1.0, 1.0];
    this.v = [0, 0];
    this.lastPos = null;
    this.lastTime = 0;
    this.heading = null;
    this.speed = 0;
  }
};

// Low-pass filter for altitude smoothing
const lowPassFilter = {
  alpha: 0.15, // Reduced for smoother altitude changes
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
};

export const validatePosition = (position: GeolocationPosition): boolean => {
  const { latitude, longitude, accuracy } = position.coords;

  if (isNaN(latitude) || isNaN(longitude)) {
    return false;
  }

  if (accuracy > GEOLOCATION.ACCURACY_THRESHOLD) {
    return false;
  }

  return true;
};

export const extractCoordinates = (position: GeolocationPosition): Coordinates => {
  const { latitude, longitude, altitude, accuracy } = position.coords;
  const coordinates: [number, number] = [longitude, latitude];
  
  // Apply enhanced Kalman filter for position smoothing
  const smoothedCoordinates = kalmanFilter.filter(coordinates, position.timestamp, accuracy);

  // Apply low-pass filter for altitude if available
  const smoothedAltitude = altitude !== null ? lowPassFilter.filter(altitude) : null;

  return {
    latitude: smoothedCoordinates[1],
    longitude: smoothedCoordinates[0],
    altitude: smoothedAltitude
  };
};

const getGeolocationErrorMessage = (error: Error | GeolocationPositionError): string => {
  if (error instanceof GeolocationPositionError) {
    switch (error.code) {
      case GeolocationPositionError.PERMISSION_DENIED:
        return 'Permission refusée. Veuillez activer la géolocalisation.';
      case GeolocationPositionError.POSITION_UNAVAILABLE:
        return 'Position indisponible. Vérifiez votre connexion GPS.';
      case GeolocationPositionError.TIMEOUT:
        return 'Délai d\'attente dépassé. Tentative de reconnexion...';
      default:
        return 'Erreur de géolocalisation';
    }
  }
  return error.message;
};

export const handleLocationError = (error: Error | GeolocationPositionError) => {
  const message = getGeolocationErrorMessage(error);
  
  // Only show toast for non-timeout errors and custom errors
  if (!(error instanceof GeolocationPositionError) || error.code !== GeolocationPositionError.TIMEOUT) {
    toast.error(message, {
      className: 'bg-background/95 border-border/50 text-foreground'
    });
  }
  
  console.error('Geolocation error:', error);
};

export const getGeolocationOptions = (attempt: number = 1): PositionOptions => ({
  enableHighAccuracy: GEOLOCATION.HIGH_ACCURACY,
  timeout: GEOLOCATION.TIMEOUT * attempt,
  maximumAge: GEOLOCATION.MAX_AGE
});

export const resetLocationFilters = () => {
  kalmanFilter.reset();
  lowPassFilter.reset();
};