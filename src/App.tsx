import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navigation from './components/Navigation';
import LoadingScreen from './components/LoadingScreen';
import CustomCursor from './components/CustomCursor';
import AmbientParticles from './components/AmbientParticles';
import HeroSection from './sections/HeroSection';
import DivergenceSection from './sections/DivergenceSection';
import LoreTunnel from './sections/LoreTunnel';
import CharacterDeck from './sections/CharacterDeck';
import ArchiveSection from './sections/ArchiveSection';
import FooterSection from './sections/FooterSection';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const lenisRef = useRef<Lenis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'piltover' | 'zaun'>('piltover');

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);

    gsap.ticker.lagSmoothing(0);

    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1000);

    return () => {
      clearTimeout(refreshTimeout);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  // Theme detection based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const divergenceEl = document.getElementById('divergence-section');
      if (divergenceEl) {
        setTheme(window.scrollY > divergenceEl.offsetTop - 200 ? 'zaun' : 'piltover');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative">
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <CustomCursor />
      <AmbientParticles theme={theme} />

      {/* Scanline overlay */}
      <div className="scanline-overlay" />

      <Navigation />
      <main>
        <HeroSection />
        <DivergenceSection />
        <LoreTunnel />
        <CharacterDeck />
        <ArchiveSection />
        <FooterSection />
      </main>
    </div>
  );
}
