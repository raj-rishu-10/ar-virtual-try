import React, { useRef, useState, useEffect } from 'react';
import { CameraView } from '../CameraView';
import { LoadingScreen } from '../LoadingScreen';
import { ErrorBoundary } from '../ErrorBoundary';
import { ScreenshotButton } from '../ScreenshotButton';
import { ControlPanel } from '../ControlPanel';
import { ProductSelector } from '../ProductSelector';
import { useFaceTracker, useScreenshot, useFPS } from '@ar-vto/hooks';
import { useVTOStore } from '@ar-vto/store';
import { GLASSES_PRODUCTS } from '@ar-vto/shared';
import { ThreeCanvas, FaceFollower, Occluder } from '@ar-vto/three-engine';
import { useGLTF } from '@react-three/drei';
import NN from '@ar-vto/face-tracking/src/neuralNets/NN_GLASSES_9.json';

// 3D Glasses Model Renderer
const GlassesModel: React.FC<{ modelUrl: string }> = ({ modelUrl }) => {
  const { scene } = useGLTF(modelUrl) as any;
  const cloned = scene.clone();

  useEffect(() => {
    cloned.scale.setScalar(82);
    cloned.position.set(0, 49, 53);
    cloned.rotation.set(-0.38, 0, 0);
    cloned.traverse((node: any) => {
      if (node.isMesh) {
        node.material.depthWrite = true;
      }
    });
  }, [cloned]);

  return <primitive object={cloned} />;
};

export const GlassesVTO: React.FC = () => {
  const canvasFaceRef = useRef<HTMLCanvasElement>(null);
  const [sizing, setSizing] = useState({ width: 640, height: 480, top: 0, left: 0 });
  const [threeCanvas, setThreeCanvas] = useState<HTMLCanvasElement | null>(null);

  const activeGlassesId = useVTOStore((state) => state.activeGlassesId);
  const setActiveGlasses = useVTOStore((state) => state.setActiveGlasses);
  const isCameraLoaded = useVTOStore((state) => state.isCameraLoaded);
  const isTracking = useVTOStore((state) => state.isTracking);
  const fps = useVTOStore((state) => state.fps);

  useFPS();

  const { error } = useFaceTracker({ canvasRef: canvasFaceRef, NN });
  const capture = useScreenshot();
  const handleCapture = () => capture(threeCanvas);

  const selectedProduct = GLASSES_PRODUCTS.find((p) => p.id === activeGlassesId) || GLASSES_PRODUCTS[0];

  return (
    <ErrorBoundary>
      <div className="relative w-full h-screen overflow-hidden">
        {!isCameraLoaded && <LoadingScreen message="Loading Glasses VTO..." />}

        <CameraView canvasFaceRef={canvasFaceRef} onResize={setSizing}>
          <ThreeCanvas sizing={sizing} onCanvas={setThreeCanvas}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[0, 10, 5]} intensity={0.8} castShadow />
            <pointLight position={[0, 200, 100]} intensity={0.8} />

            <FaceFollower>
              <Occluder modelUrl="/assets/VTOGlasses/models3D/occluder.glb" />
              {selectedProduct?.modelUrl && (
                <GlassesModel modelUrl={selectedProduct.modelUrl} />
              )}
            </FaceFollower>
          </ThreeCanvas>
        </CameraView>

        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950/60 border border-white/10 backdrop-blur-md">
          <h1 className="text-white text-sm font-semibold tracking-wider uppercase">Glasses Virtual Try-On</h1>
          <div className="text-[10px] text-slate-300 font-mono">
            Status: {isTracking ? <span className="text-green-400 font-bold">Face Tracked</span> : <span className="text-rose-400">Searching Face...</span>}
            <span className="ml-3">FPS: {fps}</span>
          </div>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <ScreenshotButton onClick={handleCapture} />
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-md px-4 flex flex-col gap-4">
          <ControlPanel title="Glasses Frames">
            <ProductSelector
              products={GLASSES_PRODUCTS}
              selectedProductId={activeGlassesId}
              onSelect={setActiveGlasses}
            />
          </ControlPanel>
        </div>
      </div>
    </ErrorBoundary>
  );
};
export default GlassesVTO;
