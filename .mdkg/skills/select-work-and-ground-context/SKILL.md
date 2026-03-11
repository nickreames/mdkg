---
name: select-work-and-ground-context
description: Select the right mdkg work item and ground execution before coding when the active task or context is still being established.
tags: [stage:plan, writer:read-only, mdkg, onboarding, context]
version: 0.1.0
authors: [mdkg]
links: [README.md, llms.txt, AGENT_PROMPT_SNIPPET.md]
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
2. If the task is not known, use `mdkg next` or `mdkg search "<query>"` to narrow candidates.
3. Use `mdkg show <id> --meta` when you only need the card and link metadata.
4. Confirm the selected node has the right constraints, related design docs, and current status.
5. If the task is ambiguous, resolve that before building a pack.
6. If the chosen task is ready to be claimed, hand off to `mdkg task start <id>` in the writer stage instead of editing markdown manually.
7. Treat this stage as read-only: inspect and decide, but do not mutate mdkg state or commit.

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
- Event logging is optional; use `mdkg event enable` before expecting automatic JSONL provenance from later mutation commands.

## Failure Handling

- If no clear work item exists, stop and ask for clarification instead of guessing.
- If the selected task conflicts with current status or linked design docs, resolve the conflict before moving to pack generation.
