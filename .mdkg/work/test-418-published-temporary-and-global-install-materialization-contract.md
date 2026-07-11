---
id: test-418
type: test
title: published temporary and global install materialization contract
status: todo
priority: 1
parent: goal-67
tags: [goal-67, test, publish, install]
owners: []
links: []
artifacts: []
relates: [task-756]
blocked_by: [task-756]
blocks: []
refs: [goal-67]
context_refs: [goal-66]
evidence_refs: []
aliases: [published-materialize-install-test]
skills: []
cases: [registry-integrity, temp-install, global-install, materialize-success, materialize-failure, clone-compatibility]
created: 2026-07-11
updated: 2026-07-11
---

# Overview

Prove registry integrity and real installed-package behavior after publication.

# Target / Scope

- Npm metadata, clean temp install, real global install.

# Preconditions / Environment

- Approved publication completed successfully.

# Test Cases

- Registry version, dist-tag, integrity/shasum, and publish time agree.
- Temp/global versions and help match.
- Positive local bare and representative failure receipts pass.
- Clone compatibility and no-push remain intact.

# Results / Evidence

- Pending release execution.

# Notes / Follow-ups

- Fix forward after publication.
