import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Eye, Camera, ShoppingBag, Heart, ArrowRight } from 'lucide-react';

interface VTOCard {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: string;
  category: 'beauty' | 'accessories' | 'gear';
  color: string;
}

const vtoExperiences: VTOCard[] = [
  { id: 'lipstick', name: 'Lipstick Try-On', description: 'Test matte, glossy, and satin lipstick shades in real time.', path: '/lipstick', icon: '💄', category: 'beauty', color: 'from-pink-500 to-rose-600' },
  { id: 'shapes', name: 'Makeup Shapes', description: 'Apply eyeshadow palettes, precise eyeliner, blush, and contour.', path: '/makeup-shapes', icon: '🎨', category: 'beauty', color: 'from-purple-500 to-indigo-600' },
  { id: 'texture', name: 'Skin & Smoothing', description: 'Virtual foundation testing, pore-smoothing, and texture mapping.', path: '/makeup-texture', icon: '✨', category: 'beauty', color: 'from-amber-400 to-orange-600' },
  { id: 'sports', name: 'Sports Paint', description: 'Paint your team spirit with face markings and flag overlays.', path: '/sports-makeup', icon: '🏈', category: 'beauty', color: 'from-emerald-400 to-teal-600' },
  { id: 'glasses', name: '3D Glasses', description: 'Try luxury aviator frames with realistic ear-depth occlusion.', path: '/glasses', icon: '🕶️', category: 'accessories', color: 'from-blue-500 to-sky-600' },
  { id: 'earrings3d', name: '3D Earrings', description: 'Interact with PBR chandelier drop earrings following head movement.', path: '/earrings-3d', icon: '💎', category: 'accessories', color: 'from-amber-500 to-yellow-600' },
  { id: 'earrings2d', name: '2D Earrings', description: 'Check pearl drops and classic hoop PNG layouts with rotation support.', path: '/earrings-2d', icon: '👂', category: 'accessories', color: 'from-teal-400 to-emerald-600' },
  { id: 'necklace', name: '3D Necklace', description: 'Try on neck chains and luxury pendants with 3D depth adjustment.', path: '/necklace', icon: '📿', category: 'accessories', color: 'from-violet-500 to-fuchsia-600' },
  { id: 'helmet', name: 'Helmets VTO', description: 'Fitted motorcycle helmets with automatic scale-to-fit tracking.', path: '/helmet', icon: '🪖', category: 'gear', color: 'from-red-500 to-orange-600' },
  { id: 'hat', name: 'Hats VTO', description: 'Preview baseball caps and beanies styled directly on your head.', path: '/hat', icon: '🧢', category: 'gear', color: 'from-lime-400 to-green-600' },
  { id: 'headphones', name: 'Headphones VTO', description: 'Over-ear studio monitors rendered with physical materials.', path: '/headphones', icon: '🎧', category: 'gear', color: 'from-pink-500 to-purple-600' }
];

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pb-20">
      {/* Background radial effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-500">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
              AR BEAUTY & STYLE
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            <span className="text-rose-500">VTO Portal v1.0</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/20 bg-rose-500/5 text-xs text-rose-400 mb-6 font-medium">
          <Camera className="w-3.5 h-3.5 animate-pulse" />
          WebGL-Powered Real-Time Face Tracking
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl mx-auto leading-[1.1] mb-6">
          Virtual Try-On <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500">
            Beauty & Accessories
          </span>
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-8">
          Step into the future of retail. Experience cosmetics, glasses, hats, headphones, helmets, and jewelry mapped directly onto your face in real-time.
        </p>
      </section>

      {/* Categories sections */}
      <main className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col gap-16">
        {/* Beauty & Cosmetics */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-lg font-bold tracking-widest uppercase text-rose-400">01. Cosmetics & Makeup</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-rose-400/20 to-transparent" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vtoExperiences.filter(e => e.category === 'beauty').map((vto) => (
              <VTOExperienceCard key={vto.id} vto={vto} />
            ))}
          </div>
        </div>

        {/* Jewelry & Accessories */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-lg font-bold tracking-widest uppercase text-violet-400">02. Jewelry & Eyewear</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-violet-400/20 to-transparent" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vtoExperiences.filter(e => e.category === 'accessories').map((vto) => (
              <VTOExperienceCard key={vto.id} vto={vto} />
            ))}
          </div>
        </div>

        {/* Helmets, Hats & Gear */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-lg font-bold tracking-widest uppercase text-emerald-400">03. Hats, Helmets & Gear</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-emerald-400/20 to-transparent" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vtoExperiences.filter(e => e.category === 'gear').map((vto) => (
              <VTOExperienceCard key={vto.id} vto={vto} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

// Internal VTO Experience Card component
const VTOExperienceCard: React.FC<{ vto: VTOCard }> = ({ vto }) => {
  return (
    <Link
      to={vto.path}
      className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-2xl overflow-hidden"
    >
      {/* Decorative gradient light corner */}
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${vto.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300`} />

      <div>
        <div className="text-3xl mb-4 p-2.5 bg-white/5 border border-white/5 rounded-xl inline-block w-fit">
          {vto.icon}
        </div>
        <h3 className="text-base font-bold text-white mb-2 tracking-wide group-hover:text-rose-400 transition-colors">
          {vto.name}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          {vto.description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
        <span>LAUNCH EXPERIENCE</span>
        <ArrowRight className="w-4 h-4 -translate-x-1 group-hover:translate-x-0 transition-transform duration-200" />
      </div>
    </Link>
  );
};
