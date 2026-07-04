---
id: test-338
type: test
title: generic remote Git public naming contract
status: done
priority: 1
parent: goal-51
tags: [remote-git, project-memory, naming-audit, public-surface]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-650]
blocks: [goal-52]
refs: [goal-51, goal-50, task-649, test-337, task-650, dec-61, dec-62, edd-62, edd-63, goal-52]
context_refs: [dec-61, dec-62, edd-62, edd-63, goal-52]
evidence_refs: []
aliases: []
skills: [service-boundary-ownership-check, verify-close-and-checkpoint]
cases: [generic-public-names, opaque-access-refs, accepted-revision-evidence, project-memory-queries, generic-agent-loop, downstream-policy-boundary, successor-goal-routing]
created: 2026-07-03
updated: 2026-07-03
---
# Overview

Validate that the remote Git/project-memory successor lane keeps mdkg public
primitive names generic and keeps product-specific runtime policy out of mdkg
public behavior.

# Target / Scope

- `goal-51`
- `task-650`
- future mdkg design, source, docs, template, CLI, and release nodes that claim
  remote Git/project-memory behavior

# Preconditions / Environment

- `goal-51` is deliberately paused successor planning, not 0.4.1 publish scope.
- `service-boundary-ownership-check` is available and classifies mdkg-owned
  generic primitives before implementation planning.

# Test Cases

- Public primitive names use generic mdkg terms for remote repositories, source
  descriptors, authenticated access refs, graph discovery, accepted revisions,
  history/why/next-work queries, and agent working-loop operations.
- Authenticated Git access examples contain only opaque refs, policy refs,
  capability refs, or hashes, never credentials or live auth material.
- Accepted revision examples include revision/hash/evidence concepts without
  implying product-specific deployment, room, sandbox, or runtime policy.
- History/why/next-work query examples operate over mdkg graph, event,
  checkpoint, accepted revision, and validation evidence.
- Agent working-loop examples stay generic and do not require a downstream
  product runtime.
- Any product-specific consumer name appears only as private or historical
  context and never as mdkg public feature branding.
- Future implementation work is routed to `goal-52` and remains outside the
  `mdkg@0.4.1` publish lane until an explicit execution/release goal proves it.

# Results / Evidence

Passed with `chk-357`.

Evidence:

- `task-650` is done and defines the primitive surface.
- `dec-61`, `dec-62`, `edd-62`, and `edd-63` use generic public names.
- `goal-52` is the explicit follow-up implementation/release lane.
- Targeted audit over successor lane found no downstream product-branded public
  primitive names and no credential-like example values. Credential terms appear
  only in forbidden/rejected-surface language.
- Changed-only validation passed with zero warnings/errors; full summary
  validation passed with only the unrelated legacy SPEC warning.

# Notes / Follow-ups

- This test does not authorize implementation, publish, push, root bundle
  refresh, downstream repo mutation, or provider mutation.
