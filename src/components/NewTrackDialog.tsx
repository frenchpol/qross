import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation } from '@/context/LocationContext';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface NewTrackDialogProps {
  onClose?: () => void;
}

export const NewTrackDialog = ({ onClose }: NewTrackDialogProps) => {
  const [trackName, setTrackName] = useState('');
  const [poiOnly, setPoiOnly] = useState(false);
  const { startTracking } = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const handleStart = () => {
    if (trackName.trim()) {
      startTracking(trackName.trim(), poiOnly);
      setIsOpen(false);
      onClose?.();
    }
  };

  return (
    <Dialog open={isOpen} modal={true}>
      <DialogContent 
        className="w-[90vw] max-w-md mx-auto dialog-content-top"
        style={{ 
          background: 'hsl(167 49% 7% / 0.8)',
          backdropFilter: 'blur(12px)'
        }}
      >
        <DialogHeader className="mb-1">
          <DialogTitle className="text-lg md:text-xl font-bold tracking-tight text-foreground">
            Créer un nouveau parcours
          </DialogTitle>
        </DialogHeader>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <p className="text-sm text-foreground/80 leading-snug -mt-1">
            Pour créer un nouveau parcours, entrez le nom de votre parcours ci-dessous et autorisez la géolocalisation.
          </p>
          <div>
            <Input
              placeholder="Nom du parcours"
              value={trackName}
              onChange={(e) => setTrackName(e.target.value)}
              className="h-10 text-base placeholder:text-foreground/50"
            />
          </div>
          <div className="flex items-center space-x-3 px-1">
            <div className="flex-1 text-right">
              <Label 
                htmlFor="poi-only" 
                className={`text-[13px] leading-[1.1] ${!poiOnly ? 'text-[#ace47c] font-bold' : 'text-foreground/80'}`}
              >
                Parcours +<br />Points d'intérêt
              </Label>
            </div>
            <Switch
              id="poi-only"
              checked={poiOnly}
              onCheckedChange={setPoiOnly}
              className="data-[state=checked]:bg-[#ace47c] data-[state=unchecked]:bg-[#ace47c]"
            />
            <div className="flex-1">
              <Label 
                htmlFor="poi-only" 
                className={`text-[13px] leading-[1.1] ${poiOnly ? 'text-[#ace47c] font-bold' : 'text-foreground/80'}`}
              >
                Points d'intérêt<br />uniquement
              </Label>
            </div>
          </div>
          <div className="flex justify-center pt-1">
            <Button
              onClick={handleStart}
              disabled={!trackName.trim()}
              className="w-full h-12 px-6 text-base font-bold bg-[#ace47c] text-[#0f1a17] hover:bg-[#ace47c]/90 rounded-full button-primary"
            >
              Démarrer l'enregistrement
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};