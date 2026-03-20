# Sprint 2 Summary

Status: not started
Goal: Enable grounded AI summaries and reply drafting with required human review and approval-safe outbound flows.
Total Tickets: 7
Story Points: 30

## Planned Ticket Mix
| Ticket | Title | Owner | Model | Points | Dependencies |
| --- | --- | --- | --- | --- | --- |
| 2.1 | Assemble unified ticket context service | Backend | gpt-5.3 | 5 | 1.1, 1.2 |
| 2.2 | Design high-risk AI planning and policy checks | Backend | gpt-5.4 | 5 | 2.1, 1.6 |
| 2.3 | Build grounded reply composer | Frontend | gpt-5.3 | 5 | 2.1, 2.2 |
| 2.4 | Add approval workflow for outbound replies | Frontend | gpt-5.3 | 5 | 2.2, 2.3 |
| 2.5 | Implement approved knowledge retrieval index | Backend | gpt-5.3 | 5 | 1.2 |
| 2.6 | Create AI assist policy and regression tests | QA | gpt-5.2 | 3 | 2.2, 2.3, 2.4, 2.5 |
| 2.7 | Package AI assist viewer artifacts | Frontend | gpt-5.2 | 2 | 2.3, 2.4 |

## Handoff
Next sprint depends on these artifacts being updated: backlog, docs, QA evidence, and viewer data.
