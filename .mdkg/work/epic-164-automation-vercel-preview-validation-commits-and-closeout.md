---
id: epic-164
type: epic
title: automation Vercel preview validation commits and closeout
status: backlog
priority: 1
tags: [mdkg-dev, vercel-preview, validation]
owners: []
links: [https://mdkg-dev.vercel.app/, https://mdkg-docs.vercel.app/]
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-23
updated: 2026-06-23
---
# Goal

Close Goal 32 with deterministic local gates, logical commits, push, Vercel redeploy proof, and no-launch evidence.

# Scope

- Add or update pass-2 smokes.
- Run local builds/tests/checks.
- Commit logically.
- Push `main` to `origin/main`.
- Verify existing Vercel previews and logs.
- Record final checkpoints.

# Milestones

- Local gates pass.
- Vercel previews redeploy from pushed commit.
- Closeout confirms no DNS, production promotion, npm publish, tag, analytics activation, or public launch.

# Out of Scope

- Creating new Vercel projects unless existing projects are missing and the user explicitly re-authorizes.

# Risks

- Pushing before full local QA could trigger low-quality previews.

# Links / Artifacts

- `task-516`
- `task-517`
- `task-518`
