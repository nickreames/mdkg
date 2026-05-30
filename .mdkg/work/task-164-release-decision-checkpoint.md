---
id: task-164
type: task
title: release decision checkpoint
status: done
priority: 1
epic: epic-28
tags: [release, audit, checkpoint, decision, publish]
owners: []
links: [npm:mdkg]
artifacts: [CHANGELOG.md, package.json]
relates: [epic-28, task-157, task-158, task-159, task-160, task-161, task-162, task-163]
blocked_by: [task-157, task-158, task-159, task-160, task-161, task-162, task-163]
blocks: []
refs: [rule-5]
aliases: [release-decision-0-1-4]
skills: []
created: 2026-05-19
updated: 2026-05-19
---

# Overview

Summarize the pre-release audit and make the explicit publish-readiness
decision for `mdkg@0.1.2`.

# Acceptance Criteria

- Summarize completed audit evidence for tasks `task-157` through `task-163`.
- List any blockers and residual risks.
- State whether `mdkg@0.1.2` is approved for real npm publish.
- Provide final publish commands if approved.
- Keep real publish outside this task until explicit user approval.
- Create or link a checkpoint only after the audit evidence is complete.

# Files Affected

Expected graph-only closeout targets:
- `epic-28`
- `task-157`
- `task-158`
- `task-159`
- `task-160`
- `task-161`
- `task-162`
- `task-163`
- `task-164`

# Implementation Notes

This is the release decision node, not the publish action. If the release is
approved, the next step should still require an explicit user message before
running `npm publish`.

# Test Plan

- Confirm all audit tasks are done or explicitly marked with blockers.
- Confirm `task-163` includes successful package and publish dry-run evidence.
- Run `node dist/cli.js validate`.
- Run `node dist/cli.js pack task-164 --profile concise --dry-run --stats`.

# Links / Artifacts

- `epic-28`
- `task-163`

# Release Decision

`mdkg@0.1.2` is the intended next npm publish target after separate explicit
user approval. The rescaled package dry-run, publish dry-run, registry check,
and npm auth check all passed.

# Completed Audit Summary

- `task-157`: registry baseline confirmed. npm latest is `0.1.1`; local target
  is now `0.1.2`.
- `task-158`: CLI command surface, help snapshots, README, command matrix, and
  seeded command matrix are in parity.
- `task-159`: init, agent init, upgrade, seeded assets, and manifest behavior
  passed tests and packed-package smokes.
- `task-160`: archive sidecars, strict ZIP validation, work lifecycle mirrors,
  and semantic mirror docs passed tests and packaged smoke.
- `task-161`: bundle, bundle import, stale import diagnostics, and visibility
  enforcement passed tests and packaged smokes.
- `task-162`: capability cache generation, stale rebuild, child workspace
  aggregation, and capability command discovery passed tests and smoke.
- `task-163`: full package gate, pack dry-run, package contents audit, publish
  dry-run, registry baseline check, and npm auth check passed for `0.1.2`.

# Blockers

None found.

# Residual Risks

- This release is intentionally broad: it publishes the accumulated local
  changes as `0.1.2` over npm latest `0.1.1`, rather than skipping version
  numbers.
- Real `npm publish` still depends on local npm auth and any required OTP or
  publish token policy.
- This machine should use `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache` for
  publish commands until the root-owned `~/.npm` cache issue is fixed.
- Consumer repos were not modified during this audit; post-publish handoff work
  remains separate.

# Publish Commands

Use the clean npm cache path:

```bash
cd /Users/nick/git/mdkg
export NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache
mkdir -p "$NPM_CONFIG_CACHE"
npm whoami --registry=https://registry.npmjs.org/
npm view mdkg version --registry=https://registry.npmjs.org/
npm publish --registry=https://registry.npmjs.org/ --tag latest
npm view mdkg version --registry=https://registry.npmjs.org/
npm view mdkg dist-tags --registry=https://registry.npmjs.org/
```

# Checkpoint Note

No separate checkpoint node was created in order to keep this graph-only pass
scoped to the requested `epic-28` and `task-157` through `task-164` nodes. This
task is the release decision checkpoint for the audit phase.
