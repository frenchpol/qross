import { GEOLOCATION_CONFIG } from '@/constants/config';

export const validatePosition = (position: GeolocationPosition): boolean => {
  const { latitude, longitude, accuracy } = position.coords;

  if (isNaN(latitude) || isNaN(longitude)) {
    return false;
  }

  if (accuracy > GEOLOCATION_CONFIG.accuracyThreshold) {
    return false;
  }

  return true;
};

export const validateTrackName = (name: string): boolean => {
  return name.trim().length > 0;
};