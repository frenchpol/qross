import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useLocation } from '@/context/LocationContext';
import { motion } from 'framer-motion';

interface POIDialogProps {
  isOpen: boolean;
  onClose: () => void;
  capturedLocation: [number, number];
}

export const POIDialog = ({ isOpen, onClose, capturedLocation }: POIDialogProps) => {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const { addPOI } = useLocation();

  const handleAddPOI = () => {
    if (name.trim()) {
      addPOI({
        coordinates: capturedLocation,
        name: name.trim(),
        comment: comment.trim(),
      });
      setName('');
      setComment('');
      onClose();
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
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
            Ajouter un Point d'Intérêt
          </DialogTitle>
        </DialogHeader>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Input
            placeholder="Nom du point d'intérêt"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 text-base md:text-lg placeholder:text-foreground/50"
          />
          <Textarea
            placeholder="Description (optionnel)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="resize-none h-24 text-base md:text-lg placeholder:text-foreground/50"
          />
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-background/50 text-foreground hover:bg-accent/50 h-12"
            >
              Annuler
            </Button>
            <Button
              onClick={handleAddPOI}
              disabled={!name.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 button-primary"
            >
              Ajouter
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};