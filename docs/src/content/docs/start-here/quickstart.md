---
title: Quickstart
description: The first mdkg workflow for humans and AI agents.
---

The first path should be small, deterministic, and easy to review.

```bash
mdkg init --agent
mdkg index
mdkg status
mdkg validate
```

Then inspect or create work:

```bash
mdkg search "goal"
mdkg goal next
mdkg show <id>
mdkg pack <id>
```

When a human or AI agent does work, record evidence before moving on:

```bash
mdkg task done <id> --checkpoint "Meaningful milestone"
mdkg validate
```

For a bounded transfer between sessions, agents, or humans:

```bash
mdkg handoff create <id>
```

## First principle

Use mdkg to make work state explicit. Let the repository, not a chat transcript, carry the durable plan, context, evidence, and closeout.
