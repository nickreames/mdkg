---
id: task-800
type: task
title: Expose the lifecycle skill through the public init agent seed
status: done
priority: 1
epic: epic-254
tags: [public-seed, init, skills]
owners: [goal-60-mdkg-child-writer]
links: []
artifacts: [assets/init/skills/default/pursue-mdkg-goal/SKILL.md]
relates: [goal-74, edd-79, dec-85]
blocked_by: [task-798]
blocks: [test-459, test-460]
refs: [goal-74, edd-79, dec-85]
context_refs: [edd-79, dec-85]
evidence_refs: [chk-540]
aliases: []
skills: [pursue-mdkg-goal, author-mdkg-skill]
created: 2026-07-16
updated: 2026-07-16
---
# Overview

Update the existing public default lifecycle skill with the canonical portable
body and prove `mdkg init --agent` installs and discovers it without exposing
repository-local release authority.

# Acceptance Criteria

- Public and canonical lifecycle skill files are byte-identical.
- The public body contains no repository, customer, or product-specific terms.
- A temporary initialized fixture discovers `pursue-mdkg-goal` with the updated
  explicit-QID and local-only lifecycle contract.
- Fixture output is removed after validation.
- No startup wrapper change is made unless discovery evidence proves it needed.

# Files Affected

- `assets/init/skills/default/pursue-mdkg-goal/SKILL.md`

# Implementation Notes

- Keep all other public default skills and non-skill templates unchanged.
- Never add `release-mdkg-package` to public defaults.

# Test Plan

Run exact comparison, forbidden-name scan, release-skill absence assertions, and
the disposable init fixture in `test-459`.

# Links / Artifacts

- `edd-79`
- `dec-85`
- `goal-74`

# Verification Evidence

- Public and canonical lifecycle copies share SHA-256
  `3b8493ee443a289ba257ed0e30045be84e9b647ef7ebfd88782319382f489776`.
- A disposable 77-file `mdkg init --agent` fixture discovered version `0.2.0`,
  produced exact configured mirrors, omitted the local release skill, and was
  removed after validation.
- Existing startup discovery passed without wrapper changes.
