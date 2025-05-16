export interface Coordinates {
  latitude: number;
  longitude: number;
  altitude: number | null;
}

export interface PathPoint {
  coordinates: [number, number];
  altitude: number | null;
  timestamp: number;
}

export interface POI {
  coordinates: [number, number];
  name: string;
  comment: string;
}

export interface LocationState {
  isTracking: boolean;
  isPaused: boolean;
  currentPath: PathPoint[];
  currentLocation: [number, number] | null;
  currentAltitude: number | null;
  trackName: string;
  pois: POI[];
  error: GeolocationPositionError | null;
  isLoading: boolean;
  isPoiOnlyMode: boolean;
}

export interface LocationContextType extends LocationState {
  startTracking: (name: string, poiOnly?: boolean) => void;
  stopTracking: () => void;
  pauseTracking: () => void;
  resumeTracking: () => void;
  addPOI: (poi: POI) => void;
  setPoiOnlyMode: (enabled: boolean) => void;
}