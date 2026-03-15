# MealMap Live Demo Script

**Presenter:** Eli Hundia
**Tool:** VSCode + GitHub Copilot (GPT 5.4)
**Duration:** ~15 minutes
**URL:** https://hundia.github.io/autospec/#/presentation

---

## Pre-Demo Checklist

Run through these before going on stage:

- [ ] VSCode open with MealMap project (`examples/mealmap/`)
- [ ] GitHub Copilot extension installed and authenticated
- [ ] GPT 5.4 model selected in Copilot settings
- [ ] Copilot Chat panel visible (sidebar or bottom)
- [ ] Terminal panel visible (for running commands)
- [ ] Font size increased for readability (Cmd+= / Ctrl+=, ~18-20px)
- [ ] Docker running: `docker-compose up -d` (PostgreSQL ready)
- [ ] Viewer dev server running: `cd viewer && npm run dev` (port 5173)
- [ ] Browser tab open with viewer at `http://localhost:5173`
- [ ] Browser tab open with presentation at `https://hundia.github.io/autospec/#/presentation`
- [ ] Close Slack, email, notifications

---

## Act 1: "The Problem" (2 min) — Presentation Slides

Use the presentation slides to set the stage:
1. Show the Evolution slides (Traditional → Code Assistant → Agentic)
2. Show Context Poisoning + Breaking Point slides
3. Land on the Bridge slide: "What if AI could think before it codes?"

**Transition line:** *"Let me show you what that looks like in practice."*

---

## Act 2: "The Specs" (3 min) — VSCode Explorer

Switch to VSCode. Walk through the project structure:

### 2a. Show the requirements
```
Open: requirements/srs.md
```
**Say:** *"We start with a simple requirements document. MealMap is a recipe and meal planning app. This is what you'd write as a product owner — plain English, no code."*

### 2b. Show the generated specs
```
Open: specs/01_product_manager.md
```
**Say:** *"From those requirements, AutoSpec generates 5 expert specifications. Here's the Product Manager spec — it defines personas, user flows, and acceptance criteria."*

Quick-scroll through the PM spec, then open:
```
Open: specs/02_backend_lead.md  (show API contracts)
Open: specs/04_db_architect.md  (show schema definitions)
Open: specs/backlog.md          (show sprint tickets)
```
**Say:** *"Each role — backend, frontend, database, QA — gets its own spec. And the backlog is auto-generated with sprint tickets, story points, model recommendations, and dependency chains."*

### 2c. Show the backlog
```
Open: specs/backlog.md
```
**Say:** *"Sprint 0 is already done — that's the foundation. Now watch what happens when we ask GPT 5.4 to run Sprint 1."*

---

## Act 3: "Sprint Execution" (5 min) — Copilot Chat

This is the main demo. Use Copilot Chat to execute a sprint.

### 3a. Sprint Status (warm-up)

In Copilot Chat, type:
```
Show sprint status for Sprint 1. Read specs/backlog.md, calculate completion %,
show health indicator, list tickets by status, show next actions.
```

**Say:** *"First, let's check where we are. Notice how GPT 5.4 reads the backlog, understands the sprint structure, and gives us a health dashboard."*

### 3b. Execute a single ticket (the money shot)

Pick ticket **1.1** (Auth endpoints) — it's the most impressive because it's full-stack:

```
Execute ticket 1.1 from specs/backlog.md.
Read the backlog to find the ticket, check dependencies (0.3 and 0.6 should be ✅),
read specs/02_backend_lead.md for API patterns, update status to 🔄 In Progress,
then implement the auth endpoints (register, login, refresh, logout) with Zod validation.
Follow the patterns in specs/02_backend_lead.md exactly.
```

**While GPT works, narrate:**
*"Watch what's happening. GPT 5.4 reads the spec first — it knows the exact API contract, the Zod schemas, the error handling patterns. It's not guessing. It's implementing against a specification."*

**Point out as it works:**
- It reads the spec before writing code
- It follows the patterns defined in the spec
- It updates the backlog status
- It creates properly structured files

### 3c. Show the backlog update

After the ticket completes:
```
Open: specs/backlog.md
```
**Say:** *"Look — ticket 1.1 is now marked 🔄 In Progress (or ✅ Done). The AI tracks its own work. No manual project management."*

---

## Act 4: "The Viewer" (3 min) — Browser

Switch to the browser with the MealMap viewer running.

### 4a. Dashboard
```
Navigate to: http://localhost:5173
```
**Say:** *"This is the SDD Viewer — a self-referential dashboard that visualizes the entire project. Sprint progress, ticket status, documentation coverage — all auto-generated from the same specs."*

### 4b. Backlog view
```
Navigate to: Backlog page
```
**Say:** *"Here's the backlog as a kanban board. Same data, visual format. Stakeholders can see progress without reading markdown."*

### 4c. Specs view
```
Navigate to: Specs page
```
**Say:** *"And here are all 5 specifications rendered as cards. Click any one to see the full spec. This is what the AI reads before writing code."*

---

## Act 5: "The Model Routing" (2 min) — Back to VSCode

### 5a. Show copilot-instructions.md
```
Open: .github/copilot-instructions.md
```
**Say:** *"The secret sauce is this file. It tells Copilot the rules: GPT 5.4 for architecture and planning, 5.3 for implementation, 5.2 for boilerplate. Each ticket in the backlog has a model recommendation. This is FinOps — right model for the right task."*

### 5b. Show the handoff pattern
Scroll to the "Handoff Pattern" section.

**Say:** *"When a ticket needs GPT 5.4, it writes a planning brief first. Then 5.3 implements against that brief. No re-planning, no context loss. This is how you get 60% cost savings while maintaining quality."*

---

## Closing (1 min)

Switch back to the presentation for the final slides (Before/After, Results, Final Tagline).

**Closing line:** *"Specs are code. AI reads specs. Humans write specs. Everyone wins."*

---

## Emergency Fallbacks

### If Copilot is slow or unresponsive
- Pre-record a screen capture of the sprint execution
- Have a backup terminal with `git log` showing the sprint commits

### If viewer doesn't load
- Use the live viewer: `https://hundia.github.io/autospec/viewer/`
- Show the autospec viewer instead (demonstrates the same concept)

### If Docker fails
- Skip the "run tests" part
- Focus on the spec reading + code generation flow
- Say: *"In a real environment, this would also run the test suite and update docs."*

### If you need to skip ahead
- Jump straight to Act 3b (single ticket execution) — it's the strongest demo moment
- Then Act 4a (viewer dashboard) — it's the visual payoff

---

## Key Talking Points to Weave In

1. **"Specs are the source of truth"** — The AI reads specs before coding, not just context
2. **"Model routing saves 60% on costs"** — Right model for the right task
3. **"Self-tracking"** — The AI updates the backlog, docs, and sprint summary automatically
4. **"Model-agnostic"** — Same methodology works with Claude, GPT, Gemini
5. **"Battle-tested"** — 29+ sprints, 837+ tickets across 3 projects
6. **"Template-first onboarding"** — Clone the starter, drop requirements, say "@QUICKSTART.md"
