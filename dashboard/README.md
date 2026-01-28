# AutoSpec Dashboard

Real-time monitoring dashboard for Spec-Driven Development (SDD) projects.

## Features

- **Backlog Board** - Kanban-style view of all tickets across sprints
- **Sprint Overview** - Burndown charts, velocity tracking, progress visualization
- **Agent Activity** - Multi-agent execution monitoring with parallelization stats
- **Screen Preview** - Visualize UI wireframes from the UI Designer spec
- **Cost Analysis** - FinOps metrics showing model usage and cost savings
- **Real-time Updates** - WebSocket-based live updates when files change

## Quick Start

### From AutoSpec CLI

```bash
# Navigate to your AutoSpec project
cd your-project

# Launch the dashboard
sdd dashboard
```

### Standalone

```bash
# Install dependencies
cd dashboard
npm install

# Build the dashboard
npm run build

# Start the server (from your project directory)
node /path/to/dashboard/dist/server/index.js /path/to/your/project
```

## Architecture

```
dashboard/
├── src/
│   ├── server/           # Express + WebSocket backend
│   │   ├── index.ts      # Main server entry point
│   │   ├── parsers/      # Markdown file parsers
│   │   │   ├── backlog.ts
│   │   │   ├── sprint.ts
│   │   │   └── specs.ts
│   │   └── watchers/     # File change watchers
│   │       └── fileWatcher.ts
│   ├── client/           # React frontend
│   │   └── src/
│   │       ├── pages/    # Dashboard pages
│   │       ├── components/
│   │       └── hooks/
│   └── types/            # Shared TypeScript types
├── docs/
│   └── markdown-extensions.md
└── bin/
    └── cli.js            # Standalone CLI
```

## Dashboard Pages

### Dashboard (Home)
- Summary statistics (tickets, velocity, completion rate)
- Sprint burndown chart
- Model distribution pie chart
- Recent completions

### Backlog
- Kanban board view with columns: Todo, In Progress, QA Review, Done, Blocked
- List view with filtering and search
- Ticket detail modal

### Sprints
- Sprint selector with progress bars
- Individual sprint view with velocity stats
- Agent sessions and prompts used per sprint

### Agents
- Total agent sessions across all sprints
- Parallelization statistics
- Role distribution chart
- Model usage by agent

### Screens
- Grid of UI screens parsed from 10_ui_designer.md
- ASCII wireframe preview
- Component and state listings
- Related tickets

### Metrics
- Completion rate and velocity
- Cost analysis with savings calculation
- Sprint velocity comparison
- Status and model distribution

## Extended Markdown Formats

The dashboard uses extended markdown formats to capture agent and prompt data. See [docs/markdown-extensions.md](docs/markdown-extensions.md) for details.

### Backlog Extensions
```markdown
| # | Ticket | Status | Owner | Model | Depends | Agent | Started | Completed | Prompt |
|---|--------|--------|-------|-------|---------|-------|---------|-----------|--------|
| 1.1 | Task | ✅ Done | DB | haiku | - | agent-a | 10:30 | 10:45 | a1b2c3 |
```

### Sprint Summary Extensions
```markdown
## Agent Activity

| Agent | Role | Tickets | Start | End | Duration |
|-------|------|---------|-------|-----|----------|
| agent-a | Backend | 1.1, 1.2 | 10:00 | 12:30 | 2.5h |

## Prompt Log

<details>
<summary>Prompt: a1b2c3</summary>
...prompt content...
</details>
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| GET /api/state | Full project state |
| GET /api/sprints | All sprints |
| GET /api/sprints/:id | Single sprint |
| GET /api/sprints/:id/summary | Sprint summary |
| GET /api/tickets | All tickets |
| GET /api/specs | All specs |
| GET /api/specs/:role | Single spec |
| GET /api/screens | All screens |
| GET /api/burndown | Burndown data |
| GET /api/metrics | Project metrics |

## WebSocket Events

Connect to `ws://localhost:3847` for real-time updates.

**Messages:**
- `state` - Full state on initial connection
- `update` - Incremental update when files change

## Development

```bash
# Install dependencies
npm install

# Run development server (server + client hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Configuration

**Environment Variables:**
- `PORT` - Server port (default: 3847)

**Command Line:**
```bash
autospec-dashboard [project-dir] [port]
```

## Requirements

- Node.js 18+
- An AutoSpec project with:
  - `specs/backlog.md` - Required for ticket tracking
  - `specs/10_ui_designer.md` - Optional, for screen visualization
  - `sprints/` directory - Optional, for sprint summaries

## License

MIT
