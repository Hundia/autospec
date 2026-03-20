# AutoSpec Live Demo Guide

For hands-on usage instructions, see **[QUICKSTART.md](./QUICKSTART.md)**.

This guide is for presenting AutoSpec in a demo or talk setting.

---

## Running the Presentation

### Prerequisites
- Node.js 18+
- npm or yarn

### Start Presentation
```bash
cd presentation
npm install
npm run dev
```

Open http://localhost:5173

### Presentation Features
- **11 slides** covering the full methodology
- **Language toggle** (EN/HE) in top-right corner
- **RTL support** for Hebrew
- **Keyboard navigation**: ← → arrows, Space to advance
- **Click navigation**: Dots at bottom or side buttons

---

## Live Demo: ShopFlow E-Commerce

The demo builds a complete e-commerce platform using AutoSpec methodology.

### Demo Flow (matches presentation slide 10)
1. Show requirements.md input
2. Run autospec init (generate specs)
3. Review generated specs
4. Execute Sprint 0 with AI
5. Show working product catalog

### Demo Files Location
All demo prompts are in `demo/` folder:
- `demo/01_requirements.md` - Input SRS reference
- `demo/02_build_team.md` - Generate all 10 specs
- `demo/03_create_backlog.md` - Generate backlog
- `demo/04_sprint_0.md` - Execute foundation sprint
- `demo/05_sprint_1.md` - Execute first feature sprint

---

## Quick Start Commands

### For Claude Code
```
/init-project requirements.md    # Generate all specs
/generate-backlog                 # Create backlog from specs
/run-sprint 0                     # Execute Sprint 0
/sprint-status                    # Check progress
```

### For Manual Execution
Copy prompts from `demo/` folder and paste into your AI assistant.

---

## Step-by-Step Demo Walkthrough

### Step 1: Show Requirements (2 min)
Open `examples/ecommerce/requirements.md` and highlight:
- Project overview
- Core features list
- Technical requirements
- Success metrics

### Step 2: Generate Specs (5 min)
Use the prompt from `demo/02_build_team.md` or run:
```
/init-project examples/ecommerce/requirements.md
```
Show the 10 generated spec files and their structure.

### Step 3: Create Backlog (3 min)
Use the prompt from `demo/03_create_backlog.md` or run:
```
/generate-backlog
```
Show the ticket format, statuses, and story points.

### Step 4: Execute Sprint 0 (10 min)
Use the prompt from `demo/04_sprint_0.md` or run:
```
/run-sprint 0
```
Show code being generated, tests being written, tickets being updated.

### Step 5: Show Results (2 min)
- Open the QA report
- Show test coverage
- Demonstrate working endpoints/UI
