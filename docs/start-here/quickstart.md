# Quickstart

The first path should be small and deterministic.

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

For a bounded transfer between sessions or agents:

```bash
mdkg handoff create <id>
```
