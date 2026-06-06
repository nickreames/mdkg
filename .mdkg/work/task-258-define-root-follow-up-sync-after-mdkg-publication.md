---
id: task-258
type: task
title: define root follow-up sync after mdkg publication
status: done
priority: 1
epic: epic-45
parent: goal-6
tags: [sync, root, publication, templates]
owners: []
links: []
artifacts: []
relates: [goal-6, epic-45, test-94]
blocked_by: [task-257]
blocks: [task-259]
refs: [edd-14]
aliases: [root-follow-up-sync-after-mdkg-publication]
skills: [verify-close-and-checkpoint]
created: 2026-06-04
updated: 2026-06-05
---
# Overview

Define the root follow-up sync plan after mdkg publishes or locally accepts the
hardened seeded skills/templates.

# Acceptance Criteria

- mdkg repo changes are committed locally before root subgraph refresh.
- Root consumes mdkg assets after publish or accepted local SHA.
- Downstream all-repo upgrade/sync is a separate goal.
- Per-child SPEC adoption is staged after the root sync.

# Files Affected

- Child mdkg planning nodes only.

# Implementation Notes

- Do not push or publish from this planning task.
- Do not refresh a parent/root subgraph until the mdkg repo has a local commit
  or an explicitly accepted local SHA for the hardened templates.
- Parent/root orchestration should consume mdkg as the generic source of truth,
  not fork template content into a downstream-specific template set.
- Downstream products may add product-specific SPECs after consuming mdkg's
  generic templates; product names should not be promoted back into mdkg
  canonical template names or examples.
- Follow-up sync order:
  1. commit the mdkg template/skill/doctrine changes locally.
  2. optionally publish mdkg or record an accepted local SHA.
  3. refresh parent/root mdkg subgraph metadata to that accepted mdkg state.
  4. run a separate all-repo upgrade/skill-sync goal.
  5. run per-repo SPEC adoption only after the generic templates are available.
- The first follow-up adoption pass should validate generic SPEC sections,
  runtime-agent projection language, and Codex projection requirements without
  requiring any product-specific URI scheme.

# Test Plan

- `mdkg goal next goal-6 --json`
- Root follow-up plan exists in root `goal-16`.
- `mdkg capability search "SPEC template taxonomy" --json`
- `mdkg capability search "runtime agent manifest" --json`
- `mdkg capability search "orchestrator agent" --json`
- `mdkg capability search "skill factory backlog" --json`
- Product-name grep over current public doctrine/templates returns no matches.

# Evidence

- Genericized `goal-6`, `edd-14`, `dec-24`, SPEC templates, and
  `author-mdkg-skill`.
- Renamed the runtime-agent template to
  `.mdkg/templates/specs/runtime-agent.SPEC.md`.
- Synchronized mirrored skills with `mdkg skill sync --json`.
- Validation and capability discovery evidence is recorded in the closeout
  node for `goal-6`.

# Links / Artifacts

- `goal-6`
- `goal-16`
