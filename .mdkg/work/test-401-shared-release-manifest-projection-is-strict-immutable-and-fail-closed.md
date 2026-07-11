---
id: test-401
type: test
title: Shared release manifest projection is strict immutable and fail closed
status: done
priority: 1
epic: epic-236
tags: [release, test, goal-63]
owners: []
links: []
artifacts: []
relates: [goal-63]
blocked_by: [task-730]
blocks: [test-407]
refs: [edd-71, dec-73, dec-74, prd-11, prop-8]
context_refs: [goal-63, epic-236, dec-74, prop-8, task-730]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-11
updated: 2026-07-11
---
# Overview

Prove one strict release manifest drives both sites without mutation or a
production escape hatch.

# Target / Scope

`task-730`; manifest schema, visibility projection, package parity, preview
override, production behavior, and build immutability.

# Preconditions / Environment

Temporary copies of valid draft, valid published, invalid schema/state, and
published-version-mismatch manifests; root package remains 0.4.2.

# Test Cases

- Accept exactly schema version 1 plus `draft` or `published`; reject malformed,
  missing, or unknown values.
- Draft without override projects invisible and non-indexable.
- Draft plus local `PUBLIC_MDKG_RELEASE_PREVIEW=1` projects visible but not
  indexable outside production.
- Vercel production plus draft override fails closed.
- Published plus matching package version projects visible and indexable.
- Published plus mismatched package version fails.
- Both sites consume equivalent projection values.
- Hash the manifest before/after every build and prove byte-for-byte equality.

# Results / Evidence

PASS on 2026-07-11.

- Canonical draft projection is invisible, release-non-indexable, and does not
  make the normal existing site noindex.
- Local `PUBLIC_MDKG_RELEASE_PREVIEW=1` is visible but site-wide noindex.
- Vercel production plus a draft release override fails closed.
- Published fixtures require package-version parity; mismatches fail.
- Unknown/missing keys, malformed JSON, invalid states/versions/ids/qualifiers,
  and non-binary release-preview flags fail with actionable errors.
- Manifest SHA-256 and malformed fixture bytes remain unchanged after loading.
- Command: `npm run test:public-release`; result: 8 passed, 0 failed.

# Notes / Follow-ups

- Goal 63 must leave canonical state `draft`; published behavior uses a fixture.
- Goal 64 alone changes canonical state after npm proof.
