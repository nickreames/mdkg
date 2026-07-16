---
id: chk-538
type: checkpoint
title: mdkg v0.5.2 release closeout and generic materialization handoff
checkpoint_kind: handoff
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-757]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-757]
created: 2026-07-15
updated: 2026-07-15
---
# Summary

RELEASE CLOSEOUT: Goal-66 implementation commit f657a1b3 and release metadata commit 867ac709 produced mdkg@0.5.2; publication invocation was sealed at 95f35b93 and verified release history reached origin/main at a5667957. npm published 2026-07-16T05:04:37.374Z with latest=0.5.2, 191 files, 425431 packed bytes, 2291554 unpacked bytes, shasum 8226872a6c797382265a13382edea5b7a9c1e033, integrity sha512-a01iaKqgw3fv7YRi/0E1bWE0polds76ccGyOCMVzyBf35ySZHSjlTIA2DG5CgjZw2TqxKSgcVZxazrOjcB333g==. Isolated and global installs, exact materialization success/failures, clone compatibility, safe no-write root upgrade, full local gates, GitHub CI, exact-SHA Vercel production readiness, and production docs/site checks passed. Approved side effects were npm publish, isolated/global installs, safe root upgrade apply, non-force main push, and resulting Vercel deploys. No tag, force push, PR, Browser/Chrome, unpublish, rollback, direct provider mutation, downstream mutation, or authored mdkg-dev change occurred. Fix-forward policy remains mandatory after publication. Accepted warnings: doctor reports the healthy ignored runtime SQLite file; GitHub actions v4 emitted a non-failing Node 20 action-runtime deprecation notice under Node 24; real-root upgrade preserved nine local customizations with no blocking conflicts. Residual release risk is limited to ordinary downstream environment/auth variance. GENERIC CONSUMER HANDOFF: compatibility floor is mdkg@0.5.2. Install or upgrade with npm install -g mdkg@0.5.2, verify mdkg --version, run mdkg upgrade --json, and run mdkg upgrade --apply --json only when safe_to_apply is true and blocking_conflicts is empty; then run mdkg index, mdkg status --json, mdkg skill validate --json, and mdkg validate --json. Use mdkg git materialize --request REQUEST.json --json with strict schema mdkg.git.materialize.request.v1; consume bounded receipt mdkg.git.materialize.receipt.v1 and stable reason_code values. Supply a credential-free repository_ref, full target_ref, exact expected_commit, optional expected_tree, contained destination, depth, submodule policy, and project-memory policy. Authentication remains external through the declared capability; never place credentials in the request. Materialize verifies and atomically accepts source only; it never pushes, initializes recursive submodules, executes repository-controlled code, or defines downstream runtime policy. Keep legacy mdkg git clone for direct contained clone compatibility and use docs.mdkg.dev/advanced-alpha/git-materialization for the complete contract.

# Scope Covered

- Completed node: task-757 (record v0.5.2 release closeout and downstream upgrade handoff)
- Node type: task
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Completed work node: task-757
- Attached artifacts are listed in checkpoint frontmatter and below.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- See decision and approval refs on the completed node and checkpoint frontmatter.

# Implementation Summary

- Completion of task-757 was recorded through the structured task lifecycle.
- Detailed implementation or test evidence remains on the completed node and linked refs.

# Verification / Testing

## Command Evidence

- command: `mdkg task done --checkpoint`
- result: completed node and evidence checkpoint written

## Pass / Fail Status

- status: done

## Known Warnings

- warning: none recorded by the completion command

# Known Issues / Follow-ups

- Inspect the completed node and linked refs for any explicitly recorded residual work.

## Follow-up Refs

- task/test/goal refs: inspect the completed node and checkpoint frontmatter

# Links / Artifacts

- No artifacts were attached by the completion command.

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
