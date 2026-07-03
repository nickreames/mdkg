---
id: test-331
type: test
title: validate scaffold upgrade behavior keeps default assets gated
status: todo
priority: 1
tags: [goal-48, upgrade, scaffold]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-48]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-02
updated: 2026-07-02
---
# Overview

Validate that any future scaffold or upgrade behavior for contract profiles is
explicit, previewable, customization-preserving, and gated for seed/default
assets.

# Target / Scope

- `task-634`
- `mdkg new manifest|work|work_order|receipt`
- `mdkg work contract/order/receipt`
- `mdkg upgrade --dry-run --json` and optional later `--apply`.

# Preconditions / Environment

- `task-634` defines accepted scaffold and upgrade behavior.
- A later execution pass authorizes test fixture or temp-repo changes.

# Test Cases

- New scaffolds include only accepted generic fields and do not imply runtime
  Omni Room policy.
- Upgrade dry-run reports intended changes without mutation.
- Upgrade apply preserves customized docs/templates/skills/core files.
- Seed/default template and `assets/init/skills/default` changes are absent
  unless explicitly authorized by the accepted plan.
- Generated command/docs references are refreshed only after source behavior is
  proven.

# Results / Evidence

Pending. This test is intentionally todo with the seeded planning goal.

# Notes / Follow-ups

- Keep seed/default edits out of scope until a later explicit mdkg-owned goal.
