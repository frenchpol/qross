import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation } from '@/context/LocationContext';
import { motion } from 'framer-motion';

interface NewTrackDialogProps {
  onClose?: () => void;
}

export const NewTrackDialog = ({ onClose }: NewTrackDialogProps) => {
  const [trackName, setTrackName] = useState('');
  const { startTracking } = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const handleStart = () => {
    if (trackName.trim()) {
      startTracking(trackName);
      setIsOpen(false);
      onClose?.();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <Dialog open={isOpen} modal={true}>
      <DialogContent className="dialog-content bg-background/95 backdrop-blur-lg w-[90vw] max-w-md mx-auto">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-primary text-xl md:text-2xl font-bold tracking-tight">
            Créer un Nouveau Parcours
          </DialogTitle>
        </DialogHeader>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <Input
              placeholder="Nom du Nouveau Parcours"
              value={trackName}
              onChange={(e) => setTrackName(e.target.value)}
              className="h-12 text-base md:text-lg placeholder:text-foreground/50"
            />
          </div>
          <div className="flex flex-col md:flex-row justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="bg-background/50 text-foreground hover:bg-accent/50 h-12 w-full md:w-auto"
            >
              Annuler
            </Button>
            <Button
              onClick={handleStart}
              disabled={!trackName.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-full md:w-auto button-primary"
            >
              Démarrer l'enregistrement
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};