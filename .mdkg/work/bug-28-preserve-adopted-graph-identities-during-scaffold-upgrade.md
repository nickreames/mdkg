---
id: bug-28
type: bug
title: Preserve adopted graph identities during scaffold upgrade
status: done
priority: 1
tags: [release-0.6.0, behavioral-audit]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-24-adjacent-findings.json, .mdkg/artifacts/goal-84/bug-28-verification.json]
relates: [goal-84, goal-83, bug-24, test-483]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-09-09
updated: 2026-09-09
---
# Overview

An installed scaffold upgrade reports safe_to_apply and restores a legacy core
node into an adopted v2 graph without graph_id/node_id. A valid graph becomes
invalid. Functional severity: medium; publication blocker under goal-84.

# Reproduction Steps

1. Initialize a synthetic graph with the installed candidate, close its seed
   references, and apply a reviewed identity migration.
2. Remove HUMAN.md and its incoming relation/pin. Validation succeeds.
3. Preview upgrade with only .mdkg/core/HUMAN.md: safe_to_apply=true.
4. Apply the exact plan hash. Validation exits 2 for missing node identity.

# Expected vs Actual

- Expected: scaffold upgrade preserves immutable identities and refuses any
  restoration requiring reviewed identity/reintroduction evidence before writes.
- Actual: an accepted upgrade can invalidate the graph.

# Suspected Cause

src/commands/upgrade.ts plans seed creation without node-format/identity checks;
the transaction's shared lock checks graph version, not candidate node identity.

# Fix Plan

Owner mdkg-project-agent, approved bounded goal-84 remediation. Audit preview,
apply and recovery against graph format and exact before/after identities. Bind
format and dependency inputs to plan freshness. Preserve safe non-node upgrades,
customizations, supported legacy behavior and exact recovery; do not invent
identity from aliases or silently stage Git changes.

Allowed: src/commands/upgrade.ts, directly required bootstrap/transaction/identity
helpers, regressions and owned evidence. All goal-84 exclusions apply: no
canonical migration/upgrade, bundle refresh, remote Git, publication, provider,
root/sibling writes, history rewriting or new product scope. Stop on collision
or material new decisions. Local reviewed commits only after validation.

Affected version: reproduced unpublished v2 candidate; published 0.5.2 does not
claim v2 support. Assess legacy effects separately without inventing an advisory.

# Test Plan

Extend test-483 and installed upgrade regressions: valid-before/invalid-after
reproduction must become a byte-preserving refused plan; same-identity edits,
missing and replaced nodes, changed manifest after preview, unknown versions,
safe subset upgrades, interrupted recovery and unchanged Git index. Require
full tests and independent task-828 verification before publication.

# Links / Artifacts

- .mdkg/artifacts/goal-84/bug-24-adjacent-findings.json
- root:test-483 and root:task-828 remain independent final verification gates.

## Local Verification — 2026-09-09

Preview validates final selected identities and aliases and binds raw graph
format bytes. Journal v2 persists dependency hashes and directory inventories;
resume/recovery reject moved inputs, path aliases, graph-format changes and
workspace ownership changes. Old v2 journals cannot resume without bindings;
verified original valid identities remain recoverable. No identity synthesis,
implicit Git staging or history changes occur.

Four initial failing tests, three recovery failures and independent-review
regressions were reproduced before correction. The review exposed separator
alias bypass, incorrect directory/file limit coupling and a direction-dependent
ownership comparison. A schema-valid disabled nested workspace reproduces the
last issue; disabling the mandatory root was already rejected by config schema.
All are covered by the final regressions. File limits were not lowered or
repurposed.

Final: 36 focused tests on each of Node 24.18.0 and 26.0.0; 14 installed tests
on each runtime; 1226 complete ordinary tests on Node 26.0.0, no failures/skips.
Build, CLI/docs parity, graph full/changed-only, SQLite verification and diff
checks pass. Documentation describes conservative v2 upgrade/recovery limits.
Exact receipts and hashes: .mdkg/artifacts/goal-84/bug-28-verification.json.

Selected Goal 73, runtime DB, protected Demo 3 bundle and partial bug-17 source
remain unchanged. No final security clearance, 0.6.0 seal or publication is
claimed. Skill candidates: none.
