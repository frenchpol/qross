import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import * as turf from '@turf/turf';

interface POI {
  coordinates: [number, number];
  name: string;
  comment: string;
}

interface LocationContextType {
  isTracking: boolean;
  currentPath: Array<{
    coordinates: [number, number];
    altitude: number | null;
    timestamp: number;
  }>;
  startTracking: (name: string) => void;
  stopTracking: () => void;
  currentLocation: [number, number] | null;
  trackName: string;
  addPOI: (poi: POI) => void;
  pois: POI[];
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const POSITION_UPDATE_INTERVAL = 5000; // 5 seconds

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentPath, setCurrentPath] = useState<Array<{
    coordinates: [number, number];
    altitude: number | null;
    timestamp: number;
  }>>([]);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [trackName, setTrackName] = useState('');
  const [pois, setPois] = useState<POI[]>([]);
  const [lastRecordedTime, setLastRecordedTime] = useState<number>(0);

  const handleLocationError = (error: GeolocationPositionError) => {
    toast.error('Impossible d\'accéder à la position. Veuillez activer la géolocalisation.');
    console.error('Geolocation error:', error);
    setIsTracking(false);
  };

  const startTracking = useCallback((name: string) => {
    if (!navigator.geolocation) {
      toast.error('La géolocalisation n\'est pas supportée par votre navigateur');
      return;
    }

    setTrackName(name);
    setPois([]);
    setCurrentPath([]);
    setLastRecordedTime(0);

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, altitude } = position.coords;
        const currentTime = Date.now();
        setCurrentLocation([longitude, latitude]);
        
        // Only record position if enough time has passed or it's the first point
        if (currentTime - lastRecordedTime >= POSITION_UPDATE_INTERVAL || currentPath.length === 0) {
          setCurrentPath((prev) => {
            // Calculate distance from last point if exists
            if (prev.length > 0) {
              const lastPoint = prev[prev.length - 1].coordinates;
              const newPoint = [longitude, latitude] as [number, number];
              const distance = turf.distance(
                turf.point(lastPoint),
                turf.point(newPoint),
                { units: 'meters' }
              );
              
              // Only add point if distance is significant (> 1 meter) or it's been a long time
              if (distance > 1 || currentTime - lastRecordedTime >= POSITION_UPDATE_INTERVAL * 2) {
                setLastRecordedTime(currentTime);
                return [...prev, {
                  coordinates: [longitude, latitude],
                  altitude: altitude || null,
                  timestamp: position.timestamp
                }];
              }
              return prev;
            }
            
            // Always add the first point
            setLastRecordedTime(currentTime);
            return [{
              coordinates: [longitude, latitude],
              altitude: altitude || null,
              timestamp: position.timestamp
            }];
          });
        }
      },
      handleLocationError,
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    setWatchId(id);
    setIsTracking(true);
    toast.success('Début de l\'enregistrement');
  }, [currentPath.length, lastRecordedTime]);

  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
    toast.success('Fin de l\'enregistrement');
  }, [watchId]);

  const addPOI = useCallback((poi: POI) => {
    setPois((prev) => [...prev, poi]);
    toast.success('Point d\'intérêt ajouté');
  }, []);

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return (
    <LocationContext.Provider
      value={{
        isTracking,
        currentPath,
        startTracking,
        stopTracking,
        currentLocation,
        trackName,
        addPOI,
        pois,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};