---
id: test-149
type: test
title: mdkg.dev security no-secret docs audit contract
status: todo
priority: 2
epic: epic-81
parent: goal-15
tags: [security, no-secrets, docs-audit, trust]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-358]
blocks: []
refs: []
aliases: []
skills: []
cases: [no secrets in docs, no local paths in public examples, security posture page exists]
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Validate that mdkg.dev security and trust docs avoid secrets, unsafe examples,
and misleading claims about local project memory boundaries.

# Target / Scope

- `task-358`
- public docs and examples
- release/trust posture checklists

# Preconditions / Environment

- Public docs source available.
- Generated command docs and examples are current enough to audit.

# Test Cases

- Scan docs for raw tokens, auth headers, passwords, private keys, cookies, and
  session identifiers.
- Review docs for raw local paths, registry tokens, or temp proof paths that
  should be sanitized.
- Assert public claims match shipped CLI behavior and command metadata.
- Confirm internal-only DB helper surfaces are not documented as public CLI.

# Results / Evidence

- Pending.

# Notes / Follow-ups

- This is a docs/trust gate, not a substitute for code security review.
