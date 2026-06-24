---
id: chk-232
type: checkpoint
title: local gates logical commits push and Vercel preview proof
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: []
links: [https://mdkg-dev.vercel.app/, https://mdkg-docs.vercel.app/, https://vercel.com/nicholas-reames-projects/mdkg-dev/Fw7niZMVdEuY6MpdXeGqWCVPEzwk, https://vercel.com/nicholas-reames-projects/mdkg-docs/AP1tZ7LZPDH7tLPJUhis2MpUCFSw]
artifacts: [/private/tmp/mdkg-goal33-chrome-qa/chrome-qa-results.json, /private/tmp/mdkg-goal33-chrome-qa/desktop-marketing-home.png, /private/tmp/mdkg-goal33-chrome-qa/desktop-docs-home.png, /private/tmp/mdkg-goal33-chrome-qa/mobile-marketing-home.png, /private/tmp/mdkg-goal33-chrome-qa/mobile-docs-home.png]
relates: [task-531]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-531]
created: 2026-06-24
updated: 2026-06-24
---
# Summary

Goal 33 implementation, local validation, logical commits, push, and Vercel preview validation are complete.

The latest source commit deployed by both Vercel projects is `478e739e29c6420d05be35f23dc5265b8e376fd9`, an explicit empty redeploy trigger created after the real noindex source fix `d2503834719fa8a7b6cbf5742c7e9007e935cbb9` did not produce a Vercel deployment event. This keeps the Vercel evidence tied to the pushed repository state without adding meaningless product-file churn.

# Scope Covered

- `task-531`
- `test-257`
- `goal-33`
- Vercel projects `mdkg-dev` and `mdkg-docs`
- Preview aliases `https://mdkg-dev.vercel.app/` and `https://mdkg-docs.vercel.app/`

## Changed Surfaces

- Marketing site and docs site were changed in prior commits for pass-3 copy, docs, metadata, noindex, and smoke coverage.
- `d250383` hardened Vercel-hosted preview noindex behavior.
- `478e739` triggered Vercel redeploys for both projects from current `origin/main`.
- This checkpoint records evidence only.

## Boundaries

- in scope: local gates, Chrome-hosted route checks, Vercel build-log verification, pushed commits, preview noindex proof.
- out of scope: DNS cutover, production promotion, analytics activation, npm publish, git tag, GitHub settings mutation, and public launch.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded.

# Decisions Captured

- `dec-39`: Plan -> Work -> Evidence remains the single public operating model.
- `dec-40`: Claims Evidence Matrix stays internal and out of public docs navigation.
- `dec-41`: analytics, DNS, production promotion, and GitHub metadata changes remain explicit launch actions.

# Implementation Summary

Final implementation commits before this checkpoint:

- `ea4559f`: pass-3 public site/docs polish.
- `fefe521`: pass-3 smoke gate.
- `daaa34c`: local evidence graph commit.
- `d250383`: Vercel preview noindex fix.
- `478e739`: explicit Vercel redeploy trigger.

# Test Proof

- Test target: marketing preview, docs preview, Vercel build outputs, local mdkg repo gates.
- Fixtures or temp repos: local Chrome evidence in `/private/tmp/mdkg-goal33-chrome-qa/`.
- Coverage gaps: in-app Browser attach timed out during local QA; Chrome plus direct HTTP checks were used as the practical browser evidence. Chrome blocks some plain-text/XML preview endpoints with `ERR_BLOCKED_BY_CLIENT`, so direct HTTP fetches verified those endpoints.

# Verification / Testing

## Command Evidence

- `npm --prefix mdkg-dev run build`: passed.
- `npm --prefix docs run build`: passed. Starlight still emits the known non-failing `Entry docs -> 404 was not found.` message.
- `npm run docs:check`: passed.
- `npm run smoke:mdkg-dev`: passed.
- `npm run smoke:mdkg-dev-docs`: passed.
- `npm run smoke:mdkg-dev-seo`: passed.
- `npm run smoke:demo-graph`: passed.
- `npm run smoke:mdkg-dev-polish-pass2`: passed.
- `npm run smoke:mdkg-dev-polish-pass3`: passed.
- `npm run build`: passed.
- `npm run test`: passed, 507 tests.
- `npm run cli:check`: passed.
- `npm run cli:contract`: passed.
- `node dist/cli.js validate --summary --json --limit 20`: passed with 0 warnings and 0 errors.
- `git diff --check`: passed.
- `git push origin main`: pushed through `478e739`.

Vercel proof:

- `mdkg-dev`: deployment `dpl_Fw7niZMVdEuY6MpdXeGqWCVPEzwk`, READY, commit `478e739`, clean build logs.
- `mdkg-docs`: deployment `dpl_AP1tZ7LZPDH7tLPJUhis2MpUCFSw`, READY, commit `478e739`, clean build logs.
- Hosted Chrome checks covered marketing `/`, `/quickstart/`, `/docs/`, `/trust/`, `/alpha/` and docs `/`, `/start-here/quickstart/`, `/reference/`, `/project/roadmap/`.
- Hosted Chrome checks found no page-level console errors, no page horizontal overflow, no bad external `target=_blank` rels, and `meta name=robots` set to `noindex, nofollow`.
- Direct HTTP checks verified `llms.txt`, `llms-full.txt`, `robots.txt`, marketing sitemap, and docs sitemap index return 200 and no secret-shaped markers. Preview sitemaps do not include `vercel.app` URLs.

## Pass / Fail Status

- status: pass

## Known Warnings

- `node dist/cli.js doctor --strict --json` is expected to report a warning for `.mdkg/db/runtime/project.sqlite` as local-only runtime state when project DB verify passes.
- Chrome blocks direct navigation to some preview text/XML endpoints with `ERR_BLOCKED_BY_CLIENT`; direct HTTP checks covered those endpoints.

# Known Issues / Follow-ups

- Future launch work still needs DNS cutover, production promotion, analytics decision, and GitHub metadata mutation as explicit separate actions.
- Generated demo visuals and terminal-demo assets remain follow-up work and are not canonical proof yet.

## Follow-up Refs

- `task-532`
- `task-533`
- future launch/DNS goal

# Links / Artifacts

- Marketing preview: https://mdkg-dev.vercel.app/
- Docs preview: https://mdkg-docs.vercel.app/
- Marketing deployment: https://vercel.com/nicholas-reames-projects/mdkg-dev/Fw7niZMVdEuY6MpdXeGqWCVPEzwk
- Docs deployment: https://vercel.com/nicholas-reames-projects/mdkg-docs/AP1tZ7LZPDH7tLPJUhis2MpUCFSw
- Local Chrome QA artifact: `/private/tmp/mdkg-goal33-chrome-qa/chrome-qa-results.json`

# Raw Content Safety

- Evidence is summarized using commands, refs, commit hashes, deployment ids, and artifact paths. No raw secrets, raw prompts, raw payloads, or bulky execution traces are embedded.
