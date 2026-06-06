---
id: chk-39
type: checkpoint
title: mdkg 0.2.0 public queue publish complete
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-265]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-265]
created: 2026-06-05
updated: 2026-06-05
---
# Summary

`mdkg@0.2.0` was published to npm with the public project DB queue CLI,
installed globally from the public registry, and validated in a fresh temp repo
using only `/opt/homebrew/bin/mdkg`.

# Scope Covered

- `task-265`
- `goal-7`

# Decisions Captured

- Public queue command namespace is `mdkg db queue`, not top-level `mdkg queue`.
- Queue delivery state is public through safe lifecycle commands, but event,
  reducer, lease, and materializer helpers remain internal.
- Snapshot sealing defaults to drained queues and supports explicit paused-queue
  sealing with no leased messages.

# Implementation Summary

- Published package: `mdkg@0.2.0`.
- Auth path: a temporary npm userconfig mapped the exported `NPM_TOKEN` to
  `//registry.npmjs.org/:_authToken`; the temporary file was removed after the
  command.
- Registry install target: `/opt/homebrew/bin/mdkg`.

# Verification / Testing

- `npm publish --dry-run` passed before real publish.
- Real `npm publish --registry=https://registry.npmjs.org/` succeeded with
  `+ mdkg@0.2.0`.
- `npm view mdkg@0.2.0 version --prefer-online` returned `0.2.0`.
- `npm view mdkg dist-tags --json --prefer-online` reported `latest: 0.2.0`.
- `npm install -g mdkg@0.2.0 --registry=https://registry.npmjs.org/
  --foreground-scripts` completed successfully.
- `command -v mdkg` returned `/opt/homebrew/bin/mdkg`.
- `mdkg --version` returned `0.2.0`.
- `npm list -g mdkg --depth=0` reported `mdkg@0.2.0`.
- Registry-installed global E2E passed at
  `/private/tmp/mdkg-public-queue-registry-0.2.0.ks9F87/repo`, including queue
  create/enqueue/dedupe/claim/wrong-owner rejection/fail/retry/reclaim/ack,
  dead-letter, pause/resume, release-expired, list/show/stats, snapshot
  drain/paused policies, db stats, snapshot dump/diff, index, validate, search,
  and ignore-policy checks.

# Known Issues / Follow-ups

- No tag or push was performed.

# Links / Artifacts

- npm package: `mdkg@0.2.0`
- temp E2E repo:
  `/private/tmp/mdkg-public-queue-registry-0.2.0.ks9F87/repo`
