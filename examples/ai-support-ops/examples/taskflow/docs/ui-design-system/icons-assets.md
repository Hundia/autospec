# TaskFlow Icons & Assets

## Overview

This document describes the icon library, image assets, and media guidelines used in TaskFlow.

---

## Icon Library

### Icon Source

TaskFlow uses [Heroicons](https://heroicons.com/) as the primary icon library, supplemented by custom icons where needed.

### Icon Sizes

| Size | Dimension | Use Case |
|------|-----------|----------|
| xs | 12px | Inline indicators |
| sm | 16px | Buttons, form elements |
| md | 20px | Default UI elements |
| lg | 24px | Navigation, emphasis |
| xl | 32px | Feature highlights |
| 2xl | 48px | Empty states, heroes |

### Icon Colors

```css
/* Icon Color Classes */
.icon-default   { color: var(--color-gray-500); }
.icon-primary   { color: var(--color-primary-500); }
.icon-success   { color: var(--color-success-500); }
.icon-warning   { color: var(--color-warning-500); }
.icon-error     { color: var(--color-error-500); }
.icon-muted     { color: var(--color-gray-400); }
```

---

## Icon Categories

### Navigation Icons

| Icon | Name | Usage |
|------|------|-------|
| 🏠 | HomeIcon | Dashboard link |
| 📋 | ClipboardListIcon | Tasks link |
| 📁 | FolderIcon | Projects link |
| 🏷️ | TagIcon | Labels link |
| ⚙️ | CogIcon | Settings link |
| 👤 | UserIcon | Profile link |

### Action Icons

| Icon | Name | Usage |
|------|------|-------|
| ➕ | PlusIcon | Create/Add |
| ✏️ | PencilIcon | Edit |
| 🗑️ | TrashIcon | Delete |
| 📋 | DuplicateIcon | Duplicate |
| ↩️ | ArrowPathIcon | Refresh/Undo |
| ✓ | CheckIcon | Confirm/Complete |
| ✕ | XMarkIcon | Close/Cancel |
| ⋯ | EllipsisHorizontalIcon | More options |

### Status Icons

| Icon | Name | Usage |
|------|------|-------|
| ⏳ | ClockIcon | Pending |
| 🔄 | ArrowPathIcon | In Progress |
| ✅ | CheckCircleIcon | Completed |
| ⚠️ | ExclamationTriangleIcon | Warning |
| ❌ | XCircleIcon | Error |
| ℹ️ | InformationCircleIcon | Info |

### Priority Icons

| Icon | Name | Priority |
|------|------|----------|
| 🔽 | ChevronDownIcon | Low |
| ➖ | MinusIcon | Medium |
| 🔼 | ChevronUpIcon | High |

### Form Icons

| Icon | Name | Usage |
|------|------|-------|
| 🔍 | MagnifyingGlassIcon | Search |
| 📅 | CalendarIcon | Date picker |
| ⌄ | ChevronDownIcon | Dropdown |
| 👁️ | EyeIcon | Show password |
| 👁️‍🗨️ | EyeSlashIcon | Hide password |

---

## Icon Component

### Implementation

```tsx
// components/Icon.tsx
import * as HeroIcons from '@heroicons/react/24/outline';

interface IconProps {
  name: keyof typeof HeroIcons;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'muted';
  className?: string;
}

const sizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-12 h-12',
};

const colorClasses = {
  default: 'text-gray-500',
  primary: 'text-primary-500',
  success: 'text-success-500',
  warning: 'text-warning-500',
  error: 'text-error-500',
  muted: 'text-gray-400',
};

export function Icon({ name, size = 'md', color = 'default', className }: IconProps) {
  const IconComponent = HeroIcons[name];
  return (
    <IconComponent
      className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      aria-hidden="true"
    />
  );
}
```

### Usage Examples

```tsx
// Basic usage
<Icon name="PlusIcon" />

// With size and color
<Icon name="CheckCircleIcon" size="lg" color="success" />

// In a button
<Button leftIcon={<Icon name="PlusIcon" size="sm" />}>
  Add Task
</Button>

// With accessibility
<button aria-label="Delete task">
  <Icon name="TrashIcon" color="error" />
</button>
```

---

## Custom Icons

### TaskFlow Brand Icons

```tsx
// Custom logo icon
export function TaskFlowLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="8" fill="#3B82F6" />
      <path
        d="M8 16L13 21L24 10"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
```

### Icon Guidelines

```markdown
## Custom Icon Requirements

- Format: SVG
- Viewbox: 24x24 (default)
- Stroke width: 1.5px
- Stroke cap: Round
- Stroke join: Round
- No fills (outline style)
- Single color (currentColor)
```

---

## Image Assets

### Avatar Images

| Type | Size | Format |
|------|------|--------|
| User avatar (sm) | 32x32 | PNG, WebP |
| User avatar (md) | 64x64 | PNG, WebP |
| User avatar (lg) | 128x128 | PNG, WebP |
| Placeholder | 100x100 | SVG |

### Empty State Illustrations

| State | Description | Size |
|-------|-------------|------|
| No tasks | Checklist illustration | 200x200 |
| No projects | Folder illustration | 200x200 |
| No search results | Search illustration | 200x200 |
| Error | Error illustration | 200x200 |

### Image Optimization

```tsx
// Using Next.js Image component
import Image from 'next/image';

<Image
  src="/images/empty-tasks.svg"
  alt="No tasks yet"
  width={200}
  height={200}
  priority={false}
/>

// Responsive images
<Image
  src="/images/hero.png"
  alt="TaskFlow dashboard"
  sizes="(max-width: 768px) 100vw, 50vw"
  fill
  style={{ objectFit: 'cover' }}
/>
```

---

## Asset Organization

### Directory Structure

```
public/
├── images/
│   ├── logo/
│   │   ├── logo.svg
│   │   ├── logo-dark.svg
│   │   └── favicon.ico
│   ├── empty-states/
│   │   ├── no-tasks.svg
│   │   ├── no-projects.svg
│   │   └── error.svg
│   ├── avatars/
│   │   └── default-avatar.svg
│   └── og/
│       └── og-image.png
├── icons/
│   └── custom/
│       └── priority-icons.svg
└── fonts/
    ├── Inter-Regular.woff2
    └── Inter-Bold.woff2
```

---

## Loading States

### Skeleton Icons

```tsx
// Skeleton placeholder for icons
function IconSkeleton({ size = 'md' }) {
  const sizeClass = sizeClasses[size];
  return (
    <div className={`${sizeClass} bg-gray-200 rounded animate-pulse`} />
  );
}
```

### Loading Spinner

```tsx
// Spinner icon
function Spinner({ size = 'md', color = 'primary' }) {
  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        className="opacity-25"
      />
      <path
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        className="opacity-75"
      />
    </svg>
  );
}
```

---

## Favicon & App Icons

### Favicon Set

```html
<!-- Standard favicon -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">

<!-- Apple touch icons -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

<!-- Android icons -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">

<!-- Web manifest -->
<link rel="manifest" href="/site.webmanifest">
```

### PWA Icons

| Size | Use |
|------|-----|
| 192x192 | Android home screen |
| 512x512 | Android splash screen |
| 180x180 | iOS home screen |
| 32x32 | Favicon (high DPI) |
| 16x16 | Favicon (standard) |

---

## Related Documents

- [Design Tokens](./tokens.md)
- [Components](./components.md)
- [Accessibility](./accessibility.md)
