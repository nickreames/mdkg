---
id: test-471
type: test
title: Prove portable skill bodies are product-neutral and release-isolated
status: done
priority: 2
parent: goal-78
prev: task-812
next: task-805
tags: [skills, public-seed, portability, test]
owners: []
links: []
artifacts: [.mdkg/artifacts/goal-78/portable-skill-body-verification.json]
relates: [task-812, task-805]
blocked_by: [task-812]
blocks: [task-805]
refs: [goal-78, task-812, task-805, dec-89, chk-555]
context_refs: [goal-78, task-812, task-805, dec-19, dec-85, dec-89]
evidence_refs: [chk-555]
aliases: []
skills: [verify-close-and-checkpoint]
cases: [six_portable_behaviors_preserved, no_package_release_authority, no_repository_specific_qids, no_dangling_local_links, canonical_mirrors_exact, public_candidates_ready]
created: 2026-07-25
updated: 2026-07-26
---
# Overview

Prove the six public candidates preserve portable workflow behavior while
excluding repository-specific references and package-release authority.

# Target / Scope

- six canonical portable skills
- configured `.agents` and `.claude` mirrors
- reconciled public source candidates
- release isolation under `root:dec-85` and `root:dec-89`

# Preconditions / Environment

- `root:task-812` is done.
- Configured mirrors were updated only through canonical `mdkg skill sync`.
- Focused scans use bounded fixtures and do not alter existing initialized
  repositories.

# Test Cases

- Each of the six candidates retains its declared portable lifecycle,
  selection, loop, pack, authoring, or closeout behavior.
- Public candidates contain no package publication, registry authentication,
  credential, push, tag, deployment, or provider procedure.
- Public candidates contain no root-qualified internal QID, named internal
  product/customer, or dangling repository-local design/work link.
- Generic `.mdkg` path concepts and non-authorizing safety language remain
  valid. Keyword presence alone is not a failure: statements that prohibit or
  separately gate publish, push, tag, deployment, or provider authority must
  pass.
- All eight canonical skills exactly match configured `.agents` and `.claude`
  mirrors.
- The six reconciled public candidates are ready for exact-mode projection;
  membership/build/init enforcement remains pending `root:test-465`.

# Results / Evidence

Attach behavior inventory, forbidden-surface scan, dangling-reference scan,
configured-mirror hashes, and final Git boundary to a test-proof checkpoint.

# Notes / Follow-ups

- This proof does not force-update existing consumer repositories.
- Projection policy schema and negative membership/hash fixtures remain owned
  by `root:task-805` and `root:test-465`.
- This focused proof does not run `ci:release` or `prepublishOnly`; those
  commands run once at Goal 78 closeout.
