import { useEffect, useRef } from 'react';

interface AmbientParticlesProps {
  theme: 'piltover' | 'zaun';
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  phase: number;
}

export default function AmbientParticles({ theme }: AmbientParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    // Init particles
    const particles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.3 + 0.05,
        wobbleSpeed: Math.random() * 0.02 + 0.005,
        wobbleAmp: Math.random() * 30 + 10,
        phase: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = particles;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', resize);

    let time = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.016;

      for (const p of particles) {
        p.y -= p.speed;
        const wobbleX = Math.sin(time * p.wobbleSpeed * 60 + p.phase) * p.wobbleAmp * 0.02;
        p.x += wobbleX;

        // Repel from mouse
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * 1.5;
          p.y += (dy / dist) * force * 1.5;
        }

        // Respawn at bottom
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = theme === 'zaun'
          ? `rgba(0, 240, 255, ${p.opacity})`
          : `rgba(196, 154, 60, ${p.opacity})`;
        ctx.fill();
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 30 }}
    />
  );
}
