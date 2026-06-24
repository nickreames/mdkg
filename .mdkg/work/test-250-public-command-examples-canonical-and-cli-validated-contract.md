---
id: test-250
type: test
title: public command examples canonical and CLI-validated contract
status: done
priority: 1
epic: epic-166
parent: goal-33
tags: [commands, docs, pass-3]
owners: []
links: []
artifacts: []
relates: [goal-33, task-521, task-529]
blocked_by: [task-521]
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: [help-contract-validation, beginner-command-forms, code-block-linebreaks]
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Verify public command examples are correct, canonical, and readable.

# Test Cases

- Examples are checked against `mdkg help`, command contract, or focused CLI execution.
- Beginner pages prefer canonical safe forms.
- Advanced variants are limited to reference docs.
- Command blocks preserve multi-line formatting.
- Pass-3 smoke fails if representative examples drift.
