// Application-wide configuration constants
export const APP_CONFIG = {
  APP_NAME: 'QROSS Tracker',
  APP_DESCRIPTION: 'Créer et exporter des parcours GPS',
  APP_AUTHOR: 'QROSS Tracker',
  APP_URL: 'https://app.qross.fr'
} as const;

// Theme configuration
export const THEME = {
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

// Map configuration
export const MAP_CONFIG = {
  defaults: {
    initialLocation: [2.3488, 48.8534] as [number, number], // Paris (fallback)
    zoom: 17,
    maxZoom: 19,
    minZoom: 3
  },
  styles: {
    line: {
      color: THEME.colors.primary,
      width: 3,
      opacity: 0.8
    },
    marker: {
      color: THEME.colors.primary
    }
  }
} as const;

// Geolocation configuration
export const GEOLOCATION_CONFIG = {
  timeout: 10000,
  updateInterval: 5000,     // 5 seconds for walking speed
  distanceThreshold: 5,     // 5 meters - appropriate for walking
  highAccuracy: true,
  maxAge: 2000,            // 2 seconds position caching
  retryAttempts: 3,
  retryDelay: 1000,
  accuracyThreshold: 20     // Accuracy threshold in meters
} as const;