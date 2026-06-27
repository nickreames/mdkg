---
id: test-313
type: test
title: validate published mdkg 0.3.9 from isolated temp install
status: todo
priority: 1
parent: goal-43
tags: [release, 0.3.9, post-publish, temp-install, test]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-608]
blocks: [task-609]
refs: [goal-43, task-608]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-06-27
updated: 2026-06-27
---
# Overview

Validate the just-published `mdkg@0.3.9` package from npm, not the local source
tree, using an isolated temp global install and a fresh temp workspace.

# Target / Scope

`goal-43`, `task-608`, npm registry state, isolated installed binary behavior,
and published-package init/upgrade behavior.

# Preconditions / Environment

- npm registry access is required.
- Use an isolated prefix under `/private/tmp/mdkg-0.3.9-postpublish-*`.
- Use a fresh temp workspace below the isolated post-publish directory.

# Test Cases

- `npm view mdkg version --registry=https://registry.npmjs.org/` returns
  `0.3.9`.
- `npm view mdkg dist-tags --json --registry=https://registry.npmjs.org/` has
  `latest: "0.3.9"`.
- `npm install -g mdkg@latest --prefix <temp-prefix>` succeeds.
- `<temp-prefix>/bin/mdkg --version` reports `0.3.9`.
- In a fresh temp workspace, installed `mdkg init --agent`, `mdkg status
  --json`, `mdkg validate --json`, `mdkg new manifest ... --json`, `mdkg skill
  sync --json`, and `mdkg upgrade --apply --json` succeed.
- The temp workspace proves published-package support for `MANIFEST.md`,
  `COLLABORATION.md`, one-release legacy `HUMAN.md`, config overlays, and
  custom skill mirror targets.

# Results / Evidence

Pending publish execution.

# Notes / Follow-ups

- Record accepted legacy warnings explicitly in the closeout checkpoint.
- The temp install directory may remain under `/private/tmp` as inspectable
  local evidence.
