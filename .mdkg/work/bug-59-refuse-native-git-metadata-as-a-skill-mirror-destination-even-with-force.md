---
id: bug-59
type: bug
title: Refuse native Git metadata as a skill mirror destination even with force
status: done
priority: 1
tags: [release-0.6.0, ownership]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-59-baseline.json, .mdkg/artifacts/goal-86/bug-59-full-verification.json, .mdkg/artifacts/goal-86/bug-59-installed-verification.json]
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

Explicit force plus a configured skill mirror destination inside native Git metadata can replace or prune repository infrastructure. The scan did not establish an independent lower-trust authority bypass, so this is a generic destructive-footgun/custody blocker, not an additional security finding.

Context: frozen draft0.6.0 source e42f1d93497119c9a1f8684df926510da91dea42.
Affected-version assessment is candidate-only until exact earlier local package
proof exists. Do not change Task837's fourteen-finding count.

Owner: mdkg-project-agent, one repository writer under the explicit Goal86 run. Allowed: this bounded generic source remedy, directly required helpers, regression/installed fixtures, release-critical truth corrections and sanitized mdkg evidence. Preserve authored history, selected Goal73, runtime DB, Demo3 bundles and unrelated custody. No canonical migration, bundle/subgraph refresh, remote Git, publication, provider/deployment, cross-project writes, global configuration or history rewrite. Stop for a materially new architecture/security decision; no documentation-only waiver.

# Reproduction Steps

Use owned disposable synthetic fixtures and exact installed bytes. Reproduce
before correction and retain all positive controls; never mutate canonical
Git metadata, runtime DB or protected graphs to exercise refusal.

# Expected vs Actual

Explicit force plus a configured skill mirror destination inside native Git metadata can replace or prune repository infrastructure. The scan did not establish an independent lower-trust authority bypass, so this is a generic destructive-footgun/custody blocker, not an additional security finding.

# Suspected Cause

src/commands/skill_mirror.ts:225-263 resolves configured roots, then permits replacement of unowned destination directories when force is true. It does not categorically exclude Git metadata resources.

# Fix Plan

Reject Git metadata destinations before root creation, source copying, manifest writes or pruning, regardless of force. Cover .git directory/file and actual gitdir/common-dir/worktree administrative resources using observational native-Git topology data without invoking helpers, remotes or Git mutations. Preserve ordinary generic native skill mirrors and user customization.

Owned source and directly required regression scope:
- src/commands/skill_mirror.ts
- src/commands/skill_support.ts
- src/commands/skill.ts
- src/core/config.ts
- src/util/git_observation.ts

# Test Plan

- Synthetic normal, linked-worktree and submodule/gitdir-indirection checkouts refuse unsafe targets with and without force.
- Complete inventories and Git object/index/config hashes remain unchanged on refusal; no auth/helper/remote subprocess runs.
- Valid .agents and .claude mirror controls still sync, prune only managed content and refuse unowned content unless explicitly authorized.
- Bind failing-before and passing-after evidence to source/package hashes.
- Test488 and Task828 independently verify current remediation; final installed
  qualification and macOS/Linux acceptance remain separate from local closure.

# Links / Artifacts

- .mdkg/artifacts/goal-86/task-837-standard-security-audit.json
- g86-bootstrap-001 rejected security candidate; retain explicit-force prerequisite
- root:goal-86; root:goal-84; root:test-488; root:task-828; root:test-487

## Current State

2026-09-21 local remedy verified. Shared admission protects native gitdir,
common-dir, redirected index/hooks/object stores and bounded chained alternate
stores before skill creation/sync/scaffolding, initialization or upgrade writes.
Nested repositories cannot be pruned through stale managed slugs. Force and
empty-slug preflight do not bypass admission. Reviewed historical upgrade
journals are rechecked against current Git topology before replay or rollback.

The baseline reproduced20 successful unsafe operations and4 late generic
path/gitfile refusals;5 ordinary controls passed. Final47 focused cases,
2040 full tests and285 exact installed cases pass on macOS arm64 across
Node24.15.0/24.18.0/26.0.0. Existing staging-sentinel tests now use actual Git
repositories; their assertions are preserved. Actual linked-worktree and local
submodule fixtures pass. Distinct case-sensitive alternate-store traversal is
still a Linux qualification case, not a claimed macOS proof.

One independent read-only candidate reviewer identified alternate-store,
discovery-environment, inventory-budget and path-decoding gaps, corrected and
covered before final qualification. The superseded pre-BOM-correction full run
was stopped and is not a pass. Final source/input hashes remained unchanged.
This is an adjacent custody blocker, not another retained security finding.
No blocked context was accessed or recovered. Broader filesystem architecture,
Linux, Test488/Task828, coverage ladder and final seal remain open.

Evidence: bug-59-baseline.json, bug-59-full-verification.json and
bug-59-installed-verification.json under .mdkg/artifacts/goal-86/.
Intermediate tarball SHA256:
fc64644615b253f77a5a4866b9653d1c09612ac714d920ef82eaa08bb8b07c80.
Selected Goal73, runtime DB and Demo3 bundle hashes are preserved. SQLite index
projection remains separate dirty custody. No remote Git, publication, provider,
deployment, canonical migration or bundle refresh. Skill candidates:none.
