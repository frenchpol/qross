import * as turf from '@turf/turf';

export const calculateTrackLength = (coordinates: number[][]): number => {
  if (coordinates.length < 2) return 0;
  return turf.length(turf.lineString(coordinates), { units: 'kilometers' });
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