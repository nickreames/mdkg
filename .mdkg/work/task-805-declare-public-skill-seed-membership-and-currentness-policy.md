---
id: task-805
type: task
title: enforce public skill seed membership and currentness policy
status: backlog
priority: 2
parent: goal-78
prev: test-471
next: test-465
tags: [audit-followup, skills, public-seed, policy]
owners: []
links: []
artifacts: []
relates: [loop-7]
blocked_by: [test-471]
blocks: [test-465]
refs: [goal-78, loop-7, spike-32, test-461, chk-541, chk-542, chk-544, dec-19, dec-85, dec-89, task-812, test-471]
context_refs: [goal-78, loop-7, chk-544, dec-19, dec-85, dec-89, task-812, test-471]
evidence_refs: []
aliases: []
skills: [author-mdkg-skill, service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-17
updated: 2026-07-26
---
# Overview

After `root:test-471` proves the six public bodies portable, make their exact
membership/currentness policy machine-readable and enforce it consistently in
source, build, validation, publish readiness, and fresh init.

# Acceptance Criteria

- Add `assets/init/skills/public-seed-policy.json` and copy it to
  `dist/init/skills/public-seed-policy.json`; do not place policy inside the
  installable `skills/default/` directory.
- Declare the six exact members and two repository-local exclusions from
  `root:dec-89`.
- V1 supports only `exact` and `excluded`; do not implement
  `reviewed_snapshot`.
- One reusable projection validator enforces canonical/configured mirrors for
  all eight and canonical/public-source/built-seed/fresh-init equality for the
  six exact members.
- The validator rejects missing/extra members, hash drift, excluded membership,
  and excluded release behavior embedded under another slug.
- Build and init behavior consume or validate the policy rather than infer it
  from directory contents.
- Fresh `mdkg init --agent` discovers exactly six public members and never
  exposes either repository-local skill.
- Existing customized upgrade targets remain preserved.

# Files Affected

- `assets/init/skills/public-seed-policy.json`
- built policy under `dist/init/skills/`
- reusable projection validator
- init, smoke-init, skill-validation, and publish-readiness integration
- focused schema, membership, hash, behavior, and upgrade-preservation tests

# Implementation Notes

- Portability reconciliation is complete before this task begins.
- Preserve create-if-missing behavior from `root:dec-19`.
- Preserve publication separation from `root:dec-85`.
- Do not maintain separate membership/hash logic in init, validation, smoke,
  and publish-readiness code.

# Test Plan

- Validate policy schema and canonical/configured mirrors.
- Compare six exact projections across public source and built seed.
- Initialize a disposable repo and assert exact membership/exclusions/hashes.
- Exercise missing, extra, drifted, excluded, embedded-release, and preserved
  customization cases.
- Run focused init/publish projection smokes, graph validation, and Git hygiene
  checks. Defer `ci:release` and `prepublishOnly` to the one shared Goal 78
  closeout execution.

# Links / Artifacts

- `root:dec-19`
- `root:dec-85`
- `root:dec-89`
- `root:goal-78`
- `root:test-471`
- `root:loop-7`
- `.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/skill-projection-inventory.json`
