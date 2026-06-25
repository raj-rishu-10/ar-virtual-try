import React from 'react';
import { Camera } from 'lucide-react';

interface ScreenshotButtonProps {
  onClick: () => void;
}

export const ScreenshotButton: React.FC<ScreenshotButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-4 bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 rounded-full text-white shadow-2xl backdrop-blur-md transition-all duration-200"
      aria-label="Capture Screenshot"
      title="Capture Screenshot"
    >
      <Camera className="w-6 h-6" />
    </button>
  );
};
