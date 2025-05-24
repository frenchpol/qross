import React from 'react';
import { Button } from '@/components/ui/button';
import { Map, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { MAP_STYLES_CONFIG } from '@/constants/map';
import { cn } from '@/lib/utils';

interface MapStyleSelectorProps {
  currentStyle: string;
  onStyleChange: (style: string) => void;
}

export const MapStyleSelector = ({ currentStyle, onStyleChange }: MapStyleSelectorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-24 right-4 z-10 flex flex-col gap-2"
    >
      {Object.entries(MAP_STYLES_CONFIG).map(([id, style]) => (
        <Button
          key={id}
          onClick={() => onStyleChange(id)}
          className={cn(
            "w-12 h-12 bg-[#343f3c]/90 backdrop-blur-sm hover:bg-[#343f3c] border border-[#ace47c]/10 rounded-xl shadow-lg transition-all duration-200",
            currentStyle === id && "border-[#ace47c]/50"
          )}
          title={style.name}
        >
          {style.icon === 'map' ? (
            <Map className="w-6 h-6" style={{ color: '#ace47c' }} />
          ) : (
            <Layers className="w-6 h-6" style={{ color: '#ace47c' }} />
          )}
        </Button>
      ))}
    </motion.div>
  );
};