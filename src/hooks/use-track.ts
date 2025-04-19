import { useState, useCallback } from 'react';
import * as turf from '@turf/turf';
import { GEOLOCATION_CONFIG } from '@/constants/config';
import { createKalmanFilter, createLowPassFilter } from '@/utils/filters';
import type { PathPoint, POI } from '@/types/location';

const kalmanFilter = createKalmanFilter();
const altitudeFilter = createLowPassFilter();

export const useTrack = () => {
  const [currentPath, setCurrentPath] = useState<PathPoint[]>([]);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [currentAltitude, setCurrentAltitude] = useState<number | null>(null);
  const [pois, setPois] = useState<POI[]>([]);
  const [trackName, setTrackName] = useState('');
  const [lastRecordedTime, setLastRecordedTime] = useState(0);
  const [lastPausePoint, setLastPausePoint] = useState<PathPoint | null>(null);

  const shouldAddPoint = useCallback((
    newLocation: [number, number],
    accuracy: number,
    currentTime: number
  ): boolean => {
    if (currentPath.length === 0) return true;

    const lastPoint = currentPath[currentPath.length - 1].coordinates;
    const distance = turf.distance(
      turf.point(lastPoint),
      turf.point(newLocation),
      { units: 'meters' }
    );

    return (
      (distance > GEOLOCATION_CONFIG.distanceThreshold && 
       accuracy <= GEOLOCATION_CONFIG.accuracyThreshold) || 
      (currentTime - lastRecordedTime >= GEOLOCATION_CONFIG.updateInterval * 3)
    );
  }, [currentPath, lastRecordedTime]);

  const updatePosition = useCallback((position: GeolocationPosition, isPaused: boolean) => {
    const { latitude, longitude, altitude, accuracy } = position.coords;
    const newLocation: [number, number] = [longitude, latitude];
    const currentTime = Date.now();

    // Always update current position
    setCurrentLocation(newLocation);
    setCurrentAltitude(altitude);

    if (isPaused) {
      if (!lastPausePoint && currentPath.length > 0) {
        setLastPausePoint(currentPath[currentPath.length - 1]);
      }
      return;
    }

    // Handle resuming from pause
    if (lastPausePoint) {
      const newPoint: PathPoint = {
        coordinates: newLocation,
        altitude,
        timestamp: position.timestamp
      };
      
      setCurrentPath(prev => [...prev, newPoint]);
      setLastPausePoint(null);
      setLastRecordedTime(currentTime);
      return;
    }

    // Check if we should add a new point
    if (shouldAddPoint(newLocation, accuracy, currentTime)) {
      setLastRecordedTime(currentTime);
      const newPoint: PathPoint = {
        coordinates: newLocation,
        altitude,
        timestamp: position.timestamp
      };
      setCurrentPath(prev => [...prev, newPoint]);
    }
  }, [currentPath, lastRecordedTime, lastPausePoint, shouldAddPoint]);

  const addPOI = useCallback((poi: POI) => {
    setPois(prev => [...prev, poi]);
  }, []);

  const resetTrack = useCallback(() => {
    setCurrentPath([]);
    setPois([]);
    setLastRecordedTime(0);
    setLastPausePoint(null);
    kalmanFilter.reset();
    altitudeFilter.reset();
  }, []);

  return {
    currentPath,
    currentLocation,
    currentAltitude,
    pois,
    trackName,
    setTrackName,
    updatePosition,
    addPOI,
    resetTrack
  };
};