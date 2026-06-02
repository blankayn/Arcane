import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ArchiveItem {
  title: string;
  category: string;
  year: string;
  image: string;
  details: string;
  technicalSpecs: string[];
}

const ARCHIVE_ITEMS: ArchiveItem[] = [
  {
    title: 'Hextech Crystal Synthesis',
    category: 'Schematic',
    year: 'Arcane S1',
    image: './images/env-hextech.jpg',
    details: 'Early prototype designs for stabilizing volatile hextech crystals. These schematics show the initial attempts at containing arcane energy for practical applications.',
    technicalSpecs: [
      'Crystal lattice structure: Hexagonal',
      'Energy output: 2.4 GW',
      'Stabilization field: Thaumechanical',
      'Material: Hexcore alloy'
    ]
  },
  {
    title: 'Piltover City Planning',
    category: 'Architecture',
    year: 'Pre-Development',
    image: './images/env-piltover.png',
    details: 'Original city expansion plans showing the envisioned growth of Piltover into a technological metropolis. Includes proposed hextech infrastructure zones.',
    technicalSpecs: [
      'Planned districts: 12',
      'Hextech zones: 3',
      'Population capacity: 500,000',
      'Timeline: 10-year plan'
    ]
  },
  {
    title: 'Zaun Undercity Survey',
    category: 'Research',
    year: 'Arcane S1',
    image: './images/env-zaun.jpg',
    details: 'Geological and structural surveys of Zaun\'s undercity levels. Documents the complex network of tunnels, chemical runoff systems, and hextech waste repositories.',
    technicalSpecs: [
      'Depth surveyed: 200m',
      'Tunnel networks: 87km',
      'Chemical zones: 14',
      'Structural integrity: Varied'
    ]
  },
  {
    title: 'Bridge of Progress',
    category: 'Engineering',
    year: 'Arcane S1',
    image: './images/env-bridge.jpg',
    details: 'Engineering blueprints for the iconic bridge connecting Piltover and Zaun. Shows the hextech-powered suspension system and decorative elements.',
    technicalSpecs: [
      'Span: 500 meters',
      'Load capacity: 10,000 tons',
      'Power source: Hextech cores',
      'Materials: Steel, hex-plating'
    ]
  },
  {
    title: 'Jayce\'s Workshop',
    category: 'Laboratory',
    year: 'Arcane S1',
    image: './images/env-workshop.jpg',
    details: 'Layout and equipment specifications for Jayce\'s personal laboratory. Includes designs for his mercury hammer prototype and various hextech experiments.',
    technicalSpecs: [
      'Workshop size: 200 sqm',
      'Power output: 500 kW',
      'Key inventions: 12',
      'Safety level: Class 4'
    ]
  },
  {
    title: 'Airship Design',
    category: 'Transport',
    year: 'Arcane S1',
    image: './images/env-airship.jpg',
    details: 'Conceptual designs for Piltover\'s aerial patrol vessels. Features hextech propulsion systems and defensive armaments.',
    technicalSpecs: [
      'Length: 80 meters',
      'Speed: 120 knots',
      'Armament: Hextech cannons',
      'Crew capacity: 25'
    ]
  },
];

export default function ArchiveSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;

    const triggers: ScrollTrigger[] = [];

    // Title animation
    const title = section.querySelector('.archive-title');
    if (title) {
      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(title,
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
          );
        },
        once: true,
      });
      triggers.push(st);
    }

    // Grid items stagger reveal on scroll
    const items = grid.querySelectorAll('.archive-item');
    items.forEach((item, i) => {
      const st = ScrollTrigger.create({
        trigger: item,
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo(item,
            { opacity: 0, y: 40, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', delay: i * 0.08 }
          );
        },
        once: true,
      });
      triggers.push(st);
    });

    return () => {
      triggers.forEach(t => t.kill());
    };
  }, []);

  const handleItemClick = (item: ArchiveItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    // Disable body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    // Restore body scroll
    document.body.style.overflow = '';
  };

  // Maps index to Bento grid classes for desktop layout
  const getBentoClass = (index: number) => {
    switch (index) {
      case 0:
        return 'md:col-span-2 md:row-span-2 min-h-[460px]';
      case 1:
        return 'md:col-span-1 md:row-span-1 min-h-[220px]';
      case 2:
        return 'md:col-span-1 md:row-span-1 min-h-[220px]';
      case 3:
        return 'md:col-span-2 md:row-span-1 min-h-[220px]';
      case 4:
        return 'md:col-span-1 md:row-span-1 min-h-[220px]';
      case 5:
        return 'md:col-span-3 md:row-span-1 min-h-[240px]';
      default:
        return 'md:col-span-1';
    }
  };

  return (
    <section
      id="archive-section"
      ref={sectionRef}
      className="relative w-full py-32 px-6 md:px-16 overflow-hidden"
      style={{ backgroundColor: '#0A0A0F', minHeight: '100vh' }}
    >
      {/* Decorative ambient background glow */}
      <div 
        className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.03]"
        style={{
          background: 'radial-gradient(circle, #00F0FF 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full pointer-events-none opacity-[0.02]"
        style={{
          background: 'radial-gradient(circle, #C49A3C 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Grid line accents */}
      <div className="absolute top-0 left-[15%] w-[1px] h-full bg-gradient-to-b from-transparent via-white/[0.03] to-transparent pointer-events-none" />
      <div className="absolute top-0 right-[15%] w-[1px] h-full bg-gradient-to-b from-transparent via-white/[0.03] to-transparent pointer-events-none" />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-20 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span
              className="archive-title font-body text-xs tracking-[0.3em] uppercase block mb-4"
              style={{ color: '#00F0FF', opacity: 0 }}
            >
              Technical Readouts
            </span>
            <h2
              className="archive-title font-display text-4xl sm:text-5xl md:text-6xl tracking-[0.08em]"
              style={{
                color: '#E2E2E2',
                textShadow: '0 0 40px rgba(0, 240, 255, 0.2)',
                opacity: 0
              }}
            >
              The Archive
            </h2>
          </div>
          <div className="flex items-center gap-4 archive-title" style={{ opacity: 0 }}>
            <div className="w-12 h-[1px]" style={{ backgroundColor: 'rgba(0, 240, 255, 0.3)' }} />
            <span className="font-body text-xs tracking-[0.2em] uppercase" style={{ color: '#00F0FF', opacity: 0.7 }}>
              {ARCHIVE_ITEMS.length} Secure Entries
            </span>
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div
        ref={gridRef}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10"
      >
        {ARCHIVE_ITEMS.map((item, i) => (
          <div
            key={i}
            onClick={() => handleItemClick(item)}
            className={`archive-item group cursor-pointer relative overflow-hidden rounded-xl border transition-all duration-500 ease-out flex flex-col justify-between ${getBentoClass(i)}`}
            style={{
              opacity: 0,
              backgroundColor: 'rgba(20, 20, 30, 0.4)',
              borderColor: 'rgba(0, 240, 255, 0.08)',
              backdropFilter: 'blur(12px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.3)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 240, 255, 0.15), inset 0 0 15px rgba(0, 240, 255, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.08)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Background image & gradient overlay */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover opacity-30 transition-all duration-700 group-hover:scale-105 group-hover:opacity-40"
              />
              <div
                className="absolute inset-0 transition-colors duration-500"
                style={{
                  background: 'linear-gradient(to top, rgba(10, 10, 15, 0.95) 0%, rgba(10, 10, 15, 0.6) 50%, rgba(10, 10, 15, 0.3) 100%)',
                }}
              />
            </div>

            {/* Corner tech lines (only visible on hover) */}
            <div className="absolute top-0 right-0 w-6 h-6 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
              style={{
                borderTop: '1px solid #00F0FF',
                borderRight: '1px solid #00F0FF',
              }}
            />
            <div className="absolute bottom-0 left-0 w-6 h-6 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
              style={{
                borderBottom: '1px solid #00F0FF',
                borderLeft: '1px solid #00F0FF',
              }}
            />

            {/* Top Tag & Year */}
            <div className="relative z-10 p-6 flex items-center justify-between pointer-events-none w-full">
              <span
                className="font-body text-[9px] tracking-[0.25em] uppercase px-3 py-1 rounded"
                style={{
                  color: '#00F0FF',
                  border: '1px solid rgba(0, 240, 255, 0.2)',
                  background: 'rgba(0, 240, 255, 0.02)',
                }}
              >
                {item.category}
              </span>
              <span className="font-body text-[9px] tracking-wider opacity-40 uppercase" style={{ color: '#E2E2E2' }}>
                {item.year}
              </span>
            </div>

            {/* Bottom Content & Hover Underline */}
            <div className="relative z-10 p-6 w-full mt-auto">
              <h3
                className="font-display text-xl sm:text-2xl tracking-[0.05em] group-hover:tracking-[0.08em] transition-all duration-500 mb-2"
                style={{ color: '#E2E2E2' }}
              >
                {item.title}
              </h3>
              
              {/* Short preview of details for larger items */}
              {i === 0 || i === 5 ? (
                <p className="font-body text-xs text-gray-400 max-w-lg mb-3 line-clamp-2 transition-all opacity-60 group-hover:opacity-100">
                  {item.details}
                </p>
              ) : null}

              {/* Hover dynamic indicator line */}
              <div
                className="h-[1px] w-0 group-hover:w-full transition-all duration-500 ease-out"
                style={{
                  background: 'linear-gradient(90deg, #00F0FF, transparent)',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Subtle bottom separator */}
      <div className="absolute bottom-0 left-0 w-full h-[1px]" style={{ background: 'linear-gradient(to right, transparent, rgba(0, 240, 255, 0.15), transparent)' }} />
      
      {/* Immersive Glassmorphism Modal */}
      {isModalOpen && selectedItem ? (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300"
          onClick={handleModalClose}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl border shadow-2xl animate-scale-in"
            style={{
              backgroundColor: 'rgba(15, 15, 25, 0.9)',
              borderColor: 'rgba(0, 240, 255, 0.2)',
              boxShadow: '0 0 50px rgba(0, 240, 255, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleModalClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full border border-white/10 hover:border-[#00F0FF]/60 hover:bg-[#00F0FF]/10 text-white/50 hover:text-[#00F0FF] transition-all duration-300 cursor-pointer"
              aria-label="Close modal"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {/* Modal Header/Image */}
            <div className="relative h-[250px] sm:h-[350px] overflow-hidden w-full">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to bottom, transparent 30%, rgba(15, 15, 25, 1) 100%)',
                }}
              />
              <div className="absolute bottom-6 left-6 sm:left-10 z-10 text-left">
                <span className="font-body text-[10px] tracking-[0.3em] uppercase px-3 py-1 rounded bg-[#00F0FF]/10 border border-[#00F0FF]/40 text-[#00F0FF] mb-3 inline-block">
                  {selectedItem.category}
                </span>
                <h2 className="font-display text-2xl sm:text-4xl tracking-[0.08em] text-[#E2E2E2] mt-2">
                  {selectedItem.title}
                </h2>
              </div>
            </div>

            {/* Modal Info Content */}
            <div className="p-8 sm:p-10 grid grid-cols-1 md:grid-cols-5 gap-8">
              {/* Details Column */}
              <div className="md:col-span-3 text-left space-y-4">
                <h4 className="font-display text-sm tracking-[0.2em] uppercase text-[#00F0FF]">
                  Overview
                </h4>
                <p className="font-body text-sm sm:text-base leading-relaxed text-gray-300">
                  {selectedItem.details}
                </p>
              </div>

              {/* Specs Column */}
              <div className="md:col-span-2 text-left space-y-4">
                <h4 className="font-display text-sm tracking-[0.2em] uppercase text-[#C49A3C]">
                  Technical Specifications
                </h4>
                <div className="border border-white/5 rounded-lg overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                  <table className="w-full text-xs sm:text-sm">
                    <tbody>
                      {selectedItem.technicalSpecs.map((spec, index) => {
                        const [label, val] = spec.split(': ');
                        return (
                          <tr 
                            key={index}
                            className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02]"
                          >
                            <td className="p-3 font-body font-semibold text-gray-400 tracking-wide uppercase text-[10px] w-1/2">
                              {label}
                            </td>
                            <td className="p-3 font-body text-[#00F0FF] text-right">
                              {val}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
