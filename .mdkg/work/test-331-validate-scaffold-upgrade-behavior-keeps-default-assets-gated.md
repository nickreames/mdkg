---
id: test-331
type: test
title: validate scaffold upgrade behavior keeps default assets gated
status: done
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

Pass for the planning contract.

- `task-634` requires validator/schema support before CLI flags, scaffold
  output, docs, generated references, or seed/default assets change.
- `task-634` classifies future `mdkg new` and `mdkg work` flags as optional
  and gated behind validator fixtures.
- `task-634` preserves current `mdkg upgrade` semantics: dry-run first,
  explicit `--apply`, `safe_to_apply`, `will_write_paths`,
  `preserved_customizations`, `blocking_conflicts`, and `apply_side_effects`.
- `task-634` states that `.mdkg/templates/default`, `dist/init`,
  `assets/init`, and `assets/init/skills/default` changes require a later
  explicit blast-radius approval with fresh init, customized repo, and skill
  mirror coverage.
- This planning pass did not edit source, public docs, package files,
  generated docs, templates, init assets, default skills, or downstream repos.

# Notes / Follow-ups

- A later implementation goal must run `mdkg upgrade --dry-run --json` and any
  authorized `--apply` proof in temp repos before changing managed assets.
