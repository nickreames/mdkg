---
id: task-795
type: task
title: Push version-driven docs implementation and verify exact-SHA Vercel deployments
status: done
priority: 1
parent: goal-73
prev: test-456
next: task-796
tags: [goal-73, push, vercel, production, exact-sha]
owners: []
links: []
artifacts: []
relates: [test-456, task-796, test-457]
blocked_by: [test-456]
blocks: [task-796]
refs: [goal-73, dec-84, edd-78]
context_refs: [goal-67, edd-46]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-07-16
updated: 2026-07-16
---
# Overview

Publish the locally verified implementation history to `origin/main` without
force and prove the automatic Vercel production deployments correspond to that
exact Git SHA.

# Acceptance Criteria

- Fetch origin immediately before commit/push; require zero behind count and no
  unrelated changes.
- Create logical commit `docs: make current release supplement version driven`.
- Non-force push `main` without another approval prompt; this push and its
  automatic production deployments are pre-approved by the operator.
- Through the Vercel connector, require exact-SHA production `READY`
  deployments and clean build logs for team
  `team_RkZhrKQs9wWs6PAdTcrwZ87z`, docs project
  `prj_3Aoh90VnkqNmqM6AnX9t72fSULEd`, and mdkg-dev project
  `prj_R9FJkRf2FsmcM9cuIyQbPTV9A056`.
- Do not accept a merely recent deployment or use a manual Vercel deploy.
- If remote drift appears, stop before push; if deployment fails after push,
  inspect logs and fix forward without rewriting history.

# Files Affected

- Git `origin/main` and automatic Vercel production deployments; no provider
  configuration, domains, or DNS.

# Implementation Notes

- Capture implementation SHA, deployment IDs/URLs, target, readiness, project,
  branch, and deployment Git SHA.
- Verify basic mdkg.dev deployment health because the monorepo push deploys both
  projects even though no mdkg-dev source change is intended.

# Test Plan

Vercel exact-SHA readiness and logs gate `task-796`; the combined production
contract closes in `test-457`.

# Results / Evidence

- Refreshed `origin/main` immediately before commit: behind/ahead was `0/1`,
  and the intentional diff contained only goal-73 graph state plus the planned
  docs/release projection implementation.
- Created implementation commit
  `27005ece67a27bb9fcfb1a2b1ada45dc054ddddd` (`docs: make current release
  supplement version driven`) and pushed `main` non-force. Local and origin
  `main` were synchronized after the push.
- `mdkg-docs` production deployment
  `dpl_HV13PifDwM6heBwuwC7krCs4TFJt` is `READY`, targets `main`, aliases
  `docs.mdkg.dev`, and reports the exact implementation SHA.
- `mdkg-dev` production deployment
  `dpl_LdQHRUtgyJssUxooLMLEvmRe875y` is `READY`, targets `main`, aliases
  `mdkg.dev`, and reports the exact implementation SHA.
- Both Vercel build logs completed successfully with no build failure; no
  manual deployment, provider configuration, domain, or DNS mutation occurred.

# Links / Artifacts

- `test-456`
- `task-796`
- `test-457`
