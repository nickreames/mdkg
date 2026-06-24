# Quickstart

The first path should be small and deterministic.

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

Then inspect or create work. Replace `WORK_ID` and `GOAL_ID` with concrete ids from your repo:

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
