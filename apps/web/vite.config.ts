import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Vite plugin: Prepend a THREE guard to every WebAR.rocks legacy helper file.
    // These helpers are IIFE scripts that reference `THREE` as a global variable,
    // so we inject `import * as THREE from 'three'; window.THREE = THREE;` at the
    // top of each one before their IIFE body runs.
    {
      name: 'webar-rocks-three-global',
      transform(code, id) {
        const helpers = [
          'WebARRocksMirror.js',
          'WebARRocksFaceThreeHelper.js',
          'WebARRocksFaceShape2DHelper.js',
          'WebARRocksFaceEarrings3DHelper.js',
          'WebARRocksFaceExpressionsEvaluator.js',
          'WebARRocksResizer.js',
          'WebARRocksFaceCanvas2DHelper.js',
        ];
        if (helpers.some((h) => id.endsWith(h))) {
          // We must import from our custom three-globals to bypass Rollup's
          // strict namespace analysis, because WebAR.rocks scripts expect
          // THREE to be a mutable object containing GLTFLoader, EffectComposer, etc.
          return {
            code: `import THREE from '../three-globals.ts';\n${code}`,
            map: null
          };
        }
      }
    }
  ],
  server: {
    port: 3000,
    host: true,
    hmr: false
  }
});
