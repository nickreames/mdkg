---
id: epic-231
type: epic
title: Define release information architecture activation and implementation handoff
status: done
priority: 1
tags: [release, information-architecture, activation, handoff]
owners: []
links: []
artifacts: []
relates: [goal-62, goal-63]
blocked_by: []
blocks: []
refs: [task-714, task-715, test-386, test-387, dec-74, prop-8, chk-436, chk-437, chk-438, chk-439, chk-440]
context_refs: [goal-62, goal-63, edd-71, dec-68, prd-11]
evidence_refs: [chk-436, chk-437, chk-438, chk-439, chk-440]
aliases: [v0-5-0-release-ia-and-handoff]
skills: []
created: 2026-07-10
updated: 2026-07-11
---
# Goal

Turn accepted capability, message, and design choices into a complete local
implementation goal with deterministic dormant activation.

# Scope

- Homepage, docs guide, CLI examples, upgrade, and release-note IA.
- Accessibility, SEO, public-alpha, responsive, and no-secret requirements.
- One source-controlled draft/published activation contract.
- Accepted EDD/DEC/PRD and fully scoped `goal-63`.

# Milestones

- `task-714` / `test-386`: IA and activation contract.
- `task-715` / `test-387`: accepted records and implementation handoff.

# Out of Scope

Source edits, builds, pushes, deployments, DNS, and analytics activation.

# Risks

- A vague handoff would force Goal 3 to make design decisions.
- Activation logic can become unnecessary release-framework complexity.

# Links / Artifacts

- `goal-63`
- `prd-11`
- external links

# Completion

The exact IA, copy, dormant activation, accessibility/SEO, and implementation
handoff are accepted in `dec-74` / `prop-8`. Goal 63 is fully populated and
validated through `task-714`, `task-715`, `test-386`, `test-387`, and
`chk-436` through `chk-440`.
