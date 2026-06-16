---
id: test-156
type: test
title: 0.3.2 spike prepublish dry-run readiness contract
status: done
priority: 1
epic: epic-84
parent: goal-14
tags: [spike, 0.3.2, prepublish, dry-run]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-368]
blocks: []
refs: []
aliases: []
skills: []
cases: [full local gates pass, npm pack dry-run reports 0.3.2, npm publish dry-run reports 0.3.2, no real publish tag or push]
created: 2026-06-11
updated: 2026-06-15
---
# Overview

Validate that the completed spike system is ready for a `0.3.2` release
candidate through dry-run package gates only.

# Target / Scope

- `task-368`
- `goal-14`
- package gates and dry-run release proof

# Preconditions / Environment

- Source version has been bumped to `0.3.2` in the future RC task.
- Changelog has a `0.3.2` section.
- No real publish, tag, or push is in scope.

# Test Cases

- Full required checks on `goal-14` pass.
- `npm pack --dry-run --json` reports `mdkg@0.3.2` and includes spike assets.
- `npm publish --dry-run` reports `mdkg@0.3.2`.
- `node scripts/assert-publish-ready.js` requires spike docs/template/smoke.
- `git diff --check` passes.
- Evidence explicitly states publish-ready, not published.

# Results / Evidence

- Passed on 2026-06-16.
- Full required `goal-14` release-candidate gates passed through dry-run package
  proof: build, test, CLI check, command contract, graph validation,
  `smoke:init`, `smoke:upgrade`, `smoke:spike`, `smoke:command-docs`,
  full `prepublishOnly`, publish-readiness assertions, pack dry-run, publish
  dry-run, and `git diff --check`.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
  reported `mdkg@0.3.2`, `mdkg-0.3.2.tgz`, 159 entries, and included
  `dist/init/templates/default/spike.md`.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run` reran
  `prepublishOnly` and `prepack`, printed tarball details for `mdkg@0.3.2`,
  and ended with `+ mdkg@0.3.2` under npm dry-run mode.
- `node scripts/assert-publish-ready.js` passed and requires spike docs,
  template, smoke, and release notes.
- No real npm publish, git tag, git push, or global install was performed.

# Notes / Follow-ups

- Real npm publish, global install, and temp E2E are separate explicit requests.
