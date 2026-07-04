---
id: task-648
type: task
title: prepare downstream-private contract-profile consumer handoff
status: blocked
priority: 1
parent: goal-50
tags: [0.4.1, handoff, consumer-boundary, downstream-private]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-647]
blocks: [test-336]
refs: [task-635, task-647]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-07-02
updated: 2026-07-03
---
# Overview

Prepare a downstream-private consumer handoff that cites the actual released
package version and post-publish evidence without mutating downstream repos or
making consumer-specific runtime policy part of mdkg public behavior.

# Acceptance Criteria

- Handoff cites `mdkg@0.4.1`, npm registry/dist-tag evidence, temp install
  evidence, workflow probes, and upgrade probes.
- Handoff states what is now stable generic mdkg behavior and what remains
  downstream runtime-owned.
- If a downstream consumer is product-specific, the handoff names it only as
  downstream-private context, not mdkg public feature branding.
- Handoff does not hardcode unreleased fields or require local source behavior.
- No downstream consumer, root, sandbox, backend, deploy, provider, or DNS
  mutation occurs.

# Files Affected

- mdkg handoff/checkpoint evidence only.

# Implementation Notes

- Downstream adoption should remain a separate repo-owned goal.
- Stable handoff language must cite post-publish evidence, not dry-run output.

# Test Plan

- handoff reviewed for version, registry, temp install, and runtime-boundary
  evidence
- `node dist/cli.js validate --changed-only --json`

# Links / Artifacts

- `task-635`
- `task-647`
