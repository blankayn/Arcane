import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const TUNNEL_VERTEX = `
uniform float uScrollSpeed;
varying vec2 vUv;
#define PI 3.141592653

void main() {
  vec3 pos = position;
  vec3 worldPosition = (modelMatrix * instanceMatrix * vec4(position, 1.0)).xyz;
  float angle = worldPosition.x * 0.5 + worldPosition.y * 0.2;
  float swirlX = cos(angle) * uScrollSpeed * 0.1;
  float swirlY = sin(angle) * uScrollSpeed * 0.1;
  pos.x += swirlX;
  pos.y += swirlY;
  pos.z += sin(worldPosition.y * 2.0) * cos(worldPosition.x * 2.0) * (uScrollSpeed * 0.2);
  gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
  vUv = uv;
}
`;

const TUNNEL_FRAGMENT = `
precision highp float;
uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
  vec4 texColor = texture2D(uTexture, vUv);
  gl_FragColor = texColor;
}
`;

const IMAGE_PATHS = [
  './images/env-piltover.jpg',
  './images/env-zaun.jpg',
  './images/env-hextech.jpg',
  './images/env-graffiti.jpg'
];

const INSTANCE_COUNT = 300;


export default function DivergenceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const piltoverLabelRef = useRef<HTMLSpanElement>(null);
  const zaunLabelRef = useRef<HTMLSpanElement>(null);

  // 3D Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);
  const scrollState = useRef({ current: 0, previous: 0, delta: 0 });
  const texturesRef = useRef<THREE.Texture[]>([]);
  const meshRef = useRef<THREE.InstancedMesh | null>(null);

  const sceneSetup = useMemo(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;
    return { scene, camera };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { scene, camera } = sceneSetup;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    const loader = new THREE.TextureLoader();
    const textures: THREE.Texture[] = [];
    IMAGE_PATHS.forEach((path) => {
      loader.load(path, (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        textures.push(tex);
      });
    });
    texturesRef.current = textures;

    const geometry = new THREE.PlaneGeometry(0.8, 0.6, 8, 8);
    const material = new THREE.ShaderMaterial({
      vertexShader: TUNNEL_VERTEX,
      fragmentShader: TUNNEL_FRAGMENT,
      uniforms: {
        uScrollSpeed: { value: 0 },
        uTexture: { value: null },
      },
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15
    });

    const mesh = new THREE.InstancedMesh(geometry, material, INSTANCE_COUNT);
    meshRef.current = mesh;

    const dummy = new THREE.Object3D();
    const colorHelper = new THREE.Color();

    for (let i = 0; i < INSTANCE_COUNT; i++) {
        const t = i / INSTANCE_COUNT;
        dummy.position.set(
            Math.cos(t * Math.PI * 2) * 3.5,
            Math.sin(t * Math.PI * 2) * 3.5,
            -t * 15
        );
        dummy.rotation.set(
            Math.random() * 0.3 - 0.15,
            Math.random() * 0.3 - 0.15,
            t * Math.PI * 2
        );
        dummy.scale.set(1.0, 1.0, 1.0);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);

        const texIndex = (i % IMAGE_PATHS.length) / 255;
        colorHelper.setRGB(texIndex, 0, 0);
        mesh.setColorAt(i, colorHelper);
    }
    
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    scene.add(mesh);

    const handleScroll = () => { scrollState.current.current = window.scrollY; };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      const ss = scrollState.current;
      ss.delta = ss.current - ss.previous;
      ss.previous += (ss.current - ss.previous) * 0.1;

      const scrollOffset = ss.previous;
      mesh.position.z = scrollOffset * 0.005;
      const time = scrollOffset * 0.001;
      mesh.rotation.z = Math.sin(time * 0.5) * 0.1;
      material.uniforms.uScrollSpeed.value = ss.delta * 0.1;

      if (textures.length > 0) {
        const texIdx = Math.floor(Math.abs(time * 0.5)) % textures.length;
        material.uniforms.uTexture.value = textures[texIdx];
      }
      
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      scene.remove(mesh);
    };
  }, [sceneSetup]);



  // Divergence Animations
  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    const line = lineRef.current;
    const pLabel = piltoverLabelRef.current;
    const zLabel = zaunLabelRef.current;
    const canvas = canvasRef.current;
    if (!section || !text || !line || !pLabel || !zLabel) return;

    const triggers: ScrollTrigger[] = [];

    // Background color transition & canvas fade out
    const bgTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
      },
    });
    bgTl.to(section, { backgroundColor: '#0A0A0F', duration: 1 });
    if (bgTl.scrollTrigger) triggers.push(bgTl.scrollTrigger);

    if (canvas) {
       const canvasOutTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'bottom 80%',
            end: 'bottom 20%',
            scrub: true
          }
       });
       canvasOutTl.to(canvas, { opacity: 0, scale: 1.2, duration: 1 });
       if (canvasOutTl.scrollTrigger) triggers.push(canvasOutTl.scrollTrigger);
    }

    // Split line animation
    const lineTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 50%',
        end: 'center center',
        scrub: 1,
      },
    });
    lineTl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'power2.inOut' });
    if (lineTl.scrollTrigger) triggers.push(lineTl.scrollTrigger);

    // Labels
    const labelTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 40%',
        end: 'center center',
        scrub: 1,
      },
    });
    labelTl
      .fromTo(pLabel, { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, 0)
      .fromTo(zLabel, { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, 0);
    if (labelTl.scrollTrigger) triggers.push(labelTl.scrollTrigger);

    // Text morph
    const textTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 30%',
        end: 'bottom 60%',
        scrub: 1,
      },
    });

    const piltoverText = text.querySelector('.piltover-text');
    const zaunText = text.querySelector('.zaun-text');

    if (piltoverText && zaunText) {
      textTl
        .fromTo(piltoverText, { opacity: 1, y: 0, scale: 1 }, { opacity: 0, y: -50, scale: 0.8, duration: 0.5 }, 0)
        .fromTo(zaunText, { opacity: 0, y: 50, scale: 1.2 }, { opacity: 1, y: 0, scale: 1, duration: 0.5 }, 0.3);
    }
    if (textTl.scrollTrigger) triggers.push(textTl.scrollTrigger);

    return () => { triggers.forEach(t => t.kill()); };
  }, []);

  return (
    <section
      id="divergence-section"
      ref={sectionRef}
      className="relative w-full flex flex-col items-center justify-center overflow-hidden"
      style={{
        minHeight: '200vh',
        backgroundColor: '#D4C5A9',
      }}
    >
      {/* 3D Tunnel in Piltover/Zaun section */}
      <div className="sticky top-0 w-full h-screen -z-0 opacity-40">
         <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      </div>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center h-screen sticky top-0 pointer-events-none">
          {/* Split line */}
          <div
            ref={lineRef}
            className="absolute top-1/2 left-0 w-full h-[1px] origin-center"
            style={{
              background: 'linear-gradient(to right, transparent, #C49A3C, #00F0FF, transparent)',
              transform: 'scaleX(0)',
            }}
          />

          {/* Labels */}
          <div className="absolute top-[35%] w-full flex justify-between px-12 md:px-24">
            <span
              ref={piltoverLabelRef}
              className="font-display text-sm md:text-base tracking-[0.3em] uppercase opacity-0"
              style={{ color: '#C49A3C' }}
            >
              Piltover
            </span>
            <span
              ref={zaunLabelRef}
              className="font-display text-sm md:text-base tracking-[0.3em] uppercase opacity-0"
              style={{ color: '#00F0FF' }}
            >
              Zaun
            </span>
          </div>

          {/* Morphing text */}
          <div ref={textRef} className="relative text-center z-10 w-full">
            <h2
              className="piltover-text font-display text-6xl md:text-8xl lg:text-9xl tracking-[0.1em]"
              style={{ color: '#C49A3C', textShadow: '0 0 30px rgba(196, 154, 60, 0.4)' }}
            >
              ARCANE
            </h2>
            <h2
              className="zaun-text font-display text-6xl md:text-8xl lg:text-9xl tracking-[0.1em] absolute top-0 left-1/2 -translate-x-1/2 opacity-0"
              style={{
                color: '#00F0FF',
                textShadow: '0 0 30px rgba(0, 240, 255, 0.6), 0 0 60px rgba(0, 240, 255, 0.2)',
                WebkitTextStroke: '1px rgba(0, 240, 255, 0.3)',
              }}
            >
              ARCANE
            </h2>
          </div>
      </div>
    </section>
  );
}
