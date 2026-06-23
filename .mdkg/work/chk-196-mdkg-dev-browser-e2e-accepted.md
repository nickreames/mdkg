---
id: chk-196
type: checkpoint
title: mdkg-dev Browser E2E accepted
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [/private/tmp/mdkg-dev-browser-e2e.2026-06-22-goal26/browser-e2e-receipt.json, /private/tmp/mdkg-dev-browser-e2e.2026-06-22-goal26/homepage-desktop.png, /private/tmp/mdkg-dev-browser-e2e.2026-06-22-goal26/quickstart-desktop.png, /private/tmp/mdkg-dev-browser-e2e.2026-06-22-goal26/trust-desktop.png, /private/tmp/mdkg-dev-browser-e2e.2026-06-22-goal26/docs-desktop.png, /private/tmp/mdkg-dev-browser-e2e.2026-06-22-goal26/homepage-mobile.png]
relates: [task-458, test-208]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: [chk-195]
aliases: []
skills: []
scope: [task-458]
created: 2026-06-22
updated: 2026-06-22
---
# Summary

Local mdkg-dev Browser E2E passed after a focused remediation for secondary-page headings, canonical local links, and noisy raw-marker wording. HTML pages were directly navigated in the in-app Browser at desktop `1440x900` and mobile `390x844`. Text/XML assets were verified over local HTTP because the in-app Browser blocks top-level `/llms.txt`, and the Node REPL environment is sandbox-blocked from loopback HTTP.

# Scope Covered

`task-458` and `test-208` covered Browser desktop/mobile visual and navigation proof.

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
- `/private/tmp/mdkg-dev-browser-e2e.2026-06-22-goal26/*` temporary evidence files

## Boundaries

- in scope: local Browser testing, local mdkg-dev source fixes, local HTTP asset verification, screenshot/receipt capture.
- out of scope: publish, deploy, DNS, Vercel production promotion, GitBook production sync, tag, push, global install, external child-repo mutation, and external link clicking.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded: yes.

# Decisions Captured

- edd-28: mdkg.dev visual design system and component contract.
- edd-29: mdkg.dev public claims, SEO, metadata, and measurement contract.
- edd-30: mdkg.dev quality, accessibility, performance, and no-secret gate contract.

# Implementation Summary

Browser E2E found secondary pages rendering their primary page title as `h2` through the shared section header component. `SectionHeader` now supports `level="h1"` and the quickstart, trust, alpha, and docs pages use it. Internal navigation now uses canonical trailing-slash hrefs. Public LLM/docs safety wording avoids the exact noisy phrase `raw prompt` while retaining the same boundary meaning.

# Test Proof

- Test target: local Astro preview at `http://127.0.0.1:4321/`.
- Fixtures or temp repos: `/private/tmp/mdkg-dev-browser-e2e.2026-06-22-goal26`.
- Coverage gaps: Browser top-level navigation to `/llms.txt` is blocked by the client; text/XML assets were verified through local HTTP instead.

# Verification / Testing

## Command Evidence

- command: `npm --prefix mdkg-dev run build`
  result: pass.
- command: local Astro preview on `127.0.0.1:4321`
  result: running for Browser E2E.
- command: Browser HTML E2E over `/`, `/quickstart/`, `/trust/`, `/alpha/`, `/docs/` at desktop and mobile viewports.
  result: receipt `ok: true`, failure_count 0.
- command: local HTTP asset checks for `/llms.txt`, `/llms-full.txt`, `/robots.txt`, `/sitemap.xml`.
  result: all returned 200 with non-empty content and no raw-marker hits.
- command: raw-marker scan over `mdkg-dev/src`, `mdkg-dev/dist`, and `docs/guides/agent-workflow.md`.
  result: no matches for the configured raw marker terms.
- command: visual inspection of captured homepage mobile and quickstart desktop viewport screenshots.
  result: coherent first viewport, no overlap, no text overflow, and clear mdkg product signal.

## Pass / Fail Status

- status: pass.

## Known Warnings

- warning: in-app Browser blocks top-level `/llms.txt` with a client-side block; this is recorded as a Browser-runtime limitation, not a site failure. Local HTTP verified the asset.
- warning: Browser `fullPage` screenshots repeated content despite the DOM having one page tree; viewport screenshots replaced full-page captures.

# Known Issues / Follow-ups

- Archive selected screenshots/receipt in `task-461`.
- Route/metadata/no-secret proof continues in `task-459`.

## Follow-up Refs

- task-459
- task-461
- test-209
- test-210

# Links / Artifacts

- `/private/tmp/mdkg-dev-browser-e2e.2026-06-22-goal26/browser-e2e-receipt.json`
- `/private/tmp/mdkg-dev-browser-e2e.2026-06-22-goal26/homepage-desktop.png`
- `/private/tmp/mdkg-dev-browser-e2e.2026-06-22-goal26/quickstart-desktop.png`
- `/private/tmp/mdkg-dev-browser-e2e.2026-06-22-goal26/trust-desktop.png`
- `/private/tmp/mdkg-dev-browser-e2e.2026-06-22-goal26/docs-desktop.png`
- `/private/tmp/mdkg-dev-browser-e2e.2026-06-22-goal26/homepage-mobile.png`

# Raw Content Safety

- Evidence uses a bounded JSON receipt plus local screenshots. No raw secrets, raw prompt text, provider payloads, credentials, tokens, private Browser data, or bulky execution traces were stored.
