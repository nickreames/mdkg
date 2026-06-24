---
id: task-496
type: task
title: run local Browser E2E and Product Design QA
status: done
priority: 1
tags: [mdkg-dev, browser, product-design, qa]
owners: []
links: []
artifacts: []
relates: [test-231, test-233]
blocked_by: [task-495]
blocks: [task-497]
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Run local Browser E2E and Product Design QA before committing/pushing implementation work.

# Acceptance Criteria

- Local marketing and docs previews are tested at desktop `1440x900` and mobile `390x844`.
- Browser validation covers homepage, quickstart, trust, docs bridge, docs homepage, install, quickstart docs, claims matrix, roadmap, and one mobile flow.
- Product Design review confirms visual hierarchy, first-screen clarity, mobile layout, product proof visuals, CTA clarity, and accessibility basics.
- Screenshots/receipts are safe to record and do not contain raw secrets/prompts/tokens/payloads.

# Test Plan

- Browser route checks and screenshots.
- Product Design QA notes.
- `node dist/cli.js validate --summary --json --limit 20`

# Evidence

- Browser route receipt: `/private/tmp/mdkg-goal30-task496-browser-e2e.json`.
- Screenshot evidence directory: `/private/tmp/mdkg-goal30-task496-browser-e2e/`.
- Browser E2E covered marketing homepage, quickstart, trust, docs bridge, docs home, install docs, quickstart docs, claims matrix, roadmap, and mobile homepage/quickstart/docs flow.
- Browser E2E passed at desktop `1440x900` and mobile `390x844` with no route errors, no console errors, no raw-marker findings, no horizontal page overflow, canonical URLs present, and expected text present.
- Browser E2E initially found stale docs-server content and mobile code-block overflow in the Starlight quickstart. Restarted the docs dev server, shortened/split the quickstart examples, and reran to a clean receipt.
- Product Design QA notes: first viewport clearly presents mdkg as the product; visual hierarchy is restrained and scan-friendly; terminal and graph-proof sections communicate concrete product behavior; CTAs are clear; mobile marketing navigation fits; Starlight docs remain readable after the quickstart code-block fix; visible focus styling exists in `mdkg-dev/src/styles/global.css`.
- Screenshot capture note: in-app Browser route validation was reliable, but larger screenshot captures timed out. Evidence uses one Chrome headless desktop screenshot plus in-app/Chrome mobile viewport screenshots; all targets are local loopback URLs.
- Chrome manual-review tabs were opened for `http://127.0.0.1:4324/` and `http://127.0.0.1:4323/`.
- `npm run smoke:mdkg-dev` passed.
- `npm run smoke:mdkg-dev-docs` passed.
- `npm run smoke:mdkg-dev-seo` passed.
- `npm run docs:check` passed.
- `npm --prefix mdkg-dev run build` passed.
- `npm --prefix docs run build` passed.
- `git diff --check` passed.

# Files Affected

- `mdkg-dev/src/pages/quickstart.astro`
- `mdkg-dev/src/pages/trust.astro`
- `mdkg-dev/src/pages/docs.astro`
- `docs/src/content/docs/index.md`
- `docs/src/content/docs/start-here/quickstart.md`
- `docs/src/content/docs/project/claims-evidence-matrix.md`
- `docs/src/content/docs/project/roadmap.md`
- `docs/start-here/quickstart.md`
- `docs/project/claims-evidence-matrix.md`
- `docs/project/roadmap.md`

# Implementation Notes

- Browser-discovered fixes were limited to public copy clarity and mobile docs readability. No external deploy, DNS, production promotion, npm publish, analytics activation, or git tag occurred.

# Links / Artifacts

- `/private/tmp/mdkg-goal30-task496-browser-e2e.json`
- `/private/tmp/mdkg-goal30-task496-browser-e2e/marketing-home-desktop.png`
- `/private/tmp/mdkg-goal30-task496-browser-e2e/marketing-quickstart-mobile-browser.png`
- `/private/tmp/mdkg-goal30-task496-browser-e2e/marketing-trust-mobile-browser.png`
- `/private/tmp/mdkg-goal30-task496-browser-e2e/marketing-docs-bridge-mobile-browser.png`
- `/private/tmp/mdkg-goal30-task496-browser-e2e/docs-home-mobile-browser.png`
- `/private/tmp/mdkg-goal30-task496-browser-e2e/docs-quickstart-mobile-browser.png`
