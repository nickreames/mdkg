---
id: task-823
type: task
title: Bind mdkg 0.6.0 candidate custody and published 0.5.2 provenance
status: done
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-83/baseline.json]
relates: []
blocked_by: []
blocks: []
refs: [chk-535, chk-571]
context_refs: [goal-83]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-07
updated: 2026-09-07
---

# Overview

Goal: Published baseline provenance, exact candidate/dirty custody, package-relevant delta and local baseline commit receipt.

Context: The complete approved contract is goal-83 and bounded blocker ownership is goal-84.

# Acceptance Criteria

Recheck HEAD/cached upstream and 85-path Goal 82 local commit 9d7e0d3fdbcfbc3908b7d3983b4957f15d17cb2b. Bind 0.5.2 registry integrity to chk-535 source provenance; do not infer a missing tag or fetch remotes. Classify shipped runtime, bundled guidance, validation, docs and demo/history-only paths. Record exact hashes and preserved SQLite custody.

# Files Affected

Read source/Git/registry tarball; write only owned mdkg evidence and isolated download diagnostics.

# Implementation Notes

This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

# Test Plan

Exact tarball SHA-1/SHA-512, package file manifest, source/path diff and Git status/diff review.

# Links / Artifacts

Owning goal and dependencies are explicit above. Record exact commands, input/source/artifact hashes and pass/fail before completion.

## Baseline Evidence

Fresh unauthenticated registry metadata and tarball downloads matched the known
0.5.2 SHA-1 and SHA-512 from chk-535. Tarball SHA-256 is
18b9bb3c474481155ad46c4ce9b06530d5bdcce0812052fc76f7bcc159799540;
all 191 entries are regular files under package/ with no traversal. Registry
gitHead is absent; recorded source provenance is not inferred from a tag.
Source 867ac709 to invocation 95f35b93 changes only ten mdkg evidence/cache paths.

.mdkg/artifacts/goal-83/baseline.json binds the 1125-path source-to-candidate
classification, exact source revisions and selected package/validation path
blobs. Counts: 66 runtime/metadata, 14 bundled guidance, 62 validation,
12 documentation, 780 demo/website consumer, 172 project-memory/history,
18 repository instruction projections and one repository configuration path.
The full classified manifest digest is
ee5cf24a7fe2bc528eb4ffd41c02979665042209297edccf357bf509fb4098f0.

Canonical main remains 9d7e0d3f, two ahead/zero behind cached origin/main.
No remote Git verification or action. All new planning paths are owned;
selected Goal 73, runtime DB and protected bundle hashes remain unchanged.
No active runtime lease or queued message. Full planning graph validation
passed with zero errors/three inherited age warnings, changed-only validation
passed with no warnings, and git diff --check passed. This closes baseline
classification only, not behavioral qualification or publication.
