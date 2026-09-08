---
title: Agent Workflow
description: A safe mdkg loop for repo-scoped AI agents.
---

Agents should start with repo-owned guidance instead of guessing.

If you are still choosing between the human and agent first-run paths, start at the [docs overview](/). This page is the longer operating loop for agents after that initial routing decision.

## Canonical agent path

1. Read root `AGENTS.md` or `CLAUDE.md`; compact installs route to
   `.mdkg/AGENT_START.md`. Legacy installs may retain root `AGENT_START.md`.
2. Run `mdkg status`.
3. Inspect the current goal with `mdkg goal current`.
4. Ground the explicitly authorized goal with `mdkg goal next GOAL_ID`.
5. Show and pack one work node with `mdkg show WORK_ID` and `mdkg pack WORK_ID`.
6. Do work outside mdkg.
7. Record evidence with checkpoints, handoffs, or task updates.
8. Validate with `mdkg validate` before closeout.

The selected goal is a hint, not execution authority. Current user instructions
define the assignment; graph history and skills provide context and conventions.
Use `mdkg skill search "task topic"` and `mdkg skill show SKILL_SLUG` for focused
procedures, and focused help such as `mdkg pack --help` for exact flags. Replace
`SKILL_SLUG` with the relevant skill slug. Do not repeatedly load the entire handbook.

The website's [`llms.txt`](https://mdkg.dev/llms.txt) is public discovery, separate
from generated `.mdkg/llms.txt` and repo-owned instructions. Neither grants
permission to edit a checkout or execute a selected goal.

Copy this into an agent session when you want a repo-scoped implementation run. Replace uppercase placeholders with concrete ids from your repo:

```text
Start with AGENTS.md or CLAUDE.md and follow its router once.
Inspect mdkg goal current as a hint; use the explicitly authorized GOAL_ID.
Run mdkg goal next GOAL_ID and mdkg show WORK_ID; discover focused skills.
Preview context with mdkg pack WORK_ID --dry-run before editing.
Use mdkg goal claim GOAL_ID WORK_ID only after accepting the work item.
Run the required checks yourself.
Record a checkpoint with commands, pass/fail state, known warnings, and boundaries.
Do not store raw secrets, tokens, private prompts, provider payloads, or bulky runtime traces in mdkg nodes.
```

Replace `WORK_ID` and `GOAL_ID` with ids returned by the read-only routing commands:

```bash
mdkg status
mdkg goal current
mdkg goal next GOAL_ID
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

Beginner safety rule: ground context read-only, establish approved scope and
ownership, then start the task and do the work. Record checks and evidence before
closing it. A fully planned goal's explicit run authorizes only its declared
actions; commits, pushes, publication and cross-project actions require explicit
inclusion or separate approval.

## Contract-profile metadata

Agent workflow files may include optional generic profile metadata when a
downstream runtime needs a clearer semantic mirror:

- `contract_profile` on MANIFEST, WORK, WORK_ORDER, and RECEIPT
- `validation_policy_ref` and `evidence_policy_ref` on MANIFEST, WORK_ORDER, and RECEIPT
- `receipt_kind` and `redaction_class` on RECEIPT only

These fields are separate from MANIFEST `resource_profile`, WORK `kind`,
WORK_ORDER `artifact_policy`, RECEIPT `redaction_policy`, and pack/bundle
`--profile` flags. Generic validation accepts well-shaped custom values with
warnings for unknown profiles, receipt kinds, or redaction classes. Use
`mdkg validate --profile omni-room` or
`mdkg work validate --profile omni-room` when you need explicit profile checks.
The bare field name `profile` is ambiguous and is diagnosed rather than treated
as an alias.

mdkg owns the generic mirror fields and validation. Omni Room and other
downstream runtimes own runtime policy, queue execution, final receipt
normalization, and downstream adoption.

Close work with evidence. Use the concrete `TASK_ID` from the work item you are closing:

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

## Common mistakes

- Starting edits before following the repo's compact or legacy router, grounding
  the authorized goal and inspecting one scoped context pack.
- Treating `mdkg goal next` as a claim. It is read-only; use `mdkg goal claim GOAL_ID WORK_ID` only after accepting the node.
- Closing a task with "tests passed" when no command evidence is recorded. Include commands, pass/fail state, known warnings, and boundaries in the checkpoint.
- Mutating a child repo from a parent orchestration context. Work in the owning repo, commit accepted child changes, then refresh the parent bundle.
- Copying raw prompts, provider payloads, or secrets into checkpoints or handoffs. Keep evidence summarized and refs-only.
