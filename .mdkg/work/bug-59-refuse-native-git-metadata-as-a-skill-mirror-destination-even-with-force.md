---
id: bug-59
type: bug
title: Refuse native Git metadata as a skill mirror destination even with force
status: backlog
priority: 1
tags: [release-0.6.0, ownership]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [task-837, goal-84, goal-86, task-828]
context_refs: [goal-86, goal-84, task-837]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-17
updated: 2026-09-17
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

Planned / backlog. No fix or runtime/platform clearance claimed.
