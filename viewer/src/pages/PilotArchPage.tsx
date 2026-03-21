import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/primitives/Card'
import { Badge } from '../components/primitives/Badge'
import { FlowDiagram } from '../components/diagrams/FlowDiagram'
import { SequenceDiagram } from '../components/diagrams/SequenceDiagram'
import {
  architectureSteps,
  architectureConnections,
  approvalActors,
  approvalMessages,
  approvalActivations,
  lifecycleSteps,
  lifecycleConnections,
  providerMatrix,
} from '../data/pilot'
import type { ProviderRow } from '../data/pilot'

type TabId = 'architecture' | 'approval' | 'lifecycle' | 'providers'

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'architecture', label: 'Architecture', icon: '🏗️' },
  { id: 'approval', label: 'Approval Flow', icon: '🔐' },
  { id: 'lifecycle', label: 'Session Lifecycle', icon: '♻️' },
  { id: 'providers', label: 'Providers', icon: '🤖' },
]

const statusBadge: Record<ProviderRow['status'], { label: string; bg: string; text: string }> = {
  primary: { label: 'Primary', bg: '#698472', text: '#faf9f5' },
  supported: { label: 'Supported', bg: '#dfe8e2', text: '#303b34' },
  experimental: { label: 'Experimental', bg: '#fef3c7', text: '#92400e' },
}

const FeatureCheck: React.FC<{ value: boolean }> = ({ value }) => (
  <span
    className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
    style={{
      background: value ? '#dfe8e2' : '#fee2e2',
      color: value ? '#303b34' : '#991b1b',
    }}
  >
    {value ? '✓' : '✗'}
  </span>
)

export const PilotArchPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('architecture')

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-light text-charcoal">Pilot Architecture</h2>
        <p className="text-sm text-sand-600 mt-1">Resilient session manager with WhatsApp approval — Sprint 33</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4">
        <Card variant="outlined">
          <CardContent className="py-4 flex flex-col items-center text-center">
            <div className="text-2xl font-light text-charcoal mb-1">3</div>
            <div className="text-xs text-sand-600">AI Providers</div>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent className="py-4 flex flex-col items-center text-center">
            <div className="text-2xl font-light text-charcoal mb-1">2s</div>
            <div className="text-xs text-sand-600">Monitor Interval</div>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent className="py-4 flex flex-col items-center text-center">
            <div className="text-2xl font-light text-charcoal mb-1">Unix</div>
            <div className="text-xs text-sand-600">Socket IPC</div>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent className="py-4 flex flex-col items-center text-center">
            <div className="text-2xl font-light text-charcoal mb-1">tmux</div>
            <div className="text-xs text-sand-600">Session Persistence</div>
          </CardContent>
        </Card>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 bg-sand-200 rounded-xl p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-cream shadow-subtle text-charcoal font-medium'
                : 'text-sand-600 hover:text-charcoal hover:bg-cream/50'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab 1: Architecture ── */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Architecture</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-sand-600 mb-4">
                The Pilot daemon bridges CLI commands and AI provider sessions via a Unix socket.
                An approval engine classifies each permission prompt and routes it to WhatsApp
                or auto-approves it based on risk level.
              </p>
              <FlowDiagram
                steps={architectureSteps}
                connections={architectureConnections}
                direction="vertical"
              />
            </CardContent>
          </Card>

          {/* Component descriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {architectureSteps.map(step => (
              <div
                key={step.id}
                className="flex gap-3 p-4 rounded-xl border"
                style={{ borderColor: '#d8d0ba', background: '#faf9f5' }}
              >
                <div
                  className="w-2 flex-shrink-0 rounded-full mt-1"
                  style={{
                    background: step.status === 'active' ? '#698472' : step.status === 'complete' ? '#dfe8e2' : '#d8d0ba',
                    minHeight: '1rem',
                    width: '4px',
                  }}
                />
                <div>
                  <div className="text-sm font-medium text-charcoal">{step.label}</div>
                  {step.description && (
                    <div className="text-xs text-sand-600 mt-0.5">{step.description}</div>
                  )}
                  <div className="mt-1">
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{
                        background: step.type === 'decision' ? '#fef3c7' : step.type === 'parallel' ? '#dfe8e2' : '#f5f3ed',
                        color: step.type === 'decision' ? '#92400e' : '#574b3b',
                        border: '1px solid #d8d0ba',
                      }}
                    >
                      {step.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab 2: Approval Flow ── */}
      {activeTab === 'approval' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Approval Sequence</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-sand-600 mb-4">
                When Claude hits a permission prompt, the daemon detects it via
                <code className="mx-1 px-1 py-0.5 rounded text-xs font-mono" style={{ background: '#e8e4d8' }}>
                  tmux capture-pane
                </code>
                and classifies the risk. Manual approvals are routed to WhatsApp;
                low-risk operations are auto-approved.
              </p>
              <SequenceDiagram
                actors={approvalActors}
                messages={approvalMessages}
                activations={approvalActivations}
              />
            </CardContent>
          </Card>

          {/* Risk classification legend */}
          <Card variant="filled">
            <CardHeader><CardTitle>Risk Classification</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { level: 'Low', color: '#698472', bg: '#dfe8e2', desc: 'Read-only ops, file creation — auto-approved' },
                  { level: 'Medium', color: '#92400e', bg: '#fef3c7', desc: 'File modification, API calls — routed to WhatsApp' },
                  { level: 'High', color: '#991b1b', bg: '#fee2e2', desc: 'Deletions, deployments — always manual approval' },
                ].map(r => (
                  <div
                    key={r.level}
                    className="p-3 rounded-xl border"
                    style={{ borderColor: r.color, background: r.bg }}
                  >
                    <div className="text-sm font-semibold mb-1" style={{ color: r.color }}>{r.level} Risk</div>
                    <div className="text-xs" style={{ color: r.color }}>{r.desc}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Message legend */}
          <Card variant="outlined">
            <CardHeader><CardTitle>Message Types</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { type: 'sync', label: 'Synchronous', desc: 'Caller blocks waiting for response' },
                  { type: 'async', label: 'Asynchronous', desc: 'Fire-and-forget, dashed line' },
                  { type: 'return', label: 'Return', desc: 'Response back to caller' },
                  { type: 'self', label: 'Self-call', desc: 'Internal processing loop' },
                ].map(m => (
                  <div key={m.type} className="text-sm">
                    <span className="font-mono text-xs text-sage">{m.type}</span>
                    <div className="font-medium text-charcoal text-xs mt-0.5">{m.label}</div>
                    <div className="text-sand-600 text-xs">{m.desc}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Tab 3: Session Lifecycle ── */}
      {activeTab === 'lifecycle' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Lifecycle</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-sand-600 mb-4">
                Sessions transition through states as the AI provider runs. The
                <em className="mx-1">Waiting Approval</em>
                state pauses execution until the user responds on WhatsApp.
                Sessions survive SSH disconnects because they run inside tmux.
              </p>
              <FlowDiagram
                steps={lifecycleSteps}
                connections={lifecycleConnections}
                direction="horizontal"
              />
            </CardContent>
          </Card>

          {/* State definitions */}
          <Card>
            <CardHeader><CardTitle>State Definitions</CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sand">
                    <th className="text-left py-2 px-4 text-sand-600 font-medium">State</th>
                    <th className="text-left py-2 px-4 text-sand-600 font-medium">Description</th>
                    <th className="text-left py-2 px-4 text-sand-600 font-medium">Terminal</th>
                    <th className="text-left py-2 px-4 text-sand-600 font-medium">Transitions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { state: 'Launching', desc: 'tmux session created, AI provider starting up', terminal: false, transitions: 'running' },
                    { state: 'Running', desc: 'AI provider actively executing tasks', terminal: false, transitions: 'waiting, completed, error, killed' },
                    { state: 'Waiting Approval', desc: 'Blocked on permission prompt, awaiting user input', terminal: false, transitions: 'running (approved), error (denied)' },
                    { state: 'Completed', desc: 'Task finished successfully', terminal: true, transitions: '—' },
                    { state: 'Error', desc: 'Crashed or permission denied', terminal: true, transitions: '—' },
                    { state: 'Killed', desc: 'Manually terminated by user', terminal: true, transitions: '—' },
                  ].map(row => (
                    <tr key={row.state} className="border-b border-sand/50 hover:bg-sand-200/30">
                      <td className="py-2 px-4 font-medium text-charcoal">
                        <Badge variant="default" size="sm">{row.state}</Badge>
                      </td>
                      <td className="py-2 px-4 text-sand-600">{row.desc}</td>
                      <td className="py-2 px-4 text-center">{row.terminal ? '✅' : '—'}</td>
                      <td className="py-2 px-4 text-xs font-mono text-sand-600">{row.transitions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* tmux resilience note */}
          <Card variant="filled">
            <CardHeader><CardTitle>SSH Resilience via tmux</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-sand-600 mb-3">
                All AI provider processes run inside named tmux sessions. This provides two guarantees:
              </p>
              <div className="space-y-2">
                {[
                  { title: 'Disconnect tolerance', desc: 'If the SSH connection drops, the session keeps running. Reconnect with pilot attach.' },
                  { title: 'Re-attach capability', desc: 'Use pilot attach <session-id> to drop into the live tmux session at any time.' },
                  { title: 'Persistent logs', desc: 'tmux scrollback captures all output. pilot logs <id> reads it non-interactively.' },
                ].map(item => (
                  <div key={item.title} className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-terracotta mt-1.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-charcoal">{item.title}</div>
                      <div className="text-xs text-sand-600">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Tab 4: Providers ── */}
      {activeTab === 'providers' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Provider Compatibility Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-sand-600 mb-4">
                Feature support varies by AI provider. Claude Code has the richest integration
                including session resume and auto-approve. Gemini and Copilot run as generic
                CLI processes with skill injection support.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-sand">
                      <th className="text-left py-3 px-4 text-sand-600 font-medium">Provider</th>
                      <th className="text-center py-3 px-4 text-sand-600 font-medium">Session ID</th>
                      <th className="text-center py-3 px-4 text-sand-600 font-medium">Resume</th>
                      <th className="text-center py-3 px-4 text-sand-600 font-medium">Auto-Approve</th>
                      <th className="text-center py-3 px-4 text-sand-600 font-medium">Skills</th>
                      <th className="text-center py-3 px-4 text-sand-600 font-medium">Model Select</th>
                      <th className="text-left py-3 px-4 text-sand-600 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providerMatrix.map(row => {
                      const badge = statusBadge[row.status]
                      return (
                        <tr key={row.provider} className="border-b border-sand/50 hover:bg-sand-200/30">
                          <td className="py-3 px-4 font-semibold text-charcoal">{row.provider}</td>
                          <td className="py-3 px-4 text-center"><FeatureCheck value={row.sessionId} /></td>
                          <td className="py-3 px-4 text-center"><FeatureCheck value={row.resume} /></td>
                          <td className="py-3 px-4 text-center"><FeatureCheck value={row.autoApprove} /></td>
                          <td className="py-3 px-4 text-center"><FeatureCheck value={row.skills} /></td>
                          <td className="py-3 px-4 text-center"><FeatureCheck value={row.model} /></td>
                          <td className="py-3 px-4">
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{ background: badge.bg, color: badge.text }}
                            >
                              {badge.label}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Feature explanations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { feature: 'Session ID', desc: 'Provider supports --resume / --session-id flags for conversation continuity across restarts.' },
              { feature: 'Resume', desc: 'Pilot can re-attach to an interrupted session and continue from where it left off.' },
              { feature: 'Auto-Approve', desc: 'Provider exposes --dangerously-skip-permissions or equivalent for automated workflows.' },
              { feature: 'Skills', desc: 'Pilot can inject SDD skill files as --allowedTools or context during session launch.' },
              { feature: 'Model Select', desc: 'Provider supports --model flag to specify which underlying LLM to use.' },
            ].map(item => (
              <div
                key={item.feature}
                className="p-4 rounded-xl border"
                style={{ borderColor: '#d8d0ba', background: '#faf9f5' }}
              >
                <div className="text-sm font-semibold text-charcoal mb-1">{item.feature}</div>
                <div className="text-xs text-sand-600">{item.desc}</div>
              </div>
            ))}
          </div>

          {/* Implementation notes */}
          <Card variant="outlined">
            <CardHeader><CardTitle>Implementation Notes</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-sage mt-1.5 flex-shrink-0" style={{ background: '#698472' }} />
                  <div>
                    <span className="font-medium text-charcoal">Claude Code</span>
                    <span className="text-sand-600"> — launched with </span>
                    <code className="font-mono text-xs px-1 py-0.5 rounded" style={{ background: '#e8e4d8' }}>claude --dangerously-skip-permissions</code>
                    <span className="text-sand-600"> for auto-approval mode. Session ID tracked for resume.</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#698472' }} />
                  <div>
                    <span className="font-medium text-charcoal">Gemini CLI</span>
                    <span className="text-sand-600"> — launched as a subprocess. No native session ID; tmux window name used as session handle.</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#698472' }} />
                  <div>
                    <span className="font-medium text-charcoal">GitHub Copilot</span>
                    <span className="text-sand-600"> — experimental. CLI interface not yet stable; permission prompts detected via pattern matching only.</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
