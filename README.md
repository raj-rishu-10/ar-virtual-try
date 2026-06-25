# ✨ AR Beauty & Accessories Virtual Try-On Monorepo

A high-performance, production-ready **AR Beauty & Accessories Virtual Try-On (VTO)** monorepo powered by **WebAR.rocks.face**, **React**, **TypeScript**, **Three.js**, **React Three Fiber (R3F)**, **Zustand**, and **Tailwind CSS**.

Developed using **Turborepo** and **pnpm**, this monorepo structures 11 unique Try-On experiences as reusable, standalone components and serves them through a central luxury gateway application.

---

## 🏛️ Repository Architecture

The project is organized as a workspace monorepo:

```
├── apps/
│   └── web/                     # Central web portal/gateway with premium dashboard routing
├── packages/
│   ├── face-tracking/          # WebAR.rocks.face tracking core and stabilizers
│   ├── three-engine/           # ThreeCanvas, FaceFollower, and Occluder components
│   ├── store/                  # Zustand global state (colors, opacity, active models, etc.)
│   ├── hooks/                  # useFaceTracker, useScreenshot, and useFPS hooks
│   ├── shared/                 # Universal VTO product catalogue and types
│   ├── assets/                 # Raw 3D models (GLB), envmaps, and textures
│   └── ui/                     # Shared UI components and all 11 experience templates
├── pnpm-workspace.yaml          # Monorepo workspaces definition
├── turbo.json                   # Build pipeline orchestration
└── package.json                 # Monorepo scripts and workspace settings
```

---

## 🎭 Included Virtual Try-On Modules

1. **💄 Lipstick Try-On**: Real-time canvas overlay rendering of lip contours supporting **Matte, Glossy, and Satin finishes** with color picking, opacity sliders, and before/after comparisons.
2. **🎨 Makeup Shapes**: Eyeshadow, eyebrows, eyeliner, blush, and contour applied dynamically using Canvas2D polygon masks and radial blend gradients.
3. **✨ Skin & Texture**: Foundation testing and skin smoothing using **Three.js UV face mapping** on a standard 3D face mesh.
4. **🏈 Sports Paint**: Interactive sports markings and flag overlays (e.g. Football Stripes, USA flags) rendered directly onto the face mesh.
5. **🕶️ 3D Glasses**: Realistic glasses VTO using GLB frames, environment mapping, and **depth occluders** for ear temple occlusion.
6. **💎 3D Earrings**: Real-time positioning, lighting, and PBR materials rendering GLB drop earrings.
7. **👂 2D Earrings**: Hoop and pearl drop earrings rendered as 2D sprite planes with rotation and scale controls.
8. **📿 3D Necklace**: Chain and pendant positioning utilizing a custom neck occluder to prevent depth glitches.
9. **🪖 Sports Helmets**: Fitted motorcycle helmets positioned above the skull with automatic tracking adjustments.
10. **🧢 Hat VTO**: Preview caps, beanies, and hats angled correctly relative to the forehead.
11. **🎧 Over-Ear Headphones**: Studio headphone models with physical material reflections.

---

## 🚀 Setup & Execution

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **pnpm** (installed via corepack or npm)

### 1. Install Dependencies
Initialize and link all monorepo packages (ignoring compilation scripts for prebuilt dependencies):
```bash
pnpm install --ignore-scripts
```

### 2. Run the Development Server
Launch the gateway web application locally:
```bash
pnpm dev
```
Once started, open `http://localhost:3000` in your browser.

### 3. Build for Production
Bundle the entire monorepo into static assets optimized for production delivery:
```bash
pnpm build
```
The compiled, production-ready code will be placed inside `apps/web/dist/`.

---

## 🛠️ Key Technical Details

* **Coordinate System & Math**: The core WebAR.rocks.face tracker runs on a canvas element, exposing face matrices and normalized coordinates. The `@ar-vto/three-engine` hooks into these matrices to transform Three.js meshes synchronously with the camera feed.
* **Procedural Fallbacks**: High-fidelity 2D and 3D fallbacks (such as canvas-drawn gradients) are implemented to ensure components remain active even if remote assets fail to load.
* **Screenshots**: Captures are performed by composing the WebGL threeCanvas with background video layers and custom 2D overlays into a single, downloadable PNG.
