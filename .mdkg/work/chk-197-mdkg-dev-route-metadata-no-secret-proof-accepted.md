---
id: chk-197
type: checkpoint
title: mdkg-dev route metadata no-secret proof accepted
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [/private/tmp/mdkg-dev-browser-e2e.2026-06-22-goal26/browser-e2e-receipt.json]
relates: [task-459, test-209, test-210]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: [chk-196]
aliases: []
skills: []
scope: [task-459]
created: 2026-06-22
updated: 2026-06-22
---
# Summary

Route, metadata, LLM docs, no-secret posture, sitemap/robots, and demo graph discoverability were verified for the local mdkg-dev workspace. The combined Browser/local-HTTP receipt reports `ok: true`, zero failures, canonical metadata on every HTML route, no horizontal document overflow, no raw marker hits, valid homepage JSON-LD, and healthy text/XML assets.

# Scope Covered

`task-459`, `test-209`, and `test-210` covered route/metadata/no-secret and demo-subgraph proof.

## Changed Surfaces

- `/private/tmp/mdkg-dev-browser-e2e.2026-06-22-goal26/browser-e2e-receipt.json`
- `.mdkg/work/chk-197-*`

## Boundaries

- in scope: local route metadata, LLM docs, sitemap/robots, sensitive-content marker checks, and demo graph smoke evidence.
- out of scope: external SEO crawler calls, public deploy, DNS, Vercel production promotion, GitBook production sync, publish, tag, push, global install, and external child-repo mutation.
- sensitive private content and bulky execution traces excluded: yes.

# Decisions Captured

- edd-29: public claims, SEO metadata, and launch measurement contract.
- edd-30: quality, accessibility, performance, and no-secret gate contract.

# Implementation Summary

This phase did not add new site behavior beyond the focused Browser remediation captured in chk-196. It proved the remediated output: secondary pages now expose `h1` titles, canonical links use `https://mdkg.dev/...`, social metadata is present, LLM/robots/sitemap assets return 200 locally, and no sensitive-content marker hits remain in the checked public surfaces.

# Test Proof

- Test target: mdkg-dev local preview at `http://127.0.0.1:4321/`.
- Fixtures or temp repos: `/private/tmp/mdkg-dev-browser-e2e.2026-06-22-goal26`.
- Coverage gaps: top-level Browser navigation to `/llms.txt` is blocked by the in-app Browser client, so text/XML routes are verified by local HTTP instead of top-level Browser navigation.

# Verification / Testing

## Command Evidence

- command: Browser receipt inspection for HTML routes.
  result: `/`, `/quickstart/`, `/trust/`, `/alpha/`, and `/docs/` all have visible h1s, titles, canonicals, OG/Twitter metadata, zero sensitive-content marker hits, and no horizontal document overflow at desktop and mobile sizes.
- command: local HTTP asset checks for `/llms.txt`, `/llms-full.txt`, `/robots.txt`, and `/sitemap.xml`.
  result: all returned 200, non-empty content, and no sensitive-content marker hits; sitemap uses `https://mdkg.dev` rather than preview URLs.
- command: `npm run smoke:mdkg-dev-seo`
  result: pass.
- command: `npm run smoke:demo-graph`
  result: pass.
- command: sensitive-content marker scan over `mdkg-dev/src`, `mdkg-dev/dist`, and `docs/guides/agent-workflow.md`
  result: no matches.

## Pass / Fail Status

- status: pass.

## Known Warnings

- warning: Browser top-level `/llms.txt` navigation is client-blocked; local HTTP evidence covers text/XML route availability.

# Known Issues / Follow-ups

- Selected screenshot/receipt archive still pending in task-461.
- Full release gate chain still pending in task-462.

## Follow-up Refs

- task-461
- task-462
- test-211

# Links / Artifacts

- `/private/tmp/mdkg-dev-browser-e2e.2026-06-22-goal26/browser-e2e-receipt.json`
- chk-196

# Raw Content Safety

- Evidence is summarized from bounded receipts and route metadata. No sensitive private content, provider payloads, credentials, tokens, private Browser data, or bulky execution traces were stored.
