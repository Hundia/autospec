import { motion } from 'framer-motion';
import { Shield, Database, Bug, Zap, CheckCircle2, XCircle, PiggyBank, type LucideIcon } from 'lucide-react';

interface ComparisonRow {
  feature: string;
  autospec: string | boolean;
  speckit: string | boolean;
  bmad: string | boolean;
  openspec: string | boolean;
}

const comparisonFeatures: ComparisonRow[] = [
  { feature: 'Production validation', autospec: '263 tickets, 2 apps', speckit: 'Templates only', bmad: 'Demo projects', openspec: 'Community examples' },
  { feature: 'Setup time', autospec: '30 seconds', speckit: '5-10 minutes', bmad: '10-15 minutes', openspec: '15-20 minutes' },
  { feature: 'Zero-install option', autospec: true, speckit: false, bmad: false, openspec: false },
  { feature: 'FinOps model routing', autospec: true, speckit: false, bmad: false, openspec: false },
  { feature: 'Living docs linkage', autospec: 'Bi-directional', speckit: 'One-way', bmad: 'None', openspec: 'Partial' },
  { feature: 'Bug fix protocol', autospec: true, speckit: false, bmad: false, openspec: false },
  { feature: 'Persistent AI memory', autospec: 'CLAUDE.md + backlog', speckit: 'Session only', bmad: 'Session only', openspec: 'Partial' },
  { feature: 'Interactive viewer', autospec: 'Full website', speckit: false, bmad: false, openspec: 'Read-only' },
  { feature: 'Academic paper', autospec: true, speckit: false, bmad: 'Blog posts', openspec: false },
];

interface Differentiator {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

const differentiators: Differentiator[] = [
  {
    icon: Shield,
    title: 'Battle-Tested',
    description: '263 tickets across real production apps. Every protocol exists because we hit the wall without it.',
    color: 'blue',
  },
  {
    icon: Database,
    title: 'Memory That Survives',
    description: 'CLAUDE.md gives your AI persistent project memory. Sprint summaries accumulate institutional knowledge. Session 50 has access to every decision from Session 1.',
    color: 'purple',
  },
  {
    icon: PiggyBank,
    title: 'FinOps Built In',
    description: '40% Haiku, 45% Sonnet, 15% Opus. Same quality, ~60% lower cost. No other framework even considers this.',
    color: 'emerald',
  },
  {
    icon: Bug,
    title: 'Bug Fix Protocol',
    description: 'Reproduce the exact user flow → fix → verify by replaying → check for sibling bugs. Born from a real incident where we "fixed" one bug and missed another with identical symptoms.',
    color: 'amber',
  },
  {
    icon: Zap,
    title: 'Zero to Structured in 30s',
    description: 'Paste one prompt into any AI assistant. No install, no CLI, no config. Your AI starts working with structure immediately.',
    color: 'cyan',
  },
];

const colorClasses: Record<string, { bg: string; border: string; icon: string; iconBg: string }> = {
  blue: { bg: 'bg-blue-500/5', border: 'border-blue-500/30', icon: 'text-blue-400', iconBg: 'bg-blue-500/10' },
  purple: { bg: 'bg-purple-500/5', border: 'border-purple-500/30', icon: 'text-purple-400', iconBg: 'bg-purple-500/10' },
  emerald: { bg: 'bg-emerald-500/5', border: 'border-emerald-500/30', icon: 'text-emerald-400', iconBg: 'bg-emerald-500/10' },
  amber: { bg: 'bg-amber-500/5', border: 'border-amber-500/30', icon: 'text-amber-400', iconBg: 'bg-amber-500/10' },
  cyan: { bg: 'bg-cyan-500/5', border: 'border-cyan-500/30', icon: 'text-cyan-400', iconBg: 'bg-cyan-500/10' },
};

function CellValue({ value, isAutoSpec }: { value: string | boolean; isAutoSpec: boolean }) {
  if (typeof value === 'boolean') {
    return value ? (
      <CheckCircle2 size={20} className="text-green-400 mx-auto" />
    ) : (
      <XCircle size={20} className="text-red-400/60 mx-auto" />
    );
  }
  return (
    <span className={`text-sm ${isAutoSpec ? 'text-blue-300 font-medium' : 'text-white/50'}`}>
      {value}
    </span>
  );
}

export default function CompetitiveSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-sm text-amber-400 mb-4">
            Honest Comparison
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            We Built This Because Nothing Else Worked in Production
          </h2>
          <p className="text-white/60 max-w-3xl mx-auto text-lg">
            AutoSpec isn't a better template. It's a different approach — validated across 263 tickets, 2 production applications, and 20+ sprints of real development.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full min-w-[640px] border-collapse">
              {/* Header */}
              <thead>
                <tr className="bg-slate-800/80">
                  <th className="text-left px-4 py-4 text-white/60 text-sm font-medium w-48">
                    Feature
                  </th>
                  {/* AutoSpec column — highlighted */}
                  <th className="px-4 py-4 text-center border-t-2 border-blue-500 bg-blue-500/5">
                    <div className="text-white font-bold text-sm">AutoSpec</div>
                    <div className="text-blue-400 text-xs mt-0.5">Our Framework</div>
                  </th>
                  <th className="px-4 py-4 text-center text-white/60 text-sm font-medium">
                    SpecKit
                  </th>
                  <th className="px-4 py-4 text-center text-white/60 text-sm font-medium">
                    BMAD
                  </th>
                  <th className="px-4 py-4 text-center text-white/60 text-sm font-medium">
                    OpenSpec
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, index) => (
                  <tr
                    key={row.feature}
                    className={`
                      border-t border-white/5 hover:bg-white/5 transition-colors
                      ${index % 2 === 0 ? 'bg-slate-900/20' : 'bg-transparent'}
                    `}
                  >
                    <td className="px-4 py-4 text-white/80 text-sm font-medium">
                      {row.feature}
                    </td>
                    <td className="px-4 py-4 text-center bg-blue-500/5">
                      <CellValue value={row.autospec} isAutoSpec={true} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <CellValue value={row.speckit} isAutoSpec={false} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <CellValue value={row.bmad} isAutoSpec={false} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <CellValue value={row.openspec} isAutoSpec={false} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Differentiator Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {differentiators.map((item, index) => {
            const colors = colorClasses[item.color];
            // Last two cards (index 3, 4) get centered on lg when they're in a 3-col grid
            const isLastRow = index >= 3;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`
                  ${colors.bg} ${colors.border} border rounded-xl p-6
                  hover:scale-105 transition-transform
                  ${isLastRow ? 'lg:col-start-auto' : ''}
                `}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 ${colors.iconBg} rounded-xl mb-4`}>
                  <item.icon size={24} className={colors.icon} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
