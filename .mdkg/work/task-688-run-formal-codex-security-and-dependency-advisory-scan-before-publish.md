---
id: task-688
type: task
title: Run formal Codex Security and dependency advisory scan before publish
status: done
priority: 1
parent: loop-1
tags: [security, publish, loop-followup, readonly, superseded, cancelled]
owners: []
links: []
artifacts: []
relates: [loop-1, loop-3]
blocked_by: []
blocks: []
refs: [loop-1, spike-25, task-686, loop-3]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Run a formal read-only pre-publish security scan for mdkg after the loop dogfood pass. This task exists because `loop-1` completed a source-grounded parent-agent pass, but not the full Codex Security multi-pass workflow, and docs/mdkg-dev package advisory checks require external registry access.

# Superseded / Cancelled

This task is closed as superseded by `loop-3`, the corrected security audit loop fork.

The original task captured a real gap, but it should not remain as separate runnable work because the corrected loop contract now treats advisory/security-provider approval, local scan coverage, source review, finding triage, and waiver handling as required evidence lanes inside the loop itself. Any future dependency advisory or formal security-provider run should be driven from `loop-3` and linked back to its evidence table, proposal/decision records, and closeout matrix.

# Acceptance Criteria

- The operator explicitly approves any external calls that send package metadata, dependency manifests, repository metadata, or findings to a registry or security provider.
- A formal Codex Security repository-wide scan, or an explicitly accepted equivalent, is run read-only and records scope, limitations, and findings.
- Fresh dependency advisory checks are run for the root package, `docs/`, and `mdkg-dev/`, or a policy-approved offline alternative is documented.
- Valid findings create follow-up mdkg work nodes with affected files, impact, evidence, severity, and remediation direction.
- False positives and residual uncertainty are recorded without claiming comprehensive secret scanning or DLP coverage.

# Files Affected

- `.mdkg/work/` evidence and follow-up nodes only.
- No functional source, docs, templates, generated files, CLI behavior, or runtime code should change in this read-only task.

# Implementation Notes

- `loop-1` root package advisory check passed locally with zero vulnerabilities.
- `docs/` and `mdkg-dev/` advisory checks failed under restricted network with `getaddrinfo ENOTFOUND registry.npmjs.org`.
- A network escalation for advisory checks was rejected because package metadata would be sent externally without explicit user approval.
- The prior loop pass found no credential-shaped secrets with local pattern scanning, but that is not a comprehensive secret audit.

# Test Plan

- `git status --short --branch`
- Formal scan command receipts and generated finding summary, if the operator approves the security workflow.
- `npm audit --json --omit=dev` in the repo root, `docs/`, and `mdkg-dev/`, or an approved offline advisory receipt.
- `node dist/cli.js validate --changed-only --json`
- `node dist/cli.js validate --summary --json --limit 20`

# Links / Artifacts

- `loop-1`
- `spike-25`
- `task-686`
- `test-362`
