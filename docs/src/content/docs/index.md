---
title: Markdown Knowledge Graph Docs
description: Start here for Markdown Knowledge Graph documentation.
---

Markdown Knowledge Graph (`mdkg`) is git-native project memory for AI coding agents and AI-assisted software engineering.

Use these docs to install mdkg, initialize a repo, model goals and work nodes, build deterministic context packs, create handoffs, record evidence, and validate before closeout.

## Choose your first path

Start with the path that matches how you entered the project. Both paths converge on the same operating model: Plan -> Work -> Evidence.

## Human quickstart

Use this path when you are setting up mdkg or deciding how to introduce it to a repo.

1. [Install mdkg](/start-here/install/).
2. [Run the quickstart](/start-here/quickstart/).
3. Optional: prove the [demo graph first-success path](/advanced-alpha/demo-graphs/).
4. Learn [work node types](/concepts/work-node-types/).
5. Transfer context with [packs and handoffs](/guides/packs-and-handoffs/).

```bash
npm install -g mdkg
mdkg init --agent
mdkg index
mdkg status
mdkg validate
```

## Agent quickstart

Use this path when a coding agent enters a repo that already has mdkg.

1. Read `AGENT_START.md`.
2. Run `mdkg status`.
3. Inspect the current goal with `mdkg goal current`.
4. Route with `mdkg goal next`.
5. Show and pack one work node with `mdkg show WORK_ID` and `mdkg pack WORK_ID`.
6. Do work outside mdkg.
7. Record evidence with checkpoints, handoffs, or task updates.
8. Validate with `mdkg validate` before closeout.

Replace `WORK_ID` with the concrete id returned by search or routing commands:

```bash
mdkg status
mdkg goal current
mdkg goal next
mdkg show WORK_ID
mdkg pack WORK_ID
mdkg validate
```

Start read-only. Claim one scoped node only when you are ready to mutate state:

`mdkg goal next` is read-only. `mdkg goal claim GOAL_ID WORK_ID` mutates the selected goal's active node after you accept the work item.

For the longer agent operating loop, read [Agent Workflow](/guides/agent-workflow/).

## Where to go next

- [Install](/start-here/install/): requirements, global install, and first validation.
- [Quickstart](/start-here/quickstart/): the smallest Plan -> Work -> Evidence loop.
- [Demo Graphs](/advanced-alpha/demo-graphs/): a deterministic local first-success fixture.
- [Work Node Types](/concepts/work-node-types/): goals, epics, tasks, tests, spikes, checkpoints, and decisions.
- [Packs And Handoffs](/guides/packs-and-handoffs/): bounded context for humans and agents.
- [Agent Workflow](/guides/agent-workflow/): repo-scoped agent startup, claim, evidence, and validation.
- [Advanced Alpha](/advanced-alpha/overview/): subgraphs, bundles, read-only MCP, graph movement, and queues.
- [CLI Reference](/reference/): command selection and generated command details.

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
