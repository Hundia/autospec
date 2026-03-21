import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Check,
  FileText,
  ListChecks,
  BookOpen,
  Monitor,
  Terminal,
  Github,
  MousePointer,
  Package,
  type LucideIcon,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Step {
  title: string;
  description: string;
}

interface Provider {
  id: string;
  label: string;
  icon: LucideIcon;
  accent: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  steps: Step[];
  code: string;
  codeLabel: string;
  extra?: React.ReactNode;
}

// ─── Value Pills ──────────────────────────────────────────────────────────────

const valuePills: { icon: LucideIcon; label: string }[] = [
  { icon: FileText, label: '10 Expert Specs' },
  { icon: ListChecks, label: 'Sprint Backlog' },
  { icon: BookOpen, label: 'Living Docs' },
  { icon: Monitor, label: 'Project Viewer' },
];

// ─── Provider Data ────────────────────────────────────────────────────────────

const providers: Provider[] = [
  {
    id: 'claude',
    label: 'Claude Code',
    icon: Terminal,
    accent: 'orange',
    accentBg: 'bg-orange-500/10',
    accentBorder: 'border-orange-500/40',
    accentText: 'text-orange-400',
    steps: [
      {
        title: 'Add your requirements',
        description: 'Place your SRS, PRD, or project brief in a requirements/ folder',
      },
      {
        title: 'Run AutoSpec',
        description: 'Tell Claude Code to run the QUICKSTART',
      },
      {
        title: 'Start building',
        description: 'Your AI now has 10 expert specs, a sprint backlog, and living docs. Run: autospec status',
      },
    ],
    code: 'curl -O https://raw.githubusercontent.com/Hundia/autospec/main/QUICKSTART.md && claude "Run @QUICKSTART.md"',
    codeLabel: 'Copy Command',
  },
  {
    id: 'copilot',
    label: 'GitHub Copilot',
    icon: Github,
    accent: 'blue',
    accentBg: 'bg-blue-500/10',
    accentBorder: 'border-blue-500/40',
    accentText: 'text-blue-400',
    steps: [
      {
        title: 'Get the template',
        description: 'Create a new repo from the AutoSpec starter template',
      },
      {
        title: 'Add your requirements',
        description: 'Place your project brief in requirements/project-brief.md',
      },
      {
        title: 'Run in Copilot Chat',
        description: 'Open VS Code, then in Copilot Chat: #file:.github/prompts/create-spec.prompt.md',
      },
    ],
    code: 'gh repo create my-project --template Hundia/autospec-starter --clone',
    codeLabel: 'Copy Command',
  },
  {
    id: 'cursor',
    label: 'Cursor / Windsurf',
    icon: MousePointer,
    accent: 'green',
    accentBg: 'bg-green-500/10',
    accentBorder: 'border-green-500/40',
    accentText: 'text-green-400',
    steps: [
      {
        title: 'Download AutoSpec',
        description: 'Fetch the QUICKSTART prompt into your project root',
      },
      {
        title: 'Add your requirements',
        description: 'Place your project brief in requirements/',
      },
      {
        title: 'Run in chat',
        description: 'Tell your AI: "Run @QUICKSTART.md"',
      },
    ],
    code: 'curl -O https://raw.githubusercontent.com/Hundia/autospec/main/QUICKSTART.md',
    codeLabel: 'Copy Command',
  },
  {
    id: 'cli',
    label: 'CLI Tool',
    icon: Package,
    accent: 'purple',
    accentBg: 'bg-purple-500/10',
    accentBorder: 'border-purple-500/40',
    accentText: 'text-purple-400',
    steps: [
      {
        title: 'Install AutoSpec CLI',
        description: 'Install globally via npm',
      },
      {
        title: 'Generate specs from your requirements',
        description: 'Point the CLI at your brief. Estimated cost: $0.20–$0.80 with Sonnet',
      },
      {
        title: 'Review and iterate',
        description: 'Use autospec status and autospec doctor to inspect and refine',
      },
    ],
    code: 'npm install -g autospec && autospec generate requirements.md',
    codeLabel: 'Copy Command',
    extra: (
      <div className="mt-4 bg-slate-950 rounded-lg p-4 font-mono text-xs text-white/50 leading-relaxed">
        <span className="text-purple-400">$</span> autospec doctor{'\n'}
        <span className="text-white/30">{'  '}LLM Providers:</span>{'\n'}
        <span className="text-green-400">{'    '}✓ Claude Code      authenticated</span>{'\n'}
        <span className="text-white/30">{'    '}✗ Anthropic API    ANTHROPIC_API_KEY not set</span>
      </div>
    ),
  },
];

// ─── Copy Hook ────────────────────────────────────────────────────────────────

function useCopyToClipboard() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return { copiedId, copy };
}

// ─── Tab Content ──────────────────────────────────────────────────────────────

interface TabContentProps {
  provider: Provider;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
}

function TabContent({ provider, copiedId, onCopy }: TabContentProps) {
  const isCopied = copiedId === provider.id;

  return (
    <motion.div
      key={provider.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="mt-6"
    >
      <div className={`bg-slate-900/70 border ${provider.accentBorder} rounded-2xl p-6 sm:p-8`}>
        {/* Steps */}
        <div className="space-y-5 mb-6">
          {provider.steps.map((step, idx) => (
            <div key={idx} className="flex gap-4">
              {/* Step number */}
              <div className={`flex-shrink-0 w-7 h-7 rounded-full ${provider.accentBg} border ${provider.accentBorder} flex items-center justify-center`}>
                <span className={`text-xs font-bold ${provider.accentText}`}>{idx + 1}</span>
              </div>
              {/* Step content */}
              <div className="pt-0.5">
                <p className="text-white text-sm font-semibold mb-0.5">Step {idx + 1}: {step.title}</p>
                <p className="text-white/55 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Code block */}
        <div className="relative">
          <div className="bg-slate-950 rounded-xl p-4 pr-28 font-mono text-sm text-white/75 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
            {provider.code}
          </div>
          <button
            onClick={() => onCopy(provider.code, provider.id)}
            className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg text-xs text-white/60 hover:text-white transition-all"
          >
            {isCopied ? (
              <>
                <Check size={12} className="text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>{provider.codeLabel}</span>
              </>
            )}
          </button>
        </div>

        {/* Extra content (e.g. CLI doctor preview) */}
        {provider.extra && provider.extra}
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function QuickStartSection() {
  const [activeTab, setActiveTab] = useState('claude');
  const { copiedId, copy } = useCopyToClipboard();

  const activeProvider = providers.find((p) => p.id === activeTab) ?? providers[0];

  return (
    <section
      id="quickstart"
      data-testid="quickstart-section"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950"
    >
      <div className="max-w-4xl mx-auto">

        {/* ── Header (ticket 29.12) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-sm text-green-400 mb-4">
            Get Started
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Get Started With Your AI
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            Pick your tool. Follow 3 steps. Get a complete project structure.
          </p>
        </motion.div>

        {/* ── Value Strip (ticket 29.10) ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {valuePills.map((pill, idx) => (
            <motion.div
              key={pill.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.1 + idx * 0.07 }}
              className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2"
            >
              <pill.icon size={14} className="text-white/50 flex-shrink-0" />
              <span className="text-sm text-white/70 whitespace-nowrap">{pill.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Provider Tab Selector (ticket 29.9) ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.15 }}
        >
          {/* Tab row — horizontal scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {providers.map((provider) => {
              const isActive = activeTab === provider.id;
              return (
                <button
                  key={provider.id}
                  onClick={() => setActiveTab(provider.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all whitespace-nowrap flex-shrink-0
                    ${isActive
                      ? `${provider.accentBg} ${provider.accentBorder} ${provider.accentText}`
                      : 'bg-slate-800/50 border-slate-700 text-white/60 hover:text-white/80 hover:bg-slate-800'
                    }
                  `}
                >
                  <provider.icon size={15} />
                  {provider.label}
                </button>
              );
            })}
          </div>

          {/* ── Tab Content Panel (ticket 29.9 + 29.11) ── */}
          <AnimatePresence mode="wait">
            <TabContent
              key={activeTab}
              provider={activeProvider}
              copiedId={copiedId}
              onCopy={copy}
            />
          </AnimatePresence>

          {/* ── Provider Hint ── */}
          <p className="text-center text-white/40 text-xs mt-5">
            Not sure which tool? If you have Claude Code installed, start there.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
