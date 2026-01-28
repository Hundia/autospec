import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, FileText, Server, Layout, Database, TestTube, Cloud, Megaphone, DollarSign, BarChart3, Palette, X } from 'lucide-react';

const roles = [
  {
    num: '01',
    name: 'Product Manager',
    icon: FileText,
    focus: 'Vision, personas, user flows',
    color: 'blue',
    preview: `# Product Manager Specification

## Product Vision
TaskFlow is a collaborative task management platform designed
for small to medium teams who need lightweight project tracking.

## Target Personas
1. **Startup Founder** - Needs quick setup, minimal overhead
2. **Team Lead** - Wants visibility into team progress
3. **Individual Contributor** - Needs clear task assignments

## User Stories
- As a user, I can create projects to organize my work
- As a team lead, I can assign tasks to team members
- As a user, I can set due dates and priorities`,
  },
  {
    num: '02',
    name: 'Backend Lead',
    icon: Server,
    focus: 'APIs, auth, services',
    color: 'green',
    preview: `# Backend Lead Specification

## API Architecture
RESTful API with JWT authentication

## Endpoints
### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh

### Projects
- GET /api/projects
- POST /api/projects
- PUT /api/projects/:id
- DELETE /api/projects/:id

## Security Requirements
- Rate limiting: 100 requests/minute
- Input validation on all endpoints
- SQL injection prevention`,
  },
  {
    num: '03',
    name: 'Frontend Lead',
    icon: Layout,
    focus: 'Components, design system',
    color: 'purple',
    preview: `# Frontend Lead Specification

## Component Architecture
React with TypeScript, Tailwind CSS

## Core Components
- \`<AuthProvider>\` - Authentication context
- \`<ProjectList>\` - Display user projects
- \`<TaskCard>\` - Individual task display
- \`<CreateTaskModal>\` - Task creation form

## State Management
- React Query for server state
- Zustand for client state

## Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px`,
  },
  {
    num: '04',
    name: 'DB Architect',
    icon: Database,
    focus: 'Schema, migrations',
    color: 'orange',
    preview: `# Database Architect Specification

## Schema Design (PostgreSQL)

### Users Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |

### Projects Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| name | VARCHAR(255) | NOT NULL |
| owner_id | UUID | FOREIGN KEY |

## Indexes
- users(email) - Unique index for login
- projects(owner_id) - For user's projects query`,
  },
  {
    num: '05',
    name: 'QA Lead',
    icon: TestTube,
    focus: 'Testing strategy',
    color: 'yellow',
    preview: `# QA Lead Specification

## Testing Strategy

### Unit Tests (Jest)
- Coverage target: 80%
- All utility functions
- All API handlers

### Integration Tests
- API endpoint testing
- Database operations
- Authentication flows

### E2E Tests (Playwright)
- User registration flow
- Project CRUD operations
- Task management

## Test Data
- Fixtures for common scenarios
- Factory functions for test users`,
  },
  {
    num: '06',
    name: 'DevOps Lead',
    icon: Cloud,
    focus: 'Infrastructure, CI/CD',
    color: 'cyan',
    preview: `# DevOps Lead Specification

## Infrastructure
- Cloud Provider: AWS
- Container: Docker
- Orchestration: ECS Fargate

## CI/CD Pipeline (GitHub Actions)
1. Lint & Type Check
2. Run Unit Tests
3. Build Docker Image
4. Run Integration Tests
5. Deploy to Staging
6. Deploy to Production

## Monitoring
- CloudWatch for logs
- Prometheus for metrics
- PagerDuty for alerts`,
  },
  {
    num: '07',
    name: 'Marketing Lead',
    icon: Megaphone,
    focus: 'Go-to-market',
    color: 'pink',
    preview: `# Marketing Lead Specification

## Go-to-Market Strategy

### Launch Timeline
- Week 1-2: Beta with 50 users
- Week 3-4: Public launch
- Month 2: Product Hunt launch

### Messaging
**Tagline:** "Task management that gets out of your way"

### Channels
- Product Hunt launch
- Twitter/X presence
- Developer blog posts
- YouTube tutorials`,
  },
  {
    num: '08',
    name: 'Finance Lead',
    icon: DollarSign,
    focus: 'Pricing, economics',
    color: 'emerald',
    preview: `# Finance Lead Specification

## Pricing Model

### Free Tier
- Up to 3 projects
- Up to 5 team members
- Basic features

### Pro Tier - $10/user/month
- Unlimited projects
- Advanced analytics
- Priority support

### Enterprise - Custom
- SSO integration
- Dedicated support
- Custom contracts

## Unit Economics
- CAC Target: $50
- LTV Target: $500
- LTV:CAC Ratio: 10:1`,
  },
  {
    num: '09',
    name: 'Business Lead',
    icon: BarChart3,
    focus: 'Strategy, competition',
    color: 'indigo',
    preview: `# Business Lead Specification

## Competitive Analysis

### Direct Competitors
| Product | Strength | Weakness |
|---------|----------|----------|
| Asana | Enterprise features | Complex |
| Trello | Simple boards | Limited |
| Linear | Dev-focused | Narrow |

### Our Differentiation
- Simplicity of Trello
- Power of Asana
- Speed of Linear

## Success Metrics
- MRR growth: 20% monthly
- Churn rate: < 5%
- NPS: > 50`,
  },
  {
    num: '10',
    name: 'UI Designer',
    icon: Palette,
    focus: 'Screens, wireframes',
    color: 'rose',
    preview: `# UI Designer Specification

## Design System

### Colors
- Primary: #3B82F6 (Blue)
- Success: #22C55E (Green)
- Warning: #EAB308 (Yellow)
- Error: #EF4444 (Red)

### Typography
- Headings: Inter Bold
- Body: Inter Regular
- Code: JetBrains Mono

### Components
- Buttons: Rounded, 3 sizes
- Cards: Subtle shadow, rounded
- Inputs: Outlined, focus ring

### Key Screens
1. Dashboard (project overview)
2. Project view (task list)
3. Task detail (sidebar)`,
  },
];

const colorClasses: Record<string, { bg: string; border: string; icon: string; hover: string }> = {
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: 'text-blue-500', hover: 'hover:border-blue-500/50' },
  green: { bg: 'bg-green-500/10', border: 'border-green-500/30', icon: 'text-green-500', hover: 'hover:border-green-500/50' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: 'text-purple-500', hover: 'hover:border-purple-500/50' },
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: 'text-orange-500', hover: 'hover:border-orange-500/50' },
  yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: 'text-yellow-500', hover: 'hover:border-yellow-500/50' },
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', icon: 'text-cyan-500', hover: 'hover:border-cyan-500/50' },
  pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/30', icon: 'text-pink-500', hover: 'hover:border-pink-500/50' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: 'text-emerald-500', hover: 'hover:border-emerald-500/50' },
  indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', icon: 'text-indigo-500', hover: 'hover:border-indigo-500/50' },
  rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', icon: 'text-rose-500', hover: 'hover:border-rose-500/50' },
};

export default function RolesSection() {
  const [selectedRole, setSelectedRole] = useState<typeof roles[0] | null>(null);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-400 mb-4">
            <Users size={14} />
            The 10-Role Model
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Specifications from Every Angle
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Even solo developers think like a complete team. Each role provides a unique perspective
            that ensures nothing is overlooked.
          </p>
        </motion.div>

        {/* Roles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {roles.map((role, index) => {
            const colors = colorClasses[role.color];
            return (
              <motion.button
                key={role.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setSelectedRole(role)}
                className={`${colors.bg} ${colors.border} ${colors.hover} border rounded-xl p-4 text-left transition-all hover:scale-105 group`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-white/40">{role.num}</span>
                  <role.icon className={colors.icon} size={18} />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{role.name}</h3>
                <p className="text-xs text-white/50">{role.focus}</p>
              </motion.button>
            );
          })}
        </div>

        {/* Click hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center text-sm text-white/40 mt-8"
        >
          Click any role to see example spec content
        </motion.p>

        {/* Role Preview Modal */}
        <AnimatePresence>
          {selectedRole && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedRole(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="bg-slate-900 border border-white/10 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${colorClasses[selectedRole.color].bg}`}>
                      <selectedRole.icon className={colorClasses[selectedRole.color].icon} size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{selectedRole.name}</h3>
                      <p className="text-sm text-white/50">{selectedRole.focus}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRole(null)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-white/60" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-auto max-h-[60vh]">
                  <pre className="text-sm text-white/80 font-mono whitespace-pre-wrap bg-slate-950 rounded-lg p-4 border border-white/5">
                    {selectedRole.preview}
                  </pre>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-white/10 bg-slate-900/50">
                  <p className="text-sm text-white/40 text-center">
                    This is a preview. Full specs contain 500-1500+ lines of detailed documentation.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
