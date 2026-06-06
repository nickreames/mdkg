---
id: task-259
type: task
title: close skill SPEC authoring foundation evidence
status: done
priority: 1
epic: epic-45
parent: goal-6
tags: [closeout, evidence, validation]
owners: []
links: []
artifacts: []
relates: [goal-6, task-258, test-94]
blocked_by: [task-258, test-94]
blocks: []
refs: [edd-14]
aliases: [skill-spec-authoring-closeout]
skills: [verify-close-and-checkpoint]
created: 2026-06-04
updated: 2026-06-05
---
# Overview

Close `goal-6` after root follow-up sync planning and validation evidence are
recorded.

# Acceptance Criteria

- `mdkg validate` passes.
- `mdkg skill validate author-mdkg-skill --json` passes.
- Template coverage check passes.
- Root follow-up sync plan is recorded.
- Product-specific naming is removed from current public doctrine, templates,
  `goal-6`, and `author-mdkg-skill` guidance.
- Runtime-agent and orchestrator-agent concepts are discoverable through
  capability search.

# Files Affected

- Child mdkg closeout evidence only.

# Implementation Notes

- Close only after `task-258` and `test-94` are complete.

# Test Plan

- `mdkg validate`
- `mdkg goal next goal-6 --json`
- `mdkg skill validate author-mdkg-skill --json`
- `mdkg capability search "SPEC template taxonomy" --json`
- `mdkg capability search "runtime agent manifest" --json`
- `mdkg capability search "orchestrator agent" --json`
- `mdkg capability search "skill factory backlog" --json`
- `rg -n "Omni|omni|OmniRuntime|OmniTx|OmniPL|omni://|omniruntime" .mdkg/templates .mdkg/design/edd-14* .mdkg/design/dec-24* .mdkg/work/goal-6* .mdkg/skills/author-mdkg-skill/SKILL.md`
- `git diff --check`

# Closeout Evidence

- `goal-6` was reframed as generic capability projection.
- `edd-14` now defines generic SPEC/SKILL taxonomy, orchestrator/subagent
  vocabulary, queue/event semantics, single-writer policy, and receipt
  persistence doctrine.
- `dec-24` now allows optional generic capability URI fields such as
  `capability://...` and `mdkg://capability/...` while rejecting downstream
  product schemes in canonical mdkg templates.
- Base, project, agent, capability, and runtime-agent SPEC templates were
  hardened for authority/resource boundaries, queue semantics, single-writer
  policy, receipts/evidence, validation, security/privacy, projection targets,
  versioning, and change policy.
- `omniruntime-agent.SPEC.md` was replaced by
  `.mdkg/templates/specs/runtime-agent.SPEC.md`.
- `author-mdkg-skill` and mirrored skill folders were synchronized with generic
  source/projection guidance.
- Validation passed for `mdkg index`, `mdkg validate`,
  `mdkg skill validate author-mdkg-skill --json`, capability discovery, template
  coverage grep, product-name grep, and `git diff --check`.

# Links / Artifacts

- `task-258`
- `test-94`
