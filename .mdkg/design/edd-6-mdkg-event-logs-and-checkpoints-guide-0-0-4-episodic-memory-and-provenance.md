---
id: edd-6
type: edd
title: mdkg event logs and checkpoints guide 0.0.4 episodic memory and provenance
tags: [architecture, v0_4, episodic-memory, events, checkpoints, guide]
owners: []
links: []
artifacts: []
relates: [prd-1, prd-2, dec-8, dec-9, dec-10, edd-2, edd-3, edd-4, edd-5, edd-7, edd-8, epic-4, epic-5]
refs: []
aliases: [doc-8, events-guide, checkpoints-guide, episodic-memory, events.jsonl, jsonl-events, latest_checkpoint_qid]
created: 2026-03-04
updated: 2026-03-11
---

# Overview

This document defines mdkg 0.0.4 episodic-memory guidance: how to capture execution provenance over time without bloating semantic graph context or spamming git history.

Scope:
- two-tier episodic model (event logs + checkpoints)
- JSONL event schema guidance and recommended event kinds
- checkpoint compression and linkage guidance
- single-writer, event-driven commit cadence guidance for external orchestrators

Non-goals:
- no committed markdown logs under `.mdkg/work/events/` in 0.0.4 docs
- no finalized new CLI command names for skills/events in this pass

## Current source state (2026-03-06)

| Capability | 0.0.4 target | Current source behavior | Source anchor |
| --- | --- | --- | --- |
| Event log scaffold contract | `.mdkg/work/events/events.jsonl` guidance and seeded-init record expectations | implemented: `init --agent` creates the events path and seeds a valid init JSONL line | `src/commands/init.ts`, `src/cli.ts` |
| Event log schema checks | validate JSONL shape/redaction expectations | implemented baseline JSONL record validation when file exists; redaction remains docs-policy | `src/commands/validate.ts` |
| Event-path parse safety | avoid markdown files under event log path | workspace scan indexes `core/design/work/**/*.md`; markdown under `work/events` would be treated as strict nodes | `src/graph/workspace_files.ts`, `src/graph/indexer.ts` |
| Checkpoint-event linkage | checkpoint guidance references run/event scope | checkpoint creation supports generic relates/scope but no event-log coupling contract | `src/commands/checkpoint.ts`, `src/commands/validate.ts` |
| Pack episodic inclusion policy | latest checkpoint included by default when available | implemented via pack-time authoritative resolver with optional index hint metadata | `src/commands/pack.ts`, `src/pack/pack.ts`, `src/graph/indexer.ts` |
| Events command surface | capability-level guidance for event usage | implemented via `mdkg event enable` and `mdkg event append` | `src/commands/event.ts`, `src/commands/event_support.ts`, `src/cli.ts` |

# Architecture

0.0.4 episodic memory uses a two-tier model:

1. Tier A: event logs (high-frequency, append-only, committed by default)
2. Tier B: checkpoints (low-frequency, durable node summaries committed to git)

Design intent:
- keep fine-grained provenance cheap and machine-readable
- keep durable long-term memory compact and pack-friendly
- keep event streams out of semantic node traversal paths by default

Location guidance:
- event log: `.mdkg/work/events/events.jsonl`
- no markdown logs inside `.mdkg/work/events/` in 0.0.4 docs due strict-node parsing

Recommended event kind set (initial):
- `RUN_STARTED`, `RUN_COMPLETED`, `RUN_FAILED`
- `PLAN_CREATED`, `PLAN_UPDATED`
- `TOOL_CALLED`, `TOOL_RESULT`, `TOOL_FAILED`
- `SUBTASK_SPAWNED`, `SUBTASK_COMPLETED`, `SUBTASK_FAILED`
- `MDKG_PATCH_APPLIED`, `MDKG_NODE_UPDATED`, `CHECKPOINT_CREATED`, `PERSIST_COMMIT_PUSHED`

Operational policy:
- event streams are durable baseline provenance and support debugging/replay
- checkpoints are primary durable episodic memory anchors for future packs
- commit cadence remains event-driven and single-writer (external orchestrator guidance)
- mdkg CLI does not enforce this policy at runtime; orchestrators apply it
- when `events.jsonl` is missing, `mdkg task start` and `mdkg task done` should emit a short reminder about `mdkg event enable`

Recommended external orchestrator write cycle:
1. retrieve the active work item and latest checkpoint context through `pack` when available
2. append JSONL events during execution only if the orchestrator keeps an event stream
3. batch task status changes and artifact refs in the workspace
4. create a checkpoint only for meaningful run or milestone compression
5. commit once at the durable boundary
6. never commit on every tool call

Parent closeout guidance:
- feat and epic closeout should prefer a related checkpoint when closing a milestone or summarizing completed child work
- checkpoints are recommended for parent closeout, not required for every parent status change
- routine task completion should not automatically imply parent checkpoint creation
- narrative "what changed / what is next" memory should live in checkpoint bodies by default

# Data model

## Event log record (JSONL)

Each line is one JSON object.

Recommended required fields:
- `ts` (ISO timestamp)
- `run_id` (stable run identifier)
- `workspace` (workspace/repo scope label)
- `agent` (orchestrator/subagent/tool runner identity)
- `kind` (event type)
- `status` (`ok|error|retry|skipped`)
- `refs` (node IDs touched)
- `artifacts` (artifact refs/URIs)
- `notes` (short human-readable summary)

Recommended optional fields:
- `skill`, `tool`, `attempt`, `duration_ms`, `cost`, `diff_ref`, `errors`, `redacted`

Canonical event example:

```json
{"ts":"2026-03-04T18:12:03Z","run_id":"run_01HXYZ","workspace":"root","agent":"ai-agent","kind":"SUBTASK_COMPLETED","status":"ok","skill":"review-pr","tool":"codex.connector","refs":["task-17"],"artifacts":["patch://run_01HXYZ/diff.patch","tests://run_01HXYZ/go-test.txt"],"notes":"Codex produced patch; tests passed","redacted":true}
```

Canonical seeded init line target:

```json
{"ts":"2026-03-04T00:00:00.000Z","run_id":"init-20260304-000000","workspace":"root","agent":"mdkg","kind":"RUN_STARTED","status":"ok","refs":["edd-4"],"artifacts":[],"notes":"init agent scaffold target initialized","redacted":true}
```

## Checkpoint compression model

Checkpoint nodes (`type: checkpoint`) remain the durable episodic compression layer.

Checkpoint guidance:
- summarize what changed since previous checkpoint
- capture key decisions/failures/recoveries
- capture next steps/open loops
- reference run IDs/event scopes via `artifacts`, `links`, `refs`, or body text instead of embedding raw logs

# APIs / interfaces

Capability contracts for 0.0.4 docs:
- event-log format guidance is JSONL-only under `.mdkg/work/events/events.jsonl`
- checkpoint usage guidance is node-based and pack-oriented
- single-writer + batch commit cadence is external orchestrator policy guidance
- latest checkpoint inclusion in pack-context guidance remains default target when available
- latest checkpoint strategy is hybrid: pack-time authoritative resolver with optional `latest_checkpoint_qid` hint
- deterministic checkpoint tie-break order is `updated` descending, then `created` descending, then `qid` descending

CLI naming policy:
- `mdkg event enable` and `mdkg event append` are implemented
- `mdkg task done --checkpoint "<title>"` remains the preferred assisted checkpoint path

Non-normative examples:
- `mdkg checkpoint new "weekly provenance summary"`
- `mdkg pack task-17 --verbose`
- `mdkg event enable`
- `mdkg task done task-17 --checkpoint "milestone summary"`

# Failure modes

- Markdown files under `.mdkg/work/events/` are parsed as strict nodes and can fail validation.
- Event records with full payload dumps increase leakage risk and storage churn.
- Missing/unstable `run_id` values break provenance joins from checkpoints to event streams.
- Over-checkpointing (every minor update) causes noisy history with low signal.
- Commit-per-tool-call behavior creates commit spam and unstable collaborative state.
- Multi-writer memory updates increase merge conflict risk and provenance ambiguity.

# Observability

- Event logs should support deterministic per-run replay via `run_id` and `kind`.
- Checkpoints should include explicit scope and references to covered run/event windows.
- Validation/reporting surfaces malformed JSONL now; redaction-policy failures remain documentation-level in 0.0.4.
- Pack diagnostics should indicate whether checkpoint context was included by default policy.
- If an index hint exists (`latest_checkpoint_qid`), diagnostics should allow hint-vs-resolver consistency checks.

# Security / privacy

- Keep `.mdkg/index/` and `.mdkg/pack/` gitignored.
- Redact suspicious values in event logs by default.
- Keep checkpoint summaries high-signal and secret-free.
- Keep `.mdkg/` out of npm/runtime shipping artifacts.
- Treat raw event logs as durable project memory first and debugging/provenance detail second.

# Testing strategy

Docs integration checks:
- `mdkg validate` passes with `edd-6` and linked roadmap nodes
- `mdkg list --type edd` includes `edd-6`
- `mdkg show edd-6 --body` includes two-tier model + JSONL examples + source gap mapping
- `mdkg search "events.jsonl"` and `mdkg search "checkpoint"` surface updated planning nodes

Future implementation checks:
- event schema + redaction + index safety (`test-11`)
- external-orchestrator cadence and batching guidance consistency (`test-14`)
- checkpoint/pack inclusion policy behavior when implemented (`task-38`, `task-43`)
- hybrid checkpoint selection + hint consistency (`test-21`, `test-22`)
- redaction policy levels contract (`test-23`)
- orchestrator run/event/artifact contract (`test-24`)

# Rollout plan

For this pass:
- lifecycle guidance aligns to the current runtime task/event/checkpoint surfaces
- no new parent-closeout command is introduced

Recommended implementation order:
1. scaffold events path in init-agent implementation
2. add JSONL schema/redaction validation path
3. add checkpoint-event linkage guidance hooks in templates/docs
4. add pack-level latest-checkpoint default inclusion behavior
5. add optional events command/query capabilities in a later, explicitly scoped design

Doc tracking:
- this document is Doc 8 (`edd-6`) and completes the mdkg 0.0.4 docs set in planning form
