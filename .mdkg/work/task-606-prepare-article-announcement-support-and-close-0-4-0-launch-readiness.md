---
id: task-606
type: task
title: prepare article announcement support and close 0.4.0 launch readiness
status: done
priority: 2
epic: epic-204
parent: goal-42
tags: [0.4.0, article, announcement, closeout, launch]
owners: []
links: []
artifacts: [https://mdkg.dev/, https://docs.mdkg.dev/project/changelog/, /private/tmp/mdkg-0.4.0-chrome-live-20260627/chrome-live-validation-receipt.json]
relates: []
blocked_by: [task-601, task-602, task-603, task-604, task-605, task-612, test-316, task-613, test-317, task-614, task-615, test-318, task-616, test-319, task-617, test-320, test-307, test-308, test-309, test-310]
blocks: [test-311, test-312]
refs: [task-601, task-602, task-603, task-604, task-605, task-612, test-316, task-613, test-317, task-614, task-615, test-318, task-616, test-319, task-617, test-320, chk-311, chk-312, chk-313, chk-314, chk-315, chk-316, chk-317, chk-318, chk-319, chk-320, chk-321, chk-322, chk-323]
context_refs: []
evidence_refs: [chk-307, chk-310, chk-324]
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-26
updated: 2026-06-27
---
# Overview

Prepare the final article announcement support package and close the `0.4.0`
launch-readiness lane only after source release prep, npm publish/postpublish
validation, Vercel deployment/currentness, and Chrome live proof are complete.

# Acceptance Criteria

- Article support references launch pages, release notes, and source-backed
  product claims.
- Git/changelog audit maps every publish-bound change to the `0.4.0`
  changelog/release notes, version references, tests, docs/site changes,
  browser proof, npm package payload, and postpublish validation.
- Full package pre-publish gates, npm pack dry-run, and npm publish dry-run
  pass before any ready recommendation.
- Real `mdkg@0.4.0` npm publish and postpublish validation are complete only
  after explicit approval.
- Public deploy verification proves mdkg.dev and docs.mdkg.dev are live-current
  for 0.4.0 release facts after explicit Vercel/push approval.
- Chrome live receipts prove production pages expose 0.4.0 version metadata,
  changelog/release-note coverage, navigation, CTA rendering, SEO, and no-secret
  expectations.
- A closeout checkpoint records public launch readiness, known boundaries, and
  any required follow-ups.
- The closeout recommends either `launch ready` after completed approval-gated
  publish/deploy validation or lists exact remaining gaps.
- No real git tag, push, deploy, DNS, analytics, or provider mutation happens
  outside explicit approval boundaries recorded in evidence.

# Files Affected

- mdkg checkpoint/goal closeout evidence
- handoff copy or article-support artifact if requested

# Implementation Notes

- Use June 28, 2026 as the article target date.
- Keep article claims aligned with `CHANGELOG.md` and validated public pages.
- Treat npm publish and public deploy/launch as separate approval boundaries;
  this task cannot close until both have either passed with evidence or are
  recorded as exact blockers.
- `test-311` and `test-312` validate this closeout task after it runs; they do
  not block this task from becoming actionable once upstream website/docs,
  Browser/Chrome, SEO, no-secret, and example proof is complete.

# Test Plan

- `node dist/cli.js validate --json`
- `node dist/cli.js goal next goal-42 --json`
- `git log --oneline origin/main..HEAD`
- `git diff --name-status origin/main..HEAD`
- changelog/release note mapping for every publish-bound change
- `npm run build`
- `npm run test`
- `npm run cli:check`
- `npm run cli:contract`
- `npm run docs:check`
- `node scripts/assert-publish-ready.js`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run --registry=https://registry.npmjs.org/`
- real npm publish receipt after explicit approval
- npm postpublish registry/dist-tag/temp-install receipt
- Vercel production deployment and domain currentness receipt
- Product Design audit receipt
- Browser local desktop/mobile receipts
- Chrome live production verification receipts
- `git diff --check`
- `test-311`
- `test-312`

# Launch Readiness Recommendation

Recommended status: `launch ready`.

The `0.4.0` package and public launch surfaces have the required evidence:
source release prep, full local gates, npm pack/publish dry-run, real npm
publish after approval, postpublish temp install/probes, Vercel currentness,
live Chrome desktop/mobile validation, docs changelog coverage, SEO metadata,
CTA polish, and public no-secret sanity.

# Article Support

Article-safe claims for the June 28, 2026 announcement:

- mdkg is a local-first, Git-native project memory loop for AI coding agents.
- The 0.4.0 release makes `mdkg.dev` and `docs.mdkg.dev` launch-current for the
  public alpha surface.
- Public pages now describe config overlays, arbitrary skill mirror paths,
  `COLLABORATION.md`, and canonical `MANIFEST.md` naming with legacy bridge
  behavior.
- The release has npm publish/postpublish proof, Vercel production currentness,
  Chrome live validation, and public no-secret sanity evidence.

Boundaries for article copy:

- Do not claim hosted execution, analytics activation, DNS changes, demo
  subdomain promotion, or downstream repo upgrades unless separately completed.
- Treat June 28, 2026 as announcement timing context, not an authorization for
  any further publish/deploy/publication side effect.

# Links / Artifacts

- `goal-42`
