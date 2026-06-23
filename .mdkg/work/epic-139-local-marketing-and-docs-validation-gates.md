---
id: epic-139
type: epic
title: local marketing and docs validation gates
status: todo
priority: 1
tags: []
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
---
# Goal

Prove the marketing site and Starlight docs are locally valid before any push or Vercel setup.

# Scope

- Update the marketing `/docs` bridge away from GitBook.
- Run marketing/docs builds, mdkg-dev smokes, docs checks, mdkg validation, and no-secret scans.

# Milestones

- `mdkg-dev` build passes.
- `docs` Starlight build passes.
- mdkg docs and site smokes pass.

# Out of Scope

- No remote push or Vercel project setup until local gates pass.

# Risks

- Sitemap/canonical metadata must not contain preview URLs.

# Links / Artifacts

- `task-475`
- `task-476`
- `test-220`
