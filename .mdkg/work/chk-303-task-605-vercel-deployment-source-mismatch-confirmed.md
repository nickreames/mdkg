---
id: chk-303
type: checkpoint
title: task-605 Vercel deployment source mismatch confirmed
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-605]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-605, test-308]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

Read-only Vercel inspection confirmed the production projects were healthy but
not source-current with the local goal-42 work. At inspection time, both
`mdkg-dev` and `mdkg-docs` latest production deployments were `READY`, but both
were built from commit `5e425eeb21a856e5110bf2ee5c89d3773fbd402d`, while local
`main` was ahead by three commits and local `HEAD` was `ee74f77`. Later
graph-only evidence commits increased the local ahead count; the deployment
source mismatch remains unresolved until `main` is pushed and Vercel rebuilds.

# Scope Covered

Scope is `task-605` and `test-308`: determine why public mdkg.dev and
docs.mdkg.dev are not live-current and preserve exact deployment facts for the
next approved push/deploy verification pass.

## Changed Surfaces

- mdkg checkpoint evidence only.
- Generated mdkg index refreshed by `mdkg checkpoint new`.
- Later refresh added read-only public HTML snapshots:
  `/private/tmp/mdkg-goal42-live-refresh-mdkg-dev.html` and
  `/private/tmp/mdkg-goal42-live-refresh-docs-changelog.html`.
- No source, docs, package, deploy, DNS, analytics, tag, or npm state changed.

## Boundaries

- in scope: read-only Vercel project/deployment metadata for known projects
  `mdkg-dev` and `mdkg-docs`.
- out of scope: Vercel deploy, git push, production promotion, DNS changes,
  analytics activation, `0.4.0` npm publish, and tag creation.
- no Vercel tokens, cookies, private provider UI contents, deployment bypass
  secrets, raw prompts, or raw payloads were stored.

# Decisions Captured

- The live-current gap is explained by deployment source mismatch: production
  was still built from pushed commit `5e425ee`, not from the local goal-42
  source commit `7050eba` or later graph evidence commits.
- The next meaningful task-605 execution needs explicit approval to push local
  commits and allow Vercel production deployments to rebuild before Browser or
  Chrome live verification can pass.
- Do not mark `task-605` done from local proof alone.

# Implementation Summary

The Vercel connector was used in read-only mode only. It inspected the existing
projects and recent deployments:

- project `mdkg-dev`: `prj_R9FJkRf2FsmcM9cuIyQbPTV9A056`
- project `mdkg-docs`: `prj_3Aoh90VnkqNmqM6AnX9t72fSULEd`
- team: `team_RkZhrKQs9wWs6PAdTcrwZ87z`

Both projects still point at GitHub repo `nickreames/mdkg` on branch `main` and
auto-deploy production from pushed commits.

# Test Proof

- Test target: Vercel project and deployment metadata for `mdkg-dev` and
  `mdkg-docs`.
- Local git target: `origin/main...HEAD`.
- Coverage gap: read-only Vercel metadata proves current deployment source; it
  does not perform the needed push, redeploy, production route QA, or Chrome
  verification.

# Verification / Testing

## Command Evidence

- Refresh after local graph-only evidence commits:
  - `git fetch origin main`: completed without push or remote mutation.
  - `git status --short --branch`: `main...origin/main [ahead 6]`.
  - `git rev-list --left-right --count origin/main...HEAD`: `0 6`.
  - `https://mdkg.dev/` public HTML snapshot:
    `softwareVersion` is still `0.3.7`; the page does not contain `0.3.9`,
    `COLLABORATION.md`, config overlay copy, or custom skill mirror copy.
  - `https://docs.mdkg.dev/project/changelog/` public HTML snapshot contains
    `0.3.9`, `0.3.8`, `COLLABORATION.md`, and custom mirror text, but still
    lacks release-card/grid markers from the current source.
- `git rev-list --left-right --count origin/main...HEAD` at inspection time:
  `0 3`.
- `git log --oneline origin/main..HEAD` at inspection time: local ahead commits
  were:
  - `ee74f77 graph: record goal-42 live currentness gap`
  - `f0ab3a1 graph: record goal-42 local launch proof`
  - `7050eba docs: advance goal-42 launch readiness`
- Vercel `get_project` for `mdkg-dev`: latest deployment
  `dpl_4yatTd1Zd9DNRoJ3YFEgSrVAFrg7`, state `READY`, target `production`,
  domains include `mdkg.dev`, `www.mdkg.dev`, and `mdkg-dev.vercel.app`.
- Vercel `list_deployments` for `mdkg-dev`: latest production deployment
  commit SHA is `5e425eeb21a856e5110bf2ee5c89d3773fbd402d`, commit message
  `graph: record mdkg 0.3.9 publish evidence`.
- Vercel `get_project` for `mdkg-docs`: latest deployment
  `dpl_GLHR1LZ8LZcpbhe95QWpMsfWQArz`, state `READY`, target `production`,
  domains include `docs.mdkg.dev` and `mdkg-docs.vercel.app`.
- Vercel `list_deployments` for `mdkg-docs`: latest production deployment
  commit SHA is `5e425eeb21a856e5110bf2ee5c89d3773fbd402d`, commit message
  `graph: record mdkg 0.3.9 publish evidence`.

## Pass / Fail Status

- status: pass for read-only diagnosis; fail/incomplete for task-605 live
  currentness until approved push and Vercel redeploy occur.

## Known Warnings

- Vercel metadata dates are provider timestamps; the durable source fact is the
  deployment commit SHA mismatch.

# Known Issues / Follow-ups

- Get explicit approval before `git push origin main`.
- After push, wait for both Vercel projects to produce `READY` deployments from
  the pushed commit.
- Verify build logs for both deployments.
- Re-run live Browser/Chrome checks against `https://mdkg.dev/` and
  `https://docs.mdkg.dev/project/changelog/`.
- Close `task-605` and `test-308` only after production reflects local source:
  homepage `softwareVersion` must be current, mdkg.dev customization copy must
  be visible, and docs changelog must include release cards/details and custom
  mirror coverage.

## Follow-up Refs

- `task-605`
- `test-308`
- `task-606`

# Links / Artifacts

- `mdkg-dev` project: `prj_R9FJkRf2FsmcM9cuIyQbPTV9A056`
- `mdkg-dev` current production deployment:
  `dpl_4yatTd1Zd9DNRoJ3YFEgSrVAFrg7`
- `mdkg-docs` project: `prj_3Aoh90VnkqNmqM6AnX9t72fSULEd`
- `mdkg-docs` current production deployment:
  `dpl_GLHR1LZ8LZcpbhe95QWpMsfWQArz`
- local source commits awaiting push/deploy: `7050eba`, `f0ab3a1`,
  `ee74f77`
- later graph-only evidence commits may appear above these in local history;
  they do not change the deployment-source requirement.

# Raw Content Safety

- This checkpoint stores bounded public/project identifiers, deployment IDs,
  commit SHAs, and summary results only. It contains no tokens, cookies,
  credentials, private provider UI text, raw prompts, raw payloads, or bulky
  logs.
