---
id: epic-72
type: epic
title: mdkg dev readiness and launch gate
status: done
priority: 2
tags: [mdkg-dev, docs, seo, 0-4-0]
owners: []
links: []
artifacts: [edd-23]
relates: [goal-13]
blocked_by: []
blocks: [task-330]
refs: []
aliases: []
skills: []
created: 2026-06-09
updated: 2026-06-09
---
# Goal

Launch `mdkg.dev` only after the CLI hardening and generated documentation
contract are ready.

# Scope

- Define outcome-focused guides and SEO/info architecture.
- Use generated command reference output rather than hand-maintained command
  docs.
- Gate launch on status/doctor, fix planning, subgraph safety, branch repair,
  and docs-generation readiness.

# Milestones

- `0.4.0`: public docs and marketing launch gate.

# Out of Scope

- Starting mdkg.dev command docs before generated command contract output.

# Risks

- Marketing claims outrunning the production safety posture.

# Links / Artifacts

- `edd-23`
- `task-330`
- `epic-73`
- `test-131`

# Closeout

Completed the mdkg.dev readiness and launch-gate planning slice. `edd-23`
defines the public docs information architecture, generated command-reference
source, SEO claim boundaries, required launch checks, and explicit deferred
surfaces. No public website or deployment was implemented.
