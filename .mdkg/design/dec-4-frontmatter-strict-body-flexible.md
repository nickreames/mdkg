---
id: dec-4
type: dec
title: strict frontmatter and flexible body structure
status: accepted
tags: [frontmatter, mdkg, schema]
owners: []
links: []
artifacts: []
relates: []
refs: []
aliases: []
created: 2026-01-06
updated: 2026-01-14
---

# Context

The knowledge graph and search depend on parsing frontmatter reliably. LLM agents may sometimes create malformed structures in document bodies.

We need strictness where it matters and flexibility where it does not.

# Decision

- frontmatter must follow the restricted subset and is strictly validated
- invalid frontmatter breaks indexing by default
- document body structure is guided by templates but not strictly enforced
- validator warns on missing recommended headings but does not break indexing

# Alternatives considered

- enforce full markdown schema with strict headings (reject): too brittle for humans/agents
- allow “best effort” frontmatter parsing (reject): leads to silent corruption of graph

# Consequences

- `mdkg validate` must clearly report frontmatter violations
- `mdkg format` should help repair common frontmatter formatting issues
- templates become important for agent usability

# Links / references

- none
