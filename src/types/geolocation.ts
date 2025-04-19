/**
 * Geolocation types and interfaces
 */

export interface GeolocationConfig {
  timeout: number;
  updateInterval: number;
  distanceThreshold: number;
  highAccuracy: boolean;
  maxAge: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface GeolocationState {
  isTracking: boolean;
  isPaused: boolean;
  error: GeolocationPositionError | null;
  isLoading: boolean;
}

export interface GeolocationHandlers {
  onSuccess: PositionCallback;
  onError: PositionErrorCallback;
  onStateChange?: (state: GeolocationState) => void;
}