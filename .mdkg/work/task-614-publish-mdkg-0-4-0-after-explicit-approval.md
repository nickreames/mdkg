---
id: task-614
type: task
title: publish mdkg 0.4.0 after explicit approval
status: todo
priority: 1
epic: epic-204
parent: goal-42
tags: [0.4.0, npm, publish, approval, release]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-613, test-317]
blocks: [task-615, task-606, test-312]
refs: [task-613, test-317, task-606, test-312]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-27
updated: 2026-06-27
---
# Overview

Publish `mdkg@0.4.0` to npm only after the dry-run contract passes and the user
explicitly approves the real publish side effect.

# Acceptance Criteria

- The execution starts by re-checking git cleanliness, package version, npm
  latest, and `mdkg@0.4.0` availability.
- The user explicitly approves real npm publish in the execution turn.
- Publish uses `/private/tmp/mdkg-npm-publish.npmrc` with a literal
  `${NPM_TOKEN}` reference and never prints the token.
- `npm publish --registry=https://registry.npmjs.org/ --userconfig=/private/tmp/mdkg-npm-publish.npmrc`
  succeeds once and only once.
- No git tag, push, deploy, DNS, analytics, or Vercel mutation happens in this
  task unless separately approved.

# Files Affected

- npm registry side effect after explicit approval
- mdkg publish evidence/checkpoint

# Implementation Notes

- This node must remain blocked until `test-317` passes.
- Abort if npm registry state changes and `mdkg@0.4.0` is already published.
- If publish succeeds, immediately proceed to `task-615`; do not claim website
  launch readiness from publish alone.

# Test Plan

- npm registry preflight immediately before publish
- `npm whoami --userconfig=/private/tmp/mdkg-npm-publish.npmrc`
- real `npm publish` only after explicit approval
- publish receipt with package version, registry, and commit SHA

# Links / Artifacts

- `task-613`
- `test-317`
- `task-615`
