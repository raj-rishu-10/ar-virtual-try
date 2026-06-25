import React, { useRef, useState, useEffect } from 'react';
import { CameraView } from '../CameraView';
import { LoadingScreen } from '../LoadingScreen';
import { ErrorBoundary } from '../ErrorBoundary';
import { ScreenshotButton } from '../ScreenshotButton';
import { ControlPanel } from '../ControlPanel';
import { ColorPicker } from '../ColorPicker';
import { useFaceTracker, useScreenshot, useFPS } from '@ar-vto/hooks';
import { useVTOStore } from '@ar-vto/store';
import { ThreeCanvas, FaceFollower } from '@ar-vto/three-engine';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import NN from '@ar-vto/face-tracking/src/neuralNets/NN_FULLMAKEUP_4.json';

const FaceMeshTexture: React.FC<{
  smoothing: number;
  foundationColor: string;
  foundationOpacity: number;
  useTextureOverlay: boolean;
}> = ({ smoothing, foundationColor, foundationOpacity, useTextureOverlay }) => {
  const { scene } = useGLTF('/assets/flexibleMask2/face.glb') as any;
  const makeupTexture = useTexture('/assets/makeupTexture/makeup.png');
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
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(foundationColor),
        transparent: true,
        opacity: foundationOpacity,
        roughness: 1.0 - smoothing,
        metalness: 0.1,
        depthWrite: false,
        blending: THREE.NormalBlending
      });
      if (useTextureOverlay) {
        (makeupTexture as THREE.Texture).flipY = false;
        material.map = makeupTexture;
        material.color = new THREE.Color('#ffffff');
        material.opacity = 0.8;
      }
      targetMesh.material = material;
    }
  }, [scene, makeupTexture, smoothing, foundationColor, foundationOpacity, useTextureOverlay]);

  return <mesh ref={meshRef} />;
};

export const MakeupTextureVTO: React.FC = () => {
  const canvasFaceRef = useRef<HTMLCanvasElement>(null);
  const [sizing, setSizing] = useState({ width: 640, height: 480, top: 0, left: 0 });
  const [threeCanvas, setThreeCanvas] = useState<HTMLCanvasElement | null>(null);

  const skinSmoothing = useVTOStore((state) => state.skinSmoothing);
  const foundationColor = useVTOStore((state) => state.foundationColor);
  const foundationOpacity = useVTOStore((state) => state.foundationOpacity);
  const activeTexture = useVTOStore((state) => state.activeTexture);
  const isCameraLoaded = useVTOStore((state) => state.isCameraLoaded);
  const isTracking = useVTOStore((state) => state.isTracking);
  const fps = useVTOStore((state) => state.fps);

  const setSkinSmoothing = useVTOStore((state) => state.setSkinSmoothing);
  const setFoundationColor = useVTOStore((state) => state.setFoundationColor);
  const setFoundationOpacity = useVTOStore((state) => state.setFoundationOpacity);
  const setActiveTexture = useVTOStore((state) => state.setActiveTexture);

  useFPS();
  const { error } = useFaceTracker({ canvasRef: canvasFaceRef, NN });
  const capture = useScreenshot();
  const handleCapture = () => capture(threeCanvas);

  const foundationShades = [
    { name: 'Light Ivory', hex: '#fdf4e3' },
    { name: 'Warm Sand', hex: '#fcd34d' },
    { name: 'Golden Honey', hex: '#ca8a04' },
    { name: 'Deep Mocha', hex: '#78350f' }
  ];

  return (
    <ErrorBoundary>
      <div className="relative w-full h-screen overflow-hidden">
        {!isCameraLoaded && <LoadingScreen message="Loading Makeup Texture VTO..." />}

        <CameraView canvasFaceRef={canvasFaceRef} onResize={setSizing}>
          <ThreeCanvas sizing={sizing} onCanvas={setThreeCanvas}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[0, 10, 5]} intensity={0.6} />
            <FaceFollower>
              <FaceMeshTexture
                smoothing={skinSmoothing}
                foundationColor={foundationColor}
                foundationOpacity={foundationOpacity}
                useTextureOverlay={activeTexture === 'beauty'}
              />
            </FaceFollower>
          </ThreeCanvas>
        </CameraView>

        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950/60 border border-white/10 backdrop-blur-md">
          <h1 className="text-white text-sm font-semibold tracking-wider uppercase">Makeup Texture & Smoothing</h1>
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
            title="Texture Controls"
            sliders={[
              { label: 'Skin Smoothing', value: skinSmoothing, onChange: setSkinSmoothing },
              { label: 'Foundation Coverage', value: foundationOpacity, onChange: setFoundationOpacity }
            ]}
          >
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setActiveTexture(null)}
                className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-colors ${activeTexture === null ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}
              >Foundation Tint</button>
              <button
                onClick={() => setActiveTexture('beauty')}
                className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-colors ${activeTexture === 'beauty' ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}
              >Beauty Overlay</button>
            </div>
            {activeTexture === null && (
              <div className="border-t border-white/10 pt-3">
                <span className="text-xs font-medium text-slate-400 block mb-2">Foundation Shades</span>
                <ColorPicker colors={foundationShades} selectedColor={foundationColor} onChange={setFoundationColor} />
              </div>
            )}
          </ControlPanel>
        </div>
      </div>
    </ErrorBoundary>
  );
};
export default MakeupTextureVTO;
