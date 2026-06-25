import React, { useRef, useState, useEffect } from 'react';
import { CameraView } from '../CameraView';
import { LoadingScreen } from '../LoadingScreen';
import { ErrorBoundary } from '../ErrorBoundary';
import { ScreenshotButton } from '../ScreenshotButton';
import { ControlPanel } from '../ControlPanel';
import { ProductSelector } from '../ProductSelector';
import { useFaceTracker, useScreenshot, useFPS } from '@ar-vto/hooks';
import { useVTOStore } from '@ar-vto/store';
import { EARRINGS_PRODUCTS } from '@ar-vto/shared';
import { ThreeCanvas, FaceFollower } from '@ar-vto/three-engine';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import NN from '@ar-vto/face-tracking/src/neuralNets/NN_GLASSES_9.json';

// 3D Earrings Model Renderer
const Earrings3DModel: React.FC<{ modelUrl: string; scaleFactor: number }> = ({ modelUrl, scaleFactor }) => {
  const { scene } = useGLTF(modelUrl) as any;
  const clonedRight = scene.clone();
  const clonedLeft = scene.clone();

  const posX = 65;
  const posY = -35;
  const posZ = -30;

  useEffect(() => {
    clonedRight.position.set(posX, posY, posZ);
    clonedRight.scale.setScalar(8.0 * scaleFactor);
    clonedLeft.position.set(-posX, posY, posZ);
    clonedLeft.scale.set(-8.0 * scaleFactor, 8.0 * scaleFactor, 8.0 * scaleFactor);

    const setupMaterials = (obj: THREE.Object3D) => {
      obj.traverse((node: any) => {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
          if (node.material) {
            node.material.roughness = 0.15;
            node.material.metalness = 0.85;
          }
        }
      });
    };
    setupMaterials(clonedRight);
    setupMaterials(clonedLeft);
  }, [clonedRight, clonedLeft, scaleFactor]);

  return (
    <>
      <primitive object={clonedRight} />
      <primitive object={clonedLeft} />
    </>
  );
};

export const Earrings3DVTO: React.FC = () => {
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

  const selectedProduct = EARRINGS_PRODUCTS.find((p) => p.id === activeEarringsId) || EARRINGS_PRODUCTS[0];

  return (
    <ErrorBoundary>
      <div className="relative w-full h-screen overflow-hidden">
        {!isCameraLoaded && <LoadingScreen message="Loading Earrings 3D VTO..." />}

        <CameraView canvasFaceRef={canvasFaceRef} onResize={setSizing}>
          <ThreeCanvas sizing={sizing} onCanvas={setThreeCanvas}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 10]} intensity={1.2} castShadow />
            <directionalLight position={[-10, 5, -5]} intensity={0.5} />

            <FaceFollower>
              {selectedProduct?.modelUrl && (
                <Earrings3DModel modelUrl={selectedProduct.modelUrl} scaleFactor={scale} />
              )}
            </FaceFollower>
          </ThreeCanvas>
        </CameraView>

        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950/60 border border-white/10 backdrop-blur-md">
          <h1 className="text-white text-sm font-semibold tracking-wider uppercase">Earrings 3D Try-On</h1>
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
            title="3D Earring Settings"
            sliders={[{ label: 'Earring Size', value: scale, min: 0.6, max: 1.8, step: 0.05, onChange: setScale }]}
          >
            <div className="border-t border-white/10 pt-3">
              <span className="text-xs font-medium text-slate-400 block mb-2 font-semibold">Select 3D Model</span>
              <ProductSelector products={EARRINGS_PRODUCTS} selectedProductId={activeEarringsId} onSelect={setActiveEarrings} />
            </div>
          </ControlPanel>
        </div>
      </div>
    </ErrorBoundary>
  );
};
export default Earrings3DVTO;
