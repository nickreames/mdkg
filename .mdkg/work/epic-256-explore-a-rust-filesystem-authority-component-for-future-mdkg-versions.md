---
id: epic-256
type: epic
title: Explore a Rust filesystem authority component for future mdkg versions
status: backlog
priority: 3
tags: [future, native-filesystem, planning-only]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-86, bug-46, bug-47, epic-241, epic-34, dec-97]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-09-21
updated: 2026-09-21
---
# Goal

Design and, only under later qualified authority, implement a narrow Rust-backed
filesystem authority component when it can satisfy mdkg's generic containment
and metadata-preservation contracts better than the current Node API boundary.
This is future backlog, not a0.6.0 implementation assignment or a full rewrite.

# Scope

- Reuse Bugs46/47's retained source-grounded evidence and Epic241's API/sink map.
- Descriptor-anchored contained reads, creation, append, replacement and removal;
  explicit external authority remains separate from contained operations.
- Preserve or fail closed on mode/owner/group/ACL restrictions before sensitive
  bytes become visible; preserve hard-linked peers and interrupted-write safety.
- Evaluate Node-API versus a bounded helper protocol, platform packaging, ABI,
  input validation, resource limits, integrity/provenance and offline behavior.
- Qualify macOS/Linux architecture support and unsupported-platform behavior;
  native code alone is not evidence that pathname races or ACL issues are fixed.
- Preserve generic CLI/graph formats and independently useful OSS behavior.

# Milestones

1. Read-only source/API/threat-boundary design and affected-version assessment.
2. Separately approved disposable feasibility fixtures: synchronized ancestor
   swaps, restrictive ACLs/modes/groups, hardlinks, crashes and private-worktree
   controls. No canonical graph mutation or blocked-context recovery.
3. Explicit design decision on packaging, supported platforms, dependency/build
   costs, boundary protocol, safe failure behavior and rollback compatibility.
4. Fully qualified implementation tasks and tests allocated only after approval;
   migrate shared sinks incrementally without duplicate authority implementations.
5. Independent source review, exact installed cross-platform qualification,
   user guidance and release-specific acceptance under separate release authority.

Done when: the chosen boundary has source-backed acceptance evidence, no known
in-scope bypass, supported distribution/upgrade behavior and explicit limitations;
or the investigation closes with an evidence-backed rejected design. A rejected
design does not close Bugs46/47.

# Out of Scope

Current Goal86 execution, Bun migration, full mdkg Rust rewrite, DB sidecar or
consumer execution policy, scheduling/payment/reputation, remote services,
publication, automatic downloads/global install, canonical migration and Git
history operations. Epic34's DB-sidecar concepts are references, not imported scope.

# Risks

- Native distribution and platform ABI/ACL differences can exceed performance benefits.
- Unsafe/native code, packaging or fallback paths may introduce new authority gaps.
- Expanding the contract or claiming portable race immunity without proof is unacceptable.
- This epic's existence does not resolve current release blockers or grant a waiver.

# Links / Artifacts

- Dec97; Bugs46/47; Epic241; Epic34; Goal86; future Linux proof in Epic257.
- Owner mdkg-project-agent; generic mdkg boundary. No consumers are mutated.
- Future design/implementation/CI/commit/publication authority must be explicit;
  current status is backlog and no child work has been claimed.
