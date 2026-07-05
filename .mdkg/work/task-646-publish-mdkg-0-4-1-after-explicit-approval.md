---
id: task-646
type: task
title: publish mdkg 0.4.1 after explicit approval
status: done
priority: 1
parent: goal-50
tags: [0.4.1, npm, publish, approval-gated]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [task-647]
refs: [task-645]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-07-02
updated: 2026-07-04
---
# Overview

Publish `mdkg@0.4.1` to npm only after explicit user approval and fresh
registry/auth preflight checks.

# Acceptance Criteria

- User approval for real publish is present in the active execution turn.
- Registry still shows latest below `0.4.1` and `mdkg@0.4.1` unpublished.
- Temporary npm userconfig references `${NPM_TOKEN}` literally when token auth
  is used; no token value is printed or committed.
- `npm whoami` succeeds with the publish userconfig.
- Real `npm publish` succeeds and the receipt is recorded.
- Git push/tag work remains separately approval-gated.

# Files Affected

- Temporary npm config under `/private/tmp`.
- mdkg checkpoint/evidence.

# Implementation Notes

- Do not use unsupported `always-auth`.
- If npm reports 2FA, token policy, permission, or registry errors, stop and
  record the blocker.

# Test Plan

- `npm whoami --registry=https://registry.npmjs.org/ --userconfig=/private/tmp/mdkg-npm-publish.npmrc`
- registry checks immediately before publish
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --registry=https://registry.npmjs.org/ --userconfig=/private/tmp/mdkg-npm-publish.npmrc`

# Links / Artifacts

- `task-645`
