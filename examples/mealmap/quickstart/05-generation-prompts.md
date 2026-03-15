# AutoSpec Generation Prompts — Gemini Diagrams & Remotion Video

> **What this section covers:** This section defines prompts for generating architecture diagrams (Gemini) and project overview videos (Remotion). Read this when generating diagram or video prompts.
>
> **When to read:** When generating `prompts/gemini-diagram-prompts.md` or `prompts/remotion-video-prompt.md`.

---

══════════════════════════════════════════════════════════════
SECTION 6 — GENERATION PROMPTS (GEMINI DIAGRAMS + REMOTION VIDEO)
══════════════════════════════════════════════════════════════

Generate the following prompt files in prompts/.

### prompts/gemini-diagram-prompts.md

A ready-to-paste prompt for Google Gemini (or any image-capable AI) to generate
architecture and workflow diagrams. The prompt must instruct the AI to:

- Read ALL generated files to understand the full project
- Generate these diagrams:
  1. System Architecture Diagram — from docs/architecture/overview.md
     (client → API → services → DB → cache → queue → external)
  2. Database ERD — from specs/04_db_architect.md and docs/architecture/database.md
     (all tables, relationships, cardinality, key columns)
  3. Frontend Component Tree — from specs/03_frontend_lead.md and docs/architecture/frontend.md
     (App → layouts → pages → organisms → molecules → atoms)
  4. CI/CD Pipeline — from specs/06_devops_lead.md and docs/workflows/ci-cd-pipeline.md
     (stages with parallel branches, triggers, artifacts)
  5. Authentication Flow — from docs/architecture/security.md and docs/api/authentication.md
     (register → login → JWT → refresh → logout, with token storage)
  6. Cloud Infrastructure — from docs/architecture/cloud.md
     (VPC, subnets, services, load balancer, CDN, monitoring)
  7. User Journey Map — from specs/01_product_manager.md
     (persona → entry point → core actions → completion → edge cases)
  8. Sprint Workflow — from docs/workflows/sprint-execution.md
     (ticket pickup → implement → test → review → merge → deploy)

- Style: clean, professional, consistent colour palette, legible at 1x zoom
- Format: SVG or high-res PNG (300 DPI)
- Include a legend on each diagram

### prompts/remotion-video-prompt.md

A ready-to-paste prompt for generating a Remotion (React video framework)
project that creates an animated project overview video.

The prompt must instruct the AI to:

1. READ ALL GENERATED PROJECT FILES to understand every aspect:
   - All 10 specs in specs/ (01_product_manager.md through 10_ui_designer.md)
   - The complete backlog in specs/backlog.md (all sprints, tickets, story points)
   - All 37 docs across docs/architecture/, docs/workflows/, docs/environments/,
     docs/api/, docs/testing/, docs/ui-design-system/, docs/project/
   - The sprint prompts in sprint_prompts/

2. GENERATE A REMOTION PROJECT with these scenes (in order):

   Scene 1 — Title Card (3s):
     Project name, tagline from 01_product_manager.md, tech stack badges

   Scene 2 — Problem & Solution (8s):
     Problem statement from 01_product_manager.md
     Animated bullet points of key pain points → solution value props

   Scene 3 — Architecture Overview (10s):
     Animate the system architecture from docs/architecture/overview.md
     Components fly in: client → API → services → DB → cache
     Connection lines draw between components
     Tech stack labels appear on each component

   Scene 4 — Database Schema (8s):
     Animate ERD from specs/04_db_architect.md
     Tables slide in, relationships draw as lines
     Show key columns and data types per table

   Scene 5 — User Flows (10s):
     Animate 2-3 key user flows from specs/01_product_manager.md
     Show persona → screens → actions → outcomes
     Use screen mockup shapes from specs/10_ui_designer.md

   Scene 6 — API Overview (6s):
     Animate endpoint groups from docs/api/reference.md
     Show request → response flow with status codes
     Group by resource (auth, users, core features)

   Scene 7 — Frontend Architecture (8s):
     Component tree animation from docs/architecture/frontend.md
     App root → pages → layouts → components (cascade reveal)
     Show state management flow arrows

   Scene 8 — Sprint Roadmap (10s):
     Animate sprint timeline from specs/backlog.md
     Each sprint slides in as a card with:
       Sprint name, goal, ticket count, story points
     Progress bar fills for each sprint
     Total project: X sprints, Y tickets, Z story points

   Scene 9 — DevOps & Deployment (6s):
     CI/CD pipeline animation from docs/workflows/ci-cd-pipeline.md
     Pipeline stages flow: lint → test → build → deploy
     Docker + cloud infrastructure from docs/architecture/cloud.md

   Scene 10 — Security (5s):
     Auth flow animation from docs/architecture/security.md
     Show JWT token lifecycle, RBAC roles
     Security checklist items check off

   Scene 11 — Testing Strategy (5s):
     Test pyramid animation from docs/testing/strategy.md
     Unit (70%) → Integration (20%) → E2E (10%)
     Coverage targets and CI gates

   Scene 12 — Team & Roles (6s):
     Show all 10 AutoSpec roles animating in:
     Product Manager, Backend Lead, Frontend Lead, DB Architect,
     QA Lead, DevOps Lead, Marketing Lead, Finance Lead,
     Business Lead, UI Designer
     Each with an icon and one-line responsibility

   Scene 13 — Closing Card (4s):
     Project name, "Built with AutoSpec"
     Key stats: X specs, Y docs, Z sprint prompts
     GitHub URL / project URL

3. TECHNICAL REQUIREMENTS:
   - Remotion v4 + TypeScript
   - 1920x1080 (1080p), 30fps
   - Total duration: ~90 seconds
   - Use @remotion/transitions for scene transitions (slide, fade, wipe)
   - Use @remotion/paths for SVG path drawing animations
   - Use spring() for physics-based animations
   - Consistent colour palette matching the project's design tokens from
     docs/ui-design-system/tokens.md
   - Font: Inter (headings) + JetBrains Mono (code)
   - Background: dark gradient (#0f172a → #1e293b)
   - Export as MP4 (H.264) and WebM

---
*Source: QUICKSTART.md — Part 5 of 7*
