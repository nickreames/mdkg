---
id: test-338
type: test
title: generic remote Git public naming contract
status: todo
priority: 1
parent: goal-51
tags: [remote-git, project-memory, naming-audit, public-surface]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-51, goal-50, task-649, test-337]
context_refs: []
evidence_refs: []
aliases: []
skills: [service-boundary-ownership-check, verify-close-and-checkpoint]
cases: []
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

# Results / Evidence

Pending.

# Notes / Follow-ups

- This test does not authorize implementation, publish, push, root bundle
  refresh, downstream repo mutation, or provider mutation.
