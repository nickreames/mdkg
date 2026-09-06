---
name: verify-close-and-checkpoint
description: Verify code and mdkg state, attach evidence, and close work cleanly when the single-writer AI agent or human orchestrator is ready to perform durable writes.
tags: [stage:review, writer:orchestrator, mdkg, validation, evidence]
version: 0.2.0
authors: [mdkg]
links: [.mdkg/README.md]
---

# Purpose

Finish work with evidence, validation, and minimal memory drift.

## When To Use

- After implementation
- Before commit
- Before marking a task done
- Before creating a checkpoint

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

- Active task id
- Test or build outputs
- Any new artifact references

## Steps

1. Run the relevant technical gates for the changed surface.
2. Run `mdkg validate` before closing the task.
3. For scaffold work, preview `mdkg upgrade --json`. Apply only a safe reviewed
   receipt with `mdkg upgrade --apply --plan-hash <sha256>` in an authorized
   fixture or checkout. Include package smoke evidence when in scope.
4. Use `mdkg task update <id> ...` for additive evidence and structured metadata changes; keep narrative/body edits in markdown.
5. When pursuing a goal, record evidence on the active node and summarize goal evidence before running `mdkg goal evaluate <goal-id>`.
6. Use `mdkg task done <id> --checkpoint "<title>"` when the task should close with milestone compression.
7. Batch durable mdkg writes at one boundary: task status, artifact refs, optional checkpoint, goal evidence, and a commit only when explicitly authorized.
8. Mark tasks done only after evidence exists.
9. Create a checkpoint only for milestone-level transitions, not every small step.
10. For feat or epic closeout, prefer a checkpoint body as the durable narrative summary of what changed and what is next.
11. Use feat closeout scope as direct children with `parent: <feat-id>` and epic closeout scope as descendant work with `epic: <epic-id>`.
12. Parent status edits remain manual; do not invent a hidden parent-closeout workflow.
13. If the latest checkpoint is relevant, use it as durable recall; treat raw events as provenance/debugging, not primary execution context.
14. If `events.jsonl` is missing, recreate it with `mdkg event enable` before expecting automatic JSONL provenance.

## Authority-Separated Release Handoff

Publication, push, tag, deployment, provider mutation, registry access, and
credential handling are separate authority surfaces. This portable closeout
skill does not prescribe or perform them.

1. Record which validated local commit and evidence would support a later
   release-specific workflow.
2. Confirm that the current work item actually owns any release handoff; do not
   infer publication authority from successful local validation or checkpoint
   creation.
3. Hand off to a repository-owned release skill or explicit release task when
   one exists. Keep release commands, authentication procedures, provider
   operations, and product-specific gates in that repository-local workflow.
4. If no authorized release workflow exists, stop after local closeout and
   report the exact remaining authority and evidence requirements.

## Bundle-Aware Commit Gate

When the approved commit scope includes tracked archive caches or bundles,
refresh and verify them before staging. If refresh is withheld, preserve their
bytes and report the freshness gap; this skill does not override that exclusion.

```bash
mdkg archive compress --all
mdkg archive verify --json
mdkg bundle create --profile private
mdkg bundle verify .mdkg/bundles/private/all.mdkg.zip
```

Run these commands only with explicit archive/bundle authority and relevant tracked assets. Use `--profile public` or `mdkg pack --visibility public` only for explicit export-safe output after public workspace, archive, and import visibility has been reviewed.

## Multi-Repo Closeout Gate

Use this order for root orchestration, child repo upgrades, and subgraph refresh work:

1. Gather read-only baselines for every involved repo before mutation.
2. Get one explicit approval matrix for which repos may be updated.
3. Apply and validate one repo at a time.
4. Commit accepted child repo mdkg-only changes locally before root subgraph sync.
5. Sync root-owned bundles only from clean child commits and record the child commit id in the root evidence.
6. Run root subgraph audit or verify after bundle refresh.
7. Keep handoffs refs-only and sanitized; never copy raw secrets, tokens, prompts, provider payloads, or unrelated raw runtime payloads into checkpoints or packs.

## Outputs

- Verified mdkg graph state
- Attached evidence and artifact refs
- Task ready for review, done, or checkpointing
- One durable writer action at the selected run or milestone boundary

## Safety Rules

- Do not mark work done without validation.
- Do not create checkpoint spam.
- Keep commits event-driven and single-writer when agents are involved.
- Only the orchestrator performs durable mdkg writes or commit/push actions.
- Never commit on every tool call.
- mdkg indexes and discovers skills, but does not execute skill scripts.

## Failure Modes

- If validation fails, stop and return the task to active work instead of closing it.
- If artifact or evidence refs are missing, attach them before status changes or checkpoint creation.
- If writer ownership is unclear, stop and resolve it before any durable mdkg update or commit.

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

Canonical: `.mdkg/skills/verify-close-and-checkpoint/SKILL.md`. Configured native mirrors and public default seeds are derived copies.

## Open Questions

None for this bounded procedure. Route new policy or scope decisions to the owning work item.
