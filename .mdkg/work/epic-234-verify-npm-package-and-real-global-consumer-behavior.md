---
id: epic-234
type: epic
title: Verify npm package and real global consumer behavior
status: todo
priority: 1
tags: [release, postpublish, install, verification]
owners: []
links: []
artifacts: []
relates: [goal-64]
blocked_by: []
blocks: []
refs: [task-720, task-721, test-391, test-392]
context_refs: [goal-64, edd-72, dec-69]
evidence_refs: []
aliases: [v0-5-0-postpublish-consumer-proof]
skills: []
created: 2026-07-10
updated: 2026-07-10
---
# Goal

Prove the registry artifact from isolated consumers and the user's actual global
installation before public promotion activates.

# Scope

- Registry version, dist-tag, integrity, and tarball verification.
- Fresh temporary install and `0.4.2` upgrade fixture.
- `/opt/homebrew` global replacement and binary-path proof.
- Init, validate, loop list/fork/plan/next/pack and dry-run ID invariant probes.

# Milestones

- `task-720` / `test-391`: registry and isolated consumers.
- `task-721` / `test-392`: real global installation.

# Out of Scope

Source-checkout-only proof and website activation before consumer success.

# Risks

- PATH can resolve a local checkout instead of the global package.
- Global replacement can fail after npm publication and requires local recovery.

# Links / Artifacts

- `edd-72`
- `dec-69`
- external links
