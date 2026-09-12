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
blocked_by: [task-826]
blocks: []
refs: [bug-35, chk-601]
context_refs: [goal-83]
evidence_refs: []
aliases: []
skills: []
cases: [test-480-case-1, test-480-case-2, test-480-case-3, test-480-case-4, test-480-case-5]
created: 2026-09-07
updated: 2026-09-11
---

# Overview

Qualify installed graph compatibility pack and mcp acceptance for mdkg 0.6.0 using the installed candidate, not source imports.

# Target / Scope

Goal 83 installed consumer qualification and linked Goal 84 regressions.

# Preconditions / Environment

Exact built tarball and source hashes, disposable /private/tmp roots, synthetic data, isolated caches/config and only local Git remotes. This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

# Test Cases

1. Legacy and explicit v2 adoption preserve supported command behavior.
2. Old 0.5.2 client on v2 fails safely without corrupting authored identity.
3. JSON/SQLite identity and reference parity; observational reads on read-only fixtures.
4. Clone versus independent fork, archive/work refs, packs and MCP retain identity semantics.
5. Private copy of current graph migration rehearsed; unsupported historical evidence reported exactly.

# Results / Evidence

Not executed. Record case-level expected/actual, exact commands/runtime/package identity, stdout/exit results and compact reproducible evidence. No missing runtime, interrupted case or source-only assertion is a pass.

# Notes / Follow-ups

Route newly validated blockers to goal-84; retain unknown/unsupported historical cases explicitly. Do not migrate canonical graph or regenerate protected bundles.
