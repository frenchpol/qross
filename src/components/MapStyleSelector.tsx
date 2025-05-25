import React from 'react';
import { Button } from '@/components/ui/button';
import { Map, Satellite } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MapStyleSelectorProps {
  currentStyle: 'terrain' | 'satellite';
  onStyleChange: (style: 'terrain' | 'satellite') => void;
}

export const MapStyleSelector = ({ currentStyle, onStyleChange }: MapStyleSelectorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-24 right-4 z-10 flex flex-col gap-2"
      style={{ top: '100px' }} // Position it below the zoom controls
    >
      <Button
        onClick={() => onStyleChange('terrain')}
        className={cn(
          "w-12 h-12 bg-[#343f3c]/90 backdrop-blur-sm hover:bg-[#343f3c] border border-[#ace47c]/10 rounded-xl shadow-lg transition-all duration-200",
          currentStyle === 'terrain' && "border-[#ace47c]/50"
        )}
        title="Terrain"
      >
        <Map className="w-6 h-6" style={{ color: '#ace47c' }} />
      </Button>
      <Button
        onClick={() => onStyleChange('satellite')}
        className={cn(
          "w-12 h-12 bg-[#343f3c]/90 backdrop-blur-sm hover:bg-[#343f3c] border border-[#ace47c]/10 rounded-xl shadow-lg transition-all duration-200",
          currentStyle === 'satellite' && "border-[#ace47c]/50"
        )}
        title="Satellite"
      >
        <Satellite className="w-6 h-6" style={{ color: '#ace47c' }} />
      </Button>
    </motion.div>
  );
};