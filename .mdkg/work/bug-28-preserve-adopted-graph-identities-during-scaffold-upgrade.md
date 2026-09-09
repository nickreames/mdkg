---
id: bug-28
type: bug
title: Preserve adopted graph identities during scaffold upgrade
status: backlog
priority: 1
tags: [release-0.6.0, behavioral-audit]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-24-adjacent-findings.json]
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
- root:test-483 and root:task-828 remain final verification gates. No fix yet.
