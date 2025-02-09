import { Map } from '@/components/Map';
import { TrackingControls } from '@/components/TrackingControls';
import { LocationProvider } from '@/context/LocationContext';
import { NewTrackDialog } from '@/components/NewTrackDialog';
import { TrackInfo } from '@/components/TrackInfo';
import { Logo } from '@/components/Logo';

const Index = () => {
  return (
    <LocationProvider>
      <div className="relative h-screen w-full bg-gray-50">
        <div className="absolute top-4 left-0 right-0 z-10 flex justify-center">
          <Logo />
        </div>
        <Map />
        <TrackInfo />
        <TrackingControls />
        <NewTrackDialog />
      </div>
    </LocationProvider>
  );
};

export default Index;