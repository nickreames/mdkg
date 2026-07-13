---
id: task-720
type: task
title: Verify registry integrity fresh install and v0.4.2 upgrade
status: done
priority: 1
epic: epic-234
prev: task-719
next: task-721
tags: [release, registry, install, upgrade]
owners: []
links: []
artifacts: [artifact://npm/mdkg/0.5.0, artifact://github-actions/run/29254216004]
relates: [goal-64, test-391]
blocked_by: []
blocks: [task-721]
refs: [test-391, chk-513, chk-514]
context_refs: [goal-64, epic-234, edd-72, dec-69, task-719, chk-513]
evidence_refs: [chk-513, chk-514]
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-13
---
# Overview

Verify the public registry artifact independently from the source checkout before
changing the user's real global installation or activating public promotion.

# Acceptance Criteria

- Registry version and `latest` are 0.5.0; integrity/tarball metadata are recorded.
- A clean temporary install reports 0.5.0 and initializes/validates successfully.
- A preserved 0.4.2 workspace upgrades idempotently without losing goals, loops,
  MANIFEST compatibility, or legacy SPEC support.
- Packaged seeds, loop skill, descriptors, docs/help, and SQLite behavior are present.

# Files Affected

List files/directories expected to change.

- Temporary install and upgrade workspaces under `/private/tmp`
- Sanitized mdkg postpublish evidence nodes

# Implementation Notes

- Execute the installed binary by absolute path to avoid checkout shadowing.
- Do not activate websites yet.
- `task-719` is complete and `chk-513` is the authoritative publication handoff;
  this task has no remaining approval, security-scan, CI, or publish blocker.

# Results / Evidence

- Registry `latest`, version, SHA-1, integrity, and tarball identity match the
  published `0.5.0` candidate recorded in `chk-513`.
- A fresh registry install initialized and validated with SQLite, exposed all
  seven loop seeds and the loop skill/help surface, and preserved the fork ID
  across dry-run followed by the real fork.
- `plan`, `next`, and concise pack passed through the installed absolute binary.
- The preserved `0.4.2` fixture upgraded without conflicts, preserved goal/loop/
  canonical-MANIFEST hashes, migrated legacy SPEC to canonical MANIFEST, and
  produced an empty second dry-run.
- A post-upgrade legacy `SPEC.md` remains valid with its intended deprecation
  warning. Full sanitized evidence is recorded in `chk-514`; `test-391` passed.

# Test Plan

Run `test-391` against registry-fetched bytes and attach all version, integrity,
init, validate, and upgrade receipts.

# Links / Artifacts

- `edd-72`
- `goal-50`
- `chk-514`
