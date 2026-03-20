# State Transitions

## Ticket States
| State | Allowed Next | Notes |
| --- | --- | --- |
| New | Assigned, Closed | only routing rules or managers move to Assigned |
| Assigned | Pending Customer, Escalated, Resolved | requires owner |
| Pending Customer | Assigned, Resolved | pauses response SLA |
| Escalated | Assigned, Pending Customer, Resolved | target team and reason required |
| Resolved | Reopened, Closed | customer reply inside reopen window triggers Reopened |
| Reopened | Assigned, Pending Customer, Resolved | child of prior resolution cycle |
| Closed | Correction Pending | admin or auditor only |

## Draft Reply States
Draft -> Awaiting Approval -> Approved -> Sent
Draft -> Rejected -> Draft
Policy Blocked is terminal until user edits or changes action type.
