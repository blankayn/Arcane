import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Navigation() {
  const [isZaun, setIsZaun] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const divergenceEl = document.getElementById('divergence-section');
      if (divergenceEl) {
        setIsZaun(window.scrollY > divergenceEl.offsetTop - 200);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (navRef.current) {
      gsap.to(navRef.current, {
        backgroundColor: isZaun ? 'rgba(10, 10, 15, 0.88)' : 'rgba(212, 197, 169, 0.75)',
        borderBottomColor: isZaun ? 'rgba(0, 240, 255, 0.12)' : 'rgba(196, 154, 60, 0.2)',
        duration: 0.6,
        ease: 'power2.inOut',
      });
    }
  }, [isZaun]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileOpen(false);
    }
  };

  const navLinks = [
    { label: 'LORE', target: 'lore-section' },
    { label: 'CHARACTERS', target: 'characters-section' },
    { label: 'ARCHIVE', target: 'archive-section' },
  ];

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 w-full z-50 border-b transition-colors duration-600"
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(212, 197, 169, 0.75)',
          borderBottomColor: 'rgba(196, 154, 60, 0.2)',
        }}
      >
        <div className="flex items-center justify-between px-6 md:px-8 py-4">
          {/* Logo */}
          <div
            className="font-display text-lg md:text-xl tracking-widest cursor-pointer"
            style={{ color: isZaun ? '#E2E2E2' : '#2C2419' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <span className={isZaun ? 'text-shimmer-cyan' : 'text-shimmer'}>
              ARCANE
            </span>
            <span className="text-[10px] ml-2 opacity-50 font-body tracking-wider hidden sm:inline">
              // HEXTECH ARCHIVES
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.target)}
                className="relative font-body text-xs tracking-[0.2em] uppercase group py-1"
                style={{ color: isZaun ? '#E2E2E2' : '#2C2419' }}
              >
                {item.label}
                <span
                  className="absolute bottom-0 left-0 w-0 h-[1px] group-hover:w-full transition-all duration-300"
                  style={{ backgroundColor: isZaun ? '#00F0FF' : '#C49A3C' }}
                />
              </button>
            ))}
          </div>

          {/* Right side: status + hamburger */}
          <div className="flex items-center gap-4">
            {/* Status indicator */}
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: isZaun ? '#00F0FF' : '#C49A3C',
                  animation: 'pulse-glow 3s ease-in-out infinite',
                  boxShadow: isZaun
                    ? '0 0 8px rgba(0, 240, 255, 0.5)'
                    : '0 0 8px rgba(196, 154, 60, 0.5)',
                }}
              />
              <span
                className="font-body text-[10px] tracking-wider uppercase opacity-60 hidden sm:inline"
                style={{ color: isZaun ? '#E2E2E2' : '#2C2419' }}
              >
                {isZaun ? 'Zaun' : 'Piltover'}
              </span>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col gap-[5px] p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span
                className="block w-5 h-[1.5px] transition-all duration-300 origin-center"
                style={{
                  backgroundColor: isZaun ? '#E2E2E2' : '#2C2419',
                  transform: mobileOpen ? 'rotate(45deg) translate(2px, 5px)' : 'none',
                }}
              />
              <span
                className="block w-5 h-[1.5px] transition-all duration-300"
                style={{
                  backgroundColor: isZaun ? '#E2E2E2' : '#2C2419',
                  opacity: mobileOpen ? 0 : 1,
                }}
              />
              <span
                className="block w-5 h-[1.5px] transition-all duration-300 origin-center"
                style={{
                  backgroundColor: isZaun ? '#E2E2E2' : '#2C2419',
                  transform: mobileOpen ? 'rotate(-45deg) translate(2px, -5px)' : 'none',
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className="fixed inset-0 z-40 md:hidden flex flex-col items-center justify-center gap-8 transition-all duration-500"
        style={{
          backgroundColor: isZaun ? 'rgba(10, 10, 15, 0.97)' : 'rgba(212, 197, 169, 0.97)',
          backdropFilter: 'blur(30px)',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
          transform: mobileOpen ? 'translateY(0)' : 'translateY(-20px)',
        }}
      >
        {navLinks.map((item, i) => (
          <button
            key={item.label}
            onClick={() => scrollTo(item.target)}
            className="font-display text-3xl tracking-[0.15em] transition-all duration-300"
            style={{
              color: isZaun ? '#E2E2E2' : '#2C2419',
              transitionDelay: mobileOpen ? `${i * 100}ms` : '0ms',
              transform: mobileOpen ? 'translateY(0)' : 'translateY(20px)',
              opacity: mobileOpen ? 1 : 0,
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}
