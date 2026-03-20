# Frontend Architecture

## Component Tree
```text
App
|- Providers(auth, query, workspace)
`- WorkspaceLayout
   |- Sidebar and header
   |- Dashboard widgets
   |- Queue board and filters
   |- Ticket workspace
   |- Knowledge and rules consoles
   `- Analytics views
```

## State Flow
- Server state: TanStack Query caches queues, tickets, drafts, articles, analytics.
- Global UI state: workspace, filters, drawer state, reduced motion.
- Local state: form controls, inline edits, selected tabs.

## Data Fetching
- Route loaders fetch critical page data.
- Query invalidation after send, resolve, approve, publish, or rule changes.
- AI draft polling is bounded with visible timeout states.

## Code Splitting
Lazy-load analytics, admin, QA, and rules pages. Keep dashboard and ticket workspace in primary bundle.

## Assets
- Lucide icons for operational UI.
- Chart palette reuses semantic states.
- Knowledge preview and attachments use signed object URLs.
