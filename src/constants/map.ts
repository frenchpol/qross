export const MAP_DEFAULTS = {
  INITIAL_LOCATION: [2.3488, 48.8534] as [number, number], // Paris (fallback)
  ZOOM: 17,
  MAX_ZOOM: 19,
  MIN_ZOOM: 3
} as const;

export const MAP_STYLES = {
  line: {
    color: '#ace47c',
    width: 3,
    opacity: 0.8
  },
  marker: {
    color: '#ace47c'
  }
} as const;

export const GEOLOCATION = {
  TIMEOUT: 10000,
  UPDATE_INTERVAL: 5000,     // Increased to 5 seconds since walking speed doesn't need frequent updates
  DISTANCE_THRESHOLD: 5,     // Reduced to 5 meters - more appropriate for walking
  HIGH_ACCURACY: true,
  MAX_AGE: 2000,            // Increased to 2 seconds to allow for more position caching
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  ACCURACY_THRESHOLD: 20     // Increased slightly since we don't need ultra-precise tracking for walking
} as const;

export const UI = {
  colors: {
    primary: '#ace47c',
    background: 'hsl(167 49% 7% / 0.8)',
    muted: 'hsl(167 37% 16%)'
  },
  button: {
    base: {
      background: 'hsl(167 37% 16%)',
      borderRadius: '24px',
      height: '56px',
      width: '96px'
    },
    icon: {
      color: '#ace47c',
      width: '32px',
      height: '32px'
    }
  }
} as const;