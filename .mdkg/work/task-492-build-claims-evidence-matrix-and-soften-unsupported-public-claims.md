---
id: task-492
type: task
title: build claims evidence matrix and soften unsupported public claims
status: done
priority: 1
tags: [mdkg-dev, claims, trust, no-secret]
owners: []
links: []
artifacts: []
relates: [test-230]
blocked_by: [task-491]
blocks: [task-493]
refs: [archive://archive.mdkg-dev-feedback-user-stories-2026-06-23]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Create a real claims evidence matrix and ensure public copy does not overclaim deferred or unsafe capabilities.

# Acceptance Criteria

- Claims matrix includes page, claim, evidence source, shipped status, caveat/safe wording, and owner/status.
- Homepage and trust claims map to evidence or are softened.
- Copy blocks claims about hosted execution, hosted memory, hosted queues, arbitrary SQL, comprehensive secret scanning, production readiness, and universal agent compatibility unless verified.
- Safety copy warns against raw secrets, prompts, provider payloads, tokens, private keys, and sensitive data in graph nodes.

# Test Plan

- `npm run smoke:mdkg-dev-seo`
- No-secret scan in the relevant smoke.
- `test-230`

# Files Affected

- `mdkg-dev/CLAIMS.md`
- `docs/src/content/docs/project/claims-evidence-matrix.md`
- `docs/project/claims-evidence-matrix.md`
- `scripts/smoke-mdkg-dev-seo.js`

# Implementation Notes

- Expanded the claims evidence matrix with `Owner` and `Review status` columns.
- Marked public-alpha claims as approved, preview-only, or blocked from public claim.
- Added an explicit blocked-claim section for hosted memory, hosted queues, arbitrary SQL, autonomous worker execution, broad MCP mutation parity, universal agent compatibility, production readiness for every team, and comprehensive secret scanning / DLP.
- Updated Starlight and top-level claims docs to state the required matrix fields and unsupported claim boundaries.
- Hardened `smoke:mdkg-dev-seo` so it asserts owner/status fields, blocked-claim language, and absence of selected unsafe promotional phrases in generated public pages.

# Links / Artifacts

- `npm run smoke:mdkg-dev-seo` passed.
- `npm run smoke:mdkg-dev-docs` passed.
- Targeted unsupported-claim scan found only blocked/safety wording in claims/docs contexts, not unsupported homepage or LLM promotional copy.
- `git diff --check` passed.
