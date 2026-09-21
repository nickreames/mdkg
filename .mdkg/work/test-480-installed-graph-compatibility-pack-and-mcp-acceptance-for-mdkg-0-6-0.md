---
id: test-480
type: test
title: Installed graph compatibility pack and MCP acceptance for mdkg 0.6.0
status: backlog
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-35-readonly-git-index-reproduction.json]
relates: []
blocked_by: [bug-17, bug-35, task-835, task-836, task-827, bug-42, bug-43]
blocks: []
refs: [bug-35]
context_refs: [goal-83, goal-86, dec-96]
evidence_refs: [chk-601]
aliases: []
skills: []
cases: [test-480-case-1, test-480-case-2, test-480-case-3, test-480-case-4, test-480-case-5]
created: 2026-09-07
updated: 2026-09-15
---

# Current Successor Contract - 2026-09-13

Legacy/v2, explicit compatible-writer adoption, historical migration ambiguity, JSON/SQLite observational parity, packs/MCP and work/archive references. Keep the canonical rehearsal private; never invent identity.

This test no longer waits for task826 or Bug7 aggregate closure. Its updated
implementation prerequisites lead into installed cases; task826 consumes the
results. Record historical/current-intermediate/final-artifact-pass/failure/
unverified states. Final qualification uses one frozen0.6.0 tarball; macOS/Linux
completeness is independently bound by test487. Task828 remains independent
acceptance, not an upstream requirement for these test results.

Current case 2 replaces the unconditional old-client refusal expectation in
the historical case list below. Test the explicit v2 writer-capability fence
where the candidate can enforce it, including refusal before writes and normal
operation by compatible writers. Separately reproduce the actual published
0.5.2 initialization bypass inside a disposable fixture; record exact observed
effects and classify that old executable as unsupported for v2 authoring.
An old executable cannot be changed retroactively. This accepted limitation is
not a safe-refusal pass and must not waive defects in candidate-controlled paths.
Bind both dispositions to dec-94, task-835 and exact installed package bytes.

The earlier sections below retain their historical evidence. This current addendum,
updated dependencies, goal-86 and dec-96 govern the remaining work. Planning
authoring is not execution, qualification, a writer claim, or publication.

# Overview

Qualify installed graph compatibility pack and mcp acceptance for mdkg 0.6.0 using the installed candidate, not source imports.

# Target / Scope

Goal 83 installed consumer qualification and linked Goal 84 regressions.

# Preconditions / Environment

Exact built tarball and source hashes, disposable /private/tmp roots, synthetic data, isolated caches/config and only local Git remotes. This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

# Test Cases

Current Bug43 addendum: rerun tests/fixtures/changed-warnings.cjs against the exact
final installed bytes on required runtimes/platforms. Require exact changed paths
and warning identities for root/nested graphs across standalone, linked-worktree,
submodule and separate-gitdir checkouts, literal backslashes/newlines, native R/C,
staged/unstaged/untracked paths and present/absent caches. Preserve global errors,
exclude unchanged warnings and compare complete filesystem/Git bookends. Pairing
cache-present/optional-locks1 and cache-absent/unset is not a full2x2 claim; broader
observer suites retain helper traps/native-refresh controls. Chk615's16installed
cases per runtime are macOS intermediate evidence only, not final acceptance.

Current Bug42 addendum: rerun tests/fixtures/cache-freshness.cjs against the exact
final installed bytes on both required platforms/runtimes. Cover copied, equal/
older-time, deleted, absent, fresh and unbound caches; skill/capability metadata;
template/config inputs; explicit no-cache/no-reindex and malformed-cache errors;
archive payload restoration/corruption and explicit compression with absent caches.
Require current show/search/list/pack/MCP semantics and complete read/index/staging
bookends. Retain source-level deterministic intervening-read evidence separately
from installed CLI proof. Bug42's242 installed plus84 mounted cases per runtime
are current-intermediate macOS evidence only; all final-artifact gates remain open.

1. Legacy and explicit v2 adoption preserve supported command behavior.
2. Old 0.5.2 client on v2 fails safely without corrupting authored identity.
3. JSON/SQLite identity and reference parity; observational reads on read-only fixtures.
4. Clone versus independent fork, archive/work refs, packs and MCP retain identity semantics.
5. Private copy of current graph migration rehearsed; unsupported historical evidence reported exactly.

# Results / Evidence

Not executed. Record case-level expected/actual, exact commands/runtime/package identity, stdout/exit results and compact reproducible evidence. No missing runtime, interrupted case or source-only assertion is a pass.

# Notes / Follow-ups

Route newly validated blockers to goal-84; retain unknown/unsupported historical cases explicitly. Do not migrate canonical graph or regenerate protected bundles.
