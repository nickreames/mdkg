---
id: task-736
type: task
title: Add templates forks readiness routing evidence and closeout documentation
status: done
priority: 1
epic: epic-238
tags: [release, implementation, goal-63]
owners: []
links: []
artifacts: []
relates: [goal-63]
blocked_by: [task-735]
blocks: [task-737, test-404]
refs: [test-404, edd-71, dec-73, dec-74, prd-11, prop-8]
context_refs: [goal-61, goal-62, goal-63, epic-238, dec-65, dec-67, dec-74, prop-8, task-710, task-735]
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-11
---
# Overview

Add the two lifecycle reference pages that explain reusable loop construction,
provenance, readiness, continuation, evidence, waivers, and honest closeout.

# Acceptance Criteria

- Add `/loops/templates-and-forks/` with all seven bundled templates, raw loop
  creation versus fork, default/planning-only/manual materialization, template
  identity/hash, stale warnings, and no automatic fork rewrite.
- Use the selected Template Catalog treatment as an information pattern on this
  docs page without copying unsupported bitmap content.
- Add `/loops/readiness-routing-evidence-closeout/` with pre-run questions,
  typed decision answers, approval requirements, authorized/gated/prohibited
  actions, evidence lanes, identity-scoped waivers, run/output refs, and
  definition-of-done state.
- Explain `plan`, `next`, and `runs` as inspection/routing commands, not runtime
  execution.
- Explain blocker recovery: source-grounded spike, proposal with at least three
  viable options, recommendation, blocker evidence, then continued authorized
  work when another lane remains.
- State that a loop is blocked only when no authorized child work or recovery
  path remains and closes only when required lanes complete or are explicitly
  waived.
- Gate routes, sidebar, metadata, sitemap, Pagefind, and LLM output by shared
  release state.

# Files Affected

- `docs/src/content/docs/loops/templates-and-forks.*`
- `docs/src/content/docs/loops/readiness-routing-evidence-closeout.*`
- Related navigation, content, and search tests

# Implementation Notes

- Generated CLI reference owns exhaustive syntax.
- Distinguish requested approvals from required approvals and unrelated refs
  from identity-matched evidence.
- Keep backend/API/CLI bloat as a secondary template example, not another
  homepage CTA.

# Test Plan

Run `test-404`; verify both routes across draft and preview modes, all seven
template names, provenance/continuation/waiver accuracy, Pagefind/sitemap state,
desktop/mobile navigation, headings, links, code overflow, and themes.

# Results / Evidence

- Added gated Templates and forks documentation covering all seven bundled
  templates, raw loop creation, default/planning-only/manual materialization,
  provenance hashes, stale warnings, and the explicit no-auto-rewrite rule.
- Added gated lifecycle documentation for identity-bound questions, requested
  approvals, evidence lanes, paired decision/approval waivers, `plan`, `next`,
  `runs`, blocker recovery, exhaustion, and honest closeout.
- Kept exact exhaustive syntax in the generated reference and retained the
  backend/API/CLI bloat template as a secondary documentation example.
- Active-preview docs build, sitemap, Pagefind page-count, and focused content
  assertions passed; draft output emits no loop routes or sitemap entries.
  Browser navigation/theme/reflow proof remains in `task-741` and `test-404`.

# Links / Artifacts

- `task-735`
- `test-404`
- `prop-8`
