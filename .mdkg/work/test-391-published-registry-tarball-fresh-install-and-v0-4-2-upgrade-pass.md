---
id: test-391
type: test
title: Published registry tarball fresh install and v0.4.2 upgrade pass
status: done
priority: 1
epic: epic-234
tags: [release, registry, tarball, upgrade]
owners: []
links: []
artifacts: [artifact://npm/mdkg/0.5.0]
relates: [goal-64, task-720]
blocked_by: [task-720]
blocks: []
refs: [task-720, chk-513, chk-514]
context_refs: [goal-64, epic-234, edd-72, dec-69]
evidence_refs: [chk-513, chk-514]
aliases: []
skills: []
cases: []
created: 2026-07-10
updated: 2026-07-13
---
# Overview

Use registry-fetched bytes to prove package integrity, clean install behavior,
and compatibility upgrading from the current 0.4.2 release.

# Target / Scope

Registry/latest/integrity, tarball payload, init/validate, upgrade, loop payload.

# Preconditions / Environment

Clean temporary global prefix/workspace and preserved 0.4.2 fixture.

# Test Cases

- Verify registry version, dist-tag, integrity, and expected files.
- Fresh install init/validate/list/fork/plan/next/pack.
- Upgrade dry-run/apply/idempotence preserving legacy and loop data.
- Execute installed absolute path, not checkout binary.

# Results / Evidence

Passed against registry-fetched `mdkg@0.5.0` using the installed absolute
binary. Version, `latest`, SHA-1, integrity, and tarball URL matched `chk-513`.
The package contained all seven seeds, default loop template, loop skill,
generated CLI docs, command contract, and SQLite implementation. Fresh init,
index, validate, list, fork dry-run/real, plan, next, and pack passed. Upgrade
dry-run/apply/idempotence passed with zero conflicts and preserved goal, loop,
and canonical MANIFEST hashes. Canonical migration and the legacy SPEC alias
both passed. See `chk-514` for the full sanitized receipt.

# Notes / Follow-ups

- Consumer failure triggers fix-forward, not unpublish.
- Five generated-child heading advisories and one intentional legacy SPEC
  deprecation warning were observed; all relevant validations had zero errors.
