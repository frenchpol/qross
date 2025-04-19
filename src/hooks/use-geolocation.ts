import { useState, useCallback, useEffect } from 'react';
import { GEOLOCATION_CONFIG } from '@/constants/config';
import { showToast } from '@/utils/toast';
import { validatePosition } from '@/utils/validation';
import type { GeolocationConfig, GeolocationState, GeolocationHandlers } from '@/types/geolocation';

const getGeolocationErrorMessage = (error: Error | GeolocationPositionError): string => {
  if (error instanceof GeolocationPositionError) {
    switch (error.code) {
      case GeolocationPositionError.PERMISSION_DENIED:
        return 'Permission refusée. Veuillez activer la géolocalisation.';
      case GeolocationPositionError.POSITION_UNAVAILABLE:
        return 'Position indisponible. Vérifiez votre connexion GPS.';
      case GeolocationPositionError.TIMEOUT:
        return 'Délai d\'attente dépassé. Tentative de reconnexion...';
      default:
        return 'Erreur de géolocalisation';
    }
  }
  return error.message;
};

const handleLocationError = (error: Error | GeolocationPositionError) => {
  const message = getGeolocationErrorMessage(error);
  
  if (!(error instanceof GeolocationPositionError) || error.code !== GeolocationPositionError.TIMEOUT) {
    showToast.error(message);
  }
  
  console.error('Geolocation error:', error);
};

const getGeolocationOptions = (attempt: number = 1): PositionOptions => ({
  enableHighAccuracy: GEOLOCATION_CONFIG.highAccuracy,
  timeout: GEOLOCATION_CONFIG.timeout * attempt,
  maximumAge: GEOLOCATION_CONFIG.maxAge
});

export const useGeolocation = (config: Partial<GeolocationConfig> = {}) => {
  const [state, setState] = useState<GeolocationState>({
    isTracking: false,
    isPaused: false,
    error: null,
    isLoading: false
  });
  const [watchId, setWatchId] = useState<number | null>(null);
  const [handlers, setHandlers] = useState<GeolocationHandlers | null>(null);

  const mergedConfig = { ...GEOLOCATION_CONFIG, ...config };

  const handlePositionSuccess = (
    position: GeolocationPosition,
    onSuccess: (position: GeolocationPosition) => void,
    onStateChange?: (state: GeolocationState) => void
  ) => {
    setState(prev => ({ ...prev, isLoading: false, error: null }));
    onStateChange?.({ ...state, isLoading: false, error: null });
    onSuccess(position);
  };

  const handlePositionError = (
    error: Error | GeolocationPositionError,
    onError: (error: Error | GeolocationPositionError) => void,
    onStateChange?: (state: GeolocationState) => void
  ) => {
    handleLocationError(error);
    setState(prev => ({ ...prev, isLoading: false, error }));
    onStateChange?.({ ...state, isLoading: false, error });
    onError(error);
  };

  const getCurrentPosition = useCallback(async (handlers: GeolocationHandlers) => {
    const { onSuccess, onError, onStateChange } = handlers;

    if (!navigator.geolocation) {
      const error = new Error('Geolocation is not supported');
      handlePositionError(error, onError, onStateChange);
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));
    onStateChange?.({ ...state, isLoading: true });

    let attempt = 1;
    const tryGetPosition = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!validatePosition(position)) {
            const error = new Error('Invalid position data');
            handlePositionError(error, onError, onStateChange);
            return;
          }
          handlePositionSuccess(position, onSuccess, onStateChange);
        },
        (error) => {
          if (error.code === error.TIMEOUT && attempt < mergedConfig.retryAttempts) {
            attempt++;
            setTimeout(tryGetPosition, mergedConfig.retryDelay);
          } else {
            handlePositionError(error, onError, onStateChange);
          }
        },
        getGeolocationOptions(attempt)
      );
    };

    tryGetPosition();
  }, [mergedConfig, state]);

  const startTracking = useCallback((handlers: GeolocationHandlers) => {
    const { onSuccess, onError, onStateChange } = handlers;
    setHandlers(handlers);

    if (!navigator.geolocation) {
      const error = new Error('Geolocation is not supported');
      handlePositionError(error, onError, onStateChange);
      return;
    }

    setState(prev => ({ ...prev, isTracking: true, isLoading: true }));
    onStateChange?.({ ...state, isTracking: true, isLoading: true });

    const id = navigator.geolocation.watchPosition(
      (position) => {
        if (!validatePosition(position)) {
          const error = new Error('Invalid position data');
          handlePositionError(error, onError, onStateChange);
          return;
        }
        handlePositionSuccess(position, onSuccess, onStateChange);
      },
      (error) => handlePositionError(error, onError, onStateChange),
      getGeolocationOptions()
    );

    setWatchId(id);
    showToast.success('Début de l\'enregistrement');
  }, [state]);

  const pauseTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setState(prev => ({ ...prev, isPaused: true }));
    showToast.info('Enregistrement en pause');
  }, [watchId]);

  const resumeTracking = useCallback(() => {
    if (handlers) {
      startTracking(handlers);
    }
    setState(prev => ({ ...prev, isPaused: false }));
    showToast.success('Reprise de l\'enregistrement');
  }, [handlers, startTracking]);

  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setHandlers(null);
    setState(prev => ({ 
      ...prev, 
      isTracking: false,
      isPaused: false
    }));
    showToast.success('Fin de l\'enregistrement');
  }, [watchId]);

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return {
    ...state,
    getCurrentPosition,
    startTracking,
    stopTracking,
    pauseTracking,
    resumeTracking
  };
};