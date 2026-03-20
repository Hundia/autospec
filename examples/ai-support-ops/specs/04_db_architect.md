# Database Architect Spec — AutoSpec Data Layer

## Philosophy
No database server. All state is file-based. The "schema" is the shape of the .md and .json files.

## File-Based "DB" Schema

### backlog.md (primary store)
Parsed by `cli/src/parsers/backlog.parser.ts` into:
```typescript
interface BacklogData {
  sprints: Sprint[];
  bugs: Bug[];
}

interface Sprint {
  number: string;        // "0", "1", "2.1"
  name: string;
  status: 'todo' | 'in-progress' | 'done';
  tickets: Ticket[];
}

interface Ticket {
  id: string;            // "0.1", "1.3", "B.01"
  title: string;
  owner: string;         // role name
  points: number;
  status: '🔲' | '🔄' | '🧪' | '✅' | '❌';
  dependencies: string[];
  docsPath?: string;
}
```

### environments.json
```typescript
interface EnvironmentsData {
  tools: string[];       // 6 AI tools
  skills: string[];      // 10 skills
  matrix: Record<string, Record<string, 'full' | 'partial' | 'none'>>;
}
```

### specs/ (role definitions)
10 static .md files. Parsed for display in viewer SpecsPage.

## Conventions
- Never add a database server (Postgres, SQLite, etc.) to autospec itself
- The CLI reads/writes .md files directly (no ORM, no query builder)
- The viewer reads pre-parsed JSON at build time (no runtime file I/O in browser)
