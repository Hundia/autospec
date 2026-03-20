# SPEC: Frontend Lead

**Version:** 1.0
**Created:** 2026-01-21
**Owner:** Frontend Team

---

## 1. Architecture Overview

### Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | React | Latest |
| Language | TypeScript | Latest |
| State | Zustand/Context | Latest |
| Styling | Tailwind CSS | 3.x |
| Testing | Vitest + Testing Library | Latest |

---

## 2. Project Structure

```
web/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # Base components
│   │   └── features/    # Feature-specific
│   ├── pages/           # Route pages
│   ├── hooks/           # Custom hooks
│   ├── services/        # API calls
│   ├── stores/          # State management
│   ├── types/           # TypeScript types
│   └── utils/           # Helper functions
├── tests/
├── public/
└── package.json
```

---

## 3. Design System

### Colors
| Name | Value | Usage |
|------|-------|-------|
| Primary | #3B82F6 | Main actions |
| Secondary | #6B7280 | Secondary text |
| Success | #10B981 | Success states |
| Error | #EF4444 | Error states |

### Typography
- Headings: Inter, semi-bold
- Body: Inter, regular
- Code: JetBrains Mono

---

## 4. Component Patterns

### Button Component
```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

---

*This spec is maintained by the Frontend team. Last updated: 2026-01-21*
