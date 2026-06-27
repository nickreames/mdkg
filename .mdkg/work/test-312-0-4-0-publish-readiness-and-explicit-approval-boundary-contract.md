---
id: test-312
type: test
title: 0.4.0 publish readiness and explicit approval boundary contract
status: todo
priority: 2
epic: epic-204
parent: goal-42
tags: [0.4.0, publish-readiness, npm, approval, test]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-606, task-612, test-316, task-613, test-317, task-614, task-615, test-318, task-616, test-319, task-617, test-320]
blocks: []
refs: [task-606, task-612, test-316, task-613, test-317, task-614, task-615, test-318, task-616, test-319, task-617, test-320]
context_refs: []
evidence_refs: [chk-310]
aliases: []
skills: []
cases: []
created: 2026-06-26
updated: 2026-06-27
---
# Overview

Validate the complete `0.4.0` package publish, postpublish, Vercel launch, and
explicit approval boundary.

# Target / Scope

`task-606`, `goal-42`, package release metadata, changelog/release notes,
pre-publish gates, npm dry-run behavior, real npm publish evidence, npm
postpublish validation, Vercel production currentness, Chrome live proof, and
side-effect boundaries.

# Preconditions / Environment

All `goal-42` docs/site/example/browser, package, npm, Vercel, and Chrome
contracts are complete or their gaps are known and recorded.

# Test Cases

- Git/changelog audit maps every publish-bound change to `0.4.0` release notes,
  version references, tests, docs/site changes, browser proof, package payload,
  and postpublish validation.
- Registry checks prove prepublish availability before `task-614` and
  postpublish latest/dist-tag correctness after `task-615`.
- Build, test, CLI, docs, publish-readiness, pack dry-run, and publish dry-run
  gates pass before real publish.
- Real `mdkg@0.4.0` npm publish occurs only after explicit approval and has a
  matching evidence receipt.
- Published `mdkg@latest` installs and validates from a clean temp prefix.
- Vercel production deployments for mdkg.dev and docs.mdkg.dev are approved,
  current, `READY`, and matched to the approved commit.
- Chrome live desktop/mobile validation passes after deployment.
- Final closeout recommends either `launch ready` or lists exact remaining gaps.
- No real npm publish, git tag, push, deploy, DNS, analytics, or downstream repo
  mutation occurs outside explicit approval boundaries.

# Results / Evidence

Pending implementation.

# Notes / Follow-ups

- Readiness is not authorization to publish or launch.
