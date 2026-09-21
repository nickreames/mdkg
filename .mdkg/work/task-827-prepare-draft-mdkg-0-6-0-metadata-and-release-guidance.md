---
id: task-827
type: task
title: Prepare draft mdkg 0.6.0 metadata and release guidance
status: done
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [release/0.6.0-qualification-draft.md, .mdkg/artifacts/goal-86/task-827-local-verification.json]
relates: []
blocked_by: [bug-6, bug-36, bug-37, bug-35, bug-17, bug-39, task-835, task-836, bug-40, bug-41, bug-42, bug-43]
blocks: []
refs: [dec-94, dec-95, edd-82, task-833]
context_refs: [goal-83, goal-86, dec-96]
evidence_refs: [chk-602, chk-603, chk-604]
aliases: []
skills: []
created: 2026-09-07
updated: 2026-09-17
---

# Current Successor Contract - 2026-09-13

Finish draft0.6.0 metadata and guidance after the explicit implementation
prerequisites. Candidate package inputs must be finalized before the installed
matrix and fresh Standard snapshot. Task830 seals the same qualified tarball
after all gates; it must not create an untested replacement. Keep public release
state draft/unpublished, user documents intact and Windows explicitly unqualified.
Explain accepted old-client/recovery/legacy-bundle limits and the tested native
Git worktree protocol; no policy decision is still pending merely due to old text.

The earlier sections below retain their historical evidence. This current addendum,
updated dependencies, goal-86 and dec-96 govern the remaining work. Planning
authoring is not execution, qualification, a writer claim, or publication.

# Overview

## Current local acceptance - 2026-09-17

Draft package and root lock metadata are now0.6.0; public release state remains
draft/unpublished. Release-critical notes and guidance cover the source-grounded
0.5.2 delta, accepted breaking removals, compact initialization, explicit identity
adoption, reviewed native Git integration and evidence-bound recovery. Wider
documentation/polish remains a later goal set. No runtime source changed here.

All1,628 discovered source tests pass with435 input files unchanged;95 focused
init/upgrade/contract and27 release/contract checks pass. CLI, docs472examples,
generated parity, workflow,69-file local docs smoke, graph/SQLite and diff checks
pass. Independent bounded guidance review is clear. The152-file extraction
manifest still matches. Exact inputs and limitations are in
.mdkg/artifacts/goal-86/task-827-local-verification.json.

Canonical upgrade preview preserves customized.mdkg/README.md and refuses apply;
no upgrade was performed. Final installed/platform/security/full-ladder/seal gates
remain open, including parent-workspace versus independent root-event history.
This local acceptance is neither a final artifact pass nor publication authority.

Historical overview follows:

Current alignment: dec-94 accepts the four policy/fix directions. Update the
maintainer draft's now-historical proposal wording during the next guidance pass;
do not retain unanswered-decision blockers. Chk603 adds worktree review findings.
This alignment turn edits mdkg nodes only, not package metadata or release docs.

Goal: Draft 0.6.0 metadata, complete change notes, bootstrap/migration/reconciliation instructions and compatibility limitations.

Context: The complete approved contract is goal-83 and bounded blocker ownership is goal-84.

# Acceptance Criteria

Explain Bug42's content-bound derived-cache behavior: copied or unbound legacy
caches do not prove freshness; normal inspection derives current metadata without
writes, explicit stale-cache opt-out warns, and deliberate index regeneration is
separate. Preserve malformed-cache diagnostics and explain that these fingerprints
are not immutable graph identities or authenticity signatures. Archive compression
uses current sidecars and explicit write preflight, not a stale-cache dependency.
Requalify this behavior on finalized package inputs; the local Bug42 receipt is
intermediate evidence, not a final artifact pass or a performance guarantee.

Qualify and explain parent-owned workspaces separately from independently executed
root graphs. Bug17's local receipt records that bare compact init creates root
event history, which later parent alias validation rejects; explicit graph-only
setup preserves the previous parent-workspace smoke contract. Do not advertise
independent event-history re-aliasing, rewrite historical events or waive a required
compatibility defect through documentation. Test477 must disposition this observation
against final inputs; ordinary subgraph snapshots remain a separate tested path.

Dec95 is accepted, not a deprecation proposal: removed Git mutation commands and
consumer-specific tooling have no compatibility aliases. Document the exact
breaking inventory, native Git/worktree workflow, generic retained contracts and
source-bound task833 consumer export. Edd82 distinguishes recommendations from
implemented behavior; do not assert consumer adoption. Individual-project
worktrees and ancestry-preserving reviewed merges are confirmed decisions.

Set direct 0.6.0 candidate only after bounded fixes, keep public release state draft/unpublished, correct bootstrap mismatch through bug-6 and include every shipped delta. Preserve compact-default setup, explicit v2 adoption, numeric aliases with stable identities and reviewed reconciliation. No federation, remote skill distribution or autonomous improvement additions.

# Files Affected

Include Bug43's exact changed-only warning path correction for nested projects
and literal POSIX filenames. Explain that warnings are filtered while graph
errors remain global. Do not claim all validation was broken or infer Windows
support from macOS POSIX fixtures. Chk615 is intermediate local evidence;
final-platform/package qualification remains required.

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
