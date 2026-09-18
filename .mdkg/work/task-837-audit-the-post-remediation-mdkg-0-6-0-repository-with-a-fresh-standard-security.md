---
id: task-837
type: task
title: Audit the post-remediation mdkg 0.6.0 repository with a fresh Standard security scan
status: done
priority: 1
tags: [release-0.6.0, launch-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/task-837-standard-security-audit.json]
relates: []
blocked_by: [bug-35, bug-17, bug-39, task-835, task-836, task-827]
blocks: []
refs: [task-825, dec-96, task-828, bug-44, bug-45, bug-46, bug-47, bug-48, bug-49, bug-50, bug-51, bug-52, bug-53, bug-54, bug-55, bug-56, bug-57, bug-58, bug-59, bug-60, task-838, task-839, test-488]
context_refs: [goal-86, goal-83, goal-84]
evidence_refs: [chk-571]
aliases: []
skills: []
created: 2026-09-13
updated: 2026-09-17
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

Owner: mdkg-project-agent, one writer in this checkout. The explicit Goal86 Run
authorizes this fresh audit and sanitized blocker intake. The accepted run covers
its bounded implementation, local validation, evidence
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

Canonical scan9d6a2ca2-4273-45de-9013-20452c7651d0 is complete at frozen
sourcee42f1d93497119c9a1f8684df926510da91dea42. Fourteen findings (5medium,9low),
explicit exclusions and69matching source excerpts are preserved in plugin-owned
canonical reports. Sanitized intake, report hashes and per-finding ownership:
.mdkg/artifacts/goal-86/task-837-standard-security-audit.json.

Bugs44-57 own the fresh findings; Bugs58-60 are separately classified adjacent
correctness/contract work. Tasks838/839 and test488 own harness/final-guidance
corrections and regression acceptance. These are downstream fixes, not
prerequisites of this audit's completion. Source remained unchanged throughout
review; no scan worker executed application code or contacted external systems.
No remediation, platform clearance, final artifact seal or publication follows
from report completion. Goal85 remains paused.
