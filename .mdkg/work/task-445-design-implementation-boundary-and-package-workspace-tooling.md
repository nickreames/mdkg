---
id: task-445
type: task
title: design implementation boundary and package workspace tooling
status: done
priority: 1
epic: epic-122
parent: goal-25
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

# Boundary Decision

Accepted for goal-25 implementation:

- Use a standalone `/mdkg-dev` Astro static-site package rather than a root npm workspace in the first implementation pass.
- Keep site dependencies isolated from the CLI package; root scripts may delegate into `/mdkg-dev` only after task-446 creates the site package.
- Keep the root npm package `files` allowlist focused on CLI distribution artifacts. Future site/docs/example sources are explicitly excluded in `.npmignore` as a belt-and-suspenders policy even though `package.json.files` is already restrictive.
- Preserve existing `docs/agent-runtime-0.0.9-handoff.md` and `docs/mdkg-0.1.8-db-queue-upgrade-megaprompt.md`; task-447 may move them into a legacy/reference docs area only with an explicit migration note.
- Keep `/docs` as repo-owned GitBook source. GitBook is a renderer/sync target, not the canonical editor.
- Keep `/examples` for small deterministic demo/template graphs after their nested `.mdkg` graphs validate.
- Do not add Vercel, GitBook production, analytics, DNS, npm publish, tag, push, or public launch actions in goal-25.

# Package And URL Evidence

- Local `package.json`: `name` is `mdkg`, `version` is `0.3.7`, binary is `dist/cli.js`, engine is `node >=24.15.0`, and `files` excludes future site/docs/example source by omission.
- Registry check: `npm view mdkg version name repository.url bin engines dist-tags --json --prefer-online` returned latest `0.3.7`, package `mdkg`, repo `git+ssh://git@github.com/nickreames/mdkg.git`, binary `dist/cli.js`, and engine `node >=24.15.0`.
- Git remote: `origin git@github.com:nickreames/mdkg.git`.
- Primary install command for public docs: `npm install -g mdkg`.
- One-off commands such as `npx mdkg --help`, `pnpm dlx mdkg --help`, and `bunx mdkg --help` must be verified by a later smoke before they are promoted as launch copy.

# Docs Inventory

Current committed docs before scaffolding:

- `docs/agent-runtime-0.0.9-handoff.md`
- `docs/mdkg-0.1.8-db-queue-upgrade-megaprompt.md`

These are historical handoff/reference documents, not the future GitBook docs IA. Task-447 should add GitBook-ready source around them without deleting them.

# Future Script Boundary

Root scripts should be added only when their target files exist:

- `site:build` / `smoke:mdkg-dev` after task-446 creates `/mdkg-dev`.
- `docs:generate` / `smoke:mdkg-dev-docs` after task-447 and task-448 create docs source and generated reference artifacts.
- `smoke:mdkg-dev-seo` after task-449 adds metadata, sitemap, robots, and `llms.txt`.
- `smoke:demo-graph` after task-450 creates nested examples.

Until then, the goal-level required checks are future gates, not currently runnable scripts.

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
