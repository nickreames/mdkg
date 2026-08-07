---
id: task-30
type: task
title: Preflight Git dependencies Vercel access and production projects
status: done
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
aliases: [phase-6-step-7]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-28
---

# Overview

Preflight Git dependencies Vercel access and production projects. This is step
7 of 13 in Goal 6.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-6.
- Perform read-only Git checks for branch, HEAD, `origin/main`, merge base, ahead/behind, dirty/staged paths, remote URL, fetch access, and whether a normal non-force push would be possible; do not stage, commit, merge, rebase, or push.
- Classify the complete local range ahead of `origin/main` as the candidate
  preparation baseline that task-31 must review and seal. Every commit and
  changed path must belong to the presentation/demo program or an explicitly
  named prerequisite; any unrelated or unexplained history is a blocker and
  may not be silently absorbed. This preflight grants no publication
  authority. Record the current HEAD/origin relationship, query timestamp,
  exact range, and any allowed local-evidence-only exception.
- Verify the frozen Node/package-manager versions and required dependencies using installed lockfile state and local read-only commands; do not install or update packages.
- Prove the warm dependency source, one-attempt no-install build, measured
  build-once validation command, serial shared-output tests, and prepared fast
  production verifier.
- Through read-only Vercel inspection, resolve the two existing production project names/opaque IDs, environment, latest deployment IDs/URLs/states/Git SHAs, account visibility, and query timestamps.
- Write `artifacts/demo-003/event-preflight.json` with Git and dependency command receipts, provider project records, credential-availability boolean without secrets, base SHA, observed origin SHA, and explicit pass/blocker fields.
- Missing fetch/push/provider access, unknown project identity, origin drift, dependency mismatch, or provider mutation requirement fails the preflight.
- Any local commit ahead of `origin/main` that cannot be classified into the
  candidate preparation baseline fails this node. Task 31 must subsequently
  write and review the exact preparation-baseline handoff before human
  publication authority can exist.
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

# Results / Evidence

- Live `origin/main` remains `f6af6410…d93`; the queried local candidate
  `da5a5fc4…c7a` is a linear 11-commit descendant with zero behind commits.
- Classified all 11 commits into ten presentation/demo commits and one
  explicitly planned root Remotion research prerequisite; no unrelated commit
  was found. Task 31 must recalculate and seal the final range after this
  evidence is committed.
- A normal push dry run reported the expected fast-forward and did not update
  the remote.
- Installed dependency trees passed preflight; the no-install build passed on
  the first attempt in 10.32 seconds.
- Read-only Vercel inspection resolved both existing project IDs, current
  production deployment IDs, READY states, and exact live-origin SHA.
- `artifacts/demo-003/event-preflight.json` records the redacted receipts,
  one connector enumeration warning, and zero blockers. No publication
  authority was granted.

# Links / Artifacts

- goal-6
- epic-6
- Evidence pending activation.
