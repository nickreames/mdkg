---
id: task-802
type: task
title: align publish readiness goal skill assertion with current public seed contract
status: done
priority: 0
tags: [audit-followup, release, skills, ci]
owners: [root]
links: []
artifacts: []
relates: [loop-7]
blocked_by: []
blocks: [test-462]
refs: [loop-7, spike-32, test-461, chk-541, chk-542]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-17
updated: 2026-07-21
---
# Overview

Restore current release-readiness correctness after `root:test-461` proved that
both `ci:release` and `prepublishOnly` fail during local `npm pack`. The built
public `pursue-mdkg-goal` skill contains the required goal-routing behavior, but
`scripts/assert-publish-ready.js` still requires the removed presentation
heading `Skill Improvement Candidates`.

# Acceptance Criteria

- Replace the stale heading assertion with stable, behavior-level goal
  lifecycle requirements: explicit goal QID use, `mdkg goal next`, ownership,
  checkpoint evidence, evaluation, and conditional done.
- A heading-only reorganization of a semantically complete goal skill passes;
  removing any required lifecycle behavior fails with a precise diagnostic.
- Canonical, configured mirrors, public seed, and built public seed satisfy the
  declared projection contract without changing release authority boundaries.
- `node scripts/assert-publish-ready.js`, `npm run smoke:consumer`,
  `npm run smoke:git-materialize`, and `npm run ci:release` pass on Node 24.
- No unrelated skill, workflow, dependency, lockfile, or generated tracked path
  changes.

# Files Affected

- `scripts/assert-publish-ready.js`
- focused publish-readiness/public-release tests or fixtures
- public skill projection source only if the accepted projection policy
  requires a content correction

# Implementation Notes

- Do not solve this by replacing one brittle heading literal with another.
- Keep the `root:dec-85` publication boundary and public release-skill absence.
- Use `root:chk-542` and `command-receipts.md` as the failing baseline.

# Test Plan

- Add positive semantic and heading-insensitivity cases plus one negative case
  per required lifecycle behavior.
- Run `npm run test:public-release`, `node scripts/assert-publish-ready.js`,
  both pack-triggering smokes, `npm run ci:release`, graph validation, and
  `git diff --check`.

# Links / Artifacts

- `root:loop-7`
- `root:test-461`
- `root:chk-542`
- `.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/command-receipts.md`

# Results / Evidence

Implemented on Node 24.18.0 after reproducing the exact baseline failure:

- Before the repair, `node scripts/assert-publish-ready.js` failed with
  `dist/init pursue-mdkg-goal skill is missing goal pursuit guidance` even
  though the built skill contained the current lifecycle behavior.
- The cause was the literal `Skill Improvement Candidates` heading check at
  `scripts/assert-publish-ready.js`; the heading had been removed while its
  behavior remained.
- Added a small behavior contract covering explicit goal QID routing,
  `goal next`, ownership before claim, checkpoint evidence before commit,
  evaluation, and conditional goal completion.
- Publish readiness now applies the contract to canonical, Codex mirror,
  Claude mirror, public seed, and built public seed content, and requires exact
  canonical projection equality.
- Added eight focused Node tests: one heading-insensitive positive case, one
  precise negative case per behavior identity, and canonical-skill coverage.
- `npm run build` and `node scripts/assert-publish-ready.js` pass after the
  change. No skill content, workflow, dependency, lockfile, package version,
  tag, release, or publication surface changed.
