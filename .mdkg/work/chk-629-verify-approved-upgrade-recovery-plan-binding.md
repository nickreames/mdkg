---
id: chk-629
type: checkpoint
title: Verify approved upgrade recovery plan binding
checkpoint_kind: implementation
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-52-baseline.json, .mdkg/artifacts/goal-86/bug-52-full-verification.json, .mdkg/artifacts/goal-86/bug-52-installed-verification.json]
relates: [bug-52]
blocked_by: []
blocks: []
refs: [goal-86, goal-84, test-488, task-828, bug-46, bug-47, bug-53]
context_refs: [goal-86, goal-84]
evidence_refs: [chk-628]
aliases: []
skills: []
scope: [bug-52]
created: 2026-09-21
updated: 2026-09-21
---
# Summary

Locally verified complete approved-plan binding:1718 full tests,82 independent focused and219 installed cases pass. No blocked context accessed. Final platform/security/ladder/seal gates remain open.

# Scope Covered

- Completed node: bug-52 (Recovery journal operations are not bound to the approved upgrade plan hash)
- Node type: bug
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Completed work node: bug-52
- Attached artifacts are listed in checkpoint frontmatter and below.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- See decision and approval refs on the completed node and checkpoint frontmatter.

# Implementation Summary

- Completion of bug-52 was recorded through the structured task lifecycle.
- Detailed implementation or test evidence remains on the completed node and linked refs.
- Schema3 binds complete ordered operations, observations and extra preview
  metadata to the operator-retained reviewed hash. Effective journal mirrors
  must match that payload before path reads, locks, terminal returns or writes.
  Progress remains separate; apply executes a captured approved snapshot.
- Legacy schema1/2 automatic continuation refuses without alteration on all
  graph versions. README and install guidance explain evidence preservation.
  This is generic local approval consistency, not external attestation.

# Verification / Testing

## Command Evidence

- command: `mdkg task done --checkpoint`
- result: completed node and evidence checkpoint written
- Current-source prepatch substitution reproduced in resume and recover at
  67743f5a591d3616486ba4188e4696fe9260bcc4. Fixed regressions cover operation
  insertion/removal/reordering, dependency/payload substitution, schema downgrade,
  terminal shortcuts, in-memory plan changes and CLI no-effect refusal.
- Build/build:test,1718 full discovered tests,82 independent focused tests and
  219 installed cases pass, zero failures/skips. Exact installed Node versions:
  24.15.0,24.18.0,26.0.0 on macOS arm64. Intermediate tarball SHA256
  2e31963463aeb550272a5204a4b90cda93fa172d06f399ef1a526191fd82ade3;
  all230 package-file hashes unchanged. Not the final release seal.
- CLI/docs472examples/workflow parity and diff checks pass. Graph validation:
  zero errors, three preserved stale-bundle warnings; changed-only clean.
  One independent current-source candidate review found no concrete bypass or
  new regression. This is not final Task828 acceptance or a historical scan rerun.

## Pass / Fail Status

- status: done

## Known Warnings

- Three stale-subgraph warnings remain intentionally; no bundle refresh.
- Existing unfinished-journal diagnostic prints its stored hash, not trusted
  approval evidence. Revised guidance requires the saved reviewed-preview hash.
  Nonblocking wording follow-up remains; no original-hash bypass found.

# Known Issues / Follow-ups

- Inspect the completed node and linked refs for any explicitly recorded residual work.
- Seven of14 retained findings now have local remedies. Bugs46/47 and53-57,
  adjacent58-60, platform qualification, independent security acceptance,
  full release ladder and exact artifact seal remain open. Goal85 paused;
  release NOT_READY. Next bounded remedy: Bug53 hard-linked init manifest peers.

## Custody and local commit allowlist

- Owner: mdkg-project-agent. Scoped Bug52 claim completed; no runtime lease was
  acquired. Mutation locks released, five pre-existing runtime leases released,
  queues/messages empty. Goal86 active; selected Goal73 unchanged.
- Explicit local commit unit (no broad staging):
  README.md; docs/src/content/docs/start-here/install.md;
  src/commands/upgrade.ts; src/commands/upgrade_transaction.ts;
  tests/commands/upgrade_approval.test.ts; tests/commands/upgrade_identity.test.ts;
  tests/commands/upgrade_safety.test.ts;
  .mdkg/artifacts/goal-86/bug-52-baseline.json;
  .mdkg/artifacts/goal-86/bug-52-full-verification.json;
  .mdkg/artifacts/goal-86/bug-52-installed-verification.json;
  .mdkg/artifacts/goal-86/security-findings-checkpoint-20260918.json;
  .mdkg/work/bug-52-recovery-journal-operations-are-not-bound-to-the-approved-upgrade-plan-hash.md;
  .mdkg/work/goal-86-complete-mdkg-0-6-0-remediation-and-launch-qualification.md;
  .mdkg/work/test-488-verify-fresh-standard-security-remedies-and-adjacent-qualification-corrections.md;
  this checkpoint.
- Preserve/exclude generated .mdkg/index/mdkg.sqlite. No remote Git, push, tag,
  publication, providers, deployments, migration, bundle refresh or sibling edits.
- Protected SHA256 bookends:
  selection f996926a868b7c06fb29311fb69c48d862e9dc354404f777df93e1c5443b07ab;
  runtime DB b1f2bfb3c9ebd254d520eb7f47c12c2fa18daf691056fe97ba1890f94d013a81;
  Demo3 bundle741b4644da1d3d1ff3bbd4b9240e22870609f015e49e28170a91748ab024570b.
- Skill coverage: pursue-mdkg-goal, build-pack-and-execute-task,
  source-grounded-diagnose-and-fix, fix-finding, verify-close-and-checkpoint,
  safe-git-publication-preflight. Independent read-only investigation/review
  followed fix-finding. Skill candidates: none.

## Follow-up Refs

- task/test/goal refs: inspect the completed node and checkpoint frontmatter

# Links / Artifacts

- .mdkg/artifacts/goal-86/bug-52-baseline.json
- .mdkg/artifacts/goal-86/bug-52-full-verification.json
- .mdkg/artifacts/goal-86/bug-52-installed-verification.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
