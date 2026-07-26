---
id: task-812
type: task
title: Reconcile portable skill bodies before exact public projection
status: backlog
priority: 1
parent: goal-78
next: test-471
tags: [skills, public-seed, portability, release-boundary]
owners: []
links: []
artifacts: []
relates: [loop-7, task-805]
blocked_by: [test-464]
blocks: [test-471]
refs: [goal-78, loop-7, goal-74, dec-19, dec-85, dec-89, task-805, test-465]
context_refs: [goal-78, loop-7, goal-74, dec-19, dec-85, dec-89, task-805, test-465]
evidence_refs: []
aliases: []
skills: [author-mdkg-skill, service-boundary-ownership-check]
created: 2026-07-25
updated: 2026-07-25
---
# Overview

Reconcile the six declared public skill bodies for portability before exact
projection enforcement. Exact copying is unsafe while canonical bodies contain
package-publication behavior or dangling repository-specific references.

# Acceptance Criteria

- Remove package-publication, registry-authentication, token, push, tag,
  deployment, provider, and mdkg-package release procedures from
  `verify-close-and-checkpoint`; retain portable validation, evidence,
  checkpoint, bundle-aware, and multi-repo closeout behavior.
- Keep package publication authority exclusively in the repository-local
  `release-mdkg-package` skill under `root:dec-85`.
- Reconcile `pursue-mdkg-loop`, `select-work-and-ground-context`, and
  `verify-close-and-checkpoint` with their public candidates without losing
  portable behavior.
- Remove dangling repository-specific QIDs and local design/work links from all
  six public candidates, including already-equal bodies.
- Generic `.mdkg` concepts, generic path patterns, and non-authorizing safety
  boundaries remain allowed.
- Edit only canonical `.mdkg/skills` bodies; update configured mirrors only
  through `mdkg skill sync`.
- Do not create the projection policy or validator here; that remains
  `root:task-805`.
- No workflow, dependency, existing consumer-repo, package release, or public
  positioning change.

# Files Affected

- the six canonical portable `.mdkg/skills/*/SKILL.md` bodies as required
- configured `.agents` and `.claude` mirrors through `mdkg skill sync`
- approved public source bodies under `assets/init/skills/default/`
- focused portability/release-isolation fixtures

# Implementation Notes

- Use `root:dec-89` as the catalog and behavioral-exclusion contract.
- Preserve public create-if-missing and customization behavior from
  `root:dec-19`.
- A public skill may say that release requires separate authority; it may not
  contain the release procedure.
- Keep exact package command truth in package scripts/CI and reference it from
  the repository-local release skill rather than duplicating it in portable
  closeout.

# Test Plan

- Run focused forbidden-behavior and dangling-reference scans for each public
  candidate.
- Prove portable lifecycle, loop, task-pack, skill-authoring, selection, and
  closeout behavior remains.
- Validate canonical/configured mirror equality after sync.
- Hand exact public projection and init proof to `root:task-805` and
  `root:test-465`.

# Links / Artifacts

- `root:goal-78`
- `root:dec-19`
- `root:dec-85`
- `root:dec-89`
- `root:test-471`
- `root:task-805`
- `.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/skill-projection-inventory.json`
