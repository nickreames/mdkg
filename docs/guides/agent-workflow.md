# Agent Workflow

Agents should start with repo-owned guidance instead of guessing.

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

## Common mistakes

- Starting edits before reading repo instructions, current goal state, and one scoped pack.
- Treating `mdkg goal next` as a claim. Claim only after accepting the node.
- Closing a task without command evidence in the checkpoint.
- Mutating a child repo from a parent orchestration context.
- Copying raw prompts, provider payloads, or secrets into checkpoints or handoffs.
