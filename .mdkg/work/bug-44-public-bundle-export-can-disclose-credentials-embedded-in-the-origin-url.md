---
id: bug-44
type: bug
title: Public bundle export can disclose credentials embedded in the origin URL
status: done
priority: 1
tags: [release-0.6.0, security]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-44-local-verification.json]
relates: []
blocked_by: []
blocks: []
refs: [task-837, goal-84, goal-86, task-828, test-488]
context_refs: [goal-86, goal-84, task-837]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-17
updated: 2026-09-18
---
# Overview

Goal: remediate g86-baseline-001 from the completed fresh Standard scan
9d6a2ca2-4273-45de-9013-20452c7651d0 under Task837. Publication blocker.
Severity: medium. Creating and sharing a public bundle copies an origin URL's authentication-bearing userinfo, query or fragment into manifest provenance and summary output. Public graph filtering does not redact that field.

Credentials could grant repository access, but exposure requires a credential-bearing local origin and subsequent bundle/log sharing. Likelihood is conditional, not established for this checkout.

Context: frozen source e42f1d93497119c9a1f8684df926510da91dea42,
draft package0.6.0. This is source-validated evidence, not executed exploit proof.
Earlier published versions were not assessed by that offline current-source scan.
Establish affected-version bounds from exact local package/source evidence during
remediation; do not assume published0.5.2 is affected.

Owner: mdkg-project-agent, one repository writer under the explicit Goal86 run. Allowed: this bounded generic source remedy, directly required helpers, regression/installed fixtures, release-critical truth corrections and sanitized mdkg evidence. Preserve authored history, selected Goal73, runtime DB, Demo3 bundles and unrelated custody. No canonical migration, bundle/subgraph refresh, remote Git, publication, provider/deployment, cross-project writes, global configuration or history rewrite. Stop for a materially new architecture/security decision; no documentation-only waiver.

# Reproduction Steps

Use synthetic, owned disposable fixtures only. Reproduce the source-bound
failure before changing its control, retain passing controls, and bind the
commands/results to exact source and installed artifact hashes. Never run
malicious inputs against canonical state or recovered Demo3 payloads.

1. Create exports from synthetic URL userinfo/query/fragment and helper-style origins and assert no secret appears in ZIP or CLI output.
2. Retain normal HTTPS, SSH/SCP and local descriptors without authentication data.
3. Verify public and private export paths and subgraph provenance.

# Expected vs Actual

Expected: the owning generic operation enforces its intended authority,
integrity and resource boundaries before effects and emits honest receipts.
Actual: The origin value has no intervening redaction from config read through source.repo to serialized ZIP bytes; bundleSummary returns the same source object. This is a confidentiality boundary from local authentication data to an intentionally shareable artifact.

# Suspected Cause

sourceInfo reads remote.origin.url and assigns it directly to source.repo. buildBundle includes the result in either profile and serializes the complete manifest. Visibility filters operate on graph content, not this provenance field; the existing Git display redactor is not reused.

Source anchors:
- src/commands/bundle.ts:328-348 (root_control)
- src/commands/bundle.ts:880-904 (propagation)
- src/commands/bundle.ts:998-1007 (propagation)
- src/commands/git.ts:48-67 (propagation)

# Fix Plan

Centralize safe Git provenance descriptors and use them in bundle source metadata and summaries; strip URL userinfo, all query and fragment data, and fail closed for opaque helper forms without touching transport configuration.

Owned source allowlist:
- src/commands/bundle.ts
- src/commands/git.ts
- src/util/git_remote.ts (shared descriptor control)
- src/commands/subgraph.ts and src/graph/subgraphs.ts (historical/configured provenance sinks)
- src/commands/mcp.ts (configured-provenance inspection sink)

Directly required shared helpers and regression files may be added only for
this control. Keep different findings separately attributable even when the
implementation shares a helper. Completed older bug milestones are historical
evidence, not reopened or substituted for this new regression.

# Test Plan

- Create exports from synthetic URL userinfo/query/fragment and helper-style origins and assert no secret appears in ZIP or CLI output.
- Retain normal HTTPS, SSH/SCP and local descriptors without authentication data.
- Verify public and private export paths and subgraph provenance.
- Failing-before/passing-after controls with no unintended filesystem, Git-index,
  selected-state or runtime-state effects; record all skips and missing proof.
- Current-source tests and exact installed package on Node24.15.0/24.18.0/26,
  macOS and Linux x86_64/ARM64 where the case is platform-sensitive.
- Bind this finding to test488 and relevant existing installed families; Task828
  independently reviews the complete remediation range after fixes are frozen.
- Local bug completion requires a verified remedy; final release clearance still
  requires independent review, full qualification and the new exact artifact seal.

# Links / Artifacts

- .mdkg/artifacts/goal-86/task-837-standard-security-audit.json
- root:task-837; root:test-488; root:task-828; root:test-487
- Canonical raw finding/report remains plugin-owned; only sanitized evidence,
  hashes and regression/disposition references belong in this graph.

## Current State

Local remedy verified on 2026-09-18; final release qualification remains open.
The shared descriptor boundary now withholds URL userinfo, all query/fragment
data, explicit/implicit/configured opaque helpers, malformed descriptors and
parser-normalized authority bypasses. Safe SCP/local/Windows/UNC/encoded-path
descriptors and deterministic bundle behavior remain covered by controls.

Imported and configured provenance is redacted in inspection, packs, health,
audit/plan/sync receipts, JSON/SQLite projections and MCP output. Authored config
and historical ZIPs are not rewritten. Bundle show flags a redacted view;
unsafe historical provenance is inspect-only rather than copied by materialize.
This is not arbitrary-body/config secret scanning or credential erasure.

Evidence: `.mdkg/artifacts/goal-86/bug-44-local-verification.json`. Original
source failed18/26 cases with8 passing controls. One independent candidate
review found2 concrete gaps; the parent reproduced20/47 failures, refined the
control and verified49 scenarios on installed bytes for each of Node24.15.0,
24.18.0 and26 (macOS arm64). Focused source67/67 passed; the final two-case
fixture extension also passed. Build, CLI/docs/workflow parity, full/changed
graph validation, SQLite checks and diff checks passed. Three historical stale
subgraph warnings remain; no protected bundle was refreshed.

The recorded0.5.2 release source867ac709 also contains the raw-origin producer;
exact source/blob hashes are retained. This unit did not execute the published
0.5.2 package or establish earlier affected ranges or actual exposure.

Local bug completion does not close test488/Task828, Linux qualification, the
full ladder or final artifact seal. Goal85 remains paused/unpublished. Broad
documentation polish remains deferred; Task839 owns release-critical guidance.
