---
id: task-362
type: task
title: final mdkg.dev launch readiness e2e and no-secret audit
status: todo
priority: 2
epic: epic-80
parent: goal-15
tags: [mdkg-dev, launch-gate, e2e, no-secrets]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-355, task-356, task-357, task-358, task-359]
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Run the final mdkg.dev launch readiness E2E and no-secret audit. This is the
launch gate tying generated docs, guides, examples, trust docs, and downstream
playbooks into one reviewable release decision.

# Acceptance Criteria

- Generated command reference is current and drift checks pass.
- Public examples run in fresh temp repos.
- Security/trust docs pass a no-secret audit.
- Downstream upgrade narratives remain dry-run-first and no-cross-repo-mutation.
- The launch decision is captured as mdkg evidence before any public site
  deploy or publish action.

# Files Affected

- final mdkg.dev launch checklist/evidence nodes
- docs smoke scripts
- public docs/site artifacts once they exist

# Implementation Notes

- Treat this as a gate, not an implementation task for missing docs.
- Stop and open follow-up nodes when evidence is missing.
- Do not deploy or publish without a separate explicit request.

# Test Plan

- `npm run build`
- `npm run cli:contract`
- `npm run smoke:command-docs`
- `npm run smoke:spike`
- public example smoke coverage
- no-secret docs audit
- `node dist/cli.js validate --json`
- `git diff --check`

# Links / Artifacts

- Final gate for `goal-15`.
