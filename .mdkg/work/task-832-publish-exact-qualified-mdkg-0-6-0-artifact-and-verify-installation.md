---
id: task-832
type: task
title: Publish exact qualified mdkg 0.6.0 artifact and verify installation
status: done
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-85/publication-attempt-20261001.json, .mdkg/artifacts/goal-85/post-publish-validation-20261001.json]
relates: []
blocked_by: [task-831]
blocks: []
refs: []
context_refs: [goal-85]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-07
updated: 2026-10-01
---

# Overview

Nick completed interactive npm two-factor approval and reported successful
publication of mdkg@0.6.0. Independent registry metadata now identifies 0.6.0
with latest=0.6.0 and the exact sealed b5497c5f5e5f022e integrity. Canonical
registry tarball SHA256 and clean installed lockfile SHA512 match the seal.
All31 post-publish command checks passed:25 positive controls and six expected
removed-command refusals without fixture changes. Normal postinstall, version,
compact/graph-only/customized/repeated init, task/search/pack/skill/lifecycle,
validation and retained read-only Git inspection were exercised on installed
registry bytes using macOS ARM64 Node24.18.0, not canonical source imports.

The canonical tarball URL temporarily retained a CDN-cached404 after metadata
became visible; validation waited for propagation and then passed. No republish,
repack, credential-policy bypass, tag or deployment occurred. The initial E403
receipt is preserved as historical provenance. Published-byte identity allows
reuse of unchanged-input full/platform/security qualification; this does not
claim a fresh Linux post-publish run. Protected source/state bookends match.
See post-publish-validation-20261001.json and the final Goal85 checkpoint.

# Historical initial authorized attempt - 2026-10-01

Nick's current approval covers exact-artifact npm publication, origin/main
push and independent post-publish validation. Task831 passed. Origin/main is
verified at 31c6c9a158224ccc865bb4cd1d5fa5c651c2c37c.

The single publication attempt used the b5497c5f5e5f022e tarball without
repacking. npm returned E403: two-factor authentication or an appropriately
authorized granular publishing token is required. A fresh post-attempt
registry query returned E404 for mdkg@0.6.0. This task remains BLOCKED.
Post-publish validation has not run because no publication is observed.

Secure interactive approval is required; no credential or one-time code is
stored here. Do not disable 2FA, bypass account policy or retry blindly.
After independently observing 0.6.0, compare registry integrity with the seal,
perform a clean temporary registry installation on supported Node24, exercise
bootstrap/graph/skill workflows, and only then close this task and Goal85.
Current approval persists; tags, deployments, consumer changes, history
rewrite and implicit repacking remain excluded. Chk670 is the handoff.

# Historical overview

Goal: Future exact-artifact npm publication and independent installed verification.

Context: Future goal-85 only; current authority excludes publication.

# Acceptance Criteria

Remain paused and unclaimed in this pass. Once task-831 passes under fresh approval, follow release-mdkg-package, publish the exact qualified 0.6.0 tarball, verify registry integrity and independent install workflows, and record immutable receipts. Push, tags, deployment, providers and consumer upgrades require separate approval.

# Files Affected

Only the explicitly approved registry/package and local verification fixtures under a new publication contract.

# Implementation Notes

This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

# Test Plan

Registry exact version/integrity and fresh independent installed-package verification; no rebuilt artifact substitution.

# Links / Artifacts

Owning goal and dependencies are explicit above. Record exact commands, input/source/artifact hashes and pass/fail before completion.
