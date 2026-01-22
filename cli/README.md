# AutoSpec CLI

Command-line interface for AutoSpec - AI-powered spec-driven development.

## Installation

### Global Installation (Recommended)

```bash
npm install -g autospec
```

### Using npx

```bash
npx autospec <command>
```

### Local Development

```bash
cd cli
npm install
npm run build
npm link  # Makes 'autospec' available globally
```

## Commands

### `autospec init`

Initialize AutoSpec in a new or existing project.

```bash
autospec init [options]
```

**Options:**

| Option | Description | Default |
|--------|-------------|---------|
| `-n, --name <name>` | Project name | Directory name |
| `-p, --provider <provider>` | AI provider (claude, copilot, gemini, all) | `claude` |
| `-f, --force` | Overwrite existing configuration | `false` |
| `-y, --yes` | Skip prompts, use defaults | `false` |

**Examples:**

```bash
# Interactive initialization
autospec init

# Quick setup with defaults
autospec init -y

# Specify project name and provider
autospec init --name "My App" --provider copilot

# Force reinitialize
autospec init --force
```

**Generated Structure:**

```
project/
  specs/
    01_product_manager.md
    02_backend_lead.md
    03_frontend_lead.md
    04_db_architect.md
    05_qa_lead.md
    06_devops_lead.md
    10_ui_designer.md
    backlog.md
  prompts/
    prompt_sprint0.md
  .claude/commands/        # If provider is claude
    execute-ticket.md
    qa-review.md
    ...
  .github/
    copilot-instructions.md  # If provider is copilot
  .autospecrc.json
```

---

### `autospec status`

Display current sprint status from the backlog.

```bash
autospec status [sprint]
```

**Arguments:**

| Argument | Description | Default |
|----------|-------------|---------|
| `sprint` | Sprint number to show | Active sprint |

**Examples:**

```bash
# Show current sprint status
autospec status

# Show specific sprint
autospec status 3
```

**Output Example:**

```
  Sprint 3: User Authentication

  Progress: [████████░░░░░░░░] 45% (5/11 tickets)

  Status Breakdown:
    ✅ Done:        5 tickets
    🔄 In Progress: 2 tickets
    🔲 Todo:        4 tickets

  Tickets:
    3.1  ✅ Create users table migration
    3.2  ✅ Implement auth service
    3.3  🔄 Build login form
    3.4  🔄 Add session management
    3.5  🔲 Create registration flow
    ...
```

---

### `autospec sprint <number>`

Generate a sprint execution prompt for AI assistants.

```bash
autospec sprint <number> [options]
```

**Arguments:**

| Argument | Description |
|----------|-------------|
| `number` | Sprint number (required) |

**Options:**

| Option | Description | Default |
|--------|-------------|---------|
| `-o, --output <path>` | Output file path | `prompts/prompt_sprint<N>.md` |

**Examples:**

```bash
# Generate Sprint 1 prompt
autospec sprint 1

# Save to custom location
autospec sprint 2 --output ./my-prompts/sprint2.md
```

**Generated Prompt Includes:**

- Sprint context and goals
- Ticket list with dependencies
- Relevant spec references
- Model recommendations per ticket
- Multi-agent assignment (if applicable)

---

### `autospec spec <name>`

Generate a new feature specification.

```bash
autospec spec <name> [options]
```

**Arguments:**

| Argument | Description |
|----------|-------------|
| `name` | Feature name (required) |

**Options:**

| Option | Description | Default |
|--------|-------------|---------|
| `-d, --description <text>` | Brief description | None |
| `-i, --interactive` | Interactive mode | `false` |

**Examples:**

```bash
# Generate spec for a feature
autospec spec user-notifications

# With description
autospec spec payment-processing --description "Stripe integration for subscriptions"

# Interactive mode
autospec spec search --interactive
```

**Generated Files:**

- `specs/features/<name>/overview.md`
- `specs/features/<name>/requirements.md`
- Backlog entries (if interactive)

---

## Configuration

AutoSpec uses `.autospecrc.json` for project configuration:

```json
{
  "project": {
    "name": "My App",
    "description": "A web application",
    "type": "fullstack"
  },
  "provider": "claude",
  "paths": {
    "specs": "specs",
    "prompts": "prompts",
    "backlog": "specs/backlog.md"
  },
  "models": {
    "simple": "haiku",
    "standard": "sonnet",
    "complex": "opus"
  },
  "multiAgent": {
    "enabled": true,
    "agents": ["backend", "frontend"]
  }
}
```

### Configuration Options

| Key | Type | Description |
|-----|------|-------------|
| `project.name` | string | Project name |
| `project.description` | string | Project description |
| `project.type` | string | Project type (web, mobile, api, etc.) |
| `provider` | string | AI provider (claude, copilot, gemini) |
| `paths.specs` | string | Specs directory path |
| `paths.prompts` | string | Prompts directory path |
| `paths.backlog` | string | Backlog file path |
| `models.*` | string | Model tier assignments |
| `multiAgent.enabled` | boolean | Enable multi-agent mode |
| `multiAgent.agents` | string[] | Agent role names |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `AUTOSPEC_CONFIG` | Custom config file path |
| `AUTOSPEC_DEBUG` | Enable debug logging |
| `NO_COLOR` | Disable colored output |

---

## Exit Codes

| Code | Description |
|------|-------------|
| `0` | Success |
| `1` | General error |
| `2` | Configuration error |
| `3` | File not found |

---

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test                # Run tests
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage
```

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

---

## Troubleshooting

### "Backlog not found"

Ensure you have initialized AutoSpec in the project:

```bash
autospec init
```

### "Invalid sprint number"

Sprint numbers must be integers matching sprints defined in your backlog.

### "Permission denied"

On Unix systems, you may need to make the CLI executable:

```bash
chmod +x ./node_modules/.bin/autospec
```

### Debug Mode

Enable verbose logging:

```bash
AUTOSPEC_DEBUG=1 autospec status
```

---

## Related Documentation

- [Main README](../README.md)
- [Contributing Guide](../CONTRIBUTING.md)
- [Changelog](../CHANGELOG.md)
- [Methodology Docs](../docs/methodology/)

---

## License

MIT - see [LICENSE](../LICENSE) for details.
