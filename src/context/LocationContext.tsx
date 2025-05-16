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
    isPoiOnlyMode,
    setTrackName,
    updatePosition,
    addPOI,
    resetTrack,
    setPoiOnlyMode
  } = useTrack();

  const handleStartTracking = (name: string, poiOnly: boolean = false) => {
    setTrackName(name);
    setPoiOnlyMode(poiOnly);
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
        isPoiOnlyMode,
        startTracking: handleStartTracking,
        stopTracking,
        pauseTracking,
        resumeTracking,
        addPOI,
        setPoiOnlyMode
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