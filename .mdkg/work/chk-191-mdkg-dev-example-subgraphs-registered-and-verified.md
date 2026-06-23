---
id: chk-191
type: checkpoint
title: mdkg.dev example subgraphs registered and verified
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-451]
blocked_by: []
blocks: []
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
context_refs: [goal-25, task-451, task-450, edd-24, edd-26, dec-29, dec-30]
evidence_refs: []
aliases: []
skills: []
scope: [task-451]
created: 2026-06-22
updated: 2026-06-22
---
# Summary

The two mdkg.dev example graphs are registered as private, read-only root subgraphs backed by explicit root-owned bundle snapshots. Root-qualified qids resolve for both example goals, and `subgraph verify --all` reports both bundles healthy. The root config intentionally uses a 30-day freshness threshold for these in-repo demo bundles because they are static launch examples, not clean external child Git repos.

# Scope Covered

- task-451: register and validate example subgraphs from the root graph.

## Changed Surfaces

- `.mdkg/config.json`
- `.mdkg/bundles/private/examples/demo-agentic-coding.mdkg.zip`
- `.mdkg/bundles/private/examples/template-mdkg-dev.mdkg.zip`
- `.mdkg/work/task-451-*`
- `.mdkg/work/chk-191-*`

## Boundaries

- in scope: private bundle creation, subgraph registration, root-qualified read-only lookup, and verification.
- out of scope: subgraph sync from child Git repos, `--allow-dirty`, materialization, mutation against subgraph qids, Vercel deploy, production promotion, DNS, and external repo updates.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded: yes.

# Decisions Captured

- dec-29: subgraph operations are read-only and repo-owned by default.
- dec-30: mdkg.dev source ownership uses split `/mdkg-dev`, `/docs`, and `/examples` layout.
- edd-26: demo/template graphs remain separate from canonical mdkg.dev SEO and production launch.

# Implementation Summary

The examples are in-repo directories rather than separate child Git repos, so the safe registration path is explicit bundle snapshots, not `subgraph sync`. The root graph now has aliases `demo_agentic_coding` and `template_mdkg_dev`, both private and read-only, with bundle paths under `.mdkg/bundles/private/examples/`. Each subgraph config sets `max_stale_seconds: 2592000` so local launch-readiness checks do not report false stale warnings while still preserving explicit bundle hash verification.

# Implementation Details

- Code or graph surfaces changed: root mdkg config, bundle zip snapshots, root task/checkpoint evidence.
- Architecture or data-shape notes: root-qualified qids such as `demo_agentic_coding:goal-1` and `template_mdkg_dev:goal-1` disambiguate identical nested IDs.
- Compatibility notes: direct `bundle verify` from the parent root is not the correct freshness check for child-root-relative bundles; `subgraph verify --all` is the root-facing verification path.

# Verification / Testing

## Command Evidence

- command: `node dist/cli.js --root examples/demo-agentic-coding bundle create --profile private --output /Users/nick/omni-chat-rooms/projects/mdkg/.mdkg/bundles/private/examples/demo-agentic-coding.mdkg.zip --json`
  result: created private bundle with hash `sha256:995ba2745b7d5570ab00e5a8542a89bd1092a864743b831714be556499750339`.
- command: `node dist/cli.js --root examples/template-mdkg-dev bundle create --profile private --output /Users/nick/omni-chat-rooms/projects/mdkg/.mdkg/bundles/private/examples/template-mdkg-dev.mdkg.zip --json`
  result: created private bundle with hash `sha256:b53da6ccba6ab7e04850df84791a50a5c55ffe0ac3095baf53480f7d7c8d6ad3`.
- command: `node dist/cli.js subgraph add demo_agentic_coding .mdkg/bundles/private/examples/demo-agentic-coding.mdkg.zip --visibility private --profile private --json`
  result: passed with warning_count 0 and error_count 0.
- command: `node dist/cli.js subgraph add template_mdkg_dev .mdkg/bundles/private/examples/template-mdkg-dev.mdkg.zip --visibility private --profile private --json`
  result: passed with warning_count 0 and error_count 0.
- command: `node dist/cli.js subgraph verify --all --json`
  result: passed with `ok: true`, `count: 2`, and both subgraphs warning/error free.
- command: `node dist/cli.js show demo_agentic_coding:goal-1 --json`
  result: resolved the imported read-only demo goal.
- command: `node dist/cli.js show template_mdkg_dev:goal-1 --json`
  result: resolved the imported read-only template goal.
- command: `node dist/cli.js search "candidate website" --json`
  result: returned `template_mdkg_dev:goal-1` and `template_mdkg_dev:task-1`.
- command: `node dist/cli.js validate --summary --json --limit 20`
  result: passed with zero warnings and zero errors.
- command: `node dist/cli.js subgraph verify --all --json`
  result during goal-26 baseline audit: passed with `ok: true`, `count: 2`, both subgraphs `stale: false`, warning_count 0, and error_count 0.

## Pass / Fail Status

- status: pass for root subgraph registration and read-only lookup.

## Known Warnings

- none from current `subgraph verify --all --json`; both explicit example bundle snapshots are warning/error free under the documented 30-day local demo freshness policy.

# Known Issues / Follow-ups

- task-452 must add smoke automation for bundle/subgraph/example checks.
- If examples are later split into separate repos, replace explicit bundle snapshots with clean child-repo `subgraph sync` receipts.

## Follow-up Refs

- task-452
- test-204
- test-205

# Links / Artifacts

- `.mdkg/bundles/private/examples/demo-agentic-coding.mdkg.zip`
- `.mdkg/bundles/private/examples/template-mdkg-dev.mdkg.zip`
- `demo_agentic_coding:goal-1`
- `template_mdkg_dev:goal-1`

# Raw Content Safety

- Evidence is summarized with command receipts, aliases, and hashes. No raw secrets, raw prompts, provider payloads, private graph dumps, local absolute paths, or bulky execution traces were stored.
