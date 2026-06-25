---
title: Plan -> Work -> Evidence
description: The core mdkg operating model for AI coding agents.
---

Plan -> Work -> Evidence is the public mdkg workflow.

Plan the goal. Execute one work node. Record evidence. Validate before moving on.

<div class="pwe-flow" role="img" aria-label="Plan creates goals and context, Work selects one task, Evidence records proof, and Validate checks the graph before routing the next item.">
  <div class="pwe-step">
    <strong>Plan</strong>
    <span>Define the goal, scope, context, checks, and stop conditions.</span>
  </div>
  <div class="pwe-arrow" aria-hidden="true">→</div>
  <div class="pwe-step">
    <strong>Work</strong>
    <span>Claim one executable task, test, bug, or spike.</span>
  </div>
  <div class="pwe-arrow" aria-hidden="true">→</div>
  <div class="pwe-step">
    <strong>Evidence</strong>
    <span>Record checkpoints, receipts, packs, and handoff summaries.</span>
  </div>
  <div class="pwe-arrow" aria-hidden="true">→</div>
  <div class="pwe-step">
    <strong>Validate</strong>
    <span>Run checks, fix issues, and route the next node.</span>
  </div>
</div>

## Plan

Planning nodes capture durable intent before an agent starts editing:

- goals
- epics
- product requirements
- engineering designs
- decisions
- rules

These nodes explain what matters, why it matters, and which boundaries should not be crossed.

Minimal goal frontmatter:

```yaml
---
id: goal-1
type: goal
title: Complete release validation
status: todo
priority: 1
goal_state: active
active_node: task-1
scope_refs:
  - task-1
  - test-1
context_refs:
  - dec-1
required_checks:
  - npm run test
  - mdkg validate
---
```

## Work

Work nodes are the units humans and agents can act on:

- features
- tasks
- bugs
- tests
- research spikes

Use `mdkg goal next` to select one scoped work item and `mdkg pack WORK_ID` to build bounded context for it.

Minimal task frontmatter:

```yaml
---
id: task-1
type: task
title: Run release validation
status: todo
priority: 1
parent: goal-1
blocked_by: []
context_refs:
  - prd-1
evidence_refs: []
---
```

## Evidence

Evidence records why the current state is safe to continue from:

- checkpoints
- receipts
- archive sidecars
- validation output
- handoff summaries

Good evidence includes commands run, pass/fail state, known warnings, boundaries, and follow-up refs.

## Validate

Validation closes the loop:

```bash
mdkg validate
mdkg doctor --strict --json
```

mdkg does not run goal checks automatically. A human or agent runs the required checks, records the evidence, and then routes the next node.

## Common mistakes

- Treating `scope_refs` as a reading list. Scope is the executable queue; use `context_refs` for plans and `evidence_refs` for proof.
- Claiming a node before reading the pack. Read first, claim only when accepting the work.
- Marking work done before running the required checks. Close with evidence after validation.
- Storing raw prompts, tokens, provider payloads, or bulky logs in Markdown nodes. Summarize and link to safe evidence refs.

<style>
  .pwe-flow {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr);
    gap: 0.75rem;
    align-items: stretch;
    margin: 1.5rem 0;
  }

  .pwe-step {
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 0.5rem;
    padding: 1rem;
    background: var(--sl-color-bg-nav);
  }

  .pwe-step strong {
    display: block;
    margin-bottom: 0.35rem;
    color: var(--sl-color-white);
  }

  .pwe-step span {
    display: block;
    font-size: 0.92rem;
    line-height: 1.45;
  }

  .pwe-arrow {
    display: grid;
    place-items: center;
    color: var(--sl-color-accent-high);
    font-weight: 700;
  }

  @media (max-width: 820px) {
    .pwe-flow {
      grid-template-columns: 1fr;
    }

    .pwe-arrow {
      transform: rotate(90deg);
      min-height: 1rem;
    }
  }
</style>
