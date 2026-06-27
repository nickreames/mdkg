---
id: task-608
type: task
title: publish mdkg 0.3.9 to npm after auth and registry preflight
status: todo
priority: 1
parent: goal-43
tags: [release, 0.3.9, npm, publish]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-607]
blocks: [test-313]
refs: [goal-43, task-607]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-27
updated: 2026-06-27
---
# Overview

Publish `mdkg@0.3.9` to npm after auth and registry preflight, using a
temporary npm userconfig that references `${NPM_TOKEN}` without exposing the
token.

# Acceptance Criteria

- `/private/tmp/mdkg-npm-publish.npmrc` contains the literal
  `${NPM_TOKEN}` token reference and is never committed.
- `npm whoami` succeeds with the temporary userconfig.
- npm latest remains `0.3.8` and `mdkg@0.3.9` remains unpublished immediately
  before publish.
- Real `npm publish --registry=https://registry.npmjs.org/
  --userconfig=/private/tmp/mdkg-npm-publish.npmrc` succeeds.
- The published commit SHA is recorded before publish for `v0.3.9` tagging.

# Files Affected

- `/private/tmp/mdkg-npm-publish.npmrc`
- npm registry package state

# Implementation Notes

- Do not print npm token material.
- Do not proceed if npm reports `mdkg@0.3.9` already published.
- Use isolated npm cache under `/private/tmp/mdkg-npm-cache`.

# Test Plan

- `npm whoami --registry=https://registry.npmjs.org/ --userconfig=/private/tmp/mdkg-npm-publish.npmrc`
- `npm view mdkg version --registry=https://registry.npmjs.org/`
- `npm view mdkg@0.3.9 version --registry=https://registry.npmjs.org/`
- `npm publish --registry=https://registry.npmjs.org/ --userconfig=/private/tmp/mdkg-npm-publish.npmrc`
- immediate post-publish registry reads in `test-313`

# Links / Artifacts

- `goal-43`
- `task-607`
