---
id: task-833
type: task
title: Prepare source-bound consumer extraction context before mdkg 0.6.0 removals
status: done
priority: 1
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/consumer-extraction/manifest.json, .mdkg/artifacts/goal-84/consumer-extraction/context.md, .mdkg/artifacts/goal-84/consumer-extraction/handoff.md, .mdkg/artifacts/goal-84/consumer-extraction-verification.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-83, goal-84, dec-95, edd-82, bug-36, bug-37]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-09-11
updated: 2026-09-11
---
# Overview

Execution complete: source-only export has152manifested files,150source/fixture
files and87dependency modules. Independent read-only review found zero source
mismatches/missing dependencies/blocking export findings. MIT license and
sanitized consumer handoff retained. Manifest SHA256
7ad3dc58e759bd8891089ae532bba513170387a610dbbc77084917c11bc9068a.
Offline npm pack dry-run lists223package files with zero export leaks. No copied
payload, remote action or consumer integration executed. Evidence:
.mdkg/artifacts/goal-84/consumer-extraction-verification.json.

Goal: Preserve the source-grounded consumer extraction context before removal.
Context: dec-95 authorizes no compatibility layer; edd-82 separates retained
generic contracts from removed consumer semantics. Owner mdkg-project-agent.
This task produces a local export context pack, not a graph bundle or deployment.

# Acceptance Criteria

- Freeze exact source revision AND dirty source hashes before copying evidence.
- Inventory removed profile predicates, metadata contracts, pricing/topology
  assumptions, Git orchestration contracts and dependencies with source/license
  provenance, sanitized relevant source excerpts or patches and test fixtures.
- Include retained mdkg interfaces, input/output schemas, errors, evidence trust
  limits, native Git equivalents, filesystem/auth safety gates and migration map.
- Separate Runtime execution/auth/integration from backend accounting/full work
  receipts, and mdkg distilled intent/memory. No secrets or raw runtime payloads.
- Verify manifest hashes and references, inspect content for sensitive data, and
  demonstrate standalone readability. No temporary-path-only provenance.
- Mark pack local/undispatched and consumer adoption UNVERIFIED. Consumer coding,
  transport, dispatch and acceptance need their own scoped handoff; no implied
  consumer approval. Publication need not await consumer deployment.

# Files Affected

Proposed .mdkg/artifacts/goal-84/consumer-extraction/ context.md, manifest.json,
sanitized source/fixture evidence, plus this task and checkpoint/index projections.
Review exact file allowlist before writing; do not place raw DBs, bundles, scan
reports or operational history in the pack. The current planning pass creates
only this contract and edd-82, not the final export artifact.

# Implementation Notes

Run before bug-36/bug-37 removal. Reuse ordinary mdkg pack discovery for linked
context, but verify that the final export contains required source semantics;
an automatically generated node-summary pack alone is insufficient. Export
consumer-specific content as explicitly labelled local handoff evidence, never
as a new public mdkg skill or active capability. No runtime/sibling access.

# Test Plan

Hash manifest, source-range/path review, secret screening, fixture/source linkage,
license/provenance review and independent read-only completeness check. Retained
and removed behavior must both map to test-484. No execution of copied payloads.

# Links / Artifacts

- dec-95; edd-82; bug-36; bug-37; test-484; task-828. Backlog, unclaimed.
