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
      className="fixed z-10"
      style={{ 
        top: '126px',  // Increased by 30px from 96px
        right: '-5px'   // Changed from 40px to 0px
      }}
    >
      <div className="flex flex-col">
        <Button
          onClick={() => onStyleChange('terrain')}
          className={cn(
            "w-12 h-12 bg-[#343f3c]/90 backdrop-blur-sm hover:bg-[#343f3c] border border-[#ace47c]/10 rounded-b-xl transition-all duration-200",
            currentStyle === 'terrain' && "border-[#ace47c]/50 bg-[#343f3c]"
          )}
          title="Terrain"
        >
          <Map className="w-6 h-6" style={{ color: currentStyle === 'terrain' ? '#ace47c' : '#ace47c/50' }} />
        </Button>
        <Button
          onClick={() => onStyleChange('satellite')}
          className={cn(
            "w-12 h-12 bg-[#343f3c]/90 backdrop-blur-sm hover:bg-[#343f3c] border border-[#ace47c]/10 rounded-t-xl border-t-0 transition-all duration-200",
            currentStyle === 'satellite' && "border-[#ace47c]/50 bg-[#343f3c]"
          )}
          title="Satellite"
        >
          <Satellite className="w-6 h-6" style={{ color: currentStyle === 'satellite' ? '#ace47c' : '#ace47c/50' }} />
        </Button>
      </div>
    </motion.div>
  );
};