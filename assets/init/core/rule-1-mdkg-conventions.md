---
id: rule-1
type: rule
title: Graph authoring conventions
tags: [mdkg, guidance]
owners: []
links: []
artifacts: []
relates: []
refs: []
aliases: []
created: 2026-09-09
updated: 2026-09-09
---

# Purpose

Keep project intent and references explicit, portable and reviewable.

# Scope

Authored Markdown is project knowledge; generated indexes are derived views.

# Requirements

- Create nodes using `mdkg new <type> "<title>"` for normal allocation and templates.
- Keep structured graph edges in frontmatter and explanatory detail in the body.
- Legacy graphs use readable IDs. In explicitly adopted v2 graphs, immutable
  graph/node identities back those aliases; filenames and matching aliases alone
  do not establish identity continuity across branches.
- Do not invent or rewrite persisted identities while indexing or formatting.
- Use qualified references when workspace aliases would be ambiguous.
- Prefer `mdkg task ...` for supported structured lifecycle changes.
- Use current templates and schema validation rather than copying stale examples.

# Validation

Run `mdkg validate` after authoring. Missing references or ambiguous identities
require an explicit correction, not silent remapping or deletion.
