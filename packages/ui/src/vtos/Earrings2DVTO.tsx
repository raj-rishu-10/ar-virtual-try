import React, { useRef, useState, useEffect } from 'react';
import { CameraView } from '../CameraView';
import { LoadingScreen } from '../LoadingScreen';
import { ErrorBoundary } from '../ErrorBoundary';
import { ScreenshotButton } from '../ScreenshotButton';
import { ControlPanel } from '../ControlPanel';
import { ProductSelector } from '../ProductSelector';
import { useFaceTracker, useScreenshot, useFPS } from '@ar-vto/hooks';
import { useVTOStore } from '@ar-vto/store';
import { EARRINGS_2D_PRODUCTS } from '@ar-vto/shared';
import { ThreeCanvas, FaceFollower } from '@ar-vto/three-engine';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import NN from '@ar-vto/face-tracking/src/neuralNets/NN_GLASSES_9.json';

// Create a fallback procedural pearl earring texture (for when image assets are missing)
const createProceduralTexture = (): THREE.Texture => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 128, 128);
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(64, 40, 30, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(64, 90, 20, 0, Math.PI * 2);
  ctx.fill();
  return new THREE.CanvasTexture(canvas);
};

// 2D Earring Plane Renderer — useTexture MUST be called unconditionally (Rules of Hooks)
const EarringPlane: React.FC<{ textureUrl: string; isLeft: boolean; scaleFactor: number }> = ({
  textureUrl, isLeft, scaleFactor
}) => {
  // Always call useTexture; use a 1x1 transparent data URL as fallback if url is empty
  const safeUrl = textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const tex = useTexture(safeUrl);

  // If the loaded texture is the 1px fallback placeholder, use procedural instead
  const finalMap = textureUrl ? tex : createProceduralTexture();

  const meshRef = useRef<THREE.Mesh>(null);
  const posX = isLeft ? 63 : -63;
  const posY = -35;
  const posZ = -30;

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(posX, posY, posZ);
      meshRef.current.scale.set(18 * scaleFactor, 18 * scaleFactor, 1);
    }
  }, [posX, posY, posZ, scaleFactor]);

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={finalMap} transparent depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
};

export const Earrings2DVTO: React.FC = () => {
  const canvasFaceRef = useRef<HTMLCanvasElement>(null);
  const [sizing, setSizing] = useState({ width: 640, height: 480, top: 0, left: 0 });
  const [threeCanvas, setThreeCanvas] = useState<HTMLCanvasElement | null>(null);
  const [scale, setScale] = useState<number>(1.0);

  const activeEarringsId = useVTOStore((state) => state.activeEarringsId);
  const setActiveEarrings = useVTOStore((state) => state.setActiveEarrings);
  const isCameraLoaded = useVTOStore((state) => state.isCameraLoaded);
  const isTracking = useVTOStore((state) => state.isTracking);
  const fps = useVTOStore((state) => state.fps);

  useFPS();
  const { error } = useFaceTracker({ canvasRef: canvasFaceRef, NN });
  const capture = useScreenshot();
  const handleCapture = () => capture(threeCanvas);

  const selectedProduct = EARRINGS_2D_PRODUCTS.find((p) => p.id === activeEarringsId) || EARRINGS_2D_PRODUCTS[0];

  return (
    <ErrorBoundary>
      <div className="relative w-full h-screen overflow-hidden">
        {!isCameraLoaded && <LoadingScreen message="Loading Earrings 2D VTO..." />}

        <CameraView canvasFaceRef={canvasFaceRef} onResize={setSizing}>
          <ThreeCanvas sizing={sizing} onCanvas={setThreeCanvas}>
            <ambientLight intensity={0.9} />
            <FaceFollower>
              <EarringPlane textureUrl={selectedProduct.textureUrl || ''} isLeft={true} scaleFactor={scale} />
              <EarringPlane textureUrl={selectedProduct.textureUrl || ''} isLeft={false} scaleFactor={scale} />
            </FaceFollower>
          </ThreeCanvas>
        </CameraView>

        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950/60 border border-white/10 backdrop-blur-md">
          <h1 className="text-white text-sm font-semibold tracking-wider uppercase">Earrings 2D Try-On</h1>
          <div className="text-[10px] text-slate-300 font-mono">
            Status: {isTracking ? <span className="text-green-400 font-bold">Face Tracked</span> : <span className="text-rose-400">Searching Face...</span>}
            <span className="ml-3">FPS: {fps}</span>
          </div>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <ScreenshotButton onClick={handleCapture} />
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-md px-4 flex flex-col gap-4">
          <ControlPanel
            title="Earring Settings"
            sliders={[{ label: 'Earring Scale', value: scale, min: 0.5, max: 2.0, step: 0.1, onChange: setScale }]}
          >
            <div className="border-t border-white/10 pt-3">
              <span className="text-xs font-medium text-slate-400 block mb-2 font-semibold">Select 2D Earring</span>
              <ProductSelector products={EARRINGS_2D_PRODUCTS} selectedProductId={activeEarringsId} onSelect={setActiveEarrings} />
            </div>
          </ControlPanel>
        </div>
      </div>
    </ErrorBoundary>
  );
};
export default Earrings2DVTO;
