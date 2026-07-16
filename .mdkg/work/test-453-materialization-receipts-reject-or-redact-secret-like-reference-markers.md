---
id: test-453
type: test
title: materialization receipts reject or redact secret-like reference markers
status: done
priority: 1
parent: goal-66
prev: bug-3
next: task-791
tags: [goal-66, test, security, materialization, receipt, redaction, 0.5.2]
owners: []
links: []
artifacts: []
relates: [bug-3, task-747, task-749]
blocked_by: [bug-3]
blocks: [task-791]
refs: [bug-3, test-450, goal-67, dec-62, dec-64, dec-77]
context_refs: [chk-530]
evidence_refs: [chk-530]
aliases: [materialization-receipt-ref-redaction-regression]
skills: [verify-close-and-checkpoint]
cases: [source-ref, access-ref, correlation-ref, evidence-refs, url-controls, receipt-output, accepted-opaque-refs]
created: 2026-07-15
updated: 2026-07-15
---
# Overview

Prove that all receipt-bound request refs remain opaque non-secret identifiers
and that credential-shaped values cannot be persisted through either success or
failure receipts.

# Target / Scope

- `bug-3`
- Request validation and receipt serialization.
- Public docs and packed-consumer behavior.

# Preconditions / Environment

- Use inert marker fixtures only; never use real credentials.
- Use a local Git source and contained temporary destination.
- Capture only bounded assertion results, not raw fixture payloads, in durable
  graph evidence.

# Test Cases

- Reject credential-shaped bare values independently in `source_ref`,
  `access_ref`, `correlation_ref`, and every `evidence_refs` element.
- Reject URL userinfo, sensitive query keys, bearer/JWT shapes, assignment
  forms, and key-material markers before Git.
- Accept documented opaque ids used by the public examples and downstream
  callers.
- Prove rejected values do not appear in JSON or human receipts.
- Prove successful receipts preserve safe refs exactly and remain bounded.

# Results / Evidence

- Each of `source_ref`, `access_ref`, `correlation_ref`, and `evidence_refs`
  rejected eight independently generated inert credential-shaped forms.
- Rejections returned `invalid_request`, did not invoke Git, and did not echo
  the rejected runtime value in JSON or stderr.
- Documented namespaced catalog, policy, run, evidence, and graph refs were
  preserved exactly in a successful receipt.
- Focused materialization tests passed 17/17; packed-consumer smoke,
  `npm run docs:check`, `npm run security:verify`, and `git diff --check`
  passed.

# Notes / Follow-ups

- Any raw credential-shaped marker in output keeps `test-450` blocked.
