import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ArrowRight, Terminal, Github } from 'lucide-react';

// Terminal animation data
interface TerminalScene {
  prompt: string;
  lines: { text: string; color: string }[];
  pauseAfter: number;
}

const SCENES: TerminalScene[] = [
  {
    prompt: 'npx autospec init',
    lines: [
      { text: '', color: '' },
      { text: '  AutoSpec v1.0 — Initializing project...', color: 'text-blue-400' },
      { text: '', color: '' },
      { text: '  [1/4] Creating specs directory...', color: 'text-white/60' },
      { text: '    ✓ specs/01_product_manager.md', color: 'text-green-400' },
      { text: '    ✓ specs/02_architect.md', color: 'text-green-400' },
      { text: '    ✓ specs/03_design_system.md', color: 'text-green-400' },
      { text: '    ✓ specs/04_frontend_architect.md', color: 'text-green-400' },
      { text: '    ✓ specs/05_backend_architect.md', color: 'text-green-400' },
      { text: '    ✓ specs/06_database_architect.md', color: 'text-green-400' },
      { text: '    ✓ specs/07_qa_engineer.md', color: 'text-green-400' },
      { text: '    ✓ specs/08_devops.md', color: 'text-green-400' },
      { text: '    ✓ specs/09_security_auditor.md', color: 'text-green-400' },
      { text: '    ✓ specs/10_technical_writer.md', color: 'text-green-400' },
      { text: '', color: '' },
      { text: '  [2/4] Creating sprint backlog...', color: 'text-white/60' },
      { text: '    ✓ specs/backlog.md', color: 'text-green-400' },
      { text: '', color: '' },
      { text: '  [3/4] Creating CLAUDE.md memory file...', color: 'text-white/60' },
      { text: '    ✓ CLAUDE.md configured', color: 'text-green-400' },
      { text: '', color: '' },
      { text: '  [4/4] Configuring model routing...', color: 'text-white/60' },
      { text: '    ✓ .autospec/finops.yml', color: 'text-green-400' },
      { text: '', color: '' },
      { text: '  ✅ AutoSpec initialized. 10 roles. 1 backlog. 0 ambiguity.', color: 'text-emerald-400' },
    ],
    pauseAfter: 2500,
  },
  {
    prompt: 'autospec build-team',
    lines: [
      { text: '', color: '' },
      { text: '  Generating specs from 10 perspectives...', color: 'text-blue-400' },
      { text: '', color: '' },
      { text: '  ✓ product_manager.md      (Vision & Stories)', color: 'text-green-400' },
      { text: '  ✓ backend_lead.md         (API & Services)', color: 'text-green-400' },
      { text: '  ✓ frontend_lead.md        (Components & UX)', color: 'text-green-400' },
      { text: '  ✓ database_architect.md   (Schema & Migrations)', color: 'text-green-400' },
      { text: '  ✓ qa_lead.md              (Testing Strategy)', color: 'text-green-400' },
      { text: '  ✓ devops_lead.md          (Infrastructure)', color: 'text-green-400' },
      { text: '  ✓ marketing_lead.md       (Go-to-Market)', color: 'text-green-400' },
      { text: '  ✓ finance_lead.md         (Pricing & Economics)', color: 'text-green-400' },
      { text: '  ✓ business_lead.md        (Strategy)', color: 'text-green-400' },
      { text: '  ✓ ui_designer.md          (Screens & Wireframes)', color: 'text-green-400' },
      { text: '', color: '' },
      { text: '  Generated 10 specs with 8,500+ lines of docs.', color: 'text-purple-400' },
    ],
    pauseAfter: 2000,
  },
  {
    prompt: 'autospec sprint 0',
    lines: [
      { text: '', color: '' },
      { text: '  Sprint 0: Foundation Setup', color: 'text-cyan-400' },
      { text: '  ═══════════════════════════', color: 'text-cyan-400/50' },
      { text: '', color: '' },
      { text: '  12 tickets generated | Est: 4-6 hours', color: 'text-white/60' },
      { text: '  ✓ Prompt generated: prompts/sprint-0.md', color: 'text-green-400' },
      { text: '', color: '' },
      { text: '  Ready to ship. Paste prompt into your AI →', color: 'text-emerald-400' },
    ],
    pauseAfter: 2500,
  },
];

const CHAR_DELAY = 45;
const LINE_DELAY = 80;

type Phase = 'typing' | 'outputting' | 'paused';

interface HistoryScene {
  prompt: string;
  lines: { text: string; color: string }[];
}

function useTerminalAnimation() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [phase, setPhase] = useState<Phase>('typing');
  const [history, setHistory] = useState<HistoryScene[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    clearTimer();

    const currentScene = SCENES[sceneIndex];

    if (phase === 'typing') {
      const promptLength = currentScene.prompt.length;
      if (typedChars < promptLength) {
        timeoutRef.current = setTimeout(() => {
          setTypedChars((c) => c + 1);
        }, CHAR_DELAY);
      } else {
        // Pause 300ms then start outputting
        timeoutRef.current = setTimeout(() => {
          setPhase('outputting');
        }, 300);
      }
    } else if (phase === 'outputting') {
      const totalLines = currentScene.lines.length;
      if (visibleLines < totalLines) {
        timeoutRef.current = setTimeout(() => {
          setVisibleLines((l) => l + 1);
        }, LINE_DELAY);
      } else {
        // All lines shown — pause
        timeoutRef.current = setTimeout(() => {
          setPhase('paused');
        }, currentScene.pauseAfter);
      }
    } else if (phase === 'paused') {
      const isLastScene = sceneIndex === SCENES.length - 1;

      if (isLastScene) {
        // After last scene, wait 3s, clear history, restart
        timeoutRef.current = setTimeout(() => {
          setHistory([]);
          setSceneIndex(0);
          setTypedChars(0);
          setVisibleLines(0);
          setPhase('typing');
        }, 3000);
      } else {
        // Move current scene to history, advance to next
        setHistory((h) => [
          ...h,
          {
            prompt: currentScene.prompt,
            lines: currentScene.lines,
          },
        ]);
        setSceneIndex((i) => i + 1);
        setTypedChars(0);
        setVisibleLines(0);
        setPhase('typing');
      }
    }

    return clearTimer;
  }, [phase, typedChars, visibleLines, sceneIndex]);

  return {
    sceneIndex,
    typedChars,
    visibleLines,
    phase,
    history,
    currentScene: SCENES[sceneIndex],
  };
}

export default function HeroSection() {
  const [copied, setCopied] = useState(false);
  const installCommand = 'npx autospec init';
  const terminal = useTerminalAnimation();
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [terminal.visibleLines, terminal.sceneIndex, terminal.history.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                </span>
                Open Source Framework
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                Make AI Think
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Before It Codes
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl sm:text-2xl text-white/60 max-w-xl mb-8"
            >
              Specifications are the memory that AI was never given.{' '}
              <span className="text-white font-medium">AutoSpec turns requirements into running code</span>{' '}
              — with structure, not luck.
            </motion.p>

            {/* Install Command */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-white/10 rounded-xl p-2 backdrop-blur-sm">
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-900/80 rounded-lg">
                  <Terminal size={18} className="text-white/40" />
                  <code className="text-sm sm:text-base font-mono text-white/90">
                    {installCommand}
                  </code>
                </div>
                <button
                  onClick={handleCopy}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  aria-label="Copy command"
                >
                  {copied ? (
                    <Check size={18} className="text-green-400" />
                  ) : (
                    <Copy size={18} className="text-white/40 hover:text-white/60" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-start gap-4 mb-12"
            >
              <a
                href="#quickstart"
                className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
              >
                Get Started
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="https://github.com/Hundia/autospec"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium rounded-xl transition-all"
              >
                <Github size={18} />
                Star on GitHub
              </a>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap items-center gap-6 text-sm text-white/40"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">25+</span>
                <span>Sprints Completed</span>
              </div>
              <div className="w-px h-6 bg-white/20 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">263</span>
                <span>Tickets Executed</span>
              </div>
              <div className="w-px h-6 bg-white/20 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">~60%</span>
                <span>Cost Savings</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Animated Terminal */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            {/* Glow behind terminal */}
            <div className="absolute inset-0 -m-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-2xl" />

            {/* Terminal Window */}
            <div className="relative bg-slate-950 rounded-xl border border-white/10 shadow-2xl overflow-hidden">
              {/* macOS Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-900/80 border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 flex justify-center">
                  <span className="text-xs text-white/40 font-mono">~/my-project</span>
                </div>
              </div>

              {/* Terminal Body */}
              <div
                ref={terminalBodyRef}
                className="h-[360px] lg:h-[420px] overflow-hidden font-mono text-sm p-4 space-y-0"
              >
                {/* History */}
                {terminal.history.map((scene, hIdx) => (
                  <div key={hIdx} className="mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">$</span>
                      <span className="text-white">{scene.prompt}</span>
                    </div>
                    {scene.lines.map((line, lIdx) => (
                      <div key={lIdx} className={`${line.color || 'text-white/60'} leading-5`}>
                        {line.text || '\u00A0'}
                      </div>
                    ))}
                  </div>
                ))}

                {/* Current scene */}
                <div>
                  {/* Prompt line with typewriter */}
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">$</span>
                    <span className="text-white">
                      {terminal.currentScene.prompt.slice(0, terminal.typedChars)}
                    </span>
                    {terminal.phase === 'typing' && (
                      <span className="inline-block w-2 h-4 bg-white/80 animate-pulse" />
                    )}
                  </div>

                  {/* Output lines */}
                  {terminal.currentScene.lines.slice(0, terminal.visibleLines).map((line, lIdx) => (
                    <div key={lIdx} className={`${line.color || 'text-white/60'} leading-5`}>
                      {line.text || '\u00A0'}
                    </div>
                  ))}

                  {/* Cursor after output done */}
                  {terminal.phase === 'paused' && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-green-400">$</span>
                      <span className="inline-block w-2 h-4 bg-white/80 animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
