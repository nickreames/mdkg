---
name: select-work-and-ground-context
description: Select the right mdkg work item and ground execution before coding when the active task or context is still being established.
tags: [stage:plan, writer:read-only, mdkg, onboarding, context]
version: 0.2.0
authors: [mdkg]
links: [.mdkg/README.md]
---

# Purpose

Choose the correct work item and load the smallest deterministic context needed to act.

## When To Use

- At the start of a work session
- When the active task is unclear
- Before generating a pack or making code changes

## Bootstrap Discovery

Use the repository's AGENTS.md or CLAUDE.md entrypoint once. Compact installs
route through `.mdkg/AGENT_START.md`; legacy installs may retain a root
AGENT_START.md. Do not repeatedly load either router or the full command matrix.
Use `mdkg help <command>` for exact flags and `mdkg skill list/search/show`
for focused procedures. `.mdkg/README.md` is the portable workspace reference;
project README, LICENSE, and website discovery assets are separate surfaces.

Current user instructions define the assignment and authority. Graph history,
selected state, skills, and successful checks do not independently authorize
writes. An explicit instruction to Run a fully planned goal authorizes its
declared implementation and validation scope, subject to its exclusions and
custody checks; do not request the same approval again. Git, release, provider,
deployment, bundle, and cross-project actions require explicit inclusion or
separate approval.

## Inputs

- Current repo root
- Optional task or epic id
- Optional user goal in plain language

## Steps

1. If a task id is already known, inspect it with `mdkg show <id>`.
2. If a goal may be active, run `mdkg goal current`.
3. If a selected or unique active goal exists, use `mdkg goal next <goal-qid>` to surface one scoped feature, task, bug, or test before falling back to global work discovery.
4. If the task is not known and no goal is active, use focused startup discovery above, then `mdkg next` or `mdkg search "<query>"` to narrow candidates.
5. Use `mdkg show <id> --meta` when you only need the card and link metadata.
6. Confirm the selected node has the right constraints, related design docs, and current status.
7. If the task is ambiguous, resolve that before building a pack.
8. If the chosen task is ready to be claimed in a goal, hand off to `mdkg goal claim <goal-qid> <work-qid>` in the writer stage; otherwise hand off to `mdkg task start <id>` for task-like status changes.
9. If resuming closeout work for a feat or epic, inspect the latest relevant checkpoint before deciding what remains open.
10. Treat this stage as read-only: inspect and decide, but do not mutate mdkg state or commit.

## Outputs

- One selected node id
- Clear understanding of the active task, related docs, and current state
- No durable mdkg writes or commits from this stage

## Multi-Repo Grounding

- For root/subgraph work, inspect the root graph and each child graph read-only before choosing a mutation target.
- Collect a small matrix with repo path, git status, mdkg version, status, validation result, doctor result, and selected goal state.
- Treat dirty child repos as ownership boundaries; ask before mutating them or before refreshing root bundles from them.
- Prefer root-qualified qids in packs, handoffs, and cross-repo blockers so same-number child ids cannot be confused.
- Use compact diagnostics when available: `mdkg validate --summary --json --limit 20`, `mdkg validate --changed-only --json`, and `mdkg format --headings --dry-run --summary --json --limit 20`.

## Safety Rules

- Do not start coding from chat memory alone.
- Prefer explicit rules, EDDs, DECs, and task nodes over informal notes.
- If multiple tasks appear valid, stop and choose deliberately instead of guessing.
- If writer ownership or policy boundaries are unclear, stop and resolve them before execution.
- mdkg indexes and discovers skills, but does not execute skill scripts.
- Event logging is initialized by default in compact `mdkg init` repos; use `mdkg event enable` only if `events.jsonl` is missing.

## Failure Modes

- If no clear work item exists, stop and ask for clarification instead of guessing.
- If the selected task conflicts with current status or linked design docs, resolve the conflict before moving to pack generation.

## Required Capabilities

Local mdkg discovery and the explicitly authorized actions in the steps above.

## Resources Touched

Only the supplied workspace, scoped work item, and outputs identified above; no implicit remote or sibling access.

## Validation Checks

Confirm current command help, scoped authority, and the listed outputs. Run relevant technical and graph checks before durable closeout.

## Closeout Evidence

Record the input QID, scope, checks, changed paths or none, and remaining uncertainty.

## Related Manifests

None required for this generic procedure.

## Projection Targets

Canonical: `.mdkg/skills/select-work-and-ground-context/SKILL.md`. Configured native mirrors and public default seeds are derived copies.

## Open Questions

None for this bounded procedure. Route new policy or scope decisions to the owning work item.
