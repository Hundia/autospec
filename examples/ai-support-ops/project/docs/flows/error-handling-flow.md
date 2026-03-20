# Error Handling Flow

- Validation failures stop at route boundary with field-level details.
- RBAC violations return 403 and append audit event.
- Invalid ticket transition returns 409 and keeps prior state.
- AI policy block returns 422 with explicit warning reason and required next step.
- Worker job failure retries with exponential backoff, then dead-letters for analyst review.
