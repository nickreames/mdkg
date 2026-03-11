---
name: verify-close-and-checkpoint
description: Verify code and mdkg state, attach evidence, and close work cleanly when the single-writer orchestrator is ready to perform durable writes.
tags: [stage:review, writer:orchestrator, mdkg, validation, release]
version: 0.1.0
authors: [mdkg]
links: [README.md, AGENT_PROMPT_SNIPPET.md]
---

# Goal

Finish work with evidence, validation, and minimal memory drift.

## When To Use

- After implementation
- Before commit
- Before marking a task done
- Before creating a checkpoint

## Inputs

- Active task id
- Test or build outputs
- Any new artifact references

## Steps

1. Run the relevant technical gates for the changed surface.
2. Run `mdkg validate` before closing the task.
3. Use `mdkg task update <id> ...` for additive evidence and metadata changes instead of hand-editing routine task fields.
4. Use `mdkg task done <id> --checkpoint "<title>"` when the task should close with milestone compression.
5. Batch durable mdkg writes at one boundary: task status, artifact refs, optional checkpoint, and commit.
6. Mark tasks done only after evidence exists.
7. Create a checkpoint only for milestone-level transitions, not every small step.
8. If the latest checkpoint is relevant, use it as durable recall; treat raw events as provenance/debugging, not primary execution context.
9. If provenance should be captured automatically, ensure `mdkg event enable` has already been run for the workspace.

## Outputs

- Verified mdkg graph state
- Attached evidence and artifact refs
- Task ready for review, done, or checkpointing
- One durable writer action at the selected run or milestone boundary

## Safety

- Do not mark work done without validation.
- Do not create checkpoint spam.
- Keep commits event-driven and single-writer when agents are involved.
- Only the orchestrator performs durable mdkg writes or commit/push actions.
- Never commit on every tool call.
- mdkg indexes and discovers skills, but does not execute skill scripts.

## Failure Handling

- If validation fails, stop and return the task to active work instead of closing it.
- If artifact or evidence refs are missing, attach them before status changes or checkpoint creation.
- If writer ownership is unclear, stop and resolve it before any durable mdkg update or commit.
