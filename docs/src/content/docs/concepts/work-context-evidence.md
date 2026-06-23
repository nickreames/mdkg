---
title: Work, Context, And Evidence
description: Separate executable scope from background context and proof.
---

mdkg separates actionable work from background context and proof.

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

- `scope_refs`: what is actionable.
- `context_refs`: what informs the work.
- `evidence_refs`: what proves or supports state.

This distinction helps agents avoid treating every related document as something to execute.
