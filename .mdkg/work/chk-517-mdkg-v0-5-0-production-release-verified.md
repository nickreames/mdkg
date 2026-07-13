---
id: chk-517
type: checkpoint
title: mdkg v0.5.0 production release verified
checkpoint_kind: goal-closeout
status: done
priority: 9
tags: [release, production, browser, npm, v0.5.0]
owners: []
links: [https://github.com/nickreames/mdkg/actions/runs/29261414020, https://mdkg-3bxzlvyba-nicholas-reames-projects.vercel.app, https://mdkg-docs-fabyml02d-nicholas-reames-projects.vercel.app]
artifacts: [artifact://npm/mdkg/0.5.0, artifact://github-actions/run/29261414020, artifact://vercel/deployment/5426663518, artifact://vercel/deployment/5426664786]
relates: [goal-64, epic-235, task-723, test-394]
blocked_by: []
blocks: []
refs: [dec-69, dec-81, chk-513, chk-514, chk-515, chk-516]
context_refs: [goal-64, epic-235, task-723, test-394]
evidence_refs: [chk-513, chk-514, chk-515, chk-516]
aliases: []
skills: []
scope: [task-723]
created: 2026-07-13
updated: 2026-07-13
---
# Summary

`mdkg@0.5.0` is published, installed, deployed, and verified. The final
fix-forward commit `3224551243e5d58ce9f5b5198b602b7d87d63f38` is on
`origin/main`, passed exact-SHA CI, and reached both Vercel production projects.
Current-run desktop/mobile and live-source checks found no release-blocking
defect. Goal 64 can close achieved without another scan, publish, tag, global
replacement, or deployment mutation.

# Scope Covered

- Package release commit: `7afbf6d8df58279f70c6257b65437791fec59e63`.
- Website activation commit: `b337ff8d69664908ddf0690a7878cba0ec145a6d`.
- Published-state repair commit: `b265da717ee5365bd83362db6b83150cb603da5c`.
- Final docs Edit-page fix: `3224551243e5d58ce9f5b5198b602b7d87d63f38`.
- Completed node and acceptance lane: `task-723`, `test-394`.

## Changed Surfaces

- GitHub Actions run `29261414020` passed the Node `24.15.0` and Node `24.x`
  package gates for the final exact SHA.
- Vercel deployments `5426663518` (`mdkg-dev`) and `5426664786`
  (`mdkg-docs`) completed successfully for that SHA.
- Public mdkg.dev and docs.mdkg.dev content, navigation, metadata, links,
  responsive layouts, keyboard focus, and release wording were rechecked live.

## Boundaries

- in scope: final read-only production, registry, browser, and release receipt
- out of scope: npm republish, another security scan, Git tag, unrelated work
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- `dec-69`: no tag by default and fix forward after publication.
- `dec-81`: manual source-backed requalification is the accepted v0.5.0
  security gate; another Codex Security scan is neither required nor run.
- The bounded release approval recorded before publication covered all completed
  external mutations; no additional approval cycle was needed for observation.

# Implementation Summary

- The live audit discovered one incorrect monorepo Edit-page prefix, fixed it in
  `32245512`, added regression coverage, and verified the corrected production
  URL contains `/edit/main/docs/src/content/docs/loops/security-audit.md`.
- Npm `latest` resolves to `0.5.0`; SHA-1 is
  `e2912a1069761b392fc9ed2c713ecb4bd690758e`; integrity is
  `sha512-n3k5Sjn7PcNk5gnEkGIVdeYyRBZ9A0UG6hkneEro1vRWTP3+XXy4HKVdbJ1AcnnJE6JGvQWdv8ayHmqEqxvYLQ==`.
- `/opt/homebrew/bin/mdkg --version` and the resolved `mdkg` command both report
  `0.5.0`. No `v0.5.0` Git tag exists.

# Verification / Testing

## Command Evidence

- Live HTTP `200`: homepage, quickstart, all four loop pages, install, generated
  CLI reference, changelog, docs robots/sitemap, and mdkg.dev LLM files.
- Browser: current-run 1440x1000 and 390x844 captures for homepage, loop
  announcement, loop overview, and security walkthrough; no horizontal overflow,
  duplicate IDs, console warnings, or console errors.
- Metadata: exact canonicals, one H1, `lang=en`, responsive viewport, published
  `v0.5.0` and `Pre-v1 public alpha` wording, and corrected Edit-page links.
- Keyboard: Chrome focused the homepage brand link with a 3px solid indicator
  and the docs Skip-to-content link was visible and focused.
- Serial local checks passed: site smoke (11 files), docs smoke (68 files), SEO,
  accessibility (19 pages), and performance budgets.
- Public-output scan found no high-risk token, private path, scan id, or recovery
  token pattern in the fetched release surfaces.

## Pass / Fail Status

- status: done

## Known Warnings

- GitHub Actions emitted nonblocking action-runtime deprecation notices for
  `actions/checkout@v4` and `actions/setup-node@v4`.
- Installed security forks retain five recommended-heading advisories on
  generated child nodes; validation has zero errors.
- Browser and automated checks are strong release evidence but are not a claim
  of exhaustive WCAG conformance.

# Known Issues / Follow-ups

- Upgrade GitHub actions when supported and improve generated child headings in
  a future patch. Neither item blocks v0.5.0 correctness or publication.

## Follow-up Refs

- No release-blocking follow-up remains.

# Links / Artifacts

- `artifact://npm/mdkg/0.5.0`
- `artifact://github-actions/run/29261414020`
- `artifact://vercel/deployment/5426663518`
- `artifact://vercel/deployment/5426664786`
- Current-run screenshots:
  `/private/tmp/mdkg-goal64-final-home-desktop-top.png`,
  `/private/tmp/mdkg-goal64-final-home-loop-desktop.png`,
  `/private/tmp/mdkg-goal64-final-loops-desktop.png`,
  `/private/tmp/mdkg-goal64-final-security-desktop.png`,
  `/private/tmp/mdkg-goal64-final-home-loop-mobile.png`, and
  `/private/tmp/mdkg-goal64-final-security-mobile.png`.

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
