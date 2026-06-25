import React, { useRef, useState, useEffect } from 'react';
import { CameraView } from '../CameraView';
import { LoadingScreen } from '../LoadingScreen';
import { ErrorBoundary } from '../ErrorBoundary';
import { ScreenshotButton } from '../ScreenshotButton';
import { ControlPanel } from '../ControlPanel';
import { ProductSelector } from '../ProductSelector';
import { useFaceTracker, useScreenshot, useFPS } from '@ar-vto/hooks';
import { useVTOStore } from '@ar-vto/store';
import { SPORTS_PAINT_PRODUCTS } from '@ar-vto/shared';
import { ThreeCanvas, FaceFollower } from '@ar-vto/three-engine';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import NN from '@ar-vto/face-tracking/src/neuralNets/NN_FULLMAKEUP_4.json';

// Sports Paint Face Mesh Renderer
const SportsPaintMesh: React.FC<{ textureUrl: string }> = ({ textureUrl }) => {
  const { scene } = useGLTF('/assets/flexibleMask2/face.glb') as any;
  const paintTexture = useTexture(textureUrl);
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!scene) return;
    let faceMesh: THREE.Mesh | null = null;
    scene.traverse((child: any) => {
      if (child.isMesh) faceMesh = child;
    });
    if (faceMesh && meshRef.current) {
      const targetMesh = meshRef.current;
      targetMesh.geometry = (faceMesh as THREE.Mesh).geometry.clone();
      (paintTexture as THREE.Texture).flipY = false;
      targetMesh.material = new THREE.MeshBasicMaterial({
        map: paintTexture,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        blending: THREE.NormalBlending
      });
    }
  }, [scene, paintTexture]);

  return <mesh ref={meshRef} />;
};

export const SportsMakeupVTO: React.FC = () => {
  const canvasFaceRef = useRef<HTMLCanvasElement>(null);
  const [sizing, setSizing] = useState({ width: 640, height: 480, top: 0, left: 0 });
  const [threeCanvas, setThreeCanvas] = useState<HTMLCanvasElement | null>(null);

  const activeSportsPaintId = useVTOStore((state) => state.activeSportsPaintId);
  const setActiveSportsPaint = useVTOStore((state) => state.setActiveSportsPaint);
  const isCameraLoaded = useVTOStore((state) => state.isCameraLoaded);
  const isTracking = useVTOStore((state) => state.isTracking);
  const fps = useVTOStore((state) => state.fps);

  useFPS();
  const { error } = useFaceTracker({ canvasRef: canvasFaceRef, NN });
  const capture = useScreenshot();
  const handleCapture = () => capture(threeCanvas);

  const selectedProduct = SPORTS_PAINT_PRODUCTS.find((p) => p.id === activeSportsPaintId) || SPORTS_PAINT_PRODUCTS[0];
  const texturePath = selectedProduct.textureUrl || '/assets/makeupSport/sportMakeup.png';

  return (
    <ErrorBoundary>
      <div className="relative w-full h-screen overflow-hidden">
        {!isCameraLoaded && <LoadingScreen message="Loading Sports Makeup VTO..." />}

        <CameraView canvasFaceRef={canvasFaceRef} onResize={setSizing}>
          <ThreeCanvas sizing={sizing} onCanvas={setThreeCanvas}>
            <ambientLight intensity={0.9} />
            <FaceFollower>
              <SportsPaintMesh textureUrl={texturePath} />
            </FaceFollower>
          </ThreeCanvas>
        </CameraView>

        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950/60 border border-white/10 backdrop-blur-md">
          <h1 className="text-white text-sm font-semibold tracking-wider uppercase">Sports Face Paint VTO</h1>
          <div className="text-[10px] text-slate-300 font-mono">
            Status: {isTracking ? <span className="text-green-400 font-bold">Face Tracked</span> : <span className="text-rose-400">Searching Face...</span>}
            <span className="ml-3">FPS: {fps}</span>
          </div>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <ScreenshotButton onClick={handleCapture} />
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-md px-4 flex flex-col gap-4">
          <ControlPanel title="Face Paint Selection">
            <ProductSelector products={SPORTS_PAINT_PRODUCTS} selectedProductId={activeSportsPaintId} onSelect={setActiveSportsPaint} />
          </ControlPanel>
        </div>
      </div>
    </ErrorBoundary>
  );
};
export default SportsMakeupVTO;
