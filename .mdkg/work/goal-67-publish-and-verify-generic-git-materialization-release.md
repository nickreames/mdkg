---
id: goal-67
type: goal
title: publish and verify generic Git materialization release
status: todo
priority: 1
goal_state: paused
goal_condition: The generic Git materialization release is complete only after an execution-time version is selected, package changelog generated contract docs public naming security registry and auth gates pass, one explicit bounded approval authorizes external mutations, origin is updated without force, npm publication and integrity are verified, clean temporary and real global installs pass materialization and compatibility probes, downstream consumers receive a product-neutral handoff, and no Git tag is created by default.
scope_refs: [task-753, task-754, task-755, task-756, task-757, test-416, test-417, test-418, test-419]
required_skills: [select-work-and-ground-context, service-boundary-ownership-check, build-pack-and-execute-task, verify-close-and-checkpoint]
required_checks: [git status --short --branch, git log --oneline origin/main..HEAD, npm ci, npm run build, npm run test, npm run cli:check, npm run cli:contract, npm run docs:check, node scripts/assert-publish-ready.js, npm pack --dry-run --json, npm publish --dry-run --registry=https://registry.npmjs.org/, npm view mdkg dist-tags --json, required repository security scan, explicit release approval, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [git, materialization, release, npm, verification]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [goal-66]
blocks: []
refs: [edd-73, dec-75, dec-76, dec-77, dec-78]
context_refs: [goal-66, edd-73, dec-69, dec-75, dec-76, dec-77, dec-78]
evidence_refs: []
aliases: [generic-git-materialization-release]
skills: [select-work-and-ground-context, service-boundary-ownership-check, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-11
---

# Objective

Publish the implementation accepted by `goal-66` as a verified generic mdkg
release and prove installed-package behavior before downstream upgrades begin.

# End Condition

Npm metadata and integrity identify the released version, temporary and real
global installs pass materialize/clone/upgrade probes, and a sanitized consumer
handoff records exact capability and compatibility evidence.

# Non-Goals

- No implementation work that belongs to `goal-66`.
- No downstream repository upgrade or runtime execution.
- No Git tag unless a later explicit instruction changes the default.
- No rollback or unpublish; failures after publication are fixed forward.

# Recursive Algorithm

1. Select the next valid version from package compatibility evidence.
2. Finalize package metadata and run complete local/security/public gates.
3. Stop for one explicit approval covering push, publish, and global install.
4. Push without force, verify CI, publish, and prove registry integrity.
5. Validate clean temporary and real global installs.
6. Record the downstream upgrade handoff and release checkpoint.

# Required Skills

Use frontmatter skills and approval-gated release guidance.

# Required Checks

Run frontmatter checks plus installed-package materialization fixtures and
source/package help parity.

# Acceptance Criteria

- The goal title and static task names do not hardcode a version.
- Public package and docs contain no downstream product identifiers.
- Registry absence and auth are verified before publication.
- Published JSON request/receipt behavior matches `goal-66` evidence.
- No tag, force push, downstream mutation, or implicit deployment occurs.

# Definition Of Done

- Goal condition is achieved with a durable release receipt.
- Downstream upgrade can resolve the release through npm `latest`.

# Stop Conditions

- `goal-66` is incomplete.
- Any local, security, naming, auth, registry, CI, or approval gate fails.
- The selected version already exists unexpectedly.

# Current State

Paused behind `goal-66`. First node is `task-753`.

# Iteration Log

- 2026-07-11: Seeded as a release-only successor.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
