import React, { useState } from 'react'
import { Terminal, Github, MousePointer, Package, ChevronDown, ChevronRight, type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '../components/primitives/Card'
import { Badge } from '../components/primitives/Badge'

interface Provider {
  id: string
  label: string
  icon: LucideIcon
  badge?: string
  bestFor: string
  borderColor: string
  steps: { title: string; code?: string; description?: string }[]
  note?: string
}

const providers: Provider[] = [
  {
    id: 'claude',
    label: 'Claude Code',
    icon: Terminal,
    badge: 'Recommended',
    bestFor: 'developers who use Claude Code CLI',
    borderColor: 'border-sage',
    steps: [
      {
        title: 'Download the QUICKSTART prompt',
        code: 'curl -O https://raw.githubusercontent.com/Hundia/autospec/main/QUICKSTART.md',
      },
      {
        title: 'Add your requirements',
        description: 'Create a requirements/ folder and add your project brief, PRD, or SRS document',
      },
      {
        title: 'Tell Claude to run it',
        code: 'claude "Run @QUICKSTART.md"',
      },
    ],
    note: 'What happens: Claude reads your requirements, generates 10 expert specs, creates a sprint backlog, sets up living docs — all in about 15 minutes.',
  },
  {
    id: 'copilot',
    label: 'GitHub Copilot',
    icon: Github,
    bestFor: 'VS Code users with GitHub Copilot',
    borderColor: 'border-blue-400',
    steps: [
      {
        title: 'Create from template',
        code: 'gh repo create my-project --template Hundia/autospec-starter --clone',
      },
      {
        title: 'Add requirements',
        description: 'Edit requirements/project-brief.md with your project description',
      },
      {
        title: 'Use Copilot Chat',
        description: 'Open VS Code and reference: #file:.github/prompts/create-spec.prompt.md',
      },
    ],
    note: 'The template includes .github/prompts/ with 11 skill prompts pre-configured for Copilot Chat.',
  },
  {
    id: 'cursor',
    label: 'Cursor / Windsurf',
    icon: MousePointer,
    bestFor: 'Cursor or Windsurf users',
    borderColor: 'border-amber-400',
    steps: [
      {
        title: 'Download QUICKSTART',
        code: 'curl -O https://raw.githubusercontent.com/Hundia/autospec/main/QUICKSTART.md',
      },
      {
        title: 'Add requirements',
        description: 'Create a requirements/ folder and add your project brief, PRD, or SRS document',
      },
      {
        title: 'Run in AI chat',
        description: 'Tell your AI: "Run @QUICKSTART.md"',
      },
    ],
  },
  {
    id: 'cli',
    label: 'AutoSpec CLI',
    icon: Package,
    bestFor: 'command-line users who want one-command generation',
    borderColor: 'border-purple-400',
    steps: [
      {
        title: 'Install',
        code: 'npm install -g autospec',
      },
      {
        title: 'Generate',
        code: 'autospec generate requirements.md',
      },
      {
        title: 'Review',
        code: 'autospec status',
      },
    ],
    note: 'Cost: ~$0.20–$0.80 per generation with Claude Sonnet',
  },
]

const faqs = [
  {
    question: 'Do I need an API key?',
    answer:
      'Not if you already have Claude Code or Gemini CLI installed. The CLI piggybacks on your existing authentication. If you don\'t have these, set ANTHROPIC_API_KEY as an environment variable.',
  },
  {
    question: 'What does it cost?',
    answer:
      'With Claude Sonnet, a full generation (10 specs + backlog) costs $0.20–$0.80. With Haiku, under $0.10.',
  },
  {
    question: 'Can I use my own AI tool?',
    answer:
      'Yes! AutoSpec supports Claude Code, GitHub Copilot, Cursor, Windsurf, Aider, and more. The QUICKSTART.md prompt works with any AI coding assistant.',
  },
  {
    question: 'What if generation gets interrupted?',
    answer:
      'The CLI has built-in resume. Just run the same command again — it skips specs that are already up to date.',
  },
]

const whatYouGet = [
  {
    title: '10 Expert Specifications',
    description:
      'Product manager, backend lead, frontend lead, DB architect, QA lead, DevOps lead, marketing, finance, business, UI designer — each one a detailed blueprint.',
  },
  {
    title: 'Sprint Backlog',
    description:
      'Ready-to-execute tickets with estimates, dependencies, and acceptance criteria. Your AI knows exactly what to build next.',
  },
  {
    title: 'Living Documentation',
    description:
      'Architecture docs, API specs, and design decisions that update as you build. Never lose context.',
  },
  {
    title: 'Project Viewer',
    description:
      'A visual dashboard for your entire project. Browse specs, track sprints, share with stakeholders.',
  },
]

export const QuickStartPage: React.FC = () => {
  const [expandedProvider, setExpandedProvider] = useState<string | null>('claude')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="max-w-4xl space-y-10">
      {/* Hero Section */}
      <div>
        <h2 className="text-3xl font-light text-terracotta">Get Started With AutoSpec</h2>
        <p className="text-base text-charcoal mt-2">
          Turn your project requirements into a complete, AI-ready project structure in minutes.
        </p>
        <div className="mt-4 p-4 bg-sand-200 rounded-lg border border-sand">
          <h3 className="text-sm font-semibold text-charcoal mb-1">What is SDD?</h3>
          <p className="text-sm text-sand-600 leading-relaxed">
            Spec-Driven Development means your AI writes structured specifications BEFORE writing code.
            Instead of vague prompts, your AI gets expert-level blueprints for every aspect of your
            project.
          </p>
        </div>
      </div>

      {/* What You Get */}
      <div>
        <h3 className="text-lg font-semibold text-charcoal mb-4">What You Get</h3>
        <div className="grid grid-cols-2 gap-4">
          {whatYouGet.map(item => (
            <Card key={item.title} variant="outlined">
              <CardContent className="py-4">
                <h4 className="text-sm font-semibold text-terracotta mb-1">{item.title}</h4>
                <p className="text-xs text-sand-600 leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Choose Your Path */}
      <div>
        <h3 className="text-lg font-semibold text-charcoal mb-4">Choose Your Path</h3>
        <div className="space-y-3">
          {providers.map(provider => {
            const Icon = provider.icon
            const isOpen = expandedProvider === provider.id
            return (
              <Card
                key={provider.id}
                className={`border-l-4 ${provider.borderColor} cursor-pointer transition-all duration-200`}
                onClick={() => setExpandedProvider(isOpen ? null : provider.id)}
              >
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon size={18} className="text-charcoal" />
                      <span className="text-sm font-semibold text-charcoal">{provider.label}</span>
                      {provider.badge && (
                        <Badge variant="done">{provider.badge}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-sand-600 hidden sm:block">
                        Best for: {provider.bestFor}
                      </span>
                      {isOpen ? (
                        <ChevronDown size={16} className="text-sand-600 flex-shrink-0" />
                      ) : (
                        <ChevronRight size={16} className="text-sand-600 flex-shrink-0" />
                      )}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="mt-4 space-y-3" onClick={e => e.stopPropagation()}>
                      <p className="text-xs text-sand-600">Best for: {provider.bestFor}</p>
                      {provider.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-3">
                          <div className="w-5 h-5 rounded-full bg-sage text-cream text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-charcoal mb-1">{step.title}</div>
                            {step.code && (
                              <code className="block bg-charcoal text-cream text-xs px-3 py-2 rounded font-mono">
                                {step.code}
                              </code>
                            )}
                            {step.description && (
                              <p className="text-xs text-sand-600">{step.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                      {provider.note && (
                        <div className="mt-3 p-3 bg-sand-200 rounded text-xs text-sand-600 border border-sand">
                          {provider.note}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h3 className="text-lg font-semibold text-charcoal mb-4">FAQ</h3>
        <div className="space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <Card
                key={idx}
                variant="outlined"
                className="cursor-pointer"
                onClick={() => setOpenFaq(isOpen ? null : idx)}
              >
                <CardContent className="py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-charcoal">{faq.question}</span>
                    {isOpen ? (
                      <ChevronDown size={16} className="text-sand-600 flex-shrink-0" />
                    ) : (
                      <ChevronRight size={16} className="text-sand-600 flex-shrink-0" />
                    )}
                  </div>
                  {isOpen && (
                    <p className="mt-2 text-xs text-sand-600 leading-relaxed">{faq.answer}</p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
