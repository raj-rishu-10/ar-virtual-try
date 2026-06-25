import React, { useRef, useState, useEffect } from 'react';
import { CameraView } from '../CameraView';
import { LoadingScreen } from '../LoadingScreen';
import { ErrorBoundary } from '../ErrorBoundary';
import { ScreenshotButton } from '../ScreenshotButton';
import { ProductSelector } from '../ProductSelector';
import { ControlPanel } from '../ControlPanel';
import { ColorPicker } from '../ColorPicker';
import { useFaceTracker, useScreenshot, useFPS } from '@ar-vto/hooks';
import { useVTOStore } from '@ar-vto/store';
import { LIPSTICK_PRODUCTS } from '@ar-vto/shared';
import NN from '@ar-vto/face-tracking/src/neuralNets/NN_LIPS_8.json';
import { getFaceLandmarks, getHeadRotation } from '@ar-vto/face-tracking';

export const LipstickVTO: React.FC = () => {
  const canvasFaceRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [sizing, setSizing] = useState({ width: 640, height: 480, top: 0, left: 0 });

  // Store state
  const lipstickColor = useVTOStore((state) => state.lipstickColor);
  const lipstickOpacity = useVTOStore((state) => state.lipstickOpacity);
  const lipstickType = useVTOStore((state) => state.lipstickType);
  const showBeforeAfter = useVTOStore((state) => state.showBeforeAfter);
  const isCameraLoaded = useVTOStore((state) => state.isCameraLoaded);
  const isTracking = useVTOStore((state) => state.isTracking);
  const fps = useVTOStore((state) => state.fps);

  const setLipstickColor = useVTOStore((state) => state.setLipstickColor);
  const setLipstickOpacity = useVTOStore((state) => state.setLipstickOpacity);
  const setLipstickType = useVTOStore((state) => state.setLipstickType);
  const setShowBeforeAfter = useVTOStore((state) => state.setShowBeforeAfter);

  // Monitor FPS
  useFPS();

  // Initialize tracking
  const { error } = useFaceTracker({
    canvasRef: canvasFaceRef,
    NN,
    onTrack: (detectState) => {
      // Real-time canvas drawing loop
      const overlay = overlayCanvasRef.current;
      if (!overlay) return;
      const ctx = overlay.getContext('2d');
      if (!ctx) return;

      if (!detectState.isDetected || showBeforeAfter) {
        ctx.clearRect(0, 0, overlay.width, overlay.height);
        return;
      }

      // Draw lipstick
      const landmarks = detectState.landmarks;
      const labels = (NN as any).landmarksLabels || [
        'mouthLeft', 'mouthRight', 'upperLipTop', 'upperLipBot', 'lowerLipTop', 'lowerLipBot'
      ];

      const getPt = (label: string) => {
        const idx = labels.indexOf(label);
        return idx !== -1 ? landmarks[idx] : null;
      };

      const ml = getPt('mouthLeft') || landmarks[16]; // fallback indices
      const mr = getPt('mouthRight') || landmarks[20];
      const ult = getPt('upperLipTop') || landmarks[18];
      const ulb = getPt('upperLipBot') || landmarks[19];
      const llt = getPt('lowerLipTop') || landmarks[21];
      const llb = getPt('lowerLipBot') || landmarks[22];

      if (!ml || !mr || !ult || !ulb || !llt || !llb) return;

      const w = overlay.width;
      const h = overlay.height;

      // Map landmarks to canvas pixels (WebAR landmarks are in range [-1, 1])
      const map = (pt: number[]) => ({
        x: (1 - pt[0]) * w / 2,
        y: (1 - pt[1]) * h / 2
      });

      const p_ml = map(ml);
      const p_mr = map(mr);
      const p_ult = map(ult);
      const p_ulb = map(ulb);
      const p_llt = map(llt);
      const p_llb = map(llb);

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = lipstickColor;
      ctx.globalAlpha = lipstickOpacity;

      // Finish rendering style
      if (lipstickType === 'matte') {
        ctx.globalCompositeOperation = 'multiply';
      } else if (lipstickType === 'glossy') {
        ctx.globalCompositeOperation = 'color';
      } else {
        ctx.globalCompositeOperation = 'source-over';
      }

      // Upper Lip Path
      ctx.beginPath();
      ctx.moveTo(p_ml.x, p_ml.y);
      ctx.quadraticCurveTo(p_ult.x, p_ult.y, p_mr.x, p_mr.y);
      ctx.quadraticCurveTo(p_ulb.x, p_ulb.y, p_ml.x, p_ml.y);
      ctx.closePath();
      ctx.fill();

      // Lower Lip Path
      ctx.beginPath();
      ctx.moveTo(p_ml.x, p_ml.y);
      ctx.quadraticCurveTo(p_llt.x, p_llt.y, p_mr.x, p_mr.y);
      ctx.quadraticCurveTo(p_llb.x, p_llb.y, p_ml.x, p_ml.y);
      ctx.closePath();
      ctx.fill();

      // Highlights for glossy effect
      if (lipstickType === 'glossy') {
        ctx.globalAlpha = lipstickOpacity * 0.4;
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse((p_ml.x + p_mr.x) / 2, p_llb.y - 4, 15, 3, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });

  const capture = useScreenshot();

  const handleCapture = () => {
    // We pass both the video canvas and the lips 2D canvas overlay to capture composite
    capture(canvasFaceRef.current, overlayCanvasRef.current);
  };

  const activeProduct = LIPSTICK_PRODUCTS[0]; // fallback / mock

  return (
    <ErrorBoundary>
      <div className="relative w-full h-screen overflow-hidden">
        {/* Loading Overlay */}
        {!isCameraLoaded && <LoadingScreen message="Loading Lipstick VTO..." />}

        {/* Main Camera View */}
        <CameraView canvasFaceRef={canvasFaceRef} onResize={setSizing}>
          {/* Custom 2D Lipstick Overlay Canvas */}
          <canvas
            ref={overlayCanvasRef}
            className="absolute"
            style={{
              width: sizing.width,
              height: sizing.height,
              top: sizing.top,
              left: sizing.left,
              pointerEvents: 'none'
            }}
            width={sizing.width}
            height={sizing.height}
          />
        </CameraView>

        {/* UI Overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950/60 border border-white/10 backdrop-blur-md">
          <h1 className="text-white text-sm font-semibold tracking-wider uppercase">Lipstick Virtual Try-On</h1>
          <div className="text-[10px] text-slate-300 font-mono">
            Status: {isTracking ? <span className="text-green-400 font-bold">Face Tracked</span> : <span className="text-rose-400">Searching Face...</span>}
            <span className="ml-3">FPS: {fps}</span>
          </div>
        </div>

        {/* Top-Right Screenshot Button */}
        <div className="absolute top-4 right-4 z-10">
          <ScreenshotButton onClick={handleCapture} />
        </div>

        {/* Bottom Panel */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-md px-4 flex flex-col gap-4">
          <ControlPanel
            title="Lipstick Controls"
            sliders={[
              {
                label: 'Lipstick Intensity',
                value: lipstickOpacity,
                onChange: setLipstickOpacity
              }
            ]}
            showBeforeAfter={showBeforeAfter}
            onBeforeAfterToggle={setShowBeforeAfter}
          >
            {/* Lipstick Finish Type Selection */}
            <div className="flex gap-2 mb-2">
              {(['matte', 'glossy', 'satin'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setLipstickType(type)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-colors ${
                    lipstickType === type
                      ? 'bg-rose-500 border-rose-500 text-white shadow-md'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Colors picker */}
            <div className="border-t border-white/10 pt-3">
              <span className="text-xs font-medium text-slate-400 block mb-2">Select Shade</span>
              <ColorPicker
                colors={activeProduct.colors || []}
                selectedColor={lipstickColor}
                onChange={setLipstickColor}
              />
            </div>
          </ControlPanel>
        </div>
      </div>
    </ErrorBoundary>
  );
};
export default LipstickVTO;
