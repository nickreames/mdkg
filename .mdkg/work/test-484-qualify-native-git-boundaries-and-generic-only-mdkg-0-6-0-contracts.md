---
id: test-484
type: test
title: Qualify native Git boundaries and generic-only mdkg 0.6.0 contracts
status: backlog
priority: 1
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [bug-36, bug-37]
blocks: []
refs: [goal-83, goal-84, dec-95, edd-82, task-833, test-478]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-09-11
updated: 2026-09-11
---
# Overview

Verify the complete dec-95 breaking boundary change without reducing generic
graph safety. Owner mdkg-project-agent. Planned tests, not passing evidence.

# Target / Scope

Bug-36, bug-37, task-833 and retained generic interfaces; task-828 is final
independent acceptance. Test-478 owns actual linked-worktree integration.

# Preconditions / Environment

One frozen installed candidate with source/tarball hashes, isolated synthetic
graphs/native Git repositories under /private/tmp, required Node24.15.0/supported
24/26 versions. No remote Git, canonical migration, consumer or provider action.

# Test Cases

1. Removed Git mutation commands/flags reject before filesystem/index/remote
   effects; no hidden aliases. Retained observational history still works.
2. Package CLI/help/generated docs/MCP/seeds agree on removed/retained surfaces.
3. Removed product profile rejects explicitly; no fallback to weaker validation.
4. Skill metadata has no privileged product namespace, search/output adapter or
   hidden compatibility projection. Unknown authored data remains unmodified.
5. Generic orchestrated agents and noncommercial work contracts are exercised
   after their exact successor schema is reviewed; no old product-token aliases.
6. Retained references, redaction/visibility, receipt linkage and artifact checks
   remain strict; structural verification never asserts external execution proof.
7. Fresh init and actual0.5.2 upgrade preserve custom user files and provide clear
   breaking-change guidance without canonical or silent authored-data migration.
8. Export manifest/source/fixture hashes match pre-removal source; consumer
   adoption remains distinct. Scan exclusions/history are explicit and justified.
9. Native Git/worktree scenarios retain source and graph outcomes, stable IDs,
   local-state isolation and untouched staging during semantic operations.

# Results / Evidence

Not executed. Bind exact candidate/runtime/fixture receipts before completion.

# Notes / Follow-ups

- No compatibility waivers; no blanket removal of generic optional DB primitives.
- Full release ladder and task-828 remain required after these tests pass.
