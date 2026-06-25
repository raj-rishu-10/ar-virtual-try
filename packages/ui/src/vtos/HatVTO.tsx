import React, { useRef, useState, useEffect } from 'react';
import { CameraView } from '../CameraView';
import { LoadingScreen } from '../LoadingScreen';
import { ErrorBoundary } from '../ErrorBoundary';
import { ScreenshotButton } from '../ScreenshotButton';
import { ControlPanel } from '../ControlPanel';
import { ProductSelector } from '../ProductSelector';
import { useFaceTracker, useScreenshot, useFPS } from '@ar-vto/hooks';
import { useVTOStore } from '@ar-vto/store';
import { HAT_PRODUCTS } from '@ar-vto/shared';
import { ThreeCanvas, FaceFollower } from '@ar-vto/three-engine';
import { useGLTF } from '@react-three/drei';
import NN from '@ar-vto/face-tracking/src/neuralNets/NN_GLASSES_9.json';

const HatModel: React.FC<{ modelUrl: string; scaleFactor: number }> = ({ modelUrl, scaleFactor }) => {
  const { scene } = useGLTF(modelUrl) as any;
  const cloned = scene.clone();
  useEffect(() => {
    cloned.position.set(0, 47, 5);
    cloned.scale.setScalar(80 * scaleFactor);
    cloned.rotation.set(-0.18, 0, 0);
    cloned.traverse((node: any) => { if (node.isMesh) { node.castShadow = true; node.receiveShadow = true; } });
  }, [cloned, scaleFactor]);
  return <primitive object={cloned} />;
};

export const HatVTO: React.FC = () => {
  const canvasFaceRef = useRef<HTMLCanvasElement>(null);
  const [sizing, setSizing] = useState({ width: 640, height: 480, top: 0, left: 0 });
  const [threeCanvas, setThreeCanvas] = useState<HTMLCanvasElement | null>(null);
  const [scale, setScale] = useState<number>(1.0);
  const activeHatId = useVTOStore((s) => s.activeHatId);
  const setActiveHat = useVTOStore((s) => s.setActiveHat);
  const isCameraLoaded = useVTOStore((s) => s.isCameraLoaded);
  const isTracking = useVTOStore((s) => s.isTracking);
  const fps = useVTOStore((s) => s.fps);
  useFPS();
  const { error } = useFaceTracker({ canvasRef: canvasFaceRef, NN });
  const capture = useScreenshot();
  const selectedProduct = HAT_PRODUCTS.find((p) => p.id === activeHatId) || HAT_PRODUCTS[0];
  return (
    <ErrorBoundary>
      <div className="relative w-full h-screen overflow-hidden">
        {!isCameraLoaded && <LoadingScreen message="Loading Hat VTO..." />}
        <CameraView canvasFaceRef={canvasFaceRef} onResize={setSizing}>
          <ThreeCanvas sizing={sizing} onCanvas={setThreeCanvas}>
            <ambientLight intensity={0.65} />
            <directionalLight position={[0, 15, 10]} intensity={1.0} castShadow />
            <FaceFollower>
              {selectedProduct?.modelUrl && <HatModel modelUrl={selectedProduct.modelUrl} scaleFactor={scale} />}
            </FaceFollower>
          </ThreeCanvas>
        </CameraView>
        <div className="absolute top-4 left-4 z-10 p-3 rounded-xl bg-slate-950/60 border border-white/10 backdrop-blur-md">
          <h1 className="text-white text-sm font-semibold uppercase">Hats Virtual Try-On</h1>
          <div className="text-[10px] text-slate-300 font-mono">
            {isTracking ? <span className="text-green-400">Face Tracked</span> : <span className="text-rose-400">Searching...</span>}
            <span className="ml-3">FPS: {fps}</span>
          </div>
        </div>
        <div className="absolute top-4 right-4 z-10"><ScreenshotButton onClick={() => capture(threeCanvas)} /></div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-md px-4">
          <ControlPanel title="Hat Settings" sliders={[{ label: 'Hat Size', value: scale, min: 0.8, max: 1.25, step: 0.05, onChange: setScale }]}>
            <div className="border-t border-white/10 pt-3">
              <ProductSelector products={HAT_PRODUCTS} selectedProductId={activeHatId} onSelect={setActiveHat} />
            </div>
          </ControlPanel>
        </div>
      </div>
    </ErrorBoundary>
  );
};
export default HatVTO;
