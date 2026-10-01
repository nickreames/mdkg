---
id: test-488
type: test
title: Verify fresh Standard security remedies and adjacent qualification corrections
status: backlog
priority: 1
tags: [release-0.6.0, security, qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/security-findings-checkpoint-20260918.json, .mdkg/artifacts/goal-86/bug-48-current-validation.json, .mdkg/artifacts/goal-86/bug-48-installed-verification.json]
relates: []
blocked_by: [bug-44, bug-45, bug-46, bug-47, bug-48, bug-49, bug-50, bug-51, bug-52, bug-53, bug-54, bug-55, bug-56, bug-57, bug-58, bug-59, bug-60, task-838, task-839, test-487]
blocks: []
refs: [task-837, goal-84, goal-86, task-828, chk-624, chk-625]
context_refs: [goal-86, goal-84, task-837]
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-09-17
updated: 2026-09-21
---
# Overview

2026-09-21 Bug52 intermediate local evidence:1718 full,82 independent focused,
and219 installed cases pass; three exact Node versions on macOS arm64 use one
hash-bound tarball. Complete plan binding rejects operation/dependency/payload
substitution, legacy downgrade and terminal-state bypass attempts before effects.
Normal interrupted upgrade/identity/Git-custody controls remain intact. Evidence:
.mdkg/artifacts/goal-86/bug-52-baseline.json,
.mdkg/artifacts/goal-86/bug-52-full-verification.json,
.mdkg/artifacts/goal-86/bug-52-installed-verification.json.
No blocked context accessed or historical scan rerun. This is not final artifact,
cross-platform, Task828 or test488 acceptance; aggregate status stays open.

Bind every fresh Task837 finding and adjacent qualification correction to exact
failing-before/passing-after and final-artifact evidence. Preserve the original
fourteen-finding count: five medium, nine low. An audit report is not remediation.

# Target / Scope

- root:bug-44: g86-baseline-001.
- root:bug-45: g86-baseline-002.
- root:bug-46: g86-baseline-003.
- root:bug-47: g86-baseline-004.
- root:bug-48: g86-baseline-005.
- root:bug-49: g86-bootstrap-003.
- root:bug-50: g86-dbwork-002.
- root:bug-51: g86-dbwork-003.
- root:bug-52: g86-bootstrap-004.
- root:bug-53: g86-bootstrap-002.
- root:bug-54: g86-identity-001.
- root:bug-55: g86-graph-001.
- root:bug-56: g86-graph-003.
- root:bug-57: g86-export-001.
- root:bug-58, root:bug-59, root:bug-60: separately classified correctness and
  observational-contract blockers, not added to security finding counts.
- root:task-838: fixture authority, cleanup and final-byte custody.
- root:task-839: only materially false release-critical guidance.
- Reuse tests477-487 and historical controls; this is traceable acceptance,
  not a duplicate implementation or a replacement for independent task828.

# Preconditions / Environment

Owned disposable synthetic repositories only. Use installed candidate bytes,
isolated Git/config/cache state and verified owned cleanup. Native macOS and
Linux x86_64/ARM64 acceptance must distinguish native/emulated execution; Node
24.15.0, selected supported24 and26 identities are exact. Windows unqualified.
Current candidate6957f9187062cc6c78b0c16e95f4bd623c19ef07e36ee411fdb9553c5478c5b5
is pre-remediation and unqualified; any package-input change invalidates it.

# Test Cases

- bug-44: Create exports from synthetic URL userinfo/query/fragment and helper-style origins and assert no secret appears in ZIP or CLI output. Retain normal HTTPS, SSH/SCP and local descriptors without authentication data. Verify public and private export paths and subgraph provenance.
- bug-45: Reject .git/config, full .git trees, .git indirection files, nested administrative paths and filesystem aliases before any write. Reject unrelated root payloads even with matching manifest hashes and an owning config. Retain supported owned graph, archive and deliberately portable private-snapshot materialization.
- bug-46: Update a0600 task under022 umask and assert no permission widening, including temporary files. Test differing group ownership and restrictive per-file ACLs on macOS and Linux. Cover both atomic helpers, mode-preserving callers and unchanged hard-linked peers. Cover task, goal, competing-goal activation, formatting, selection and cache write routes through the centralized metadata contract.
- bug-47: Use synchronized ancestor swaps on macOS/Linux for read-to-mirror, exclusive create, append, replacement and removal. Prove outside sentinels remain unread/unmodified and operations fail closed. Verify legitimate native Git worktree and private-checkout workflows remain supported.
- bug-48: Reject config/source symlinks to devices, FIFOs and outside sentinels without blocking. Reject oversized regular files and post-stat growth within timeout-bounded fixtures. Exercise CLI and fixed-root MCP while proving subsequent valid requests still work. Also qualify selected-ZIP leaf substitution and actual-byte growth before parsing: nonblocking descriptor admission, exact limits and descriptor closure on failure; retain explicit external and linked regular ZIP controls. Chk624 records the reproduced remaining ZIP-reader path; the partial candidate is not closure.
- bug-49: Create a registry symlink to a synthetic external sentinel and require refusal with no sentinel bytes copied. Cover missing-target links, linked ancestors and no-partial-skill-write behavior. Retain customization preservation for admitted regular registry files.
- bug-50: Either/both configured paths as nonempty directories must produce invalid status and failing verify exit. Require every mandatory check to execute and pass, independent of whether error strings were populated. Retain regular valid/missing/corrupt snapshot positive and negative controls.
- bug-51: Use external sentinels for verify, status and seal; refuse links before native open/hash and prove no digest or bytes enter output. Reject special files and oversized manifest inputs; hash large admitted DBs with bounded streaming. Retain valid portable private snapshot behavior.
- bug-52: Tamper an ordinary-file operation while keeping the approved plan_hash and recomputing auxiliary hashes; resume and recover must refuse before writes. Bind the complete canonical original plan and dependencies, and isolate mutable progress from approved intent. Keep stale-byte, graph identity, Git-path, owner and interrupted recovery regression coverage.
- bug-53: Initialize with a valid externally hard-linked manifest and prove the peer stays byte-identical. Cover repeated init without force and failure admission with no partial peer writes. Use metadata-preserving contained replacement or reject multiply-linked targets before mutation.
- bug-54: Run repair preview in a timeout-bounded subprocess with two valid task-9007199254740992 documents; require deterministic refusal rather than timeout. Cover Number.MAX_SAFE_INTEGER, the first unsafe integer, leading-zero forms, and a occupied next candidate. Verify refused apply leaves authored bytes and Git index unchanged and releases its mutation lock. Retain ordinary small-ID allocation and v2 refusal coverage. Cover checkpoint duplicate alias, ordinary new and loop exponent notation, legacy and explicit v2 graphs, and JSON/SQLite backends.
- bug-55: Reject linked seed files, linked loop directories and special-file targets before authored mutation. Prove external sentinel bytes are not read or copied to receipts. Preserve valid local regular-file suggestions and normal node creation.
- bug-56: Bound actual bytes, aggregate bytes, seed count, directory entries and traversal depth. Cover oversized regular body, many moderate seeds, and excessive unrelated directory entries. Exercise list, show, fork, provenance and new-loop suggestions with unchanged authored state on refusal.
- bug-57: Reject stored or compressed payload paths owned by private, disabled or other nested workspaces before any read or write. Prove private sentinel bytes cannot enter a parent archive or later public export. Reject destinations overlapping sidecars, raw inputs, graph documents, protected metadata or any other selected operation's targets. Preserve explicit archive-add source authority and valid per-archive compression.
- MCP malformed message then valid ping/read, Git-metadata mirror refusal with
  force and native topology controls, and observational SQLite native sidecars.
- Poisoned ambient Git configuration, exact owned cleanup refusal, same-size
  candidate tampering and final artifact rehashing.
- Each case records source revision, package hash, platform/runtime, command,
  expected effect, actual result, skipped/unverified conditions and inventories.
- Parent receipt distinguishes public CLI versus shipped internal-module proof.
  No canonical source imports masquerade as installed consumer execution.

# Results / Evidence

2026-09-21 current direction: proceed from retained mdkg findings. Do not read
blocked scan context, recover its artifacts or rerun the blocked historical
findings. The recovery proposal below is historical and superseded. This does
not waive final independent current-source review or platform qualification.
Bug48 now has164 focused passing source tests and30 installed CLI/MCP cases
passing on each of Node24.15.0,24.18.0,26.0.0 on macOS arm64. Exact current
receipts are bug-48-current-validation.json and bug-48-installed-verification.json
under .mdkg/artifacts/goal-86/. The latter binds all installed package file
hashes and confirms they remain unchanged; it is intermediate, not a final seal.
Full discovery executed1647 tests:1614 passed and33 failed only because the
sandbox could not provide OS ownership evidence for interrupted-writer tests.
The entire38-case unchanged family passed in an approved native local rerun.
Both results are retained; the restricted run itself did not pass. Linux and
final-artifact results remain unverified. Do not promote these intermediate
results to completion of this acceptance node.

Historical checkpoint evidence (2026-09-18):

Chk624 preserves intermediate Bug48 observations only:155 focused source tests
and69 installed cases passed before a surviving ZIP-reader path was confirmed.
Those temporary artifacts are now inaccessible; no final candidate pass follows.
Task838 must establish retained evidence custody; Task828 independently checks
recovered original or explicitly superseding canonical security reports. The
sealed Standard14-finding count and earlier completed findings remain historical.

No cases have run for this fresh acceptance record. Initial source evidence and
canonical report hashes: .mdkg/artifacts/goal-86/task-837-standard-security-audit.json.
Require per-finding local verification receipts plus final exact-candidate
matrix before completion. Test487 supplies required supported-platform proof.

# Notes / Follow-ups

2026-09-21 Bug51 intermediate local remedy:1670 full and117 focused source tests
pass;79 installed cases each on Node24.15.0/24.18.0/26.0.0 (237 total) macOS arm64
and9 source-level Git-custody cases pass. Current receipts: bug-51-baseline.json,
bug-51-current-validation.json and bug-51-installed-verification.json. Static
links/special files/sidecars refuse before reads; bounded manifest and streamed
DB controls preserve ordinary first/reseal, portable, stale and queue behavior.
One independent candidate review found no concrete in-scope bypass. Native
pathname races, metadata/ACLs, other SQLite observations, Linux, final Task828
and artifact acceptance remain separate. This acceptance node stays incomplete.
No blocked context or historical report recovery occurred.

2026-09-21 Bug50 intermediate local remedy:1664 full and71 focused source tests
pass, plus26 installed cases each on Node24.15.0/24.18.0/26.0.0 macOS arm64.
Receipts: bug-50-baseline.json, bug-50-current-validation.json and
bug-50-installed-verification.json under .mdkg/artifacts/goal-86/. Admission
and all nine mandatory checks are required for success; status remains an
observational exit0 receipt and verify fails on invalid inputs. Full synthetic
fixture inventories remain unchanged. One source-only independent review found
no concrete remaining Bug50 bypass. Linked-input authority, native read-only
SQLite semantics, ancestor races, Linux and final qualification remain separate;
this acceptance node stays incomplete. No blocked context or old scan recovery.

2026-09-21 Bug49 intermediate local remedy:1658 full and164 focused source tests
pass, plus19 installed cases each on Node24.15.0/24.18.0/26 macOS arm64. Receipts:
bug-49-baseline.json, bug-49-current-validation.json and
bug-49-installed-verification.json under .mdkg/artifacts/goal-86/. Linked/special
registry refusal, customization/force controls and output-budget admission are
covered. Invalidated earlier attempts are retained. This does not complete this
acceptance node or claim Linux/final-artifact qualification, metadata/ACL or
ancestor-race remediation, or blocked-context recovery. Task828 remains required.

Task828 performs a separate independent remediation-diff review after source is
frozen. Test488's test results do not substitute for that security workflow.
No automatic waivers, historical evidence rewrites, canonical graph migration,
bundle refresh, remote/provider actions or publication. Goal85 stays paused.
