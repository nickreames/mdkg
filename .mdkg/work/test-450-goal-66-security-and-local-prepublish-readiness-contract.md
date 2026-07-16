---
id: test-450
type: test
title: goal-66 security and local prepublish readiness contract
status: done
priority: 1
parent: goal-66
prev: test-454
next: task-751
tags: [goal-66, test, security, prepublish, package, 0.5.2]
owners: []
links: []
artifacts: []
relates: [task-746, task-747, task-748, task-749, task-750, bug-2, test-452, bug-3, test-453, task-791, test-454]
blocked_by: [test-411, test-412, test-413, test-414, test-415, test-452, test-453, test-454]
blocks: [task-751]
refs: [goal-66, goal-67, edd-73, dec-75, dec-76, dec-77, dec-78]
context_refs: [goal-65, goal-71]
evidence_refs: [chk-530]
aliases: [materialization-local-publish-readiness]
skills: [service-boundary-ownership-check, verify-close-and-checkpoint]
cases: [full-local-ladder, local-security-verification, source-package-docs-parity, installed-tarball, no-push, version-neutral-dry-run]
created: 2026-07-15
updated: 2026-07-15
---

# Overview

Prove the complete Goal-66 implementation is safe, product-neutral,
documented, package-complete, and locally ready to enter the fixed `0.5.2`
release lane without performing any external or real-root release mutation.

# Preconditions

- `test-411` through `test-415` are done.
- `test-452`, `test-453`, and `test-454` are done.
- Source remains version `0.5.1`; materialization notes remain under
  `CHANGELOG.md` `Unreleased`.

# Required Evidence

- `npm ci`, build, complete tests, `smoke:git-materialize`, CLI snapshot/check,
  CLI contract, docs check/build, graph validation, and `git diff --check` pass.
- `npm run security:verify` passes.
- Focused regression tests close the prior candidate families for bounded
  stdin reading and credential-safe receipt refs, and generated command
  contract tests close the adjacent completeness gap.
- The failed partial scan in `chk-530` remains historical discovery evidence
  only. Codex Security is out of scope by explicit operator decision and is not
  a release gate.
- `npm run prepublishOnly` and `node scripts/assert-publish-ready.js` pass.
- Isolated-cache `npm pack --dry-run --json` and `npm publish --dry-run` pass;
  the latter is classified only as version-neutral command/payload proof.
- A tarball written outside the repo installs into a clean temporary prefix and
  passes materialization success, representative closed failures, help/contract
  parity, and clone compatibility.
- Source, generated outputs, docs, schemas, fixtures, and tarball contain no
  downstream product identifiers, credential material, local absolute paths,
  or raw provider/runtime payloads.

# Boundary Assertions

- No version bump, real publish, push, tag, global replacement, deployment,
  Browser/Chrome operation, or real-root `upgrade --apply` occurs.
- Any failed check or unresolved finding blocks `task-751` and `goal-67`.

# Results / Evidence

- `bug-2`/`test-452`, `bug-3`/`test-453`, and `task-791`/`test-454`
  are done with focused executable evidence.
- Full source tests passed: 658/658 unit and integration tests plus 13/13
  public-release and security-remediation tests.
- `npm ci`, build, focused materialization tests, consumer smoke, CLI check,
  CLI contract, docs check/build, graph validation, built-in security
  verification, readiness assertion, and `git diff --check` passed.
- `npm run prepublishOnly` passed its complete test, docs, security, public-site,
  package, graph, and smoke matrix.
- Isolated-cache pack dry-run passed with 191 payload files, including
  `dist/cli.js`, `dist/commands/git_materialize.js`,
  `dist/command-contract.json`, init assets, and release docs.
- Isolated-cache npm publish dry-run passed for version-neutral `mdkg@0.5.1`
  payload proof after replaying `prepublishOnly`.
- Packed-consumer smoke installed a real tarball into a clean temporary global
  prefix and passed help/contract, accepted materialization, commit-mismatch
  failure, no-local-path receipt, and `git clone` compatibility checks.

## Security Disposition

- Partial scan `4956a227-c1c0-4309-98d0-1e65687fab71` is terminally marked
  failed because the plugin/runtime could not complete the workflow. Its
  `findingCount: 0` is not interpreted as a clean scan.
- The two validated candidate families from that partial evidence are fixed and
  covered by `test-452` and `test-453`; command-contract fidelity is covered by
  `test-454`.
- The operator removed Codex Security from Goal 66 scope. Local security
  authority for this lane is `npm run security:verify`, the targeted regression
  suite, the full test suite, package consumer proof, and the no-secret/public
  naming checks already recorded above.

## Readiness Verdict

- No unresolved known security or prepublish gap remains in Goal 66's local
  evidence.
- Codex Security setup session `c764e7b3-4f91-4296-8b2e-08ac44695d4f`
  produced no scan id and is abandoned without further action.
- Ready to close this contract and proceed to `task-751`; no version bump,
  publish, push, tag, global replacement, deployment, or real-root upgrade has
  occurred.
