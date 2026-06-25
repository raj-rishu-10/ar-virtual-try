import { useEffect, useState } from 'react';
import { useVTOStore } from '@ar-vto/store';
import { loadWebARRocksFace, stopTracking } from '@ar-vto/face-tracking';

interface UseFaceTrackerProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  NN: any;
  onTrack?: (detectState: any) => void;
  onReady?: (err: any, objs: any) => void;
}

export function useFaceTracker({ canvasRef, NN, onTrack, onReady }: UseFaceTrackerProps) {
  const setCameraLoaded = useVTOStore((state) => state.setCameraLoaded);
  const setTracking = useVTOStore((state) => state.setTracking);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    let isActive = true;

    loadWebARRocksFace({
      canvas: canvasRef.current,
      NN,
      callbackReady: (err, objs) => {
        if (!isActive) return;
        if (err) {
          setError(err.toString());
          onReady?.(err, null);
          return;
        }
        setCameraLoaded(true);
        setTracking(true);
        onReady?.(null, objs);
      },
      callbackTrack: (detectState) => {
        if (!isActive) return;
        setTracking(detectState.isDetected);
        onTrack?.(detectState);
      }
    }).catch((err) => {
      if (isActive) {
        setError(err.toString());
      }
    });

    return () => {
      isActive = false;
      try {
        stopTracking();
      } catch (e) {
        console.warn('Error during face tracking teardown:', e);
      }
      setCameraLoaded(false);
      setTracking(false);
    };
  }, [canvasRef, NN, onTrack, onReady, setCameraLoaded, setTracking]);

  return { error };
}
