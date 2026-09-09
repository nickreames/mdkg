---
id: chk-581
type: checkpoint
title: Verify identity-preserving scaffold upgrades and recovery
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [bug-28]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [bug-28]
created: 2026-09-09
updated: 2026-09-09
---
# Summary

Owner mdkg-project-agent locally verified bug-28 under the approved Goal 83/84
qualification pass. V2 scaffold upgrades preserve node identities and aliases;
dependency-bound recovery rejects drift, noncanonical path aliases and changed
workspace ownership. Three independent functional-review findings were
reproduced and corrected. Final task-828 security acceptance remains open.

# Scope Covered

- Completed node: bug-28 (Preserve adopted graph identities during scaffold upgrade)
- Node type: bug
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Completed work node: bug-28
- Attached artifacts are listed in checkpoint frontmatter and below.
- Source: upgrade.ts, upgrade_identity.ts, upgrade_transaction.ts.
- Regression: tests/commands/upgrade_identity.test.ts.
- Guidance: README.md and docs/src/content/docs/start-here/install.md.
- Exact ten-path local commit allowlist is in bug-28-verification.json.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- See decision and approval refs on the completed node and checkpoint frontmatter.

# Implementation Summary

- Completion of bug-28 was recorded through the structured task lifecycle.
- Detailed implementation or test evidence remains on the completed node and linked refs.

# Verification / Testing

## Command Evidence

- command: `mdkg task done --checkpoint`
- result: completed node and evidence checkpoint written
- npm run build and npm run build:test: passed.
- Focused upgrade families: 36 passing tests on each of Node 24.18.0 and 26.0.0.
- Installed candidate: 14 passing identity/recovery tests on each runtime;
  installed file manifest unchanged. Candidate remains development 0.5.2,
  not the final 0.6.0 seal.
- node scripts/test-built.js: 1226 passing tests, zero failures/skips on Node
  26.0.0 after build:test. No shell-glob family omissions or coverage-floor changes.
- CLI/docs parity: passed; 494 documentation examples, zero failures.
- Full/changed-only graph validation, SQLite verification and diff checks pass.

## Pass / Fail Status

- status: done

## Known Warnings

- Three pre-existing stale-subgraph warnings remain; refresh is excluded.
- Exact Node 24.15.0, independent final security review, complete installed
  qualification, release ladder and exact 0.6.0 seal remain unqualified.

# Known Issues / Follow-ups

- Continue bug-29 portable packaged reference closure, bugs 26-27 migration
  qualification and bug-7/full installed testing. Bug-17 retains its separate
  compatibility decision and partial-source custody. Goals 83/84 are incomplete;
  Goal 85 remains paused, with no publication authority.
- Selected Goal 73, runtime DB and protected Demo 3 bundle hashes are preserved.
  Existing SQLite generated custody is retained outside this local commit.
  Transient mutation locks are released; no runtime writer lease was acquired.
- No push, remote Git, tag, publication, provider, deployment, canonical
  upgrade/migration, bundle/subgraph refresh or sibling change.
- Skill candidates: none.

## Follow-up Refs

- task/test/goal refs: inspect the completed node and checkpoint frontmatter

# Links / Artifacts

- .mdkg/artifacts/goal-84/bug-24-adjacent-findings.json
- .mdkg/artifacts/goal-84/bug-28-verification.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
