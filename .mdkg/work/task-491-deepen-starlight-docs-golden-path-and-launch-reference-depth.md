---
id: task-491
type: task
title: deepen Starlight docs golden path and launch reference depth
status: done
priority: 1
tags: [mdkg-dev, docs, starlight, p1]
owners: []
links: []
artifacts: []
relates: [test-229]
blocked_by: [task-490]
blocks: [task-492]
refs: [archive://archive.mdkg-dev-feedback-user-stories-2026-06-23]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Deepen Starlight docs so a new user can install mdkg, run the golden path, understand key concepts, and hand work to an agent.

# Acceptance Criteria

- Install docs cover canonical npm path, Node version guidance, and package-manager caveats.
- Quickstart explains commands, expected outputs, pack/handoff flow, and required-check semantics.
- Repository layout explains what to commit and what not to commit.
- Glossary, agent-goal guide, spike guide, handoff guide, changelog summary, roadmap, troubleshooting, generated/reference docs, and project DB/queue safety copy exist or are materially improved.
- Read-only vs mutating labels are present where relevant.

# Test Plan

- `npm --prefix docs run build`
- `npm run docs:check`
- `npm run smoke:mdkg-dev-docs`
- `test-229`

# Files Affected

- `docs/astro.config.mjs`
- `docs/README.md`
- `docs/SUMMARY.md`
- `docs/src/content/docs/start-here/install.md`
- `docs/src/content/docs/start-here/quickstart.md`
- `docs/src/content/docs/start-here/troubleshooting.md`
- `docs/src/content/docs/concepts/repository-layout.md`
- `docs/src/content/docs/concepts/glossary.md`
- `docs/src/content/docs/guides/agent-workflow.md`
- `docs/src/content/docs/guides/packs-and-handoffs.md`
- `docs/src/content/docs/guides/research-spikes.md`
- `docs/src/content/docs/advanced-alpha/project-db-queues.md`
- `docs/src/content/docs/project/changelog.md`
- `docs/src/content/docs/project/roadmap.md`
- matching top-level Markdown mirrors under `docs/start-here/`, `docs/concepts/`, `docs/guides/`, `docs/advanced-alpha/`, and `docs/project/`
- `scripts/smoke-mdkg-dev-docs.js`

# Implementation Notes

- Expanded install docs with Node/npm/global install guidance, package-manager caveats, and expected first-run results.
- Deepened quickstart docs with expected command outcomes, durable placeholders, pack/handoff flow, and required-check semantics.
- Added Starlight and source-mirror pages for troubleshooting, glossary, and research spikes.
- Expanded repository layout, agent workflow, pack/handoff, queue, changelog, and roadmap docs with public-alpha boundaries.
- Added read-only vs mutating command-boundary labels where the docs ask agents to inspect or mutate graph state.
- Updated Starlight sidebar and docs smoke coverage so troubleshooting, glossary, and research spike docs are required.

# Links / Artifacts

- `npm --prefix docs run build` passed.
- `npm run docs:check` passed.
- `npm run smoke:mdkg-dev-docs` passed with 46 required docs files.
- Browser inspection passed for `/start-here/install/`, `/start-here/quickstart/`, `/start-here/troubleshooting/`, `/concepts/glossary/`, `/guides/agent-workflow/`, `/guides/research-spikes/`, and `/advanced-alpha/project-db-queues/` on `http://127.0.0.1:4323/` with no console errors, no `GitBook` text, and no raw `<id>` placeholders.
- `git diff --check` passed.
