import React, { useRef, useState, useEffect } from 'react';
import { CameraView } from '../CameraView';
import { LoadingScreen } from '../LoadingScreen';
import { ErrorBoundary } from '../ErrorBoundary';
import { ScreenshotButton } from '../ScreenshotButton';
import { ControlPanel } from '../ControlPanel';
import { ProductSelector } from '../ProductSelector';
import { useFaceTracker, useScreenshot, useFPS } from '@ar-vto/hooks';
import { useVTOStore } from '@ar-vto/store';
import { NECKLACE_PRODUCTS } from '@ar-vto/shared';
import { ThreeCanvas, FaceFollower, Occluder } from '@ar-vto/three-engine';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import NN from '@ar-vto/face-tracking/src/neuralNets/NN_GLASSES_9.json';

const NecklaceModel: React.FC<{ modelUrl: string; scaleFactor: number; zOffset: number }> = ({
  modelUrl, scaleFactor, zOffset
}) => {
  const { scene } = useGLTF(modelUrl) as any;
  const cloned = scene.clone();

  useEffect(() => {
    cloned.position.set(0, -78, 15 + zOffset);
    cloned.scale.setScalar(82 * scaleFactor);
    cloned.rotation.set(-0.25, 0, 0);

    cloned.traverse((node: any) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        if (node.material) {
          node.material.roughness = 0.2;
          node.material.metalness = 0.8;
        }
      }
    });
  }, [cloned, scaleFactor, zOffset]);

  return <primitive object={cloned} />;
};

export const NecklaceVTO: React.FC = () => {
  const canvasFaceRef = useRef<HTMLCanvasElement>(null);
  const [sizing, setSizing] = useState({ width: 640, height: 480, top: 0, left: 0 });
  const [threeCanvas, setThreeCanvas] = useState<HTMLCanvasElement | null>(null);
  const [scale, setScale] = useState<number>(1.0);
  const [zOffset, setZOffset] = useState<number>(0.0);

  const activeNecklaceId = useVTOStore((state) => state.activeNecklaceId);
  const setActiveNecklace = useVTOStore((state) => state.setActiveNecklace);
  const isCameraLoaded = useVTOStore((state) => state.isCameraLoaded);
  const isTracking = useVTOStore((state) => state.isTracking);
  const fps = useVTOStore((state) => state.fps);

  useFPS();
  const { error } = useFaceTracker({ canvasRef: canvasFaceRef, NN });
  const capture = useScreenshot();
  const handleCapture = () => capture(threeCanvas);

  const selectedProduct = NECKLACE_PRODUCTS.find((p) => p.id === activeNecklaceId) || NECKLACE_PRODUCTS[0];

  return (
    <ErrorBoundary>
      <div className="relative w-full h-screen overflow-hidden">
        {!isCameraLoaded && <LoadingScreen message="Loading Necklace VTO..." />}

        <CameraView canvasFaceRef={canvasFaceRef} onResize={setSizing}>
          <ThreeCanvas sizing={sizing} onCanvas={setThreeCanvas}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[0, 10, 10]} intensity={1.1} castShadow />
            <pointLight position={[5, -10, 5]} intensity={0.4} />

            <FaceFollower>
              <Occluder modelUrl="/assets/VTONecklace/models3D/occluder.glb" />
              {selectedProduct?.modelUrl && (
                <NecklaceModel modelUrl={selectedProduct.modelUrl} scaleFactor={scale} zOffset={zOffset} />
              )}
            </FaceFollower>
          </ThreeCanvas>
        </CameraView>

        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950/60 border border-white/10 backdrop-blur-md">
          <h1 className="text-white text-sm font-semibold tracking-wider uppercase">Necklace Virtual Try-On</h1>
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
            title="Necklace Settings"
            sliders={[
              { label: 'Size Scale', value: scale, min: 0.7, max: 1.3, step: 0.05, onChange: setScale },
              { label: 'Depth Adjustment (Z-Axis)', value: zOffset, min: -15, max: 15, step: 1.0, onChange: setZOffset }
            ]}
          >
            <div className="border-t border-white/10 pt-3">
              <span className="text-xs font-medium text-slate-400 block mb-2 font-semibold">Select Necklace</span>
              <ProductSelector products={NECKLACE_PRODUCTS} selectedProductId={activeNecklaceId} onSelect={setActiveNecklace} />
            </div>
          </ControlPanel>
        </div>
      </div>
    </ErrorBoundary>
  );
};
export default NecklaceVTO;
