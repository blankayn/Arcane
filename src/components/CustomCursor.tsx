import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    // Don't show custom cursor on mobile
    if (window.innerWidth < 769) return;

    const handleMouseMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const handleMouseOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (
        el.tagName === 'BUTTON' ||
        el.tagName === 'A' ||
        el.closest('button') ||
        el.closest('a') ||
        el.closest('[data-cursor="pointer"]') ||
        el.classList.contains('cursor-pointer')
      ) {
        isHovering.current = true;
      }
    };

    const handleMouseOut = () => {
      isHovering.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      pos.current.x += (target.current.x - pos.current.x) * 0.15;
      pos.current.y += (target.current.y - pos.current.y) * 0.15;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${target.current.x - 3}px, ${target.current.y - 3}px)`;
      }

      if (ringRef.current) {
        const scale = isHovering.current ? 1.8 : 1;
        ringRef.current.style.transform = `translate(${pos.current.x - 18}px, ${pos.current.y - 18}px) scale(${scale})`;
        ringRef.current.style.borderColor = isHovering.current
          ? 'rgba(0, 240, 255, 0.6)'
          : 'rgba(0, 240, 255, 0.25)';
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  // Don't render on mobile
  if (typeof window !== 'undefined' && window.innerWidth < 769) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none hidden md:block"
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 240, 255, 0.9)',
          zIndex: 9998,
          transition: 'background-color 0.3s',
          boxShadow: '0 0 6px rgba(0, 240, 255, 0.5)',
        }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none hidden md:block"
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: '1px solid rgba(0, 240, 255, 0.25)',
          zIndex: 9997,
          transition: 'border-color 0.3s, transform 0.2s ease-out',
        }}
      />
    </>
  );
}
