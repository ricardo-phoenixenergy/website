'use client';

import { useEffect, useMemo, useRef } from 'react';
import { animate, motion, useInView } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const STORY_STATS = [
  { value: '10 MWp + 8 MWh', label: 'Installed & under development' },
  { value: '6',              label: 'Ecosystem partners' },
  { value: '40',             label: 'Projects completed' },
  { value: '10',             label: 'Projects under development' },
] as const;

/* Counts a single integer from 0 → value once it scrolls into view. */
function CountUpNumber({
  value, inView, delay = 0, duration = 1.2,
}: { value: number; inView: boolean; delay?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduced) { node.textContent = String(value); return; }
    if (!inView) { node.textContent = '0'; return; }
    const controls = animate(0, value, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => { node.textContent = String(Math.round(latest)); },
    });
    return () => controls.stop();
  }, [inView, reduced, value, delay, duration]);

  return <span ref={ref}>0</span>;
}

/* Splits a stat string into text + numeric tokens and animates each number. */
function AnimatedValue({
  value, inView, delay,
}: { value: string; inView: boolean; delay: number }) {
  const parts = useMemo(() => value.split(/(\d+)/).filter((p) => p !== ''), [value]);
  let numIndex = 0;
  return (
    <>
      {parts.map((part, i) => {
        if (/^\d+$/.test(part)) {
          const d = delay + numIndex * 0.18;
          numIndex += 1;
          return <CountUpNumber key={i} value={parseInt(part, 10)} inView={inView} delay={d} />;
        }
        return <span key={i} style={{ color: '#709DA9' }}>{part}</span>;
      })}
    </>
  );
}

/* Location blobs — one per solution accent colour. Positions are % of the
   square map container; tuned to SA geography. */
const MARKERS = [
  { x: 67, y: 41, color: '#709DA9', region: 'Gauteng' },        // Dusty Blue
  { x: 72, y: 36, color: '#E3C58D', region: 'Gauteng' },        // Soft Amber
  { x: 64, y: 39, color: '#9CAF88', region: 'Gauteng' },        // Sage Green
  { x: 80, y: 66, color: '#D97C76', region: 'KwaZulu-Natal' },  // Fresh Coral (Durban)
  { x: 56, y: 85, color: '#A9D6CB', region: 'Gqeberha (PE)' },  // Light Aqua
  { x: 13, y: 84, color: '#C97A40', region: 'Western Cape' },   // Warm Copper (Cape Town)
] as const;

/* Simplified South Africa silhouette (potrace via mapsicon, public domain) */
const ZA_PATH =
  'M8143 9561 l-182 -26 -29 -40 c-37 -52 -98 -106 -156 -140 -37 -22 -71 -30 -162 -42 -153 -18 -189 -34 -251 -108 -27 -33 -57 -66 -66 -74 -10 -7 -17 -20 -17 -28 0 -8 -11 -31 -25 -51 -14 -20 -25 -47 -25 -59 0 -17 -9 -25 -42 -35 -28 -8 -47 -22 -59 -43 -14 -22 -34 -36 -82 -53 -62 -22 -65 -24 -73 -65 l-9 -42 -74 -3 c-71 -3 -76 -5 -125 -46 -28 -24 -69 -55 -91 -68 -55 -34 -96 -119 -135 -277 -17 -68 -43 -152 -57 -187 -23 -58 -28 -65 -63 -74 -41 -11 -79 -48 -137 -136 -44 -67 -114 -114 -169 -114 -33 0 -184 -40 -246 -65 -21 -8 -23 -26 -7 -42 9 -9 8 -18 -3 -35 -9 -13 -18 -61 -23 -113 -5 -73 -11 -95 -29 -115 -14 -15 -27 -49 -34 -87 -11 -63 -44 -122 -111 -198 -43 -49 -137 -85 -223 -85 -33 0 -116 -10 -184 -22 l-123 -21 -107 27 c-105 28 -174 58 -174 77 0 6 -16 17 -36 25 -27 11 -55 13 -118 8 l-83 -7 -27 36 c-17 22 -81 67 -173 122 l-146 88 -96 -7 c-93 -7 -97 -8 -149 -49 -46 -37 -59 -55 -98 -142 -41 -92 -44 -106 -44 -183 l0 -84 -90 -113 c-74 -93 -102 -120 -160 -154 -75 -45 -111 -88 -154 -185 l-25 -56 -52 0 c-36 0 -65 -8 -99 -26 -46 -25 -48 -28 -55 -79 l-6 -53 -218 -1 c-165 -1 -231 3 -267 14 -47 14 -50 14 -87 -11 l-39 -26 -24 23 c-21 20 -23 28 -18 74 5 41 2 60 -15 93 -24 48 -23 52 46 139 19 23 43 70 54 105 19 56 20 70 9 140 -7 50 -29 120 -61 197 -27 66 -49 134 -49 151 0 40 -13 66 -60 115 -21 22 -50 69 -64 105 -60 147 -109 197 -212 216 -27 5 -55 22 -91 55 -28 27 -54 49 -56 49 -2 0 -3 -30 -1 -67 42 -735 57 -1090 69 -1647 8 -367 15 -712 15 -765 l0 -97 -70 -37 c-39 -20 -80 -37 -90 -37 -11 0 -40 -10 -64 -22 -38 -18 -46 -27 -51 -59 -9 -50 -24 -61 -104 -74 l-66 -11 0 -69 0 -68 -40 -14 c-38 -13 -43 -12 -95 14 -80 39 -202 47 -285 17 -33 -11 -97 -24 -143 -27 -82 -6 -85 -6 -175 35 -97 43 -118 47 -179 35 -34 -7 -38 -6 -38 12 0 29 -66 48 -124 34 l-44 -10 -6 40 c-4 21 -13 52 -22 69 -12 24 -13 36 -3 65 13 40 8 80 -16 137 l-16 38 -29 -27 c-25 -24 -32 -26 -45 -15 -8 7 -15 28 -15 47 0 19 -4 42 -10 52 -13 25 -70 34 -121 21 -41 -11 -56 -24 -113 -95 -27 -34 -28 -36 -11 -61 15 -24 15 -28 -1 -71 -21 -55 -88 -128 -130 -143 -16 -6 -38 -24 -48 -41 l-18 -30 34 -37 c18 -20 44 -54 56 -74 13 -20 38 -46 56 -58 22 -13 36 -31 40 -51 3 -17 20 -47 36 -66 39 -44 116 -198 125 -249 4 -21 27 -70 50 -109 32 -53 45 -85 50 -130 8 -60 43 -162 92 -265 14 -30 32 -77 39 -103 7 -27 30 -72 51 -100 56 -74 97 -152 122 -229 17 -52 45 -98 123 -200 55 -73 115 -149 133 -168 18 -19 54 -72 79 -118 26 -46 60 -95 77 -110 38 -35 95 -176 120 -296 12 -60 19 -133 19 -213 0 -146 -13 -189 -71 -232 -35 -25 -44 -28 -77 -20 -95 23 -91 24 -103 -7 -6 -16 -8 -47 -4 -69 3 -22 8 -64 11 -93 3 -29 9 -52 12 -50 50 26 63 30 76 25 18 -7 66 -80 66 -101 0 -24 -43 -4 -58 27 -8 17 -21 27 -34 27 l-21 0 20 -22 c12 -13 34 -44 50 -69 36 -60 111 -152 132 -163 27 -14 41 -38 41 -71 0 -21 9 -39 26 -56 35 -32 64 -95 64 -140 0 -32 -4 -37 -32 -45 -26 -8 -34 -17 -41 -47 -7 -30 -6 -42 7 -56 15 -16 15 -19 1 -31 -8 -7 -15 -20 -15 -29 0 -22 50 -99 84 -130 l26 -24 0 64 c0 92 15 139 44 139 13 0 43 3 67 6 44 6 44 5 67 -38 16 -32 22 -60 22 -111 l0 -68 30 16 c41 21 96 19 120 -5 12 -12 33 -20 55 -20 29 0 115 -42 115 -56 0 -2 -9 -18 -20 -36 -30 -50 -27 -59 23 -52 38 6 47 3 86 -30 64 -53 79 -60 156 -67 39 -4 91 -10 117 -14 43 -7 48 -6 48 12 0 27 39 61 75 65 21 2 34 11 43 31 7 15 30 36 51 47 25 12 41 29 45 45 5 19 20 32 53 47 46 20 86 21 182 2 32 -7 33 -6 21 15 -29 54 17 64 169 34 82 -15 89 -15 124 2 28 13 66 18 152 19 130 2 167 17 173 72 2 19 22 48 59 85 l55 56 91 12 c51 7 113 22 139 33 52 23 99 20 195 -13 42 -14 83 -19 168 -19 101 0 114 2 131 21 25 28 87 59 117 59 34 0 314 -57 366 -75 25 -8 62 -15 84 -15 24 0 51 -8 70 -22 21 -15 56 -26 97 -31 36 -4 84 -10 108 -13 40 -6 42 -5 42 19 0 13 7 30 15 37 8 7 20 29 26 50 7 21 21 42 33 48 25 11 107 1 185 -22 30 -9 66 -16 81 -16 14 0 35 -7 47 -15 20 -14 26 -14 63 1 l40 16 -21 35 c-31 50 -18 96 38 139 59 45 117 50 266 25 160 -28 179 -27 251 13 34 19 87 41 119 49 35 9 87 35 132 66 41 28 94 60 117 72 24 12 66 41 93 64 28 23 74 55 103 70 29 16 71 44 94 64 23 20 76 59 117 86 47 31 91 70 115 102 28 38 55 61 95 80 135 66 295 201 413 349 32 40 68 80 80 90 13 11 34 35 48 54 47 68 244 271 269 277 14 3 52 31 85 62 34 31 83 67 110 80 37 18 69 49 135 129 47 58 110 132 139 165 29 33 66 88 82 123 17 35 77 125 134 201 57 76 120 170 139 209 20 40 47 80 59 90 35 28 66 77 94 145 14 34 43 87 64 118 21 31 58 88 82 126 45 74 291 336 340 361 15 8 43 14 63 14 55 0 80 18 211 152 107 109 123 130 144 188 13 36 41 95 62 131 30 51 46 99 73 215 19 82 35 161 35 177 0 15 20 67 45 116 64 128 125 319 125 391 l0 57 -172 7 c-95 4 -203 12 -241 17 -131 20 -157 -7 -157 -161 l0 -87 -43 -17 c-58 -22 -223 -14 -324 16 -67 20 -79 28 -147 98 -71 73 -74 78 -81 135 -9 83 -9 83 -52 87 l-38 3 -1 90 c-1 50 -6 114 -11 143 l-10 53 74 66 c42 38 81 82 89 102 8 20 23 45 33 56 10 11 21 37 24 59 3 21 7 39 9 41 2 1 29 22 60 48 40 32 73 49 110 57 51 12 57 11 106 -14 28 -14 62 -40 74 -57 28 -38 70 -64 142 -89 l56 -19 0 99 c0 98 0 99 30 120 36 26 37 31 5 78 -16 24 -21 40 -15 46 6 6 10 24 10 42 0 18 9 61 20 96 18 54 22 105 30 372 l9 309 -35 68 c-34 65 -35 69 -25 125 16 83 15 86 -33 121 -50 37 -76 96 -76 173 0 47 -30 103 -73 139 -22 18 -22 97 -1 151 16 39 15 43 -5 96 -11 31 -21 74 -21 96 0 37 -49 228 -84 327 -9 24 -16 62 -16 85 0 98 -74 119 -435 121 -217 1 -232 2 -273 23 -148 78 -332 143 -397 141 -16 -1 -112 -13 -212 -28z';

function SouthAfricaMap({ fill }: { fill: string }) {
  return (
    <svg
      viewBox="0 0 1024 1024"
      className="w-full h-full"
      role="img"
      aria-label="Phoenix Energy footprint across South Africa"
    >
      <g transform="translate(0,1024) scale(0.1,-0.1)" fill={fill} stroke="none">
        <path d={ZA_PATH} />
      </g>
    </svg>
  );
}

export function AboutStory() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduced = useReducedMotion();

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="page-container">

        {/* ── Intro ─────────────────────────────────────────────────────── */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-3">
            Who we are
          </p>
          <h2 className="font-display font-extrabold text-3xl text-[#1A1A1A] leading-[1.2] mb-4">
            Phoenix at a <em style={{ color: '#709DA9', fontStyle: 'normal' }}>glance</em>
          </h2>
          <p className="font-body text-sm leading-[1.8] text-[#6B7280]">
            Phoenix Energy is a South African commercial and industrial energy company.{' '}
            <strong className="font-semibold text-[#1A1A1A]">Not a solar installer. Not an equipment supplier.</strong>{' '}
            <strong className="font-semibold text-[#1A1A1A]">A sophisticated energy partner</strong>{' '}
            that designs, finances, acquires and optimises integrated energy ecosystems
            for businesses that are serious about their energy future.
          </p>
        </div>

        {/* ── Stats + map ───────────────────────────────────────────────── */}
        <div ref={ref} className="grid gap-y-12 gap-x-8 md:grid-cols-[auto_minmax(0,400px)] md:items-center md:justify-center">

          {/* Stats column */}
          <div className="flex flex-col gap-7">
            {STORY_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={reduced ? { duration: 0 } : { duration: 0.5, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="border-l-2 pl-5"
                style={{ borderColor: 'rgba(57,87,92,0.18)' }}
              >
                <div className="font-display font-extrabold leading-none text-[#39575C] text-3xl md:text-[2.4rem]">
                  <AnimatedValue value={stat.value} inView={inView} delay={0.2 + i * 0.12} />
                </div>
                <div className="font-body uppercase tracking-[0.1em] text-[#6B7280] mt-2 text-[0.72rem]">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Map column */}
          <div className="relative w-full max-w-[400px] mx-auto aspect-square">
            <motion.div
              initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={reduced ? { duration: 0 } : { duration: 0.7, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              <SouthAfricaMap fill="rgba(57,87,92,0.16)" />
            </motion.div>

            {MARKERS.map((m, i) => (
              <motion.div
                key={`${m.x}-${m.y}`}
                initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 18, delay: 0.6 + i * 0.12 }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${m.x}%`, top: `${m.y}%` }}
                title={m.region}
              >
                <span
                  aria-hidden
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-ping"
                  style={{ width: 22, height: 22, background: m.color, opacity: 0.3 }}
                />
                <span
                  className="relative block rounded-full"
                  style={{ width: 18, height: 18, background: m.color, boxShadow: `0 3px 8px ${m.color}80` }}
                />
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
