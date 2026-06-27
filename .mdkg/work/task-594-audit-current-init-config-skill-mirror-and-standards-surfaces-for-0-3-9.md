---
id: task-594
type: task
title: audit current init config skill mirror and standards surfaces for 0.3.9
status: done
priority: 1
epic: epic-199
parent: goal-41
tags: [0.3.9, audit, config, skill-mirrors, init]
owners: []
links: []
artifacts: [src/commands/init.ts, src/commands/skill_mirror.ts, src/core/config.ts, assets/init/config.json]
relates: []
blocked_by: []
blocks: [task-595, task-596, task-597, task-598, task-599]
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context]
created: 2026-06-26
updated: 2026-06-27
---
# Overview

Audit the current source surfaces that hard-code init assets, config schema,
skill mirror paths, default skills, and core docs before implementing `0.3.9`
extensibility.

# Acceptance Criteria

- Source-grounded notes identify current behavior in init, config loading,
  upgrade, and skill mirror commands.
- The audit confirms where `.agents/skills` and `.claude/skills` defaults are
  currently encoded.
- The audit maps which first-party skills and docs need updates after behavior
  changes.
- No functional source changes are made by this audit task.

# Files Affected

- mdkg graph evidence only during the audit.
- Later implementation will touch source files listed in `artifacts`.

# Implementation Notes

- Use source and CLI behavior over prior chat memory.
- Treat config overlays as selected policy from `dec-51`.
- Treat arbitrary mirror target paths as selected policy from `dec-52`.
- Treat `COLLABORATION.md` as selected policy from `dec-53`.

# Audit Findings

- `src/commands/skill_mirror.ts` still hard-codes `MIRROR_PRODUCTS =
  ["agents", "claude"]` and derives target roots as `.${product}/skills`.
  `syncSkillMirrors`, `preflightSkillMirrorTargets`, `auditSkillMirrors`, and
  `scaffoldMirrorRoots` all call that resolver, so arbitrary mirror paths need a
  config-backed resolver shared by sync, validation, init preflight, and upgrade
  side effects.
- `src/core/config.ts` has no enterprise overlay or skill-mirror model. The
  current validated config includes archive, index, capabilities, bundles, db,
  subgraphs, pack, templates, work, and workspaces only. `assets/init/config.json`
  likewise seeds no standards, core-doc, overlay, or mirror-target section.
- `src/commands/init.ts` treats `--agent` as the single switch for `AGENTS.md`,
  `CLAUDE.md`, startup docs, default skills, `SOUL.md`, `HUMAN.md`, registry,
  events, and mirror roots. It seeds and pins `rule-human`, but has no
  `COLLABORATION.md` asset, pin, or alias bridge yet.
- `src/commands/upgrade.ts` protects only `.mdkg/core/SOUL.md` and
  `.mdkg/core/HUMAN.md`, detects agent workspaces through fixed `.agents/skills`
  and `.claude/skills` paths, and reports the skill-mirror apply side effect as
  `.agents/skills,.claude/skills`. It already preserves customized docs and
  managed assets by hash, which is the right base for overlay-safe upgrade
  behavior.
- Current tests cover the fixed mirror topology in
  `tests/commands/skill_mirrors.test.ts`, init bootstrap expectations in
  `tests/commands/init.test.ts`, and upgrade preservation plus mirror sync in
  `tests/commands/upgrade.test.ts`. These are the main regression suites to
  extend for config overlays, custom mirror paths, and the collaboration bridge.
- First-party skill/docs update surface is small and explicit:
  `.mdkg/skills/{select-work-and-ground-context,build-pack-and-execute-task,
  pursue-mdkg-goal,verify-close-and-checkpoint,author-mdkg-skill}/SKILL.md`,
  `.mdkg/skills/registry.md`, `AGENT_START.md`, `README.md`,
  `CLI_COMMAND_MATRIX.md`, and generated docs. Existing text still describes
  `.agents/skills` and `.claude/skills` as the only mirror targets.

# Audit Conclusion

`task-595` should add the config/upgrade overlay model first, `task-596` should
replace hard-coded mirror resolution with safe repo-relative configured targets,
`task-597` should add `COLLABORATION.md` while preserving `HUMAN.md` for one
compatibility release, and `task-598`/`task-599` should update the skills and
docs automation after the CLI behavior is stable. This task made graph evidence
only and intentionally left source behavior unchanged.

# Test Plan

- `node dist/cli.js validate --changed-only --json`
- `node dist/cli.js goal next goal-41 --json`
- `git diff --check`

# Links / Artifacts

- `dec-51`
- `dec-52`
- `edd-56`
