import { useEffect, useRef } from 'react';
import { useVTOStore } from '@ar-vto/store';

export function useFPS() {
  const setFps = useVTOStore((state) => state.setFps);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    let animationFrameId: number;

    const loop = () => {
      frameCount.current++;
      const now = performance.now();
      const delta = now - lastTime.current;

      if (delta >= 1000) {
        const fpsVal = Math.round((frameCount.current * 1000) / delta);
        setFps(fpsVal);
        frameCount.current = 0;
        lastTime.current = now;
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [setFps]);
}
