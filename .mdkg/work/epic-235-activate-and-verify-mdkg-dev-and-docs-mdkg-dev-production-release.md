---
id: epic-235
type: epic
title: Activate and verify mdkg.dev and docs.mdkg.dev production release
status: todo
priority: 1
tags: [release, deploy, mdkg-dev, docs]
owners: []
links: []
artifacts: []
relates: [goal-64]
blocked_by: []
blocks: []
refs: [task-722, task-723, test-393, test-394]
context_refs: [goal-62, goal-63, goal-64, edd-72, dec-69]
evidence_refs: []
aliases: [v0-5-0-public-release-activation]
skills: []
created: 2026-07-10
updated: 2026-07-10
---
# Goal

Activate the already-verified release experience after npm proof, deploy both
public sites, validate them live, and record the final fix-forward receipt.

# Scope

- Single activation-state change and second push.
- Production deployment currentness for both sites.
- Desktop/mobile content, accessibility, SEO, metadata, links, and no-secret audit.
- Final release receipt and residual-risk/fix-forward status.

# Milestones

- `task-722` / `test-393`: two-phase activation and deployment.
- `task-723` / `test-394`: live audit and closeout.

# Out of Scope

Npm unpublish, history rewrite, automatic Git tag, DNS changes, and unrelated redesign.

# Risks

- Package success followed by site failure needs a fix-forward path.
- Cached deployments can appear current while serving stale version metadata.

# Links / Artifacts

- `edd-72`
- `dec-69`
- external links
