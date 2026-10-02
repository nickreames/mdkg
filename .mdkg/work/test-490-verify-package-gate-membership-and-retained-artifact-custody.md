---
id: test-490
type: test
title: Verify package gate membership and retained artifact custody
status: done
priority: 1
tags: [release-0.6.0, qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/task-843-final-qualification.json]
relates: []
blocked_by: [task-843]
blocks: []
refs: [dec-100, task-843, task-829]
context_refs: [goal-86]
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-09-28
updated: 2026-09-28
---
# Overview

Current result - 2026-09-28: all bounded Test490 acceptance controls pass;
73 focused tests, actual isolated offline prepack without website dependencies,
same234-file retained payload, real-runner mechanical routing/no-repack controls,
and independent review of the four found/fixed custody/test issues. Evidence is
`.mdkg/artifacts/goal-86/task-843-final-qualification.json`. This test does not
substitute for actual37-smoke ladder, fresh security or platform completion.

Verify Task843's repository-owned qualification interfaces under Dec100, without
changing the mdkg CLI/runtime contract or weakening existing package gates.

# Target / Scope

Package/repository smoke membership, dependency scope, final readiness and exact
retained artifact admission. Hosted execution and website acceptance remain deferred.

# Preconditions / Environment

Node24.18.0, owned disposable local fixtures, immutable retained candidate, no
credentials/remotes/providers. Preserve canonical staging and protected bookends.

# Test Cases

1. All46 canonical definitions and47 aliases remain; package contains37 and
   repository retains nine website smokes/four docs plus five website profiles.
2. Package gate works without website dependency trees; repository gate still
   detects missing website dependencies. Invalid profile refuses before effects.
3. Scope reaches nested build/prepack/readiness subprocesses without skipping
   package guidance/security/coverage checks or silently changing hosted state.
4. Matching retained artifact/input manifests pass without repacking. Missing,
   wrong hash, changed inputs, wrong payload, malformed/traversing/linked files,
   and replaced artifact refuse. Original bytes and Git staging are unchanged.
5. Harness-only deltas are explicitly bound; they do not pretend changed package
   input is equivalent. Changed required harness tests are rerun before acceptance.

# Results / Evidence

Unexecuted at enhancement. Record exact commands, hashes, counts, durations and
limitations before done. Final platform/security/ladder/seal gates remain separate.

# Notes / Follow-ups

- Task829 consumes this proof; Task828 reviews affected release-chain behavior.
