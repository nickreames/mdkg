---
id: test-450
type: test
title: goal-66 security and local prepublish readiness contract
status: todo
priority: 1
parent: goal-66
next: task-751
tags: [goal-66, test, security, prepublish, package, 0.5.2]
owners: []
links: []
artifacts: []
relates: [task-746, task-747, task-748, task-749, task-750]
blocked_by: [test-411, test-412, test-413, test-414, test-415]
blocks: [task-751]
refs: [goal-66, goal-67, edd-73, dec-75, dec-76, dec-77, dec-78]
context_refs: [goal-65, goal-71]
evidence_refs: []
aliases: [materialization-local-publish-readiness]
skills: [service-boundary-ownership-check, verify-close-and-checkpoint]
cases: [full-local-ladder, security-diff-scan, source-package-docs-parity, installed-tarball, no-push, version-neutral-dry-run]
created: 2026-07-15
updated: 2026-07-15
---

# Overview

Prove the complete Goal-66 implementation is safe, product-neutral,
documented, package-complete, and locally ready to enter the fixed `0.5.2`
release lane without performing any external or real-root release mutation.

# Preconditions

- `test-411` through `test-415` are done.
- Source remains version `0.5.1`; materialization notes remain under
  `CHANGELOG.md` `Unreleased`.

# Required Evidence

- `npm ci`, build, complete tests, `smoke:git-materialize`, CLI snapshot/check,
  CLI contract, docs check/build, graph validation, and `git diff --check` pass.
- `npm run security:verify` and a Codex Security diff scan over the complete
  Goal-66 change range report zero unresolved findings.
- `npm run prepublishOnly` and `node scripts/assert-publish-ready.js` pass.
- Isolated-cache `npm pack --dry-run --json` and `npm publish --dry-run` pass;
  the latter is classified only as version-neutral command/payload proof.
- A tarball written outside the repo installs into a clean temporary prefix and
  passes materialization success, representative closed failures, help/contract
  parity, and clone compatibility.
- Source, generated outputs, docs, schemas, fixtures, and tarball contain no
  downstream product identifiers, credential material, local absolute paths,
  or raw provider/runtime payloads.

# Boundary Assertions

- No version bump, real publish, push, tag, global replacement, deployment,
  Browser/Chrome operation, or real-root `upgrade --apply` occurs.
- Any failed check or unresolved finding blocks `task-751` and `goal-67`.

# Results / Evidence

- Pending implementation.
