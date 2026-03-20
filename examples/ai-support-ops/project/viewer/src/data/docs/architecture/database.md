# Database Architecture

## Table Catalog
- workspaces: tenant root and AI settings
- users: identity, role, preferences
- queues: routing targets and business hours
- tickets: core case record
- messages: inbound and outbound communication
- timeline_events: immutable history
- approvals: manager review state
- knowledge_articles and knowledge_versions: controlled content
- automation_rules and automation_runs: rule config and execution history
- qa_reviews: sampled ticket scoring
- audit_events: compliance-grade action and AI telemetry log

## Performance Expectations
- queue read queries under 150 ms p95 with composite indexes
- ticket detail including timeline under 250 ms p95
- article search under 800 ms p95 with full-text index

## Connection Pooling
- API pool size 20 per pod
- worker pool size 10 per pod
- pgbouncer recommended in staging and production

## Scale Note
Sharding is not needed at this stage. Archive old audit events and timeline events before considering partitioning.
