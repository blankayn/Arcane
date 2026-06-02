import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FooterSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const elements = section.querySelectorAll('.footer-animate');
    const triggers: ScrollTrigger[] = [];

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      onEnter: () => {
        gsap.fromTo(elements,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 }
        );
      },
      once: true,
    });
    triggers.push(st);

    return () => {
      triggers.forEach(t => t.kill());
    };
  }, []);

  return (
    <footer
      ref={sectionRef}
      className="relative w-full py-28 px-6 md:px-16 overflow-hidden"
      style={{ backgroundColor: '#0A0A0F', minHeight: '65vh' }}
    >
      {/* Dynamic Top border glow divider */}
      <div 
        className="absolute top-0 left-0 w-full h-[1px]" 
        style={{ background: 'linear-gradient(to right, transparent, #00F0FF80, #C49A3C40, transparent)' }} 
      />

      {/* SVG Animated Circuit Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 1440 600" 
          preserveAspectRatio="none"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Circuit nodes and lines */}
          <path d="M -50,150 L 300,150 L 350,200 L 600,200 L 630,230 L 800,230 L 850,180 L 1200,180 L 1250,230 L 1500,230" stroke="#00F0FF" strokeWidth="0.5" strokeOpacity="0.15" />
          <path d="M 150,-50 L 150,220 L 200,270 L 200,400 L 150,450 L 150,650" stroke="#C49A3C" strokeWidth="0.5" strokeOpacity="0.1" />
          <path d="M 1300,-50 L 1300,250 L 1250,300 L 1250,480 L 1300,530 L 1300,650" stroke="#00F0FF" strokeWidth="0.5" strokeOpacity="0.1" />
          
          <path d="M 400,650 L 400,500 L 450,450 L 850,450 L 900,400 L 900,300 L 950,250 L 1500,250" stroke="#00F0FF" strokeWidth="0.5" strokeOpacity="0.12" />
          <path d="M -50,480 L 500,480 L 550,530 L 1000,530 L 1050,480 L 1500,480" stroke="#C49A3C" strokeWidth="0.5" strokeOpacity="0.08" />

          {/* Glowing Animated Traces */}
          <path 
            d="M -50,150 L 300,150 L 350,200 L 600,200 L 630,230 L 800,230 L 850,180 L 1200,180 L 1250,230 L 1500,230" 
            stroke="#00F0FF" 
            strokeWidth="1.2" 
            strokeOpacity="0.6"
            strokeDasharray="80 150"
            style={{
              animation: 'circuit-flow 12s linear infinite',
            }}
          />
          <path 
            d="M 400,650 L 400,500 L 450,450 L 850,450 L 900,400 L 900,300 L 950,250 L 1500,250" 
            stroke="#C49A3C" 
            strokeWidth="1" 
            strokeOpacity="0.5"
            strokeDasharray="60 180"
            style={{
              animation: 'circuit-flow 10s linear infinite reverse',
            }}
          />

          {/* Node junctions */}
          <circle cx="300" cy="150" r="2.5" fill="#00F0FF" fillOpacity="0.5" />
          <circle cx="350" cy="200" r="2" fill="#00F0FF" fillOpacity="0.4" stroke="#00F0FF" strokeWidth="0.5" strokeOpacity="0.8" />
          <circle cx="630" cy="230" r="2" fill="#00F0FF" fillOpacity="0.5" />
          <circle cx="850" cy="180" r="2.5" fill="#C49A3C" fillOpacity="0.5" />
          <circle cx="200" cy="270" r="2.5" fill="#C49A3C" fillOpacity="0.5" />
          <circle cx="1250" cy="300" r="2" fill="#00F0FF" fillOpacity="0.5" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Main CTA */}
        <div className="text-center mb-24">
          <span
            className="footer-animate font-body text-[10px] tracking-[0.35em] uppercase block mb-5"
            style={{ color: '#00F0FF', opacity: 0 }}
          >
            Hextech Network Terminal
          </span>
          <h2
            className="footer-animate font-display text-4xl sm:text-6xl tracking-[0.12em] mb-10 leading-tight"
            style={{ color: '#E2E2E2', opacity: 0 }}
          >
            INITIATE
            <br />
            <span style={{ color: '#00F0FF', textShadow: '0 0 30px rgba(0, 240, 255, 0.4)' }}>CONTACT</span>
          </h2>
          <button
            onClick={() => window.open('https://arcane.com', '_blank')}
            className="footer-animate relative px-12 py-4 font-body text-xs tracking-[0.25em] uppercase transition-all duration-500 hover:scale-105 border cursor-pointer select-none"
            style={{
              color: '#00F0FF',
              borderColor: 'rgba(0, 240, 255, 0.4)',
              backgroundColor: 'rgba(0, 240, 255, 0.02)',
              opacity: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 240, 255, 0.1)';
              e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 240, 255, 0.25), inset 0 0 20px rgba(0, 240, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 240, 255, 0.02)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.4)';
            }}
          >
            Establish Connection
          </button>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 text-left">
          {[
            { title: 'Lore Chronicles', items: ['Piltover City', 'Zaun District', 'Hextech Core', 'Dossiers Grid'] },
            { title: 'Vanguard Media', items: ['Season 1 Log', 'Season 2 Feed', 'Orchestration', 'Secure Gallery'] },
            { title: 'Syndicates', items: ['Forge Guild', 'Undercity Fire', 'Theory Node', 'Nexus Hub'] },
            { title: 'Core Protocols', items: ['Privacy Stack', 'Terms Matrix', 'Riot Registry', 'League Core'] },
          ].map((col) => (
            <div key={col.title} className="footer-animate space-y-4" style={{ opacity: 0 }}>
              <h4
                className="font-display text-[11px] tracking-[0.25em] uppercase font-semibold border-b border-white/5 pb-2"
                style={{ color: '#00F0FF' }}
              >
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.items.map((item) => (
                  <li key={item}>
                    <span
                      className="font-body text-xs tracking-wider cursor-pointer transition-all duration-300 hover:text-[#00F0FF] hover:translate-x-1 inline-block"
                      style={{ color: '#E2E2E2', opacity: 0.5 }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 relative z-10">
          <div className="footer-animate flex items-center gap-4 mb-4 md:mb-0" style={{ opacity: 0 }}>
            <span className="font-display text-xl tracking-widest text-[#E2E2E2]">
              ARCANE
            </span>
            <span className="font-body text-[9px] tracking-[0.2em] text-white/30">
              // HEXTECH ARCHIVES
            </span>
          </div>

          <div className="footer-animate flex items-center gap-6" style={{ opacity: 0 }}>
            <span className="font-body text-[9px] tracking-[0.15em] text-white/30 uppercase">
              A High-Fidelity 3D Web Experience
            </span>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#00F0FF', opacity: 0.6, boxShadow: '0 0 6px #00F0FF' }} />
            <span className="font-body text-[9px] tracking-[0.15em] text-white/30 uppercase">
              2026 FA.NET
            </span>
          </div>
        </div>
      </div>

      {/* Atmospheric radial bottom-center terminal aura */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at bottom, rgba(0, 240, 255, 0.04) 0%, transparent 70%)',
          filter: 'blur(30px)'
        }}
      />
    </footer>
  );
}
