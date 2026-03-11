# Agent Capability Profiles

**Sprint:** 6
**Status:** Planned
**Subsystem:** `cli/src/agents/`

## Overview

AutoSpec adapts its generation behavior based on which AI coding agent is executing. Each agent has a capability profile defining context limits, output capacity, supported features, and optimal chunk strategy. The system auto-detects the active agent and applies the appropriate profile.

## Agent Registry

Six built-in profiles ship with AutoSpec:

| Agent | Context | Output | Chunk Strategy | Key Feature |
|-------|---------|--------|---------------|-------------|
| Claude Code | 200K | ~16K/turn | single/phase | Native subagents, resume, stream-json |
| Gemini CLI | 1M+ | 64K+ | single | Massive context, GEMINI.md injection |
| GitHub Copilot | ~32K | ~3K | micro | Most conservative, smallest chunks |
| OpenCode | Varies | Varies | phase | Provider-dependent, @general subagent |
| Cline | ~200K | Varies | phase | VS Code native, model-agnostic |
| Continue | ~128K | Varies | phase | Open-source, custom rules + prompts |

## Profile Schema

```typescript
interface AgentProfile {
  id: string                    // 'claude' | 'gemini' | 'copilot' | ...
  displayName: string           // Human-readable name
  maxContextTokens: number      // Effective context window
  maxOutputTokens: number       // Single-response output limit
  chunkStrategy: ChunkStrategy  // 'single' | 'phase' | 'micro'
  supportsSubagents: boolean    // Can spawn parallel sub-tasks
  supportsResume: boolean       // Native session resume
  supportsStreaming: boolean    // Stream-json parsing
  sessionIsolation: 'native' | 'manual'
  promptMethod: 'flag' | 'file' // -p flag vs context file
  contextFile?: string          // e.g., 'GEMINI.md' for Gemini
}
```

## Chunk Strategies

| Strategy | When | Behavior |
|----------|------|----------|
| `single` | Agent can handle full output (>30K) | All generators run as one session |
| `phase` | Mid-range agents (8-16K output) | Each phase = separate session |
| `micro` | Constrained agents (<4K output) | Phases split into sub-chunks |

## Auto-Detection

The registry detects the active agent by checking environment signals:

| Signal | Agent |
|--------|-------|
| `CLAUDE_CODE` env var | Claude Code |
| `GITHUB_COPILOT` env var | GitHub Copilot |
| `GEMINI_API_KEY` env var | Gemini CLI |
| `CLINE_*` env pattern | Cline |
| `CONTINUE_*` env pattern | Continue |
| None matched | Falls back to conservative defaults |

When no agent is detected, the system uses a Copilot-like conservative profile (32K context, micro chunks) to ensure generation completes safely.

## User Overrides

Users can override auto-detection via CLI flag or config:

```bash
# CLI flag (one-time)
autospec generate --agent gemini

# Config (persistent)
# .autospecrc.json
{
  "agent": "claude",
  "agentProfileOverrides": {
    "maxOutputTokens": 20000,
    "chunkStrategy": "single"
  }
}
```

## Graceful Degradation

For unknown/custom agents:

1. Default to most conservative profile
2. On first successful run, measure actual output capacity
3. Cache observed capacity in state directory
4. Progressively optimize chunk sizes
5. Log warnings if output appears truncated

## Files

| File | Purpose |
|------|---------|
| `cli/src/types/agents.ts` | AgentProfile interface, ChunkStrategy type |
| `cli/src/agents/registry.ts` | Profile registry, auto-detection, lookup |
| `cli/src/agents/profiles/claude.ts` | Claude Code profile |
| `cli/src/agents/profiles/copilot.ts` | GitHub Copilot profile |
| `cli/src/agents/profiles/gemini.ts` | Gemini CLI profile |
| `cli/src/agents/profiles/cline.ts` | Cline profile |
| `cli/src/agents/profiles/continue.ts` | Continue profile |
| `cli/src/agents/profiles/windsurf.ts` | Windsurf profile |
| `cli/src/utils/detect-agent.ts` | Environment-based agent detection |
