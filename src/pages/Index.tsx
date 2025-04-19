import { Map } from '@/components/Map';
import { TrackingControls } from '@/components/TrackingControls';
import { LocationProvider } from '@/context/LocationContext';
import { TrackInfo } from '@/components/TrackInfo';
import { Logo } from '@/components/Logo';
import { useLocation } from '@/context/LocationContext';
import { useWakeLock } from '@/hooks/use-wake-lock';

const IndexContent = () => {
  const { isTracking } = useLocation();
  useWakeLock(isTracking);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute top-4 left-0 right-0 z-10 flex justify-center pointer-events-none">
        <Logo />
      </div>
      <Map />
      <TrackInfo />
      <TrackingControls />
    </div>
  );
};

const Index = () => {
  return (
    <LocationProvider>
      <IndexContent />
    </LocationProvider>
  );
};

export default Index;