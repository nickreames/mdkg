---
id: bug-73
type: bug
title: Isolate ordinary and coverage test workers from ambient Git routing
status: done
priority: 1
tags: [release-0.6.0, qualification-custody]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/final-remedies-local-verification-20260930.json, .mdkg/artifacts/goal-86/successor-package-gates-20260930.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-86, goal-84, task-838, task-828, test-493]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-09-30
updated: 2026-09-30
---
# Overview

Goal: isolate ordinary and coverage test workers from inherited Git routing,
using existing repository-owned fixture environment admission.
Context: independent supporting-diff review of e42f1d9..c313 identified native
Git unit wrappers that inherit routing despite temporary cwd. This is a
non-shipping qualification-custody defect, not a validated runtime advisory.
Owner: mdkg-project-agent, one writer; Goal86 is the sole execution lane.
Allowed: scripts/test-built.js, scripts/coverage-contract.js, direct regression
tests and required mdkg evidence/projections. No CLI behavior or feature changes.
Boundaries: no remote, provider, publication, global configuration, canonical
branch/worktree, bundle or migration action; preserve protected state.
Done when: both launch paths demonstrably strip inherited Git routing while
retaining qualification inputs and in-worker explicit routing test behavior;
focused and full qualification checks pass. No outside-user-state PoC is allowed.

# Reproduction Steps

Load each actual launcher with a bounded native subprocess trap. Supply synthetic
GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, object/config/template routing and an
unrelated sentinel. Inspect the exact worker environment before launch. Coverage
preparation writes only an owned temporary output; no native Git executes.

# Expected vs Actual

- Expected: worker setup cannot inherit external checkout/index/config authority.
- Actual: both launchers forward process.env; downstream wrappers can retain it.
  Current real invocation had only GIT_PAGER, not active external routing. No
  canonical or real external repository mutation is claimed.

# Suspected Cause

The ordinary launcher omits env; coverage spreads process.env. Existing isolated
fixture admission was not applied at either shared worker boundary.

# Fix Plan

Reuse isolatedFixtureEnvironment for worker spawn only. Do not strip deliberate
routing set inside isolated workers or alter the parent's environment. Do not
replace native Git or refactor all legacy unit wrappers.

# Test Plan

Exact launcher traps for both paths, unrelated-input preservation, unchanged
parent state, then existing coverage/ordinary-run infrastructure tests and the
full release ladder. Test493/Task828 own aggregate acceptance.

# Links / Artifacts

Independent supporting review remains plugin-owned. Sanitized final-remedy
evidence and regression references will be attached after execution.
New skill candidates: none.
