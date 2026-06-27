---
id: test-306
type: test
title: 0.3.9 publish dry run readiness contract
status: done
priority: 1
epic: epic-201
parent: goal-41
tags: [0.3.9, publish-readiness, prepublish, test]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-600, test-302, test-303, test-304, test-305]
blocks: []
refs: [task-600, test-302, test-303, test-304, test-305]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-06-26
updated: 2026-06-27
---
# Overview

Validate the full `0.3.9` change audit, dry-run publish readiness ladder, and
explicit approval boundary.

# Target / Scope

`task-600` and all `goal-41` implementation/test nodes.

# Preconditions / Environment

All prerequisite `0.3.9` tasks/tests are done.

# Test Cases

- Build/test/CLI/docs gates pass.
- Git/changelog audit maps every publish-bound change to release notes, version
  references, tests, docs, and package payload.
- Registry checks prove whether `0.3.9` is available and what npm currently
  reports as latest.
- Package pack dry-run succeeds.
- Publish dry-run succeeds with isolated cache.
- mdkg validation passes and accepted warnings are recorded.
- No real publish, tag, push, deploy, or downstream mutation occurs.
- Final recommendation says either `publish ready pending explicit approval` or
  lists exact remaining gaps.

# Results / Evidence

Passed.

- Build/test/CLI/docs gates passed through individual runs and through
  `npm publish --dry-run`.
- Registry checks showed npm latest at `0.3.8` and `mdkg@0.3.9` unavailable
  with npm `E404`.
- `npm pack --dry-run --json` produced `mdkg-0.3.9.tgz` with 176 files and all
  required runtime/init/release docs present.
- `npm publish --dry-run --registry=https://registry.npmjs.org/` passed with
  isolated cache and ended with `+ mdkg@0.3.9`.
- Full validation passed with one accepted legacy `SPEC.md` compatibility
  warning; changed-only validation had 0 warnings and 0 errors.
- No real publish, tag, push, deploy, or downstream mutation occurred.
- Final recommendation: publish ready pending explicit approval.

# Notes / Follow-ups

- This is a readiness contract, not authorization to publish.
