// This file must be imported BEFORE any WebAR.rocks helper files.
// WebAR.rocks legacy IIFE helpers (WebARRocksMirror.js, WebARRocksFaceThreeHelper.js, etc.)
// reference THREE as a global variable (window.THREE) at module evaluation time.
// This setup file exposes the ESM Three.js build to window.THREE synchronously.
import * as THREE from 'three';

// Expose to global scope for WebAR.rocks legacy scripts
if (typeof globalThis !== 'undefined') {
  (globalThis as any).THREE = THREE;
}
if (typeof window !== 'undefined') {
  (window as any).THREE = THREE;
}

export { THREE };
