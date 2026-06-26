---
id: task-581
type: task
title: update docs generated help command matrix and skills for MANIFEST terminology
status: todo
priority: 1
epic: epic-197
parent: goal-37
tags: [manifest, docs, help, command-matrix, skills]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [edd-54]
context_refs: []
evidence_refs: []
aliases: [manifest-docs-help-skills, spec-deprecation-docs, author-manifest-skill-update]
skills: [select-work-and-ground-context]
created: 2026-06-25
updated: 2026-06-25
---
# Overview

Update all user-facing text to explain `MANIFEST.md` as the canonical
declarative runtime/capability surface and `SPEC.md` as a legacy alias.

# Acceptance Criteria

- README, docs site, generated CLI reference, command matrix, CLI help, and
  changelog are manifest-first.
- Migration note says `SPEC.md` is accepted as a legacy alias for one
  compatibility release.
- Docs explain that manifests are declarative metadata and contracts, not shell
  execution or arbitrary config.
- Skills that say "SPEC.md" are updated to "MANIFEST.md" with legacy
  discoverability terms retained where useful.
- Skill mirrors are synced through the repo's canonical skill command flow.

# Files Affected

- `README.md`
- `CLI_COMMAND_MATRIX.md`
- `docs/**`
- `docs/_generated/**`
- `src/cli.ts`
- `.mdkg/skills/author-mdkg-skill/SKILL.md`
- `.agents/skills/author-mdkg-skill/SKILL.md`
- `.claude/skills/author-mdkg-skill/SKILL.md`
- `CHANGELOG.md`

# Implementation Notes

- Do not remove all `SPEC.md` mentions. Keep enough legacy bridge text for
  migration and search.
- Avoid "manifest executes" language.

# Test Plan

- `test-295`
- `npm run docs:check`
- `npm run cli:check`
- `mdkg skill validate author-mdkg-skill --json`
- `mdkg capability search "MANIFEST.md legacy SPEC.md" --json`

# Links / Artifacts

- `edd-54`
- `dec-50`
- `test-295`
