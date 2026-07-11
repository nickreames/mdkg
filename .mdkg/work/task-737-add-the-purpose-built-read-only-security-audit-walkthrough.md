---
id: task-737
type: task
title: Add the purpose-built read-only security audit walkthrough
status: todo
priority: 1
epic: epic-238
tags: [release, implementation, goal-63]
owners: []
links: []
artifacts: []
relates: [goal-63]
blocked_by: [task-736]
blocks: [task-740, test-405]
refs: [test-405, edd-71, dec-73, dec-74, prd-11, prop-8]
context_refs: [goal-61, goal-62, goal-63, epic-238, dec-71, dec-74, prop-8, task-710, task-711, task-735, task-736]
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-11
---
# Overview

Create the first public loop walkthrough using a purpose-built security audit
example that works across codebases and preserves the read-only/approval
boundaries verified by Goal 61.

# Acceptance Criteria

- Add `/loops/security-audit/` and link it from the homepage CTA.
- Use the exact command sequence in `prop-8`: list, show, observational fork
  dry-run, real fork, plan, pack, next, and runs.
- Show purpose-built shortened output using only `LOOP_ID`, `DECISION_ID`, and
  neutral filenames; never copy dogfood ids, paths, hashes, receipts, or provider
  data.
- State that dry-run writes nothing and does not consume IDs; the real fork
  receives the same available identities.
- Show first-class question identity bindings in loop frontmatter without
  inventing an answer command.
- Keep external advisory/provider work unrequested or unapproved, approve local
  cache writes, and scope the example to local read-only audit work.
- State that read-only forbids functional source changes but allows mdkg
  findings, spikes, proposals, tasks, tests, decisions, checkpoints, waivers,
  receipts, and evidence.
- State that mdkg does not launch the audit; the user runs the packed loop
  through a harness that follows `pursue-mdkg-loop`.
- State that `next` routes but does not execute work and that closeout requires
  completed or explicitly waived lanes.
- Do not document `mdkg loop run`, `resume`, `execute`, `note add`, or any other
  nonexistent command.

# Files Affected

- `docs/src/content/docs/loops/security-audit.*`
- Purpose-built example fixtures and command-validation tests

# Implementation Notes

- Reconcile all syntax against current descriptors/generated CLI reference.
- Use fenced blocks for command sequences and contained horizontal overflow.
- Keep public wording source-backed and qualified as Pre-v1 public alpha.

# Test Plan

Run `test-405`; parse every command, compare documented fields to structured
CLI output, scan for forbidden internal data/claims, and verify draft/preview
route behavior, links, mobile code overflow, and runtime boundaries.

# Links / Artifacts

- `dec-74`
- `prop-8`
- `test-405`
