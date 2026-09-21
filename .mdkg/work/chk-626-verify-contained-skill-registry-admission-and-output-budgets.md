---
id: chk-626
type: checkpoint
title: Verify contained skill registry admission and output budgets
checkpoint_kind: implementation
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-49-baseline.json, .mdkg/artifacts/goal-86/bug-49-current-validation.json, .mdkg/artifacts/goal-86/bug-49-installed-verification.json]
relates: [bug-49]
blocked_by: []
blocks: []
refs: [goal-86, goal-84, test-488, test-487, task-828, bug-46, bug-47, bug-50]
context_refs: [goal-86, goal-84]
evidence_refs: [chk-625]
aliases: []
skills: []
scope: [bug-49]
created: 2026-09-21
updated: 2026-09-21
---
# Summary

Local remedy verified:1658 full tests,164 focused and57 installed cases pass on macOS arm64 across required Node runtimes. One candidate review regression reproduced and corrected. No blocked context accessed; final independent review Linux full ladder and release seal remain open.

# Scope Covered

- Completed node: bug-49 (Creating a skill can copy an external file through a linked registry)
- Node type: bug
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Completed work node: bug-49
- Attached artifacts are listed in checkpoint frontmatter and below.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- See decision and approval refs on the completed node and checkpoint frontmatter.

# Implementation Summary

- Completion of bug-49 was recorded through the structured task lifecycle.
- Detailed implementation or test evidence remains on the completed node and linked refs.
- Reject linked/special/oversized registries before skill effects; use contained
  bounded reads and replacement at the shared registry boundary. Preserve
  regular authored prefix/footer and force/missing/hardlink controls.
- Preflight the exact parsed prospective registry, including force replacement,
  and bound UTF8 output at ensure/refresh. One completed independent candidate
  review found an8476-byte output under8192, reproduced and corrected by parent.
  This is not a claim to resolve separate Bug46 metadata or Bug47 ancestor races.

# Verification / Testing

## Command Evidence

- command: `mdkg task done --checkpoint`
- result: completed node and evidence checkpoint written
- Build/build:test and narrow16 tests passed. Final focused164/164 and full
  manifest-backed1658/1658 source tests pass with zero failures/skips on
  Node26.0.0/macOS arm64. Native execution supports OS/process evidence.
- Exact installed intermediate package SHA256
  da3b71ff1f10992272f18c1044b07a261dda807795e1f4b7c380507d8d8a56cd:
  19 cases each pass on Node24.15.0/24.18.0/26.0.0; all230 source/installed
  file hashes match before/after. Offline pack/install skipped lifecycle scripts.
  Not final release qualification or seal. Linux and Windows are not qualified.
- CLI matrix, documentation/reference/examples and CI workflow parity passed.
  Pre-close full graph and changed-only validation passed with zero errors;
  three stale imported-bundle warnings remain. Before final node edits all five
  index projections verified fresh. Post-checkpoint reindex, full validation,
  changed-only validation, all five index checks and git diff --check then passed;
  full validation retains only the same three bundle-freshness warnings.
- Retain corrected baseline6 pass/9 failure, earlier invalid custom-config
  fixture assumptions, interrupted first full run, runtime-path harness typo,
  and agent-caused concurrent-build invalidation. None is counted as a pass or
  hidden. Both final frozen runs pass; source/test hashes remain unchanged.

## Pass / Fail Status

- status: done

## Known Warnings

- Three imported-bundle freshness warnings are preserved; no refresh authority.
- Full release ladder/coverage floors, independent final review and platform
  acceptance remain open. Earlier published-version impact is unassessed.

# Known Issues / Follow-ups

- Goal86 remains active and release NOT_READY; Goal85 stays paused. Four of14
  retained findings have local remedies; ten remain open plus adjacent58-60.
  Next independent source remedy: Bug50 snapshot validity. Native filesystem
  design/feasibility is separate from dependency/distribution implementation.
- One repository writer accepted custody from main8ee44cf1,56 ahead/0 behind
  cached origin/main. No remote verification. Local commit only; no provider,
  publication, tag, push, canonical migration or bundle/subgraph action.
- No blocked context accessed, recovered or rerun. These are new source-derived
  regressions. No runtime lease acquired; supported commands release transient
  locks. Goal active_node is durable routing, not a runtime execution lease.
- Protected selected Goal73 SHA256
  f996926a868b7c06fb29311fb69c48d862e9dc354404f777df93e1c5443b07ab;
  runtime DB b1f2bfb3c9ebd254d520eb7f47c12c2fa18daf691056fe97ba1890f94d013a81;
  Demo3 bundle741b4644da1d3d1ff3bbd4b9240e22870609f015e49e28170a91748ab024570b.
  Final bookends match all three hashes. Generated .mdkg/index/mdkg.sqlite stays unstaged.

## Exact Local Commit Allowlist

- src/commands/skill.ts
- src/commands/skill_support.ts
- tests/commands/mutation_safety.test.ts
- tests/commands/skill_registry_admission.test.ts
- tests/fixtures/skill-registry-admission.cjs
- .mdkg/artifacts/goal-86/bug-49-baseline.json
- .mdkg/artifacts/goal-86/bug-49-current-validation.json
- .mdkg/artifacts/goal-86/bug-49-installed-verification.json
- .mdkg/artifacts/goal-86/security-findings-checkpoint-20260918.json
- .mdkg/work/bug-49-creating-a-skill-can-copy-an-external-file-through-a-linked-registry.md
- .mdkg/work/goal-86-complete-mdkg-0-6-0-remediation-and-launch-qualification.md
- .mdkg/work/test-488-verify-fresh-standard-security-remedies-and-adjacent-qualification-corrections.md
- .mdkg/work/chk-626-verify-contained-skill-registry-admission-and-output-budgets.md

Skill coverage: pursue-mdkg-goal, fix-finding, source-grounded-diagnose-and-fix,
verify-close-and-checkpoint and local Git preflight. New skill candidates: none.

## Follow-up Refs

- task/test/goal refs: inspect the completed node and checkpoint frontmatter

# Links / Artifacts

- .mdkg/artifacts/goal-86/bug-49-baseline.json
- .mdkg/artifacts/goal-86/bug-49-current-validation.json
- .mdkg/artifacts/goal-86/bug-49-installed-verification.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
