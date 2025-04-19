import * as turf from '@turf/turf';

export const calculateTrackLength = (coordinates: number[][]): number => {
  if (coordinates.length < 2) return 0;
  return turf.length(turf.lineString(coordinates), { units: 'kilometers' });
};

export const calculateElevationGain = (points: Array<{ altitude: number | null }>): number => {
  if (points.length < 2) return 0;
  
  let gain = 0;
  for (let i = 1; i < points.length; i++) {
    const prevAlt = points[i - 1].altitude;
    const currentAlt = points[i].altitude;
    
    if (prevAlt !== null && currentAlt !== null) {
      const diff = currentAlt - prevAlt;
      if (diff > 0) {
        gain += diff;
      }
    }
  }
  
  return gain;
};

export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(2)} km`;
};

export const formatAltitude = (altitude: number | null): string => {
  if (altitude === null) return '-- m';
  return `${Math.round(altitude)} m`;
};

export const formatElevation = (elevation: number): string => {
  return `${Math.round(elevation)}`;
};