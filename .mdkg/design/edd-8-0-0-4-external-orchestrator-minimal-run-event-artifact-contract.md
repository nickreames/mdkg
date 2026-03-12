---
id: edd-8
type: edd
title: 0.0.4 external orchestrator minimal run event artifact contract
tags: [architecture, v0_4, orchestration, contract, events]
owners: []
links: []
artifacts: []
relates: [prd-1, dec-8, dec-9, dec-10, edd-3, edd-6, epic-4, epic-5]
refs: []
aliases: [doc-10, orchestrator-contract, latest_checkpoint_qid]
created: 2026-03-04
updated: 2026-03-04
---

# Overview

This document defines a minimal structured interoperability contract for external orchestrators (AI-agent-class and compatible systems) in 0.0.4 documentation.

Scope:
- run envelope shape
- event record contract
- artifact reference contract
- commit gate guidance

Non-goals:
- no runtime protocol daemon
- no transport-specific queue protocol
- no mdkg runtime enforcement in this pass

# Architecture

Single-writer orchestrator flow:
1. select task/root context
2. gather deterministic mdkg context (semantic + policy-selected procedural + checkpoint guidance)
3. execute subtasks/tools
4. persist event records
5. update mdkg nodes/checkpoint summaries
6. batch commit at event-driven boundaries

Contract model is intentionally minimal to support portability while preserving deterministic provenance.

# Data model

## Run envelope (recommended)

```json
{
  "run_id": "run_20260304_001",
  "workspace": "root",
  "orchestrator": "ai-agent",
  "stage": "execute",
  "status": "running",
  "started_at": "2026-03-04T18:00:00Z"
}
```

## Event record (required fields)

```json
{
  "ts": "2026-03-04T18:12:03Z",
  "run_id": "run_20260304_001",
  "workspace": "root",
  "agent": "ai-agent",
  "kind": "SUBTASK_COMPLETED",
  "status": "ok",
  "refs": ["task-17"],
  "artifacts": ["patch://run_20260304_001/diff.patch"],
  "notes": "subtask finished",
  "redacted": true
}
```

## Artifact references

Recommended URI-like forms:
- `patch://<run_id>/<artifact>`
- `tests://<run_id>/<artifact>`
- `logs://<run_id>/<artifact>`
- `commit://<sha>`

## Checkpoint hint interplay

For pack planning contracts:
- pack-time resolver is authoritative for latest checkpoint selection
- optional index hint (`latest_checkpoint_qid`) may be used as optimization only

# APIs / interfaces

This EDD defines capability-level contracts, not final command names.

Planned interface implications:
- orchestrator writes event JSONL using the minimal required fields
- orchestrator preserves single-writer commit discipline
- orchestrator can consume stage-tag skill gating policy while selecting skills

Commit gate guidance:
- commit on end-of-run, checkpoint-worthy milestones, or approved timer flush
- do not commit per tool call

# Failure modes

- missing `run_id` stability breaks event-to-checkpoint provenance.
- inconsistent artifact URI schemes make evidence traversal unreliable.
- multi-writer commits produce clobber/merge conflicts.
- commit-per-tool-call causes noisy history and low trust.

# Observability

- stable `run_id` and event kinds enable replay/debug.
- artifact URI consistency improves traceability.
- checkpoint summaries should reference run scopes explicitly.

# Security / privacy

- redact sensitive values by policy before persistence.
- keep raw secret-bearing outputs out of committed mdkg docs.
- treat event logs as operational traces, typically gitignored.

# Testing strategy

Docs integration checks:
- `mdkg show edd-8 --body` includes run/event/artifact examples and commit gate policy
- links to episodic and memory-model docs remain consistent

Future implementation checks:
- orchestrator contract validation scenarios (`test-24`)
- redaction policy contract consistency (`test-23`)

# Rollout plan

1. lock docs contract in 0.0.4 planning graph
2. align orchestrator tasks/tests to required field set
3. defer runtime enforcement/protocol transport specifics to implementation phase
