---
id: task-775
type: task
title: Run complete local prepublish and packaged install verification
status: done
priority: 1
epic: epic-245
tags: [security, remediation, v0.5.0]
owners: []
links: []
artifacts: [security/v0.5.0-remediation-matrix.json, /private/tmp/mdkg-goal69-pack.z61HXO/mdkg-0.5.0.tgz]
relates: [goal-69]
blocked_by: [task-774]
blocks: []
refs: [edd-75, dec-80, chk-509, test-433]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-12
updated: 2026-07-12
---
# Overview

Run the complete local release ladder against the remediated candidate and prove
that security hardening did not break source, generated contracts, packaged CLI,
docs/sites, or supported upgrades.

# Acceptance Criteria

- Clean install, build, full tests, CLI contract/check, docs checks, graph
  validation, all relevant smokes, and `git diff --check` pass.
- Publish-readiness assertion, npm pack dry-run, npm publish dry-run, tarball
  contents, and isolated tarball install pass using temporary caches/prefixes.
- Existing goal, loop, Omni semantic files, archive, bundle, subgraph, DB,
  visibility, parallel, docs, website, and upgrade behavior remains compatible.
- No push, publish, tag, global replacement, activation, or deploy occurs.
- Record exact commit/worktree/tarball hashes and warnings in a checkpoint.

# Files Affected

List files/directories expected to change.

- Repository source and tests from prior tasks
- Temporary npm cache, tarball, install prefix, and site build outputs
- Mdkg checkpoint/evidence nodes only

# Implementation Notes

- Start from a reviewed clean worktree or document the exact intended diff.
- Never print npm credentials or use the real global prefix.
- A failing focused regression routes back to its owning task.

# Test Plan

Run every `goal-69` required check except the fresh external scan, plus installed-
package loop/init/validate/pack probes and full site builds/smokes. `test-433` must
pass before `task-776` starts.

# Links / Artifacts

- `task-774`, `epic-245`, `test-433`
- Goal 64 preflight evidence for parity
