import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Zap, CheckCircle2, Clock, DollarSign, Bot, Quote, Users } from 'lucide-react';

const stats = [
  { value: '29+', label: 'Sprints Completed', description: 'With persistent memory compounding knowledge', icon: Zap, color: 'purple' },
  { value: '837+', label: 'Tickets Executed', description: 'Shipped across 3 validated case studies', icon: CheckCircle2, color: 'green' },
  { value: '12', label: 'Days to Production', description: 'From requirements to deployed application', icon: Clock, color: 'cyan' },
  { value: '70%+', label: 'Test Coverage', description: 'AI-driven E2E testing with Playwright', icon: Bot, color: 'yellow' },
  { value: '~40%', label: 'Cost Savings', description: 'FinOps model routing optimization', icon: DollarSign, color: 'emerald' },
  { value: '~45%', label: 'Multi-Agent Savings', description: 'Parallel execution with orchestrator pattern', icon: Users, color: 'blue' },
];

const colorClasses: Record<string, { bg: string; border: string; icon: string }> = {
  green: { bg: 'bg-green-500/10', border: 'border-green-500/30', icon: 'text-green-500' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: 'text-blue-500' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: 'text-emerald-500' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: 'text-purple-500' },
  yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: 'text-yellow-500' },
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', icon: 'text-cyan-500' },
};

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
          const prefix = target.match(/^[^0-9]*/)?.[0] || '';
          const suffix = target.match(/[^0-9]*$/)?.[0] || '';

          if (isNaN(numericPart)) {
            setCount(target);
            return;
          }

          const startTime = performance.now();
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            const current = Math.round(numericPart * eased);
            setCount(`${prefix}${current}${suffix}`);
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

function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const colors = colorClasses[stat.color];
  const { count, ref } = useCountUp(stat.value);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`${colors.bg} ${colors.border} border rounded-xl p-6 text-center hover:scale-105 transition-transform`}
    >
      <stat.icon className={`${colors.icon} mx-auto mb-3`} size={28} />
      <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
        {count}
      </div>
      <div className="text-sm font-medium text-white/80 mb-1">{stat.label}</div>
      <div className="text-xs text-white/50">{stat.description}</div>
    </motion.div>
  );
}

export default function StatsSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-sm text-yellow-400 mb-4">
            Proven Results
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Battle-Tested in Production
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Real metrics from real projects built with the AutoSpec methodology
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl" />
          <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 rounded-2xl p-8 sm:p-12 text-center">
            <Quote className="text-white/10 mx-auto mb-6" size={48} />
            <blockquote className="text-xl sm:text-2xl text-white/90 font-medium mb-6 max-w-3xl mx-auto leading-relaxed">
              "We tried three other spec frameworks before AutoSpec. By Sprint 5, they'd drifted so far from reality that the AI was ignoring the specs entirely. AutoSpec's living docs and sprint memory is the first one that actually gets MORE useful over time."
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                PV
              </div>
              <div className="text-left">
                <div className="font-semibold text-white">Production Validation Team</div>
                <div className="text-sm text-white/50">Senior Developer</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
