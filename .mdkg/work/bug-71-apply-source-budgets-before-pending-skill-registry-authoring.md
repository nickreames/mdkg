---
id: bug-71
type: bug
title: Apply source budgets before pending skill registry authoring
status: done
priority: 1
tags: [release-0.6.0, final-diff-remedy]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/independent-diff-review-20260930.json, .mdkg/artifacts/goal-86/successor-installed-case-acceptance-20260930.json, .mdkg/artifacts/goal-86/successor-installed-platform-qualification-20260930.json, .mdkg/artifacts/goal-86/successor-security-acceptance-20260930.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-86, goal-84, bug-49, task-828, test-488]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-09-30
updated: 2026-09-30
---
# Overview

Goal: use identical skill-source budgets in pending authoring preflight and
post-write registry refresh. Owner: mdkg-project-agent, one writer.
Distinct instance from Bug49's historical registry-link/output-budget remedy.

Context: scan e5e0584a-bdfc-4da0-8c41-7e5edd4d8bba at c313d804,
finding csf_80803508154cfa17788ddac6 (low, high confidence).
Installed f7cbdc1d with max_file_bytes8192 and a regular16444-byte skill creates
the new SKILL.md then exits4 during bounded refresh. A188-byte source succeeds.

# Boundaries

Generic Node-only skill-source/preflight helper and associated tests; direct
necessary mdkg evidence/projections and owned local fixtures only.
Allowed: src/commands/skill_support.ts, src/graph/skills_indexer.ts, their direct
authoring/mirror callers src/commands/skill.ts and skill_mirror.ts, and direct
regressions. Do not author skills, change projections/configuration defaults,
introduce a metadata framework, weaken budgets or absorb unrelated work.
No remote/provider/publication, canonical migration/worktree change or bundle refresh.

# Reproduction Steps

prepareSkillsRegistry supplies a pending readDocument callback that calls
readContainedFile without maxBytes for other skills. It replaces the normal
file/count/total budget reader. Registry output fits, canonical skill creation
occurs, and refresh subsequently refuses the unchanged oversized input.
OOM is not demonstrated; do not report a crash or code-execution claim.

# Expected vs Actual

Expected: every source/resource/control-file admission needed by maintained
mirrors occurs before canonical skill, registry or mirror writes.
Actual: pending source and mirror-control readers omitted bounded admission.

# Suspected Cause

Pending document overrides bypassed the normal bounded reader. Separately,
readManifest consumed regular managed metadata without a byte limit and hid
read failures inside optional JSON fallback. Synthetic oversized metadata was
accepted by new, force and sync in the focused pre-fix execution.

# Fix Plan

Reuse one bounded reader for existing and prospective source. Count replacement
content instead of superseded content, and count a new pending document exactly
once in per-file/combined/count budgets before directories or file writes.
Keep force replacement, customization and regular within-budget creation usable.

# Test Plan

Per-file/combined/count refusal leaves a full fixture inventory and native staging
unchanged; missing and existing pending paths, force replacement, UTF8 byte
accounting and boundary-equal positive controls pass. Other source/registry/link
admission and init refresh callers remain valid. Source plus actual successor
installed-package evidence feeds Test493 and Task828; final seal is separate.

Sanitized baseline: .mdkg/artifacts/goal-86/independent-diff-review-20260930.json.
Preserve earlier failed harness attempts and historical passes. No new skill candidate.

## Current bounded implementation

The prospective registry shares per-file/total/count admission with refresh.
Mirror source admission now also accounts for preserved resources and newly
required empty directories before canonical authoring. This closes the locally
reproduced max_files2 partial-write failure; max_files3 is the exact ordinary
document/references/assets positive control. Pending leaf authority is checked
before any resource directories, including force replacement of a visible link.
These are shared-caller corrections, not new skill behavior or relaxed limits.

The independent candidate review also identified regular mirror manifests as
an unbounded direct caller. Three synthetic CLI cases reproduced acceptance of
oversized metadata; no memory exhaustion magnitude is claimed. All configured
manifest reads now share per-file/aggregate admission before authoring effects,
and sink reads propagate authority/budget refusal rather than swallowing it.

# Links / Artifacts

Test493 and Task828 bind final source and installed-candidate acceptance.
