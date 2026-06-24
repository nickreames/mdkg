---
title: Plan -> Work -> Evidence
description: The core mdkg operating model for AI coding agents.
---

Plan -> Work -> Evidence is the public mdkg workflow.

Plan the goal. Execute one work node. Record evidence. Validate before moving on.

## Plan

Planning nodes capture durable intent before an agent starts editing:

- goals
- epics
- product requirements
- engineering designs
- decisions
- rules

These nodes explain what matters, why it matters, and which boundaries should not be crossed.

## Work

Work nodes are the units humans and agents can act on:

- features
- tasks
- bugs
- tests
- research spikes

Use `mdkg goal next` to select one scoped work item and `mdkg pack WORK_ID` to build bounded context for it.

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
