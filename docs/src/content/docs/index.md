---
title: Markdown Knowledge Graph Docs
description: Start here for Markdown Knowledge Graph documentation.
---

Markdown Knowledge Graph (`mdkg`) is git-native project memory for AI coding agents and AI-assisted software engineering.

Use these docs to install mdkg, initialize a repo, model goals and work nodes, build deterministic context packs, create handoffs, record evidence, and validate before closeout.

## The shortest path

1. [Install mdkg](/start-here/install/).
2. [Run the quickstart](/start-here/quickstart/).
3. Learn [Plan -> Work -> Evidence](/concepts/plan-work-evidence/).
4. Give an agent one bounded [work node](/concepts/work-node-types/).
5. Transfer context with [packs and handoffs](/guides/packs-and-handoffs/).
6. Record checkpoint evidence and validate before moving on.

```bash
mdkg init --agent
mdkg index
mdkg status
mdkg validate
```

## For agents

Start read-only, then claim one scoped node only when you are ready to mutate state:

```bash
mdkg goal current
mdkg goal next
mdkg show WORK_ID
mdkg pack WORK_ID
mdkg goal claim GOAL_ID WORK_ID
```

`mdkg goal next` is read-only. `mdkg goal claim` mutates the selected goal's active node.

## Core concepts

- Markdown and Git remain the source of truth.
- Goals, epics, tasks, bugs, tests, spikes, and checkpoints give work durable shape.
- `scope_refs`, `context_refs`, and `evidence_refs` keep executable work separate from background knowledge and proof.
- Context packs and handoffs transfer bounded work instead of raw chat history.
- Validation and doctor checks make graph state reviewable before closeout.

## When to keep reading

- Read [Repository Layout](/concepts/repository-layout/) before committing `.mdkg/` changes.
- Read [Safety Boundaries](/start-here/safety-boundaries/) before putting private runtime context into graph nodes.
- Read [CLI Reference](/reference/) when you need the current command shape.

## Public alpha boundary

These docs describe current public-alpha capabilities. They do not claim hosted queues, worker execution, public event/reducer/lease/materializer CLI surfaces, or comprehensive secret scanning.
