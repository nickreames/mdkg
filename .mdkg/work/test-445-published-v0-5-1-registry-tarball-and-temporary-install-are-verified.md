---
id: test-445
type: test
title: Published v0.5.1 registry tarball and temporary install are verified
status: done
priority: 0
epic: epic-251
tags: [release, npm, registry, install]
owners: []
links: [https://www.npmjs.com/package/mdkg/v/0.5.1, https://registry.npmjs.org/mdkg/-/mdkg-0.5.1.tgz]
artifacts: []
relates: []
blocked_by: [task-784]
blocks: [task-785]
refs: [goal-71, task-784]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-14
updated: 2026-07-15
---
# Overview

Prove npm serves the intended immutable package and a clean consumer can use it.

# Target / Scope

Registry metadata/integrity/tarball, temporary installation, resolved binary,
and disposable archive ownership probes.

# Preconditions / Environment

Fetch from registry into a clean temporary directory/cache after publication.

# Test Cases

- npm `latest` and `mdkg@0.5.1` match the approved artifact.
- Integrity and tarball contents are recorded.
- Installed CLI reports 0.5.1 and passes accepted archive command behavior.

# Results / Evidence

Pending immutable registry/install receipt.

# Notes / Follow-ups

- Failures after publication route fix-forward.
