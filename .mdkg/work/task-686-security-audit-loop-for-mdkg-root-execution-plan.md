---
id: task-686
type: task
title: Security audit loop for mdkg root execution plan
status: done
priority: 1
parent: loop-1
tags: [loop-template, audit, security, loop-fork, loop-child, task]
owners: []
links: []
artifacts: []
relates: [loop-1]
blocked_by: []
blocks: []
refs: [loop-1, template://loops/security-audit]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Plan and coordinate execution work for Security audit loop for mdkg root over mdkg root repository.

Execution completed as a read-only parent-agent audit pass. The pass reviewed repository instructions, loop context, security-relevant source surfaces, archive/bundle/subgraph handling, shellout behavior, public rendering surfaces, local secret-shaped patterns, root dependency advisories, and mdkg graph validation. No functional files were changed by the audit.

# Acceptance Criteria

- Work remains scoped to the loop definition of done.
- Outputs, evidence, and follow-up nodes are linked to the loop.
- If blocked, the loop records blocker evidence and continues useful scoped work where possible.
- Any remediation or deeper investigation from this pass is represented as future mdkg work, not source edits.

# Files Affected

- No functional source files should be changed while running this read-only audit loop.
- Future remediation or deeper investigation should be represented as mdkg work nodes.

# Implementation Notes

- Use `/goal` or an equivalent long-running harness to execute the loop read-only.
- Ground findings in source, configuration, dependency metadata, generated artifacts, and mdkg context.
- If a blocker appears, create or request a spike/proposal with at least three viable paths and one recommended path.

# Test Plan

Template: template://loops/security-audit

- `node dist/cli.js validate --summary --json --limit 20`
- `node dist/cli.js pack loop-1 --pack-profile concise --dry-run --stats`
- Tight local credential-shape scan with `rg --pcre2`
- Root `npm audit --json --omit=dev`
- Source inspection of archive, bundle, subgraph, project DB, Git helper, postinstall, and mdkg-dev rendering surfaces

# Links / Artifacts

- `loop-1`
- `spike-25`
- `test-362`
- `task-688`
- `spike-27`
