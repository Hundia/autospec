# Contributing to AutoSpec

Thank you for your interest in contributing to AutoSpec! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Code Style](#code-style)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. We expect all contributors to:

- Be respectful and considerate in communication
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/autospec.git
   cd autospec
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/user/autospec.git
   ```

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Installation

```bash
# Navigate to the CLI directory
cd cli

# Install dependencies
npm install

# Build the project
npm run build

# Run tests to verify setup
npm test
```

### Development Commands

```bash
npm run dev          # Watch mode for development
npm run build        # Build for production
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run lint         # Run linter
npm run typecheck    # TypeScript type checking
```

## Making Changes

### Branch Naming Convention

Use descriptive branch names:

- `feature/add-new-command` - New features
- `fix/backlog-parser-bug` - Bug fixes
- `docs/update-cli-readme` - Documentation updates
- `refactor/simplify-generator` - Code refactoring
- `test/add-sprint-tests` - Test additions

### Development Workflow

1. **Sync with upstream**:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** following the code style guidelines

4. **Write or update tests** for your changes

5. **Run the test suite**:
   ```bash
   npm test
   ```

6. **Commit your changes** following the commit message guidelines

7. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Open a Pull Request** against the `main` branch

## Code Style

### TypeScript Guidelines

- Use TypeScript strict mode
- Prefer `const` over `let`, avoid `var`
- Use explicit type annotations for function parameters and return types
- Use interfaces for object shapes
- Use descriptive variable and function names

### File Organization

```
cli/
  src/
    commands/     # CLI command implementations
    generators/   # Spec and prompt generators
    parsers/      # Backlog and requirements parsers
    utils/        # Utility functions
    index.ts      # Main entry point
  tests/
    commands/     # Command tests
    generators/   # Generator tests
    parsers/      # Parser tests
```

### Naming Conventions

- **Files**: Use kebab-case (`backlog.parser.ts`)
- **Classes**: Use PascalCase (`BacklogParser`)
- **Functions/Variables**: Use camelCase (`parseBacklog`)
- **Constants**: Use UPPER_SNAKE_CASE (`MAX_SPRINT_SIZE`)
- **Interfaces**: Use PascalCase with `I` prefix optional (`Ticket` or `ITicket`)

### Code Examples

```typescript
// Good: Explicit types and descriptive names
interface TicketData {
  id: string;
  title: string;
  status: TicketStatus;
  sprint: number;
}

async function parseTickets(backlogPath: string): Promise<TicketData[]> {
  const content = await readFile(backlogPath, 'utf-8');
  return extractTickets(content);
}

// Avoid: Implicit types and vague names
async function parse(p) {
  const c = await readFile(p, 'utf-8');
  return extract(c);
}
```

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring without feature changes
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(cli): add validate command for project structure

fix(parser): handle empty backlog files gracefully

docs(readme): update installation instructions

test(generator): add unit tests for spec generator
```

## Pull Request Process

### Before Submitting

1. Ensure all tests pass locally
2. Update documentation if needed
3. Add tests for new functionality
4. Run the linter and fix any issues

### PR Requirements

- **Title**: Use conventional commit format
- **Description**: Fill out the PR template completely
- **Size**: Keep PRs focused and reasonably sized
- **Tests**: Include tests for new features or bug fixes
- **Documentation**: Update relevant documentation

### Review Process

1. A maintainer will review your PR
2. Address any requested changes
3. Once approved, a maintainer will merge your PR

### After Merge

- Delete your feature branch
- Sync your fork with upstream

## Issue Guidelines

### Bug Reports

When reporting bugs, include:

- AutoSpec version
- Node.js version
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Error messages or logs

### Feature Requests

When requesting features, include:

- Clear description of the feature
- Use case and motivation
- Potential implementation approach (optional)
- Examples of similar features elsewhere (optional)

## Areas for Contribution

We welcome contributions in these areas:

- **CLI Improvements**: New commands, better error handling
- **Templates**: New spec templates, prompt improvements
- **Documentation**: Guides, tutorials, examples
- **Environment Support**: New IDE integrations
- **Testing**: Improved test coverage
- **Bug Fixes**: Reported issues
- **Performance**: Optimizations

## Questions?

If you have questions about contributing:

- Check existing issues and discussions
- Open a new discussion for general questions
- Open an issue for specific bugs or feature requests

Thank you for contributing to AutoSpec!
