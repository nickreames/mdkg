---
id: task-590
type: task
title: hand off MANIFEST migration to runtime coding agent
status: done
priority: 1
parent: goal-40
tags: [manifest, runtime, handoff, capabilities, upgrade]
owners: []
links: []
artifacts: [.mdkg/handoffs/runtime-manifest-0-3-8-upgrade-megaprompt.md]
relates: []
blocked_by: []
blocks: []
refs: [goal-37, dec-50, edd-54, task-592]
context_refs: [goal-37, dec-50, edd-54, task-592]
evidence_refs: []
aliases: [runtime-manifest-migration-handoff, manifest-upgrade-megaprompt, runtime-spec-to-manifest]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-06-26
updated: 2026-06-26
---
# Overview

Create a copy-ready handoff megaprompt for a runtime coding agent that will
ingest mdkg's canonical `MANIFEST.md` capability surface after the `0.3.8`
upgrade migration is fixed and published.

# Acceptance Criteria

- Handoff identifies `mdkg@0.3.8` as the prerequisite published package.
- Handoff blocks downstream migration until `mdkg upgrade` safely renames
  `SPEC.md` to `MANIFEST.md`.
- Handoff covers runtime fixture migration, internal type/copy renames,
  manifest command usage, capability discovery, and validation gates.
- Handoff keeps legacy SPEC compatibility tests separate from product fixture
  migration.
- Handoff includes strict raw-content and no-downstream-mutation boundaries.

# Files Affected

- `.mdkg/handoffs/runtime-manifest-0-3-8-upgrade-megaprompt.md`
- mdkg graph evidence only

# Implementation Notes

- Build on `chk-278` and `task-584`, but update the prompt with the new
  release-blocking discovery that `mdkg upgrade` must actually rename legacy
  SPEC files before downstream runtime adoption begins.
- Keep the handoff usable for `/Users/nick/omni-chat-rooms/projects/omni-room-runtime`
  while making the repo path easy to adapt.

# Test Plan

- Read the handoff for explicit prerequisites, boundaries, implementation
  sequence, and verification commands.
- `node dist/cli.js validate --changed-only --json`
- `git diff --check`

# Results / Evidence

- Created `.mdkg/handoffs/runtime-manifest-0-3-8-upgrade-megaprompt.md`.
- The handoff names `mdkg@0.3.8` as the prerequisite published package.
- The handoff blocks downstream migration until `mdkg upgrade` proves safe
  `SPEC.md` to `MANIFEST.md` rename behavior.
- The handoff covers runtime fixture migration, internal type/copy renames,
  manifest commands, capability discovery, validation gates, and raw-content
  boundaries.
- `node dist/cli.js goal next goal-40 --json` now routes to `task-592`, so the
  remaining work starts with the upgrade migration blocker instead of the
  completed handoff task.

# Links / Artifacts

- `.mdkg/handoffs/runtime-manifest-0-3-8-upgrade-megaprompt.md`
- `chk-278`
- `task-584`
- `task-592`
