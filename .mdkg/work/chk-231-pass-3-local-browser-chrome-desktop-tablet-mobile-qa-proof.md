---
id: chk-231
type: checkpoint
title: pass-3 local Browser Chrome desktop tablet mobile QA proof
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [/private/tmp/mdkg-goal33-chrome-qa/chrome-qa-results.json, /private/tmp/mdkg-goal33-chrome-qa/desktop-marketing-home.png, /private/tmp/mdkg-goal33-chrome-qa/mobile-marketing-home.png, /private/tmp/mdkg-goal33-chrome-qa/desktop-docs-home.png, /private/tmp/mdkg-goal33-chrome-qa/mobile-docs-home.png]
relates: [task-530, test-256, goal-33]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-530, test-256]
created: 2026-06-24
updated: 2026-06-24
---
# Summary

Local marketing and docs previews were built and reviewed through Chrome at desktop, tablet, and mobile widths. The in-app Browser backend was attempted first but failed to attach to a page, so Chrome plus direct local HTTP endpoint checks were used as the accepted local QA evidence for this pass.

# Scope Covered

- Marketing preview: `http://127.0.0.1:4325/`.
- Docs preview: `http://127.0.0.1:4326/`.
- Chrome QA receipt: `/private/tmp/mdkg-goal33-chrome-qa/chrome-qa-results.json`.
- Screenshots captured for marketing home, marketing docs bridge, docs home, docs reference, docs agent workflow, and mobile/tablet variants.

## Changed Surfaces

- Closed `task-530` with local QA evidence.
- Covered `test-256` acceptance cases for desktop, tablet, mobile, console errors, code blocks, and raw-marker checks.

## Boundaries

- in scope: local QA only against loopback preview URLs.
- out of scope: DNS, production promotion, analytics activation, npm publish, git tag, GitHub settings mutation, and public-launch announcement.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded: yes.

# Decisions Captured

- `edd-42`: Browser Chrome and Vercel preview validation evidence contract.
- `dec-39`: Plan Work Evidence remains the single public operating model.

# Implementation Summary

No source changes were made during this checkpoint. The evidence confirms the already-implemented pass-3 marketing/docs changes render locally without page-level QA failures before final gates and hosted preview validation.

# Test Proof

- Test target: local built previews for `mdkg-dev` and `docs`.
- Chrome route checks: 54 HTML route/viewport combinations.
- Chrome route errors: 0.
- Console errors: 0 page-level errors in checked routes.
- Raw marker hits: 0 for checked HTML routes and local text/XML endpoints.
- External link rel failures: 0.
- Page horizontal overflow: 0.
- Screenshots: 9 saved under `/private/tmp/mdkg-goal33-chrome-qa/`.
- Coverage gap: the in-app Browser backend repeatedly failed to attach to a page. This is recorded as a tool limitation; Chrome plugin QA and direct local endpoint checks provided the local browser evidence.

# Verification / Testing

## Command Evidence

- command: `npm --prefix mdkg-dev run build`
- result: passed; marketing static output built.
- command: `npm --prefix docs run build`
- result: passed; Starlight static output built.
- command: local previews on `127.0.0.1:4325` and `127.0.0.1:4326`
- result: passed with escalated local loopback binding.
- command: Chrome local QA over marketing/docs HTML routes at desktop, tablet, and mobile widths
- result: passed; receipt at `/private/tmp/mdkg-goal33-chrome-qa/chrome-qa-results.json`.
- command: direct local HTTP checks for `/llms.txt`, `/llms-full.txt`, `/robots.txt`, marketing sitemap, and docs sitemap index
- result: passed; all returned 200 with expected content type and no raw-marker hits.

## Pass / Fail Status

- status: passed with one accepted tooling limitation.

## Known Warnings

- The in-app Browser plugin failed to attach to local pages after setup and visibility retry. Chrome plugin checks were completed instead.
- User-profile Chrome blocked direct navigation to `llms.txt` with `ERR_BLOCKED_BY_CLIENT`; direct local HTTP verification covered text/XML endpoints.
- Some command code blocks are horizontally scrollable inside their containers on mobile. The page itself does not overflow horizontally, so this is accepted for command readability in this pass.

# Known Issues / Follow-ups

- Re-run in-app Browser if the Browser backend becomes available later.
- Continue to improve mobile command block ergonomics in future design polish if user testing finds horizontal scrolling too cumbersome.

## Follow-up Refs

- `task-531`: final gates, logical commits, push, and hosted Vercel preview validation.
- `test-257`: pushed commits, Vercel preview validation, and no-launch-side-effects contract.

# Links / Artifacts

- `/private/tmp/mdkg-goal33-chrome-qa/chrome-qa-results.json`
- `/private/tmp/mdkg-goal33-chrome-qa/desktop-marketing-home.png`
- `/private/tmp/mdkg-goal33-chrome-qa/mobile-marketing-home.png`
- `/private/tmp/mdkg-goal33-chrome-qa/desktop-docs-home.png`
- `/private/tmp/mdkg-goal33-chrome-qa/mobile-docs-home.png`

# Raw Content Safety

- Evidence is summarized with local artifact refs. No raw secrets, raw prompts, raw provider payloads, credentials, tokens, or bulky runtime traces were stored.
