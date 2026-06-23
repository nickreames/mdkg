---
id: chk-192
type: checkpoint
title: mdkg.dev launch smoke automation accepted
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-452]
blocked_by: []
blocks: []
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
context_refs: [goal-25, task-452, prd-5, edd-29, edd-30]
evidence_refs: []
aliases: []
skills: []
scope: [task-452]
created: 2026-06-22
updated: 2026-06-22
---
# Summary

The mdkg.dev launch-readiness smoke layer is now implemented and wired into npm scripts plus `prepublishOnly`. The smokes cover static site output, docs/generated-reference drift, SEO/metadata/LLM files, nested example graphs, private read-only subgraphs, and high-risk marker scans.

# Scope Covered

- task-452: launch-quality smoke automation.

## Changed Surfaces

- `scripts/mdkg-dev-smoke-utils.js`
- `scripts/smoke-mdkg-dev.js`
- `scripts/smoke-mdkg-dev-docs.js`
- `scripts/smoke-mdkg-dev-seo.js`
- `scripts/smoke-demo-graph.js`
- `package.json`
- `mdkg-dev/src/pages/sitemap.xml.ts`
- `mdkg-dev/src/pages/llms-full.txt.ts`
- `.mdkg/work/task-452-*`
- `.mdkg/work/chk-192-*`

## Boundaries

- in scope: deterministic local smokes, route/docs/SEO checks, generated docs drift, no-secret marker checks, demo graph checks, and prepublish script wiring.
- out of scope: live network link checking, Lighthouse/WebPageTest, Vercel preview deploy, analytics activation, production promotion, DNS, and public launch.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded: yes.

# Decisions Captured

- edd-29: public claims and SEO metadata must remain evidence-backed.
- edd-30: quality gates must check safety, accessibility/performance proxies, links, metadata, and no-secret boundaries.

# Implementation Summary

The new smokes deliberately split concerns so failures are easy to triage. `smoke:mdkg-dev` checks static build output and route inventory. `smoke:mdkg-dev-docs` checks repo-first docs and generated command reference drift. `smoke:mdkg-dev-seo` checks canonical metadata, structured data, sitemap/robots, and LLM safety text. `smoke:demo-graph` checks nested graphs plus root read-only subgraph registration.

# Test Proof

- Test target: mdkg.dev site/docs/example graph launch gates.
- Fixtures or temp repos: in-repo `/mdkg-dev`, `/docs`, and `/examples` fixtures.
- Coverage gaps: no browser rendering, live accessibility scan, Lighthouse, live link crawling, or Vercel deployment proof yet.

# Verification / Testing

## Command Evidence

- command: `npm run smoke:mdkg-dev`
  result: passed; static site build and 11 required files verified.
- command: `npm run smoke:mdkg-dev-docs`
  result: passed; 18 docs files, generated reference drift, docs links, and marker checks verified.
- command: `npm run smoke:mdkg-dev-seo`
  result: passed; canonical URLs, JSON-LD, sitemap, robots, LLM files, and social card verified.
- command: `npm run smoke:demo-graph`
  result: passed; nested examples, goal routing, pack dry-runs, subgraph verification, and qid lookup verified.
- command: `npm run docs:check`
  result: passed.
- command: `node dist/cli.js validate --summary --json --limit 20`
  result: passed with zero warnings and zero errors.
- command: `git diff --check`
  result: passed.

## Pass / Fail Status

- status: pass for task-452 launch-smoke automation.

## Known Warnings

- warning: running multiple npm scripts that invoke `npm run build` in parallel can race on shared `dist/` cleanup/copy. Run build-dependent release gates sequentially.
- warning: `smoke:demo-graph` tolerates the known nested `goal next` checkpoint-scope warning only when it exactly matches `scope contains non-actionable or unsupported node: root:chk-1`.

# Known Issues / Follow-ups

- task-453 must update README/AGENT_START/CLI matrix links and publish-readiness assertions.
- Browser/visual accessibility checks remain launch-readiness follow-up work unless a later task adds Playwright or Lighthouse.

## Follow-up Refs

- task-453
- task-454
- test-205

# Links / Artifacts

- scripts/smoke-mdkg-dev.js
- scripts/smoke-mdkg-dev-docs.js
- scripts/smoke-mdkg-dev-seo.js
- scripts/smoke-demo-graph.js

# Raw Content Safety

- Evidence is summarized with command receipts and artifact paths. No raw secrets, raw prompts, provider payloads, private graph dumps, local absolute paths, or bulky execution traces were stored.
