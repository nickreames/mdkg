---
name: build-pack-and-execute-task
description: Build a deterministic mdkg pack for the active work item and use it as the execution handoff when coding or delegating to another AI agent.
tags: [stage:execute, writer:patch-only, mdkg, pack-first, context]
version: 0.1.0
authors: [mdkg]
links: [README.md, PACK_EXAMPLES.md, llms.txt]
---

# Goal

Use `mdkg pack <id>` as the default execution context instead of ad-hoc file gathering.

## When To Use

- Before coding
- Before handing work to another AI agent
- Before review when precise linked context matters

## Inputs

- Selected node id
- Optional profile choice
- Optional skills inclusion mode

## Steps

1. Start with `mdkg pack <id>`.
2. For a preview, use `mdkg pack <id> --profile concise --dry-run --stats`.
3. Use `--verbose` only when pinned core docs must be included in the pack body.
4. Use `--skills auto` when the work item already references the right skills.
5. Use `--skills-depth full` only for active execution, not early discovery.
6. Discover skills by metadata first; load full skill bodies only for the selected execution procedures.
7. Hand the pack, not a loose file list, to the next coding step or agent.
8. Keep this stage patch-only: subagents and tools may produce patches, test output, and evidence, but not direct mdkg state writes or commits.
9. If execution reveals new artifacts or blockers, hand them to the orchestrator stage for `mdkg task update ...` rather than editing markdown directly.

## Outputs

- Deterministic pack file or dry-run selection report
- Stable context bundle for execution or review
- Patch bundles, test output, or evidence artifacts ready for orchestrator review

## Safety

- Prefer smaller packs first; expand only when the task requires it.
- Keep pinned rules ahead of opportunistic context.
- Do not treat raw event logs as primary execution context.
- Do not mutate task status, create checkpoints, or commit from this stage.
- mdkg indexes and discovers skills, but does not execute skill scripts.
- If event logging is enabled, rely on later task/checkpoint commands to append baseline events instead of writing ad-hoc log entries here.

## Failure Handling

- If the pack is too broad, reduce profile or skill depth before continuing.
- If the required procedure is unclear, return to metadata discovery instead of loading every skill body.
- If execution requires a durable memory update, hand control back to the orchestrator stage instead of writing directly.
