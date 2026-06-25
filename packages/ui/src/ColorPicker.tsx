import React from 'react';

interface ColorOption {
  name: string;
  hex: string;
}

interface ColorPickerProps {
  colors: ColorOption[];
  selectedColor: string;
  onChange: (hex: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ colors, selectedColor, onChange }) => {
  return (
    <div className="flex items-center gap-3 py-2 overflow-x-auto scrollbar-none">
      {colors.map((color) => {
        const isSelected = color.hex.toLowerCase() === selectedColor.toLowerCase();
        return (
          <button
            key={color.hex}
            onClick={() => onChange(color.hex)}
            className={`relative flex-shrink-0 w-8 h-8 rounded-full border border-white/25 transition-all duration-200 ${
              isSelected ? 'scale-115 ring-2 ring-rose-500 ring-offset-2 ring-offset-slate-950' : 'hover:scale-105'
            }`}
            style={{ backgroundColor: color.hex }}
            title={color.name}
            aria-label={color.name}
          >
            {isSelected && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
