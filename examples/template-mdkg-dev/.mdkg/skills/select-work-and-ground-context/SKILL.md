---
name: select-work-and-ground-context
description: Select the right mdkg work item and ground execution before coding when the active task or context is still being established.
tags: [stage:plan, writer:read-only, mdkg, onboarding, context]
version: 0.1.0
authors: [mdkg]
links: [AGENT_START.md, README.md, CLI_COMMAND_MATRIX.md]
---

# Goal

Choose the correct work item and load the smallest deterministic context needed to act.

## When To Use

- At the start of a work session
- When the active task is unclear
- Before generating a pack or making code changes

## Inputs

- Current repo root
- Optional task or epic id
- Optional user goal in plain language

## Steps

1. If a task id is already known, inspect it with `mdkg show <id>`.
2. If a goal may be active, run `mdkg goal current`.
3. If a selected or unique active goal exists, use `mdkg goal next` to surface one scoped feature, task, bug, or test before falling back to global work discovery.
4. If the task is not known and no goal is active, read `AGENT_START.md` and use `mdkg next` or `mdkg search "<query>"` to narrow candidates.
5. Use `mdkg show <id> --meta` when you only need the card and link metadata.
6. Confirm the selected node has the right constraints, related design docs, and current status.
7. If the task is ambiguous, resolve that before building a pack.
8. If the chosen task is ready to be claimed in a goal, hand off to `mdkg goal claim <id>` in the writer stage; otherwise hand off to `mdkg task start <id>` for task-like status changes.
9. If resuming closeout work for a feat or epic, inspect the latest relevant checkpoint before deciding what remains open.
10. Treat this stage as read-only: inspect and decide, but do not mutate mdkg state or commit.

## Outputs

- One selected node id
- Clear understanding of the active task, related docs, and current state
- No durable mdkg writes or commits from this stage

## Safety

- Do not start coding from chat memory alone.
- Prefer explicit rules, EDDs, DECs, and task nodes over informal notes.
- If multiple tasks appear valid, stop and choose deliberately instead of guessing.
- If writer ownership or policy boundaries are unclear, stop and resolve them before execution.
- mdkg indexes and discovers skills, but does not execute skill scripts.
- Event logging is committed by default in `init --agent` repos; use `mdkg event enable` only if `events.jsonl` is missing.

## Failure Handling

- If no clear work item exists, stop and ask for clarification instead of guessing.
- If the selected task conflicts with current status or linked design docs, resolve the conflict before moving to pack generation.
