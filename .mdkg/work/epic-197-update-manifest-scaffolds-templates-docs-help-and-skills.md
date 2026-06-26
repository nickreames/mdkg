---
id: epic-197
type: epic
title: update manifest scaffolds templates docs help and skills
status: todo
priority: 1
tags: [manifest, templates, docs, help, skills, cli]
owners: []
links: []
artifacts: []
relates: [goal-37, edd-54, dec-50]
blocked_by: [epic-195, epic-196]
blocks: [task-580, task-581, test-294, test-295]
refs: [edd-54]
context_refs: []
evidence_refs: []
aliases: [manifest-scaffold-docs-skills, manifest-cli-template-update, spec-deprecation-docs]
skills: []
created: 2026-06-25
updated: 2026-06-25
---
# Goal

Make all newly generated and user-facing mdkg surfaces manifest-first while
keeping legacy SPEC discoverability and migration guidance.

# Scope

- CLI scaffolds and aliases.
- Init and upgrade assets.
- Default and rich templates.
- README, docs site pages, generated CLI reference, command matrix, and CLI
  help snapshots.
- `.mdkg/skills/author-mdkg-skill` plus mirrored `.agents` and `.claude`
  skill copies after canonical skill sync.

# Milestones

- `task-580`: scaffolds, init, upgrade, templates, aliases.
- `task-581`: docs, help, command matrix, generated reference, and skills.
- `test-294` and `test-295`: scaffold and terminology contracts.

# Out of Scope

- No docs-first rename that gets ahead of source behavior.
- No downstream repo edits.

# Risks

- Generated docs can be stale if the command contract is not refreshed.
- Skill mirrors can drift if `.mdkg/skills` is edited without syncing mirrors.

# Links / Artifacts

- `goal-37`
- `edd-54`
- external links
