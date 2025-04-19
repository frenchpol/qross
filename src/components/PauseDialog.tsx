import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Play, Square } from 'lucide-react';
import { useLocation } from '@/context/LocationContext';

interface PauseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onStop: () => void;
}

export const PauseDialog = ({ isOpen, onClose, onStop }: PauseDialogProps) => {
  const { resumeTracking } = useLocation();

  const handleResume = () => {
    resumeTracking();
    onClose();
  };

  const handleStop = () => {
    onStop();
    onClose();
  };

  return (
    <Dialog open={isOpen} modal={true}>
      <DialogContent className="w-[90vw] max-w-md mx-auto" style={{ 
        background: 'hsl(167 49% 7% / 0.8)',
        backdropFilter: 'blur(12px)'
      }}>
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
            Enregistrement en pause
          </DialogTitle>
        </DialogHeader>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Button
            onClick={handleResume}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 button-primary"
          >
            <Play className="mr-2 h-5 w-5" />
            Reprendre l'enregistrement
          </Button>
          <Button
            onClick={handleStop}
            className="w-full h-12 text-white hover:bg-muted/90 button-primary"
            style={{ background: 'hsl(167 37% 16%)' }}
          >
            <Square className="mr-2 h-5 w-5" />
            Arrêter l'enregistrement
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};