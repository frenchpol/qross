import { motion } from 'framer-motion';
import { calculateTrackLength, calculateElevationGain, formatDistance, formatAltitude, formatElevation } from '@/utils/track';
import { useLocation } from '@/context/LocationContext';

export const TrackInfo = () => {
  const { isTracking, currentPath, currentAltitude, trackName } = useLocation();

  if (!isTracking || currentPath.length === 0) return null;

  const distance = calculateTrackLength(currentPath.map(point => point.coordinates));
  const elevationGain = calculateElevationGain(currentPath);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="fixed top-24 -left-2 z-10 flex flex-col gap-1.5"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#343f3c]/90 backdrop-blur-sm px-3 py-1.5 rounded-2xl shadow-lg border border-[#ace47c]/10 w-auto min-w-[90px] mb-1"
      >
        <div className="flex flex-col items-center">
          <p className="text-[9px] font-medium text-foreground/70 uppercase tracking-wider">Parcours</p>
          <p className="text-base font-bold text-center" style={{ color: '#ace47c' }}>
            {trackName}
          </p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#343f3c]/90 backdrop-blur-sm px-3 py-1.5 rounded-2xl shadow-lg border border-[#ace47c]/10 w-[90px]"
      >
        <div className="flex flex-col items-center">
          <p className="text-[9px] font-medium text-foreground/70 uppercase tracking-wider">Altitude</p>
          <div className="flex items-baseline justify-center w-full">
            <p className="text-base font-bold tabular-nums text-center" style={{ color: '#ace47c' }}>
              {formatAltitude(currentAltitude).split(' ')[0]}
            </p>
            <span className="ml-0.5 text-xs font-bold" style={{ color: '#ace47c' }}>m</span>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-[#343f3c]/90 backdrop-blur-sm px-3 py-1.5 rounded-2xl shadow-lg border border-[#ace47c]/10 w-[90px]"
      >
        <div className="flex flex-col items-center">
          <p className="text-[9px] font-medium text-foreground/70 uppercase tracking-wider">Distance</p>
          <div className="flex items-baseline justify-center w-full">
            <p className="text-base font-bold tabular-nums text-center" style={{ color: '#ace47c' }}>
              {formatDistance(distance).split(' ')[0]}
            </p>
            <span className="ml-0.5 text-xs font-bold" style={{ color: '#ace47c' }}>
              {formatDistance(distance).split(' ')[1]}
            </span>
          </div>
        </div>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-[#343f3c]/90 backdrop-blur-sm px-3 py-1.5 rounded-2xl shadow-lg border border-[#ace47c]/10 w-[90px]"
      >
        <div className="flex flex-col items-center">
          <p className="text-[9px] font-medium text-foreground/70 uppercase tracking-wider">Dénivelé +</p>
          <div className="flex items-baseline justify-center w-full">
            <p className="text-base font-bold tabular-nums text-center" style={{ color: '#ace47c' }}>
              {formatElevation(elevationGain)}
            </p>
            <span className="ml-0.5 text-xs font-bold" style={{ color: '#ace47c' }}>m</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};