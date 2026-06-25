// @ts-nocheck
import WEBARROCKSFACE from './dist/WebARRocksFace.module.js';
import WebARRocksMirror from './helpers/WebARRocksMirror.js';
import WebARRocksFaceThreeHelper from './helpers/WebARRocksFaceThreeHelper.js';
import WebARRocksFaceShape2DHelper from './helpers/WebARRocksFaceShape2DHelper.js';
import WebARRocksFaceEarrings3DHelper from './helpers/WebARRocksFaceEarrings3DHelper.js';

export {
  WEBARROCKSFACE,
  WebARRocksMirror,
  WebARRocksFaceThreeHelper,
  WebARRocksFaceShape2DHelper,
  WebARRocksFaceEarrings3DHelper
};

// Global singleton state to track the latest face data
interface FaceTrackingState {
  isTracking: boolean;
  isDetected: boolean;
  landmarks: number[][];
  pose: {
    translation: number[];
    rotation: number[][];
  } | null;
  rotation: { x: number; y: number; z: number } | null;
}

const trackingState: FaceTrackingState = {
  isTracking: false,
  isDetected: false,
  landmarks: [],
  pose: null,
  rotation: null
};

// Listeners list for tracking updates
const trackingListeners = new Set<(state: FaceTrackingState) => void>();

export function subscribeToTracking(listener: (state: FaceTrackingState) => void) {
  trackingListeners.add(listener);
  return () => trackingListeners.delete(listener);
}

function updateState(newState: Partial<FaceTrackingState>) {
  Object.assign(trackingState, newState);
  trackingListeners.forEach((listener) => listener(trackingState));
}

/**
 * Request camera access and initialize the camera stream
 */
export async function initializeCamera(videoElement: HTMLVideoElement): Promise<MediaStream> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user'
      },
      audio: false
    });
    if (videoElement) {
      videoElement.srcObject = stream;
      videoElement.setAttribute('playsinline', 'true');
      videoElement.setAttribute('autoplay', 'true');
      videoElement.play();
    }
    return stream;
  } catch (error) {
    console.error('Failed to initialize camera:', error);
    throw error;
  }
}

/**
 * Initialize WebAR.rocks.face engine with a given neural net and config
 */
export function loadWebARRocksFace(spec: {
  canvas: HTMLCanvasElement;
  NN: any;
  callbackTrack?: (detectState: any) => void;
  callbackReady?: (err: any, detectState: any) => void;
}) {
  return new Promise((resolve, reject) => {
    WEBARROCKSFACE.init({
      canvas: spec.canvas,
      NN: spec.NN,
      scanSettings: {
        threshold: 0.7
      },
      callbackReady: (err: any, objs: any) => {
        if (err) {
          spec.callbackReady?.(err, null);
          reject(err);
          return;
        }
        updateState({ isTracking: true });
        spec.callbackReady?.(null, objs);
        resolve(objs);
      },
      callbackTrack: (detectState: any) => {
        // Update local state
        const isDetected = detectState.isDetected || false;
        let landmarks: number[][] = [];
        let pose = null;
        let rotation = null;

        if (isDetected) {
          landmarks = detectState.landmarks || [];
          
          // Try to get pose and rotation if computed (e.g. from solver)
          if (detectState.rx !== undefined) {
            rotation = {
              x: detectState.rx,
              y: detectState.ry,
              z: detectState.rz
            };
          }
        }

        updateState({
          isDetected,
          landmarks,
          rotation
        });

        // Trigger original callback
        spec.callbackTrack?.(detectState);
      }
    });
  });
}

/**
 * Start/Resume face tracking
 */
export function startTracking(): void {
  WEBARROCKSFACE.toggle_pause(false, false);
  updateState({ isTracking: true });
}

/**
 * Stop/Pause face tracking
 */
export function stopTracking(): void {
  WEBARROCKSFACE.toggle_pause(true, true);
  updateState({ isTracking: false, isDetected: false });
}

/**
 * Get current face landmarks (2D coordinates normalized in [-1, 1])
 */
export function getFaceLandmarks(): number[][] {
  return trackingState.landmarks;
}

/**
 * Get the current 3D face pose (translation and rotation matrix)
 */
export function getFacePose() {
  // If three helper is initialized, it computes the pose matrix
  try {
    const facePoints = WebARRocksFaceThreeHelper.get_facePointPositions();
    return {
      facePoints,
      isDetected: trackingState.isDetected
    };
  } catch (e) {
    return null;
  }
}

/**
 * Get the current head rotation in radians (pitch, yaw, roll)
 */
export function getHeadRotation(): { x: number; y: number; z: number } | null {
  return trackingState.rotation;
}
