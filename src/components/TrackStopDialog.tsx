import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Download, Play } from 'lucide-react';
import { downloadGPXFile } from '@/utils/gpx';
import { toast } from 'sonner';
import { useLocation } from '@/context/LocationContext';

interface TrackStopDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onNewTrack: () => void;
}

export const TrackStopDialog = ({ isOpen, onClose, onNewTrack }: TrackStopDialogProps) => {
  const { currentPath, trackName, pois } = useLocation();

  const handleDownload = () => {
    if (currentPath.length > 0) {
      downloadGPXFile(currentPath, trackName, pois);
      toast.success('Parcours enregistré au format GPX', {
        className: 'bg-background/95 border-border/50 text-foreground',
      });
      onClose();
      onNewTrack(); // Automatically open new track dialog after download
    }
  };

  const handleNewTrack = () => {
    onClose();
    onNewTrack();
  };

  return (
    <Dialog open={isOpen} modal={true}>
      <DialogContent className="dialog-content bg-background/95 backdrop-blur-lg w-[90vw] max-w-md mx-auto">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-primary text-xl md:text-2xl font-bold tracking-tight">
            Enregistrement Terminé
          </DialogTitle>
        </DialogHeader>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex flex-col gap-4">
            <Button
              onClick={handleDownload}
              className="h-12 bg-primary text-primary-foreground hover:bg-primary/90 button-primary"
            >
              <Download className="mr-2 h-5 w-5" />
              Télécharger le GPX
            </Button>
            <Button
              onClick={handleNewTrack}
              className="h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90 button-primary"
            >
              <Play className="mr-2 h-5 w-5" />
              Nouveau Parcours
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};