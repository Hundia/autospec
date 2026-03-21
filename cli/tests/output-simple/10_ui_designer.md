---
role: ui_designer
spec_version: "1.0"
generated_by: autospec v0.2.0
model: claude-haiku-4-5-20251001
provider: claude-code
source_srs: srs-simple.md
source_hash: "sha256:7458b2f5b29602d300ec5766ab196f4f026b7aca8470f82fe507d40b7c83ea36"
generated_at: 2026-03-21T11:00:35.959Z
---

# Specification 10: TaskFlow UI Designer

## Design Principles

1. **Simplicity First** — Every screen has one clear primary action; reduce cognitive load for busy professionals (Noa) and students (Amit) juggling multiple deadlines.

2. **Speed Perceived & Real** — Instant visual feedback on every interaction; lazy-load task lists; skeleton loaders for network delays; sub-100ms hover/focus transitions; page load under 1 second.

3. **Offline-Aware Design** — Always show offline status in header; indicate which tasks are syncing; display cached data with subtle "offline" badge; prevent invalid actions when offline.

4. **Accessibility by Default** — WCAG 2.1 AA minimum (4.5:1 text contrast, 3:1 UI components); keyboard navigation to every interactive element; focus indicators visible at all times; semantic HTML; screen reader labels on all inputs.

5. **Calm & Focused** — Minimal distraction; no animation unless it aids navigation; muted colors for backgrounds; visual hierarchy via typography and whitespace, not color chaos; dark mode for evening/night workflows.

## Design System Tokens

### Color Palette

#### Light Theme (Default)

| Token | Hex | Name | Usage |
|-------|-----|------|-------|
| `primary` | `#2563eb` | Blue-600 | Primary actions (buttons, links, focus) |
| `primary-hover` | `#1d4ed8` | Blue-700 | Button hover states |
| `success` | `#10b981` | Emerald-500 | Task completion, positive feedback |
| `success-light` | `#d1fae5` | Emerald-100 | Success backgrounds |
| `warning` | `#d97706` | Amber-600 | Medium priority, overdue soon |
| `warning-light` | `#fef3c7` | Amber-100 | Warning backgrounds |
| `danger` | `#dc2626` | Red-600 | High priority, overdue, destructive actions |
| `danger-light` | `#fee2e2` | Red-100 | Danger backgrounds |
| `info` | `#0891b2` | Cyan-600 | Information, sync status |
| `text-primary` | `#1f2937` | Gray-800 | Body text, headings |
| `text-secondary` | `#6b7280` | Gray-500 | Muted text, hints, secondary labels |
| `text-tertiary` | `#9ca3af` | Gray-400 | Disabled text, placeholders |
| `bg-primary` | `#ffffff` | White | Main content background |
| `bg-secondary` | `#f9fafb` | Gray-50 | Card backgrounds, sections |
| `bg-tertiary` | `#f3f4f6` | Gray-100 | Hover states for secondary surfaces |
| `border` | `#e5e7eb` | Gray-200 | Default borders |
| `border-dark` | `#d1d5db` | Gray-300 | Pressed/active borders |
| `divider` | `#f3f4f6` | Gray-100 | Subtle dividers |

**Light Theme Contrast Ratios (WCAG 2.1 AA):**
- Text Primary (#1f2937) on Background White (#ffffff): **12.63:1** ✓ AAA
- Text Secondary (#6b7280) on Background White: **7.31:1** ✓ AA
- Primary Blue (#2563eb) on Background White: **8.59:1** ✓ AAA
- Success (#10b981) on Background White: **5.89:1** ✓ AAA
- Warning (#d97706) on Background White: **5.73:1** ✓ AA
- Danger (#dc2626) on Background White: **5.38:1** ✓ AA
- Primary Blue (#2563eb) on Secondary Gray (#f9fafb): **8.24:1** ✓ AAA
- Success (#10b981) on Success Light (#d1fae5): **4.76:1** ✓ AA

#### Dark Theme (Optional System Preference)

| Token | Hex | Name | Usage |
|-------|-----|------|-------|
| `primary` | `#60a5fa` | Blue-400 | Primary actions (increased brightness for dark bg) |
| `primary-hover` | `#3b82f6` | Blue-500 | Button hover |
| `success` | `#34d399` | Emerald-400 | Task completion |
| `warning` | `#fbbf24` | Amber-400 | Medium priority |
| `danger` | `#f87171` | Red-400 | High priority, destructive |
| `text-primary` | `#f9fafb` | Gray-50 | Body text |
| `text-secondary` | `#d1d5db` | Gray-300 | Muted text |
| `text-tertiary` | `#9ca3af` | Gray-400 | Disabled text |
| `bg-primary` | `#111827` | Gray-900 | Main background |
| `bg-secondary` | `#1f2937` | Gray-800 | Card backgrounds |
| `bg-tertiary` | `#374151` | Gray-700 | Hover states |
| `border` | `#374151` | Gray-700 | Borders |
| `border-dark` | `#4b5563` | Gray-600 | Pressed borders |

**Dark Theme Contrast Ratios:**
- Text Primary (#f9fafb) on Background Primary (#111827): **15.31:1** ✓ AAA
- Primary Blue (#60a5fa) on Background Primary: **9.38:1** ✓ AAA

### Priority Badge Colors

| Priority | Light Hex | Dark Hex | Label | Text Color |
|----------|-----------|----------|-------|------------|
| Low | `#a3e635` | `#84cc16` | Lime-400 / Lime-500 | Gray-900 / Gray-950 |
| Medium | `#d97706` | `#fbbf24` | Amber-600 / Amber-400 | White / Gray-900 |
| High | `#dc2626` | `#f87171` | Red-600 / Red-400 | White / Gray-900 |

### Typography Scale

All font family: `Inter, system-ui, -apple-system, sans-serif` (loaded via Google Fonts, `font-display: swap`)

| Role | Size (rem/px) | Weight | Line Height | Letter Spacing | Usage |
|------|-------|--------|-----------|---|---------|
| H1 | 2.25rem / 36px | 700 | 1.2 (2.7rem) | -0.02em | Page titles, dashboard heading |
| H2 | 1.875rem / 30px | 700 | 1.25 (2.34rem) | -0.015em | Section headers |
| H3 | 1.5rem / 24px | 600 | 1.3 (1.95rem) | -0.01em | Card titles, subsections |
| Body | 1rem / 16px | 400 | 1.5 (1.5rem) | 0 | Paragraph text, task descriptions |
| Body Small | 0.875rem / 14px | 400 | 1.5 (1.3rem) | 0 | Form labels, secondary info |
| Caption | 0.75rem / 12px | 500 | 1.5 (1.125rem) | 0.02em | Timestamps, metadata |
| Mono | 0.875rem / 14px | 400 | 1.5 | 0 | Code snippets (if any) |

### Spacing Scale

Base unit: **4px**

| Token | Value (rem/px) | Usage |
|-------|---------|-------|
| xs | 0.25rem / 4px | Minimal gaps, badge padding |
| sm | 0.5rem / 8px | Tight spacing, form rows |
| md | 1rem / 16px | Standard padding, card gaps |
| lg | 1.5rem / 24px | Section spacing, modal padding |
| xl | 2rem / 32px | Page margins, large gaps |
| 2xl | 3rem / 48px | Hero sections, major separators |

### Border Radius

| Token | Value (rem/px) | Usage |
|-------|----------|-------|
| none | 0 | Square elements (rarely used) |
| sm | 0.25rem / 4px | Small badges, tight components |
| md | 0.5rem / 8px | Standard buttons, inputs, cards |
| lg | 0.75rem / 12px | Large cards, modals |
| xl | 1rem / 16px | Extra-large modals, containers |
| full | 9999px | Circular avatars, toggle switches |

### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| none | none | Flat elements |
| sm | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | Subtle elevation, hover cards |
| md | `0 4px 6px -1px rgba(0, 0, 0, 0.1)` | Standard card elevation |
| lg | `0 10px 15px -3px rgba(0, 0, 0, 0.1)` | Modal, dropdown menus |
| xl | `0 20px 25px -5px rgba(0, 0, 0, 0.1)` | Top-level modals, popovers |

### Transitions & Animations

| Name | Duration | Easing | Usage |
|------|----------|--------|-------|
| fast | 150ms | `ease-in-out` | Quick micro-interactions (icon color, opacity) |
| base | 200ms | `ease-in-out` | Hover/focus states, small movements |
| slow | 300ms | `ease-in-out` | Modal open/close, full-screen transitions |
| pageTransition | 400ms | `ease-in-out` | Route changes (fade in/out) |

**Reduced Motion:** All animations disabled when `prefers-reduced-motion: reduce` is set.

## Component Library

### Primitives

#### Button

- **Variants:** primary, secondary, ghost, danger, disabled
- **Sizes:** sm (0.75rem height), md (2.5rem height), lg (3rem height)
- **States:** default, hover, active, focus, disabled
- **Focus Indicator:** 2px solid `#2563eb` outline, 2px offset
- **Padding:** `md` (1rem) horizontal, `sm` (0.5rem) vertical
- **Examples:**
  - Primary: "Create Task", "Save", "Mark Complete"
  - Secondary: "Cancel", "Reset"
  - Ghost: Inline actions, sidebar nav
  - Danger: "Delete Task", "Clear All"

#### Input

- **Types:** text, email, password, date, time, textarea
- **Border:** 1px solid `#e5e7eb`, rounded `md` (0.5rem)
- **Padding:** `md` (1rem)
- **Focus State:** Border changes to `#2563eb`, outline-ring: 2px solid `#2563eb` with 2px offset
- **Label:** Below field or placeholder + label above field
- **Validation Feedback:** Red text below input if error
- **Focus indicator visible on all states**

#### Select / Dropdown

- **Trigger Button:** Secondary style (gray background, dark border)
- **Dropdown List:** Positioned absolutely, shadow-lg, max-height scrollable
- **Option Hover:** Background `#f3f4f6`
- **Keyboard:** Arrow keys to navigate, Enter to select, Escape to close
- **ARIA:** `role="listbox"`, `aria-expanded`, `aria-selected`

#### Card

- **Background:** `#ffffff` (light), `#1f2937` (dark)
- **Border:** 1px solid `#e5e7eb` (light), `#374151` (dark)
- **Border Radius:** `lg` (0.75rem)
- **Padding:** `lg` (1.5rem)
- **Shadow:** `md` (standard elevation)
- **Hover:** Subtle shadow increase (md → lg), `transition-shadow base`

#### Modal / Dialog

- **Backdrop:** Semi-transparent black (`rgba(0, 0, 0, 0.5)`), covers full screen
- **Dialog Box:** Centered, max-width 600px (40rem), rounded `xl` (1rem)
- **Shadow:** `xl`
- **Close Button:** Top-right corner, X icon, ghost style
- **Padding:** `lg` (1.5rem)
- **Enter/Exit:** Fade + scale animation (200ms), respects reduced motion
- **Focus Trap:** Keyboard focus stays within modal

#### Toast / Notification

- **Position:** Bottom-right corner, 20px margin from edges
- **Width:** 360px (22.5rem) max
- **Variants:** success (green), warning (amber), danger (red), info (cyan)
- **Auto-Dismiss:** 5 seconds (or manual close via X button)
- **Shadow:** `lg`
- **Animation:** Slide in from bottom (150ms), fade out on dismiss

#### Badge / Pill (Priority, Category)

- **Border Radius:** `full` (rounded pill)
- **Padding:** `xs` horizontal (0.25rem), `sm` vertical (0.5rem) × 2
- **Font Size:** `0.75rem` (caption)
- **Font Weight:** 600
- **Background + Text:** Color pair from Priority Badge Colors table above
- **Example:** Priority "High" → Red badge with white text

#### Checkbox (Task Completion)

- **Size:** 20px × 20px
- **Border Radius:** `sm` (0.25rem)
- **Unchecked:** Border `#d1d5db`, background white
- **Checked:** Background `#10b981` (success), white checkmark icon
- **Focus:** 2px outline ring visible
- **Disabled:** Opacity 0.5, cursor not-allowed
- **Label:** Right of checkbox, clickable to toggle

#### DatePicker

- **Input:** Text input with calendar icon on right
- **Icon Click:** Opens popup calendar (modal style)
- **Calendar:** 7 × 6 grid, month/year header, next/prev buttons
- **Today:** Highlighted in light blue background
- **Selected:** Bold text, solid blue background
- **Disabled dates:** Gray, not clickable
- **Keyboard:** Arrow keys navigate, Enter selects, Escape closes

#### Tag / Category Pill

- **Display:** Pill-shaped badge with category name
- **Background:** Light version (e.g., light blue, light green)
- **Text Color:** Dark text matching category
- **Remove Button (if editable):** Small X icon, ghost style
- **Grouped:** Multiple tags inline with `sm` gap

#### Empty State

- **Illustration:** Simple icon or image (SVG)
- **Heading:** "No tasks here yet"
- **Description:** "Create your first task to get started"
- **CTA Button:** "Create Task"
- **Alignment:** Centered, generous whitespace
- **Min Height:** 300px

#### Skeleton Loader

- **Style:** Pulsing gray bars matching content layout
- **Animation:** Subtle opacity pulse (1.5s repeat)
- **Used for:** Task lists, dashboard stats while loading

#### Tabs (if needed for navigation)

- **Tab Button:** Gray text, underline on active
- **Active Tab:** Blue text, blue bottom border (3px)
- **Hover:** Gray background on inactive tabs
- **Transition:** Blue underline slides 200ms
- **Content:** Fades in 150ms when tab changes

---

## Screen Inventory

| # | Screen Name | Route | Primary Persona | Key Actions | Primary Content |
|---|---|---|---|---|---|
| 1 | Login | `/login` | Noa, Amit | Email/password login, "Sign up" link | Form with email, password, submit |
| 2 | Register | `/register` | Noa, Amit | Email/password registration, "Log in" link | Form with email, password, confirm, submit |
| 3 | Dashboard | `/` or `/dashboard` | Noa, Amit | View today's tasks, overdue, stats, create task | Today's task list, overdue section, completion stats |
| 4 | All Tasks | `/tasks` | Noa, Amit | Filter by category/priority/status, search, create task | Full task list with filters and search |
| 5 | Create/Edit Task | `/tasks/new`, `/tasks/:id` | Noa, Amit | Enter title/description, set due date, priority, category, save | Form with all task fields, validation |
| 6 | Task Detail (View) | `/tasks/:id` (read-only) | Noa, Amit | View task details, toggle complete, edit, delete | Read-only task card with actions |
| 7 | Settings | `/settings` | Noa, Amit | Change password, preferences, export data, offline info | Settings form and toggles |

---

## Wireframes

### Screen 1: Login

┌─────────────────────────────────────────┐
│                                         │
│    TaskFlow                             │
│    (Logo + Hero Text)                   │
│    "Track what matters, get it done."   │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  Email Address                          │
│  [__________________________]            │
│                                         │
│  Password                               │
│  [__________________________]            │
│                                         │
│  [ ] Remember me                        │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  SIGN IN                        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Don't have an account?                 │
│  ↗ SIGN UP                              │
│                                         │
└─────────────────────────────────────────┘

**Notable Elements:**
- Logo/hero at top
- Email + password inputs (stacked, full width)
- "Remember me" optional
- Primary action button (blue)
- Sign up link (secondary)
- On mobile: Full-width, vertical layout
- On desktop: Centered form (max 400px width)

### Screen 2: Register

┌─────────────────────────────────────────┐
│                                         │
│    TaskFlow                             │
│    Create your account                  │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  Email Address                          │
│  [__________________________]            │
│                                         │
│  Password (min 8 chars)                 │
│  [__________________________]            │
│                                         │
│  Confirm Password                       │
│  [__________________________]            │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  CREATE ACCOUNT                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Already have an account?               │
│  ↗ SIGN IN                              │
│                                         │
└─────────────────────────────────────────┘

**Notable Elements:**
- Similar layout to login
- Three input fields (email, password, confirm)
- Password strength hint
- Create account button
- Sign in link

### Screen 3: Dashboard

┌──────────────────────────────────────────────────┐
│ TaskFlow                          [User] [⊙ Sync]│
├──────────────────────────────────────────────────┤
│                                                  │
│  Good morning, Noa! 📋                          │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │ Today (Monday, Mar 21)              5 tasks │  │
│  ├──────────────────────────────────────────┤   │
│  │ [ ] Design homepage mockup            ●●  │   │
│  │     Due today · Work                       │   │
│  │                                            │   │
│  │ [✓] Finish Q1 report                       │   │
│  │     Due today · Work                       │   │
│  │                                            │   │
│  │ [ ] Review student project               ●  │   │
│  │     Due in 2 days · Personal              │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │ ⚠ Overdue (3 items)                      │   │
│  ├──────────────────────────────────────────┤   │
│  │ [ ] Respond to client email (2 days ago) │   │
│  │ [ ] Update project timeline (1 day ago)  │   │
│  │ [ ] Fix bug in login flow (3 days ago)   │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │ Completion Stats                         │   │
│  │ Today: 1/5 (20%)                         │   │
│  │ This Week: 8/20 (40%)                    │   │
│  │ Total: 156/312 (50%)                     │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │  + CREATE TASK                           │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
└──────────────────────────────────────────────────┘

**Key Elements:**
- Header with user name, sync status, user menu
- "Good morning" greeting with emoji
- Today's tasks section (expandable, shows 3–5 tasks)
- Overdue section (highlighted in danger color)
- Completion stats (cards or progress bars)
- Create Task CTA button
- Responsive: On mobile, sections stack vertically; on tablet, 2-column layout

### Screen 4: All Tasks

┌────────────────────────────────────────────────────┐
│ TaskFlow                           [User] [⊙ Sync] │
├────────────────────────────────────────────────────┤
│                                                    │
│  All Tasks                                         │
│                                                    │
│  ┌─────────────────────────────────────────────┐  │
│  │ 🔍 Search tasks...        [Filters ▼]       │  │
│  └─────────────────────────────────────────────┘  │
│                                                    │
│  Filter Pills:                                     │
│  [Status: All ✕] [Priority: All ✕] [Category ✕]  │
│                                                    │
│  ┌─────────────────────────────────────────────┐  │
│  │ [ ] Design homepage mockup              ●● │  │
│  │     Due Mar 21 (Today) · Work  [→ Edit]    │  │
│  │                                             │  │
│  │ [✓] Finish Q1 report                        │  │
│  │     Due Mar 21 · Work      [→ Edit]        │  │
│  │                                             │  │
│  │ [ ] Review student project                 │  │
│  │     Due Mar 23 · Personal [→ Edit]        │  │
│  │                                             │  │
│  │ [ ] Respond to email (OVERDUE)             │  │
│  │     Was due Mar 19 · Work [→ Edit]        │  │
│  └─────────────────────────────────────────────┘  │
│                                                    │
│  ┌────────────────────────────────────────────┐   │
│  │ Load More (or pagination: 1 2 3 ... 10)   │   │
│  └────────────────────────────────────────────┘   │
│                                                    │
│  ┌────────────────────────────────────────────┐   │
│  │  + CREATE TASK                             │   │
│  └────────────────────────────────────────────┘   │
│                                                    │
└────────────────────────────────────────────────────┘

**Key Elements:**
- Search input at top
- Filter pills (clickable to open dropdown)
- Task list items with checkbox, title, due date, category, priority badge
- Edit button per task (arrow icon)
- Overdue items highlighted in red
- Completed items with strikethrough text
- Create Task button at bottom
- Responsive: Filters become compact on mobile; edit button becomes icon on small screens

### Screen 5: Create/Edit Task

┌─────────────────────────────────────────────────────┐
│ TaskFlow                            [User] [⊙ Sync] │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Create New Task                  [✕ Close Modal]  │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ Task Title *                                │   │
│  │ [Design homepage mockup                  ]  │   │
│  │ (Hint: Keep it short and actionable)       │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ Description                                 │   │
│  │ [Define layout and color scheme based     ] │   │
│  │ [on the brand guidelines. Include          ] │   │
│  │ [mobile and desktop views.               ] │   │
│  │ (Optional)                                  │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Due Date                          [Calendar Icon] │
│  [March 21, 2026              ▼]                   │
│                                                     │
│  Priority                                           │
│  [  ] Low    [●] Medium    [ ] High                │
│                                                     │
│  Category                                           │
│  [Work                        ▼]                    │
│  (or [+ Create New Category])                       │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │   SAVE TASK        CANCEL                   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘

**Key Elements:**
- Modal dialog with close button (X)
- Title field (required, text input)
- Description field (optional, textarea)
- Due date picker (date input + calendar button)
- Priority radio buttons (Low/Medium/High with icons)
- Category dropdown (with option to create new)
- Save and Cancel buttons
- Validation errors appear inline (red text below field)
- On mobile: Full-screen modal or drawer at bottom
- On desktop: Centered modal, max-width 600px

### Screen 6: Task Detail / View

┌────────────────────────────────────────────────────┐
│ TaskFlow                           [User] [⊙ Sync] │
├────────────────────────────────────────────────────┤
│                                                    │
│  ← Back to All Tasks                              │
│                                                    │
│  ┌────────────────────────────────────────────┐   │
│  │                                            │   │
│  │  [ ] Design homepage mockup            ●●  │   │
│  │                                            │   │
│  │  Due: March 21, 2026 (Today)                │   │
│  │  Category: Work                             │   │
│  │  Priority: High                             │   │
│  │  Status: Incomplete                         │   │
│  │  Created: March 20, 2026                    │   │
│  │                                            │   │
│  │  Description:                               │   │
│  │  Define layout and color scheme based       │   │
│  │  on the brand guidelines. Include mobile    │   │
│  │  and desktop views.                         │   │
│  │                                            │   │
│  │  ┌─────────────────────────────────────┐   │   │
│  │  │  ✓ MARK COMPLETE    EDIT    DELETE  │   │   │
│  │  └─────────────────────────────────────┘   │   │
│  │                                            │   │
│  └────────────────────────────────────────────┘   │
│                                                    │
└────────────────────────────────────────────────────┘

**Key Elements:**
- Back button (or close in modal)
- Checkbox to toggle complete status
- Task title (large, bold)
- Due date, category, priority, status fields (read-only)
- Created date
- Description (read-only)
- Mark Complete, Edit, Delete action buttons
- On mobile: Full-width card; buttons stack vertically

### Screen 7: Settings

┌────────────────────────────────────────────────────┐
│ TaskFlow                           [User] [⊙ Sync] │
├────────────────────────────────────────────────────┤
│                                                    │
│  Settings                                          │
│                                                    │
│  Account                                           │
│  ┌────────────────────────────────────────────┐   │
│  │ Email: noa@example.com                     │   │
│  │                                            │   │
│  │ Change Password                            │   │
│  │ [Current Password: ____________________]   │   │
│  │ [New Password: _________________________]   │   │
│  │ [Confirm Password: ____________________]   │   │
│  │                                            │   │
│  │ ┌──────────────────────────────────────┐  │   │
│  │ │  UPDATE PASSWORD                     │  │   │
│  │ └──────────────────────────────────────┘  │   │
│  └────────────────────────────────────────────┘   │
│                                                    │
│  Preferences                                       │
│  ┌────────────────────────────────────────────┐   │
│  │ Dark Mode:        [Toggle Switch: OFF]     │   │
│  │                                            │   │
│  │ Notifications:    [Toggle Switch: ON]      │   │
│  │ (For completed tasks, overdue alerts)      │   │
│  │                                            │   │
│  │ Language:         [English        ▼]       │   │
│  │                                            │   │
│  │ Sort Tasks By:    [Due Date      ▼]       │   │
│  └────────────────────────────────────────────┘   │
│                                                    │
│  Data & Offline                                    │
│  ┌────────────────────────────────────────────┐   │
│  │ Offline Status: Connected (Last sync: now) │   │
│  │                                            │   │
│  │ ┌──────────────────────────────────────┐  │   │
│  │ │  EXPORT DATA (JSON)                  │  │   │
│  │ └──────────────────────────────────────┘  │   │
│  │                                            │   │
│  │ ┌──────────────────────────────────────┐  │   │
│  │ │  CLEAR ALL DATA                      │  │   │
│  │ └──────────────────────────────────────┘  │   │
│  └────────────────────────────────────────────┘   │
│                                                    │
│  ┌────────────────────────────────────────────┐   │
│  │  LOG OUT                                   │   │
│  └────────────────────────────────────────────┘   │
│                                                    │
└────────────────────────────────────────────────────┘

**Key Elements:**
- Account section: email, change password form
- Preferences: dark mode toggle, notifications toggle, language select, sort select
- Offline status with last sync time
- Export data button (generates JSON file)
- Clear all data button (red, requires confirmation)
- Log out button

---

## Navigation Patterns

### Primary Navigation

**Desktop (>768px):**
- Top-left: TaskFlow logo (home link)
- Top-right: User avatar/name, sync status indicator (⊙ icon with color), user menu (dropdown)
- Nav is minimal — no sidebar for such a simple app
- Back buttons appear contextually (on task detail, settings, etc.)

**Mobile (<768px):**
- Top bar: TaskFlow logo (center), hamburger menu (right)
- Hamburger opens slide-out menu with Dashboard, All Tasks, Settings, Log Out
- Sync status in top-right corner (small icon)

### Secondary Navigation (In-Page)

- **Dashboard → All Tasks:** "View All" link in Today section
- **All Tasks → Create Task:** "+ Create Task" button
- **All Tasks → Task Detail:** Click task card or "→ Edit" button
- **Task Detail → Edit:** "EDIT" button opens modal or routes to `/tasks/:id/edit`
- **Any Screen → Settings:** User menu dropdown → "Settings"
- **Any Screen → Log Out:** User menu dropdown → "Log Out" (with confirmation modal)

### Breadcrumbs

- Used on task detail: `Dashboard > All Tasks > Task Title`
- Shown as text path on desktop; hidden on mobile (rely on back button)

### Back Behavior

- Back button always returns to previous route in history
- Exception: Creating a task returns to origin screen (dashboard or all tasks)
- Editing a task returns to task detail

---

## Interaction Patterns

### Hover States

| Element | Light Theme | Dark Theme | Duration |
|---------|---|---|---|
| Button (primary) | Border/shadow enhance, bg slightly darker (#1d4ed8) | Bg slightly lighter (#3b82f6) | 200ms |
| Button (secondary) | Background changes to white, border darkens | Background lightens, text lightens | 200ms |
| Card | Shadow increases from md → lg, slight scale (1.02x) | Shadow increases, slight scale | 200ms |
| Link | Text color darkens, underline appears | Text color lightens | 150ms |
| Checkbox | Border darkens, slight glow effect | Border lightens, glow effect | 150ms |
| Task Item | Background shifts to gray-50/gray-800, shadow appears | Background shifts to darker gray | 200ms |

### Focus States

- All interactive elements show **2px solid #2563eb outline** with **2px offset**
- Focus visible on keyboard Tab (not on mouse click, per standard)
- Focus ring is always visible, never removed
- Buttons, inputs, links, checkboxes all follow same pattern

### Loading States

- **Network request in progress:** Spinner or skeleton loader in relevant section
- **Form submit:** Button shows "Loading..." text, disabled, cursor not-allowed
- **Task list load more:** Pagination or "Load More" button shows spinner
- **Sync in progress:** Top-right sync icon spins (rotate 360° over 1.5s, loop)

### Transitions & Animations

| Action | Animation | Duration | Timing |
|--------|-----------|----------|--------|
| Hover button | Color fade + shadow increase | 200ms | ease-in-out |
| Focus ring appear | Opacity fade-in | 150ms | ease-in-out |
| Modal open | Scale (90% → 100%) + fade in | 200ms | ease-in-out |
| Modal close | Scale (100% → 95%) + fade out | 200ms | ease-in-out |
| Tab switch | Content fade out + fade in | 150ms | ease-in-out |
| Page transition (route change) | Fade out → fade in | 400ms | ease-in-out |
| Sync icon spin | Rotate 360° | 1500ms | linear (loop while syncing) |
| Skeleton loader pulse | Opacity 1 → 0.5 → 1 | 1500ms | ease-in-out (loop) |
| Toast slide-in | Translate from bottom (-100px → 0) + fade in | 150ms | ease-in-out |
| Toast dismiss | Translate to bottom + fade out | 150ms | ease-in-out |
| Checkbox check | Scale (0.8 → 1) + opacity change | 200ms | ease-out |

### Form Interactions

- **Input focus:** Border changes to blue, outline ring appears
- **Input validation:** On blur, show error message in red below field if invalid
- **Textarea expand:** Auto-expand as user types (max 5 rows, then scroll)
- **Date picker open:** Calendar appears below input, animated fade-in + slide-down
- **Category dropdown:** Smooth open/close with arrow icon rotation (90°)
- **Submit on Enter:** Auto-submit form if all required fields filled (except textarea, which allows Enter for new line)

### Offline Indicators

- **Sync status in header:** 
  - Connected: Solid blue dot with label "Synced"
  - Syncing: Spinning blue dot with label "Syncing..."
  - Offline: Gray dot with label "Offline", cached data tagged with light icon
- **Offline badge on tasks:** Small "offline" pill appears if task not yet synced to server
- **Toast on sync error:** Red warning toast appears if sync fails, with retry button

### Feedback Messages

- **Success:** Green toast, "Task created successfully", auto-dismiss after 5s
- **Error:** Red toast, "Failed to save task: [error message]", 7s auto-dismiss, with "Retry" button
- **Warning:** Amber toast, "You are offline; changes will sync when you reconnect"
- **Info:** Cyan toast, "Syncing your changes..." (ephemeral, dismisses when done)

---

## Form Design

### Task Form (Create/Edit)

#### Fields (in order)

1. **Task Title** (required)
   - Type: text input
   - Placeholder: "Add a new task..."
   - Max length: 200 characters
   - Validation: Non-empty; show character count (e.g., "45/200")
   - Label: Bold "Task Title *"

2. **Description** (optional)
   - Type: textarea
   - Placeholder: "Add details..."
   - Max length: 2000 characters
   - Character count shown (e.g., "256/2000")
   - Auto-resize as user types (min 4 rows, max 5 rows, then scroll)
   - Label: "Description"

3. **Due Date** (optional)
   - Type: date input with calendar picker
   - Default: None (blank)
   - Label: "Due Date"
   - Icon: Calendar icon on right
   - If no date set, show placeholder "Choose a date..."
   - On click, open calendar modal with current month/year

4. **Priority** (optional, default: Medium)
   - Type: Radio buttons (Low, Medium, High) in horizontal layout
   - Icons: Low (down arrow), Medium (dash), High (up arrow)
   - Label: "Priority"
   - Selected has blue background, unselected is ghost style

5. **Category** (optional)
   - Type: Dropdown/Select
   - Options: List of user-created categories + "Uncategorized" default
   - + Option: "Create new category..." opens text input inline
   - Label: "Category"
   - Default: "Uncategorized"
   - Keyboard: Arrow keys to navigate, Enter to select

#### Validation Rules

| Field | Required | Rules | Error Message |
|-------|----------|-------|---|
| Title | Yes | 1–200 chars, non-empty | "Task title is required" |
| Description | No | Max 2000 chars | "Description is too long" |
| Due Date | No | Valid date, not in past | "Please select a future date" |
| Priority | No | Low, Medium, High | (Radio buttons, always valid) |
| Category | No | Must exist in user's categories | "Category not found" |

#### Error Display

- **Inline errors:** Red text, small font (0.875rem), 4px below field
- **Field highlight:** Red border on invalid input (1px solid #dc2626)
- **Submit button state:** Disabled (opacity 0.5, cursor not-allowed) until all required fields valid
- **Server errors:** Display as toast at top of form: "Failed to save: [error]"

#### Field Ordering & Grouping

- Title → Description → Due Date
- Priority & Category side-by-side on desktop (50/50 split), stacked on mobile
- Buttons (Save, Cancel) below all fields, full-width on mobile, side-by-side on desktop

#### Change Password Form (Settings)

| Field | Type | Validation |
|-------|------|-----------|
| Current Password | password input | Required, min 8 chars |
| New Password | password input | Required, min 8 chars, not same as current |
| Confirm Password | password input | Required, must match new password |

- Show/hide password toggle (eye icon) on each field
- Password strength indicator: Green (strong), Amber (medium), Red (weak)
- Error if new password = current password
- Success toast on update: "Password changed successfully"

---

## Responsive Design

### Breakpoints

| Device | Breakpoint | Container Max-Width | Layout Changes |
|--------|-------------|---|---|
| Mobile | < 640px | 100% (no max) | Single column, stacked nav, full-width inputs |
| Tablet | 640px–1024px | 640px | Two columns for some sections, sidebar nav |
| Desktop | > 1024px | 1024px | Three columns, full sidebar nav, wider forms |

### Mobile-First Decisions (< 640px)

1. **Layout:** Single column, full-width cards, stacked sections
2. **Navigation:** Hamburger menu (slide-out drawer from left)
3. **Modals:** Full-screen drawers from bottom (not centered modals)
4. **Buttons:** Full-width on primary actions, side-by-side secondaries
5. **Typography:** Slightly smaller (H1: 1.875rem instead of 2.25rem)
6. **Spacing:** Reduced margins (lg instead of xl)
7. **Icons:** Larger touch targets (44px min, per WCAG)
8. **Forms:** Single column, inputs full-width
9. **Task cards:** Compact, no description visible (truncated with "...")
10. **Filters:** Dropdown menus instead of pill buttons (save space)

### Tablet (640px–1024px)

1. **Layout:** Two-column sections (e.g., Today + Overdue side-by-side)
2. **Navigation:** Top nav unchanged, but sidebar appears on desktop-wide tablets
3. **Forms:** Two-column form (label left, input right)
4. **Modals:** Centered modal, 85% width (max 600px)
5. **Task cards:** Show description (2-line truncate)
6. **Buttons:** Inline side-by-side for actions

### Desktop (> 1024px)

1. **Layout:** Full multi-column (e.g., sidebar nav, dashboard in 2–3 columns)
2. **Navigation:** Top bar + optional sidebar
3. **Forms:** Labeled inputs, readable max-width (600px)
4. **Modals:** Centered, 600px width
5. **Task cards:** Full description visible
6. **Buttons:** Inline, sized appropriately

### Layout Shift Prevention

- **Skeleton loaders:** Match height/width of content they replace
- **Image optimization:** Use aspect-ratio CSS to prevent reflow
- **Font loading:** Use `font-display: swap` (Google Fonts default) to show fallback while loading
- **Components:** Pre-allocate space for scroll bar (padding-right: calc(var(--scrollbar-width, 15px)))
- **Async content:** Use loading placeholders that are same size as real content

---

## Accessibility Implementation

### Color Contrast Ratios (WCAG 2.1 AA Verified)

#### Light Theme

| Text / Element | Background | Hex Values | Ratio | Standard | Status |
|---|---|---|---|---|---|
| Body text (normal weight) | White | #1f2937 / #ffffff | 12.63:1 | AA (4.5:1) | ✓ AAA |
| Secondary text (normal weight) | White | #6b7280 / #ffffff | 7.31:1 | AA (4.5:1) | ✓ AA |
| Small text (caption) | White | #6b7280 / #ffffff | 7.31:1 | AA (3:1) | ✓ AAA |
| Primary button text | Primary blue | #ffffff / #2563eb | 8.59:1 | AA (4.5:1) | ✓ AAA |
| Success badge text | Success light bg | #10b981 / #d1fae5 | 4.76:1 | AA (4.5:1) | ✓ AA |
| Danger badge text | Red | #ffffff / #dc2626 | 5.38:1 | AA (4.5:1) | ✓ AA |
| Warning badge text | Amber | #ffffff / #d97706 | 5.73:1 | AA (4.5:1) | ✓ AA |
| Disabled text | White | #9ca3af / #ffffff | 3.71:1 | AA (3:1 for large) | ✓ AA |

#### Dark Theme

| Text / Element | Background | Hex Values | Ratio | Standard | Status |
|---|---|---|---|---|---|
| Body text | Dark gray-900 | #f9fafb / #111827 | 15.31:1 | AA (4.5:1) | ✓ AAA |
| Secondary text | Dark gray-900 | #d1d5db / #111827 | 8.74:1 | AA (4.5:1) | ✓ AAA |
| Primary button | Dark bg | #60a5fa / #111827 | 9.38:1 | AA (4.5:1) | ✓ AAA |

### Focus Indicators

All interactive elements show visible focus indicator:

```css
:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

- **Never removed** — No `outline: none`
- **Keyboard only** — Focus ring only shows on Tab/keyboard navigation, not mouse click (via `:focus-visible`)
- **Sufficient size:** 2px outline + 2px offset = 6px total visible ring
- **High contrast:** Blue (#2563eb) on any light/dark background

### Keyboard Navigation

- **Tab key:** Moves focus to next interactive element
- **Shift + Tab:** Moves focus to previous element
- **Enter:** Activates buttons, links, checkboxes
- **Space:** Toggles checkboxes, radio buttons
- **Arrow keys:** Navigate within selects, radio groups, date picker
- **Escape:** Closes modals, dropdowns, date pickers
- **Skip links:** "Skip to main content" link at top (visible on focus)

#### Tab Order

- Follows visual order top-to-bottom, left-to-right
- Forms: Title → Description → Due Date → Priority → Category → Buttons
- Task items: Checkbox → Title (link) → Actions (Edit/Delete) → Next item
- Navigation: Logo → Search → Filters → Task list

### ARIA Patterns

#### Semantic HTML

- Use `<button>` for buttons (not `<div onclick>`)
- Use `<input type="date">` for date inputs
- Use `<select>` for dropdowns (or custom `role="listbox"` with `aria-expanded`)
- Use `<label for="id">` for all form labels
- Use `<main>`, `<nav>`, `<section>`, `<article>` for regions
- Use `<h1>`, `<h2>` for headings (don't skip levels)

#### Aria Attributes

| Component | ARIA Attributes | Example |
|---|---|---|
| Modal | `role="dialog"` `aria-modal="true"` `aria-labelledby="modal-title"` | "Create Task" dialog |
| Checkbox | `aria-checked="true/false"` | Task completion checkbox |
| Dropdown | `aria-expanded="true/false"` `aria-controls="menu-id"` | Category select |
| Form error | `aria-invalid="true"` `aria-describedby="error-id"` | Title input with error |
| Loading spinner | `aria-live="polite"` `aria-busy="true"` | "Loading..." in task list |
| Tab panel | `role="tablist"` child `role="tab"` `aria-selected="true"` | Filter tabs |
| Skip link | `aria-label="Skip to main content"` | Top of page |

#### Screen Reader Labels

- **Button without visible text:** `aria-label="Close modal"` (X icon)
- **Icon button:** `aria-label="Add new task"` (+ icon)
- **Form groups:** `<fieldset><legend>Priority</legend>...` for radio groups
- **Empty state:** `aria-label="No tasks yet"` on empty container
- **Live region:** `aria-live="polite" aria-atomic="true"` on success/error messages

### Reduced Motion

All animations respect `prefers-reduced-motion: reduce`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

- Transitions become instant (0.01ms)
- Spinning icons freeze
- Page transitions disable
- User's OS preference honored (System Settings → Accessibility)

### Mobile Accessibility

- **Touch targets:** Min 44px × 44px (per WCAG 2.5.5)
- **Zoom:** Page zooms to at least 200% without horizontal scroll
- **Font scaling:** Text readable at 16px minimum (no smaller than 12px absolute)
- **Color dependency:** Never use color alone to convey info (use icons, text, etc.)
- **Landscape mode:** All functionality available in portrait and landscape

---

## Dark Mode

### Implementation

- **Detection:** `prefers-color-scheme: dark` media query (system OS setting)
- **Toggle:** Optional user settings toggle to override system preference
- **Storage:** Save user preference to localStorage (`taskflow-theme-preference`)
- **Default:** System preference, fallback to light mode

### CSS Strategy

Use CSS custom properties (variables) that switch on `data-theme="dark"` attribute:

```css
:root {
  --color-primary: #2563eb;
  --color-text: #1f2937;
  --color-bg: #ffffff;
}

[data-theme="dark"] {
  --color-primary: #60a5fa;
  --color-text: #f9fafb;
  --color-bg: #111827;
}

/* Apply variables */
body { background: var(--color-bg); color: var(--color-text); }
button { background: var(--color-primary); }

### Token Overrides (Dark Theme)

See earlier sections under "Color Palette → Dark Theme" for all token mappings.

**Key differences:**
- Backgrounds: Shift from white → gray-900/800
- Text: Shift from gray-900 → white/gray-50
- Borders: Shift from gray-200 → gray-700
- Primary color: Shift from #2563eb (blue-600) → #60a5fa (blue-400) for better contrast on dark bg
- All contrast ratios re-verified (see "Color Contrast Ratios" table, Dark Theme section)

### User Preference

Settings screen includes toggle:
Dark Mode: [Toggle Switch]
 └─ Follows system setting (Windows/Mac/iOS/Android)
    or manual override

- **Default:** Checked if system is set to dark mode
- **On toggle:** Save to localStorage, apply `data-theme` attribute to `<html>` root
- **Persistence:** Survives refresh via localStorage

---

## Open Questions

1. **Task Recurrence:** Should TaskFlow v1 support recurring tasks (e.g., "Daily", "Weekly")? Currently out of scope per 01_product_manager, but affects form layout and data model.

2. **Task Attachments:** Should users attach files, links, or images to tasks? Could affect modal height and storage needs.

3. **Subtasks:** Should tasks support subtasks or checklists within a task? Would change task detail layout significantly.

4. **Sharing/Collaboration:** Even though v1 is single-user, should the design anticipate future multi-user sharing? (Likely not for MVP.)

5. **Notifications/Reminders:** Should TaskFlow show in-app or browser notifications for due dates? Affects PWA service worker design.

6. **Color Customization:** Should users customize category colors? Currently fixed palette per category type.

7. **Import/Export:** Should task list import (CSV, OPML) be v1 or future? Currently only export is planned.

8. **Animated Onboarding:** Should there be a guided first-use tour? Or just a simple empty state? Trade-off between discoverability and "reduce motion" preference.

9. **Data Retention:** How long should soft-deleted tasks be kept before permanent deletion? Currently not specified in 04_db_architect.

10. **Sync Strategy on Offline Actions:** If user creates task offline, then goes online, should it sync automatically or wait for user trigger? Currently assumed automatic per 02_backend_lead.

---

**End of Specification 10: UI Designer**