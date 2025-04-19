import { Button } from '@/components/ui/button';
import { useLocation } from '@/context/LocationContext';
import { Pause, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { POIDialog } from './POIDialog';
import { TrackStopDialog } from './TrackStopDialog';
import { NewTrackDialog } from './NewTrackDialog';
import { PauseDialog } from './PauseDialog';

export const TrackingControls = () => {
  const { isTracking, stopTracking, pauseTracking, currentLocation } = useLocation();
  const [isPOIDialogOpen, setIsPOIDialogOpen] = useState(false);
  const [isStopDialogOpen, setIsStopDialogOpen] = useState(false);
  const [isNewTrackDialogOpen, setIsNewTrackDialogOpen] = useState(true);
  const [isPauseDialogOpen, setIsPauseDialogOpen] = useState(false);
  const [capturedLocation, setCapturedLocation] = useState<[number, number] | null>(null);

  const handlePauseTracking = () => {
    pauseTracking();
    setIsPauseDialogOpen(true);
  };

  const handleStopTracking = () => {
    stopTracking();
    setIsPauseDialogOpen(false);
    setIsStopDialogOpen(true);
  };

  const handleNewTrack = () => {
    setIsNewTrackDialogOpen(true);
  };

  const handleAddPOI = () => {
    if (currentLocation) {
      setCapturedLocation(currentLocation);
      setIsPOIDialogOpen(true);
    }
  };

  return (
    <>
      {isTracking && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-[25px] left-0 right-0 p-4 flex justify-center items-center gap-4 z-50 pointer-events-none"
        >
          <div className="flex gap-4 pointer-events-auto">
            <Button
              onClick={handlePauseTracking}
              className="button-control button-primary"
              style={{
                background: '#343f3c',
                width: '128px',
                height: '64px'
              }}
            >
              <Pause style={{ color: '#ace47c', width: '40px', height: '40px' }} />
            </Button>
            <Button
              onClick={handleAddPOI}
              className="button-control button-primary"
              style={{
                background: '#343f3c',
                width: '128px',
                height: '64px'
              }}
            >
              <MapPin style={{ color: '#ace47c', width: '40px', height: '40px' }} />
            </Button>
          </div>
        </motion.div>
      )}
      {capturedLocation && (
        <POIDialog 
          isOpen={isPOIDialogOpen} 
          onClose={() => {
            setIsPOIDialogOpen(false);
            setCapturedLocation(null);
          }}
          capturedLocation={capturedLocation}
        />
      )}
      <PauseDialog 
        isOpen={isPauseDialogOpen}
        onClose={() => setIsPauseDialogOpen(false)}
        onStop={handleStopTracking}
      />
      <TrackStopDialog 
        isOpen={isStopDialogOpen} 
        onClose={() => setIsStopDialogOpen(false)}
        onNewTrack={handleNewTrack}
      />
      {isNewTrackDialogOpen && (
        <NewTrackDialog onClose={() => setIsNewTrackDialogOpen(false)} />
      )}
    </>
  );
};