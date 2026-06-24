---
id: task-495
type: task
title: add launch polish smokes and parity checks
status: done
priority: 1
tags: [mdkg-dev, smoke-tests, parity]
owners: []
links: []
artifacts: []
relates: [test-228, test-229, test-230, test-232]
blocked_by: [task-494]
blocks: [task-496]
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Add or update deterministic smokes so future changes cannot regress feedback fixes silently.

# Acceptance Criteria

- Smokes cover product route inventory, docs route inventory, no-secret scan, metadata, links, README/docs/site parity, generated/reference docs freshness, and preview-safe content.
- Output is bounded and useful for closeout evidence.
- Existing package and mdkg checks still pass.

# Test Plan

- `npm run smoke:mdkg-dev`
- `npm run smoke:mdkg-dev-docs`
- `npm run smoke:mdkg-dev-seo`
- `npm run docs:check`
- `npm run test`

# Evidence

- Added launch parity assertions to `scripts/smoke-mdkg-dev.js` so `npm run smoke:mdkg-dev` checks README, Starlight source docs, built marketing pages, and LLM docs for shared first-run, placeholder, semantic-ref, handoff, and queue-contract language.
- Updated the Starlight and mirror handoff docs to explicitly describe handoffs as sanitized, bounded transfer summaries.
- `npm run smoke:mdkg-dev` passed after catching and fixing the missing sanitized-handoff wording.
- `npm run smoke:mdkg-dev-docs` passed with 46 required docs files.
- `npm run smoke:mdkg-dev-seo` passed with route metadata, sitemap, robots, preview-noindex source, claims, and no-secret checks.
- `npm run docs:check` passed with generated command-reference outputs current.
- `npm run test` passed: 507 tests, 0 failures.
- `node dist/cli.js index` refreshed generated graph indexes.
- `node dist/cli.js validate --summary --json --limit 20` passed with 0 warnings and 0 errors.
- `git diff --check` passed.

# Files Affected

- `scripts/smoke-mdkg-dev.js`
- `docs/src/content/docs/guides/packs-and-handoffs.md`
- `docs/guides/packs-and-handoffs.md`

# Implementation Notes

- The parity smoke intentionally samples stable public-alpha invariants rather than duplicating every page body. It should fail when README, docs, site, and LLM guidance drift on install requirements, `mdkg init --agent`, durable placeholder ids, semantic refs, handoffs, or queue adapter contract language.

# Links / Artifacts
