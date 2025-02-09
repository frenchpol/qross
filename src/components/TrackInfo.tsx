import { motion } from 'framer-motion';
import { calculateTrackLength, formatDistance, formatAltitude } from '@/utils/track';
import { useLocation } from '@/context/LocationContext';

export const TrackInfo = () => {
  const { isTracking, currentPath } = useLocation();

  if (!isTracking || currentPath.length === 0) return null;

  const distance = calculateTrackLength(currentPath.map(point => point.coordinates));
  const lastPoint = currentPath[currentPath.length - 1];
  const currentAltitude = lastPoint?.altitude;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-20 left-4 z-10 flex flex-col gap-3"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-border/10"
      >
        <p className="text-xs font-medium text-foreground/70 uppercase tracking-wider">Altitude</p>
        <p className="text-xl font-bold text-foreground tabular-nums">
          {formatAltitude(currentAltitude)}
        </p>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-background/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-border/10"
      >
        <p className="text-xs font-medium text-foreground/70 uppercase tracking-wider">Distance</p>
        <p className="text-xl font-bold text-foreground tabular-nums">
          {formatDistance(distance)}
        </p>
      </motion.div>
    </motion.div>
  );
};