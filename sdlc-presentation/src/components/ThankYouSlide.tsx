import { motion } from 'framer-motion';

interface ThankYouSlideProps {
  data: {
    kicker?: string;
    title: string;
    subtitle?: string;
    tagline: string;
    subline?: string;
    presenter?: string;
  };
  lang: 'en' | 'he';
}

// Finale slide — the Game Of Drones video plays full-bleed behind the words.
// No flat overlay tint (per the deck's hero treatment); legibility comes from
// a drop-shadow on the glyphs plus a gentle bottom gradient to seat the text.
export default function ThankYouSlide({ data }: ThankYouSlideProps): JSX.Element {
  const base = import.meta.env.BASE_URL;

  return (
    <section
      className="relative w-screen min-h-screen flex flex-col items-center justify-center text-center overflow-hidden"
      style={{ marginLeft: 'calc(50% - 50vw)' }}
    >
      {/* Full-bleed looping video — same source as the Game Of Drones hero */}
      <video
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        src={`${base}drone-battle.mp4`}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />

      {/* Gentle bottom-seated gradient — keeps the lower text crisp without a flat tint */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.00) 35%, rgba(15,23,42,0.35) 100%)',
        }}
      />

      {/* Content — carries its own shadow for legibility over the raw video */}
      <div
        className="relative z-10 flex flex-col items-center px-6"
        style={{ filter: 'drop-shadow(0 2px 12px rgba(0,0,0,0.8))' }}
      >
        {data.kicker && (
          <motion.p
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[10px] sm:text-xs tracking-[0.5em] text-blue-300/80 uppercase font-mono mb-8"
          >
            {data.kicker}
          </motion.p>
        )}

        <motion.h1
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
          className="text-6xl sm:text-8xl lg:text-9xl leading-none bg-gradient-to-r from-blue-300 via-violet-300 to-indigo-300 bg-clip-text text-transparent pb-2 tracking-wide"
          style={{ fontFamily: "'Cinzel', serif", fontWeight: 900 }}
        >
          {data.title}
        </motion.h1>

        {data.subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl sm:text-3xl text-white/85 font-light tracking-wide mb-10"
          >
            {data.subtitle}
          </motion.p>
        )}

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-xl sm:text-2xl text-white/90 max-w-2xl leading-relaxed font-medium mb-5"
        >
          {data.tagline}
        </motion.p>

        {data.subline && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
            className="text-sm sm:text-base text-white/55 font-mono tracking-wide max-w-xl"
          >
            {data.subline}
          </motion.p>
        )}

        {data.presenter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.05 }}
            className="mt-12 flex flex-col items-center gap-3"
          >
            <span className="h-px w-16 bg-white/25" />
            <span className="text-sm sm:text-base text-white/70 tracking-wide">
              {data.presenter}
            </span>
          </motion.div>
        )}
      </div>
    </section>
  );
}
