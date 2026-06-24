---
id: epic-149
type: epic
title: trust claims SEO and safety boundaries
status: done
priority: 1
tags: [mdkg-dev, trust, claims, seo, safety]
owners: []
links: []
artifacts: []
relates: [task-492, task-494, test-230, test-232]
blocked_by: [task-491]
blocks: [task-492, task-494, test-230, test-232]
refs: [archive://archive.mdkg-dev-feedback-user-stories-2026-06-23]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Goal

Make claims, trust, no-secret, metadata, sitemap, robots, and preview-indexing behavior launch-safe.

# Scope

Claims matrix, trust posture, no-secret caveats, SEO metadata, link checks, sitemap/robots, canonical/noindex policy.

# Milestones

# Out of Scope

# Risks

# Links / Artifacts

- `task-492`
- `task-494`
- `test-230`
- `test-232`
- `mdkg-dev/CLAIMS.md`
- `chk-214`

# Closeout Evidence

Completed as part of `goal-30`.

- Claims evidence, trust boundaries, no-secret posture, metadata, sitemap, robots, canonical URLs, and preview noindex behavior were implemented or validated.
- `test-230` and `test-232` are done and cover claims/trust/no-secret wording plus SEO, metadata, links, sitemap, robots, and preview indexing behavior.
- Hosted route validation passed on both Vercel previews.
