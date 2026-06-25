import React, { useRef, useState, useEffect } from 'react';
import { CameraView } from '../CameraView';
import { LoadingScreen } from '../LoadingScreen';
import { ErrorBoundary } from '../ErrorBoundary';
import { ScreenshotButton } from '../ScreenshotButton';
import { ControlPanel } from '../ControlPanel';
import { ProductSelector } from '../ProductSelector';
import { useFaceTracker, useScreenshot, useFPS } from '@ar-vto/hooks';
import { useVTOStore } from '@ar-vto/store';
import { HELMET_PRODUCTS } from '@ar-vto/shared';
import { ThreeCanvas, FaceFollower } from '@ar-vto/three-engine';
import { useGLTF } from '@react-three/drei';
import NN from '@ar-vto/face-tracking/src/neuralNets/NN_GLASSES_9.json';

const HelmetModel: React.FC<{ modelUrl: string; scaleFactor: number }> = ({ modelUrl, scaleFactor }) => {
  const { scene } = useGLTF(modelUrl) as any;
  const cloned = scene.clone();

  useEffect(() => {
    cloned.position.set(0, 55, -15);
    cloned.scale.setScalar(82 * scaleFactor);
    cloned.rotation.set(-0.15, 0, 0);
    cloned.traverse((node: any) => {
      if (node.isMesh) { node.castShadow = true; node.receiveShadow = true; }
    });
  }, [cloned, scaleFactor]);

  return <primitive object={cloned} />;
};

export const HelmetVTO: React.FC = () => {
  const canvasFaceRef = useRef<HTMLCanvasElement>(null);
  const [sizing, setSizing] = useState({ width: 640, height: 480, top: 0, left: 0 });
  const [threeCanvas, setThreeCanvas] = useState<HTMLCanvasElement | null>(null);
  const [scale, setScale] = useState<number>(1.0);

  const activeHelmetId = useVTOStore((state) => state.activeHelmetId);
  const setActiveHelmet = useVTOStore((state) => state.setActiveHelmet);
  const isCameraLoaded = useVTOStore((state) => state.isCameraLoaded);
  const isTracking = useVTOStore((state) => state.isTracking);
  const fps = useVTOStore((state) => state.fps);

  useFPS();
  const { error } = useFaceTracker({ canvasRef: canvasFaceRef, NN });
  const capture = useScreenshot();
  const handleCapture = () => capture(threeCanvas);

  const selectedProduct = HELMET_PRODUCTS.find((p) => p.id === activeHelmetId) || HELMET_PRODUCTS[0];

  return (
    <ErrorBoundary>
      <div className="relative w-full h-screen overflow-hidden">
        {!isCameraLoaded && <LoadingScreen message="Loading Helmet VTO..." />}

        <CameraView canvasFaceRef={canvasFaceRef} onResize={setSizing}>
          <ThreeCanvas sizing={sizing} onCanvas={setThreeCanvas}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 15, 10]} intensity={1.1} castShadow />
            <pointLight position={[-5, 10, -5]} intensity={0.4} />
            <FaceFollower>
              {selectedProduct?.modelUrl && (
                <HelmetModel modelUrl={selectedProduct.modelUrl} scaleFactor={scale} />
              )}
            </FaceFollower>
          </ThreeCanvas>
        </CameraView>

        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950/60 border border-white/10 backdrop-blur-md">
          <h1 className="text-white text-sm font-semibold tracking-wider uppercase">Helmet Virtual Try-On</h1>
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
            title="Helmet Settings"
            sliders={[{ label: 'Helmet Size', value: scale, min: 0.8, max: 1.3, step: 0.05, onChange: setScale }]}
          >
            <div className="border-t border-white/10 pt-3">
              <span className="text-xs font-medium text-slate-400 block mb-2 font-semibold">Select Model</span>
              <ProductSelector products={HELMET_PRODUCTS} selectedProductId={activeHelmetId} onSelect={setActiveHelmet} />
            </div>
          </ControlPanel>
        </div>
      </div>
    </ErrorBoundary>
  );
};
export default HelmetVTO;
