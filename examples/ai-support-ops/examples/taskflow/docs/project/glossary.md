# TaskFlow Glossary

## Overview

This glossary defines key terms and concepts used throughout the TaskFlow project documentation and codebase.

---

## Domain Terms

### Task

A unit of work that needs to be completed. Tasks have a title, optional description, status, priority, and can be assigned to projects and labeled.

**Properties:**
- Title (required)
- Description
- Status (pending, in_progress, completed)
- Priority (low, medium, high)
- Due Date
- Project (optional)
- Labels (optional)

---

### Project

A collection of related tasks grouped together. Projects help organize tasks by theme, client, or goal.

**Properties:**
- Name
- Description
- Color (for visual identification)
- Owner (User)

---

### Label

A tag that can be applied to tasks for categorization and filtering. Labels have a name and color.

**Properties:**
- Name
- Color

**Examples:** urgent, bug, feature, documentation

---

### User

An authenticated person using the TaskFlow application. Users own tasks, projects, and labels.

**Properties:**
- Email
- Name
- Password (hashed)
- Avatar
- Preferences

---

### Status

The current state of a task in its lifecycle.

| Status | Description |
|--------|-------------|
| `pending` | Task not started yet |
| `in_progress` | Task is actively being worked on |
| `completed` | Task has been finished |

---

### Priority

The urgency level of a task.

| Priority | Description | Color |
|----------|-------------|-------|
| `low` | Can wait, not urgent | Green |
| `medium` | Normal priority | Amber |
| `high` | Urgent, do first | Red |

---

## Technical Terms

### API (Application Programming Interface)

The backend service that handles HTTP requests, processes business logic, and returns JSON responses. TaskFlow uses a RESTful API design.

---

### JWT (JSON Web Token)

A secure token format used for authentication. After login, users receive a JWT that must be included in subsequent requests to access protected resources.

**Components:**
- Header (algorithm, type)
- Payload (user data, expiration)
- Signature (verification)

---

### Access Token

A short-lived JWT (1 hour default) used to authenticate API requests. Sent in the Authorization header.

```
Authorization: Bearer <access_token>
```

---

### Refresh Token

A longer-lived token (30 days default) stored in an HTTP-only cookie, used to obtain new access tokens without re-authenticating.

---

### Middleware

Functions that process requests before they reach route handlers. Used for authentication, validation, logging, and error handling.

**Examples:**
- `authMiddleware` - Validates JWT tokens
- `validationMiddleware` - Validates request body
- `errorMiddleware` - Handles errors

---

### Repository

A data access layer that abstracts database operations. Repositories contain CRUD operations and queries.

```typescript
taskRepository.findById(id)
taskRepository.create(data)
taskRepository.update(id, data)
taskRepository.delete(id)
```

---

### Service

A business logic layer between controllers and repositories. Services contain validation, authorization, and domain logic.

```typescript
taskService.createTask(userId, data)
taskService.updateStatus(taskId, userId, status)
```

---

### Controller

A request handling layer that processes HTTP requests, calls services, and returns responses.

```typescript
taskController.create(req, res)
taskController.getAll(req, res)
```

---

### DTO (Data Transfer Object)

An object that defines the shape of data being transferred between layers, typically for input validation.

```typescript
interface CreateTaskDto {
  title: string;
  description?: string;
  priority?: TaskPriority;
}
```

---

### ORM (Object-Relational Mapping)

A technique for querying and manipulating data from a database using an object-oriented paradigm. TaskFlow uses Prisma as its ORM.

---

### Migration

A versioned change to the database schema. Migrations allow tracking and applying schema changes across environments.

```bash
npx prisma migrate dev --name add_labels_table
```

---

### Query

A request for data from the API (typically GET requests). In React Query context, queries are cached and automatically refetched.

```typescript
const { data, isLoading } = useQuery({
  queryKey: ['tasks'],
  queryFn: getTasks,
});
```

---

### Mutation

A request that modifies data (POST, PUT, DELETE). Mutations update server state and may invalidate cached queries.

```typescript
const mutation = useMutation({
  mutationFn: createTask,
  onSuccess: () => queryClient.invalidateQueries(['tasks']),
});
```

---

### Hook

A React function that encapsulates reusable logic, often prefixed with "use". Custom hooks abstract complex state and side effect logic.

```typescript
function useTask(id: string) {
  // Hook implementation
}
```

---

### Store

A client-side state container. TaskFlow uses Zustand for global client state like UI preferences and filters.

```typescript
const useTaskStore = create((set) => ({
  filters: {},
  setFilters: (filters) => set({ filters }),
}));
```

---

## Architecture Terms

### SPA (Single Page Application)

A web application that loads a single HTML page and dynamically updates content. TaskFlow's frontend is an SPA built with React.

---

### REST (Representational State Transfer)

An architectural style for designing networked applications. TaskFlow's API follows REST conventions with resource-based URLs and HTTP methods.

---

### Three-Tier Architecture

An architecture pattern with three layers:
1. **Presentation** (Frontend/UI)
2. **Application** (Backend/API)
3. **Data** (Database)

---

### Microservice

A small, independent service focused on a single responsibility. TaskFlow uses a monolithic architecture but could be split into microservices in the future.

---

### CDN (Content Delivery Network)

A distributed network of servers that delivers static content (JavaScript, CSS, images) from locations close to users. TaskFlow uses a CDN for frontend assets.

---

## DevOps Terms

### CI/CD (Continuous Integration/Continuous Deployment)

Automated processes that build, test, and deploy code changes. TaskFlow uses GitHub Actions for CI/CD.

---

### Container

A lightweight, standalone package that includes everything needed to run software. TaskFlow uses Docker containers.

---

### Environment

A distinct deployment context with its own configuration and data.

| Environment | Purpose |
|-------------|---------|
| Development | Local development |
| Staging | Pre-production testing |
| Production | Live user traffic |

---

### ECS (Elastic Container Service)

AWS service for running Docker containers. TaskFlow deploys to ECS Fargate for serverless container hosting.

---

### RDS (Relational Database Service)

AWS managed database service. TaskFlow uses RDS for PostgreSQL hosting.

---

## Testing Terms

### Unit Test

A test that verifies a single function or component in isolation, with dependencies mocked.

---

### Integration Test

A test that verifies multiple components working together, often including real database interactions.

---

### E2E Test (End-to-End Test)

A test that simulates real user interactions through the full application stack.

---

### Test Coverage

A metric indicating the percentage of code executed during tests. TaskFlow targets 80% coverage.

---

### Mock

A simulated object that replaces a real dependency in tests, allowing isolated testing.

---

### Fixture

Predefined test data used to set up consistent test scenarios.

---

### Factory

A function that generates test data with customizable properties.

---

## Acronyms Reference

| Acronym | Full Term |
|---------|-----------|
| API | Application Programming Interface |
| AWS | Amazon Web Services |
| CDN | Content Delivery Network |
| CI/CD | Continuous Integration/Continuous Deployment |
| CORS | Cross-Origin Resource Sharing |
| CRUD | Create, Read, Update, Delete |
| DTO | Data Transfer Object |
| E2E | End-to-End |
| ECS | Elastic Container Service |
| JWT | JSON Web Token |
| ORM | Object-Relational Mapping |
| PR | Pull Request |
| RDS | Relational Database Service |
| REST | Representational State Transfer |
| SPA | Single Page Application |
| SQL | Structured Query Language |
| SSO | Single Sign-On |
| TDD | Test-Driven Development |
| UI | User Interface |
| URL | Uniform Resource Locator |
| UX | User Experience |
| VPC | Virtual Private Cloud |

---

## Related Documents

- [Architecture Overview](../architecture/overview.md)
- [API Reference](../api/reference.md)
- [Project Setup](./setup.md)
