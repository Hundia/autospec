# Data Flow

- Inbound channel payloads enter intake adapter and normalize into ticket, message, account, and customer records.
- Routing service writes classification decisions and SLA timers to timeline events.
- AI service reads ticket context and approved knowledge, returns draft metadata plus citations, and logs telemetry in audit events.
- Analytics jobs aggregate ticket, QA, SLA, and AI metrics into dashboard read models.
