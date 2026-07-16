---
id: bug-3
type: bug
title: reject secret-like values from materialization receipt references
status: done
priority: 1
parent: goal-66
prev: test-452
next: test-453
tags: [goal-66, security, materialization, receipt, redaction, cwe-200, 0.5.2]
owners: []
links: []
artifacts: []
relates: [task-747, task-749]
blocked_by: [test-452]
blocks: [test-453]
refs: [test-453, test-450, goal-67, edd-73, dec-62, dec-64, dec-77]
context_refs: [chk-530]
evidence_refs: [chk-530]
aliases: [materialization-receipt-opaque-ref-safety]
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-15
updated: 2026-07-15
---
# Overview

The partial Goal-66 scan validated that `source_ref`, `access_ref`,
`correlation_ref`, and `evidence_refs` accept credential-shaped bare values
and are copied verbatim into JSON receipts. Existing URL userinfo and sensitive
query-key checks do not protect opaque non-URL values.

No real credential was used. An inert marker proved the byte-preserving request
to receipt path. This violates the accepted refs-only and credential-safety
decisions and blocks release.

# Reproduction Steps

1. Submit a valid local materialization request with an inert
   credential-shaped marker in each generic ref field.
2. Run the real CLI with `--json`.
3. Observe the marker in all four receipt locations.
4. Use a sensitive URL-query form as a negative control and observe rejection.

# Expected vs Actual

- expected: generic refs follow one documented opaque non-secret grammar and
  credential-shaped values fail before Git or are irreversibly redacted before
  receipt persistence.
- actual: accepted bare values are copied unchanged into stdout receipts.

# Suspected Cause

`assertBoundedRef` checks length, whitespace, option shape, URL userinfo, and
sensitive URL query keys. It does not enforce the existing design decisions
that raw credential-shaped values are errors. `receiptForRequest` then copies
the accepted values without a second output control.

# Fix Plan

- Define one canonical opaque-ref validator for the four receipt-bound fields.
- Preserve legitimate stable ids such as catalog, policy, run, and evidence
  refs while rejecting credential-shaped prefixes, assignments, bearer/JWT
  forms, key material, control characters, URLs with credential data, and other
  values prohibited by `dec-62`, `dec-64`, and `edd-73`.
- Reject before Git; do not attempt heuristic output masking that can preserve
  recoverable secret fragments.
- Keep request/receipt schema names and field names backward compatible.
- Align public docs with the precise safe opaque-ref grammar.

# Test Plan

- Complete `test-453`.
- Cover every generic ref field with inert positive and negative fixtures.
- Prove no rejected marker reaches success or failure receipts.
- Re-run focused tests, full tests, consumer smoke, docs checks, and the fresh
  security diff scan required by `test-450`.

# Implementation Evidence

- Added one `assertOpaqueNonSecretRef` path for all four receipt-bound ref
  fields while leaving repository-ref transport validation separate.
- Assignment forms and recognizable bearer, token, API-key, private-key,
  cloud-key, and JWT shapes now fail before Git and receipt creation.
- Safe catalog, policy, run, evidence, and graph refs remain byte-preserving.
- Focused materialization suite: 17/17 passed.
- Consumer smoke, docs check, built-in security verification, and
  `git diff --check` passed on 2026-07-15.

# Links / Artifacts

- Partial scan: `4956a227-c1c0-4309-98d0-1e65687fab71`
- Candidate: `git-materialize-receipt-ref-leak-002`
- Durable evidence summary and hashes: `chk-530`
