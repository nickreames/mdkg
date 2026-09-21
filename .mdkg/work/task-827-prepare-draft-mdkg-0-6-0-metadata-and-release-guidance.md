---
id: task-827
type: task
title: Prepare draft mdkg 0.6.0 metadata and release guidance
status: progress
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [release/0.6.0-qualification-draft.md]
relates: []
blocked_by: [bug-6, bug-36, bug-37]
blocks: []
refs: [chk-602, dec-94, chk-603, dec-95, edd-82, task-833, chk-604]
context_refs: [goal-83]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-07
updated: 2026-09-11
---

# Overview

Current alignment: dec-94 accepts the four policy/fix directions. Update the
maintainer draft's now-historical proposal wording during the next guidance pass;
do not retain unanswered-decision blockers. Chk603 adds worktree review findings.
This alignment turn edits mdkg nodes only, not package metadata or release docs.

Goal: Draft 0.6.0 metadata, complete change notes, bootstrap/migration/reconciliation instructions and compatibility limitations.

Context: The complete approved contract is goal-83 and bounded blocker ownership is goal-84.

# Acceptance Criteria

Dec95 is accepted, not a deprecation proposal: removed Git mutation commands and
consumer-specific tooling have no compatibility aliases. Document the exact
breaking inventory, native Git/worktree workflow, generic retained contracts and
source-bound task833 consumer export. Edd82 distinguishes recommendations from
implemented behavior; do not assert consumer adoption. Individual-project
worktrees and ancestry-preserving reviewed merges are confirmed decisions.

Set direct 0.6.0 candidate only after bounded fixes, keep public release state draft/unpublished, correct bootstrap mismatch through bug-6 and include every shipped delta. Preserve compact-default setup, explicit v2 adoption, numeric aliases with stable identities and reviewed reconciliation. No federation, remote skill distribution or autonomous improvement additions.

# Files Affected

package.json and required lock metadata, CHANGELOG.md, release/ draft metadata, README and docs/generated references; no Demo 3 source or public deployment.

# Implementation Notes

This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

# Test Plan

Documentation examples, generated-reference parity, command contract, package allowlist and draft release-state tests.

# Links / Artifacts

Owning goal and dependencies are explicit above. Record exact commands, input/source/artifact hashes and pass/fail before completion.

## 2026-09-11 Independent Draft Guidance Progress

Claimed under Goal83 and started without modifying selected Goal73. The new
release/0.6.0-qualification-draft.md separates candidate setup, reviewed scaffold
upgrade, explicit identity adoption, branch reconciliation and Git authority.
It records proposed compatibility policies as unresolved and identifies final
qualification/seal requirements. Chk602 binds the bounded documentation proof.

Package/lock metadata and the published0.5.2 manifest remain unchanged: this task
requires bounded fixes before setting the direct0.6.0 candidate. Complete final
change notes, accepted policies, generated release references and metadata are
still pending. Do not interpret the maintainer draft or passing22release-contract
tests as finished task827 or release readiness.
