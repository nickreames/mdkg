---
id: task-598
type: task
title: audit and refresh first party skills for current CLI capability coverage
status: done
priority: 1
epic: epic-201
parent: goal-41
tags: [0.3.9, skills, docs, cli-coverage]
owners: []
links: []
artifacts: [.mdkg/skills, CLI_COMMAND_MATRIX.md, docs/src/content/docs/reference/cli.md]
relates: []
blocked_by: [task-594]
blocks: [test-305, task-600]
refs: [task-594]
context_refs: []
evidence_refs: []
aliases: []
skills: [author-mdkg-skill]
created: 2026-06-26
updated: 2026-06-27
---
# Overview

Audit and refresh first-party mdkg skills so they explain the current CLI
capabilities and the new `0.3.9` customization model.

# Acceptance Criteria

- First-party skills cover current command families, including manifest,
  capability, archive, bundle, subgraph, work, db, upgrade, validate, and docs
  checks where relevant.
- Stale `SPEC.md`, `.agents`-only, or outdated command syntax examples are
  corrected.
- Skill updates preserve stage tags and writer-safety boundaries.

# Files Affected

- `.mdkg/skills/`
- mirrored skill outputs if sync is required
- CLI/docs references needed by the skills

# Implementation Notes

- Use `author-mdkg-skill` for skill edits.
- Do not expand skills into broad prose docs; keep them operational.
- Mirror generated skills only after canonical `.mdkg/skills/` is correct.

# Test Plan

- `mdkg skill list --json`
- `mdkg skill show <slug> --json` for changed skills
- docs/command checks if examples change
- `test-305`

# Links / Artifacts

- `edd-57`

# Audit Findings

- `docs/src/content/docs/reference/cli.md` in the original task context is stale; the current generated docs references are `docs/src/content/docs/reference/generated-cli-reference.md`, `docs/src/content/docs/reference/command-contract.md`, and `docs/_generated/`.
- Canonical `.mdkg/skills/author-mdkg-skill/SKILL.md` already covered MANIFEST authoring but still described mirror targets as fixed `.agents/skills` and `.claude/skills`; it now documents configured `customization.skill_mirrors.targets` with those paths as defaults.
- Canonical `.mdkg/skills/verify-close-and-checkpoint/SKILL.md` needed the current release gate: changelog mapping, generated-doc/version drift as blockers, `cli:contract`, `docs:check`, changed-only validation, npm pack dry-run, npm publish dry-run, registry target checks, and an explicit no-real-publish/no-tag/no-push boundary without approval.
- Published init seed skills lagged behind canonical skills and did not include `author-mdkg-skill`, despite README advertising it as a first-party skill. The seed now includes the authoring skill and all seeded skill bodies are mechanically aligned to canonical `.mdkg/skills`.
- Configured skill mirrors were refreshed from canonical skills: `.agents/skills` and `.claude/skills` now each contain the five first-party skills.

# Implementation Evidence

- Updated `.mdkg/skills/author-mdkg-skill/SKILL.md` for configured mirror targets, MANIFEST-over-SPEC authoring policy, and changed-only validation/sync checks.
- Updated `.mdkg/skills/verify-close-and-checkpoint/SKILL.md` for the full pre-publish readiness audit, dry-run publish gate, registry checks, explicit publish approval boundary, and post-publish temp-install validation.
- Added `assets/init/skills/default/author-mdkg-skill/SKILL.md`.
- Synchronized `assets/init/skills/default/{author-mdkg-skill,build-pack-and-execute-task,pursue-mdkg-goal,select-work-and-ground-context,verify-close-and-checkpoint}/SKILL.md` from canonical skill bodies.
- Ran `node dist/cli.js skill sync --json`: `synced: 10`, `pruned: 0`, `targets: 2`.
- Added seed guardrails in `tests/commands/init.test.ts`, `scripts/smoke-init.js`, and `scripts/assert-publish-ready.js` for the authoring skill and publish-approval boundary.

# Verification Evidence

- `node dist/cli.js skill list --json` returned five first-party skills.
- `node dist/cli.js skill validate --json` passed: `checked_count: 5`, `warning_count: 0`, `error_count: 0`.
- `node dist/cli.js skill show author-mdkg-skill --json` showed configured mirror target guidance and MANIFEST policy.
- `node dist/cli.js skill show verify-close-and-checkpoint --json` showed the full pre-publish gate and explicit approval boundary.
- `npm run build` passed.
- `npm run build:test` passed.
- `node --test dist/tests/commands/init.test.js` passed: 9 tests.
- `node scripts/assert-publish-ready.js` passed.
- `npm run smoke:init` passed.
- `npm run smoke:upgrade` passed.
- `npm run cli:check` passed.
- `npm run cli:contract` passed with command contract hash `145781176fcd00d6b7c7edd8e013e902acea2ace8764dbf0bb063a8d3913a3e1`.
- `npm run docs:check` passed and verified generated docs outputs.
- `node dist/cli.js index` refreshed graph, skills, capabilities, subgraphs, and sqlite indexes.
