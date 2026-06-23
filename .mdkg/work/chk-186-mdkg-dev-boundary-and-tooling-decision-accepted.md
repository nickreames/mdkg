---
id: chk-186
type: checkpoint
title: mdkg.dev boundary and tooling decision accepted
checkpoint_kind: implementation
status: backlog
priority: 9
tags: [mdkg-dev, boundary, tooling, goal-25]
owners: []
links: [https://docs.astro.build/en/guides/on-demand-rendering/, https://docs.astro.build/en/guides/framework-components/, https://docs.astro.build/en/guides/deploy/vercel/, https://gitbook.com/docs/getting-started/git-sync, https://gitbook.com/docs/publishing-documentation/llm-ready-docs, https://web.dev/articles/vitals]
artifacts: []
relates: [task-445]
blocked_by: []
blocks: []
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
context_refs: [goal-25, spike-14, task-445, prd-4, prd-5, edd-24, edd-25, dec-30]
evidence_refs: []
aliases: []
skills: []
scope: [task-445]
created: 2026-06-22
updated: 2026-06-22
---
# Summary

Goal-25's first implementation boundary is accepted. The project will use the split in-repo layout from dec-30 with an isolated `/mdkg-dev` Astro static-site package, repo-owned `/docs` GitBook source, and `/examples` demo/template graphs. The CLI npm package remains scoped to CLI distribution artifacts, and future site/docs/examples sources are excluded from `.npmignore` as an explicit package-safety policy.

This checkpoint closes the first required goal-25 checkpoint: boundary/tooling decision after `spike-14` and `task-445`.

# Scope Covered

- `spike-14`: researched launch architecture and implementation risks.
- `task-445`: decided package isolation, docs preservation, npm package exclusion, install/source truth, and future script boundaries.

## Changed Surfaces

- `.mdkg/work/spike-14-*`
- `.mdkg/work/task-445-*`
- `.mdkg/work/chk-186-*`
- `.mdkg/work/goal-25-*` selected active node changed through `mdkg goal claim`.
- `.npmignore`

## Boundaries

- in scope: local research, graph evidence, package exclusion policy, and implementation-boundary decision.
- out of scope: site scaffold, docs IA files, examples, generated docs, Vercel deployment, GitBook production config, DNS, analytics activation, npm publish, tag, push, and public launch.
- raw secrets, raw prompts, raw payloads, private graph dumps, and bulky execution traces excluded: yes.

# Decisions Captured

- `/mdkg-dev` will be a standalone Astro static-site package rather than a root npm workspace in the first pass.
- Root npm scripts will delegate into `/mdkg-dev`, `/docs`, and `/examples` only after target files exist.
- Existing `docs/agent-runtime-0.0.9-handoff.md` and `docs/mdkg-0.1.8-db-queue-upgrade-megaprompt.md` must be preserved or explicitly migrated during task-447.
- GitBook is a renderer/sync target; repo files remain canonical.
- Public docs should use `npm install -g mdkg` as the primary install command; one-off commands need smoke verification before launch copy promotes them.
- `.npmignore` now explicitly excludes future `mdkg-dev/`, `docs/`, `examples/`, and planning-doc source surfaces from the CLI package.

# Implementation Summary

The implementation path is now unambiguous: first build an isolated static site package, then add repo-first docs source, then generated command-reference artifacts, then examples/subgraphs, then launch smokes. The root CLI package remains protected by its existing `files` allowlist and the new explicit `.npmignore` exclusions.

# Implementation Details

- Code or graph surfaces changed: `.npmignore`, spike/task/checkpoint mdkg nodes.
- Architecture or data-shape notes: future site/docs/demo smokes should emit bounded route/docs/example inventories as JSON receipts.
- Compatibility notes: `npm pack --dry-run --ignore-scripts --json` confirmed the current package file list still contains only CLI distribution artifacts and root release docs; no mdkg.dev/docs/examples source is included.

# Verification / Testing

## Command Evidence

- command: `git status --short --branch`
  result: repo started clean and later showed only expected goal-25 graph/package-policy changes.
- command: `node --version`
  result: `v26.0.0`.
- command: `npm --version`
  result: `11.12.1`.
- command: `git remote -v`
  result: `origin git@github.com:nickreames/mdkg.git`.
- command: `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm view mdkg version name repository.url bin engines dist-tags --json --prefer-online`
  result: latest `0.3.7`, package `mdkg`, repo `git+ssh://git@github.com/nickreames/mdkg.git`, binary `dist/cli.js`, engine `node >=24.15.0`.
- command: `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --ignore-scripts --json`
  result: package file list did not include `.mdkg/`, `mdkg-dev/`, `docs/`, `examples/`, or `mdkg_planning_docs/`.
- command: `node dist/cli.js validate --summary --json --limit 20`
  result: graph valid; stale-cache warning appeared before index refresh and was expected after graph edits.
- command: `git diff --check`
  result: passed.

## Pass / Fail Status

- status: pass for task-445 boundary acceptance.

## Known Warnings

- warning: validation reported `cache.index` after graph edits until `mdkg index` is run; this is expected generated-cache staleness, not graph invalidity.

# Known Issues / Follow-ups

- task-446 must create the actual `/mdkg-dev` Astro package and root delegated scripts.
- task-447 must preserve or explicitly migrate existing docs before adding GitBook-ready docs source.
- task-448 must generate command reference docs from command metadata rather than duplicating the CLI matrix manually.
- task-452 must turn the future site/docs/demo quality gates into runnable smokes.

## Follow-up Refs

- task-446
- task-447
- task-448
- test-200
- test-201

# Links / Artifacts

- pack: `.mdkg/pack/pack_concise_spike-14_20260622-171439570.md`
- pack: `.mdkg/pack/pack_concise_task-445_20260622-171805826.md`
- archive: `archive://archive.mdkg-dev-planning-docs-2026-06-22`

# Raw Content Safety

- Evidence is summarized with commands, source refs, and URLs. No raw secrets, raw prompts, provider payloads, private graph dumps, or bulky execution traces were stored.
