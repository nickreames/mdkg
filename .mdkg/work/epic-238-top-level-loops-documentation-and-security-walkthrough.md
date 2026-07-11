---
id: epic-238
type: epic
title: Top-level Loops documentation and security walkthrough
status: done
priority: 1
tags: [release, implementation, goal-63]
owners: []
links: []
artifacts: []
relates: [goal-63]
blocked_by: []
blocks: []
refs: [task-735, task-736, task-737, test-404, test-405, edd-71, dec-68, dec-73, dec-74, prd-11, prop-8]
context_refs: [goal-61, goal-62, goal-63, edd-71, dec-73, dec-74, prd-11, prop-8, task-710, task-711]
evidence_refs: [chk-446, chk-447, chk-448, chk-486, chk-487]
aliases: []
skills: []
created: 2026-07-11
updated: 2026-07-11
---
# Goal

Give first-class loops one coherent documentation home and a safe, purpose-built
security-audit walkthrough that teaches the real mdkg/harness boundary.

# Scope

- Four exact `/loops/` routes and conditional top-level Loops navigation.
- Goals-versus-loops, templates/forks, readiness/routing/evidence/closeout, and
  blocker-recovery concepts.
- Seven bundled templates and provenance/stale-fork behavior.
- Purpose-built security walkthrough with supported commands, typed decision
  bindings, read-only boundaries, and approval-gated external checks.
- Draft route/search/index suppression and active-preview noindex behavior.

# Milestones

- `task-735`: overview and runtime boundary.
- `task-736` / `test-404`: lifecycle routes and release-state behavior.
- `task-737` / `test-405`: verified security walkthrough.

# Out of Scope

Copied dogfood receipts, internal ids/paths/hashes, runtime execution claims,
CocoIndex, general docs-sidebar redesign, and a dedicated marketing release page.

# Risks

- Hand-written examples can drift from generated command contracts.
- Conditional pages can leak into Pagefind, sitemap, metadata, or LLM output.

# Links / Artifacts

- `dec-74`
- `prop-8`
- `CLI_COMMAND_MATRIX.md`
