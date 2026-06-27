---
id: task-616
type: task
title: deploy and verify mdkg.dev and docs.mdkg.dev on Vercel after npm publish
status: todo
priority: 1
epic: epic-204
parent: goal-42
tags: [0.4.0, vercel, mdkg-dev, docs, deploy, approval, production]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-615, test-318]
blocks: [test-319, task-617, task-605, task-606, test-312]
refs: [task-615, test-318, task-605, task-606, test-312]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-27
updated: 2026-06-27
---
# Overview

Deploy and verify mdkg.dev plus docs.mdkg.dev through Vercel after npm
postpublish validation proves `mdkg@0.4.0` is available.

# Acceptance Criteria

- The execution re-checks Vercel project state before acting:
  `mdkg-dev` (`prj_R9FJkRf2FsmcM9cuIyQbPTV9A056`) and `mdkg-docs`
  (`prj_3Aoh90VnkqNmqM6AnX9t72fSULEd`) under
  `team_RkZhrKQs9wWs6PAdTcrwZ87z`.
- If deployment requires push or Vercel mutation, the user explicitly approves
  that side effect in the execution turn.
- Production deployments for `mdkg.dev` and `docs.mdkg.dev` are `READY`, target
  `production`, and correspond to the approved commit.
- Domain checks prove custom domains serve the expected current production
  artifacts after deploy.
- Vercel build logs contain no release-blocking errors.
- The project-level `live: false` observation from read-only grounding is
  treated as a verification blocker until production domain/currentness proof
  resolves it.

# Files Affected

- Vercel deployment state after explicit approval
- mdkg deployment evidence/checkpoint

# Implementation Notes

- Use Vercel plugin project/deployment/log tools for inspection and deployment
  only when approved.
- Do not change DNS, analytics, or unrelated provider settings.
- If auto-deploy on push is used, verify the resulting Vercel deployment rather
  than assuming push implies production currentness.

# Test Plan

- Vercel `get_project` for `mdkg-dev` and `mdkg-docs`
- Vercel deployment inspection for production deployments
- Vercel build log inspection
- custom-domain HTTP/HTML checks for `mdkg.dev` and `docs.mdkg.dev`
- `test-319`

# Links / Artifacts

- `task-615`
- `test-318`
- `task-617`
