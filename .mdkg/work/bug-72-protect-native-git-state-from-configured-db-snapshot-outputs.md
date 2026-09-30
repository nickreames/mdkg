---
id: bug-72
type: bug
title: Protect native Git state from configured DB snapshot outputs
status: done
priority: 1
tags: [release-0.6.0, final-diff-remedy]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/independent-diff-review-20260930.json, .mdkg/artifacts/goal-86/successor-installed-case-acceptance-20260930.json, .mdkg/artifacts/goal-86/successor-installed-platform-qualification-20260930.json, .mdkg/artifacts/goal-86/successor-security-acceptance-20260930.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-86, goal-84, bug-63, task-828, test-491]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-09-30
updated: 2026-09-30
---
# Overview

Goal: prevent configured snapshot/database output paths from replacing native
Git administration. Owner: mdkg-project-agent, one checkout writer.

Context: installed f7cbdc1d at c313d804 reproduced explicit snapshot seal
overwriting a separate native Git index located beneath the configured DB root.
The resulting header is SQLite format3. Candidate-f608d6ab8725db3e was suppressed
as a security advisory because it requires protected configuration and explicit
operator action; the demonstrated native-Git integrity defect remains a blocker.
Do not describe it as a newly introduced replacement primitive or remote exploit.

# Boundaries / Allowed paths

Generic Node-only native-Git destination admission before snapshot/DB effects.
src/core/project_db_snapshot.ts, directly required DB mutation/admission helpers,
src/util/git_metadata.ts only if the shared control requires it, and regressions.
Only required mdkg evidence/projections and disposable synthetic fixtures.
No DB initialization/migration on canonical state; no source feature, consumer,
provider, remote Git, publication, canonical worktree/branch change or bundle refresh.

# Reproduction Steps

The installed f7cbdc1d candidate was run against a disposable project whose
configured DB state path was a separate native Git index beneath the DB root.
Snapshot seal succeeded and replaced the index with SQLite bytes. Real user
state and canonical runtime databases were not used by that reproduction.

# Expected vs Actual

Expected: explicitly configured mdkg outputs must respect observed native Git
index/common/object/hook ownership, including separate gitdir and linked worktrees.
Actual: contained regular-file type admission lets snapshot seal replace an index.

# Suspected Cause

Snapshot admission enforced contained regular-file ownership but did not compare
the complete mutable output/sidecar inventory with observed Git administration.

# Fix Plan

Reuse existing actual-topology Git metadata guards at the earliest complete
runtime/state/manifest/sidecar output inventory and at use. Preserve legitimate
default/custom DB paths and read-only snapshot inspection. Avoid invented Git
workflow wrappers or broad repository scans. Coordinate shared helper work with Bug63.

# Test Plan

Installed original reproduction refuses before runtime/snapshot/manifest/staging
effects; ordinary, separate gitdir and linked-worktree controls and legitimate
seal/reseal/verify behavior pass. Cover direct and indirect mutable outputs, not
only one index name. Evidence includes exact hashes and complete fixture inventory.
Test493/Task828 and full package/platform/seal gates remain final acceptance.

Sanitized baseline: .mdkg/artifacts/goal-86/independent-diff-review-20260930.json.
Historical receipts remain unchanged. Bugs46/47 remain deferred unresolved.
No new skill candidate.

# Links / Artifacts

Bug63 owns the shared Git guard; Test493 and Task828 own final acceptance.
