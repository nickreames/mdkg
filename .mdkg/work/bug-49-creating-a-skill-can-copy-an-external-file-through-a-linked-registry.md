---
id: bug-49
type: bug
title: Creating a skill can copy an external file through a linked registry
status: done
priority: 1
tags: [release-0.6.0, security]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-49-baseline.json, .mdkg/artifacts/goal-86/bug-49-current-validation.json, .mdkg/artifacts/goal-86/bug-49-installed-verification.json]
relates: []
blocked_by: []
blocks: []
refs: [task-837, goal-84, goal-86, task-828]
context_refs: [goal-86, goal-84, task-837]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-17
updated: 2026-09-21
---
# Overview

Goal: remediate g86-bootstrap-003 from the completed fresh Standard scan
9d6a2ca2-4273-45de-9013-20452c7651d0 under Task837. Publication blocker.
Severity: medium. An untrusted checkout can make registry.md a symlink to an operator-readable file. Ordinary skill creation follows the link, preserves the external text, then replaces the link with a repository-local copy.

Sensitive external contents can become shareable repository data, but requires an operator to create a skill in the malicious checkout and later expose the resulting file. No automatic network exfiltration is established.

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

1. Create a registry symlink to a synthetic external sentinel and require refusal with no sentinel bytes copied.
2. Cover missing-target links, linked ancestors and no-partial-skill-write behavior.
3. Retain customization preservation for admitted regular registry files.

# Expected vs Actual

Expected: the owning generic operation enforces its intended authority,
integrity and resource boundaries before effects and emits honest receipts.
Actual: A committed registry symlink is not a skill directory and is not rejected by discovery. If its external target exists, ensureSkillsRegistry accepts it, refreshSkillsRegistry reads it, and unmarked text survives rendering. The atomic writer publishes those bytes in the checkout. No force flag, race or skill execution is required.

# Suspected Cause

runSkillNewCommandLocked authorizes and writes a new skill, then refreshes the registry. ensureSkillsRegistry and refreshSkillsRegistry use ordinary path-following fs calls on a sibling file. The renderer retains all unmarked input, and atomicWriteFile turns that input into a regular repository file. The contained helper used for the skill never covers this registry read.

Source anchors:
- src/commands/skill_support.ts:129-134 (root_control)
- src/commands/skill.ts:270-290 (entrypoint)
- src/util/atomic.ts:25-30 (sink)

# Fix Plan

Preflight the registry before any skill creation and use contained bounded reads and replacements for every registry operation. Refuse linked leaves/ancestors and dangling links without copying outside content.

Owned source allowlist:
- src/commands/skill_support.ts
- src/commands/skill.ts
- src/util/atomic.ts

Directly required shared helpers and regression files may be added only for
this control. Keep different findings separately attributable even when the
implementation shares a helper. Completed older bug milestones are historical
evidence, not reopened or substituted for this new regression.

# Test Plan

- Create a registry symlink to a synthetic external sentinel and require refusal with no sentinel bytes copied.
- Cover missing-target links, linked ancestors and no-partial-skill-write behavior.
- Retain customization preservation for admitted regular registry files.
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

2026-09-21: Current-source remediation on main8ee44cf1 uses contained,
nonblocking bounded registry reads and contained replacement. Registry admission
and the actual parsed prospective projection precede any skill directory/file
creation or force replacement. Refresh re-admits the registry at use. Regular
customization, missing registries, hard-linked peer bytes, force replacement and
init's shared refresh remain supported. No product-specific behavior was added.

Fresh synthetic baseline: corrected15-case fixture had6 passes/9 failures,
including a FIFO timeout and accepted linked registries. The earlier fixture's
unsupported custom-root configuration cases are retained as harness errors,
not additional vulnerabilities. Published0.5.2 impact remains unassessed; this
fix is grounded in the current prepatch source and draft0.6.0 package only.

One independent candidate review found an output-budget regression introduced
by the initial remedy. Parent reproduction confirmed17 skills could produce an
8476-byte registry under8192 and make the18th creation fail. Prospective output
preflight plus shared UTF8 output bounds now refuse before partial writes;
subsequent valid smaller edits remain usable. Exactly one review cycle was used.

Current frozen-build evidence:164 focused tests and57 installed cases pass
(19 each on Node24.15.0/24.18.0/26.0.0, macOS arm64). Full frozen source suite
passed1658/1658 with zero failures/skips on Node26/macOS arm64. An earlier full run was
intentionally interrupted after the review finding. A later attempted run was
invalidated by this agent scheduling a rebuilding CLI check concurrently;19
missing-module/template failures and the installed input ENOENT are retained,
not product failures or passes. A separate earlier installed harness path typo
ran zero cases. Corrected qualification uses frozen build inputs.

Evidence: bug-49-baseline.json, bug-49-current-validation.json and
bug-49-installed-verification.json under .mdkg/artifacts/goal-86/.
These are new local regression receipts, not recovered or rerun blocked scan
context. No blocked context was accessed. Bug46 metadata/ACL preservation and
Bug47 ancestor substitution remain separate open boundaries; this change does
not claim to solve either. Post-preflight concurrent changes can refuse after a
legitimate skill write; whole-command rollback is not claimed. Linux, final
independent review, full release ladder and exact release seal remain open.
Goal85 remains paused; no push, publication or provider action occurred.
