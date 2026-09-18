---
id: task-839
type: task
title: Correct final release-critical guidance against verified generic CLI behavior
status: backlog
priority: 1
tags: [release-0.6.0, release-guidance]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [bug-44, bug-45, bug-46, bug-47, bug-48, bug-49, bug-50, bug-51, bug-52, bug-53, bug-54, bug-55, bug-56, bug-57, bug-58, bug-59, bug-60]
blocks: []
refs: [task-837, goal-84, goal-86, task-828]
context_refs: [goal-86, goal-84, task-837]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-17
updated: 2026-09-17
---
# Overview

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

Planned / backlog; final guidance waits for its affected source remedies.
