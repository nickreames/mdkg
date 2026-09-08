---
id: chk-571
type: checkpoint
title: Record mdkg 0.6.0 frozen Standard security audit
status: done
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [artifact://codex-security/35ca791e-716a-4bc3-8067-88d47224e288/report]
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: [goal-83, goal-84]
evidence_refs: []
aliases: []
skills: []
scope: [task-825, bug-8, bug-9, bug-10, bug-11, bug-12, bug-13, bug-14, bug-15, bug-16, bug-17, bug-18, bug-19, bug-20]
created: 2026-09-07
updated: 2026-09-07
checkpoint_kind: audit
---

# Summary

The Standard repository security source audit is completed and sealed. It reports 13 source-validated findings — nine medium and four low — none remediated at this milestone. This is not release qualification.

# Scope Covered

Independent baseline plus eight focused source review packets; all 123 runtime TypeScript files and 359 authored executable files across CLI/graph, tests, release/install/CI, website/docs and live Demo 3 source inputs. Ten generated framework files were explicitly excluded from the 369-path executable-like inventory. No application/tests, providers, remote Git or recovered payloads executed during the scan.

# Decisions Captured

All validated shipped-behavior findings route to goal-84 and block publication until regression and independent verification. A general Git query-credential candidate was rejected because no supported credential source/sink boundary was established; it is not a risk waiver. Non-executable history/render assets, generated binaries/caches and third-party/advisory analysis are explicit exclusions, not reviewed clearance.

# Implementation Summary

No remediation during the frozen scan. Authored baseline: 9d7e0d3fdbcfbc3908b7d3983b4957f15d17cb2b on main. Earlier Goal 82 local commit covers 85 attributable paths; preserved dirty SQLite was excluded. The same scan ID resumed after interruption; canonical artifacts were restored and sealed without a replacement scan or global configuration changes.

# Verification / Testing

Scan ID: 35ca791e-716a-4bc3-8067-88d47224e288.
Snapshot: codex-security-snapshot/v1:sha256:9c9c20ce795cf88a8514c9c315f805e1eeafe6172a99b6a49b2303314c99d1b1.
Canonical artifacts remain plugin-owned; only hashes and sanitized summaries are recorded here.

- Manifest SHA-256: d9f53bf4f2c698c36530c62e22d97a25a5cf9caceec32178d0d2ab38b3e2ae8a.
- Findings SHA-256: 57a6e4ab9636429232238a5bd3a1a341842bb8338a83631ff5447612f54c8a4b.
- Coverage SHA-256: 732a9e29c2204f79f08e899eaed3d9e212ff2ef953bab4dc80d452c64c50d3f9.
- Generated report SHA-256: bbc5e71c72c5547a06a470df44ecafe42a266c334f45ca095b4e71fc9cf79178.

Before/after scan bookends matched: selected state f996926a868b7c06fb29311fb69c48d862e9dc354404f777df93e1c5443b07ab; runtime DB b1f2bfb3c9ebd254d520eb7f47c12c2fa18daf691056fe97ba1890f94d013a81; preserved Demo 3 bundle 741b4644da1d3d1ff3bbd4b9240e22870609f015e49e28170a91748ab024570b; dirty SQLite 2a563a2f0e23041ada1fb2e488122a54754c674195eae1c1df259cc1d21394f6. Subsequent approved planning reindexing may change the owned SQLite projection, not those protected source/runtime/bundle surfaces.

# Known Issues / Follow-ups

- bug-8: Imported self-hashed receipts can forge the accepted merge base.
- bug-9: Configured derived-cache paths follow symlinked parent directories outside the repository.
- bug-10: Subgraph bundle symlinks import and disclose graph bodies outside the selected repository.
- bug-11: Symlinked graph directories expose and format external nodes.
- bug-12: Archive verification reads unchecked paths and hashes payloads before enforcing file and size limits.
- bug-13: Event JSONL validation follows symlinks and reads an unbounded stream into memory.
- bug-14: DB initialization follows symlinked layout directories outside the repository.
- bug-15: Skill projection copies external files through source resource-directory symlinks.
- bug-16: Public bundles include a nested private workspace as public parent files.
- bug-17: Public graph bundles include ignored live queue databases and checkout-local state.
- bug-18: Template schema discovery escapes its configured root through default_set.
- bug-19: Guide and verbose context readers can disclose external files through repository links.
- bug-20: Default pack output follows directory symlinks outside the checkout.

No installed qualification, fixes, separate fix-diff scan or final candidate seal yet. Existing 755 TypeScript plus 26 public-release/security baseline tests predate this scan and do not prove these gaps fixed.

# Links / Artifacts

Plugin canonical artifacts are referenced by scan ID above. Skill candidates: none. Ownership: mdkg-project-agent; selected Goal 73 unchanged, no runtime lease acquired.
