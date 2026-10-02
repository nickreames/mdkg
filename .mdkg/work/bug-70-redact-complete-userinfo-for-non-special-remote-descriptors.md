---
id: bug-70
type: bug
title: Redact complete userinfo for non-special remote descriptors
status: done
priority: 1
tags: [release-0.6.0, final-diff-remedy]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/independent-diff-review-20260930.json, .mdkg/artifacts/goal-86/successor-installed-case-acceptance-20260930.json, .mdkg/artifacts/goal-86/successor-installed-platform-qualification-20260930.json, .mdkg/artifacts/goal-86/successor-security-acceptance-20260930.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-86, goal-84, bug-44, task-828, test-488]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-09-30
updated: 2026-09-30
---
# Overview

Goal: close the new non-special URL authority gap in the shared remote descriptor
redactor. This is a distinct confirmed instance, not reopening or replacing
Bug44's historical successful cases. Owner: mdkg-project-agent, one writer.

Context: immutable independent diff e42f1d9..c313d804, scan e5e0584a-bdfc-4da0-8c41-7e5edd4d8bba,
finding csf_08e010befc7091080172567d (low, high confidence). Installed f7cbdc1d
git inspect retained a synthetic userinfo marker; ordinary HTTPS control removed it.

Boundaries: generic Node-only source/tests and required sanitized mdkg evidence.
Allowed: src/util/git_remote.ts, direct shared callers if necessary, associated
unit/installed regressions and disposable local fixtures. No transport/config
rewrites, real secrets, remote Git, provider/deployment/publication, canonical
branch/worktree changes, graph migration, bundle refresh or unrelated edits.

# Reproduction Steps

A non-special ftps/ssh/git descriptor has a backslash after an earlier @ in
userinfo. The authored authority splitter stops at that backslash, while URL
parsing keeps the remaining userinfo. The returned suffix still contains it.
Actual installed helper and git inspect reproduced this without network access.

# Expected vs Actual

Expected: a display/provenance descriptor contains no userinfo/query/fragment
secret, regardless of parsed authority normalization. Preserve legitimate safe
SCP/local/Windows/UNC and encoded-path spelling and idempotence.
Actual: the current shared helper emits a partially redacted userinfo suffix.

# Suspected Cause

The authored authority splitter used special-scheme backslash delimiters for
non-special schemes, disagreeing with the URL parser's userinfo boundary.

# Fix Plan

Enforce scheme-correct authored authority boundaries at the shared helper.
Challenge parser-normalized/mixed-separator variants and all caller projections.
Do not infer native transport acceptance or remote compromise from this proof.

# Test Plan

Focused helper regression plus ordinary positive/idempotence controls; actual
installed git inspect and relevant bundle/MCP/subgraph descriptor sinks. Test493
binds successor-artifact acceptance. Full package/platform/review/seal gates remain.
Use selective iteration; do not rerun unchanged full qualification per edit.

# Done when / Evidence

Original and alternate credential markers are absent after the remedy; legitimate
controls pass; source/candidate hashes, owned cleanup and unchanged staging are
recorded. Independent review and required installed evidence are mandatory before
final release acceptance. Published0.5.2 impact is not assessed by this new PoC.

Sanitized evidence: .mdkg/artifacts/goal-86/independent-diff-review-20260930.json.
Raw canonical report remains plugin-owned. No new skill candidate.

# Links / Artifacts

Bug44 supplies historical controls; Test493 and Task828 own final acceptance.
