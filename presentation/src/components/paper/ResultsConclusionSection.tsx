import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Copy, Check, Download, Play } from 'lucide-react';
import { resultStats, contributions, conclusion, references, bibtex } from '../../data/paper-content';

function useCountUp(target: string, duration: number = 1500) {
  const [count, setCount] = useState('0');
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasAnimated || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          const numericPart = parseInt(target.replace(/[^0-9]/g, ''));
          const prefix = target.match(/^[^0-9~]*/)?.[0] || '';
          const suffix = target.match(/[^0-9]*$/)?.[0] || '';
          const hasTilde = target.startsWith('~');

          if (isNaN(numericPart)) {
            setCount(target);
            return;
          }

          const startTime = performance.now();
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(numericPart * eased);
            setCount(`${hasTilde ? '~' : ''}${prefix}${current}${suffix}`);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, hasAnimated]);

  return { count, ref };
}

const statColors = [
  { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  { bg: 'bg-blue-500/10',    border: 'border-blue-500/30',    text: 'text-blue-400' },
  { bg: 'bg-purple-500/10',  border: 'border-purple-500/30',  text: 'text-purple-400' },
  { bg: 'bg-cyan-500/10',    border: 'border-cyan-500/30',    text: 'text-cyan-400' },
  { bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   text: 'text-amber-400' },
  { bg: 'bg-indigo-500/10',  border: 'border-indigo-500/30',  text: 'text-indigo-400' },
];

function StatCard({ stat, index }: { stat: typeof resultStats[0]; index: number }) {
  const colors = statColors[index % statColors.length];
  const { count, ref } = useCountUp(stat.value);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={`${colors.bg} ${colors.border} border rounded-xl p-5 text-center hover:scale-105 transition-transform`}
    >
      <div className={`text-3xl sm:text-4xl font-bold ${colors.text} mb-1`}>{count}</div>
      <div className="text-sm font-medium text-white/80 mb-1">{stat.label}</div>
      <div className="text-xs text-white/40">{stat.description}</div>
    </motion.div>
  );
}

export default function ResultsConclusionSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(bibtex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-sm text-yellow-400 mb-4">
            <Trophy size={14} />
            Section 7: Results &amp; Conclusion
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Proven{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              at Scale
            </span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Quantified outcomes across three real-world deployments demonstrate AutoSpec's reproducibility and scalability.
          </p>
        </motion.div>

        {/* Stats 2x3 grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {resultStats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>

        {/* Key Contributions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h3 className="text-xl font-bold text-white mb-6 text-center">Key Contributions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contributions.map((c, index) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-white/5 border border-white/10 rounded-xl p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm mb-1">{c.title}</h4>
                    <p className="text-white/50 text-xs leading-relaxed">{c.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Conclusion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 rounded-xl p-6 sm:p-8 mb-12"
        >
          <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">Conclusion</h3>
          <p className="text-white/80 leading-relaxed">{conclusion}</p>
        </motion.div>

        {/* References */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10"
        >
          <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">References</h3>
          <ol className="space-y-2">
            {references.map((ref, i) => (
              <li key={i} className="text-xs text-white/40 leading-relaxed flex gap-3">
                <span className="text-white/20 flex-shrink-0">[{i + 1}]</span>
                <span>{ref}</span>
              </li>
            ))}
          </ol>
        </motion.div>

        {/* BibTeX */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest">Cite This Paper</h3>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-white/60 hover:text-white transition-all"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-green-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={12} />
                  Copy BibTeX
                </>
              )}
            </button>
          </div>
          <pre className="bg-slate-900 border border-white/10 rounded-xl p-4 text-xs font-mono text-white/50 overflow-x-auto leading-relaxed">
            {bibtex}
          </pre>
        </motion.div>

        {/* Final CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href={`${import.meta.env.BASE_URL}ACADEMIC_PAPER.pdf`}
            download
            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105"
          >
            <Download size={18} />
            Download PDF
          </a>
          <a
            href="#/presentation"
            className="group flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium rounded-xl transition-all"
          >
            <Play size={18} />
            View Presentation
          </a>
        </motion.div>
      </div>
    </section>
  );
}
