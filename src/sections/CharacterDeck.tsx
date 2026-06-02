import { useEffect, useRef, useState } from 'react';
import { ScanLine, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Ability {
  name: string;
  description: string;
}

interface CharacterStats {
  power: number;
  agility: number;
  tactics: number;
}

interface Character {
  name: string;
  role: string;
  image: string;
  fallbackImage: string;
  accent: string;
  secondary: string;
  faction: string;
  quote: string;
  description: string;
  stats: CharacterStats;
  abilities: Ability[];
  affiliations: string[];
}

const CHARACTERS: Character[] = [
    {
      name: 'JINX',
      role: 'The Loose Cannon',
      image: './images/char-jinx.jpg',
      fallbackImage: './images/char-jinx.jpg',
      accent: '#38D7FF',
      secondary: '#E958FF',
      faction: 'Zaun',
      quote: 'Chaos is the only honest signal.',
      description:
        "Once a frightened child named Powder, Jinx became Zaun's volatile spark - brilliant, wounded, and impossible to contain.",
      stats: { power: 85, agility: 90, tactics: 40 },
      abilities: [
        { name: 'Pow-Pow Minigun', description: 'Builds pressure through rapid fire and unsteady tempo.' },
        { name: 'Fishbones Rocket', description: 'Turns distance into a blast radius.' },
        { name: 'Death Rocket', description: 'A long-range final note for any chase.' },
      ],
      affiliations: ['Zaun Undercity', "Silco's Syndicate", 'Independent'],
    },
    {
      name: 'VI',
      role: 'The Piltover Enforcer',
      image: './images/char-vi.jpg',
      fallbackImage: './images/char-vi.jpg',
      accent: '#FF3F74',
      secondary: '#F2B24D',
      faction: 'Piltover and Zaun',
    quote: 'Hit first. Ask better questions later.',
    description:
      'Vi carries the weight of the undercity in her fists, turning grief into forward motion with every Hextech punch.',
    stats: { power: 95, agility: 75, tactics: 55 },
    abilities: [
      { name: 'Blast Shield', description: 'A defensive surge earned by staying in the fight.' },
      { name: 'Vault Breaker', description: 'A charged entry that turns space into impact.' },
      { name: 'Assault and Battery', description: 'Locks onto a target and refuses to let go.' },
    ],
    affiliations: ['Piltover Wardens', 'Kiramman Household', 'Zaun Orphans'],
  },
    {
      name: 'CAITLYN',
      role: 'The Sheriff of Piltover',
      image: './images/char-caitlyn.jpg',
      fallbackImage: './images/char-caitlyn.jpg',
      accent: '#B994FF',
      secondary: '#DDBE62',
      faction: 'Piltover',
      quote: 'Precision is mercy when the city is on fire.',
    description:
      "Caitlyn's calm eye and stubborn conscience make her a rare force in Piltover: authority with a pulse.",
    stats: { power: 70, agility: 80, tactics: 95 },
    abilities: [
      { name: 'Headshot', description: 'Rewards patience with decisive precision.' },
      { name: 'Snap Trap', description: 'Controls the field before the fight begins.' },
      { name: 'Ace in the Hole', description: 'A clean line from intent to consequence.' },
    ],
    affiliations: ['Piltover Wardens', 'Kiramman Clan', 'Piltover Council'],
  },
    {
      name: 'JAYCE',
      role: 'The Defender of Tomorrow',
      image: './images/char-jayce.jpg',
      fallbackImage: './images/char-jayce.jpg',
      accent: '#F1C95F',
      secondary: '#50C7FF',
      faction: 'Piltover',
      quote: 'Progress always asks who pays the cost.',
    description:
      'Jayce turns invention into policy, then learns that every breakthrough casts a shadow across both cities.',
    stats: { power: 90, agility: 70, tactics: 85 },
    abilities: [
      { name: 'Mercury Hammer', description: 'Brings Hextech force into close range.' },
      { name: 'Mercury Cannon', description: 'Reframes invention as long-range pressure.' },
      { name: 'Acceleration Gate', description: 'Amplifies motion, ambition, and risk.' },
    ],
    affiliations: ['Piltover Council', 'Talis Forge', 'Hextech Academy'],
  },
    {
      name: 'EKKO',
      role: 'The Boy Who Shattered Time',
      image: './images/char-ekko.jpg',
      fallbackImage: './images/char-ekko.jpg',
      accent: '#24F0A5',
      secondary: '#FFE96B',
      faction: 'Zaun',
      quote: 'A second chance is still a choice.',
    description:
      'Ekko protects the future by refusing to surrender the past, bending time around the people Zaun keeps losing.',
    stats: { power: 75, agility: 95, tactics: 90 },
    abilities: [
      { name: 'Timewinder', description: 'A returning arc that punishes bad timing.' },
      { name: 'Parallel Convergence', description: 'Creates a moment where escape becomes strategy.' },
      { name: 'Chronobreak', description: 'Rewinds the mistake and keeps the lesson.' },
    ],
    affiliations: ['The Firelights', 'Zaun Undercity', 'Lost Children'],
  },
];

const STAT_LABELS: Record<keyof CharacterStats, string> = {
  power: 'Power',
  agility: 'Agility',
  tactics: 'Tactics',
};

function StatBar({ label, value, accent }: { label: string; value: number; accent: string }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        barRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: 'power3.out' }
      );
    }, barRef);

    return () => ctx.revert();
  }, [value]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between font-body text-[11px] uppercase tracking-[0.16em] text-white/55">
        <span>{label}</span>
        <span style={{ color: accent }}>{value}</span>
      </div>
      <div className="h-1 overflow-hidden rounded bg-white/10">
        <div
          ref={barRef}
          className="h-full origin-left rounded will-change-transform"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${accent}, rgba(255,255,255,0.9))`,
            boxShadow: `0 0 18px ${accent}66`,
          }}
        />
      </div>
    </div>
  );
}

export default function CharacterDeck() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const activeChar = CHARACTERS[activeIndex];



  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      gsap.set('.deck-kicker, .deck-title, .deck-copy, .featured-panel, .character-card', {
        autoAlpha: 0,
        y: 28,
      });

      gsap
        .timeline({
          defaults: { ease: 'power3.out', duration: reduceMotion ? 0 : 0.9 },
          scrollTrigger: {
            trigger: section,
            start: 'top 72%',
            toggleActions: 'play none none reverse',
          },
        })
        .to('.deck-kicker', { autoAlpha: 1, y: 0 })
        .to('.deck-title', { autoAlpha: 1, y: 0 }, '<0.1')
        .to('.deck-copy', { autoAlpha: 1, y: 0 }, '<0.12')
        .to('.featured-panel', { autoAlpha: 1, y: 0 }, '<0.1')
        .to('.character-card', { autoAlpha: 1, y: 0, stagger: 0.08 }, '<0.15');

      if (!reduceMotion) {
        gsap.to('.featured-portrait', {
          yPercent: -8,
          scale: 1.05,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });

        ScrollTrigger.batch('.ability-row', {
          start: 'top 85%',
          once: true,
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              { autoAlpha: 0, y: 18 },
              { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out' }
            );
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.featured-swap',
        { autoAlpha: 0, y: 22, scale: 0.985 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out', stagger: 0.04 }
      );
    }, featuredRef);

    return () => ctx.revert();
  }, [activeIndex]);

  useEffect(() => {
    if (!detailOpen || !detailRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        detailRef.current,
        { autoAlpha: 0, y: 22, scale: 0.985 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.detail-fade',
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
    }, detailRef);

    return () => ctx.revert();
  }, [detailOpen, activeIndex]);

  useEffect(() => {
    const wrap = imageWrapRef.current;
    if (!wrap) return;

    const image = wrap.querySelector<HTMLElement>('.featured-portrait');
    if (!image) return;

    const xTo = gsap.quickTo(image, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(image, 'y', { duration: 0.5, ease: 'power3.out' });

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = wrap.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      xTo(x * 18);
      yTo(y * 12);
    };

    const handlePointerLeave = () => {
      xTo(0);
      yTo(0);
    };

    wrap.addEventListener('pointermove', handlePointerMove);
    wrap.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      wrap.removeEventListener('pointermove', handlePointerMove);
      wrap.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [activeIndex]);

  const selectCharacter = (index: number) => {
    setActiveIndex(index);
    setDetailOpen(false);
  };

  return (
    <section
      id="characters-section"
      ref={sectionRef}
      className="relative w-full overflow-hidden px-4 py-24 sm:px-6 lg:px-10"
      style={{
        background:
          'linear-gradient(180deg, #090A10 0%, #101018 45%, #081315 100%)',
        minHeight: '100vh',
      }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#38D7FF]/40 to-transparent" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.08]">
        <div className="h-full w-full bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-10 grid gap-5 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <span
              className="deck-kicker mb-4 block font-body text-xs uppercase tracking-[0.34em]"
              style={{ color: activeChar.accent }}
            >
              Real promotional dossiers
            </span>
            <h2 className="deck-title font-display text-4xl tracking-[0.08em] text-[#F4F0E8] sm:text-6xl lg:text-7xl">
              Champion Archive
            </h2>
          </div>
          <p className="deck-copy max-w-xl font-body text-sm leading-7 text-white/62 md:ml-auto">
            A rebuilt roster surface using Arcane promotional character posters, scroll-timed reveals,
            responsive motion, and a focused dossier workflow.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
          <div
            ref={featuredRef}
            className="featured-panel relative overflow-hidden rounded-lg border border-white/10 bg-black/30"
            style={{
              boxShadow: `0 24px 80px ${activeChar.accent}14, inset 0 1px 0 rgba(255,255,255,0.08)`,
            }}
          >
            <div
              ref={imageWrapRef}
              className="relative min-h-[620px] overflow-hidden sm:min-h-[700px] lg:min-h-[760px]"
              style={{
                background: `linear-gradient(135deg, ${activeChar.accent}22, ${activeChar.secondary}10 38%, rgba(0,0,0,0.3))`,
              }}
            >
              <img
                key={activeChar.name}
                src={activeChar.image}
                alt={`${activeChar.name} Arcane Season 1 poster`}
                className="featured-portrait absolute inset-0 h-full w-full select-none object-cover object-center will-change-transform"
                draggable={false}
                onError={(event) => {
                  event.currentTarget.src = activeChar.fallbackImage;
                }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,9,14,0.94)_0%,rgba(8,9,14,0.58)_34%,rgba(8,9,14,0.12)_62%,rgba(8,9,14,0.82)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#090A10] via-[#090A10]/72 to-transparent" />

              <div className="featured-swap absolute left-5 top-5 flex items-center gap-2 rounded border border-white/10 bg-black/35 px-3 py-2 font-body text-[10px] uppercase tracking-[0.22em] text-white/64 backdrop-blur">
                <ScanLine size={14} style={{ color: activeChar.accent }} />
                {activeChar.faction}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 lg:p-10">
                <div className="featured-swap mb-4 font-body text-xs uppercase tracking-[0.28em]" style={{ color: activeChar.accent }}>
                  {activeChar.role}
                </div>
                <h3 className="featured-swap font-display text-5xl tracking-[0.12em] text-white sm:text-7xl">
                  {activeChar.name}
                </h3>
                <p className="featured-swap mt-5 max-w-xl font-body text-lg leading-8 text-white/76">
                  {activeChar.quote}
                </p>
                <div className="featured-swap mt-7 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setDetailOpen(true)}
                    className="inline-flex items-center gap-2 rounded border px-4 py-3 font-body text-[11px] uppercase tracking-[0.18em] transition hover:bg-white/10"
                    style={{ color: activeChar.accent, borderColor: `${activeChar.accent}66` }}
                   >
                     <ScanLine size={15} />
                     Open Dossier
                   </button>
                </div>
              </div>
            </div>
          </div>

          <aside className="relative rounded-lg border border-white/10 bg-white/[0.035] p-4 backdrop-blur">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
              <span className="font-body text-[10px] uppercase tracking-[0.28em] text-white/48">
                Select signal
              </span>
              <span className="font-body text-[10px] uppercase tracking-[0.2em]" style={{ color: activeChar.accent }}>
                {String(activeIndex + 1).padStart(2, '0')} / {CHARACTERS.length}
              </span>
            </div>

            <div ref={railRef} className="grid gap-3">
              {CHARACTERS.map((character, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    type="button"
                    key={character.name}
                    onClick={() => selectCharacter(index)}
                    className="character-card group grid min-h-[112px] grid-cols-[78px_1fr] gap-4 rounded-lg border p-2 text-left transition will-change-transform hover:-translate-y-0.5"
                    style={{
                      borderColor: isActive ? `${character.accent}88` : 'rgba(255,255,255,0.09)',
                      backgroundColor: isActive ? `${character.accent}12` : 'rgba(0,0,0,0.18)',
                      boxShadow: isActive ? `0 16px 40px ${character.accent}18` : 'none',
                    }}
                  >
                    <span className="relative h-full overflow-hidden rounded bg-black/40">
                      <img
                        src={character.image}
                        alt=""
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(event) => {
                          event.currentTarget.src = character.fallbackImage;
                        }}
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </span>
                    <span className="flex min-w-0 flex-col justify-center">
                      <span className="font-display text-2xl tracking-[0.08em] text-white">{character.name}</span>
                      <span className="mt-1 truncate font-body text-[11px] uppercase tracking-[0.16em]" style={{ color: character.accent }}>
                        {character.role}
                      </span>
                      <span className="mt-3 h-px w-full origin-left bg-gradient-to-r from-white/25 to-transparent" />
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.85fr)]">
          <div className="rounded-lg border border-white/10 bg-black/24 p-5 sm:p-6">
            <div className="grid gap-5 md:grid-cols-3">
              {(Object.keys(activeChar.stats) as (keyof CharacterStats)[]).map((key) => (
                <StatBar
                  key={`${activeChar.name}-${key}`}
                  label={STAT_LABELS[key]}
                  value={activeChar.stats[key]}
                  accent={activeChar.accent}
                />
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/24 p-5 sm:p-6">
            <div className="mb-4 font-body text-[10px] uppercase tracking-[0.24em] text-white/44">
              Active affiliations
            </div>
            <div className="flex flex-wrap gap-2">
              {activeChar.affiliations.map((affiliation) => (
                <span
                  key={affiliation}
                  className="rounded border px-3 py-2 font-body text-[10px] uppercase tracking-[0.14em] text-white/64"
                  style={{ borderColor: `${activeChar.accent}30`, backgroundColor: `${activeChar.accent}08` }}
                >
                  {affiliation}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {activeChar.abilities.map((ability, index) => (
            <div
              key={`${activeChar.name}-${ability.name}`}
              className="ability-row rounded-lg border border-white/10 bg-white/[0.035] p-5 opacity-0"
            >
              <div className="mb-4 flex items-center gap-3">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded border font-display text-xs"
                  style={{ borderColor: `${activeChar.accent}66`, color: activeChar.accent }}
                >
                  {index + 1}
                </span>
                <h4 className="font-display text-sm uppercase tracking-[0.18em] text-white">
                  {ability.name}
                </h4>
              </div>
              <p className="font-body text-sm leading-6 text-white/56">{ability.description}</p>
            </div>
          ))}
        </div>


      </div>

      {detailOpen ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/82 p-4 backdrop-blur-md"
          onClick={() => setDetailOpen(false)}
        >
          <div
            ref={detailRef}
            className="relative grid max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-lg border border-white/10 bg-[#0B0C12] opacity-0 shadow-2xl lg:grid-cols-[0.86fr_1fr]"
            style={{ boxShadow: `0 28px 90px ${activeChar.accent}20` }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setDetailOpen(false)}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded border border-white/10 bg-black/35 text-white/60 transition hover:border-white/25 hover:text-white"
              aria-label="Close dossier"
            >
              <X size={18} />
            </button>

            <div className="relative min-h-[340px] overflow-hidden lg:min-h-[620px]">
              <img
                src={activeChar.image}
                alt={`${activeChar.name} poster detail`}
                className="absolute inset-0 h-full w-full object-cover object-center"
                onError={(event) => {
                  event.currentTarget.src = activeChar.fallbackImage;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C12] via-transparent to-black/20 lg:bg-gradient-to-r lg:from-transparent lg:to-[#0B0C12]" />
            </div>

            <div className="overflow-y-auto p-6 sm:p-8 lg:p-10">
              <div className="detail-fade mb-5 font-body text-[10px] uppercase tracking-[0.28em]" style={{ color: activeChar.accent }}>
                {activeChar.faction}
              </div>
              <h3 className="detail-fade font-display text-4xl tracking-[0.1em] text-white sm:text-5xl">
                {activeChar.name}
              </h3>
              <p className="detail-fade mt-5 font-body text-base leading-8 text-white/68">
                {activeChar.description}
              </p>

              <div className="detail-fade mt-8 grid gap-4">
                {(Object.keys(activeChar.stats) as (keyof CharacterStats)[]).map((key) => (
                  <StatBar
                    key={`detail-${activeChar.name}-${key}`}
                    label={STAT_LABELS[key]}
                    value={activeChar.stats[key]}
                    accent={activeChar.accent}
                  />
                ))}
              </div>

              <div className="detail-fade mt-8 space-y-3">
                <h4 className="font-display text-sm uppercase tracking-[0.22em] text-white/74">
                  Tactical Notes
                </h4>
                {activeChar.abilities.map((ability, index) => (
                  <div key={ability.name} className="rounded border border-white/10 bg-white/[0.035] p-4">
                    <div className="font-body text-[10px] uppercase tracking-[0.2em]" style={{ color: activeChar.accent }}>
                      {String(index + 1).padStart(2, '0')} / {ability.name}
                    </div>
                    <p className="mt-2 font-body text-sm leading-6 text-white/58">{ability.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
