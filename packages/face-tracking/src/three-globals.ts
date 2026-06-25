import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { TAARenderPass } from 'three/examples/jsm/postprocessing/TAARenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const THREE_GLOBAL = {
  ...THREE,
  GLTFLoader,
  DRACOLoader,
  RGBELoader,
  EffectComposer,
  RenderPass,
  TAARenderPass,
  ShaderPass,
  CopyShader,
  UnrealBloomPass
};

if (typeof window !== 'undefined') {
  (window as any).THREE = THREE_GLOBAL;
}
if (typeof globalThis !== 'undefined') {
  (globalThis as any).THREE = THREE_GLOBAL;
}

export default THREE_GLOBAL;
