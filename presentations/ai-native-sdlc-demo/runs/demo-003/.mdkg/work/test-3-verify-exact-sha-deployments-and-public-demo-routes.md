---
id: test-3
type: test
title: Verify exact-SHA deployments and public demo routes
status: done
priority: 1
epic: epic-1
parent: goal-1
prev: task-3
tags: [demo, production, exact-sha, live-routes]
owners: []
links: []
artifacts: [artifacts/live-verification-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-1, prd-2]
context_refs: [prd-2, edd-1, dec-1, dec-2, task-3, chk-3]
evidence_refs: [task-3]
aliases: []
skills: [verify-close-and-checkpoint]
cases: [pushed sha matches publication receipt., required production deployments are ready for the exact sha., bound detail and output urls return success., routes match noindex unlisted zero-javascript accessibility privacy and budget contracts., source-versus-execution plan-work-evidence what-why-next quickstart and feedback proof pass., fast reveal receipt is sealed before optional comprehensive evidence., provider inspection is read-only., final statuses evidence refs and checkpoint are consistent., hard blockers select the named fallback without claiming success.]
created: 2026-07-28
updated: 2026-08-02
---
# Overview

Verify read-only that the approved pushed SHA reached every required production
deployment and that the bound public routes satisfy the reveal contract.

# Target / Scope

- `task-3` publication receipt
- exact-SHA production deployments named by caller authority
- bound detail and output URLs
- goal closure consistency and runtime checkpoint

# Preconditions / Environment

- A successful `task-3` receipt names the pushed SHA and remote branch.
- Caller authority names existing provider projects and permits read-only
  visibility only.

# Test Cases

- Require every named production deployment to be `READY` for the exact pushed
  SHA.
- Verify both bound routes return success and pass the fixed static,
  accessibility, privacy, evidence-story, noindex/unlisted, and budget checks.
- Seal the fast reveal receipt before optional screenshots or comprehensive
  post-reveal audits.
- Perform no manual deploy, redeploy, alias, DNS, project, environment,
  analytics, or other provider mutation.
- On an enumerated hard blocker, record precise evidence, stop side effects,
  select the caller-named fallback, and do not claim this run succeeded.
- Before goal achievement, require all seven actionable nodes done, complete
  evidence refs, a final accepted runtime checkpoint, and consistent goal
  evaluation.

# Results / Evidence

Write `artifacts/live-verification-receipt.json` with exact-SHA deployment
identities, bound route results, fast reveal hash, provider-read-only proof,
fallback selection, closure consistency, and what comes next.

# Notes / Follow-ups

- Create the accepted runtime checkpoint only after every success case passes.
- Comprehensive screenshots/audits may follow the reveal gate but cannot
  retroactively justify a failed fast verifier.
