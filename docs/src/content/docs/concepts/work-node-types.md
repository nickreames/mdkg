---
title: Work Node Types
description: How mdkg models planning, execution, and evidence as Markdown graph nodes.
---

mdkg uses familiar software delivery shapes as Markdown graph nodes.

Agents need more than files and prompts. They need bounded work, durable intent, evidence, and validation.

## Goal

A goal is a long-running objective. It owns the active-node route, scoped work, required checks, and closeout evidence.

Useful commands:

```bash
mdkg goal current
mdkg goal next GOAL_ID
mdkg goal claim GOAL_ID WORK_ID
```

Use goals when a task will span more than one concrete node or session. A good goal includes:

- a measurable goal condition
- `scope_refs` for executable work
- required checks
- stop conditions
- checkpoint requirements

`mdkg goal next` is read-only. `mdkg goal claim` records the chosen active node.

## Epic and feature

Epics and features group larger bodies of work. They help keep related tasks, tests, bugs, and checkpoints discoverable.

Use an epic for a capability area. Use a feature for a user-visible slice. Both help humans and agents understand why a concrete task exists.

## Task

A task is a concrete implementation unit. Use tasks for focused code, docs, graph, or operational changes.

```bash
mdkg task start TASK_ID
mdkg task done TASK_ID --checkpoint "Meaningful milestone"
```

## Bug

A bug records a defect or regression. It should include reproduction context and validation expectations.

## Test

A test node records proof work. Tests can represent automated checks, browser QA, migration smokes, or manual acceptance contracts.

Use test nodes when validation is important enough to track as work, not just a one-line command in a task body.

## Spike

A spike is actionable research or planning work. Spikes do not run research automatically; they capture questions, sources, findings, tradeoffs, recommendations, and follow-up nodes.

## Checkpoint

A checkpoint is evidence captured at a meaningful boundary. Good checkpoints summarize commands, pass/fail state, known warnings, changed surfaces, boundaries, and next refs.

```bash
mdkg checkpoint new "Browser QA proof" --kind test-proof
```

## Decision, PRD, EDD, and rule

Decision, PRD, EDD, and rule nodes are planning context. They can support a goal through `context_refs`, but they are not automatically executable work.

## How they fit

```text
goal
  epic
    feature
      task
      test
      bug
    spike
  checkpoint evidence
```

Agents should use `mdkg goal current`, `mdkg goal next`, `mdkg show`, and `mdkg pack WORK_ID` to discover bounded work instead of browsing the repo ad hoc.

## Common mistake

Do not put every related design or checkpoint in `scope_refs`. Scope is the executable queue. Put background documents in `context_refs` and proof in `evidence_refs`.
