import React, { useEffect, useState } from 'react';

interface Sizing {
  width: number;
  height: number;
  top: number;
  left: number;
}

interface CameraViewProps {
  canvasFaceRef: React.RefObject<HTMLCanvasElement>;
  videoRef?: React.RefObject<HTMLVideoElement>;
  children?: React.ReactNode;
  onResize?: (sizing: Sizing) => void;
}

export const CameraView: React.FC<CameraViewProps> = ({
  canvasFaceRef,
  videoRef,
  children,
  onResize
}) => {
  const [sizing, setSizing] = useState<Sizing>({
    width: window.innerWidth,
    height: window.innerHeight,
    top: 0,
    left: 0
  });

  const computeSizing = () => {
    const height = window.innerHeight;
    const wWidth = window.innerWidth;
    // Keep it responsive: full-width on mobile, bounded on desktop for better performance
    const width = wWidth < 768 ? wWidth : Math.min(wWidth, height * 0.75);
    const top = 0;
    const left = (wWidth - width) / 2;
    return { width, height, top, left };
  };

  useEffect(() => {
    const handleResize = () => {
      const newSizing = computeSizing();
      setSizing(newSizing);
      onResize?.(newSizing);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    // Initial compute
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [onResize]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 flex justify-center items-center">
      {/* Hidden HTML5 video for stream feed */}
      {videoRef && (
        <video
          ref={videoRef}
          className="hidden"
          playsInline
          muted
          autoPlay
        />
      )}

      {/* WebAR.rocks.face output canvas */}
      <canvas
        ref={canvasFaceRef}
        className="absolute mirrorX"
        style={{
          width: sizing.width,
          height: sizing.height,
          top: sizing.top,
          left: sizing.left,
          zIndex: 1
        }}
        width={sizing.width}
        height={sizing.height}
      />

      {/* R3F Canvas or Custom overlays injected here */}
      <div
        className="absolute mirrorX"
        style={{
          width: sizing.width,
          height: sizing.height,
          top: sizing.top,
          left: sizing.left,
          zIndex: 2,
          pointerEvents: 'none'
        }}
      >
        {children}
      </div>
    </div>
  );
};
