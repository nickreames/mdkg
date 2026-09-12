---
id: bug-36
type: bug
title: Remove Git mutation convenience commands from mdkg 0.6.0 without compatibility aliases
status: done
priority: 1
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-36-38-verification.json]
relates: []
blocked_by: [task-833, bug-38]
blocks: []
refs: [goal-84, dec-95, edd-82, test-484, bug-38, test-485]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-09-11
updated: 2026-09-12
---
# Overview

Goal: Remove Git mutation convenience wrappers from the 0.6.0 package without
compatibility aliases. Context: dec-95 rejects mdkg as a Git workflow wrapper.
Owner: mdkg-project-agent. Product-boundary publication blocker, not a new CVE.
Affected source: current cd0eb6fcc3f5945cfa3c29fe0cb356d9805e518c; published
version exposure must be mapped to the preserved registry artifact, not guessed.

# Reproduction Steps

1. Inspect CLI dispatch/help and src/commands/git.ts collectPushReceipt.
2. Observe clone/fetch/push commands and stageAll calling git add -A and commit.
3. Inspect git_materialize.ts and DB-sealing closeout for adjacent orchestration.
Static evidence only; do not execute these paths against the canonical checkout.

# Expected vs Actual

- Expected: users/runtimes invoke native Git; mdkg supplies graph meaning and
  reviewable integrity evidence without silently staging or transporting code.
- Actual: the CLI exposes remote mutation and combined stage/commit/push flows.

# Suspected Cause

Earlier consumer lifecycle integration put Git orchestration into the CLI.
Internal Git history/snapshot queries are a separate necessary capability.

# Fix Plan

After task-833 export capture, remove clone/fetch/push and all stage-all/commit
dispatch, command options, implementation, docs/help/generated references and
packaged guides. No deprecation aliases. Review materialize/closeout/push-ready
under edd-82: recommend removing public workflow orchestration while retaining
generic read-only revision inspection/receipt data where independently useful.
Record the exact command inventory before implementation; do not silently expand
removal into graph history/reconciliation, Git subprocess reads, or graph bundles.
Allowed future paths: owning src modules, direct tests/scripts, owned package
seed/help/docs/reference/release sources and required mdkg evidence. No canonical
Git action, user instruction overwrite, protected Demo3 mutation or consumer edit.

# Test Plan

Test-484: installed removed-command refusal before all writes/subprocess remote
actions; help/CLI/MCP/package absence; no alias fallback; retained graph identity,
history and local Git observations still work. Run linked-worktree test-478,
full source/CLI/docs/package checks, then task-828 independent exact-diff review.
Done only with exact removed/retained inventory and source/package-bound proof.

# Links / Artifacts

- Local implementation verification:
  .mdkg/artifacts/goal-84/bug-36-38-verification.json. All six wrappers and their
  exclusive implementation, flags and dispatch are removed without aliases.
  Installed package/module/help/contract checks retain inspection only.
- Materialization smoke membership is replaced, not removed, by the installed
  Git-boundary smoke. Exact source/tarball hashes and all three Node runtimes
  prove26 refusal cases per runtime before Git/auth tools or fixture writes.
- Bug38/test485 qualify the retained inspector; full ordinary tests1402 pass.
  CLI/docs/generated-reference/package guards and full/changed graph checks pass.
- Test484 also awaits Bug37; native linked-worktree test478 and task828 final
  independent security acceptance remain separate required publication gates.
  This local implementation unit does not imply complete0.6.0 readiness.
