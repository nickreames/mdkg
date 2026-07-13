---
id: chk-516
type: checkpoint
title: v0.5.0 website activation CI and production deployments verified
checkpoint_kind: implementation
status: done
priority: 9
tags: [release, ci, deploy, v0.5.0]
owners: []
links: [https://github.com/nickreames/mdkg/actions/runs/29258600632, https://mdkg-e5vfzdroq-nicholas-reames-projects.vercel.app, https://mdkg-docs-9z9r09omb-nicholas-reames-projects.vercel.app]
artifacts: [artifact://github-actions/run/29258600632, artifact://vercel/deployment/5426067587, artifact://vercel/deployment/5426071286]
relates: [goal-64, task-722, task-723, test-393]
blocked_by: []
blocks: []
refs: [dec-69, dec-81, chk-513, chk-514, chk-515]
context_refs: [goal-64, task-722, test-393]
evidence_refs: [chk-513, chk-514, chk-515]
aliases: []
skills: []
scope: [task-722]
created: 2026-07-13
updated: 2026-07-13
---
# Summary

The published release-state repair commit
`b265da717ee5365bd83362db6b83150cb603da5c` reached `origin/main`, passed the
complete release CI workflow, and deployed successfully to both production
Vercel projects. The two-phase activation lane is complete and Goal 64 can
continue directly to the live browser audit in `task-723`.

# Scope Covered

- Activation commit: `b337ff8d69664908ddf0690a7878cba0ec145a6d`.
- Final repair and deployment commit:
  `b265da717ee5365bd83362db6b83150cb603da5c`.
- Completed nodes: `task-722` and `test-393`.

## Changed Surfaces

- GitHub Actions release CI and both Vercel production projects.
- Shared release manifest remains `published`; npm package bytes are unchanged.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: npm republish, Git tag, another security scan, or unrelated work
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- `dec-69` requires fix-forward handling and no Git tag by default.
- `dec-81` and `chk-512` remain the accepted v0.5.0 security gate; no new scan
  is required.
- Existing bounded release approval remains sufficient for this completed lane.

# Implementation Summary

- Corrected the stale draft-state test contract to assert the canonical
  published release state while preserving separate draft-preview coverage.
- Pushed the exact repair SHA and verified production deployments resolve that
  same SHA.

# Verification / Testing

## Command Evidence

- `npm run test:public-release`: 13/13 passed.
- `npm run ci:release`: passed, including 635/635 package tests, CLI/docs
  contracts, seven seeded-loop SQLite smoke cases, and the exact 51-row security
  remediation verifier.
- GitHub Actions run `29258600632`: Node 24.x and Node 24.15.0 jobs passed.
- Vercel deployment `5426067587`: mdkg.dev project passed at the repair SHA.
- Vercel deployment `5426071286`: docs.mdkg.dev project passed at the repair
  SHA.

## Pass / Fail Status

- status: done

## Known Warnings

- GitHub reported nonblocking action-runtime deprecation notices for
  `actions/checkout@v4` and `actions/setup-node@v4`; this does not block v0.5.0.

# Known Issues / Follow-ups

- `task-723` remains: perform the live desktop/mobile audit and record the final
  release receipt.
- Do not repeat npm publication, global installation, security scanning, or
  release approval in the follow-up pass.

## Follow-up Refs

- `task-723`
- `test-394`

# Links / Artifacts

- `artifact://github-actions/run/29258600632`
- `artifact://vercel/deployment/5426067587`
- `artifact://vercel/deployment/5426071286`

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
