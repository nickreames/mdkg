---
id: bug-6
type: bug
title: Correct compact default initialization documentation
status: done
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-6-verification.json]
relates: [test-477]
blocked_by: []
blocks: []
refs: []
context_refs: [goal-84, goal-83]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-07
updated: 2026-09-08
---

# Overview

Maintained bootstrap instructions still describe agent guidance as optional while compact setup is the init default. Correct materially false release/install guidance and validate every documented command.

Owner and qualified execution scope: goal-84. Source evidence: README.md bootstrap/init sections; Goal 81 completed source contract.

# Reproduction Steps

Reproduce the stated gap against the frozen baseline, then the installed candidate; preserve exact source and package identity.

# Expected vs Actual

Expected: the stated contract is safe and fully evidenced. Actual: the known defect/evidence gap remains unresolved at intake.

# Suspected Cause

Maintained bootstrap instructions still describe agent guidance as optional while compact setup is the init default. Correct materially false release/install guidance and validate every documented command.

# Fix Plan

Update maintained README/release guidance for default compact init, graph-only and --agent compatibility; preserve project documentation and legacy customization behavior.

Allowed paths: affected implementation above, directly linked helper/consumer paths, focused regression tests and owned mdkg evidence. No unrelated refactoring. This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

Affected-version assessment: confirmed against current 9d7e0d3f candidate source. Verify published 0.5.2 implementation before claiming it affected; identity features may be candidate-only. No invented CVE or advisory claim.

# Test Plan

1. Actual published 0.5.2 tarball integrity and installed upgrade, not a mock legacy seed
2. Default compact init, --graph-only and --agent compatibility
3. Customized AGENTS/CLAUDE and project README/LICENSE preserved
4. Repeated preview/apply, stale plan, interrupted upgrade and recovery
5. Native skill mirrors, resource links and rollback compatibility

Require failing-before/passing-after results and independent verification in task-828. Every security bug links a case-level source regression and installed consumer regression where applicable. No automatic waiver.

# Links / Artifacts

Initial approved plan and chk-563/Goal 82 history.

## Local Verification — 2026-09-08

Disposition: fixed locally, not publication-ready. Maintained README, install,
quickstart and agent workflow guidance now describe compact default initialization,
explicit graph-only mode, compatibility spelling, focused discovery and bounded
managed-section ownership. Candidate behavior is distinguished from published
0.5.2. Reviewed upgrade hashes, stale-plan rejection, explicit recovery and
customized/project/public-doc preservation are documented. The two concise pack
profile flags are equivalent aliases, not a removed command or broader preset.

Three documentation regression groups fail before and pass after the edit.
Thirty-five installed bootstrap/init/upgrade/safety tests pass. Actual offline
published 0.5.2 installs created base, agent and customized-agent fixtures; the
installed candidate upgraded them with reviewed hashes, preserved user bytes and
Git staging, validated the graphs and produced no repeated upgrade writes. Three
fresh init-mode fixtures also pass. Installed-source tests cover stale plans,
interrupted writes/resume/recovery, native mirrors and discovery links.

The serialized full suite and 26 contract checks pass, as do CLI/docs checks
(494 examples), graph validation and diff review. A test run overlapped by a CLI
rebuild was discarded and rerun; harness seed-layout issues were corrected, not
counted as product defects. Receipt: .mdkg/artifacts/goal-84/bug-6-verification.json.

Exact Node 24/full identity qualification and manifest-backed integration remain
bug-7/task-826; independent task-828 verification and the final seal remain open.
No canonical initialization/upgrade, instruction rewrite, skill projection,
bundle refresh, runtime-state change or external action occurred.
