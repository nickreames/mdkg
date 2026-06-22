---
id: chk-185
type: checkpoint
title: mdkg.dev planning bundle distilled into canonical roadmap nodes
checkpoint_kind: implementation
status: backlog
priority: 9
tags: [mdkg-dev, planning-ingestion, graph-only, checkpoint]
owners: []
links: []
artifacts: [archive://archive.mdkg-dev-planning-docs-2026-06-22, mdkg_planning_docs.zip]
relates: [task-444]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-444]
created: 2026-06-21
updated: 2026-06-22
---
# Summary

The committed mdkg.dev planning bundle was archived and distilled into canonical mdkg roadmap nodes. Goal 24 now records the graph-only ingestion pass, and Goal 25 is seeded as the paused implementation roadmap for the split source layout: /mdkg-dev Astro site, /docs GitBook source, and /examples demo/template graphs.

# Scope Covered

Scope: task-444 plus the completed Goal 1 ingestion chain task-437 through task-443, spike-13, and test-196 through test-199.

## Changed Surfaces

- Added private archive sidecar archive://archive.mdkg-dev-planning-docs-2026-06-22 for mdkg_planning_docs.zip.
- Added canonical design nodes prd-4, prd-5, edd-24, edd-25, edd-26, edd-27, and dec-30.
- Added active Goal 24 and paused Goal 25 with implementation epics, tasks, tests, and spike-14.
- Added supersession notes to older external-docs-only context nodes.
- Refreshed .mdkg index caches.

## Boundaries

- in scope: mdkg graph/design/archive/index changes only.
- out of scope: src, scripts, package metadata, generated command docs, /docs, /mdkg-dev, /examples, publishing, pushing, tagging, deploying, or global install.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded: yes.

# Decisions Captured

- dec-30 records that canonical mdkg.dev source lives in this repo with split /mdkg-dev, /docs, and /examples layout.
- prd-4 and prd-5 capture public-alpha positioning, origin story, polish, and prelaunch requirements.
- edd-24 through edd-27 capture static-site/docs architecture, CLI/agent UX doctrine, demo/template architecture, and IA/conversion paths.

# Implementation Summary

Goal 1 turns the planning docs from loose source material into durable mdkg graph state. Goal 2 is intentionally paused and blocked by Goal 24 so future implementation can start from a scoped roadmap rather than from raw planning files. Older external-docs-only decisions remain searchable historical context and now point to the new canonical records.

# Implementation Details

- Code or graph surfaces changed: .mdkg/archive, .mdkg/design, .mdkg/work, and .mdkg/index.
- Architecture or data-shape notes: source planning paths are documented in node bodies and archive evidence; executable routing is kept to tasks, tests, spikes, and epics to avoid non-actionable goal traversal.
- Compatibility notes: no functional CLI or package behavior changed.

# Verification / Testing

## Command Evidence

- command: node dist/cli.js archive verify archive://archive.mdkg-dev-planning-docs-2026-06-22 --json
- result: ok true, raw and compressed archive payloads present.
- command: node dist/cli.js validate --json
- result: ok true, warning_count 0, error_count 0 after index refresh.
- command: node dist/cli.js goal next goal-24 --json
- result: routes to task-437; warning is limited to the planned paused Goal 2 blocker edge while Goal 25 remains blocked by Goal 24.
- command: node dist/cli.js pack goal-25 --pack-profile concise
- result: pack generated for paused implementation roadmap; warnings only reflect non-actionable context edges preserved by the planned Goal 2 blocker.
- command: git diff --check
- result: passed.

## Pass / Fail Status

- status: pass for graph-only ingestion and roadmap seeding.

## Known Warnings

- Goal traversal may warn about goal-25 as a non-actionable scoped edge while Goal 25 remains paused and blocked by Goal 24. This preserves the explicit blocker requested by the plan.

# Known Issues / Follow-ups

- Goal 25 still requires explicit activation before any implementation work starts.
- Future implementation must create /mdkg-dev, /docs, /examples, generated docs checks, and launch smokes in a separate run.

## Follow-up Refs

- goal-25
- spike-14
- task-445 through task-454
- test-200 through test-205

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- mdkg_planning_docs.zip
- .mdkg/pack/pack_concise_goal-25_20260621-234941874.md

# Raw Content Safety

- Evidence is summarized through mdkg refs and archive links. No raw secrets, raw prompts, raw payloads, or bulky execution traces are embedded in this checkpoint.
