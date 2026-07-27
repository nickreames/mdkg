---
id: chk-17
type: checkpoint
title: Demo 2 publication rehearsal and golden fallback accepted
checkpoint_kind: goal-closeout
status: done
priority: 1
tags: [ai-native-sdlc, presentation-demo, phase-5, goal-closeout]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-002/push-receipt.json, artifacts/demo-002/deployment-receipt.json, artifacts/demo-002/live-route-receipt.json, artifacts/demo-002/rehearsal-receipt.json, artifacts/demo-002/golden-fallback.json, artifacts/demo-002/golden-fallback.sha256, artifacts/demo-002/golden-fallback-recovery.md]
relates: []
blocked_by: []
blocks: []
refs: [goal-5, epic-5, prd-1, edd-1, dec-4, dec-5, task-26, test-12, test-13, test-14]
context_refs: [goal-5, epic-5, prd-1, edd-1, dec-4, dec-5, chk-14, chk-15]
evidence_refs: [task-48, task-21, task-22, task-49, task-50, task-23, task-24, task-25, task-26, test-12, test-13, test-14]
aliases: [demo-2-production-golden-fallback-accepted]
skills: [publish-static-demo-with-exact-sha, verify-close-and-checkpoint]
scope: [task-48, task-21, task-22, task-49, task-50, task-23, task-24, task-25, task-26, test-12, test-13, test-14]
created: 2026-07-27
updated: 2026-07-27
---
# Summary

Demo 2 is published, independently verified, rehearsed, and sealed as the
immutable golden fallback for the live presentation. The approved normal push
landed exact SHA `f6af6410cf03ae222c4ee102844a678373b35d93`;
both existing production projects are `READY` for that SHA; both public routes
pass the static, responsive, accessibility, visibility, privacy, and evidence
contracts; and the Demo 2 child goal is achieved with its own accepted
production checkpoint.

# Scope Covered

All 12 Goal 5 actionable nodes are done.

## Changed Surfaces

- The accepted Demo 2 site and graph range was normal-pushed to `origin/main`.
- Program and child mdkg task, test, goal, checkpoint, index, and event surfaces
  record publication and verification state.
- Local public-safe receipts, four production screenshots, a 16:9 reveal, and
  deterministic fallback manifests record the post-push evidence.

## Boundaries

- in scope: exact-range Git publication, read-only deployment inspection, live
  route verification, presentation rehearsal, child closeout, and fallback seal
- out of scope: manual deployment, DNS, project configuration, analytics,
  package publication, tag, force push, rewrite, or new site/deck changes
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes; receipts contain bounded identifiers, hashes, summaries, and routes

# Decisions Captured

- `dec-4`: graph-only writer leases and integration ownership
- `dec-5`: exact-SHA production authority, fix-forward, and fallback policy
- `dec-6`: artifact visibility, public safety, retention, and adoption

# Implementation Summary

Publication remained a distinct authority level after local integration. The
human receipt bound the complete fetched range and stable range hash before one
normal push. Provider inspection remained read-only. Production truth binds
Git SHA, deployment identity, route behavior, child-goal achievement, and
hash-addressed local evidence rather than relying on a successful build alone.

# Goal Closeout

- Goal condition result: achieved
- Scoped nodes closed: 12 of 12
- Remaining deferred work: Goal 6 freezes event readiness, applies three
  rehearsal findings, and prepares but does not execute Demo 3

# Verification / Testing

## Command Evidence

- `git push origin main`: normal advance `f5135be5..f6af6410`; post-push
  divergence `0 0`
- exact-SHA Vercel inspection: `mdkg-dev` and `mdkg-docs` production
  deployments both `READY` for `f6af6410`
- `npm run smoke:mdkg-dev-a11y`: passed 22 pages
- `npm run smoke:mdkg-dev`, `npm run smoke:mdkg-dev-seo`, and
  `npm run smoke:demo-graph`: passed sequentially against unchanged HEAD
- `sha256sum -c .../golden-fallback.sha256`: 30 of 30 passed
- `shasum -a 256 -c manifest.sha256`: 17 of 17 offline files passed
- child and program `mdkg validate --json`: zero warnings and zero errors at
  their recorded gates

## Pass / Fail Status

- status: pass

## Known Warnings

- The optional Git dry run could not start because the sandbox approval
  reviewer timed out twice. Explicit approval, unchanged Git invariants, and
  the actual exact normal push all passed.
- An initial parallel companion-smoke attempt raced on the shared `dist/`
  directory. The affected suites passed sequentially against unchanged HEAD.

# Known Issues / Follow-ups

- The static comparison captures the governed pre-publication handoff. Goal 6
  should frame it that way and immediately show the publication receipt.
- Lead the event reveal with the retained 16:9 image; update event notes so
  Demo 2 is no longer described as future evidence.

## Follow-up Refs

- `goal-6`, `task-27`, `task-28`, `task-29`

# Links / Artifacts

- pushed SHA: `f6af6410cf03ae222c4ee102844a678373b35d93`
- detail: `https://mdkg.dev/demo/2/`
- output: `https://mdkg.dev/demo/2/output/`
- consolidated seal: `artifacts/demo-002/golden-fallback.json`
- hash manifest: `artifacts/demo-002/golden-fallback.sha256`
- recovery: `artifacts/demo-002/golden-fallback-recovery.md`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
