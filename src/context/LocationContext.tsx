import React, { createContext, useContext } from 'react';
import { useGeolocation } from '@/hooks/use-geolocation';
import { useTrack } from '@/hooks/use-track';
import type { LocationContextType } from '@/types/location';

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    isTracking,
    isPaused,
    error,
    isLoading,
    getCurrentPosition,
    startTracking: startGeoTracking,
    stopTracking,
    pauseTracking,
    resumeTracking
  } = useGeolocation();

  const {
    currentPath,
    currentLocation,
    currentAltitude,
    pois,
    trackName,
    setTrackName,
    updatePosition,
    addPOI,
    resetTrack
  } = useTrack();

  const handleStartTracking = (name: string) => {
    setTrackName(name);
    resetTrack();
    startGeoTracking({
      onSuccess: (position) => updatePosition(position, isPaused),
      onError: console.error
    });
  };

  return (
    <LocationContext.Provider
      value={{
        isTracking,
        isPaused,
        currentPath,
        currentLocation,
        currentAltitude,
        trackName,
        pois,
        error,
        isLoading,
        startTracking: handleStartTracking,
        stopTracking,
        pauseTracking,
        resumeTracking,
        addPOI
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};