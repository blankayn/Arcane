import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Chapter {
  id: string;
  numeral: string;
  title: string;
  color: string;
  background: string;
  content: string;
}

const CHAPTERS: Chapter[] = [
  {
    id: 'chapter-1',
    numeral: 'I',
    title: 'The Underground',
    color: '#00F0FF',
    background: './images/env-zaun.jpg',
    content:
      'Beneath the gleaming towers of Piltover lies Zaun, a city of smoke and shadow. Here, in the toxic depths, a young orphan named Powder would discover that chaos is not just destruction — it is creation unbound.',
  },
  {
    id: 'chapter-2',
    numeral: 'II',
    title: 'Hextech Rising',
    color: '#00FF9D',
    background: './images/env-hextech.jpg',
    content:
      'Jayce Talis and Viktor dreamed of harnessing magic through science. Their creation — Hextech — would bridge the gap between the arcane and the mechanical, changing the course of two cities forever.',
  },
  {
    id: 'chapter-3',
    numeral: 'III',
    title: 'Two Sisters',
    color: '#C49A3C',
    background: './images/env-bridge.jpg',
    content:
      'Vi and Jinx. Order and chaos. Two sides of the same coin, torn apart by tragedy and reunited by fate. Their bond, forged in the fires of the Undercity, is the thread that binds two worlds together.',
  },
  {
    id: 'chapter-4',
    numeral: 'IV',
    title: 'The Revolution',
    color: '#FF0055',
    background: './images/env-piltover.jpg',
    content:
      'As tensions between Piltover and Zaun reach a breaking point, old alliances shatter and new heroes emerge. The fight for the future is not between topside and under — it is for the soul of progress itself.',
  },
];

export default function LoreTunnel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeChapter, setActiveChapter] = useState(0);
  const frameRef = useRef<number>(0);
  const meshRef = useRef<THREE.InstancedMesh | null>(null);
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);

  // Three.js scene setup — memoized so it's stable across renders
  const sceneSetup = useMemo(() => {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#0A0A0F', 0.04);
    const camera = new THREE.PerspectiveCamera(
      60,
      typeof window !== 'undefined' ? window.innerWidth / window.innerHeight : 1,
      0.1,
      100
    );
    camera.position.z = 14;
    return { scene, camera };
  }, []);

  // Assign section ref at index
  const setSectionRef = useCallback(
    (el: HTMLElement | null, idx: number) => {
      sectionRefs.current[idx] = el;
    },
    []
  );

  // ─── Three.js Crystal Particle Field ──────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { scene, camera } = sceneSetup;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Crystal geometry
    const geometry = new THREE.OctahedronGeometry(0.35, 0);

    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(CHAPTERS[0].color),
      metalness: 0.9,
      roughness: 0.05,
      transmission: 0.85,
      thickness: 0.4,
      transparent: true,
      opacity: 0.45,
      wireframe: true,
    });

    const INSTANCE_COUNT = 200;
    const mesh = new THREE.InstancedMesh(geometry, material, INSTANCE_COUNT);
    meshRef.current = mesh;

    const dummy = new THREE.Object3D();
    interface ParticleData {
      x: number;
      y: number;
      z: number;
      rx: number;
      ry: number;
      rz: number;
      speed: number;
    }
    const particleData: ParticleData[] = [];

    for (let i = 0; i < INSTANCE_COUNT; i++) {
      const radius = 4 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      dummy.position.set(x, y, z);
      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      dummy.scale.setScalar(Math.random() * 1.2 + 0.15);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      particleData.push({
        x,
        y,
        z,
        rx: (Math.random() - 0.5) * 0.008,
        ry: (Math.random() - 0.5) * 0.008,
        rz: (Math.random() - 0.5) * 0.008,
        speed: 0.3 + Math.random() * 0.7,
      });
    }

    mesh.instanceMatrix.needsUpdate = true;
    scene.add(mesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight('#ffffff', 1.8);
    pointLight1.position.set(8, 6, 12);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight('#00F0FF', 1.2);
    pointLight2.position.set(-6, -4, 8);
    scene.add(pointLight2);

    // Mouse interactivity
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      mouse.x += (mouse.targetX - mouse.x) * 0.03;
      mouse.y += (mouse.targetY - mouse.y) * 0.03;

      camera.position.x = mouse.x * 2;
      camera.position.y = mouse.y * 2;
      camera.lookAt(scene.position);

      mesh.rotation.y += 0.0008;
      mesh.rotation.x += 0.0003;

      for (let i = 0; i < INSTANCE_COUNT; i++) {
        mesh.getMatrixAt(i, dummy.matrix);
        dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
        dummy.rotation.x += particleData[i].rx;
        dummy.rotation.y += particleData[i].ry;
        dummy.rotation.z += particleData[i].rz;
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      scene.remove(mesh);
      scene.remove(ambientLight);
      scene.remove(pointLight1);
      scene.remove(pointLight2);
    };
  }, [sceneSetup]);

  // ─── Update crystal color on active chapter change ────────────────
  useEffect(() => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshPhysicalMaterial;
      const target = new THREE.Color(CHAPTERS[activeChapter].color);
      gsap.to(mat.color, {
        r: target.r,
        g: target.g,
        b: target.b,
        duration: 1.2,
        ease: 'power2.inOut',
      });
    }
  }, [activeChapter]);

  // ─── ScrollTrigger animations for each chapter ────────────────────
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timeout = setTimeout(() => {
      // Kill any previous triggers
      scrollTriggersRef.current.forEach((st) => st.kill());
      scrollTriggersRef.current = [];

      sectionRefs.current.forEach((section, idx) => {
        if (!section) return;

        const title = section.querySelector<HTMLElement>('.chapter-title');
        const numeral = section.querySelector<HTMLElement>('.chapter-numeral');
        const body = section.querySelector<HTMLElement>('.chapter-body');
        const line = section.querySelector<HTMLElement>('.chapter-line');

        // Set initial states
        if (numeral) gsap.set(numeral, { opacity: 0, scale: 0.6, y: 40 });
        if (title) gsap.set(title, { opacity: 0, y: 60 });
        if (line) gsap.set(line, { scaleX: 0 });
        if (body) gsap.set(body, { opacity: 0, y: 50 });

        // Create scroll-triggered timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'center center',
            toggleActions: 'play none none reverse',
            onEnter: () => setActiveChapter(idx),
            onEnterBack: () => setActiveChapter(idx),
          },
        });

        if (numeral) {
          tl.to(numeral, {
            opacity: 0.12,
            scale: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
          });
        }

        if (title) {
          tl.to(
            title,
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: 'power3.out',
            },
            '-=0.7'
          );
        }

        if (line) {
          tl.to(
            line,
            {
              scaleX: 1,
              duration: 0.8,
              ease: 'power2.inOut',
            },
            '-=0.5'
          );
        }

        if (body) {
          tl.to(
            body,
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: 'power3.out',
            },
            '-=0.4'
          );
        }

        if (tl.scrollTrigger) {
          scrollTriggersRef.current.push(tl.scrollTrigger);
        }
      });

      ScrollTrigger.refresh();
    }, 300);

    return () => {
      clearTimeout(timeout);
      scrollTriggersRef.current.forEach((st) => st.kill());
    };
  }, []);

  // ─── Click navigation dot → scroll to chapter ────────────────────
  const scrollToChapter = useCallback((idx: number) => {
    const section = sectionRefs.current[idx];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div id="lore-section" className="relative w-full" style={{ backgroundColor: '#0A0A0F' }}>
      {/* ── Three.js Canvas (fixed behind everything) ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* ── Fixed Side Navigation Dots ── */}
      <nav
        className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-6"
        aria-label="Chapter navigation"
      >
        {CHAPTERS.map((ch, idx) => (
          <button
            key={ch.id}
            onClick={() => scrollToChapter(idx)}
            className="group relative flex items-center gap-3 cursor-pointer bg-transparent border-none p-0"
            aria-label={`Chapter ${ch.numeral}: ${ch.title}`}
          >
            {/* Dot */}
            <span
              className="block rounded-full transition-all duration-500 ease-out"
              style={{
                width: activeChapter === idx ? 14 : 8,
                height: activeChapter === idx ? 14 : 8,
                backgroundColor:
                  activeChapter === idx ? ch.color : 'rgba(255,255,255,0.2)',
                boxShadow:
                  activeChapter === idx
                    ? `0 0 12px ${ch.color}, 0 0 24px ${ch.color}40`
                    : 'none',
              }}
            />

            {/* Roman numeral tooltip */}
            <span
              className="font-display text-xs tracking-[0.3em] uppercase transition-all duration-300 whitespace-nowrap"
              style={{
                color: activeChapter === idx ? ch.color : 'rgba(255,255,255,0.3)',
                opacity: activeChapter === idx ? 1 : 0,
                transform: activeChapter === idx ? 'translateX(0)' : 'translateX(-8px)',
              }}
            >
              {ch.numeral}
            </span>
          </button>
        ))}

        {/* Connecting line */}
        <div
          className="absolute left-[3.5px] top-[7px] w-px pointer-events-none"
          style={{
            height: `calc(100% - 14px)`,
            background: `linear-gradient(to bottom, ${CHAPTERS[0].color}30, ${CHAPTERS[CHAPTERS.length - 1].color}30)`,
          }}
        />
      </nav>

      {/* ── Chapter Sections ── */}
      {CHAPTERS.map((ch, idx) => (
        <section
          key={ch.id}
          ref={(el) => setSectionRef(el, idx)}
          className="relative w-full overflow-hidden"
          style={{ height: '100vh' }}
        >
          {/* Background image with parallax */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${ch.background})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
              willChange: 'transform',
            }}
          />

          {/* Dark gradient overlay */}
          <div
            className="absolute inset-0 z-[1]"
            style={{
              background:
                'linear-gradient(to bottom, rgba(10,10,15,0.45) 0%, rgba(10,10,15,0.7) 50%, rgba(10,10,15,0.92) 100%)',
            }}
          />

          {/* Side accent glow */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1 z-[2]"
            style={{
              background: `linear-gradient(to bottom, transparent, ${ch.color}60, transparent)`,
              boxShadow: `0 0 30px ${ch.color}20`,
            }}
          />

          {/* Content */}
          <div className="relative z-10 h-full flex items-center justify-center px-8 md:px-20 lg:px-32">
            <div className="max-w-3xl w-full relative">
              {/* Giant background numeral */}
              <div
                className="chapter-numeral absolute -left-4 md:-left-12 -top-16 md:-top-24 font-display select-none pointer-events-none"
                style={{
                  fontSize: 'clamp(8rem, 18vw, 16rem)',
                  color: ch.color,
                  lineHeight: 1,
                  opacity: 0,
                }}
              >
                {ch.numeral}
              </div>

              {/* Title */}
              <div className="relative">
                <span
                  className="font-body text-xs tracking-[0.4em] uppercase block mb-3"
                  style={{ color: `${ch.color}99` }}
                >
                  Chapter {ch.numeral}
                </span>
                <h2
                  className="chapter-title font-display text-4xl md:text-6xl lg:text-7xl leading-[1.1] mb-0"
                  style={{ color: '#E8E8ED' }}
                >
                  {ch.title}
                </h2>
              </div>

              {/* Divider line */}
              <div
                className="chapter-line my-6 md:my-8 h-px origin-left"
                style={{
                  background: `linear-gradient(to right, ${ch.color}, transparent)`,
                }}
              />

              {/* Body text */}
              <p
                className="chapter-body font-body text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl"
                style={{ color: 'rgba(226,226,226,0.85)' }}
              >
                {ch.content}
              </p>

              {/* Bottom accent */}
              <div
                className="mt-8 md:mt-12 flex items-center gap-3 opacity-40"
              >
                <span
                  className="block w-8 h-px"
                  style={{ backgroundColor: ch.color }}
                />
                <span
                  className="font-body text-[10px] tracking-[0.5em] uppercase"
                  style={{ color: ch.color }}
                >
                  {String(idx + 1).padStart(2, '0')} / {String(CHAPTERS.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
