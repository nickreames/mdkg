---
id: dec-52
type: dec
title: arbitrary skill mirror paths are supported with defaults preserved
status: accepted
tags: [0.3.9, skills, mirrors, config]
owners: []
links: []
artifacts: [src/commands/skill_mirror.ts, src/commands/init.ts, .mdkg/skills]
relates: []
refs: [dec-18, dec-19, edd-56]
aliases: []
created: 2026-06-26
updated: 2026-06-26
---
# Context

mdkg currently mirrors canonical `.mdkg/skills/` into hard-coded product
surfaces such as `.agents/skills/` and `.claude/skills/`. Companies and local
agent runtimes need other skill directories without waiting for mdkg to add a
named first-class product surface for each runtime.

# Decision

Support arbitrary configured skill mirror target paths. Keep `.agents/skills/`
and `.claude/skills/` as default mirror targets for `init --agent`, but do not
require custom targets to be named agent surfaces with wrapper docs or
product-specific metadata.

# Alternatives considered

- Named agent surfaces: richer metadata, but higher schema and docs burden than
  the immediate need.
- Hard-coded products only: preserves current simplicity but blocks local agent
  directories and company-specific runtimes.

# Consequences

- Config schema and skill mirror commands need a path-list model.
- Mirror sync/audit/prune commands must remain safe for arbitrary local paths.
- Default `.agents` and `.claude` behavior remains backward compatible.

# Links / references

- `goal-41`
- `task-596`
- `test-303`
