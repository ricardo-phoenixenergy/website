'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/* ─── Timing ──────────────────────────────────────────────────────────────── */
const INTERVAL = 0.8;   // seconds between consecutive node activations
const HOLD     = 2.0;   // seconds the completed constellation holds before reset
const N        = 6;     // one node per solution vertical
const TOTAL    = N * INTERVAL + HOLD;  // full cycle length (6.8s)

const norm          = (t: number) => t / TOTAL;
const T_LAST_NODE   = norm((N - 1) * INTERVAL);
const T_FADE_START  = norm((N - 1) * INTERVAL + HOLD * 0.4);
const T_FADE_END    = norm((N - 1) * INTERVAL + HOLD * 0.9);

/* ─── Constellation nodes — one per vertical, in vertical order ─────────── */
const NODES = [
  { x: 15, y: 75, color: '#E3C58D' },  // C&I Solar & Storage — amber
  { x: 30, y: 38, color: '#D97C76' },  // Wheeling — coral
  { x: 48, y: 62, color: '#709DA9' },  // Energy Optimisation — dusty blue
  { x: 65, y: 28, color: '#9CAF88' },  // Carbon Credits — sage
  { x: 80, y: 55, color: '#C97A40' },  // WeBuySolar — copper
  { x: 91, y: 80, color: '#A9D6CB' },  // EV Fleets — aqua
];

const EDGES = Array.from({ length: N - 1 }, (_, i) => ({ from: i, to: i + 1 }));

/* ─── Background floating particles ─────────────────────────────────────── */
const C = { solar: '#E3C58D', wheel: '#D97C76', opt: '#709DA9', carbon: '#9CAF88', wbs: '#C97A40', ev: '#A9D6CB' };

const PARTICLES = [
  // Large blurry — lava lamp slow, atmospheric
  { id:  0, x:  8, y: 85, size: 44, color: C.solar,  dur: 50, delay: -18, dY: 180, dX:  25, blur: 14, op: 0.28 },
  { id:  1, x: 72, y: 70, size: 38, color: C.opt,    dur: 60, delay: -43, dY: 160, dX: -20, blur: 10, op: 0.25 },
  { id:  2, x: 40, y: 90, size: 52, color: C.ev,     dur: 70, delay: -45, dY: 200, dX:  15, blur: 18, op: 0.20 },
  { id:  3, x: 85, y: 60, size: 32, color: C.wheel,  dur: 45, delay: -20, dY: 140, dX: -30, blur:  8, op: 0.28 },
  { id:  4, x: 25, y: 50, size: 28, color: C.carbon, dur: 48, delay: -33, dY: 150, dX:  20, blur:  6, op: 0.25 },
  // Medium
  { id:  5, x: 55, y: 75, size: 18, color: C.wbs,    dur: 36, delay: -21, dY: 120, dX: -15, blur:  2, op: 0.52 },
  { id:  6, x: 20, y: 65, size: 14, color: C.opt,    dur: 40, delay: -30, dY: 130, dX:  18, blur:  0, op: 0.62 },
  { id:  7, x: 65, y: 80, size: 16, color: C.solar,  dur: 32, delay: -20, dY: 110, dX: -10, blur:  3, op: 0.48 },
  { id:  8, x: 90, y: 40, size: 20, color: C.ev,     dur: 42, delay: -27, dY: 135, dX:  12, blur:  2, op: 0.55 },
  { id:  9, x: 35, y: 95, size: 15, color: C.wheel,  dur: 35, delay: -20, dY: 115, dX: -20, blur:  0, op: 0.52 },
  { id: 10, x: 78, y: 55, size: 12, color: C.carbon, dur: 45, delay: -27, dY: 140, dX:  22, blur:  1, op: 0.58 },
  { id: 11, x: 12, y: 30, size: 18, color: C.wbs,    dur: 38, delay: -15, dY: 120, dX:  -8, blur:  2, op: 0.45 },
  { id: 12, x: 50, y: 45, size: 14, color: C.solar,  dur: 32, delay: -20, dY: 110, dX:  16, blur:  0, op: 0.60 },
  { id: 13, x: 92, y: 85, size: 16, color: C.opt,    dur: 35, delay: -20, dY: 125, dX: -18, blur:  2, op: 0.50 },
  { id: 14, x: 30, y: 20, size: 20, color: C.ev,     dur: 50, delay: -20, dY: 145, dX:  10, blur:  3, op: 0.40 },
  // Micro dots — faster relative to large but still slow overall
  { id: 15, x:  5, y: 60, size:  5, color: C.solar,  dur: 28, delay: -13, dY:  90, dX:  12, blur:  0, op: 0.78 },
  { id: 16, x: 28, y: 88, size:  4, color: C.opt,    dur: 22, delay: -17, dY:  80, dX:  -8, blur:  0, op: 0.72 },
  { id: 17, x: 48, y: 72, size:  6, color: C.ev,     dur: 30, delay: -17, dY:  95, dX:  10, blur:  0, op: 0.80 },
  { id: 18, x: 70, y: 50, size:  4, color: C.wheel,  dur: 22, delay:  -7, dY:  85, dX: -12, blur:  0, op: 0.68 },
  { id: 19, x: 82, y: 78, size:  5, color: C.carbon, dur: 28, delay: -23, dY:  90, dX:   8, blur:  0, op: 0.75 },
  { id: 20, x: 42, y: 40, size:  4, color: C.wbs,    dur: 22, delay:  -5, dY:  80, dX: -10, blur:  0, op: 0.70 },
  { id: 21, x: 60, y: 92, size:  6, color: C.solar,  dur: 30, delay: -23, dY: 100, dX:  15, blur:  0, op: 0.78 },
  { id: 22, x: 15, y: 45, size:  5, color: C.opt,    dur: 25, delay: -10, dY:  88, dX:  -6, blur:  0, op: 0.65 },
  { id: 23, x: 88, y: 30, size:  4, color: C.ev,     dur: 22, delay: -12, dY:  82, dX:   9, blur:  0, op: 0.70 },
  { id: 24, x: 33, y: 55, size:  6, color: C.wheel,  dur: 28, delay: -10, dY:  92, dX: -14, blur:  0, op: 0.75 },
  { id: 25, x: 75, y: 65, size:  5, color: C.carbon, dur: 30, delay: -20, dY:  95, dX:  11, blur:  0, op: 0.65 },
  { id: 26, x: 55, y: 25, size:  4, color: C.wbs,    dur: 22, delay:  -7, dY:  78, dX:  -7, blur:  0, op: 0.70 },
  { id: 27, x: 95, y: 70, size:  6, color: C.solar,  dur: 25, delay: -20, dY:  90, dX:   8, blur:  0, op: 0.75 },
];

/* ─── Component ─────────────────────────────────────────────────────────── */

interface FloatingOrbsProps {
  className?: string;
  /** Show the animated constellation (connecting lines + pulsing nodes). */
  showConstellation?: boolean;
}

export function FloatingOrbs({ className, showConstellation = true }: FloatingOrbsProps) {
  const reduced   = useReducedMotion();
  const wrapRef   = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  // Measure the container so we can use real pixel coordinates in the SVG
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setDims({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Convert percentage positions → pixel coordinates
  const px = (node: typeof NODES[number]) => ({
    x: (node.x / 100) * dims.w,
    y: (node.y / 100) * dims.h,
  });

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={className}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
    >

      {/* ── Layer 1: floating background particles ──
           Each blob starts below the container and rises continuously.
           Because both start and end positions are outside the clipping
           boundary, the repeatType:'loop' jump is invisible — seamless. */}
      {dims.h > 0 && PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            /* Start below the container: between 1× and 2× container height below top */
            top: dims.h + (p.y / 100) * dims.h,
            width:  p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            opacity: p.op,
            filter: p.blur > 0 ? `blur(${p.blur}px)` : undefined,
          }}
          animate={reduced ? {} : {
            /* Rise by 2× container height — from below-bottom to above-top */
            y: [0, -(dims.h * 2 + p.size)],
            x: [0, p.dX, -p.dX * 0.4, 0],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
            x: { duration: p.dur, delay: p.delay, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' },
          }}
        />
      ))}

      {/* ── Layer 2: constellation (only once we have real dimensions) ── */}
      {showConstellation && !reduced && dims.w > 0 && (
        <svg
          width={dims.w}
          height={dims.h}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <defs>
            <filter id="orb-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Connecting lines — draw in as their destination node activates */}
          {EDGES.map(({ from, to }, edgeIdx) => {
            const p1 = px(NODES[from]);
            const p2 = px(NODES[to]);
            // Line starts drawing when SOURCE node activates, arrives just before destination pulses
            const tDraw = Math.max(0.001, norm(edgeIdx * INTERVAL + 0.05));
            const tFull = norm((edgeIdx + 1) * INTERVAL - 0.1);

            return (
              <motion.path
                key={`edge-${edgeIdx}`}
                d={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`}
                stroke={NODES[to].color}
                strokeWidth={1.5}
                strokeLinecap="round"
                fill="none"
                animate={{
                  /* pathLength stays at 1 once drawn — no retraction */
                  pathLength: [0,    0,     1,    1,           1,          0   ],
                  opacity:    [0,    0,     0.40, 0.22,        0,          0   ],
                }}
                transition={{
                  duration: TOTAL,
                  times:    [0, tDraw, tFull, T_FADE_START, T_FADE_END, 1],
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            );
          })}

          {/* Nodes — pulse to life one by one */}
          {NODES.map((node, i) => {
            const { x, y } = px(node);
            const tOn   = norm(i * INTERVAL);
            const tPeak = norm(i * INTERVAL + 0.15);
            const tOff  = norm(i * INTERVAL + 0.6);
            const tDim  = norm(i * INTERVAL + 0.8);
            const safeOn = Math.max(0.001, tOn - 0.005);

            return (
              <motion.circle
                key={`node-${i}`}
                cx={x}
                cy={y}
                fill={node.color}
                filter="url(#orb-glow)"
                animate={{
                  r:       [5,      5,      10,     7,      5,      5     ],
                  opacity: [0.30,   0.30,   0.80,   0.55,   0.30,   0.30  ],
                }}
                transition={{
                  duration: TOTAL,
                  times:    [0, safeOn, tPeak, tOff, tDim, 1],
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            );
          })}
        </svg>
      )}

      {/* Top-edge dissolve mask */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(13,31,34,1) 0%, transparent 22%, transparent 78%, rgba(13,31,34,0.6) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
