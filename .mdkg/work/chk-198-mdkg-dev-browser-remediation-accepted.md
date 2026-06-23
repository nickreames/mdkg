---
id: chk-198
type: checkpoint
title: mdkg-dev Browser remediation accepted
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-460, task-458, task-459]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: [chk-196, chk-197]
aliases: []
skills: []
scope: [task-460]
created: 2026-06-22
updated: 2026-06-22
---
# Summary

Browser-discovered local mdkg-dev defects were fixed and re-tested. Secondary pages now expose real `h1` headings, local site navigation uses canonical trailing-slash hrefs, public LLM/docs safety wording avoids noisy raw-marker phrases, and screenshot evidence uses viewport captures after the Browser full-page capture path produced a stitching artifact.

# Scope Covered

`task-460` covered remediation after Browser E2E and route/metadata validation.

## Changed Surfaces

- `mdkg-dev/src/components/SectionHeader.astro`
- `mdkg-dev/src/pages/quickstart.astro`
- `mdkg-dev/src/pages/trust.astro`
- `mdkg-dev/src/pages/alpha.astro`
- `mdkg-dev/src/pages/docs.astro`
- `mdkg-dev/src/components/NavBar.astro`
- `mdkg-dev/src/components/CTAGroup.astro`
- `mdkg-dev/src/components/Footer.astro`
- `mdkg-dev/src/pages/llms-full.txt.ts`
- `docs/guides/agent-workflow.md`
- `.mdkg/work/chk-198-*`

## Boundaries

- in scope: local mdkg-dev/docs text fixes caused by Browser/receipt evidence.
- out of scope: redesign, public deploy, DNS, Vercel production promotion, GitBook production sync, publish, tag, push, global install, and external child-repo mutation.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded: yes.

# Decisions Captured

- edd-28
- edd-29
- edd-30

# Implementation Summary

The shared `SectionHeader` component now accepts `level="h1" | "h2"` and renders `h1` for secondary page primary headings. Navigation/footer/CTA hrefs now match canonical slash routes. Public warning copy now says `unredacted prompt text` instead of `raw prompts`, preserving the safety meaning while avoiding evidence-scan ambiguity.

# Implementation Details

- Code or graph surfaces changed: mdkg-dev components/pages, one docs guide, and remediation checkpoint evidence.
- Architecture or data-shape notes: no new routes, no new package dependencies, and no runtime behavior outside static site output.
- Compatibility notes: `SectionHeader` defaults to `h2`, so existing section usages keep their prior semantics unless `level="h1"` is provided.

# Verification / Testing

## Command Evidence

- command: `npm --prefix mdkg-dev run build`
  result: pass after remediation.
- command: Browser HTML E2E receipt rerun
  result: `ok: true`, failure_count 0.
- command: local HTTP text/XML asset verification
  result: `/llms.txt`, `/llms-full.txt`, `/robots.txt`, and `/sitemap.xml` returned 200 with no raw-marker hits.
- command: `npm run smoke:mdkg-dev-seo`
  result: pass.
- command: `npm run smoke:demo-graph`
  result: pass.

## Pass / Fail Status

- status: pass.

## Known Warnings

- warning: in-app Browser top-level `/llms.txt` navigation remains client-blocked; verified via local HTTP instead.
- warning: Browser full-page screenshot mode produced a capture artifact; viewport screenshots are used for evidence.

# Known Issues / Follow-ups

- Archive selected screenshots/receipt in task-461.
- Full release gates remain pending in task-462.

## Follow-up Refs

- task-461
- task-462
- test-210
- test-211

# Links / Artifacts

- chk-196
- chk-197
- `/private/tmp/mdkg-dev-browser-e2e.2026-06-22-goal26/browser-e2e-receipt.json`

# Raw Content Safety

- Evidence is summarized from bounded command receipts and local screenshot references. No raw secrets, raw prompt text, provider payloads, credentials, tokens, private Browser data, or bulky execution traces were stored.
