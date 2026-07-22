---
id: task-805
type: task
title: declare public skill seed membership and currentness policy
status: backlog
priority: 1
tags: [audit-followup, skills, public-seed, policy]
owners: []
links: []
artifacts: []
relates: [loop-7]
blocked_by: []
blocks: [test-465]
refs: [loop-7, spike-32, test-461, chk-541, chk-542, dec-85]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-17
updated: 2026-07-17
---
# Overview

Make public init skill projection policy machine-readable. Managed mirrors are
currently exact, but three of six public seed bodies diverge from canonical and
existing checks cannot tell an approved snapshot from accidental staleness.

# Acceptance Criteria

- Declare the six portable public members explicitly:
  `author-mdkg-skill`, `build-pack-and-execute-task`, `pursue-mdkg-goal`,
  `pursue-mdkg-loop`, `select-work-and-ground-context`, and
  `verify-close-and-checkpoint`.
- Declare those six exact canonical projections and reconcile their public
  bodies after reviewing portability; keep configured `.agents`/`.claude`
  mirrors exact.
- Declare `release-mdkg-package` intentionally repository-local under
  `root:dec-85`; declare `service-boundary-ownership-check` repository-local
  unless a separate accepted decision broadens public membership.
- Future public divergence requires a per-skill `reviewed_snapshot` mode,
  accepted decision ref, rationale, and expected hash; unannotated divergence
  fails validation.
- Fresh `mdkg init --agent` discovers exactly the declared public members and
  never exposes the release skill.

# Files Affected

- machine-readable skill projection policy/manifest
- approved public seed bodies under `assets/init/skills/default/`
- init, smoke-init, and publish-readiness projection tests
- configured mirrors only through canonical `mdkg skill sync`

# Implementation Notes

- Review canonical bodies for product neutrality before exact projection.
- Preserve create-if-missing init behavior from `root:dec-19` and publication
  separation from `root:dec-85`.
- Do not infer policy from directory presence alone.

# Test Plan

- Validate canonical and managed skills, compare policy-bound hashes, initialize
  a disposable repo, assert membership/exclusions, and run init/publish smokes,
  graph validation, and Git hygiene checks.

# Links / Artifacts

- `root:dec-19`
- `root:dec-85`
- `root:loop-7`
- `.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/skill-projection-inventory.json`
