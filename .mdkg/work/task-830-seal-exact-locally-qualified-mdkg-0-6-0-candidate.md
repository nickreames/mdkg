---
id: task-830
type: task
title: Seal exact locally qualified mdkg 0.6.0 candidate
status: done
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/candidate-seal-20260930.json, .mdkg/artifacts/goal-86/private/candidate-0.6.0-b5497c5f5e5f022e.inputs.json, .mdkg/artifacts/goal-86/private/candidate-0.6.0-b5497c5f5e5f022e.qualification-inputs.json]
relates: []
blocked_by: [task-829]
blocks: []
refs: [dec-99]
context_refs: [goal-83, goal-86, dec-96]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-07
updated: 2026-09-30
---

# Current accepted package closeout contract - 2026-09-28 Dec100

Seal the exact tested tarball after Task829 with separate package/harness input manifests, SHA256/SHA512, file manifest, source revision, platforms and current independent review hashes. Evidence-only commits do not invalidate identical bytes. Do not infer hosted/Windows or deferred-hardening acceptance.

Dec100 requires37 package smokes plus local platform/security/guidance acceptance.
All46 definitions remain; nine website smokes/nine site profiles defer to Epic258
and hosted execution to Epic257. Same-input case evidence can be reused; missing
seal does not erase passes. Node >=24.18.0 <25 replaces old runtime success gates.
Bugs46/47 remain deferred/unresolved; no blocked scan context recovery. This
amendment is not qualification proof or publication authority.

# Historical contract and evidence retained below

# Current Successor Contract - 2026-09-13

2026-09-28 Dec99 clarifies the security evidence binding: use accepted fresh
independent current-source/remediation-diff reports and retained per-finding
dispositions, with the unavailable original reports explicitly recorded as a
historical provenance limitation. Do not recover or rerun blocked context or
claim lost original bodies were verified. Required current review coverage,
exact report/input hashes and all platform/ladder gates still precede sealing.

Seal the exact tarball already consumed by final installed/platform qualification
and the full ladder. Bind SHA256/SHA512 integrity, file and package-input manifests,
source revision, runtime/platform identities and both current security reports.
Do not pack a replacement after qualification. Any input change invalidates the
seal and affected evidence; evidence-only commits may follow. Report exact local
commits/paths/custody and protected bookends; no push, tag or publication.

The earlier sections below retain their historical evidence. This current addendum,
updated dependencies, goal-86 and dec-96 govern the remaining work. Planning
authoring is not execution, qualification, a writer claim, or publication.

# Overview

Goal: One exact 0.6.0 package candidate bound to local source and qualification evidence.

Context: The complete approved contract is goal-83 and bounded blocker ownership is goal-84.

# Acceptance Criteria

After task-829, review explicit staged paths and coherent local commits. Seal a single tarball with SHA-512 integrity, SHA-256, file manifest, package-input hashes, source SHA, runtime versions, audit report hashes and validation receipts. Evidence-only commits may follow. Any package-input change invalidates the seal and requires requalification. Mark chk-570 done only with all proofs.

# Files Affected

Owned local artifact and sanitized mdkg manifest/checkpoint; reviewed local commits only, no registry publication.

# Implementation Notes

This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

# Test Plan

Recompute exact sealed bytes and input manifest; goal evaluation is report-only and insufficient by itself.

# Links / Artifacts

Owning goal and dependencies are explicit above. Record exact commands, input/source/artifact hashes and pass/fail before completion.
