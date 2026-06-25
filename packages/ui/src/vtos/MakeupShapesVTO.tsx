import React, { useRef, useState } from 'react';
import { CameraView } from '../CameraView';
import { LoadingScreen } from '../LoadingScreen';
import { ErrorBoundary } from '../ErrorBoundary';
import { ScreenshotButton } from '../ScreenshotButton';
import { ControlPanel } from '../ControlPanel';
import { ColorPicker } from '../ColorPicker';
import { useFaceTracker, useScreenshot, useFPS } from '@ar-vto/hooks';
import { useVTOStore } from '@ar-vto/store';
import { MAKEUP_SHAPES_PRODUCTS } from '@ar-vto/shared';
import NN from '@ar-vto/face-tracking/src/neuralNets/NN_LIPS_8.json'; // using full landmarks tracker

export const MakeupShapesVTO: React.FC = () => {
  const canvasFaceRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [sizing, setSizing] = useState({ width: 640, height: 480, top: 0, left: 0 });

  // Store States
  const eyeshadowColor = useVTOStore((state) => state.eyeshadowColor);
  const eyeshadowOpacity = useVTOStore((state) => state.eyeshadowOpacity);
  const eyelinerColor = useVTOStore((state) => state.eyelinerColor);
  const eyelinerOpacity = useVTOStore((state) => state.eyelinerOpacity);
  const eyebrowColor = useVTOStore((state) => state.eyebrowColor);
  const eyebrowOpacity = useVTOStore((state) => state.eyebrowOpacity);
  const blushColor = useVTOStore((state) => state.blushColor);
  const blushOpacity = useVTOStore((state) => state.blushOpacity);
  const contourColor = useVTOStore((state) => state.contourColor);
  const contourOpacity = useVTOStore((state) => state.contourOpacity);
  const showBeforeAfter = useVTOStore((state) => state.showBeforeAfter);
  const isCameraLoaded = useVTOStore((state) => state.isCameraLoaded);
  const isTracking = useVTOStore((state) => state.isTracking);
  const fps = useVTOStore((state) => state.fps);

  const setMakeupShapeColor = useVTOStore((state) => state.setMakeupShapeColor);
  const setMakeupShapeOpacity = useVTOStore((state) => state.setMakeupShapeOpacity);
  const setShowBeforeAfter = useVTOStore((state) => state.setShowBeforeAfter);

  const [activeCategory, setActiveCategory] = useState<'eyeshadow' | 'eyeliner' | 'eyebrow' | 'blush' | 'contour'>('eyeshadow');

  // Monitor FPS
  useFPS();

  // Initialize tracking and draw makeup overlays
  const { error } = useFaceTracker({
    canvasRef: canvasFaceRef,
    NN,
    onTrack: (detectState) => {
      const overlay = overlayCanvasRef.current;
      if (!overlay) return;
      const ctx = overlay.getContext('2d');
      if (!ctx) return;

      if (!detectState.isDetected || showBeforeAfter) {
        ctx.clearRect(0, 0, overlay.width, overlay.height);
        return;
      }

      const landmarks = detectState.landmarks;
      const w = overlay.width;
      const h = overlay.height;

      ctx.clearRect(0, 0, w, h);

      // Coordinate converter helper
      const map = (pt: number[]) => ({
        x: (1 - pt[0]) * w / 2,
        y: (1 - pt[1]) * h / 2
      });

      // Eyeshadow (points around eye lids)
      // Left eye outer, center, inner. E.g. indices:
      // standard coordinates for face landmarks
      const eyeL = map(landmarks[6] || [-0.25, 0.2]); 
      const eyeR = map(landmarks[8] || [0.25, 0.2]);
      const browL = map(landmarks[10] || [-0.25, 0.35]);
      const browR = map(landmarks[12] || [0.25, 0.35]);
      const mouthL = map(landmarks[16] || [-0.15, -0.2]);
      const mouthR = map(landmarks[20] || [0.15, -0.2]);
      const chin = map(landmarks[24] || [0.0, -0.4]);

      // 1. Draw Eyeshadow (soft glow above eyelids)
      ctx.save();
      ctx.globalAlpha = eyeshadowOpacity;
      ctx.fillStyle = eyeshadowColor;
      ctx.globalCompositeOperation = 'multiply';
      
      // Left Eyeshadow
      ctx.beginPath();
      ctx.arc(eyeL.x, eyeL.y - 12, 20, 0, Math.PI * 2);
      ctx.fill();

      // Right Eyeshadow
      ctx.beginPath();
      ctx.arc(eyeR.x, eyeR.y - 12, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. Draw Eyeliner
      ctx.save();
      ctx.globalAlpha = eyelinerOpacity;
      ctx.strokeStyle = eyelinerColor;
      ctx.lineWidth = 3;
      ctx.globalCompositeOperation = 'source-over';

      // Left Eyeliner
      ctx.beginPath();
      ctx.moveTo(eyeL.x - 12, eyeL.y);
      ctx.quadraticCurveTo(eyeL.x, eyeL.y - 5, eyeL.x + 12, eyeL.y);
      ctx.stroke();

      // Right Eyeliner
      ctx.beginPath();
      ctx.moveTo(eyeR.x - 12, eyeR.y);
      ctx.quadraticCurveTo(eyeR.x, eyeR.y - 5, eyeR.x + 12, eyeR.y);
      ctx.stroke();
      ctx.restore();

      // 3. Draw Eyebrows (soft arches)
      ctx.save();
      ctx.globalAlpha = eyebrowOpacity;
      ctx.strokeStyle = eyebrowColor;
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.globalCompositeOperation = 'multiply';

      // Left Eyebrow
      ctx.beginPath();
      ctx.moveTo(browL.x - 20, browL.y);
      ctx.quadraticCurveTo(browL.x, browL.y - 10, browL.x + 20, browL.y);
      ctx.stroke();

      // Right Eyebrow
      ctx.beginPath();
      ctx.moveTo(browR.x - 20, browR.y);
      ctx.quadraticCurveTo(browR.x, browR.y - 10, browR.x + 20, browR.y);
      ctx.stroke();
      ctx.restore();

      // 4. Draw Blush (gradient on cheeks)
      ctx.save();
      ctx.globalAlpha = blushOpacity;
      ctx.globalCompositeOperation = 'color';
      
      const cheekL = { x: (eyeL.x + mouthL.x) / 2 - 10, y: (eyeL.y + mouthL.y) / 2 + 10 };
      const cheekR = { x: (eyeR.x + mouthR.x) / 2 + 10, y: (eyeR.y + mouthR.y) / 2 + 10 };

      // Left cheek blush
      let gradL = ctx.createRadialGradient(cheekL.x, cheekL.y, 0, cheekL.x, cheekL.y, 35);
      gradL.addColorStop(0, blushColor);
      gradL.addColorStop(1, 'transparent');
      ctx.fillStyle = gradL;
      ctx.beginPath();
      ctx.arc(cheekL.x, cheekL.y, 35, 0, Math.PI * 2);
      ctx.fill();

      // Right cheek blush
      let gradR = ctx.createRadialGradient(cheekR.x, cheekR.y, 0, cheekR.x, cheekR.y, 35);
      gradR.addColorStop(0, blushColor);
      gradR.addColorStop(1, 'transparent');
      ctx.fillStyle = gradR;
      ctx.beginPath();
      ctx.arc(cheekR.x, cheekR.y, 35, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 5. Draw Contour (soft shadows below cheeks)
      ctx.save();
      ctx.globalAlpha = contourOpacity;
      ctx.globalCompositeOperation = 'multiply';

      const contourL = { x: cheekL.x - 15, y: cheekL.y + 20 };
      const contourR = { x: cheekR.x + 15, y: cheekR.y + 20 };

      // Left contour
      let gradContourL = ctx.createRadialGradient(contourL.x, contourL.y, 0, contourL.x, contourL.y, 40);
      gradContourL.addColorStop(0, contourColor);
      gradContourL.addColorStop(1, 'transparent');
      ctx.fillStyle = gradContourL;
      ctx.beginPath();
      ctx.arc(contourL.x, contourL.y, 40, 0, Math.PI * 2);
      ctx.fill();

      // Right contour
      let gradContourR = ctx.createRadialGradient(contourR.x, contourR.y, 0, contourR.x, contourR.y, 40);
      gradContourR.addColorStop(0, contourColor);
      gradContourR.addColorStop(1, 'transparent');
      ctx.fillStyle = gradContourR;
      ctx.beginPath();
      ctx.arc(contourR.x, contourR.y, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  });

  const capture = useScreenshot();

  const handleCapture = () => {
    capture(canvasFaceRef.current, overlayCanvasRef.current);
  };

  const categories = [
    { id: 'eyeshadow', label: 'Eyeshadow', product: MAKEUP_SHAPES_PRODUCTS.find(p => p.id === 'shape_eyeshadow') },
    { id: 'eyeliner', label: 'Eyeliner', product: MAKEUP_SHAPES_PRODUCTS.find(p => p.id === 'shape_eyeliner') },
    { id: 'eyebrow', label: 'Eyebrow', product: MAKEUP_SHAPES_PRODUCTS.find(p => p.id === 'shape_eyebrow') },
    { id: 'blush', label: 'Blush', product: MAKEUP_SHAPES_PRODUCTS.find(p => p.id === 'shape_blush') },
    { id: 'contour', label: 'Contour', product: MAKEUP_SHAPES_PRODUCTS.find(p => p.id === 'shape_blush') } // reuse blush colors
  ] as const;

  const currentActiveCategory = categories.find(c => c.id === activeCategory)!;

  const getActiveOpacity = () => {
    switch (activeCategory) {
      case 'eyeshadow': return eyeshadowOpacity;
      case 'eyeliner': return eyelinerOpacity;
      case 'eyebrow': return eyebrowOpacity;
      case 'blush': return blushOpacity;
      case 'contour': return contourOpacity;
    }
  };

  const handleOpacityChange = (val: number) => {
    setMakeupShapeOpacity(activeCategory, val);
  };

  const getActiveColor = () => {
    switch (activeCategory) {
      case 'eyeshadow': return eyeshadowColor;
      case 'eyeliner': return eyelinerColor;
      case 'eyebrow': return eyebrowColor;
      case 'blush': return blushColor;
      case 'contour': return contourColor;
    }
  };

  const handleColorChange = (hex: string) => {
    setMakeupShapeColor(activeCategory, hex);
  };

  return (
    <ErrorBoundary>
      <div className="relative w-full h-screen overflow-hidden">
        {!isCameraLoaded && <LoadingScreen message="Loading Makeup Shapes VTO..." />}

        <CameraView canvasFaceRef={canvasFaceRef} onResize={setSizing}>
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

        {/* Info panel */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950/60 border border-white/10 backdrop-blur-md">
          <h1 className="text-white text-sm font-semibold tracking-wider uppercase">Makeup Shapes Try-On</h1>
          <div className="text-[10px] text-slate-300 font-mono">
            Status: {isTracking ? <span className="text-green-400 font-bold">Face Tracked</span> : <span className="text-rose-400">Searching Face...</span>}
            <span className="ml-3">FPS: {fps}</span>
          </div>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <ScreenshotButton onClick={handleCapture} />
        </div>

        {/* Bottom panel */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-md px-4 flex flex-col gap-4">
          {/* Category tabs selection */}
          <div className="flex gap-1.5 overflow-x-auto p-1.5 rounded-xl bg-slate-950/80 border border-white/5 backdrop-blur-md">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-rose-500 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <ControlPanel
            title={`${currentActiveCategory.label} Options`}
            sliders={[
              {
                label: 'Opacity',
                value: getActiveOpacity(),
                onChange: handleOpacityChange
              }
            ]}
            showBeforeAfter={showBeforeAfter}
            onBeforeAfterToggle={setShowBeforeAfter}
          >
            {currentActiveCategory.product?.colors && (
              <div className="border-t border-white/10 pt-3">
                <span className="text-xs font-medium text-slate-400 block mb-2">Palette Colors</span>
                <ColorPicker
                  colors={currentActiveCategory.product.colors}
                  selectedColor={getActiveColor()}
                  onChange={handleColorChange}
                />
              </div>
            )}
          </ControlPanel>
        </div>
      </div>
    </ErrorBoundary>
  );
};
export default MakeupShapesVTO;
