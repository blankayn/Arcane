import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

/* ─── 3D Crystal Component ─── */
function HextechCrystal() {
  const crystalRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  const crystalMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#00F0FF'),
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.92,
        thickness: 1.5,
        ior: 2.2,
        transparent: true,
        opacity: 0.85,
        envMapIntensity: 1.5,
      }),
    []
  );

  const ringMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#C49A3C'),
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      }),
    []
  );

  const cyanRingMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#00F0FF'),
        wireframe: true,
        transparent: true,
        opacity: 0.15,
      }),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (crystalRef.current) {
      crystalRef.current.rotation.y = t * 0.3;
      crystalRef.current.rotation.x = Math.sin(t * 0.2) * 0.15;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.5;
      ring1Ref.current.rotation.x = Math.PI * 0.25;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.35;
      ring2Ref.current.rotation.x = -Math.PI * 0.2;
      ring2Ref.current.rotation.y = t * 0.2;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = t * 0.2;
      ring3Ref.current.rotation.y = Math.PI * 0.5;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1.2}>
      <group>
        {/* Main crystal */}
        <mesh ref={crystalRef} material={crystalMaterial}>
          <icosahedronGeometry args={[1.3, 1]} />
        </mesh>

        {/* Inner glow */}
        <mesh>
          <icosahedronGeometry args={[1.0, 1]} />
          <meshBasicMaterial
            color="#00F0FF"
            transparent
            opacity={0.05}
          />
        </mesh>

        {/* Orbiting rings */}
        <mesh ref={ring1Ref} material={ringMaterial}>
          <torusGeometry args={[2.2, 0.01, 8, 64]} />
        </mesh>
        <mesh ref={ring2Ref} material={ringMaterial}>
          <torusGeometry args={[2.8, 0.008, 8, 80]} />
        </mesh>
        <mesh ref={ring3Ref} material={cyanRingMaterial}>
          <torusGeometry args={[3.4, 0.006, 8, 96]} />
        </mesh>
      </group>
    </Float>
  );
}

/* ─── Small Floating Particles in 3D ─── */
function CrystalParticles() {
  const ref = useRef<THREE.Points>(null);

  const [positions] = useMemo(() => {
    const count = 200;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return [pos];
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#00F0FF"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

/* ─── Hero Section ─── */
export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const xTo = gsap.quickTo(video, 'x', { duration: 0.65, ease: 'power3.out' });
    const yTo = gsap.quickTo(video, 'y', { duration: 0.65, ease: 'power3.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      xTo(x * 18);
      yTo(y * 12);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const chars = titleRef.current?.querySelectorAll('.char');

      const intro = gsap.timeline({
        delay: reduceMotion ? 0.2 : 3.2,
        defaults: { ease: 'power4.out' },
      });

      if (chars?.length) {
        intro.fromTo(
          chars,
          { autoAlpha: 0, y: 96, rotationX: -72 },
          {
            autoAlpha: 1,
            y: 0,
            rotationX: 0,
            duration: reduceMotion ? 0 : 1.35,
            stagger: reduceMotion ? 0 : 0.055,
          }
        );
      }

      intro
        .fromTo(
          subtitleRef.current,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: reduceMotion ? 0 : 0.9 },
          '-=0.55'
        )
        .fromTo(
          ctaRef.current,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: reduceMotion ? 0 : 0.72, ease: 'power3.out' },
          '-=0.38'
        );

      if (!reduceMotion) {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: container,
              start: 'top top',
              end: 'bottom top',
              scrub: 1,
            },
          })
          .to(titleRef.current, { yPercent: -18, scale: 0.96, ease: 'none' }, 0)
          .to(videoRef.current, { scale: 1.22, ease: 'none' }, 0);
      }
    }, container);

    return () => ctx.revert();
  }, []);

  const titleText = 'ARCANE';

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: '100vh', backgroundColor: '#0A0A0F' }}
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out"
        style={{ transform: 'scale(1.15)', willChange: 'transform' }}
      >
        <source src="./videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(10,10,15,0.4) 0%, rgba(10,10,15,0.3) 40%, rgba(10,10,15,0.85) 85%, rgba(10,10,15,1) 100%)',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 200px 80px rgba(0,0,0,0.6)' }}
      />

      {/* 3D Crystal Canvas */}
      <div className="absolute inset-0 z-[1]">
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 6], fov: 45 }}
          style={{ pointerEvents: 'none' }}
        >
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} color="#00F0FF" intensity={2} />
          <pointLight position={[-3, -2, 4]} color="#C49A3C" intensity={0.8} />
          <HextechCrystal />
          <CrystalParticles />
          <Environment preset="night" />
        </Canvas>
      </div>

      {/* Decorative rotating hexagons */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] opacity-[0.04] pointer-events-none z-[2]">
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ animation: 'spin-slow 90s linear infinite' }}>
          <polygon points="100,5 195,52 195,148 100,195 5,148 5,52" fill="none" stroke="#00F0FF" strokeWidth="0.3" />
          <polygon points="100,25 175,62 175,138 100,175 25,138 25,62" fill="none" stroke="#C49A3C" strokeWidth="0.2" />
          <polygon points="100,45 155,72 155,128 100,155 45,128 45,72" fill="none" stroke="#00F0FF" strokeWidth="0.15" />
        </svg>
      </div>

      {/* Thin decorative lines */}
      <div className="absolute top-[30%] left-0 w-full h-[1px] opacity-[0.06] z-[2]" style={{ background: 'linear-gradient(to right, transparent, #00F0FF, transparent)' }} />
      <div className="absolute top-[70%] left-0 w-full h-[1px] opacity-[0.06] z-[2]" style={{ background: 'linear-gradient(to right, transparent, #C49A3C, transparent)' }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        {/* Title */}
        <h1
          ref={titleRef}
          className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[12rem] tracking-[0.08em] sm:tracking-[0.12em] text-center whitespace-nowrap"
          style={{
            color: '#E2E2E2',
            textShadow: '0 0 60px rgba(0, 240, 255, 0.3), 0 0 120px rgba(0, 240, 255, 0.1)',
            perspective: '1000px',
          }}
        >
          {titleText.split('').map((char, i) => (
            <span
              key={i}
            className="char inline-block opacity-0"
              style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="font-body text-xs md:text-sm tracking-[0.5em] uppercase mt-4 md:mt-6 opacity-0"
          style={{ color: '#C49A3C' }}
        >
          Hextech Archives
        </p>

        {/* CTA Button */}
        <button
          ref={ctaRef}
          className="mt-10 md:mt-12 px-8 md:px-12 py-3 md:py-4 font-body text-[10px] md:text-xs tracking-[0.3em] uppercase transition-all duration-500 hover:scale-105 opacity-0 group"
          style={{
            color: '#00F0FF',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            background: 'rgba(0, 240, 255, 0.03)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 240, 255, 0.1)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 240, 255, 0.2), inset 0 0 30px rgba(0, 240, 255, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 240, 255, 0.03)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.3)';
          }}
          onClick={() => {
            document.getElementById('lore-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Enter the Archive
        </button>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="font-body text-[9px] tracking-[0.4em] uppercase opacity-30" style={{ color: '#E2E2E2' }}>
            Scroll
          </span>
          <div className="flex flex-col items-center gap-1" style={{ animation: 'bounce-down 2s ease-in-out infinite' }}>
            <div className="w-[1px] h-8 bg-gradient-to-b from-[#00F0FF]/40 to-transparent" />
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="opacity-40">
              <path d="M1 1L5 5L9 1" stroke="#00F0FF" strokeWidth="1" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
