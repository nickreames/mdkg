---
title: Quickstart
description: The first mdkg workflow for humans and AI agents.
---

The first path should be small, deterministic, and easy to review.

## First-run setup

Install mdkg first if needed:

```bash
npm install -g mdkg
mdkg --version
```

Then initialize and validate the repo memory layer:

```bash
mdkg init --agent
mdkg index
mdkg status
mdkg validate
```

Typical outputs:

- `mdkg init --agent` creates `.mdkg/` and agent-facing startup files.
- `mdkg index` rebuilds generated search and capability caches.
- `mdkg status` summarizes git, graph, selected goal, cache, and DB health.
- `mdkg validate` reports graph errors and warning categories.

## Plan -> Work -> Evidence

After setup, inspect or create work. Replace `WORK_ID` and `GOAL_ID` with concrete ids from your repo:

```bash
mdkg search "goal"
mdkg goal next
mdkg goal next GOAL_ID
mdkg show WORK_ID
mdkg pack WORK_ID
```

Use `mdkg pack WORK_ID --pack-profile concise` when you want a shorter transfer pack.

When a human or AI agent does work, record evidence before moving on:

```bash
mdkg task done TASK_ID \
  --checkpoint "Done"
mdkg validate
```

For a bounded transfer between sessions, agents, or humans:

```bash
mdkg handoff create WORK_ID
```

Required checks in a goal are not executed automatically. Treat them as the checklist a human or agent must run, then record the evidence in a checkpoint, task note, or handoff.

## First principle

Use mdkg to make work state explicit. Let the repository, not a chat transcript, carry the durable plan, context, evidence, and closeout.

## If no work exists yet

Create a small task, then inspect and pack it:

```bash
mdkg new task "Fix quickstart copy" --json
mdkg show task-1
mdkg pack task-1
```

If your installed CLI produces a different id, use the id printed by the command receipt.
