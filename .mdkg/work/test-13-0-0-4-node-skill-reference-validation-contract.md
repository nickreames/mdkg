---
id: test-13
type: test
title: 0.0.4 node skill reference validation contract
status: done
priority: 1
epic: epic-4
tags: [v0_4, skills, validation]
owners: []
links: []
artifacts: [cmd:npm_run_test_ok_2026_03_05, cmd:node_dist_cli_validate_ok_2026_03_05]
relates: [prd-1, dec-8, dec-9, edd-2, edd-3, edd-5, task-42, implement-2]
blocked_by: []
blocks: []
refs: []
aliases: []
cases: [node-skills-field-schema, dangling-skill-reference, validation-severity]
created: 2026-02-27
updated: 2026-03-05
---

# Overview

Validate planned 0.0.4 schema and cross-validation behavior for node `skills: [...]` references.

# Target / Scope

Covers parser/schema compatibility for `skills` fields on work-item nodes and cross-validation against indexed skill slugs.

# Preconditions / Environment

- implementation supports node `skills` field in templates/schema/parser
- skill index fixtures exist and are loaded
- validation command includes node-skill cross-check pass

# Test Cases

- Verify valid node `skills` fields parse and index correctly.
- Verify dangling skill references are reported deterministically.
- Verify severity behavior (error/warning) follows documented contract.

# Results / Evidence

Capture validation outputs, failing/valid fixture sets, and deterministic error ordering.

# Notes / Follow-ups

- Add stress tests for large numbers of node->skill references.
- Add compatibility tests for legacy nodes without `skills` fields.
