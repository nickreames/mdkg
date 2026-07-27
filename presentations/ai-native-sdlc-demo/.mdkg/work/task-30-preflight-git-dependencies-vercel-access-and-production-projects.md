---
id: task-30
type: task
title: Preflight Git dependencies Vercel access and production projects
status: backlog
priority: 1
epic: epic-6
parent: goal-6
prev: task-29
next: task-31
tags: [ai-native-sdlc, presentation-demo, phase-6, step-7]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-003/event-preflight.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-6, epic-6, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-29]
context_refs: [goal-6, epic-6, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-29]
evidence_refs: []
aliases: [phase-6-step-4]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Preflight Git dependencies Vercel access and production projects. This is step
7 of 13 in Goal 6.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-6.
- Perform read-only Git checks for branch, HEAD, `origin/main`, merge base, ahead/behind, dirty/staged paths, remote URL, fetch access, and whether a normal non-force push would be possible; do not stage, commit, merge, rebase, or push.
- Enumerate the complete prospective `origin/main..HEAD` range and changed
  paths that Goal 7 would publish. Unrelated or unreviewed ahead history is a
  preflight blocker, not implicitly absorbed into live-demo authority.
- Verify the frozen Node/package-manager versions and required dependencies using installed lockfile state and local read-only commands; do not install or update packages.
- Through read-only Vercel inspection, resolve the two existing production project names/opaque IDs, environment, latest deployment IDs/URLs/states/Git SHAs, account visibility, and query timestamps.
- Write `artifacts/demo-003/event-preflight.json` with Git and dependency command receipts, provider project records, credential-availability boolean without secrets, base SHA, observed origin SHA, and explicit pass/blocker fields.
- Missing fetch/push/provider access, unknown project identity, origin drift, dependency mismatch, or provider mutation requirement fails the preflight.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor task-31 does not begin until this node is verified.

# Files Affected

- Only the exact allowlist established by goal-6 at activation.
- Program evidence under this nested graph.
- No unrelated root, product, Git, or provider surface.

# Implementation Notes

- Re-read the active writer lease and current state immediately before mutation.
- Prefer deterministic mdkg, build, Git, and provider receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- Git, dependency, provider access, and both project identities are visible with exact redacted receipts and no stored credentials.
- Preflight observations are timestamped and bound to the same base SHA used by task-31 and task-32.
- Git index/history/remote and provider state are unchanged by this node.

# Links / Artifacts

- goal-6
- epic-6
- Evidence pending activation.
