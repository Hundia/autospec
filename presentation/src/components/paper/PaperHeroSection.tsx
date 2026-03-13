import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Calendar, BookOpen } from 'lucide-react';
import { paperMeta } from '../../data/paper-content';

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

function StatItem({ stat, index }: { stat: { label: string; value: string }; index: number }) {
  const { count, ref } = useCountUp(stat.value);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
      className="text-center"
    >
      <div className="text-2xl sm:text-3xl font-bold text-white">{count}</div>
      <div className="text-xs text-white/50 mt-1">{stat.label}</div>
    </motion.div>
  );
}

export default function PaperHeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-sm text-emerald-400">
            <FileText size={14} />
            Academic Paper
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
        >
          <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
            {paperMeta.title}
          </span>
        </motion.h1>

        {/* Meta info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center items-center gap-4 mb-8 text-sm text-white/50"
        >
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-emerald-400" />
            <span>{paperMeta.authors.join(', ')}</span>
          </div>
          <div className="w-px h-4 bg-white/20 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-emerald-400" />
            <span>{paperMeta.date}</span>
          </div>
          <div className="w-px h-4 bg-white/20 hidden sm:block" />
          <div className="flex items-center gap-2">
            <BookOpen size={14} className="text-emerald-400" />
            <span>{paperMeta.journal}</span>
          </div>
        </motion.div>

        {/* Abstract */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8 mb-8 text-left"
        >
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">Abstract</div>
          <p className="text-white/70 leading-relaxed text-sm sm:text-base">{paperMeta.abstract}</p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-4 gap-4 bg-white/5 border border-white/10 rounded-2xl p-6 mb-8"
        >
          {paperMeta.stats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} index={i} />
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
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
            View Presentation
          </a>
        </motion.div>
      </div>
    </section>
  );
}
