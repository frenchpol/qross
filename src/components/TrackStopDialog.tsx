import React, { useState } from 'react';
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
  const [showExportDialog, setShowExportDialog] = useState(false);

  const handleDownload = () => {
    if (currentPath.length > 0) {
      downloadGPXFile(currentPath, trackName, pois);
      setShowExportDialog(true);
    }
  };

  const handleExportConfirm = () => {
    setShowExportDialog(false);
    onClose();
    onNewTrack();
  };

  if (showExportDialog) {
    return (
      <Dialog open={true} modal={true}>
        <DialogContent 
          className="w-[90vw] max-w-md mx-auto dialog-content-top"
          style={{ 
            background: 'hsl(167 49% 7% / 0.8)',
            backdropFilter: 'blur(12px)'
          }}
        >
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
              Fichier GPX exporté
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <Button
              onClick={handleExportConfirm}
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 button-primary"
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} modal={true}>
      <DialogContent 
        className="w-[90vw] max-w-md mx-auto dialog-content-top"
        style={{ 
          background: 'hsl(167 49% 7% / 0.8)',
          backdropFilter: 'blur(12px)'
        }}
      >
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
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
              onClick={handleExportConfirm}
              className="h-12 text-white hover:bg-muted/90 button-primary"
              style={{ background: 'hsl(167 37% 16%)' }}
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