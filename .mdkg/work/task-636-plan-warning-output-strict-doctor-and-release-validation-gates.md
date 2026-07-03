---
id: task-636
type: task
title: plan warning output strict doctor and release validation gates
status: done
priority: 1
tags: [goal-48, warnings, doctor, release-gates]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-48]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-02
updated: 2026-07-02
---
# Overview

Plan warning output, strict-doctor behavior, and package/release validation
gates for any accepted generic contract-profile release.

This task also owns closeout-evidence requirements for the later execution
goal.

# Acceptance Criteria

- Warning output is planned for profile-specific fields, raw-content markers,
  deprecated aliases, missing refs, invalid hashes, and unknown profile values.
- Strict doctor guidance says which warnings remain non-fatal and which become
  strict errors.
- Package/release validation plan includes build, unit tests, CLI checks,
  workflow validation, scaffold/upgrade smoke, docs/reference checks, npm pack
  dry-run, package payload review, registry-currentness check, and post-release
  verification if publish is later authorized.
- Closeout evidence plan includes exact changed files, command receipts, local
  commit SHA, remaining dirty state, and explicit no-push status.
- No npm publish, version bump, tag, push, or package metadata mutation occurs
  under this planning goal.

# Files Affected

- Planning updates under `.mdkg/work/**`.
- Future release execution may touch source/tests/docs/package surfaces only
  under a separate explicit execution goal.

# Implementation Notes

- Keep `mdkg validate --changed-only --json` and
  `mdkg validate --summary --limit 20 --json` in the local closeout lane.
- Include `git diff --check` and `git diff --cached --name-status` before a
  local commit.
- Resolve the package version from live package/registry state during the later
  release execution pass.

# Test Plan

- `test-330`
- `test-331`
- `test-332`

# Warning, Doctor, And Release Gate Plan

## Warning Output Plan

Future diagnostics should use stable ids and categories so CLI output,
`--json`, `--summary`, and docs can stay aligned.

| Condition | Proposed diagnostic category | Generic severity | Profile/strict severity |
| --- | --- | --- | --- |
| Unknown but well-shaped `contract_profile` | `contract-profile.unknown` | warning | error when allowlist is active |
| Ambiguous bare `profile` | `contract-profile.ambiguous-field` | warning | error |
| Unknown `receipt_kind` | `receipt-kind.unknown` | warning | error when profile allowlist is active |
| Malformed `receipt_kind` | `receipt-kind.invalid` | error | error |
| Unknown `redaction_class` | `redaction-class.unknown` | warning | error when profile allowlist is active |
| Malformed `redaction_class` | `redaction-class.invalid` | error | error |
| `redaction_class` without `redaction_policy` | `redaction-class.missing-policy` | warning | error |
| Raw prompt/payload/secret markers | existing `raw-content.*` plus profile severity metadata | warning | configurable error |
| Runtime-only field in generic mode | `contract-profile.runtime-only-field` | warning | error unless profile declares it |
| Invalid refs/hashes | existing validation categories | error | error |

Warnings must never print raw secret, prompt, token, provider payload, queue
payload, or bulky runtime content. They should report ids, qids, paths, fields,
and remediation.

## Strict Doctor Guidance

`mdkg doctor --strict` or a successor strict gate should:

- remain non-mutating;
- treat malformed fields, invalid refs, invalid hashes, missing required refs,
  and rejected receipt verification as errors;
- allow default generic raw-content warnings to remain warnings unless strict
  profile config asks to escalate them;
- report unknown profile/kind/class values as warnings in generic mode and
  errors when a profile allowlist is configured;
- recommend `mdkg work validate --profile <profile>` or the accepted successor
  command once implemented;
- keep SPEC/MANIFEST compatibility warnings separate from contract-profile
  diagnostics.

## Future Implementation Gate

Before a future implementation task can mark contract-profile support complete:

- `src/graph/agent_file_types.ts` accepts selected optional fields and rejects
  malformed values.
- `src/commands/validate.ts` and `src/commands/work.ts` emit stable typed
  diagnostics without raw content.
- `src/commands/new.ts`, `src/commands/work.ts`, and `src/cli.ts` expose only
  implemented flags.
- `.mdkg/templates/default/**`, `assets/init/**`, `dist/init/**`, docs, and
  generated refs are updated only after validator/CLI behavior is proven.
- Valid and invalid fixtures cover MANIFEST, WORK, WORK_ORDER, RECEIPT, raw
  marker severity, profile unknowns, receipt kind, redaction class, policy refs,
  and runtime-only field boundaries.

## Future Release Validation Gate

Resolve the actual target version at execution time from live package and
registry state. Do not copy a hardcoded version from this planning goal.

Required prepublish checks for the later execution goal:

- `git fetch origin main`
- `git status --short --branch`
- `git log --oneline origin/main..HEAD`
- `git diff --name-status origin/main..HEAD`
- `npm ci`
- `npm run build`
- `npm run test`
- `npm run cli:check`
- `npm run cli:contract`
- `npm run docs:check`
- `node scripts/assert-publish-ready.js`
- `node dist/cli.js validate --json`
- `node dist/cli.js validate --changed-only --json`
- focused workflow/profile fixture tests added by the implementation pass
- scaffold/upgrade smoke covering fresh init and customized repo preservation
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
- package payload review for CLI, dist init assets, templates, docs, changelog,
  and postinstall script
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run --registry=https://registry.npmjs.org/`
- registry availability checks for latest and target version

Publishing, tagging, pushing, or downstream repo mutation require a later
explicit approval after dry-run gates pass.

## Post-Release Validation Gate

If a later goal publishes, it must record:

- `npm view mdkg version --registry=https://registry.npmjs.org/`;
- `npm view mdkg dist-tags --json --registry=https://registry.npmjs.org/`;
- isolated temp global install of `mdkg@latest`;
- installed `mdkg --version`;
- fresh temp workspace `mdkg init --agent`;
- `mdkg validate --json`;
- `mdkg new manifest|work|work_order|receipt` probes for accepted fields;
- `mdkg work validate` or accepted profile validator probes;
- `mdkg upgrade --dry-run --json` and any authorized `--apply` receipt;
- no-secret/raw-content sanity over generated fixtures;
- final no-push/no-tag/no-deploy boundary unless explicitly approved.

## Closeout Evidence Required

The later implementation/release goal must close with:

- exact changed files and generated files;
- command receipts with pass/fail status;
- package version source and registry state;
- npm pack payload summary;
- publish dry-run or real publish receipt depending on approval;
- temp install path and command results;
- local commit SHA;
- dirty-state report;
- explicit remaining gaps or publish-readiness recommendation.

This planning goal itself must close with mdkg graph evidence only and no
functional source/package/docs/template/downstream changes.

# Links / Artifacts

- `goal-48`
