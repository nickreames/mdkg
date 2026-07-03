---
id: task-647
type: task
title: run 0.4.1 postpublish temp install and workflow probes
status: blocked
priority: 1
parent: goal-50
tags: [0.4.1, npm, postpublish, temp-install, workflow-probes]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-646]
blocks: [task-648]
refs: [task-646]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-07-02
updated: 2026-07-02
---
# Overview

Validate the published `mdkg@0.4.1` package from registry state and a clean temp
global install.

# Acceptance Criteria

- `npm view mdkg version` returns `0.4.1`.
- Dist-tags show `latest` as `0.4.1`.
- A clean temp global install of `mdkg@latest` reports version `0.4.1`.
- Fresh temp workspace probes validate init, workflow-file creation with
  accepted fields, `mdkg validate --profile omni-room`, `mdkg work validate
  --profile omni-room`, helper commands, and upgrade behavior.
- No raw secrets or runtime payloads appear in generated probes or evidence.

# Files Affected

- `/private/tmp/mdkg-0.4.1-postpublish` or equivalent temp install workspace.
- mdkg checkpoint/evidence.

# Implementation Notes

- Use installed binary from the temp prefix, not local `dist/cli.js`, for
  post-publish proof.
- Keep temp workspace disposable and outside repo-tracked state.

# Test Plan

- `npm view mdkg version --registry=https://registry.npmjs.org/`
- `npm view mdkg dist-tags --json --registry=https://registry.npmjs.org/`
- temp global install of `mdkg@latest`
- installed `mdkg --version`
- temp `mdkg init --agent`
- temp `mdkg validate --json`
- temp `mdkg new manifest|work|work_order|receipt` probes
- temp `mdkg work validate --profile omni-room --json`
- temp `mdkg upgrade --dry-run --json`

# Links / Artifacts

- `task-646`
