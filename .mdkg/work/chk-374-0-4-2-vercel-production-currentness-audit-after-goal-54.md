---
id: chk-374
type: checkpoint
title: 0.4.2 Vercel production currentness audit after goal-54
checkpoint_kind: audit
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [chk-370, chk-372, chk-373]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [goal-54, task-658, test-341, chk-373]
created: 2026-07-05
updated: 2026-07-05
---
# Summary

After `goal-54` closed and `origin/main` reached
`57733b67a4ca4df4c02e723ce9e4e6891c87ba11`, Vercel production deployments for
both public projects reached `READY` and live production-domain route checks
passed.

The generated CLI reference gap is closed live. A later review corrected one
classification error in this checkpoint: homepage launch-track copy was treated
as a release-contract gap, but `mdkg.dev` homepage copy is a public positioning
surface, not an automatic projection of internal npm, Vercel, or checkpoint
evidence. Current capability facts and release-validation details belong in
`docs.mdkg.dev`, generated CLI reference, and `CHANGELOG.md` unless a
public-copy task explicitly owns homepage wording.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- Vercel `mdkg-dev` production deployment:
  `dpl_79L5ZY7s1cC2waMY93U4E5xcRtPV`, project
  `prj_R9FJkRf2FsmcM9cuIyQbPTV9A056`, commit `57733b67`.
- Vercel `mdkg-docs` production deployment:
  `dpl_5Wg4YU2M6WfkdbiutjK1GKtqcv3M`, project
  `prj_3Aoh90VnkqNmqM6AnX9t72fSULEd`, commit `57733b67`.
- Live artifacts captured under `/private/tmp/mdkg-vercel-live-57733b67/`.
- Corrective follow-up node: `task-662`.

## Boundaries

- in scope: Vercel deployment state, Vercel build-log tail checks, production
  HTTP fetches, marker checks, and follow-up gap capture.
- out of scope: source edits, redeploy trigger beyond GitHub/Vercel automation,
  npm publish, tags, DNS changes, analytics activation, or provider mutation.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes. Evidence uses deployment ids, commit hashes, URLs, and local artifact
  paths.

# Decisions Captured

- Do not change `mdkg.dev` homepage copy solely because internal npm
  postpublish, Vercel, or checkpoint evidence advanced.
- Treat docs/reference/changelog surfaces as the release evidence surfaces.
- Track the original homepage-copy finding as a false positive and close it
  through `task-662` with docs and skill guardrails.

# Implementation Summary

No source changed in this pass. The run used the Vercel plugin to prove both
production deployments are `READY` for the pushed commit, then fetched and
searched real production routes on `mdkg.dev` and `docs.mdkg.dev`.

# Audit Findings

- Reviewed surfaces: Vercel project/deployment metadata, build logs for
  `mdkg-dev` and `mdkg-docs`, `mdkg.dev` home/quickstart/trust/demos/demo-1/
  demo-1-output/llms/sitemap, and `docs.mdkg.dev` home/install/generated CLI
  reference/changelog.
- Findings:
  - pass: both Vercel projects are `READY` for commit `57733b67`.
  - pass: build logs show successful Astro builds and expected route generation.
  - pass: live generated CLI reference includes `Git lifecycle commands`,
    `mdkg git inspect --json`, `mdkg git closeout --json`,
    `mdkg git push-ready --remote origin --branch main --json`,
    `authentication stays external`, and `system Git`.
  - pass: live changelog includes `0.4.2`, `mdkg git`, `push-ready`, and
    closeout details.
  - pass: live homepage structured data reports `softwareVersion":"0.4.2"`.
  - pass: live demo routes `/demos/`, `/demo/1/`, and `/demo/1/output/` render
    accepted demo, sanitized graph/file/output surfaces, Ocean Flow, Astro,
    React Island, noindex output route, and public-safety copy.
  - corrected: the homepage postpublish sentence was reclassified as public
    positioning copy, not a release-currentness blocker. No `mdkg.dev`
    homepage source change is required by this audit.
- Residual risk: future release audits can over-route internal operational
  evidence into public positioning copy unless skills and docs explain the
  surface boundary.

# Verification / Testing

## Command Evidence

- command: Vercel `_get_project`, `_list_deployments`, `_get_deployment`, and
  `_get_deployment_build_logs`
- result: both production deployments are `READY`, target `production`, aliased
  to the expected domains, and built commit `57733b67`.
- command: live `curl -fsSL` route fetches
- result: all fetched production routes returned successfully and were written
  under `/private/tmp/mdkg-vercel-live-57733b67/`.
- command: `rg` marker checks against fetched HTML/text artifacts
- result: expected version, Git lifecycle, docs, demo, noindex, sitemap, and
  safety markers passed. The homepage postpublish-copy finding was later
  reclassified as a false-positive release-currentness gap.

## Pass / Fail Status

- status: deployment/build/route health passed. The previous copy-gap
  classification is superseded by `task-662`.

## Known Warnings

- warning: none for `mdkg-dev` homepage source from this audit. Future audits
  should classify public surfaces before turning internal evidence into copy
  work.

# Known Issues / Follow-ups

- `task-662`: correct public-surface copy boundary and docs release evidence
  policy.

## Follow-up Refs

- `task-662`
- `goal-54`
- `chk-370`
- `chk-373`

# Links / Artifacts

- `https://mdkg.dev/`
- `https://mdkg.dev/quickstart/`
- `https://mdkg.dev/trust/`
- `https://mdkg.dev/demos/`
- `https://mdkg.dev/demo/1/`
- `https://mdkg.dev/demo/1/output/`
- `https://docs.mdkg.dev/`
- `https://docs.mdkg.dev/start-here/install/`
- `https://docs.mdkg.dev/reference/generated-cli-reference/`
- `https://docs.mdkg.dev/project/changelog/`
- `/private/tmp/mdkg-vercel-live-57733b67/`
- Vercel `mdkg-dev`: `dpl_79L5ZY7s1cC2waMY93U4E5xcRtPV`
- Vercel `mdkg-docs`: `dpl_5Wg4YU2M6WfkdbiutjK1GKtqcv3M`

# Raw Content Safety

- Evidence is summarized with refs, hashes, deployment ids, URLs, and local
  artifact paths. Raw secrets, prompts, credentials, cookies, provider payloads,
  and bulky execution traces are excluded.
