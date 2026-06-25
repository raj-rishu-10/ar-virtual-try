import { create } from 'zustand';

export interface VTOState {
  // Lipstick state
  lipstickColor: string;
  lipstickOpacity: number;
  lipstickType: 'matte' | 'glossy' | 'satin';

  // Makeup Shapes state
  eyeshadowColor: string;
  eyeshadowOpacity: number;
  eyelinerColor: string;
  eyelinerOpacity: number;
  eyebrowColor: string;
  eyebrowOpacity: number;
  blushColor: string;
  blushOpacity: number;
  contourColor: string;
  contourOpacity: number;

  // Makeup Texture state
  skinSmoothing: number; // 0 to 1
  frecklesIntensity: number; // 0 to 1
  foundationColor: string;
  foundationOpacity: number;
  activeTexture: string | null;

  // Accessories state
  activeGlassesId: string;
  activeHatId: string;
  activeHelmetId: string;
  activeHeadphonesId: string;
  activeEarringsId: string;
  activeNecklaceId: string;
  activeSportsPaintId: string;

  // UI / UX state
  showBeforeAfter: boolean;
  isCameraLoaded: boolean;
  isTracking: boolean;
  activeTab: string;
  fps: number;

  // Actions
  setLipstickColor: (color: string) => void;
  setLipstickOpacity: (opacity: number) => void;
  setLipstickType: (type: 'matte' | 'glossy' | 'satin') => void;
  
  setMakeupShapeColor: (type: 'eyeshadow' | 'eyeliner' | 'eyebrow' | 'blush' | 'contour', color: string) => void;
  setMakeupShapeOpacity: (type: 'eyeshadow' | 'eyeliner' | 'eyebrow' | 'blush' | 'contour', opacity: number) => void;
  
  setSkinSmoothing: (val: number) => void;
  setFrecklesIntensity: (val: number) => void;
  setFoundationColor: (color: string) => void;
  setFoundationOpacity: (opacity: number) => void;
  setActiveTexture: (texture: string | null) => void;

  setActiveGlasses: (id: string) => void;
  setActiveHat: (id: string) => void;
  setActiveHelmet: (id: string) => void;
  setActiveHeadphones: (id: string) => void;
  setActiveEarrings: (id: string) => void;
  setActiveNecklace: (id: string) => void;
  setActiveSportsPaint: (id: string) => void;

  setShowBeforeAfter: (val: boolean) => void;
  setCameraLoaded: (val: boolean) => void;
  setTracking: (val: boolean) => void;
  setActiveTab: (tab: string) => void;
  setFps: (fps: number) => void;
  resetAll: () => void;
}

const initialState = {
  lipstickColor: '#d91b5c',
  lipstickOpacity: 0.6,
  lipstickType: 'matte' as const,

  eyeshadowColor: '#9333ea',
  eyeshadowOpacity: 0.4,
  eyelinerColor: '#000000',
  eyelinerOpacity: 0.8,
  eyebrowColor: '#78350f',
  eyebrowOpacity: 0.5,
  blushColor: '#f43f5e',
  blushOpacity: 0.3,
  contourColor: '#451a03',
  contourOpacity: 0.2,

  skinSmoothing: 0.4,
  frecklesIntensity: 0.0,
  foundationColor: '#fcd34d',
  foundationOpacity: 0.3,
  activeTexture: null,

  activeGlassesId: 'glasses1',
  activeHatId: 'hat1',
  activeHelmetId: 'helmet1',
  activeHeadphonesId: 'headphones1',
  activeEarringsId: 'earring1',
  activeNecklaceId: 'necklace1',
  activeSportsPaintId: 'flag_football',

  showBeforeAfter: false,
  isCameraLoaded: false,
  isTracking: false,
  activeTab: 'lipstick',
  fps: 60
};

export const useVTOStore = create<VTOState>((set) => ({
  ...initialState,

  setLipstickColor: (color) => set({ lipstickColor: color }),
  setLipstickOpacity: (opacity) => set({ lipstickOpacity: opacity }),
  setLipstickType: (type) => set({ lipstickType: type }),
  
  setMakeupShapeColor: (type, color) => set((state) => ({
    [`${type}Color`]: color
  })),
  setMakeupShapeOpacity: (type, opacity) => set((state) => ({
    [`${type}Opacity`]: opacity
  })),
  
  setSkinSmoothing: (val) => set({ skinSmoothing: val }),
  setFrecklesIntensity: (val) => set({ frecklesIntensity: val }),
  setFoundationColor: (color) => set({ foundationColor: color }),
  setFoundationOpacity: (opacity) => set({ foundationOpacity: opacity }),
  setActiveTexture: (texture) => set({ activeTexture: texture }),

  setActiveGlasses: (id) => set({ activeGlassesId: id }),
  setActiveHat: (id) => set({ activeHatId: id }),
  setActiveHelmet: (id) => set({ activeHelmetId: id }),
  setActiveHeadphones: (id) => set({ activeHeadphonesId: id }),
  setActiveEarrings: (id) => set({ activeEarringsId: id }),
  setActiveNecklace: (id) => set({ activeNecklaceId: id }),
  setActiveSportsPaint: (id) => set({ activeSportsPaintId: id }),

  setShowBeforeAfter: (val) => set({ showBeforeAfter: val }),
  setCameraLoaded: (val) => set({ isCameraLoaded: val }),
  setTracking: (val) => set({ isTracking: val }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setFps: (fps) => set({ fps }),
  resetAll: () => set(initialState)
}));
