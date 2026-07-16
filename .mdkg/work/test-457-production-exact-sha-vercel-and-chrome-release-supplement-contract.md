---
id: test-457
type: test
title: Production exact-SHA Vercel and Chrome release-supplement contract
status: done
priority: 1
parent: goal-73
prev: task-796
next: task-797
tags: [goal-73, test, vercel, chrome, production, exact-sha]
owners: []
links: []
artifacts: []
relates: [task-795, task-796, task-797, edd-78]
blocked_by: [task-796]
blocks: [task-797]
refs: [goal-73, dec-84, edd-78]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: [docs-exact-sha-ready, mdkg-dev-exact-sha-ready, build-logs-clean, canonical-docs-chrome, mdkg-dev-basic-health, final-closeout-deploy]
created: 2026-07-16
updated: 2026-07-16
---
# Overview

Prove that the implementation and final graph-only history reach production
through exact Git identities and that canonical user-visible behavior matches
the local release-supplement contract.

# Target / Scope

Vercel deployments for `mdkg-docs` and `mdkg-dev`, canonical docs routes,
basic mdkg.dev health, Chrome evidence, and final graph-only deployment.

# Preconditions / Environment

`task-795` has an exact-SHA READY implementation deployment and `task-796`
has fresh canonical Chrome receipts.

# Test Cases

- Both production deployment records match the implementation commit SHA,
  `main`, expected project IDs, `production` target, and `READY` state.
- Build logs contain no error or failed build evidence.
- Canonical docs Chrome results match `test-456` at desktop and mobile.
- Canonical mdkg.dev homepage remains healthy with no authored source change.
- The goal checkpoint records implementation SHA, deployment IDs, URLs,
  commands, screenshot/receipt paths, accepted boundaries, and no npm/tag/DNS
  changes.
- After the closeout commit is pushed, both automatic deployments match that
  final SHA and are READY; one canonical Chrome spot check passes.

# Results / Evidence

- Implementation SHA `27005ece67a27bb9fcfb1a2b1ada45dc054ddddd`
  reached exact-SHA `READY` production deployments for `mdkg-docs`
  (`dpl_HV13PifDwM6heBwuwC7krCs4TFJt`) and `mdkg-dev`
  (`dpl_LdQHRUtgyJssUxooLMLEvmRe875y`). Both target `main`; build logs
  completed successfully.
- Canonical Chrome results matched the local desktop/mobile contract on all
  three docs routes, with no console errors or overflow, and basic mdkg.dev
  homepage health passed.
- Local and live DOM/screenshot evidence is bounded under
  `/private/tmp/mdkg-goal73-current-release/`; no npm, tag, DNS, or manual
  Vercel action occurred.
- The final graph-only deployment case is intentionally executed as the last
  acceptance step of `task-797` after its closeout push and reported externally,
  as required by that task's no-recursive-evidence-commit boundary.

# Notes / Follow-ups

- Final closeout deployment proof is reported without another graph mutation to
  avoid recursive evidence-only deployment commits.
