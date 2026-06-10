import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

// ─── 1. Floating Grid ───────────────────────────────────────────────
const FloatingGrid: React.FC = () => (
  <div
    className="absolute inset-0"
    style={{
      backgroundImage:
        'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
      backgroundSize: '40px 40px',
      animation: 'floatingGrid 20s linear infinite',
    }}
  />
);

// ─── 2. Particle Field ──────────────────────────────────────────────
const ParticleField: React.FC = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2.5,
        duration: 15 + Math.random() * 25,
        delay: Math.random() * -20,
        dx: (Math.random() - 0.5) * 200,
        dy: (Math.random() - 0.5) * 200,
      })),
    [],
  );
  return (
    <svg className="absolute inset-0 w-full h-full">
      {particles.map((p) => (
        <motion.circle
          key={p.id}
          cx={`${p.x}%`}
          cy={`${p.y}%`}
          r={p.size}
          fill="white"
          opacity={0.15 + Math.random() * 0.25}
          animate={{ cx: [`${p.x}%`, `${p.x + p.dx / 5}%`, `${p.x}%`], cy: [`${p.y}%`, `${p.y + p.dy / 5}%`, `${p.y}%`] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
        />
      ))}
    </svg>
  );
};

// ─── 3. Circuit Lines ───────────────────────────────────────────────
const CircuitLines: React.FC = () => {
  const lines = useMemo(
    () => [
      // Horizontal lines
      { x1: 0, y1: '15%', x2: '100%', y2: '15%', d: 8 },
      { x1: 0, y1: '35%', x2: '100%', y2: '35%', d: 12 },
      { x1: 0, y1: '55%', x2: '100%', y2: '55%', d: 10 },
      { x1: 0, y1: '75%', x2: '100%', y2: '75%', d: 14 },
      { x1: 0, y1: '90%', x2: '100%', y2: '90%', d: 9 },
      // Vertical lines
      { x1: '10%', y1: 0, x2: '10%', y2: '100%', d: 11 },
      { x1: '30%', y1: 0, x2: '30%', y2: '100%', d: 13 },
      { x1: '50%', y1: 0, x2: '50%', y2: '100%', d: 7 },
      { x1: '70%', y1: 0, x2: '70%', y2: '100%', d: 15 },
      { x1: '90%', y1: 0, x2: '90%', y2: '100%', d: 10 },
    ],
    [],
  );
  return (
    <>
      <style>{`
        @keyframes circuitPulse {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
      <svg className="absolute inset-0 w-full h-full">
        {lines.map((l, i) => (
          <line
            key={i}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke="rgba(100,180,255,0.12)"
            strokeWidth={0.5}
          />
        ))}
        {lines.map((l, i) => (
          <line
            key={`pulse-${i}`}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke="rgba(100,180,255,0.5)"
            strokeWidth={1}
            strokeDasharray="20 980"
            style={{
              animation: `circuitPulse ${l.d}s linear infinite`,
              animationDelay: `${-i * 1.3}s`,
            }}
          />
        ))}
        {/* Junction dots */}
        {[
          ['10%', '15%'], ['30%', '35%'], ['50%', '55%'], ['70%', '75%'], ['90%', '90%'],
          ['30%', '15%'], ['50%', '35%'], ['70%', '55%'], ['90%', '75%'], ['10%', '90%'],
        ].map(([cx, cy], i) => (
          <circle key={`dot-${i}`} cx={cx} cy={cy} r={2.5} fill="rgba(100,180,255,0.25)" />
        ))}
      </svg>
    </>
  );
};

// ─── 4. Gradient Pulse ──────────────────────────────────────────────
const GradientPulse: React.FC = () => (
  <>
    <style>{`
      @keyframes gradientPulse {
        0% { background-position: 0% 0%; }
        25% { background-position: 100% 0%; }
        50% { background-position: 100% 100%; }
        75% { background-position: 0% 100%; }
        100% { background-position: 0% 0%; }
      }
    `}</style>
    <div
      className="absolute inset-0"
      style={{
        background:
          'linear-gradient(45deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15), rgba(16,185,129,0.15), rgba(245,158,11,0.1), rgba(59,130,246,0.15))',
        backgroundSize: '400% 400%',
        animation: 'gradientPulse 15s ease infinite',
      }}
    />
  </>
);

// ─── 5. Matrix Rain ─────────────────────────────────────────────────
const MatrixRain: React.FC = () => {
  const columns = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: `${4 + i * 6.5}%`,
        chars: Array.from({ length: 12 + Math.floor(Math.random() * 8) }, () =>
          Math.random() > 0.5 ? '1' : '0',
        ),
        duration: 6 + Math.random() * 8,
        delay: Math.random() * -10,
      })),
    [],
  );
  return (
    <>
      <style>{`
        @keyframes matrixFall {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
      `}</style>
      <div className="absolute inset-0 overflow-hidden">
        {columns.map((col) => (
          <div
            key={col.id}
            className="absolute top-0 flex flex-col gap-3 text-green-400/30 text-xs font-mono"
            style={{
              left: col.left,
              animation: `matrixFall ${col.duration}s linear infinite`,
              animationDelay: `${col.delay}s`,
              willChange: 'transform',
            }}
          >
            {col.chars.map((ch, j) => (
              <span key={j} style={{ opacity: 0.3 + Math.random() * 0.5 }}>
                {ch}
              </span>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

// ─── 6. Constellation ───────────────────────────────────────────────
const Constellation: React.FC = () => {
  const nodes = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        r: 1 + Math.random() * 1.5,
      })),
    [],
  );
  // Connect nearby nodes (within 25% distance)
  const edges = useMemo(() => {
    const result: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < 22) {
          result.push({ x1: nodes[i].x, y1: nodes[i].y, x2: nodes[j].x, y2: nodes[j].y });
        }
      }
    }
    return result;
  }, [nodes]);

  return (
    <svg className="absolute inset-0 w-full h-full">
      {edges.map((e, i) => (
        <line
          key={`e-${i}`}
          x1={`${e.x1}%`}
          y1={`${e.y1}%`}
          x2={`${e.x2}%`}
          y2={`${e.y2}%`}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={0.5}
        />
      ))}
      {nodes.map((n) => (
        <motion.circle
          key={n.id}
          cx={`${n.x}%`}
          cy={`${n.y}%`}
          r={n.r}
          fill="white"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 3 }}
        />
      ))}
    </svg>
  );
};

// ─── 7. Wave Mesh ───────────────────────────────────────────────────
const WaveMesh: React.FC = () => {
  const waves = [
    { color: 'rgba(59,130,246,0.1)', yOffset: 40, amplitude: 30, duration: 12 },
    { color: 'rgba(139,92,246,0.08)', yOffset: 50, amplitude: 25, duration: 15 },
    { color: 'rgba(16,185,129,0.08)', yOffset: 60, amplitude: 35, duration: 18 },
    { color: 'rgba(245,158,11,0.06)', yOffset: 70, amplitude: 20, duration: 10 },
  ];
  return (
    <>
      <style>{`
        @keyframes waveFloat1 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes waveFloat2 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(15px); } }
        @keyframes waveFloat3 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-25px); } }
        @keyframes waveFloat4 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(10px); } }
      `}</style>
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 900">
        {waves.map((w, i) => {
          const y = (w.yOffset / 100) * 900;
          const a = w.amplitude;
          const d = `M0,${y} C240,${y - a} 480,${y + a} 720,${y} C960,${y - a} 1200,${y + a} 1440,${y} L1440,900 L0,900 Z`;
          return (
            <path
              key={i}
              d={d}
              fill={w.color}
              style={{
                animation: `waveFloat${i + 1} ${w.duration}s ease-in-out infinite`,
                willChange: 'transform',
              }}
            />
          );
        })}
      </svg>
    </>
  );
};

// ─── 8. Hex Grid ────────────────────────────────────────────────────
const HexGrid: React.FC = () => {
  const hexagons = useMemo(() => {
    const result: { cx: number; cy: number; pulseDelay: number }[] = [];
    const size = 40;
    const h = size * Math.sqrt(3);
    for (let row = -1; row < 15; row++) {
      for (let col = -1; col < 25; col++) {
        const cx = col * size * 1.5;
        const cy = row * h + (col % 2 === 0 ? 0 : h / 2);
        result.push({ cx, cy, pulseDelay: Math.random() * 8 });
      }
    }
    return result;
  }, []);

  const hexPath = (cx: number, cy: number, r: number) => {
    const points = [];
    for (let a = 0; a < 6; a++) {
      const angle = (Math.PI / 3) * a - Math.PI / 6;
      points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }
    return points.join(' ');
  };

  return (
    <>
      <style>{`
        @keyframes hexPulse {
          0%, 100% { opacity: 0.04; }
          50% { opacity: 0.18; }
        }
      `}</style>
      <svg className="absolute inset-0 w-full h-full">
        {hexagons.map((hex, i) => (
          <polygon
            key={i}
            points={hexPath(hex.cx, hex.cy, 18)}
            fill="none"
            stroke="rgba(100,180,255,0.12)"
            strokeWidth={0.5}
            style={{
              animation: `hexPulse ${4 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${hex.pulseDelay}s`,
            }}
          />
        ))}
      </svg>
    </>
  );
};

// ─── Registry ───────────────────────────────────────────────────────
export const backgrounds = [
  { id: 'none', name: 'None', component: null },
  { id: 'grid', name: 'Floating Grid', component: FloatingGrid },
  { id: 'particles', name: 'Particle Field', component: ParticleField },
  { id: 'circuits', name: 'Circuit Lines', component: CircuitLines },
  { id: 'gradient', name: 'Gradient Pulse', component: GradientPulse },
  { id: 'matrix', name: 'Matrix Rain', component: MatrixRain },
  { id: 'constellation', name: 'Constellation', component: Constellation },
  { id: 'waves', name: 'Wave Mesh', component: WaveMesh },
  { id: 'hex', name: 'Hex Grid', component: HexGrid },
] as const;

export type BackgroundId = (typeof backgrounds)[number]['id'];

export default function BackgroundEffect({ activeId }: { activeId: string }) {
  const bg = backgrounds.find((b) => b.id === activeId);
  if (!bg?.component) return null;
  const Comp = bg.component;
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-100">
      <Comp />
    </div>
  );
}
