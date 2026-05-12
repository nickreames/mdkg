---
id: task-123
type: task
title: Harden skill mirror audit and prune coverage
status: done
priority: 3
epic: epic-13
tags: [0_0_4x, coverage, skills]
owners: []
links: []
artifacts: [tests/commands/skill_mirrors.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [test-75, task-92]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-05-08
updated: 2026-05-08
---
# Overview

Add focused regression coverage for `src/commands/skill_mirror.ts` audit
warnings and stale managed mirror pruning.

# Acceptance Criteria

- Cover validation warnings for missing mirror roots in agent bootstrap repos.
- Cover validation warnings for missing manifests, unmanaged mirrors, missing
  mirrored skills, and stale managed manifest entries.
- Cover `skill sync` pruning stale managed mirrors and removing unexpected root
  entries from managed mirror directories.
- Keep the change test-only unless mirror behavior is demonstrably wrong.

# Files Affected

- `tests/commands/skill_mirrors.test.ts`
- `COVERAGE_HARDENING_MATRIX.md`

# Implementation Notes

- Reuse existing skill mirror command fixtures and temporary roots.
- Prefer command-level assertions through `runValidateCommand` and
  `runSkillSyncCommand`.

# Test Plan

- `npm test -- --test-name-pattern "skill mirror|SkillMirror|skills"`
- `npm run test:coverage`
- `node dist/cli.js validate`

# Results / Evidence

- Added validation coverage for missing mirror roots in agent bootstrap repos.
- Added validation coverage for missing manifests, malformed manifests,
  non-array managed slug manifests, unmanaged mirrors, missing mirrored skills,
  and stale managed manifest entries.
- Added sync coverage for unmanaged repo skips, scaffolded mirror manifests,
  support-directory mirroring, nested drift warnings, stale support-file cleanup,
  and stale managed mirror pruning.
- `npm test -- --test-name-pattern 'skill mirror|skills'`: 244 passed.
- `npm run test:coverage`: 244 passed; all-files coverage `93.27%` line /
  `85.31%` branch; `src/commands/skill_mirror.ts` coverage `90.71%` line /
  `93.10%` branch.

# Links / Artifacts

- `COVERAGE_HARDENING_MATRIX.md`
