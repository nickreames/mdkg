---
id: task-1
type: task
title: Build candidate website from cloned mdkg graph
status: todo
priority: 1
epic: epic-1
parent: goal-1
tags: [template, website, implementation]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [spike-1]
blocks: []
refs: []
context_refs: [goal-1, spike-1, edd-3, dec-1]
evidence_refs: [chk-1]
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Build a disposable local candidate website from this cloned graph, then record whether it should be discarded, previewed, or promoted later.

# Acceptance Criteria

- Candidate site is locally inspectable.
- The graph explains audience, page scope, visual direction, validation, and promotion policy.
- No production deploy, DNS, analytics activation, credentials, or durable demo subdomain is touched.
- `test-1` can verify the local build and clone/fork flow.

# Files Affected

List files/directories expected to change.

- `WEBSITE_TEMPLATE_BRIEF.md`
- implementation files selected by the spike
- `.mdkg/work/chk-*` closeout evidence

# Implementation Notes

- Keep output easy to delete or copy into a preview project.
- Treat Vercel preview and durable demo promotion as later explicit goals.
- If the template needs a SKILL.md, create a follow-up task first.

# Test Plan

- Run `mdkg validate --json`.
- Run `mdkg pack goal-1 --profile concise`.
- Execute the artifact-specific local build/check chosen by the spike.
- Record pass/fail evidence in a checkpoint.

# Links / Artifacts

- goal-1
- spike-1
- test-1
