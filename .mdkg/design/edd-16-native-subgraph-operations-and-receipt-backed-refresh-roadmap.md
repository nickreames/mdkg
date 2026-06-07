---
id: edd-16
type: edd
title: native subgraph operations and receipt-backed refresh roadmap
tags: [subgraph, audit, upgrade-plan, capability-sync, strict-validation, receipt]
owners: []
links: []
artifacts: []
relates: [goal-12, epic-68, dec-29]
refs: [edd-11, edd-15, dec-29]
aliases: [native-subgraph-operations, subgraph-audit-upgrade-plan, subgraph-capability-sync-summary, strict-subgraph-validation, receipt-backed-subgraph-refresh]
created: 2026-06-07
updated: 2026-06-07
---
# Overview

mdkg should provide native subgraph operations so orchestrator repositories can
audit, plan, and refresh subgraph snapshots with less bespoke shell logic.

# Architecture

The native command family separates observation, planning, validation, and
refresh evidence. Audit commands observe state. Upgrade-plan commands produce
recommendations. Strict validation commands fail unsafe states. Receipt helpers
mirror accepted refresh evidence.

# APIs / interfaces

- `mdkg subgraph audit --all --json`: read-only subgraph state report.
- `mdkg subgraph upgrade-plan --all --json`: read-only upgrade readiness plan.
- Capability sync summary: visibility-safe capability comparison across root
  and subgraphs.
- Strict validation: opt-in failure mode for stale, dirty, drifted, or
  unaccepted subgraph states.
- Refresh receipt helper: evidence mirror for accepted SHA, bundle hash,
  verification result, and no-secret closeout.

# Ownership model

Root workspaces may plan and verify. Child repositories own graph/source edits,
commits, and pushes. Root bundle refresh waits for accepted child state and a
validation receipt.

# Data model

- Audit row: alias, path, source ref, source HEAD, dirty state, validation
  state, bundle age, and capability summary.
- Upgrade plan row: target mdkg version, dry-run status, scaffold state, DB
  migration state, skill sync requirement, and validation gates.
- Refresh receipt: accepted SHA, bundle hash, config update, verification
  result, and redacted evidence summary.

# Security / privacy

Subgraph operation commands must not record secrets, auth headers, raw queue
payloads, registry credentials, or private node bodies in public summaries.
Visibility boundaries apply to capability sync output.

# Failure modes

- Audit output is mistaken for permission to mutate child repos.
- Upgrade-plan output applies changes instead of reporting required work.
- Capability summaries leak private child graph content.
- Refresh helpers create evidence without an accepted child SHA.

# Observability

Commands should emit JSON fields that downstream tools can store as checkpoints
or receipts: command version, root path, subgraph alias, timestamps, diagnostic
codes, validation status, and redacted evidence refs.

# Testing strategy

Tests should cover fresh, stale, dirty, source-drifted, missing-receipt, and
visibility-mixed fixtures. Mutation tests should prove audit and upgrade-plan
commands do not write child repo state.

# Rollout plan

This roadmap is paused until the 0.3.0 release lane closes. It should become a
later implementation goal with explicit CLI JSON snapshots and downstream
adoption notes.
