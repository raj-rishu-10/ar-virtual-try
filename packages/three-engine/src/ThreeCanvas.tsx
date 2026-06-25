import React, { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';

interface ThreeCanvasProps {
  children: React.ReactNode;
  sizing: {
    width: number;
    height: number;
    top: number;
    left: number;
  };
  onCanvas?: (canvas: HTMLCanvasElement) => void;
}

// Inner component to expose the renderer's canvas element via the useThree hook
const CanvasExposer: React.FC<{ onCanvas?: (canvas: HTMLCanvasElement) => void }> = ({ onCanvas }) => {
  const { gl } = useThree();
  useEffect(() => {
    if (onCanvas && gl?.domElement) {
      onCanvas(gl.domElement);
    }
  }, [gl, onCanvas]);
  return null;
};

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ children, sizing, onCanvas }) => {
  return (
    <Canvas
      className="mirrorX"
      style={{
        position: 'fixed',
        zIndex: 2,
        width: sizing.width,
        height: sizing.height,
        top: sizing.top,
        left: sizing.left,
        pointerEvents: 'none'
      }}
      gl={{
        preserveDrawingBuffer: true, // required for screenshots
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      }}
      shadows
      camera={{ position: [0, 0, 0], near: 1, far: 10000 }}
    >
      <Suspense fallback={null}>
        <CanvasExposer onCanvas={onCanvas} />
        {children}
      </Suspense>
    </Canvas>
  );
};
