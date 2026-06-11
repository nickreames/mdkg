---
id: task-330
type: task
title: plan mdkg dev launch after generated docs contract
status: done
priority: 2
epic: epic-72
parent: goal-13
tags: [mdkg-dev, docs, seo, 0-4-0]
owners: []
links: []
artifacts: [edd-23]
relates: [goal-13, epic-73]
blocked_by: []
blocks: []
refs: [edd-23]
aliases: []
skills: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Plan the `0.4.0` mdkg.dev launch gate only after generated command docs are
available.

# Acceptance Criteria

- mdkg.dev information architecture separates outcome-focused guides from
  generated command reference. Captured in `edd-23`.
- SEO/marketing claims are constrained by shipped safety posture. Captured in
  `edd-23` Security / privacy and Failure modes sections.
- Launch gate requires status/doctor, fix planning, subgraph safety, branch
  repair, generated command docs, package dry runs, and future website docs
  generation checks to be credible. Captured in `edd-23`.

# Files Affected

- `.mdkg/design/edd-23-mdkg-dev-launch-gate-and-information-architecture.md`
- Future mdkg.dev docs and site artifacts remain deferred.

# Implementation Notes

- No public website was implemented in this task.
- The generated command-reference pipeline must read
  `dist/command-contract.json`; `CLI_COMMAND_MATRIX.md` remains checked human
  reference material, not the public command-reference source of truth.
- Deferred surfaces must not be marketed as shipped: public worker execution,
  public event/reducer/lease/materializer CLI, downstream mutation automation,
  hosted queue/event store behavior, and arbitrary SQL access.

# Test Plan

- `node dist/cli.js validate --json`
- `node dist/cli.js goal next goal-13 --json`
- `git diff --check`
- Prior gate evidence: `npm run prepublishOnly` passed with
  `smoke:command-docs`.

# Links / Artifacts

- `edd-23`
- `edd-22`
- `epic-72`
- `epic-73`
