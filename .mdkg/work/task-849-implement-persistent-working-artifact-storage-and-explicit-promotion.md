---
id: task-849
type: task
title: Implement persistent working artifact storage and explicit promotion
status: backlog
priority: 1
parent: goal-89
tags: [cloud-planning, design-only]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [chk-675]
blocks: []
refs: [test-495]
context_refs: [edd-83]
evidence_refs: []
aliases: []
skills: []
created: 2026-10-02
updated: 2026-10-02
---

# Overview

Implement graph-local manifest-owned persistent work entries, list/inspect and
explicit promotion using the approved names/schema. Keep ordinary graph/index,
capability, pack, bundle and package outputs free of unpromoted scratch. Use
existing node/archive authoring for reviewed findings with source digest/ref;
retain originals. Preserve user files and explicit tracking/ignore policy.
Implement only local durability across commands/restarts; external artifact
provider setup/upload is separate. Synthetic restart/export/restore tests must
expose checkout deletion and host-loss limits; no automatic graph migration.

# Implementation Notes

Owned by goal-89; follow edd-83. Depends on chk-675.
This record is a future task, not execution authorization in this PR. Resolve
the design decisions at the named design checkpoint before changing behavior.

# Acceptance Criteria

Attach reviewed paths/contracts and applicable automated fixture results to
test-495.
Maintain explicit failures/gaps; unknown custody, stale inputs or missing required
platform proof blocks completion. Later Run scope and original implementation
gates apply. No unrelated project/graph writes or publication authority.

# Current State

Backlog, unclaimed. Implementation and acceptance: NOT_RUN.

# Files Affected

A new selected working-storage command/helper family under src, its local manifest/ignore policy, docs/contracts and synthetic tests. Directory/CLI names are locked at the design checkpoint; existing scratch is preserved.

# Test Plan

Behavior cases are defined by test-495; prepublication evidence by chk-677. All are NOT_RUN.

# Links / Artifacts

edd-83 contains the reviewed proposal; future evidence must be attached explicitly.
