import { useCallback } from 'react';
import { WebARRocksMirror } from '@ar-vto/face-tracking';

export function useScreenshot() {
  const capture = useCallback(async (threeCanvas: HTMLCanvasElement | null, customOverlayCanvas?: HTMLCanvasElement | null) => {
    if (!threeCanvas) {
      console.warn('Canvas not ready for screenshot capture');
      return null;
    }

    try {
      const compositeCanvas = (await WebARRocksMirror.capture_image(threeCanvas)) as unknown as HTMLCanvasElement;
      
      // If we have a custom 2D overlay (e.g. lipstick/makeup canvas overlay), draw it on top
      if (customOverlayCanvas && compositeCanvas) {
        const ctx = compositeCanvas.getContext('2d');
        if (ctx) {
          // Since the mirror helper already flipped the image horizontally,
          // we draw the custom overlay directly onto the canvas.
          ctx.drawImage(customOverlayCanvas, 0, 0, compositeCanvas.width, compositeCanvas.height);
        }
      }

      if (compositeCanvas) {
        const dataUrl = compositeCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `vto-capture-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
        return dataUrl;
      }
      return null;
    } catch (error) {
      console.error('Screenshot capture failed:', error);
      return null;
    }
  }, []);

  return capture;
}
