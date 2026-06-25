import React from 'react';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Initializing AR Camera...' }) => {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md transition-opacity duration-300">
      <div className="relative flex flex-col items-center p-8 rounded-2xl bg-white/5 border border-white/10 shadow-2xl">
        {/* Modern premium spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-rose-500/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-rose-500 border-r-rose-500/80 animate-spin"></div>
        </div>
        <p className="mt-6 text-sm font-medium text-slate-200 tracking-wider animate-pulse uppercase">
          {message}
        </p>
        <span className="mt-2 text-xs text-slate-400">
          Please allow webcam access when prompted
        </span>
      </div>
    </div>
  );
};
