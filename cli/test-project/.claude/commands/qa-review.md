# QA Review

Perform QA review on completed tickets.

## Usage

```
/qa-review [ticket_number]
```

**Example:** `/qa-review 1.3`

## Instructions

1. **Verify implementation**:
   - Check the ticket is marked 🧪 QA Review in backlog
   - Review the implemented code

2. **Run tests**:
   - `npm test` for unit tests
   - `npm run test:integration` for integration tests

3. **Check code quality**:
   - No TypeScript errors
   - No ESLint warnings
   - Code follows project patterns

4. **Functional testing**:
   - Test the feature manually if UI-related
   - Verify API responses if backend-related

5. **Update status**:
   - If passing: Change to ✅ Done
   - If failing: Change back to 🔄 In Progress with notes

## Output Format

```
## QA Review: Ticket [X.X]

### Tests
- [ ] Unit tests pass
- [ ] Integration tests pass

### Code Quality
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Follows patterns

### Functional
- [ ] Feature works as expected

### Result: [PASS/FAIL]
```
