---
id: test-487
type: test
title: Qualify the exact mdkg 0.6.0 candidate on macOS and Linux
status: backlog
priority: 1
tags: [release-0.6.0, launch-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [test-477, test-478, test-479, test-480, test-481, test-482, test-483, test-484, test-486, task-839, task-838]
blocks: []
refs: [dec-96, test-482, task-828]
context_refs: [goal-86, goal-83, goal-84]
evidence_refs: []
aliases: []
skills: []
cases: [test-487-case-1, test-487-case-2, test-487-case-3, test-487-case-4, test-487-case-5, test-487-case-6, test-487-case-7, test-487-case-8, test-487-case-9]
created: 2026-09-13
updated: 2026-09-17
---

# Overview

Bind complete macOS and Linux qualification to one exact0.6.0 tarball. Windows
is explicitly unqualified; engine metadata alone is not platform proof.

# Target / Scope

Nick confirmed Linux x86_64 and ARM64 qualification on2026-09-15. Record the
host and guest architectures and native versus emulated execution explicitly.
Emulation is not evidence of native performance or host filesystem equivalence.
Existing isolation/endpoint/image checks and infrastructure authority gates apply.

The installed family/runtime matrix, native worktrees, filesystem/ownership and
release validation environment. Existing tests retain their evidence and current
case contracts, including the explicit test-480 old-client limitation. This test
verifies platform identity/completeness rather than treating old counts as passes.

# Preconditions / Environment

Owner: mdkg-project-agent, one writer in this checkout. Current action is mdkg-only
planning; this task stays unclaimed until an explicit Run of fully planned goal-86.
That later Run authorizes its bounded implementation, local validation, evidence
and reviewed explicit-path local commits on main; selected state does not authorize it.
No remote Git/push/tag/publication, provider/deployment, consumer/root/sibling
writes, canonical branch/worktree changes, canonical graph migration, bundle or
subgraph refresh, history rewrite, unrelated cleanup or global configuration changes.
Preserve partial Bug17 work, selected Goal73, runtime DB, Demo3 bundles and unknown
files. Stop on baseline movement, ownership collision, unknown custody, material
new decisions or missing authority. Fixture mutations belong only in owned
disposable local roots; never execute recovered Demo3 application payloads.

Prefer a verified existing local Linux executor. Record local endpoint, OS/kernel,
architecture, pinned image identity when applicable, runtime/npm/Git versions and
filesystem semantics. Mount only owned fixtures and required read-only candidate
inputs, not credentials, Docker sockets, or unrelated/canonical writable paths.
Unauthenticated public runtime downloads may use isolated local caches under
the later run contract. Any unavailable Linux image or executor must be resolved
within existing authority or left blocked pending specific infrastructure approval. Do not start/reconfigure services or use hosted CI
without specific authority. Missing infrastructure remains a blocking gap.

# Test Cases

1. Same tarball SHA256/SHA512 and file manifest on macOS/Linux; no source-import
   substitution, platform repacking or missing-runtime pass.
2. Node 24.15.0, the selected supported Node 24 runtime, and Node 26 each execute
   all required installed families on both macOS and Linux, with exact case
   coverage and runtime identity. Smoke-only results do not satisfy this gate.
3. Actual0.5.2 upgrade, compact init and customized instruction/document preservation.
4. Two real linked worktrees, concurrent offline creation, per-checkout state,
   same-checkout exclusion, native reviewed ancestry-preserving source-plus-graph merge.
5. Separate submodule/gitdir indirection, staged/unstaged input and exact Git index
   resolution via Git, not assumptions about root/.git/index.
6. Actual read-only filesystem refusal, symlink/ancestor/hardlink/nonregular input,
   ACL/ownership/rwx/umask behavior and explicit shared-authority race limitations.
7. Real abrupt termination and evidence-bound recovery; live/ambiguous owners,
   modified evidence and cross-worktree recovery refuse without side effects.
8. JSON/SQLite parity, MCP/packs/archive/work, scale and goal/blocker routing;
   removed/unknown invocations have complete zero-write/subprocess proofs.
9. Full test-discovery and manifest-backed ladder results identify macOS/Linux
   source/runtime/environment. Final ladder refresh lives in task829, not an
   upstream prerequisite of this platform test. Coverage floors never decrease.

# Results / Evidence

PLANNED / UNEXECUTED. No Linux engine, container, hosted runner or Windows result
is inferred from installed client tools. Each case records pass/fail/unverified,
exact bytes and environment. This gate cannot pass from macOS-only evidence.

# Notes / Follow-ups

Qualify filesystem security limitations independently in task828; documentation
cannot waive confirmed in-scope defects. Missing platform proof blocks task826,
task828, task829, chk570 and publication. Retain compact sanitized diagnostics.
