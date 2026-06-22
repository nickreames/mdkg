---
tags: [mdkg-dev, contract, safety, no-secret]
owners: []
links: []
artifacts: []
relates: [task-449, task-452]
blocked_by: [task-449]
blocks: []
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
context_refs: [prd-4, prd-5, edd-25]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
id: test-202
type: test
title: public alpha docs no-secret and safety-boundary contract
status: todo
priority: 1
parent: goal-25
epic: epic-124
---
# Overview

Validate public alpha copy, no-secret posture, and safety boundary language.

# Acceptance Criteria

- Homepage, quickstart, trust, alpha, docs, and `llms.txt` avoid raw secrets, tokens, provider payloads, raw prompts, private graph dumps, and local absolute paths.
- Trust page states local-first posture, no hosted index, no daemon, no automatic execution, no skill-script execution, read-only MCP, subgraph read-only context, visibility limitations, queue boundaries, and alpha caveats.
- Claims evidence matrix maps public claims to shipped behavior or safe caveats.
- Handoff warnings and no-secret checks are described as safety aids, not comprehensive secret scanning.
- Copy does not imply hosted memory, autonomous runtime, public worker execution, hosted queues, arbitrary SQL, public event/reducer/lease/materializer CLI, or guaranteed agent correctness.

# Test Plan

- no-secret scan selected by task-452.
- `npm run smoke:mdkg-dev`
- `npm run smoke:mdkg-dev-docs`
- `npm run smoke:mdkg-dev-seo`
- `node dist/cli.js validate --json`

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- parent: goal-25
- epic: epic-124
