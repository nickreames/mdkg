---
id: task-784
type: task
title: Publish mdkg v0.5.1 and verify registry tarball and clean install
status: done
priority: 0
epic: epic-251
tags: [release, npm, registry, install]
owners: []
links: [https://www.npmjs.com/package/mdkg/v/0.5.1, https://registry.npmjs.org/mdkg/-/mdkg-0.5.1.tgz]
artifacts: []
relates: []
blocked_by: [task-783, test-444]
blocks: [task-785]
refs: [goal-71, edd-77, dec-83]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-14
updated: 2026-07-15
---
# Overview

Publish the approved exact release candidate once and independently verify the
registry artifact in a clean temporary consumer.

# Acceptance Criteria

- Auth and registry preconditions pass before publication.
- npm `latest`, metadata, integrity, and tarball contents prove 0.5.1.
- A registry-fetched temporary install resolves the intended binary and passes
  archive help, qid, `--all --ws`, and disposable ownership probes.
- Any post-publication defect is routed fix-forward.

# Files Affected

List files/directories expected to change.

- Release evidence/checkpoint nodes only after publication.

# Implementation Notes

- Do not substitute local `npm pack` output for registry-fetched validation.
- Never unpublish or roll back.

# Test Plan

Close `test-445` with npm metadata, integrity, tarball, install, and CLI receipts.

# Links / Artifacts

- `dec-83`
