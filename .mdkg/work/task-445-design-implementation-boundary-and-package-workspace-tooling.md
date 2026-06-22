---
tags: [mdkg-dev, boundary, tooling]
owners: []
links: []
artifacts: []
relates: [spike-14, task-446, task-447, task-448]
blocked_by: [spike-14]
blocks: [task-446, task-447, task-448]
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
context_refs: [prd-4, prd-5, edd-24, edd-25, dec-30]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
id: task-445
type: task
title: design implementation boundary and package workspace tooling
status: todo
priority: 1
parent: goal-25
epic: epic-122
---
# Overview

Design the practical execution boundary for adding `/mdkg-dev`, `/docs`, and `/examples` without destabilizing the CLI package, npm publishing, or existing docs.

# Acceptance Criteria

- Executed only after goal-25 is explicitly activated.
- Package manager, workspace/package isolation, root script integration, and dependency boundaries are decided before scaffolding.
- Existing `/docs` files are inventoried with a preservation, migration, or archive plan.
- npm package inclusion/exclusion policy is decided so site/docs/example sources do not accidentally ship in the CLI package unless intentionally added.
- Exact GitHub URL, npm URL, and verified install commands are recorded for downstream content.
- No public publish, deploy, push, tag, DNS change, analytics activation, GitBook production config, or production promotion occurs.

# Files Affected

- `.mdkg` evidence during planning.
- Future implementation paths only after activation: package metadata/scripts, `/mdkg-dev`, `/docs`, `/examples`, and docs/readiness assertions.

# Implementation Notes

- Use canonical PRD/EDD/DEC records as source planning.
- Re-check official docs and current package metadata before locking install/deploy/docs assumptions.
- Record a checkpoint titled "mdkg.dev boundary and tooling decision accepted" before closing.

# Test Plan

- `git status --short --branch`
- `node dist/cli.js validate --json`
- Verify package metadata, current docs inventory, and install command truth.
- Record checkpoint evidence with decisions, risks, and exact next task boundaries.

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- parent: goal-25
- epic: epic-122
- context: prd-4
- context: prd-5
- context: edd-24
- context: edd-25
- context: mdkg.dev visual design system contract
- context: mdkg.dev claims SEO and measurement contract
- context: mdkg.dev quality gate contract
- context: dec-30
- context: GitBook repo-first ownership policy
- context: Vercel readiness and no-production-launch boundary
