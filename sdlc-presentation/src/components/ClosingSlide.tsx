import { motion } from 'framer-motion';
import {
  Compass,
  Terminal,
  Sparkles,
  Rocket,
  ExternalLink,
  type LucideIcon,
} from 'lucide-react';

interface ClosingLink {
  name: string;
  url: string;
  note?: string;
}

interface ClosingCategory {
  label: string;
  accent: string;
  icon: string;
  links: ClosingLink[];
}

interface ClosingSlideProps {
  data: {
    title: string;
    subtitle?: string;
    categories: ClosingCategory[];
    tagline: string;
  };
  lang: 'en' | 'he';
}

// Icon lookup — literal mapping, no dynamic construction.
const ICONS: Record<string, LucideIcon> = {
  Compass,
  Terminal,
  Sparkles,
  Rocket,
};

// Per-category accent — FULL literal class strings, no concatenation.
const ACCENTS: Record<
  string,
  { card: string; chip: string; icon: string; label: string; dot: string }
> = {
  emerald: {
    card: 'border-emerald-400/25 bg-emerald-500/5 hover:border-emerald-400/40',
    chip: 'border-emerald-400/20 bg-emerald-400/5 hover:border-emerald-300/50 hover:bg-emerald-400/10',
    icon: 'text-emerald-300',
    label: 'text-emerald-200',
    dot: 'bg-emerald-400',
  },
  blue: {
    card: 'border-blue-400/25 bg-blue-500/5 hover:border-blue-400/40',
    chip: 'border-blue-400/20 bg-blue-400/5 hover:border-blue-300/50 hover:bg-blue-400/10',
    icon: 'text-blue-300',
    label: 'text-blue-200',
    dot: 'bg-blue-400',
  },
  cyan: {
    card: 'border-cyan-400/25 bg-cyan-500/5 hover:border-cyan-400/40',
    chip: 'border-cyan-400/20 bg-cyan-400/5 hover:border-cyan-300/50 hover:bg-cyan-400/10',
    icon: 'text-cyan-300',
    label: 'text-cyan-200',
    dot: 'bg-cyan-400',
  },
  violet: {
    card: 'border-violet-400/25 bg-violet-500/5 hover:border-violet-400/40',
    chip: 'border-violet-400/20 bg-violet-400/5 hover:border-violet-300/50 hover:bg-violet-400/10',
    icon: 'text-violet-300',
    label: 'text-violet-200',
    dot: 'bg-violet-400',
  },
};

const FALLBACK_ACCENT = ACCENTS.emerald;

export default function ClosingSlide({ data, lang }: ClosingSlideProps): JSX.Element {
  const isRTL = lang === 'he';

  return (
    <div className="max-w-5xl mx-auto w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-gradient-to-r from-teal-300 via-cyan-300 to-violet-300 bg-clip-text">
          {data.title}
        </h2>
        {data.subtitle && (
          <p className="mt-2 text-base sm:text-lg text-white/55">{data.subtitle}</p>
        )}
      </motion.div>

      {/* Category grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.categories.map((category, idx) => {
          const accent = ACCENTS[category.accent] ?? FALLBACK_ACCENT;
          const Icon = ICONS[category.icon] ?? Compass;

          return (
            <motion.div
              key={category.label}
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.15 + idx * 0.08, ease: 'easeOut' }}
              className={`rounded-2xl border p-4 transition-colors ${accent.card}`}
            >
              {/* Category header */}
              <div
                className={`flex items-center gap-2.5 mb-3 ${
                  isRTL ? 'flex-row-reverse text-right' : ''
                }`}
              >
                <Icon className={accent.icon} size={20} />
                <span className={`text-sm font-semibold tracking-wide uppercase ${accent.label}`}>
                  {category.label}
                </span>
              </div>

              {/* Links */}
              <div className="space-y-2">
                {category.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    dir="ltr"
                    className={`group flex items-center gap-2.5 rounded-xl border px-3 py-2 transition-colors ${accent.chip}`}
                  >
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${accent.dot}`} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-white">
                        {link.name}
                      </span>
                      {link.note && (
                        <span className="block truncate text-xs text-white/45">{link.note}</span>
                      )}
                    </span>
                    <ExternalLink
                      className="shrink-0 text-white/30 transition-colors group-hover:text-white/70"
                      size={14}
                    />
                  </a>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="mt-6 text-center text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-teal-300 via-cyan-300 to-violet-300 bg-clip-text"
      >
        {data.tagline}
      </motion.p>
    </div>
  );
}
