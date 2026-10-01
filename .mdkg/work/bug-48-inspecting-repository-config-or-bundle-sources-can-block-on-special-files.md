---
id: bug-48
type: bug
title: Inspecting repository config or bundle sources can block on special files
status: done
priority: 1
tags: [release-0.6.0, security]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/security-findings-checkpoint-20260918.json, .mdkg/artifacts/goal-86/bug-48-current-validation.json, .mdkg/artifacts/goal-86/bug-48-installed-verification.json]
relates: []
blocked_by: []
blocks: []
refs: [task-837, goal-84, goal-86, task-828, chk-624]
context_refs: [goal-86, goal-84, task-837]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-17
updated: 2026-09-21
---
# Overview

Goal: remediate g86-baseline-005 from the completed fresh Standard scan
9d6a2ca2-4273-45de-9013-20452c7651d0 under Task837. Publication blocker.
Severity: low. Configuration loading and bundle freshness verification follow repository symlinks and perform unbounded whole-file reads before adequate type/size admission. A device or FIFO target can exhaust memory or block local CLI/MCP inspection.

The demonstrated effect is availability loss of a local process after the operator selects malicious repository or bundle input; no network service or broader privilege gain was established.

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

1. Reject config/source symlinks to devices, FIFOs and outside sentinels without blocking.
2. Reject oversized regular files and post-stat growth within timeout-bounded fixtures.
3. Exercise CLI and fixed-root MCP while proving subsequent valid requests still work.

# Expected vs Actual

Expected: the owning generic operation enforces its intended authority,
integrity and resource boundaries before effects and emits honest receipts.
Actual: Repository input can supply a config symlink to a special file; bundle verification can reference a similarly linked local source. fs.readFileSync follows those links, so a FIFO can block and /dev/zero or oversized data can consume unbounded memory before parsing or hashing finishes. MCP index inspection calls the same config loader.

# Suspected Cause

loadConfig follows existsSync with readFileSync before any schema or configured limits. verifyBundle independently hashes manifest paths using the same pattern and does not stop when payload errors exist. Neither path uses available contained, nonblocking regular-file admission or a fixed bootstrap byte ceiling.

Source anchors:
- src/core/config.ts:1171-1186 (root_control)
- src/commands/mcp.ts:258-268 (propagation)
- src/commands/bundle.ts:961-970 (propagation)
- src/core/filesystem_authority.ts:362-398 (propagation)

# Fix Plan

Use contained non-following regular-file readers with a fixed bootstrap size ceiling for config and appropriate bounded source hashing for bundle verification. Fail before source reads when payload integrity is invalid.

Owned source allowlist:
- src/core/config.ts
- src/commands/mcp.ts
- src/commands/bundle.ts
- src/core/filesystem_authority.ts

Directly required shared helpers and regression files may be added only for
this control. Keep different findings separately attributable even when the
implementation shares a helper. Completed older bug milestones are historical
evidence, not reopened or substituted for this new regression.

# Test Plan

- Reject config/source symlinks to devices, FIFOs and outside sentinels without blocking.
- Reject oversized regular files and post-stat growth within timeout-bounded fixtures.
- Exercise CLI and fixed-root MCP while proving subsequent valid requests still work.
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

2026-09-21 local remedy verified; structured closeout recorded in chk625. Config reads
use fixed8MiB contained admission; verified bundle sources use payload-bound
streaming; invalid payloads perform no source/Git freshness reads. Selected ZIPs
use the same nonblocking opened descriptor for type/size admission and bounded
reads. External/linked regular ZIPs remain supported. Source/config unsafe links,
special files, actual-byte growth and the selected-ZIP-to-FIFO substitution fail
promptly; descriptor closure, missing/shorter/same-length source semantics,
exact byte limits, legacy config and MCP subsequent-valid-request behavior pass.

Build/test compilation,164 focused tests and90 installed CLI/MCP cases pass
(30 each on Node24.15.0/24.18.0/26.0.0, macOS arm64). Complete discovery executed
1647 tests:1614 passed and33 interrupted-writer cases failed because sandbox OS
ownership proof was unavailable. The entire unchanged38-case affected family
then passed with approved native OS evidence. Preserve both runs, not a claim
that the restricted run passed. The obsolete whole-file-read test hook was
adapted to descriptor closure; receipt-byte identity assertions remain intact.

Current source/hash and installed230-file manifests are in the two Bug48 JSON
receipts. Tested intermediate package SHA256:
9ec001408ccc8f3549b0768e163e5a638f2bf60b3545d024787f0bc84f43a786.
Exact package inputs and installed files remained unchanged. Package lifecycle
scripts were intentionally skipped for this isolated offline intermediate test;
this is not the final release ladder/seal. Baseline draft0.6.0 source is affected;
published0.5.2 impact remains unassessed. No old evidence was recovered or scan
rerun. Linux, independent Task828 and final exact-artifact qualification remain
open under Test487/488. Bugs46/47 are distinct and not fixed by this reader patch.

Earlier resume/partial-state chronology:

2026-09-21: resumed under Nick's explicit Goal86 continuation. Re-inventory
matched all checkpoint source/protected hashes and main85226b5; no active writer
lease, queue or mutation lock. Use the retained Bug48 reproduction and completed
single candidate review; no blocked scan context, recovery or old-scan rerun.
The shared ZIP reader now uses nonblocking open, descriptor type/size admission,
bounded actual-byte reads and guaranteed descriptor closure. Focused tests pass;
broader local validation is in progress. Native metadata/ancestor work stays
separate. Historical partial-state paragraphs below retain their chronology.

2026-09-18: partial, uncommitted remedy; NOT closed. The original config and
manifest-source reproduction had16 failures/7 passing controls. The candidate
uses existing contained bounded readers for config and source freshness;
155 focused source tests and23 installed CLI/MCP cases on each of Node24.15.0,
24.18.0 and26.0.0 passed on macOS arm64. These are intermediate observed results,
not final-artifact or Linux acceptance. The full-suite attempt has no recoverable
terminal result after the environment transition and is not counted as passing.

One fresh candidate review identified a remaining read in the same operation:
`verifyBundle -> parseBundle -> readZipFileBytes`, src/util/zip.ts:316-326.
Pathname stat precedes an unbounded pathname read. Parent confirmed a controlled
regular-ZIP-to-FIFO replacement immediately before open hangs the owned child;
the two-second timeout terminated it with SIGKILL/ETIMEDOUT. This is final-leaf
substitution, distinct from Bug47's ancestor race. Oversized replacement follows
the same static path; no memory-exhaustion experiment was executed.

Next bounded correction: admit and limit the same opened ZIP descriptor,
including actual-byte growth and nonblocking special-file refusal. Preserve
explicit external/linked regular ZIP selection, limit overrides, exact-boundary
bytes and downstream decompression limits. Add installed fault-injection and
positive controls, descriptor-closure checks, then rerun affected validation.
The directly required shared src/util/zip.ts reader belongs to this remedy;
no ZIP-reader production change has yet been made. Do not create a duplicate
finding or increase the sealed Standard scan's14-finding count.

Nick's latest request switches this pass to findings capture and planning.
Preserve two modified source files and three new tests/fixture files; do not
stage, commit or represent this partial patch as verified closure. Chk624 and
security-findings-checkpoint-20260918.json bind their current hashes. Temporary
Bug48 receipts/tarball are now inaccessible at their recorded paths; the new
checkpoint preserves observed tool results, not invented original report bodies.
Requalification is required. Goal85 remains paused.
