---
id: task-839
type: task
title: Correct final release-critical guidance against verified generic CLI behavior
status: done
priority: 1
tags: [release-0.6.0, release-guidance]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/task-839-release-guidance.json]
relates: []
blocked_by: [bug-44, bug-45, bug-48, bug-49, bug-50, bug-51, bug-52, bug-53, bug-54, bug-55, bug-56, bug-57, bug-58, bug-59, bug-60, task-841, task-842]
blocks: []
refs: [task-837, goal-84, goal-86, task-828, dec-98, goal-87, chk-656]
context_refs: [goal-86, goal-84, task-837]
evidence_refs: [chk-656]
aliases: []
skills: []
created: 2026-09-17
updated: 2026-09-28
---
# Overview

2026-09-28 Dec98: explicitly disclose Bugs46/47 as deferred and unresolved
under Goal87, never accepted/fixed. Their full remedies are not prerequisites
of this version's guidance. Require accurate portable SQLite/runtime and
operator-confirmed recovery instructions after Tasks841/842, with real
platform limitations and no native-helper claim. Broad documentation polish
remains separate. This amendment does not itself change public documentation.

Goal: correct materially false active release instructions after final remedies,
without expanding into the deferred broad documentation audit or polish goal.

Context: Task827's earned draft-preparation milestone remains complete. Task837
found remaining active materialization/push-ready, cache-persistence and output
format claims that contradict current source. This successor owns final truth
corrections and verified safety limitations, not new product scope.

# Acceptance Criteria

- Remove active references advertising retired Git mutation conveniences;
  native Git remains independently invoked by users and agents.
- Explain actual observational in-memory cache behavior versus explicit index
  writes and current structured output availability.
- Reconcile archive, transport, recovery and filesystem safety claims with
  verified final behavior and explicit platform/exclusion limits.
- Keep0.6.0 draft/unpublished and user customization intact. No broad prose
  reorganization, fleet migration, historic receipt rewriting or site deployment.
- Source/help/matrix/seed/generated-reference parity passes; historical changelog
  entries retain their original chronology rather than falsely becoming current.
- Any package-input correction precedes final artifact production/qualification.

# Files Affected

README.md; CLI_COMMAND_MATRIX.md and its owned seed/projections;
mdkg-dev/src/pages/index.astro; directly related release/upgrade/native-Git and
security-boundary guidance plus generated references and assertion tests.
Do not alter protected Demo3 artifacts or public production state.

# Implementation Notes

Owner: mdkg-project-agent, one repository writer under the explicit Goal86 run. Allowed: this bounded generic source remedy, directly required helpers, regression/installed fixtures, release-critical truth corrections and sanitized mdkg evidence. Preserve authored history, selected Goal73, runtime DB, Demo3 bundles and unrelated custody. No canonical migration, bundle/subgraph refresh, remote Git, publication, provider/deployment, cross-project writes, global configuration or history rewrite. Stop for a materially new architecture/security decision; no documentation-only waiver.

Broader documentation audit/polish stays deferred by Nick. No answer about
unreleased-v2 adoption is invented: public alpha and unknown consumer adoption
remain explicit. Release-blocking source defects are fixed, not waived by prose.

# Test Plan

Source-bound CLI/help/docs/generated checks, unchanged package boundaries,
local website/documentation assertions where applicable, and final installed
examples. Independently review claims against the exact final implementation.
Task828/829 consume this completed work; no dependency on their own acceptance.

# Links / Artifacts

- .mdkg/artifacts/goal-86/task-837-standard-security-audit.json
- root:task-827; root:task-828; root:task-829; root:task-830

## Current State

2026-09-28 local guidance implementation and qualification complete. Full graph
validation has0errors and3preserved stale-subgraph warnings; changed-only has
0errors/0warnings, SQLite index5/5 and diff checks pass. Chk656 and the
sanitized task receipt bind the exact twelve owned guidance/checker/test paths.

Active retired Git and consumer-profile guidance is removed; capability cache,
runtime DB, structured-format, compact-init and reviewed-upgrade claims match
current behavior. Bugs46/47 are explicitly deferred/unresolved under Goal87.
Historical changelog chronology remains intact, release state draft/unpublished,
and broad documentation polish remains out of scope.

The checker now validates actual parser/command-option admission, including
missing values, without executing examples. An independent bounded source
review found three remaining prose contradictions plus the missing-value guard;
all are corrected with regression coverage and final reviewer readback.
34 focused checks,499 current examples across66 files, source/help/seed/generated
reference checks,8 skills and local site/docs/SEO smokes pass.59 illustrative
and13 historical examples are separately reported, not counted as current passes.

Normally packed/installed command-docs smoke passes on Node24.18.0/macOSarm64:
114 command entries and seven operational examples, with explicit index and
final graph validation. Intermediate tarball SHA256:
6154e4ea920bfa09d57532171df808f3f406250b44b2b318f0bb48542f82cdca.
Its owned temporary root was removed. Guidance/seed changes invalidate older
tarballs for final qualification; earlier passes retain their snapshot-bound
intermediate value. Final independent security/platform acceptance, full
coverage/ladder and exact seal remain Goal86 gates, not this guidance milestone.

No new staging/commit, remote action, bundle refresh, blocked-context access or
production change. Selection/runtime/Demo3/draft-release bookends match.
Skill coverage reused; new candidates:none.
