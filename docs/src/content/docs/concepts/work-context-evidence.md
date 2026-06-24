---
title: Reference Types
description: Separate executable scope from background context and proof.
---

mdkg separates actionable work from background context and proof. These refs can appear on goals and other work nodes.

```yaml
---
id: goal-2
type: goal
title: Complete docs launch proof
status: todo
priority: 1
goal_state: active
active_node: task-12
scope_refs:
  - task-12
  - test-7
context_refs:
  - dec-3
  - prd-1
  - sibling_repo:goal-4
evidence_refs:
  - chk-8
  - archive://release.audit
---
```

- `scope_refs`: executable work scope. Goal routing can use these refs.
- `context_refs`: background plans, decisions, prior goals, subgraph qids, or URI refs that inform work.
- `evidence_refs`: checkpoints, receipts, audits, archives, and artifacts that prove or support state.

This distinction helps agents avoid treating every related document as something to execute.

## Use `scope_refs` for work to do

Good scope refs are concrete local work nodes:

- tasks
- bugs
- tests
- features
- spikes

Epics organize the scope, but they are not the executable work returned by `mdkg goal next`.

## Use `context_refs` for knowledge

Context refs answer "what should the agent know before editing?"

Examples:

- product requirements
- engineering design docs
- decisions
- prior goals
- read-only subgraph qids
- archive source evidence

## Use `evidence_refs` for proof

Evidence refs answer "why do we believe this state is safe?"

Examples:

- checkpoint nodes
- archived source bundles
- generated receipts
- Browser QA evidence
- release or validation summaries

## Review refs

Use graph refs to inspect inbound and outbound relationships without mutating state:

```bash
mdkg graph refs WORK_ID --json
```

If `mdkg goal next` warns that a scoped ref is non-actionable, move the ref to `context_refs` or `evidence_refs` unless it truly should be executable work.

## Common mistakes

- Using `scope_refs` as a reading list. Keep scope for local executable nodes.
- Blocking local work on a read-only subgraph qid without explaining who owns the unblock.
- Putting checkpoint ids in `context_refs` when they are proof. Use `evidence_refs`.
- Linking raw evidence directly in a node body. Prefer checkpoint summaries and sanitized archive or artifact refs.
