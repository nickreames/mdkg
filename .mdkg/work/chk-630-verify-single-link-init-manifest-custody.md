---
id: chk-630
type: checkpoint
title: Verify single-link init manifest custody
checkpoint_kind: implementation
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-53-baseline.json, .mdkg/artifacts/goal-86/bug-53-full-verification.json, .mdkg/artifacts/goal-86/bug-53-installed-verification.json]
relates: [bug-53]
blocked_by: []
blocks: []
refs: [goal-86, goal-84, test-488, task-828, bug-46, bug-47, bug-54]
context_refs: [goal-86, goal-84]
evidence_refs: [chk-629]
aliases: []
skills: []
scope: [bug-53]
created: 2026-09-21
updated: 2026-09-21
---
# Summary

Bounded hard-link remedy locally verified:1730 full,59 focused and111 installed cases pass. Parent separate review fallback used after fresh-agent limit. Native race/ACL and final qualification remain open; no blocked context accessed.

# Scope Covered

- Completed node: bug-53 (Init rewrites hard-linked manifest peers outside the selected repository)
- Node type: bug
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Completed work node: bug-53
- Attached artifacts are listed in checkpoint frontmatter and below.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- See decision and approval refs on the completed node and checkpoint frontmatter.

# Implementation Summary

- Completion of bug-53 was recorded through the structured task lifecycle.
- Detailed implementation or test evidence remains on the completed node and linked refs.
- Reject multiply linked manifests before init's first write and under its
  existing mutation lock. Independently guard the actual writer with explicit
  root/path authority, non-truncating open, regular/single-link descriptor
  checks and device/inode correlation with the admitted and current pathname.
- Keep ordinary existing manifests on their inode; use exclusive new-file
  creation. Do not introduce unqualified replacement metadata/ACL behavior.
  This is not a native race-proof filesystem layer; Bugs46/47 remain open.

# Verification / Testing

## Command Evidence

- command: `mdkg task done --checkpoint`
- result: completed node and evidence checkpoint written
- Before patch: six CLI mode/force combinations exited0 and changed synthetic
  external hard-linked peers; regression family1pass/6fail. Ordinary init
  metadata control passed. Published0.5.2 affectedness remains unestablished.
- Final build/build:test,59 focused and1730 full discovered tests pass, zero
  failures/skips. Full run419585ms on Node26.0.0/macOS arm64. Offline installed
  Node24.15.0/24.18.0/26.0.0 each pass37 cases (111 total), using tarball SHA256
  166ce48297af02aff57036686e4e343161e99aa6b48a1cf712e96afd17dae10a.
  All230 package-file hashes unchanged; this is an intermediate artifact.
- CLI/docs472examples/workflow parity, graph and diff checks pass. All five
  generated index projections must verify fresh at the final commit boundary.
- Fresh read-only agent creation hit the session limit. Parent performed
  separate skill fallback review passes; no independent acceptance claimed.
  Task828 independent review and final platform/ladder/seal gates remain open.

## Pass / Fail Status

- status: done

## Known Warnings

- Three preserved stale-subgraph warnings; no bundle refresh.
- Native namespace/last-check races, general ACL/metadata qualification and
  Linux/macOS x86_64 acceptance are not established by this bounded remedy.

# Known Issues / Follow-ups

- Inspect the completed node and linked refs for any explicitly recorded residual work.
- Eight of14 retained findings have bounded local remedies. Bugs46/47 and54-57,
  adjacent58-60, platform/security/release ladder/seal remain open. Goal85 paused;
  release NOT_READY. Next bounded remedy: Bug54 numeric-ID safety.

## Custody and explicit local commit unit

Owner mdkg-project-agent; scoped Bug53 claim completed. No runtime lease acquired;
five existing runtime leases released, queues/messages empty. Goal86 remains
active and selected Goal73 unchanged. No blocked context accessed or recovered.

Commit allowlist:
- src/commands/init.ts
- src/commands/init_manifest.ts
- tests/commands/init_manifest_ownership.test.ts
- tests/commands/upgrade.test.ts
- .mdkg/artifacts/goal-86/bug-53-baseline.json
- .mdkg/artifacts/goal-86/bug-53-full-verification.json
- .mdkg/artifacts/goal-86/bug-53-installed-verification.json
- .mdkg/artifacts/goal-86/security-findings-checkpoint-20260918.json
- .mdkg/work/bug-53-init-rewrites-hard-linked-manifest-peers-outside-the-selected-repository.md
- .mdkg/work/goal-86-complete-mdkg-0-6-0-remediation-and-launch-qualification.md
- .mdkg/work/test-488-verify-fresh-standard-security-remedies-and-adjacent-qualification-corrections.md
- this checkpoint

Preserve/exclude generated .mdkg/index/mdkg.sqlite. No remote Git, push, tags,
publication, providers, deployment, migrations, bundle refresh or sibling edits.
Protected SHA256 bookends:
- selection f996926a868b7c06fb29311fb69c48d862e9dc354404f777df93e1c5443b07ab
- runtime DB b1f2bfb3c9ebd254d520eb7f47c12c2fa18daf691056fe97ba1890f94d013a81
- Demo3 bundle741b4644da1d3d1ff3bbd4b9240e22870609f015e49e28170a91748ab024570b

Skills reused: pursue-mdkg-goal, build-pack-and-execute-task,
source-grounded-diagnose-and-fix, fix-finding (delegation-unavailable fallback),
verify-close-and-checkpoint, safe-git-publication-preflight. Candidates: none.

## Follow-up Refs

- task/test/goal refs: inspect the completed node and checkpoint frontmatter

# Links / Artifacts

- .mdkg/artifacts/goal-86/bug-53-baseline.json
- .mdkg/artifacts/goal-86/bug-53-full-verification.json
- .mdkg/artifacts/goal-86/bug-53-installed-verification.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
