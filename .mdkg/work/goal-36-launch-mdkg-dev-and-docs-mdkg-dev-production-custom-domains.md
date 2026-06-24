---
id: goal-36
type: goal
title: Launch mdkg.dev and docs.mdkg.dev production custom domains
status: progress
priority: 1
goal_state: active
goal_condition: Goal 36 is achieved when mdkg.dev serves the marketing site, www.mdkg.dev redirects to mdkg.dev, docs.mdkg.dev serves the Starlight docs site, mdkg.dev/docs redirects to docs.mdkg.dev, production custom domains are indexable, Browser/Chrome/Vercel/DNS evidence is archived, and no unrelated launch side effects occur.
scope_refs: [epic-189, epic-190, epic-191, epic-192, epic-193, spike-21, task-563, task-564, task-565, task-566, task-567, task-568, task-569, task-570, task-571, task-572, test-281, test-282, test-283, test-284, test-285, test-286, test-287, test-288]
active_node: task-564
required_skills: [select-work-and-ground-context, verify-close-and-checkpoint]
required_checks: [git status --short --branch, node dist/cli.js validate --summary --json --limit 20, node dist/cli.js doctor --strict --json, Vercel project domain verification for mdkg-dev and mdkg-docs, DNS NS SOA A CNAME checks for mdkg.dev www.mdkg.dev docs.mdkg.dev, HTTPS route checks for mdkg.dev www.mdkg.dev docs.mdkg.dev, npm --prefix mdkg-dev run build, npm --prefix docs run build, npm run docs:check, npm run smoke:mdkg-dev, npm run smoke:mdkg-dev-docs, npm run smoke:mdkg-dev-seo, Browser and Chrome production-domain QA at desktop and mobile widths, Vercel deployment and build-log verification, archived screenshots and route receipts, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [mdkg-dev, production-domain, vercel, dns, launch-readiness, browser-qa]
owners: []
links: [https://mdkg.dev/, https://www.mdkg.dev/, https://docs.mdkg.dev/, https://mdkg-dev.vercel.app/, https://mdkg-docs.vercel.app/]
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Objective

Cut over mdkg.dev from preview-only proof to production custom-domain proof. The goal covers Vercel domain attachment, Vercel DNS verification, SSL/certificate health, production indexability, the `mdkg.dev/docs` redirect to the canonical docs host, Browser/Chrome validation, screenshot and route-receipt evidence, and a public launch checklist with the announcement still deferred.

# End Condition

This goal is done only when:

- `https://mdkg.dev/` serves the mdkg marketing site over valid HTTPS.
- `https://www.mdkg.dev/` redirects to `https://mdkg.dev/` over valid HTTPS.
- `https://docs.mdkg.dev/` serves the Starlight docs site over valid HTTPS.
- `https://mdkg.dev/docs` redirects to `https://docs.mdkg.dev/`.
- Production custom domains emit production canonicals and are indexable.
- Preview `*.vercel.app` hosts remain noindex.
- Vercel project domains, deployments, and logs are verified for `mdkg-dev` and `mdkg-docs`.
- Browser and Chrome route checks pass at desktop and mobile widths.
- Screenshots and route receipts are archived as mdkg evidence.
- Final closeout confirms no npm publish, git tag, analytics activation, GitHub settings mutation, or public announcement occurred.

# Non-Goals

- No npm package publish.
- No git tag.
- No analytics activation.
- No GitHub repository settings mutation.
- No public launch announcement.
- No broad content polish beyond changes required for production domains, redirect behavior, canonical/indexability, and launch checklist proof.
- No mutation of unrelated untracked files such as `nr-banner-1.png` or `nr-banner-2.png` unless a later task explicitly scopes them.

# Recursive Algorithm

1. Ground current git state, selected goal state, Vercel project metadata, DNS delegation, SSL state, and live routes.
2. Use Chrome for any Vercel UI verification or domain-configuration confirmation that cannot be proven through the Vercel tools.
3. Verify or attach all three custom domains in the intended Vercel projects: `mdkg.dev` and `www.mdkg.dev` on `mdkg-dev`; `docs.mdkg.dev` on `mdkg-docs`.
4. Confirm GoDaddy delegation to Vercel nameservers, DNSSEC/DS record absence, Vercel DNS records, recursive DNS propagation, and SSL issuance.
5. Implement only required source changes for `mdkg.dev/docs` redirect and production canonical/indexability behavior.
6. Run local builds and smoke checks before pushing.
7. Push implementation commits only after local checks pass, then verify Vercel deployments and hosted production routes.
8. Capture Browser/Chrome screenshots and route receipts, archive selected evidence, and close with a production launch checklist.

# Required Skills

- select-work-and-ground-context
- verify-close-and-checkpoint

# Required Checks

- `git status --short --branch`
- `node dist/cli.js validate --summary --json --limit 20`
- `node dist/cli.js doctor --strict --json`
- Vercel project domain verification for `mdkg-dev` and `mdkg-docs`
- DNS `NS`, `SOA`, `A`, and `CNAME` checks for `mdkg.dev`, `www.mdkg.dev`, and `docs.mdkg.dev`
- HTTPS route checks for apex, www, docs, robots, sitemap, canonical, and metadata
- `npm --prefix mdkg-dev run build`
- `npm --prefix docs run build`
- `npm run docs:check`
- `npm run smoke:mdkg-dev`
- `npm run smoke:mdkg-dev-docs`
- `npm run smoke:mdkg-dev-seo`
- Browser and Chrome production-domain QA at desktop and mobile widths
- Vercel deployment and build-log verification
- archived screenshots and route receipts
- `git diff --check`

# Acceptance Criteria

- `mdkg.dev` is the canonical marketing host.
- `www.mdkg.dev` is a redirect-only host to `mdkg.dev`.
- `docs.mdkg.dev` is the canonical docs host.
- `mdkg.dev/docs` redirects to `docs.mdkg.dev`.
- Production custom domains are indexable immediately after verification.
- Preview `*.vercel.app` URLs remain noindex.
- Vercel projects show the expected custom domains and healthy deployments.
- DNS and SSL health are proven through command receipts and Browser/Chrome checks.
- The public launch checklist is written, but launch announcement work is deferred.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- All scoped tasks and tests are done.
- Checkpoints exist for DNS/Vercel proof, redirect/indexability proof, Browser/Chrome screenshot proof, Vercel deployment proof, launch checklist proof, and final closeout.
- Completion evidence is recorded in the goal and `goal next goal-36 --json` returns no actionable node without warnings.

# Stop Conditions

- Vercel UI or project access is unavailable.
- DNS or SSL remains inconsistent after reasonable propagation checks; checkpoint the exact failing domains and pause instead of forcing closure.
- A required source change would exceed the production-domain cutover boundary.
- A task would require npm publish, git tag, analytics activation, GitHub settings mutation, or public announcement.
- Screenshots or receipts would expose secrets, tokens, credentials, unrelated raw prompts, or private payloads.

# Current State

- mdkg graph validation is clean and no goal was selected before this goal was created.
- Untracked local files exist: `nr-banner-1.png` and `nr-banner-2.png`; leave them untouched unless separately scoped.
- Vercel project metadata most recently showed only default `*.vercel.app` domains for `mdkg-dev` and `mdkg-docs`; Chrome/Vercel UI verification is required.
- DNS is delegated to Vercel nameservers.
- `docs.mdkg.dev` serves the Starlight docs app, but still emitted `noindex` during planning.
- `mdkg.dev` returned a small placeholder/lander response during planning, not the marketing app.
- `www.mdkg.dev` redirected to apex but showed certificate mismatch behavior during planning.
- Prior production-preview polish context lives in `goal-35`, `task-562`, `test-280`, and `chk-254`; it is recorded here as narrative context rather than frontmatter routing input.

# Iteration Log

- 2026-06-24: Goal created as the production custom-domain cutover plan. Initial active node is `task-563`; after graph-only closeout, the next executable node is `task-564`.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.

# Required Checkpoints

- DNS and Vercel domain baseline proof.
- Production redirect, canonical, robots, sitemap, and indexability proof.
- Browser/Chrome desktop and mobile screenshot proof.
- Vercel deployment/domain/log proof.
- Public launch checklist with announcement deferred.
- Final closeout confirming no npm publish, tag, analytics activation, GitHub settings mutation, or public announcement.
