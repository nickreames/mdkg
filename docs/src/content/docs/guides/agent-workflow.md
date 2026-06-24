---
title: Agent Workflow
description: A safe mdkg loop for repo-scoped AI agents.
---

Agents should start with repo-owned guidance instead of guessing.

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

| Command | Boundary |
|---|---|
| `mdkg status` | read-only |
| `mdkg goal current` | read-only |
| `mdkg goal next` | read-only |
| `mdkg show WORK_ID` | read-only |
| `mdkg pack WORK_ID` | writes generated pack output |
| `mdkg goal claim GOAL_ID WORK_ID` | mutates selected goal active-node state |
| `mdkg task start TASK_ID` | mutates task lifecycle state |
| `mdkg task done TASK_ID --checkpoint "..."` | mutates task lifecycle state and writes checkpoint evidence |

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
