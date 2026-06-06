---
id: chk-44
type: checkpoint
title: SPEC template surface audit
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [.mdkg/templates/specs, .mdkg/templates/default/spec.md]
relates: [task-266]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-266]
created: 2026-06-06
updated: 2026-06-06
---
# Summary

`task-266` completed the current SPEC template and default scaffold audit for
`goal-8`. The repository has a rich canonical SPEC template family under
`.mdkg/templates/specs`, while `mdkg new spec` still uses the smaller default
`SPEC.md` scaffold.

# Scope Covered

- Listed the current `.mdkg/templates/specs/*.SPEC.md` family.
- Compared the specialized `base.SPEC.md` contract against
  `.mdkg/templates/default/spec.md`.
- Checked current SPEC discovery, capability indexing, and validation behavior.
- Verified no source implementation files were changed.

# Decisions Captured

- `task-267` should define the required and optional section semantics before
  implementation work starts.
- `task-268` should resolve frontmatter/template compatibility, including
  placeholder naming and template-family expansion policy.
- Fresh-init seeding of the richer SPEC template family remains a later design
  and implementation decision.

# Implementation Summary

No runtime implementation changed. The durable change is graph evidence: the
audit findings were recorded in `task-266`, and `goal-8` was advanced to
`task-267` as the next concrete design node.

# Verification / Testing

- `node dist/cli.js validate`
- `node dist/cli.js goal next goal-8 --json`
- `node dist/cli.js capability search "SPEC template taxonomy" --json`

# Known Issues / Follow-ups

- The default `SPEC.md` scaffold is intentionally smaller than the richer
  template family today.
- The current validator only recommends the older four SPEC headings; goal-8
  will define the richer diagnostic contract before source changes.
- `capability list --kind spec` currently returns zero concrete repo SPEC
  records; SPEC design remains discoverable through design docs and skills.

# Links / Artifacts

- `goal-8`
- `task-266`
- `.mdkg/templates/specs`
- `.mdkg/templates/default/spec.md`
