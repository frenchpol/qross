import { Button } from '@/components/ui/button';
import { useLocation } from '@/context/LocationContext';
import { Play, Square, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { POIDialog } from './POIDialog';
import { TrackStopDialog } from './TrackStopDialog';
import { NewTrackDialog } from './NewTrackDialog';

export const TrackingControls = () => {
  const { isTracking, startTracking, stopTracking, trackName } = useLocation();
  const [isPOIDialogOpen, setIsPOIDialogOpen] = useState(false);
  const [isStopDialogOpen, setIsStopDialogOpen] = useState(false);
  const [isNewTrackDialogOpen, setIsNewTrackDialogOpen] = useState(false);

  const handleStopTracking = () => {
    stopTracking();
    setIsStopDialogOpen(true);
  };

  const handleNewTrack = () => {
    setIsNewTrackDialogOpen(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed bottom-0 left-0 right-0 p-4 flex justify-center items-center gap-4 z-50 pointer-events-none"
      >
        <div className="flex gap-4 pointer-events-auto">
          {!isTracking ? (
            <Button
              onClick={() => startTracking(trackName)}
              className="w-14 h-14 md:w-16 md:h-16 bg-primary hover:bg-primary/90 text-primary-foreground button-control button-primary"
            >
              <Play className="h-6 w-6" />
            </Button>
          ) : (
            <>
              <Button
                onClick={handleStopTracking}
                className="w-14 h-14 md:w-16 md:h-16 bg-primary hover:bg-primary/90 text-primary-foreground button-control button-primary"
              >
                <Square className="h-6 w-6" />
              </Button>
              <Button
                onClick={() => setIsPOIDialogOpen(true)}
                className="w-14 h-14 md:w-16 md:h-16 bg-secondary hover:bg-secondary/90 text-secondary-foreground button-control button-primary"
              >
                <MapPin className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>
      </motion.div>
      <POIDialog isOpen={isPOIDialogOpen} onClose={() => setIsPOIDialogOpen(false)} />
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