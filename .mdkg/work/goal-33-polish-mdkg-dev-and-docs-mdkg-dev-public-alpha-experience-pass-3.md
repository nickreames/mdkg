---
id: goal-33
type: goal
title: Polish mdkg.dev and docs.mdkg.dev public-alpha experience pass 3
status: progress
priority: 1
goal_state: active
goal_condition: Goal 33 is achieved when mdkg.dev and docs.mdkg.dev implement the pass-3 feedback, public command examples are validated, scaffold/meta commentary is removed, Plan -> Work -> Evidence is the single public model, docs are user-first, preview noindex/metadata/link behavior is verified, local Browser/Chrome QA passes, local gates pass, logical commits are pushed to origin/main, Vercel previews redeploy successfully, and no launch side effects occur.
scope_refs: [epic-165, epic-166, epic-167, epic-168, epic-169, epic-170, epic-171, spike-18, task-520, task-521, task-522, task-523, task-524, task-525, task-526, task-527, task-528, task-529, task-530, task-531, test-249, test-250, test-251, test-252, test-253, test-254, test-255, test-256, test-257]
active_node: task-521
required_skills: [select-work-and-ground-context, verify-close-and-checkpoint]
required_checks: [git status --short --branch, npm --prefix mdkg-dev run build, npm --prefix docs run build, npm run docs:check, npm run smoke:mdkg-dev, npm run smoke:mdkg-dev-docs, npm run smoke:mdkg-dev-seo, npm run smoke:demo-graph, npm run smoke:mdkg-dev-polish-pass2, npm run smoke:mdkg-dev-polish-pass3, npm run build, npm run test, npm run cli:check, npm run cli:contract, node dist/cli.js validate --summary --json --limit 20, node dist/cli.js doctor --strict --json, Browser local E2E for marketing/docs routes, Chrome local and hosted preview inspection, Vercel deployment/log verification for mdkg-dev and mdkg-docs, git diff --check]
max_iterations: 30
blocked_after_attempts: 3
tags: [mdkg-dev, public-alpha, polish, pass-3, browser, chrome, vercel-preview]
owners: []
links: [https://mdkg-dev.vercel.app/, https://mdkg-docs.vercel.app/]
artifacts: [pasted-text.txt, mdkg.dev polish pass 3 feedback]
relates: [task-519, test-248]
blocked_by: []
blocks: []
refs: [archive://archive.mdkg-dev-polish-pass-3-2026-06-24]
context_refs: []
evidence_refs: []
aliases: [mdkg-dev-polish-pass-3]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-06-24
updated: 2026-06-24
---
# Objective

Turn the attached pass-3 feedback into one implementation-ready mdkg.dev polish goal and then execute it in a later pass. The implementation target is not new product surface area; it is public trust, copy consistency, command correctness, docs usability, preview SEO behavior, and complete Browser/Chrome/Vercel evidence.

# End Condition

`goal-33` is done only when all scoped implementation tasks and tests are closed, required checkpoints exist, all required checks pass, logical commits are pushed to `origin/main`, existing Vercel previews for `mdkg-dev` and `mdkg-docs` redeploy successfully, and final evidence confirms no DNS, production promotion, npm publish, git tag, analytics activation, GitHub settings mutation, or public launch announcement occurred.

# Source Evidence

- `archive://archive.mdkg-dev-polish-pass-3-2026-06-24`
- Public preview context: `https://mdkg-dev.vercel.app/` and `https://mdkg-docs.vercel.app/`
- Prior closeout: `goal-32`, `chk-224`

# Planning Context

These references ground the implementation plan but are intentionally not in
frontmatter `scope_refs`; only executable work belongs in the goal route.

- Prior implementation goals: `goal-30`, `goal-31`, `goal-32`
- Prior product/design context: `prd-6`, `prd-7`, `edd-34`, `edd-35`, `edd-36`, `edd-37`, `edd-38`
- Prior decisions: `dec-37`, `dec-38`
- Prior closeout evidence: `chk-224`
- Deferred visual/demo context: `task-519`, `test-248`

# Product Defaults

- Public workflow language is only `Plan -> Work -> Evidence`.
- Beginner command examples prefer canonical forms; variants move to reference docs.
- `/docs` on marketing is a minimal bridge or redirect with no Starlight/GitBook/scaffold language.
- `llms.txt` serves readable `text/plain` with preserved headings, bullets, links, and line breaks.
- Claims Evidence Matrix remains internal/noindex and is not in public docs navigation.
- CLI Reference starts with user-facing command selection.
- Command Contract is explicitly maintainer/integration-facing.
- Roadmap is product-oriented and excludes DNS, Vercel, analytics, and launch chores.
- Preview deployments emit noindex; future production domains are indexable with production canonicals.
- Vercel Analytics is deferred to an explicit production launch action.
- GitHub repo description/settings mutation is a handoff only.
- Generated image/video/demo assets remain follow-up work unless explicitly pulled into an implementation task.

# Execution Sequence

1. Lock boundary and validate source archive with `task-520` / `test-249`.
2. Normalize all public command examples before changing copy broadly.
3. Remove public scaffold/meta commentary and fix docs bridge/nav/TOC/link behavior.
4. Polish homepage narrative and Plan -> Work -> Evidence explanation.
5. Rewrite user-facing docs pages and separate maintainer/integration references.
6. Harden SEO, metadata, noindex, sitemap, robots, `llms.txt`, and external links.
7. Align README/package/site/docs wording and create GitHub metadata handoff only.
8. Add pass-3 smokes.
9. Run local Browser/Chrome QA.
10. Run gates, commit, push, verify Vercel previews, and close evidence.

# Required Checkpoints

- `chk-225`: pass-3 boundary, source archive, and story-map lock.
- `chk-226`: command example validation and meta-commentary cleanup proof.
- `chk-227`: homepage narrative, operating model, and trust polish proof.
- `chk-228`: Starlight docs IA/content/reference proof.
- `chk-229`: SEO, llms, metadata, links, noindex, and canonical proof.
- `chk-230`: README/package/site/docs copy parity and demo follow-up proof.
- `chk-231`: local Browser/Chrome desktop/tablet/mobile QA proof.
- `chk-232`: local gates, logical commits, push, and Vercel preview proof.
- `chk-233`: final goal-33 closeout with files changed, routes changed, validation commands, known blockers, deferred side effects, and next steps.

Each checkpoint must record commands run, pass/fail state, affected routes/docs, known warnings, screenshots or receipt refs where useful, and explicit no-secret/no-launch boundary confirmation.

# Stop Conditions

- Any step would require DNS changes, Vercel production promotion, analytics activation, npm publish, git tag, GitHub settings mutation, public launch announcement, or storing provider secrets in mdkg.
- Vercel or GitHub authentication is unavailable for preview verification after local implementation work; record the blocker and stop before unsafe fallback.
- Browser/Chrome QA finds a defect that cannot be fixed without expanding scope beyond public polish and docs trust.

# Current State

`goal-33` is the selected active root goal. The mdkg-only setup node `task-520` and creation contract `test-249` are done. The next implementation node is `task-521`, which validates and normalizes public command examples before broader copy or docs edits.

# Completion Evidence

Pending future implementation.
