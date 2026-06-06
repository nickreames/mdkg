---
id: epic-47
type: epic
title: SPEC template layout naming and example corpus
status: done
priority: 1
tags: [spec, templates, examples, naming]
owners: []
links: []
artifacts: [.mdkg/templates/specs]
relates: [goal-8, task-269, task-270, test-100]
blocked_by: [epic-46]
blocks: [task-269, task-270, test-100]
refs: [edd-14, dec-23, dec-24]
aliases: [spec-template-layout, spec-example-corpus]
skills: [author-mdkg-skill]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Define where SPEC templates and example fixtures live, how they are named, and
which example families must exist before source implementation begins.

# Goal

Make the SPEC template and example corpus complete enough for future validator
and upgrade work.

# Scope

- Template layout and naming.
- Generic example fixture families.
- Positive and negative example requirements.

# Milestones

- Complete `task-269`, `task-270`, and `test-100`.

# Acceptance Criteria

- Template naming is generic and stable.
- Example fixtures cover the initial template taxonomy.
- Templates and examples separate canonical mdkg language from downstream
  product-specific extensions.

# Out of Scope

- Adding full example fixture files unless a later task explicitly selects that
  implementation.

# Risks

- Template names become product-specific or too narrow for open-source reuse.

# Closeout Evidence

- `task-269` and `task-270` are done.
- `test-100` is done and records template taxonomy and example fixture
  validation evidence.
- `chk-47` and `chk-48` record the template taxonomy and fixture coverage
  closeout summaries.
- `node dist/cli.js capability search "SPEC template taxonomy" --json` and
  `node dist/cli.js capability search "SPEC example fixtures" --json` resolve
  `edd-14`.
- Full source fixture generation remains deferred to a future implementation
  goal.

# Links / Artifacts

- `goal-8`
- `.mdkg/templates/specs`
