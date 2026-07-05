# Quickstart

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

You do not need an existing goal for this first proof. A new repo can validate successfully while `mdkg goal next` returns no node.

Expected receipt shape:

```text
mdkg status   -> status: ok
mdkg validate -> ok: true
```

If you want a deterministic example before modeling your own repo, run the [demo graph first-success path](../advanced-alpha/demo-graphs.md).

## Plan -> Work -> Evidence

After setup, inspect or create work. Replace `WORK_ID` and `GOAL_ID` with concrete ids from your repo:

```bash
mdkg search "goal"
mdkg goal next
mdkg goal next GOAL_ID
mdkg show WORK_ID
mdkg pack WORK_ID
```

Use `mdkg pack WORK_ID --profile concise` when you want a shorter transfer pack.

When a human or AI agent does work, record evidence before moving on:

```bash
mdkg task done TASK_ID --checkpoint "Done"
mdkg validate
```

For a bounded transfer between sessions, agents, or humans:

```bash
mdkg handoff create WORK_ID
```

Required checks in a goal are not executed automatically. Treat them as the checklist a human or agent must run, then record the evidence in a checkpoint, task note, or handoff.

## Git closeout

When an agent run is ready to become a Git checkpoint, keep the closeout
explicit:

```bash
mdkg validate
mdkg git closeout --json
mdkg git push-ready --remote origin --branch main --json
```

`mdkg git closeout` writes static JSON/Markdown receipts and seals DB snapshot
evidence when project DB state participated. `mdkg git push-ready` is read-only
and checks the explicit remote, branch, clean worktree, validation state, DB
snapshot state, and credential boundary. Run `mdkg git push ...` only when a
human or runtime has explicitly approved a real remote push.

## First principle

Use mdkg to make work state explicit. Let the repository, not a chat transcript, carry the durable plan, context, evidence, and closeout.

## If no work exists yet

If `mdkg goal next` returns no node in a fresh repo, that is not a failed setup. It usually means there is no active goal or executable work yet. Create a small task, then inspect and pack it:

```bash
mdkg new task "Fix quickstart copy" --json
mdkg show task-1
mdkg pack task-1
```

If your installed CLI produces a different id, use the id printed by the command receipt.

Expected result:

- `mdkg new task ... --json` prints the created task id.
- `mdkg show <created-id>` returns that task.
- `mdkg pack <created-id>` creates bounded context for a human or agent.
