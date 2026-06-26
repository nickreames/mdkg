---
id: epic-198
type: epic
title: verify MANIFEST compatibility release gates and downstream handoff
status: todo
priority: 1
tags: [manifest, release, verification, downstream, handoff]
owners: []
links: []
artifacts: []
relates: [goal-37, edd-54, dec-50]
blocked_by: [epic-197]
blocks: [task-582, task-583, task-584, test-296]
refs: [edd-54]
context_refs: []
evidence_refs: []
aliases: [manifest-release-gates, manifest-downstream-handoff, spec-legacy-window-closeout]
skills: []
created: 2026-06-25
updated: 2026-06-25
---
# Goal

Prove the manifest compatibility bridge is release-ready locally and document
the downstream runtime migration path without mutating downstream repos.

# Scope

- Canonical and legacy fixture suites.
- Focused and full regression gates.
- Checkpoint and local commit.
- Downstream runtime handoff for `RoomSpecRef`, `SpecDocument`, fixtures, and
  `SPEC-driven` language.

# Milestones

- `task-582`: canonical and legacy fixtures.
- `task-583`: full gates, checkpoint, and local commit.
- `task-584`: downstream migration handoff.
- `test-296`: release gate contract.

# Out of Scope

- No push, npm publish, tag, or live deployment.
- No downstream source mutation.
- No removal of legacy fixtures in the compatibility release.

# Risks

- Full gates may be expensive because the rename touches generated docs,
  example indexes, and package readiness checks.
- Downstream runtime teams may rename internal types before mdkg compatibility
  is shipped; the handoff must mark mdkg as the prerequisite.

# Links / Artifacts

- `goal-37`
- `edd-54`
- external links
