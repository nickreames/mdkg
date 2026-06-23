---
id: task-453
type: task
title: update root docs and publish readiness for mdkg-dev launch surfaces
status: done
priority: 1
epic: epic-126
parent: goal-25
tags: [mdkg-dev, docs-parity, publish-readiness]
owners: []
links: []
artifacts: []
relates: [task-452, task-454]
blocked_by: [task-452]
blocks: [task-454, test-205]
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
context_refs: [prd-4, prd-5, edd-25, edd-27]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Update repo docs and readiness assertions after mdkg.dev implementation is proven.

# Acceptance Criteria

- README, mdkg.dev homepage, `/docs`, `AGENT_START.md`, `CLI_COMMAND_MATRIX.md`, and generated command docs agree on product positioning, install commands, alpha status, first-run path, and deferred capability boundaries.
- Stale version references are fixed or documented as blockers.
- `mdkg init --agent` first-run guidance is reflected in public quickstart: init, index, status, validate.
- Public docs explain skill source and mirror behavior: canonical `.mdkg/skills`, mirrors in `.agents/skills` and `.claude/skills`, future configurable destinations as deferred.
- Publish-readiness assertions include mdkg.dev/docs/examples checks only after the smokes exist.
- No public publish, deploy, push, tag, DNS change, analytics activation, or production promotion occurs.

# Files Affected

- README and repo docs selected by task-445.
- `AGENT_START.md` or init assets only if needed for parity.
- publish-readiness assertions and command docs after implementation is proven.

# Implementation Notes

- Do not weaken CLI package readiness to accommodate website work.
- Keep public copy conservative and source-backed.
- Ensure package tarball contents remain intentional.

# Implementation Summary

- Added root README guidance for `mdkg-dev/`, `docs/`, and `examples/` as repo-owned launch-readiness source assets.
- Added AGENT_START and CLI command matrix references for mdkg.dev smokes and private read-only example subgraph qids.
- Extended `scripts/assert-publish-ready.js` to require the new smoke scripts, docs/site/example source layout, bundle snapshots, `.npmignore` exclusions, and prepublish script order.
- Confirmed the new smokes and publish-readiness assertion pass after the docs changes.

# Test Plan

- `npm run cli:check`
- `npm run cli:contract`
- `npm run smoke:command-docs`
- `npm run smoke:mdkg-dev`
- `npm run smoke:mdkg-dev-docs`
- `npm run smoke:mdkg-dev-seo`
- `node scripts/assert-publish-ready.js`

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- checkpoint: chk-193
- parent: goal-25
- epic: epic-126
