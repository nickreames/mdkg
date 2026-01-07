---
id: task-4
type: task
title: implement strict frontmatter parser and node model
status: done
priority: 1
epic: epic-1
tags: [frontmatter, parser, schema]
links: [frontmatter:restricted, validate:required-fields]
artifacts: [frontmatter-parser, node-model, edges-normalization]
relates: [rule-1, rule-6, dec-4]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-06
updated: 2026-01-06
---

# Overview

Implement a strict frontmatter parser for the restricted subset and a node model representing parsed nodes and edges.

# Acceptance Criteria

- strict parsing of frontmatter boundaries (`---` ... `---`)
- strict key/value parsing; no nested objects or multiline values
- list parsing supports `[a, b, c]`
- required fields enforced per type (rule-6)
- node model includes normalized fields and edge lists
- body extraction excludes frontmatter cleanly

# Files Affected

- src/graph/frontmatter.ts
- src/graph/node.ts
- src/graph/edges.ts

# Implementation Notes

- Parse frontmatter as raw lines and implement minimal value parsing.
- Enforce lowercase key names; normalize enums to lowercase.
- Keep error messages specific: file path + line number when possible.

# Test Plan

- parse a valid task template output successfully
- fail on missing closing `---`
- fail on invalid list syntax

# Links / Artifacts

- rule-1, rule-6
- dec-4 (strict frontmatter)
