---
title: Agent Workflow
description: A safe mdkg loop for repo-scoped AI agents.
---

Agents should start with repo-owned guidance instead of guessing.

If you are still choosing between the human and agent first-run paths, start at the [docs overview](/). This page is the longer operating loop for agents after that initial routing decision.

## Canonical agent path

1. Read `AGENT_START.md`.
2. Run `mdkg status`.
3. Inspect the current goal with `mdkg goal current`.
4. Run `mdkg goal next`.
5. Show and pack one work node with `mdkg show WORK_ID` and `mdkg pack WORK_ID`.
6. Do work outside mdkg.
7. Record evidence with checkpoints, handoffs, or task updates.
8. Validate with `mdkg validate` before closeout.

This is the same path exposed in [`llms.txt`](https://mdkg.dev/llms.txt) for agents that start from the public site instead of a checked-out repository.

Copy this into an agent session when you want a repo-scoped implementation run:

```text
Start by reading AGENT_START.md and the current mdkg goal.
Run mdkg goal current, mdkg goal next, mdkg show WORK_ID, and mdkg pack WORK_ID before editing.
Use mdkg goal claim GOAL_ID WORK_ID only after accepting the work item.
Run the required checks yourself.
Record a checkpoint with commands, pass/fail state, known warnings, and boundaries.
Do not store raw secrets, tokens, private prompts, provider payloads, or bulky runtime traces in mdkg nodes.
```

```bash
mdkg status
mdkg goal current
mdkg goal next
mdkg pack WORK_ID
mdkg goal claim GOAL_ID WORK_ID
```

Important rules:

- `goal next` is read-only.
- `goal claim` mutates active goal state.
- `task start` and `task done` mutate lifecycle fields.
- Required checks are guidance; agents must run them and record evidence.
- `scope_refs` are executable goal scope; `context_refs` and `evidence_refs` are not automatically actionable.
- Subgraph qids are read-only planning context unless you are working in the owning repo.
- Do not store raw secrets, unredacted prompt text, tokens, provider payloads, or bulky runtime traces in mdkg nodes.

## Command boundaries

Read-only commands are safe for initial grounding:

`mdkg status`
: Summarizes repo health, git state, selected goal state, generated cache state, and optional project DB state.

`mdkg goal current`
: Shows the selected goal without changing graph state.

`mdkg goal next`
: Routes to the next actionable item without claiming it.

`mdkg show WORK_ID`
: Reads one node by id or qid.

Generated-output commands write derived files, not durable source by themselves:

`mdkg pack WORK_ID`
: Writes or previews a context pack. Review pack visibility before sharing it outside the repo.

Mutating commands change graph lifecycle or evidence:

`mdkg goal claim GOAL_ID WORK_ID`
: Updates the goal's active node. Use it only after accepting one scoped item.

`mdkg task start TASK_ID`
: Marks a task-like node in progress.

`mdkg task done TASK_ID --checkpoint "..."`
: Marks the task-like node done and writes checkpoint evidence. Use meaningful checkpoint names and include commands, pass/fail state, known warnings, and follow-up refs.

Beginner safety rule: run the read-only commands first, make the code or docs change outside mdkg, then mutate mdkg state only when you have evidence.

Close work with evidence:

```bash
mdkg task done TASK_ID --checkpoint "Meaningful milestone"
mdkg validate
```

For a larger implementation goal:

1. Claim one scoped node.
2. Build context with `mdkg pack WORK_ID`.
3. Make the code, docs, or graph changes outside mdkg.
4. Run the checks listed by the goal or task.
5. Record a checkpoint with commands, pass/fail state, known warnings, and follow-up refs.
6. Route again with `mdkg goal next GOAL_ID`.

## Multi-repo rule

When a parent repo uses subgraphs, mutate the child repo in the child checkout first. Commit accepted child changes before refreshing a parent-owned bundle snapshot. Root-qualified qids help avoid confusing same-number nodes across repos.
