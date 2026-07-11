---
id: spike-27
type: spike
title: Assess bundle and subgraph ZIP parsing resource limits
status: done
priority: 2
parent: loop-1
tags: [security, bundle, subgraph, zip, loop-followup, superseded, cancelled]
owners: []
links: []
artifacts: []
relates: [loop-1, loop-3]
blocked_by: []
blocks: []
refs: [loop-1, spike-25, task-686, loop-3]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-06
updated: 2026-07-06
---
# Research Question

Should mdkg add explicit ZIP resource limits for bundle verification and subgraph import paths so untrusted or accidentally huge bundles cannot cause excessive memory or CPU use during parse?

# Superseded / Cancelled

This spike is closed as superseded by `loop-3`, the corrected security audit loop fork.

The source-grounded notes below remain useful evidence from the failed dogfood run, but the active security audit should decide whether this is definition-blocking security work, residual hardening, false positive, or accepted waiver inside the corrected loop closeout matrix. If it remains actionable after `loop-3` completes the required evidence lanes, create a fresh follow-up node from that loop with current evidence and classification.

# Context And Constraints

- This is a security hardening spike created by the read-only `loop-1` security audit.
- Do not change source behavior in this spike; produce a source-grounded recommendation and follow-up implementation/test nodes if needed.
- Keep mdkg bundles local-first and deterministic; do not make vector/remote indexing or CocoIndex part of this work.

# Search Plan

- Inspect `src/util/zip.ts`, `src/commands/bundle.ts`, `src/graph/subgraphs.ts`, and bundle/subgraph smoke tests.
- Identify current raw ZIP size checks, entry-count checks, total uncompressed-size checks, and post-inflate hash/size validation.
- Compare implementation options that preserve low dependency count.

# Findings

- `readZipEntries` inflates each entry before an explicit maximum uncompressed-size, entry-count, or total-size policy is enforced.
- `parseBundle` and subgraph projection call `readZipEntries` before manifest hash/size validation can reject oversized or malicious content.
- Existing manifest hash and size checks are useful integrity controls, but they happen after ZIP entries have already been read into memory.
- This is best classified as a resource-exhaustion hardening gap for untrusted or large bundles, not a confirmed data disclosure finding.

# Options And Tradeoffs

- Option 1: add first-party limits to the current ZIP reader, including max raw zip bytes, max entry count, max entry name length, max per-entry uncompressed bytes, and max total uncompressed bytes. This keeps dependencies low and fits the current implementation, but requires careful tests.
- Option 2: switch bundle parsing to a streaming ZIP library with configurable limits. This may be more robust for large graphs, but adds supply-chain surface and dependency maintenance.
- Option 3: document bundles as trusted local inputs only. This is simplest but weakens future remote-subgraph and larger-graph readiness.

# Recommendation

Prefer Option 1 for MVP hardening: add explicit configurable limits around the existing deterministic ZIP reader and fail closed with clear diagnostics. Revisit a streaming parser only if larger remote bundle workflows prove the first-party parser insufficient.

# Follow-Up Nodes To Create

- Task: implement bundle/subgraph ZIP resource limits with config defaults.
- Test: malicious or oversized bundle fails before unbounded inflate or projection.
- Test: normal mdkg bundles continue to verify and import.

# Skill Candidates

- `select-work-and-ground-context`
- `verify-close-and-checkpoint`

# Data Structures And Algorithms Notes

- Candidate config keys should live under bundle/subgraph or a shared import-safety section rather than becoming public runtime policy.
- Guardrails should apply to raw bundle file size before parse and to entry count, entry name length, per-entry uncompressed size, and total uncompressed size while parsing.

# UX Notes

- Diagnostics should explain which limit failed and how to raise the limit intentionally for a trusted larger graph.

# Security Notes

- The goal is fail-closed local resource protection for bundle/subgraph parsing.
- Do not imply mdkg has comprehensive malware scanning or arbitrary untrusted archive sandboxing.

# mdkg.dev Launch Implications

- This does not need to block loop dogfooding, but it is a strong pre-publish hardening candidate if public docs encourage sharing or importing bundles.

# Evidence And Sources

- `src/util/zip.ts:126-154`: entry data is inflated before explicit limit enforcement.
- `src/commands/bundle.ts:693-707`: bundle parsing reads all ZIP entries and then parses manifest JSON.
- `src/graph/subgraphs.ts:105-107`: subgraph projection reads bundle ZIP entries into a map.
- `src/graph/subgraphs.ts:251-260`: source projection validates required entries and hashes after reading entries.
