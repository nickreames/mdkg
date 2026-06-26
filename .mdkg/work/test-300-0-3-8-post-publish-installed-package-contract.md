---
id: test-300
type: test
title: 0.3.8 post publish installed package contract
status: backlog
priority: 1
parent: goal-40
tags: [release, post-publish, contract, tmp]
owners: []
links: []
artifacts: []
relates: [task-591]
blocked_by: [task-591]
blocks: []
refs: [task-591]
context_refs: [goal-39, chk-280]
evidence_refs: []
aliases: [post-publish-installed-contract, npm-latest-tmp-validation]
skills: [verify-close-and-checkpoint]
cases: [installed binary reports 0.3.8, init validates in tmp repo, new manifest uses MANIFEST.md type manifest, manifest commands work from installed binary, capability search finds installed manifest, upgrade migrates legacy SPEC.md to MANIFEST.md, validate and status are clean from installed binary]
created: 2026-06-26
updated: 2026-06-26
---
# Overview

Contract test for the public `mdkg@0.3.8` npm package after publish. It proves
the installed package, not the local checkout, can initialize a repo, expose the
manifest capability surface, migrate legacy SPEC files, and validate graph
health from a tmp workspace.

# Target / Scope

- `task-591`
- public npm package `mdkg@latest` after `0.3.8` publication
- local tmp global prefix and tmp workspace under `/private/tmp`

# Preconditions / Environment

- `npm view mdkg version --registry=https://registry.npmjs.org/` returns
  `0.3.8`.
- The test runner has network access to the npm registry.
- The test runner can write under `/private/tmp`.
- The test must call `/private/tmp/mdkg-0.3.8-global/bin/mdkg` explicitly so it
  cannot accidentally use the repo-local `dist/cli.js`.

# Test Cases

- Installed binary reports `0.3.8`.
- `mdkg init --agent --json` creates a validation-clean tmp repo.
- `mdkg new manifest ... --id agent.post-publish-sample --json` creates a
  `MANIFEST.md` capability with `type: manifest`.
- `mdkg manifest list/show/validate --json` works against the tmp repo.
- `mdkg capability search "post publish sample" --json` finds the new
  manifest-backed capability.
- A legacy `SPEC.md` / `type: spec` fixture is renamed by
  `mdkg upgrade --apply --json` to `MANIFEST.md` / `type: manifest`.
- `mdkg validate --json` and `mdkg status --json` pass after upgrade.

# Results / Evidence

- Pending until after npm publish.

# Notes / Follow-ups

- Failure here means the npm payload or install-time behavior differs from the
  local checkout and should block publish closeout.
