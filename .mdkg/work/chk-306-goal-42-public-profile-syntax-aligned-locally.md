---
id: chk-306
type: checkpoint
title: goal-42 public profile syntax aligned locally
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: [0.4.0, docs, mdkg-dev, browser, chrome, command-syntax, launch-proof]
owners: []
links: []
artifacts: [/private/tmp/mdkg-goal42-profile-syntax-validation-20260627, /private/tmp/mdkg-goal42-profile-syntax-validation-20260627/browser-profile-syntax-validation.json, /private/tmp/mdkg-goal42-profile-syntax-validation-20260627/browser-docs-packs-and-handoffs.png, /private/tmp/mdkg-goal42-profile-syntax-validation-20260627/chrome-profile-syntax-validation.json, /private/tmp/mdkg-goal42-profile-syntax-validation-20260627/chrome-docs-packs-and-handoffs.png]
relates: [task-605]
blocked_by: []
blocks: []
refs: [goal-42, task-605, test-308, test-310]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
scope: [task-605, test-308, test-310, goal-42]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

Aligned current public-facing pack profile examples with the preferred CLI
syntax for `goal-42` launch surfaces.

Current mdkg.dev pages, docs.mdkg.dev source/mirror pages, public demo READMEs,
and init scaffold README examples now prefer `mdkg pack ... --profile concise`
instead of stale `--pack-profile concise` examples. Compatibility code and
historical mdkg evidence were left unchanged.

# Scope Covered

- `goal-42`
- `task-605`
- `test-308`
- `test-310`
- mdkg.dev homepage, quickstart, `llms.txt`, and `llms-full.txt`
- docs.mdkg.dev quickstart, packs/handoffs, CLI reference, and demo graph pages
- public demo example READMEs
- init scaffold README pack-profile guidance
- smoke checks that enforce the current public syntax

## Changed Surfaces

- `mdkg-dev/src/pages/index.astro`
- `mdkg-dev/src/pages/quickstart.astro`
- `mdkg-dev/src/pages/llms.txt.ts`
- `mdkg-dev/src/pages/llms-full.txt.ts`
- `docs/src/content/docs/start-here/quickstart.md`
- `docs/src/content/docs/guides/packs-and-handoffs.md`
- `docs/src/content/docs/reference/index.md`
- `docs/src/content/docs/advanced-alpha/demo-graphs.md`
- legacy docs mirror files under `docs/start-here`, `docs/guides`, and
  `docs/advanced-alpha`
- `examples/demo-agentic-coding/README.md`
- `examples/template-mdkg-dev/README.md`
- `assets/init/README.md`
- `scripts/smoke-demo-graph.js`
- `scripts/smoke-mdkg-dev-polish-pass4.js`
- `scripts/smoke-mdkg-dev-polish-pass5.js`
- local-only validation artifacts under
  `/private/tmp/mdkg-goal42-profile-syntax-validation-20260627`

## Boundaries

- in scope: local source/docs/example copy, smoke assertions, local builds,
  local Browser/Chrome validation, and summarized mdkg evidence.
- out of scope: live production validation, git push, deploy, DNS, analytics,
  npm publish, git tag, and `0.4.0` package version bump.
- raw secrets, raw prompts, raw payloads, provider UI, npm auth state, and
  bulky execution traces excluded; only command outcomes and local artifact
  paths are recorded.

# Decisions Captured

- Use `--profile concise` as the preferred public command syntax for current
  docs and examples.
- Keep `--pack-profile` compatibility support and historical evidence untouched.
- Browser/Chrome text-route blocks on local `/llms.txt` are not treated as
  content failures because built-file checks and smoke tests verify those
  routes directly.

# Implementation Summary

- Replaced stale `--pack-profile concise` examples on current mdkg.dev pages,
  public docs pages, demo README files, and init scaffold README with
  `--profile concise`.
- Updated smoke tests so pass-5 now rejects stale `--pack-profile concise` in
  hand-authored public examples and demo graph smoke exercises the current
  `--profile concise` syntax.
- Verified generated static output no longer contains `--pack-profile concise`
  in the target public routes.

# Test Proof

- Test target: local built mdkg.dev output at `http://127.0.0.1:4182/` and
  local built docs output at `http://127.0.0.1:4183/`.
- Artifact folder:
  `/private/tmp/mdkg-goal42-profile-syntax-validation-20260627`
- Browser receipt:
  `/private/tmp/mdkg-goal42-profile-syntax-validation-20260627/browser-profile-syntax-validation.json`
- Chrome receipt:
  `/private/tmp/mdkg-goal42-profile-syntax-validation-20260627/chrome-profile-syntax-validation.json`
- Screenshots reviewed:
  `/private/tmp/mdkg-goal42-profile-syntax-validation-20260627/browser-docs-packs-and-handoffs.png`,
  `/private/tmp/mdkg-goal42-profile-syntax-validation-20260627/chrome-docs-packs-and-handoffs.png`,
  `/private/tmp/mdkg-goal42-profile-syntax-validation-20260627/chrome-mdkg-dev-quickstart.png`
- Coverage gaps: live production validation remains open until explicit
  push/deploy approval; Browser and Chrome both blocked local plain-text
  `/llms.txt` route navigation with `ERR_BLOCKED_BY_CLIENT`, so text routes were
  verified through built-file checks and mdkg-dev smoke tests instead.

# Verification / Testing

## Command Evidence

- `npm run smoke:mdkg-dev`: passed.
- `npm run smoke:mdkg-dev-docs`: passed.
- `npm run smoke:mdkg-dev-polish-pass4`: passed.
- `npm run smoke:mdkg-dev-polish-pass5`: passed.
- `npm run smoke:demo-graph`: passed.
- `npm run docs:check`: passed with 401 checked examples and 0 failures.
- `npm --prefix mdkg-dev run build`: passed.
- `npm --prefix docs run build`: passed with the known non-fatal
  `Entry docs -> 404 was not found` Starlight warning.
- `npm run smoke:mdkg-dev-seo`: passed.
- `node scripts/assert-publish-ready.js`: passed.
- Source/public scan over current public surfaces found no remaining
  `--pack-profile concise` examples except the smoke assertion that forbids it.
- Built-file check over `mdkg-dev/dist` and `docs/dist` target routes confirmed
  `--profile concise` is present and `--pack-profile concise` is absent.
- Browser local HTML validation: passed for home, quickstart, docs quickstart,
  docs packs/handoffs, docs demo graphs, and docs reference; zero console
  issues.
- Chrome local HTML validation: passed for the same HTML routes; zero console
  issues.

## Pass / Fail Status

- status: local public command-syntax alignment passed; live post-deploy proof
  remains incomplete by boundary.

## Known Warnings

- docs build emitted the existing non-fatal `Entry docs -> 404 was not found`
  warning.
- local Browser and Chrome blocked `/llms.txt` route navigation with
  `ERR_BLOCKED_BY_CLIENT`; built files and smoke tests prove the text content.

# Known Issues / Follow-ups

- Keep `task-605` open for approved production deploy and live Browser/Chrome
  validation.
- Do not claim `0.4.0` publish readiness until the package version is actually
  bumped and publish dry-run gates run for `0.4.0`.

## Follow-up Refs

- `task-605`
- `test-308`
- `task-606`
- `test-312`

# Links / Artifacts

- `/private/tmp/mdkg-goal42-profile-syntax-validation-20260627/browser-profile-syntax-validation.json`
- `/private/tmp/mdkg-goal42-profile-syntax-validation-20260627/chrome-profile-syntax-validation.json`
- `/private/tmp/mdkg-goal42-profile-syntax-validation-20260627/browser-docs-packs-and-handoffs.png`
- `/private/tmp/mdkg-goal42-profile-syntax-validation-20260627/chrome-docs-packs-and-handoffs.png`

# Raw Content Safety

- Evidence is summarized with command outcomes and local artifact paths only.
  Screenshots and JSON receipts are local-only under `/private/tmp`.
