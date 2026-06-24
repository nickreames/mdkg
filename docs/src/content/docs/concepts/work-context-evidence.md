---
title: Reference Types
description: Separate executable scope from background context and proof.
---

mdkg separates actionable work from background context and proof. These refs can appear on goals and other work nodes.

```yaml
scope_refs:
  - task-12
context_refs:
  - dec-3
  - prd-1
evidence_refs:
  - chk-8
  - archive://release.audit
```

- `scope_refs`: executable work scope. Goal routing can use these refs.
- `context_refs`: background plans, decisions, prior goals, subgraph qids, or URI refs that inform work.
- `evidence_refs`: checkpoints, receipts, audits, archives, and artifacts that prove or support state.

This distinction helps agents avoid treating every related document as something to execute.
