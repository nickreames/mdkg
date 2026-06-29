---
id: task-618
type: task
title: create canonical website demo template graph and handoff prompt
status: todo
priority: 1
epic: epic-205
parent: goal-44
tags: [demo, template, website, graph, handoff]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [task-619, task-620, test-321]
refs: [goal-20, dec-56, edd-58]
context_refs: [dec-56, edd-58]
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-06-29
updated: 2026-06-29
---
# Overview

Create the canonical website demo template graph and copy-ready handoff prompt.
This is the first actionable node for `goal-44`.

# Acceptance Criteria

- `examples/website-demo-template/` exists as the canonical source for future
  demo runs.
- The template has one umbrella goal that can drive a complete website build.
- The template includes `DESIGN.md` with Ocean Flow guidance and an Astro plus
  React Islands stack decision.
- The handoff starts from one goal id and tells an agent to use `goal next` and
  `pack --profile concise`.

# Files Affected

- `examples/website-demo-template/**`
- `.mdkg/work/**` evidence and checkpoint nodes as needed

# Implementation Notes

- Do not rewrite `examples/template-mdkg-dev/`; it remains a reference fixture.
- Keep the template public-safe and free of secrets, raw prompts, provider
  payloads, and private repo data.
- Do not deploy or create Vercel resources in this task.

# Test Plan

- `node dist/cli.js --root examples/website-demo-template validate --json`
- `node dist/cli.js --root examples/website-demo-template goal next goal-1 --json`
- `node dist/cli.js --root examples/website-demo-template pack <first-node> --profile concise --dry-run --stats`
- `test-321`

# Links / Artifacts

- `goal-44`
- `dec-56`
- `edd-58`
