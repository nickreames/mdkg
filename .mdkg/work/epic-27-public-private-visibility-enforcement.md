---
id: epic-27
type: epic
title: public private visibility enforcement
status: done
priority: 2
tags: [future, visibility, privacy, pack, bundle, archive]
owners: []
links: [task-144, task-145, task-146, task-147, test-84, chk-25]
artifacts: [npm run test, npm run smoke:visibility, npm publish --dry-run]
relates: [epic-19, epic-22, epic-23, epic-24]
blocked_by: []
blocks: [epic-22, epic-23, epic-24]
refs: [rule-4, edd-3, edd-8]
aliases: [visibility-enforcement, public-private-filtering]
skills: []
created: 2026-05-17
updated: 2026-05-18
---

# Goal

Enforce public/private visibility filtering across pack, bundle, archive, and
future import behavior.

# Scope

`private` is the default posture. `public` marks content that can be included in
external bundles, user-facing work orders, receipts, or outputs when appropriate.

This is an mdkg command and bundle safety layer, not an OS-level secret manager.

# Milestones

- Define public/private metadata for archive sidecars, snapshot bundles, and
  imported read-only graph sources.
- Keep private records out of public bundles and public/user-facing output by
  default.
- Require explicit operator intent for including private content in packs or
  exports.
- Add validation and doctor diagnostics for missing visibility metadata where
  bundle or archive policies require it.
- Preserve compatibility with existing workspace capability visibility metadata.

# Closeout

Implemented as part of the unreleased `mdkg@0.1.4` package. The shared
visibility policy now covers workspace records, archive sidecars, and imported
bundle records. Public/internal pack and bundle outputs fail closed on
less-visible refs, while default private-capable local behavior remains
unchanged.

Verification passed with the full prepublish dry-run gate, including unit tests,
command matrix checks, local graph validation, all existing packed-package
smokes, and the new visibility smoke.

# Out of Scope

- No credential or secret management.
- No hosted policy service.
- No guarantee that git history or external systems enforce mdkg visibility.

# Risks

- Visibility metadata can be oversold as a hard security boundary.
- Public export filters must be conservative to avoid accidental leakage.
- Private-local bundle workflows need clear labeling to prevent accidental
  public publication.

# Links / Artifacts

- `epic-22`
- `epic-23`
- `epic-24`
- `task-144`
- `task-145`
- `task-146`
- `task-147`
- `test-84`
- `chk-25`
