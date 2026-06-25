import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface ControlPanelProps {
  title: string;
  sliders?: {
    label: string;
    value: number;
    min?: number;
    max?: number;
    step?: number;
    onChange: (val: number) => void;
  }[];
  showBeforeAfter?: boolean;
  onBeforeAfterToggle?: (val: boolean) => void;
  children?: React.ReactNode;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  title,
  sliders = [],
  showBeforeAfter = false,
  onBeforeAfterToggle,
  children
}) => {
  return (
    <div className="w-full flex flex-col gap-4 p-5 rounded-2xl bg-slate-950/70 border border-white/10 shadow-2xl backdrop-blur-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wider text-slate-100 uppercase">{title}</h3>
        {onBeforeAfterToggle && (
          <button
            onClick={() => onBeforeAfterToggle(!showBeforeAfter)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold tracking-wide transition-all ${
              showBeforeAfter
                ? 'bg-rose-500 border-rose-500 text-white shadow-md'
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
            }`}
          >
            {showBeforeAfter ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showBeforeAfter ? 'Showing Original' : 'Before / After'}
          </button>
        )}
      </div>

      {sliders.map((slider) => (
        <div key={slider.label} className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs font-medium text-slate-400">
            <span>{slider.label}</span>
            <span>{Math.round((slider.value - (slider.min ?? 0)) / ((slider.max ?? 1) - (slider.min ?? 0)) * 100)}%</span>
          </div>
          <input
            type="range"
            min={slider.min ?? 0}
            max={slider.max ?? 1}
            step={slider.step ?? 0.05}
            value={slider.value}
            onChange={(e) => slider.onChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
        </div>
      ))}

      {children}
    </div>
  );
};
