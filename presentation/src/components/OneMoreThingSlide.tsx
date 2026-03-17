import { motion } from 'framer-motion';

interface Insight {
  title: string;
  description: string;
  icon: string;
  color: 'blue' | 'green' | 'violet' | 'amber' | 'cyan';
}

interface OneMoreThingSlideProps {
  data: {
    title: string;
    subtitle: string;
    insights: Insight[];
  };
  lang: 'en' | 'he';
}

const colorMap = {
  blue: {
    border: 'rgba(59,130,246,0.5)',
    bg: 'rgba(59,130,246,0.08)',
    text: 'text-blue-400',
    glow: 'rgba(59,130,246,0.3)',
    gradient: 'from-blue-500/20 to-blue-600/5',
    ring: 'rgba(59,130,246,0.15)',
  },
  green: {
    border: 'rgba(34,197,94,0.5)',
    bg: 'rgba(34,197,94,0.08)',
    text: 'text-green-400',
    glow: 'rgba(34,197,94,0.3)',
    gradient: 'from-green-500/20 to-green-600/5',
    ring: 'rgba(34,197,94,0.15)',
  },
  violet: {
    border: 'rgba(139,92,246,0.5)',
    bg: 'rgba(139,92,246,0.08)',
    text: 'text-violet-400',
    glow: 'rgba(139,92,246,0.3)',
    gradient: 'from-violet-500/20 to-violet-600/5',
    ring: 'rgba(139,92,246,0.15)',
  },
  amber: {
    border: 'rgba(245,158,11,0.5)',
    bg: 'rgba(245,158,11,0.08)',
    text: 'text-amber-400',
    glow: 'rgba(245,158,11,0.3)',
    gradient: 'from-amber-500/20 to-amber-600/5',
    ring: 'rgba(245,158,11,0.15)',
  },
  cyan: {
    border: 'rgba(6,182,212,0.5)',
    bg: 'rgba(6,182,212,0.08)',
    text: 'text-cyan-400',
    glow: 'rgba(6,182,212,0.3)',
    gradient: 'from-cyan-500/20 to-cyan-600/5',
    ring: 'rgba(6,182,212,0.15)',
  },
};

// Floating ambient particles for atmosphere
const particles = [
  { x: '12%', y: '18%', size: 5, xRange: 15, yRange: 20, dur: 10, color: 'rgba(139,92,246,0.25)' },
  { x: '88%', y: '22%', size: 4, xRange: -12, yRange: 18, dur: 13, color: 'rgba(59,130,246,0.2)' },
  { x: '20%', y: '78%', size: 6, xRange: 18, yRange: -15, dur: 11, color: 'rgba(6,182,212,0.2)' },
  { x: '75%', y: '70%', size: 4, xRange: -14, yRange: 16, dur: 14, color: 'rgba(245,158,11,0.18)' },
  { x: '50%', y: '12%', size: 3, xRange: 10, yRange: 12, dur: 9, color: 'rgba(139,92,246,0.15)' },
  { x: '35%', y: '85%', size: 5, xRange: -16, yRange: -14, dur: 12, color: 'rgba(34,197,94,0.18)' },
  { x: '65%', y: '45%', size: 3, xRange: 12, yRange: -10, dur: 15, color: 'rgba(139,92,246,0.12)' },
  { x: '8%', y: '50%', size: 4, xRange: 14, yRange: 16, dur: 11, color: 'rgba(59,130,246,0.15)' },
];

// Title character animation — typewriter with glow
const charVariant = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

export default function OneMoreThingSlide({ data }: OneMoreThingSlideProps) {
  const titleChars = data.title.split('');
  // Total typewriter time: ~1.4s for the title to fully appear
  const typewriterEnd = 0.3 + titleChars.length * 0.045;
  // Dramatic pause: hold for 1s after typewriter completes
  const pauseEnd = typewriterEnd + 1.0;
  // Cards start appearing after the pause
  const cardsStart = pauseEnd + 0.2;

  return (
    <div className="relative max-w-5xl mx-auto w-full overflow-hidden">
      {/* Animated radial gradient background — breathing spotlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ margin: '-4rem', padding: '4rem' }}
        animate={{
          background: [
            'radial-gradient(ellipse at 50% 30%, rgba(139,92,246,0.15) 0%, rgba(59,130,246,0.08) 40%, transparent 70%)',
            'radial-gradient(ellipse at 45% 40%, rgba(59,130,246,0.18) 0%, rgba(139,92,246,0.08) 40%, transparent 70%)',
            'radial-gradient(ellipse at 55% 35%, rgba(6,182,212,0.15) 0%, rgba(139,92,246,0.08) 40%, transparent 70%)',
            'radial-gradient(ellipse at 50% 30%, rgba(139,92,246,0.15) 0%, rgba(59,130,246,0.08) 40%, transparent 70%)',
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          animate={{
            x: [0, p.xRange, 0],
            y: [0, p.yRange, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Content layer */}
      <div className="relative z-10">
        {/* ── PHASE 1: Typewriter title with purple glow ── */}
        <div className="text-center mb-4 min-h-[80px]">
          <h2
            className="text-5xl sm:text-6xl md:text-7xl font-bold italic inline-block"
            style={{
              filter: 'drop-shadow(0 0 40px rgba(139,92,246,0.5))',
            }}
          >
            {titleChars.map((char, idx) => (
              <motion.span
                key={idx}
                variants={charVariant}
                initial="hidden"
                animate="visible"
                transition={{
                  delay: 0.3 + idx * 0.045,
                  duration: 0.08,
                  ease: 'easeOut',
                }}
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #c4b5fd 50%, #a78bfa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {char}
              </motion.span>
            ))}
          </h2>

          {/* Blinking cursor after typewriter */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 1, 0, 0],
            }}
            transition={{
              delay: 0.3,
              duration: 1.0,
              times: [0, 0.01, 0.5, 0.51, 1],
              repeat: 3,
              repeatDelay: 0,
            }}
            className="inline-block w-[3px] h-[50px] sm:h-[60px] md:h-[70px] bg-purple-400 align-middle ml-1"
            style={{ filter: 'drop-shadow(0 0 8px rgba(139,92,246,0.8))' }}
          />
        </div>

        {/* ── PHASE 2: Subtitle fades in after pause ── */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: pauseEnd - 0.3, duration: 0.6 }}
          className="text-center text-slate-400 text-lg mb-10 max-w-2xl mx-auto"
        >
          {data.subtitle}
        </motion.p>

        {/* ── Horizontal divider line — draws from center outward ── */}
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: pauseEnd, duration: 0.8, ease: 'easeOut' }}
            className="h-px w-full max-w-md"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), rgba(59,130,246,0.5), rgba(139,92,246,0.5), transparent)',
              transformOrigin: 'center',
            }}
          />
        </div>

        {/* ── PHASE 3: Insight cards — top row 3, bottom row 2 centered ── */}
        <div className="flex flex-wrap justify-center gap-4">
          {data.insights.map((insight, idx) => {
            const colors = colorMap[insight.color];

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: cardsStart + idx * 0.18,
                  duration: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="relative rounded-xl p-5 backdrop-blur-sm overflow-hidden w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)]"
                style={{
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  boxShadow: `0 0 20px ${colors.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
                }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: `0 0 35px ${colors.glow}, 0 0 60px ${colors.ring}, inset 0 1px 0 rgba(255,255,255,0.1)`,
                  transition: { duration: 0.2 },
                }}
              >
                {/* Corner glow accent */}
                <motion.div
                  className="absolute top-0 right-0 w-24 h-24 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at top right, ${colors.glow}, transparent 70%)`,
                    opacity: 0.4,
                  }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.5 }}
                />

                {/* Icon with glow ring */}
                <motion.div
                  className="relative mb-3"
                  animate={{ rotate: [0, 2, -2, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.3 }}
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                    style={{
                      background: colors.bg,
                      boxShadow: `0 0 16px ${colors.ring}`,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    {insight.icon}
                  </div>
                </motion.div>

                <h3 className={`text-base font-bold ${colors.text} mb-1.5`}>
                  {insight.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {insight.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* ── Bottom pulse — "the future is already here" feel ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: cardsStart + data.insights.length * 0.18 + 0.5, duration: 0.8 }}
          className="mt-8 flex justify-center"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full">
            <motion.div
              className="w-2.5 h-2.5 rounded-full bg-purple-400"
              animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ boxShadow: '0 0 10px rgba(139,92,246,0.6)' }}
            />
            <span className="text-sm text-white/50 font-medium tracking-wide">
              {data.subtitle}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
