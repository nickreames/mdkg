---
id: chk-199
type: checkpoint
title: mdkg-dev Browser evidence archived
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-461, test-210]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: [chk-196, chk-197, chk-198]
aliases: []
skills: []
scope: [task-461]
created: 2026-06-22
updated: 2026-06-22
---
# Summary

Selected mdkg.dev Browser E2E evidence has been archived as a private mdkg archive artifact and verified. The archive contains the bounded Browser/local-HTTP JSON receipt plus five reviewed viewport screenshots.

# Scope Covered

`task-461` and `test-210` covered evidence archive, no-secret, launch-boundary, and demo-subgraph evidence.

## Changed Surfaces

- `.mdkg/archive/archive.mdkg-dev-browser-e2e-goal26-2026-06-22/**`
- `.mdkg/work/chk-199-*`
- `/private/tmp/mdkg-dev-browser-e2e.2026-06-22-goal26.zip` temporary source bundle

## Boundaries

- in scope: selected evidence packaging, private archive sidecar creation, archive verification, and checkpoint evidence.
- out of scope: public archive visibility, publish, deploy, DNS, Vercel production promotion, GitBook production sync, tag, push, global install, and external child-repo mutation.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded: yes.

# Decisions Captured

- edd-30: quality, accessibility, performance, and no-secret gate contract.

# Implementation Summary

The selected Browser evidence files were zipped from `/private/tmp/mdkg-dev-browser-e2e.2026-06-22-goal26` and registered through `mdkg archive add` as a private artifact. The raw source copy is ignored under `.mdkg/archive/**/source/`; the sidecar metadata and compressed cache are the commit-eligible archive record.

# Test Proof

- Test target: archive sidecar and compressed cache for Browser evidence.
- Fixtures or temp repos: `/private/tmp/mdkg-dev-browser-e2e.2026-06-22-goal26.zip`.
- Coverage gaps: none for selected evidence archive; full release gates continue in task-462.

# Verification / Testing

## Command Evidence

- command: `zip -j /private/tmp/mdkg-dev-browser-e2e.2026-06-22-goal26.zip ...`
  result: zipped receipt plus five viewport screenshots.
- command: `node dist/cli.js archive add /private/tmp/mdkg-dev-browser-e2e.2026-06-22-goal26.zip --id archive.mdkg-dev-browser-e2e-goal26-2026-06-22 --kind artifact --visibility private --title "mdkg.dev Browser E2E screenshots and receipt" ... --json`
  result: archive created with `archive://archive.mdkg-dev-browser-e2e-goal26-2026-06-22`.
- command: `node dist/cli.js archive verify archive://archive.mdkg-dev-browser-e2e-goal26-2026-06-22 --json`
  result: `ok: true`, raw_present true, compressed_present true, errors [].

## Pass / Fail Status

- status: pass.

## Known Warnings

- warning: archive is private and should not be treated as a public website artifact.

# Known Issues / Follow-ups

- Full release gate chain still pending in task-462.

## Follow-up Refs

- task-462
- test-211

# Links / Artifacts

- archive://archive.mdkg-dev-browser-e2e-goal26-2026-06-22
- chk-196
- chk-197
- chk-198

# Raw Content Safety

- The archive contains local public-alpha page screenshots and a bounded JSON receipt. The evidence was reviewed/scanned for raw secret-like markers before archive; no raw secrets, raw prompt text, provider payloads, credentials, tokens, private Browser data, or bulky execution traces were stored.
