/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { DebateArena } from './pages/DebateArena';
import { RoastResume } from './pages/RoastResume';
import { AnalyzeChat } from './pages/AnalyzeChat';
import { ParticleBackground } from './components/ParticleBackground';
import { AnimatePresence } from 'motion/react';

export default function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden selection:bg-neon-purple selection:text-white">
        <ParticleBackground />
        <div className="relative z-10 flex flex-col min-h-screen border-x border-white/5 max-w-7xl mx-auto bg-[#050505]/50">
          <Navbar />
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/debate" element={<DebateArena />} />
                <Route path="/roast" element={<RoastResume />} />
                <Route path="/analyze" element={<AnalyzeChat />} />
              </Routes>
            </AnimatePresence>
          </main>
          <footer className="p-8 border-t border-white/5 text-center text-white/30 text-xs font-mono tracking-widest uppercase">
            © 2026 AI Chaos Lab // The Internet Was A Mistake
          </footer>
        </div>
      </div>
    </Router>
  );
}

