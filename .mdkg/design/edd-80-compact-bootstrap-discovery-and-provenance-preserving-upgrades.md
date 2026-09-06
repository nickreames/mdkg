---
id: edd-80
type: edd
title: Compact bootstrap discovery and provenance-preserving upgrades
tags: [alignment-002, implemented]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: [goal-81, task-816, task-817, task-818, test-474]
refs: [dec-93, dec-17, dec-18, dec-19, edd-56, goal-78]
aliases: []
created: 2026-09-05
updated: 2026-09-05
---

# Overview

Approved planning contract for goal-81 under MDKG-INTERACTIVE-ALIGNMENT-002.
Goal: make initialization immediately useful with compact entrypoints and
focused task/skill discovery. This document specifies future behavior; no
bootstrap source, installed instructions, or skills were changed by this plan.

Implementation addendum (2026-09-05): the user's explicit Goal 81 Run action
authorized task-816..818 and test-474. The initial planning-only description
above is historical. Compact default init, managed sections, hash-bound upgrade
preview/apply, explicit local journal resume/recovery, focused skills and native
projections are implemented and verified. No canonical checkout migration or
release is implied. --agent remains compatible, including --agent=false;
--graph-only is the preferred explicit opt-out. Upgrade does not reconstruct
missing event history or prune unknown native skill payloads.

# Architecture

AGENTS.md and CLAUDE.md are the two root-level mdkg instruction adapters.
Both point to one compact .mdkg/AGENT_START.md router. Detailed generated
command guidance moves to .mdkg/CLI_COMMAND_MATRIX.md in newly initialized
consumer repositories; .mdkg/README.md remains the layout/discovery reference.
The router contains only authority boundaries, current-work grounding, focused
skill discovery, and a short validation/closeout pointer. A full command matrix,
SOUL, collaboration profile, and every skill are not mandatory startup reads.
Repository-specific constraints still must be discoverable before relevant work.

Stable instructions explain conventions, ownership and entrypoints. Runtime
contracts enforce execution/lease semantics. Current assignments belong in
task/handoff nodes. Historical graph content is evidence, not permission to
override current user boundaries. Selection and successful validation are not
mutation, Git, release, provider, or deployment authority.

Canonical skills stay under .mdkg/skills; .agents/skills and .claude/skills are
native adapters. No remote skills installation or runtime execution is added.

# Data model

Extend existing init-manifest provenance instead of a second ownership system.
Inventory each output as managed generated file, managed wrapper section,
user-authored content, project-maintained source/reference, or public discovery
asset. Record template/version/hash and prior installed hash for each managed
unit. Preserve every byte outside a managed section, including newline style.
Detect malformed/duplicate markers and edited managed content as conflicts.

Consumer-generated startup files are not the same as mdkg's maintained root
documentation sources. README, LICENSE, docs, examples and website llms endpoints
are not generic scaffold cleanup targets. No fleet migration is required.

# APIs / interfaces

Future behavior:
- mdkg init defaults to compact agent setup; --agent remains compatible.
- Add an explicit --graph-only option. Combining it with --agent fails before
  writes. Existing graph-only installations do not silently gain agent outputs
  through upgrade; enabling those outputs requires explicit intent.
- Preserve existing ignore-option behavior; report every planned output.
- mdkg upgrade remains preview-first. Its receipt names exact write paths,
  managed-unit hashes, preserved customizations, conflicts and recovery steps.
- Upgrade apply rechecks receipt inputs before writing; stale previews fail.
- Skill list/search/show and command help remain focused discovery mechanisms.
  No new universal handbook or task-specific root file is required.

First increment: compact fresh-init output and provenance-aware upgrade planning.
Upgrade application and link/projection compatibility complete the goal before
existing repositories are offered migration as safe.

# Failure modes

Unknown root files are preserved, not adopted by filename alone. Known generated
legacy startup files may become compatibility redirects only after source-hash
proof and preview approval. Customized legacy files remain intact and reported.
No old path is removed while supported generated links still require it.
Do not automatically remove a repository's maintained command-reference source.

Preflight all destinations, containment and conflicting edits. Interrupted apply
must leave a receipt that identifies completed and remaining writes; resume is
idempotent and refuses subsequent user edits. Recovery restores only verified
operation-owned bytes with explicit intent, never broad Git restore/reset.
Do not claim global transactionality without fault-injection evidence.

Current new-goal scaffolding also defaults active and can fail after writing a
second active goal. Include authority-language coverage so initialization and
discovery never imply that creating a plan authorizes execution; changing goal
creation semantics itself needs a separately scoped implementation decision.

# Observability

Receipts report generated versus preserved units and compatibility redirects.
Measure mandatory startup size and reachable paths against the old seed chain.
Acceptance requires one router without circular mandatory reads and on-demand
command/skill bodies; do not replace repeated text with an equally large router.

# Security / privacy

Never overwrite user instruction sections, grant execution authority from
repository text, follow escaping symlinks, or execute skill scripts. Use portable
relative paths. Vendor-specific discovery belongs in adapters, not graph policy.

# Testing strategy

test-474 covers fresh default/graph-only/legacy --agent, existing custom wrappers,
known seed upgrades, missing/modified manifests, marker corruption, unchanged
repeat upgrade, interrupted apply, recovery, dangling links, same-slug native
skills, ignore options, and distinct website/project documentation assets.
Future source gates include focused init/upgrade/skill tests, build, CLI parity,
docs consistency, smoke:upgrade and graph validation. No tests run by this design.

# Rollout plan

1. task-816: compact default seed/router and graph-only compatibility.
2. task-817 after task-816: provenance plan, reviewed apply and recovery fixtures.
3. task-818 after task-817: generated links, canonical skills and native mirrors.
4. test-474: prove the complete contract before offering migration.
5. Existing repositories opt in individually; publication and fleet changes
   require separate authority. Goal stays paused until implementation approval.
