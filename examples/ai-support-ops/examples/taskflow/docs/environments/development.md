# TaskFlow Development Environment Setup

## Overview

This guide covers setting up a local development environment for TaskFlow, including all prerequisites, installation steps, and configuration.

---

## Prerequisites

### Required Software

| Software | Version | Purpose | Installation |
|----------|---------|---------|--------------|
| Node.js | 20.x LTS | JavaScript runtime | [nodejs.org](https://nodejs.org) |
| npm | 10.x | Package manager | Included with Node.js |
| PostgreSQL | 15.x | Database | [postgresql.org](https://www.postgresql.org) |
| Git | 2.x | Version control | [git-scm.com](https://git-scm.com) |
| Docker | 24.x | Containerization (optional) | [docker.com](https://www.docker.com) |

### System Requirements

```
Minimum Requirements:
- CPU: 2 cores
- RAM: 8 GB
- Disk: 10 GB free space
- OS: macOS 12+, Windows 10+, Ubuntu 20.04+

Recommended:
- CPU: 4+ cores
- RAM: 16 GB
- Disk: 20 GB SSD
- OS: macOS 14+, Ubuntu 22.04+
```

---

## Installation Steps

### Step 1: Install Node.js

```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc  # or ~/.zshrc
nvm install 20
nvm use 20
nvm alias default 20

# Verify installation
node --version  # Should print v20.x.x
npm --version   # Should print 10.x.x
```

### Step 2: Install PostgreSQL

```bash
# macOS (using Homebrew)
brew install postgresql@15
brew services start postgresql@15

# Ubuntu
sudo apt update
sudo apt install postgresql-15 postgresql-contrib-15
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Windows (using Chocolatey)
choco install postgresql15

# Verify installation
psql --version  # Should print psql 15.x
```

### Step 3: Clone Repository

```bash
# Clone the repository
git clone https://github.com/your-org/taskflow.git
cd taskflow

# Verify repository structure
ls -la
# Should show: package.json, src/, prisma/, etc.
```

### Step 4: Install Dependencies

```bash
# Install all dependencies
npm install

# This installs:
# - Backend dependencies (Express, Prisma, etc.)
# - Frontend dependencies (React, Vite, etc.)
# - Development tools (ESLint, Vitest, etc.)
```

---

## Database Setup

### Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create development database
CREATE DATABASE taskflow_dev;

# Create test database
CREATE DATABASE taskflow_test;

# Create user (optional, for non-superuser)
CREATE USER taskflow_user WITH PASSWORD 'taskflow_pass';
GRANT ALL PRIVILEGES ON DATABASE taskflow_dev TO taskflow_user;
GRANT ALL PRIVILEGES ON DATABASE taskflow_test TO taskflow_user;

# Exit psql
\q
```

### Database Connection

```mermaid
flowchart LR
    APP[TaskFlow App] --> PRISMA[Prisma Client]
    PRISMA --> DB[(PostgreSQL)]

    subgraph Connection
        DB --> DEV[taskflow_dev]
        DB --> TEST[taskflow_test]
    end
```

### Run Migrations

```bash
# Apply migrations to development database
npx prisma migrate dev

# This will:
# 1. Create all tables
# 2. Set up indexes
# 3. Generate Prisma Client

# Seed initial data (if available)
npx prisma db seed
```

---

## Environment Configuration

### Create Environment File

```bash
# Copy example environment file
cp .env.example .env

# Edit with your local settings
nano .env  # or use your preferred editor
```

### Environment Variables

```bash
# .env - Development Environment

# ─────────────────────────────────────────────
# Application
# ─────────────────────────────────────────────
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# ─────────────────────────────────────────────
# Database
# ─────────────────────────────────────────────
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskflow_dev"

# ─────────────────────────────────────────────
# Authentication
# ─────────────────────────────────────────────
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=30d

# ─────────────────────────────────────────────
# Email (optional for development)
# ─────────────────────────────────────────────
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=noreply@taskflow.local

# ─────────────────────────────────────────────
# Logging
# ─────────────────────────────────────────────
LOG_LEVEL=debug
LOG_FORMAT=pretty
```

### Environment Validation

```bash
# Verify environment is configured
npm run env:check

# Expected output:
# ✓ NODE_ENV is set
# ✓ DATABASE_URL is valid
# ✓ JWT_SECRET is set
# ✓ All required variables present
```

---

## Running the Application

### Development Mode

```mermaid
flowchart LR
    subgraph Dev["Development Servers"]
        VITE[Vite Dev Server<br/>:3000]
        EXPRESS[Express Server<br/>:3001]
    end

    BROWSER[Browser] --> VITE
    VITE -->|API Proxy| EXPRESS
    EXPRESS --> DB[(PostgreSQL<br/>:5432)]
```

### Start Commands

```bash
# Terminal 1: Start backend
npm run dev:backend
# Server running at http://localhost:3001

# Terminal 2: Start frontend
npm run dev:frontend
# App running at http://localhost:3000

# Or run both concurrently
npm run dev
# Backend: http://localhost:3001
# Frontend: http://localhost:3000
```

### Verify Setup

```bash
# Check backend health
curl http://localhost:3001/health
# Expected: {"status":"ok","timestamp":"..."}

# Check API
curl http://localhost:3001/api/v1/status
# Expected: {"version":"1.0.0","environment":"development"}

# Open frontend in browser
open http://localhost:3000  # macOS
xdg-open http://localhost:3000  # Linux
start http://localhost:3000  # Windows
```

---

## Development Tools

### VS Code Extensions

```json
// .vscode/extensions.json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "prisma.prisma",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### VS Code Settings

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

### Debugging Configuration

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev:backend:debug"],
      "port": 9229,
      "console": "integratedTerminal"
    },
    {
      "name": "Debug Tests",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "test:debug"],
      "port": 9229,
      "console": "integratedTerminal"
    }
  ]
}
```

---

## Common Commands

### Development

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all services |
| `npm run dev:backend` | Start backend only |
| `npm run dev:frontend` | Start frontend only |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

### Database

| Command | Description |
|---------|-------------|
| `npx prisma migrate dev` | Run migrations |
| `npx prisma migrate reset` | Reset database |
| `npx prisma studio` | Open database GUI |
| `npx prisma db seed` | Seed database |
| `npx prisma generate` | Regenerate client |

### Testing

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:unit` | Run unit tests |
| `npm run test:integration` | Run integration tests |
| `npm run test:e2e` | Run E2E tests |
| `npm run test:coverage` | Generate coverage report |

### Code Quality

| Command | Description |
|---------|-------------|
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix linting issues |
| `npm run format` | Run Prettier |
| `npm run typecheck` | Check TypeScript |

---

## Troubleshooting

### Common Issues

```markdown
## Issue: Port Already in Use

Error: EADDRINUSE: address already in use :::3001

Solution:
```bash
# Find process using port
lsof -i :3001
# Kill process
kill -9 <PID>
# Or use different port
PORT=3002 npm run dev:backend
```

---

## Issue: Database Connection Failed

Error: P1001: Can't reach database server

Solution:
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Start PostgreSQL if stopped
brew services start postgresql@15  # macOS
sudo systemctl start postgresql    # Linux

# Verify connection
psql -U postgres -d taskflow_dev -c "SELECT 1"
```

---

## Issue: Node Module Errors

Error: Module not found

Solution:
```bash
# Clear cache and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

---

## Issue: Prisma Client Outdated

Error: PrismaClient not generated

Solution:
```bash
npx prisma generate
# Restart development server
```
```

---

## Next Steps

After setup is complete:

1. **Create a test account**: Register at http://localhost:3000/register
2. **Explore the API**: Open http://localhost:3001/api-docs
3. **Run tests**: `npm test` to verify everything works
4. **Start coding**: Create a feature branch and start developing

---

## Related Documents

- [Docker Setup](./docker.md)
- [Environment Variables](./environment-variables.md)
- [Development Workflow](../workflows/development.md)
