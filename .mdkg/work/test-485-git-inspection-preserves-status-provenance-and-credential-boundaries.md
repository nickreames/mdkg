---
id: test-485
type: test
title: Git inspection preserves status provenance and credential boundaries
status: done
priority: 1
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-36-38-verification.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-84, bug-36, test-484, bug-38, chk-571]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-09-11
updated: 2026-09-12
---
# Current accepted package closeout contract - 2026-09-28 Dec100

Preserve completed removal-verification evidence without reopening achievement. Final affected acceptance is Test484/Test488 and Task828.

Dec100 requires37 package smokes plus local platform/security/guidance acceptance.
All46 definitions remain; nine website smokes/nine site profiles defer to Epic258
and hosted execution to Epic257. Same-input case evidence can be reused; missing
seal does not erase passes. Node >=24.18.0 <25 replaces old runtime success gates.
Bugs46/47 remain deferred/unresolved; no blocked scan context recovery. This
amendment is not qualification proof or publication authority.

# Historical contract and evidence retained below

# Overview

Qualify retained inspection independently of removed-command refusal.

# Target / Scope

Bug38, src/commands/git.ts, tests/commands/git_inspect.test.ts and the installed
boundary smoke. Owner mdkg-project-agent; test484 consumes this verification.

# Preconditions / Environment

Synthetic repositories under /private/tmp, no real credentials/remotes/providers.
Pin source/package hashes and preserve complete fixture and Git-index bookends.
Required installed runtime matrix: Node24.15.0,24.18.0,26.0.0 before final seal.

# Test Cases

1. First unstaged column; mixed/staged/unstaged paths; rename/copy pairs;
   whitespace, newline, tab and Unicode names preserved exactly.
2. Failed/truncated/malformed/oversized status fails without a false clean
   receipt or raw helper output. Clean/unborn/detached controls remain useful.
3. No remote, non-origin-only and multiple remote names match selected URL.
4. Synthetic URL query/fragment/userinfo and encoded forms are omitted from all
   descriptor copies; legitimate HTTPS/SSH/SCP/local descriptions still work.
5. Configured fsmonitor never executes. Git index and staged objects remain
   unchanged with caller GIT_OPTIONAL_LOCKS=1. Removed commands still refuse.

# Results / Evidence

Local implementation verification passed; see
.mdkg/artifacts/goal-84/bug-36-38-verification.json. Before correction, ten of the
twelve initial cases failed and two controls passed. Final focused Git and
containment suite:53 passed, zero failed/skipped. Full ordinary suite:1402 passed,
zero failed/skipped. The exact intermediate tarball aee02dea...18a1 passed all
three required Node runtimes, each with26 refusal and16 inspection cases.

Additional independent-review regressions cover active versus unused content
filters, initialized submodule filters, non-URI helper names, captured commit/tree
binding while HEAD moves, and portable versus POSIX-only fixture names. Native
Windows execution and final task828 security acceptance remain unverified.

# Notes / Follow-ups

- Preserve chk571's rejected broad credential candidate and original scan count.
- No Windows, remote-authentication or full worktree claim from these cases.
- Final independent security diff remains required under task828.
