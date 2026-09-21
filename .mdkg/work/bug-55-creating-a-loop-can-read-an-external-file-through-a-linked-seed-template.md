---
id: bug-55
type: bug
title: Creating a loop can read an external file through a linked seed template
status: backlog
priority: 1
tags: [release-0.6.0, security]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [task-837, goal-84, goal-86, task-828]
context_refs: [goal-86, goal-84, task-837]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-17
updated: 2026-09-17
---
# Overview

Goal: remediate g86-graph-001 from the completed fresh Standard scan
9d6a2ca2-4273-45de-9013-20452c7651d0 under Task837. Publication blocker.
Severity: low. `new loop` automatically reads every matching loop seed after creating the node. A repository-supplied symlink can make this optional discovery read an external Markdown file and expose its title, or block on a special device, leaving the creation without its normal receipt.

The attacker controls repository content and needs the operator to create a loop. Disclosure is confined to the parsed title and local output; special-file reading affects the local command. No remote exfiltration or code execution is established.

Context: frozen source e42f1d93497119c9a1f8684df926510da91dea42,
draft package0.6.0. This is source-validated evidence, not executed exploit proof.
Earlier published versions were not assessed by that offline current-source scan.
Establish affected-version bounds from exact local package/source evidence during
remediation; do not assume published0.5.2 is affected.

Owner: mdkg-project-agent, one repository writer under the explicit Goal86 run. Allowed: this bounded generic source remedy, directly required helpers, regression/installed fixtures, release-critical truth corrections and sanitized mdkg evidence. Preserve authored history, selected Goal73, runtime DB, Demo3 bundles and unrelated custody. No canonical migration, bundle/subgraph refresh, remote Git, publication, provider/deployment, cross-project writes, global configuration or history rewrite. Stop for a materially new architecture/security decision; no documentation-only waiver.

# Reproduction Steps

Use synthetic, owned disposable fixtures only. Reproduce the source-bound
failure before changing its control, retain passing controls, and bind the
commands/results to exact source and installed artifact hashes. Never run
malicious inputs against canonical state or recovered Demo3 payloads.

1. Reject linked seed files, linked loop directories and special-file targets before authored mutation.
2. Prove external sentinel bytes are not read or copied to receipts.
3. Preserve valid local regular-file suggestions and normal node creation.

# Expected vs Actual

Expected: the owning generic operation enforces its intended authority,
integrity and resource boundaries before effects and emits honest receipts.
Actual: The shipped default schema directory is templates/default, so loop seeds are not rejected by schema loading first. A tracked seed-file link to external frontmatter Markdown reaches the raw read and title projection. A linked directory or special-file target is likewise not refused here. Containment in the sibling loop reader does not cover this alternate call path.

# Suspected Cause

`loopTemplateSuggestions` enumerates strings beneath the configured loop directory and opens all `.loop.md` names with `fs.readFileSync`. A symlink is indistinguishable from a regular file at that boundary. The parser's title is copied into `suggested_templates`. `runNewCommandLocked` calls the reader automatically after durable node creation, so unsafe optional discovery also interrupts completion after mutation.

Source anchors:
- src/commands/new.ts:104-110 (root_control)
- src/commands/new.ts:113-120 (outcome)
- src/commands/new.ts:570-583 (propagation)
- src/commands/new.ts:613-627 (entrypoint)
- assets/init/config.json:70-73 (propagation)

# Fix Plan

Use one shared contained, regular-file-only, resource-bounded seed-template loader for both new-loop suggestions and loop commands. Validate discovered entries before creating the requested node, or make optional guidance failure explicitly non-fatal without following unsafe targets. Add regressions for a seed-file symlink to external Markdown, a linked loops directory, and a special-file target.

Owned source allowlist:
- src/commands/new.ts
- assets/init/config.json

Directly required shared helpers and regression files may be added only for
this control. Keep different findings separately attributable even when the
implementation shares a helper. Completed older bug milestones are historical
evidence, not reopened or substituted for this new regression.

# Test Plan

- Reject linked seed files, linked loop directories and special-file targets before authored mutation.
- Prove external sentinel bytes are not read or copied to receipts.
- Preserve valid local regular-file suggestions and normal node creation.
- Failing-before/passing-after controls with no unintended filesystem, Git-index,
  selected-state or runtime-state effects; record all skips and missing proof.
- Current-source tests and exact installed package on Node24.15.0/24.18.0/26,
  macOS and Linux x86_64/ARM64 where the case is platform-sensitive.
- Bind this finding to test488 and relevant existing installed families; Task828
  independently reviews the complete remediation range after fixes are frozen.
- Local bug completion requires a verified remedy; final release clearance still
  requires independent review, full qualification and the new exact artifact seal.

# Links / Artifacts

- .mdkg/artifacts/goal-86/task-837-standard-security-audit.json
- root:task-837; root:test-488; root:task-828; root:test-487
- Canonical raw finding/report remains plugin-owned; only sanitized evidence,
  hashes and regression/disposition references belong in this graph.

## Current State

Planned / backlog. Source finding accepted; no remediation or runtime
verification has been performed for this new record. Goal85 remains paused.
