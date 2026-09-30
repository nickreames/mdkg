---
name: build-pack-and-execute-task
description: Build a deterministic mdkg pack for the active work item and use it as the execution handoff when coding or delegating to another AI agent.
tags: [stage:execute, writer:patch-only, mdkg, pack-first, context]
version: 0.2.1
authors: [mdkg]
links: [.mdkg/README.md]
---

# Purpose

Use `mdkg pack <id>` as the default execution context instead of ad-hoc file gathering.

## When To Use

- Before coding
- Before handing work to another AI agent
- Before review when precise linked context matters

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

- Selected node id
- Optional profile choice
- Optional skills inclusion mode

## Steps

1. Start with `mdkg pack <id>`.
2. For a preview, use `mdkg pack <id> --pack-profile concise --dry-run --stats`.
3. Use `--verbose` only when pinned core docs must be included in the pack body.
4. Use `--skills auto` when the work item already references the right skills.
5. Use `--skills-depth full` only for active execution, not early discovery.
6. Discover skills by metadata first; load full skill bodies only for the selected execution procedures.
7. Hand the pack, not a loose file list, to the next coding step or agent.
   For test selection, use the Selective Test Execution and Readiness Gates in
   `verify-close-and-checkpoint`: focused regression and positive controls
   during iteration, broader checks for shared/uncertain effects, full checks
   before pre-merge or pre-publish readiness. Preserve explicit task gates.
8. Keep this stage patch-only: subagents and tools may produce patches, test output, and evidence, but not direct mdkg state writes or commits.
9. If execution creates or changes archive sidecars, raw source files, or bundle-relevant graph state, hand that to the orchestrator stage for separately authorized archive/bundle refresh; do not infer that authority from the patch-only stage.
10. If execution reveals new artifacts or blockers, hand them to the orchestrator stage for `mdkg task update ...` as structured field updates; keep narrative summaries in markdown.

## Outputs

- Deterministic pack file or dry-run selection report
- Stable context bundle for execution or review
- Patch bundles, test output, or evidence artifacts ready for orchestrator review

## Safety Rules

- Prefer smaller packs first; expand only when the task requires it.
- Keep pinned rules ahead of opportunistic context.
- Do not treat raw event logs as primary execution context.
- Do not mutate task status, create checkpoints, or commit from this stage.
- mdkg indexes and discovers skills, but does not execute skill scripts.
- If event logging is enabled, rely on later task/checkpoint commands to append baseline events instead of writing ad-hoc log entries here.

## Failure Modes

- If the pack is too broad, reduce profile or skill depth before continuing.
- If the required procedure is unclear, return to metadata discovery instead of loading every skill body.
- If execution requires a durable memory update, hand control back to the orchestrator stage instead of writing directly.

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

Canonical: `.mdkg/skills/build-pack-and-execute-task/SKILL.md`. Configured native mirrors and public default seeds are derived copies.

## Open Questions

None for this bounded procedure. Route new policy or scope decisions to the owning work item.
