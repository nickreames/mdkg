---
id: task-837
type: task
title: Audit the post-remediation mdkg 0.6.0 repository with a fresh Standard security scan
status: backlog
priority: 1
tags: [release-0.6.0, launch-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [bug-35, bug-17, bug-39, task-835, task-836, task-827]
blocks: []
refs: [task-825, dec-96, task-828]
context_refs: [goal-86, goal-83, goal-84]
evidence_refs: [chk-571]
aliases: []
skills: []
created: 2026-09-13
updated: 2026-09-13
---

# Overview

Goal: Run a fresh complete Standard security audit of the post-remediation0.6.0 repository and retain its canonical coverage/findings.

Context: Task825 remains the completed historical scan35ca791e-716a-4bc3-8067-88d47224e288. This is a separately requested current-snapshot audit after broad CLI removal.

# Acceptance Criteria

- Freeze exact source and package inputs after known remedies and draft metadata;
  no writer changes reviewed source while the scan is active.
- Follow installed Standard workflow, authoritative scan identity, capability
  preflight, independent baseline, source-backed investigations and canonical report.
  Workers are offline/read-only; no global Codex config change without approval.
- Review graph/receipt parsers, filesystem authority, archives/transport, Git
  subprocesses, MCP, templates, package/install scripts, release automation and
  relevant website/demo source. Explicitly distinguish shipped and historical assets.
- Record actual source coverage, exclusions, failed/deferred work and source-bound
  findings. Incomplete/failed scans are not no-findings or release clearance.
- Deduplicate confirmed findings into Goal84 and Goal86 with regressions, affected
  versions and independent verification. Preserve original scan finding counts.
- Audit completion records findings; it does not require its own downstream fixes
  as prerequisites. New remedies block task828/829, avoiding a scan/fix cycle.
- Raw reports remain plugin-owned; only sanitized summaries/hashes/dispositions
  and regression links enter Git. Task828 is a separate independent diff workflow.

# Files Affected

Read-only frozen repository scope; plugin-owned reports and sanitized mdkg coverage/finding evidence. No code execution in scan workers or consumer/provider access.

# Implementation Notes

Owner: mdkg-project-agent, one writer in this checkout. Current action is mdkg-only
planning; this task stays unclaimed until an explicit Run of fully planned goal-86.
That later Run authorizes its bounded implementation, local validation, evidence
and reviewed explicit-path local commits on main; selected state does not authorize it.
No remote Git/push/tag/publication, provider/deployment, consumer/root/sibling
writes, canonical branch/worktree changes, canonical graph migration, bundle or
subgraph refresh, history rewrite, unrelated cleanup or global configuration changes.
Preserve partial Bug17 work, selected Goal73, runtime DB, Demo3 bundles and unknown
files. Stop on baseline movement, ownership collision, unknown custody, material
new decisions or missing authority. Fixture mutations belong only in owned
disposable local roots; never execute recovered Demo3 application payloads.

# Test Plan

Canonical report/manifest/findings/coverage hashes and exact source inventory; independently reviewed original ancestor-swap and ACL/ownership limits remain visible for task828/test487 disposition.

# Links / Artifacts

Record exact inputs, package/source hashes, commands, results, failures and
remaining uncertainty in sanitized goal86 evidence. No current execution proof.
