# Reference Types

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

- `scope_refs`: executable work scope.
- `context_refs`: background information that informs work.
- `evidence_refs`: proof that supports state.

This distinction helps agents avoid treating every related document as something to execute.
