
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { ArrowLeft } from 'lucide-react';
import {
  LipstickVTO,
  MakeupShapesVTO,
  MakeupTextureVTO,
  SportsMakeupVTO,
  Earrings2DVTO,
  Earrings3DVTO,
  GlassesVTO,
  HeadphonesVTO,
  HelmetVTO,
  HatVTO,
  NecklaceVTO
} from '@ar-vto/ui';

// Layout wrapper that adds a floating Back button on experience pages
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const isEmbed = query.get('embed') === 'true';
  const isHome = location.pathname === '/';

  return (
    <div className="relative min-h-screen">
      {/* Floating Back to Portal Home Button (hidden in embed mode) */}
      {!isHome && !isEmbed && (
        <Link
          to="/"
          className="fixed top-4 left-4 z-30 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/10 text-xs font-semibold text-white shadow-2xl backdrop-blur-md transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Portal</span>
        </Link>
      )}
      {children}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lipstick" element={<LipstickVTO />} />
          <Route path="/makeup-shapes" element={<MakeupShapesVTO />} />
          <Route path="/makeup-texture" element={<MakeupTextureVTO />} />
          <Route path="/sports-makeup" element={<SportsMakeupVTO />} />
          <Route path="/earrings-2d" element={<Earrings2DVTO />} />
          <Route path="/earrings-3d" element={<Earrings3DVTO />} />
          <Route path="/glasses" element={<GlassesVTO />} />
          <Route path="/headphones" element={<HeadphonesVTO />} />
          <Route path="/helmet" element={<HelmetVTO />} />
          <Route path="/hat" element={<HatVTO />} />
          <Route path="/necklace" element={<NecklaceVTO />} />
        </Routes>
      </Layout>
    </Router>
  );
};
export default App;
