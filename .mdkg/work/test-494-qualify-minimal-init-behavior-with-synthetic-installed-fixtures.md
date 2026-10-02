---
id: test-494
type: test
title: Qualify minimal init behavior with synthetic installed fixtures
status: progress
priority: 1
parent: goal-88
tags: [cloud-planning, cloud-implementation]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [task-846]
blocks: []
refs: []
context_refs: [edd-83]
evidence_refs: []
aliases: []
skills: []
cases: [fresh-or-selection, preservation-and-isolation, negative-boundaries, interruption-recovery, installed-artifact, persistence-or-export]
created: 2026-10-02
updated: 2026-10-02
---

# Overview

Meaningful future automated acceptance for goal-88, bound to edd-83.
Use synthetic data only and install the exact retained candidate tarball into
isolated consumer fixtures; source imports alone are insufficient.

# Test Cases

1. Fresh default/--agent generates root AGENTS only; --graph-only and invalid
   combinations behave compatibly. Inventory ALL generated paths; no unexpected
   root instructions, wrapper files, caches or package payload artifacts.
2. Repeat init/upgrade: byte hashes for custom files/managed-unowned sections,
   identical effective policy, stable graph/node identity and no duplicate
   skills/events or unintended artifacts. Distinguish legitimate provenance
   updates from idempotent content; force is tested separately.
3. Installed real legacy upgrade fixtures: exact-generated root CLAUDE/startup
   files, customized bodies, malformed markers, unknown/missing manifests and
   broken links. Preview names preserve/relocate/remove/backups; stale plans
   refuse, reviewed subset resolves links; interrupted/repeated apply/recovery
   keeps originals. User-created AGENTS/CLAUDE/AGENT_START never disappears.
4. Mirror parity across BOTH default harness targets and two extra synthetic
   destinations, including assets/references/scripts. Unmanaged custom skills
   and instructions survive sync/internal-audit/managed-prune/upgrade conflicts. Missing defaults
   in custom policy require a visible reviewed decision.
5. Traversal/absolute/symlink/native-Git/case/duplicate/overlapping destinations
   and same-slug conflicts fail before effects with unrelated-file hash controls.
6. Every generated router/skill/doc link resolves; repository-maintained source
   remains distinct from consumer scaffold. Existing test-303/test-474/bug-59
   regressions remain controls, not evidence that these new cases have run.

# Results / Evidence

Use existing supported tests/smokes and add behavior tests only during the later
implementation. Record case IDs, inputs/digests, exact commands, runtime/OS/arch,
native/emulated host, durations, positive/negative controls and pass/fail/not-run
counts. Full repository pre-merge checks and final package/platform/security
gates remain obligations of task-847. Current fast CI is not full
Linux portable qualification; missing proof means NOT_READY.

# Current State

Progress. Fifteen new Goal88 behavior cases passed in the first focused run.
Baseline219 cases are retained independently. The first candidate234 run had
two stale diagnostic assertions, corrected and rechecked in shared callers.
Installed artifact and final broad qualification are in progress. No complete
acceptance or required platform proof is claimed.

# Target / Scope

goal-88 and its two bounded feature tasks; no company or unrelated graph data.

# Preconditions / Environment

Later accepted implementation, exact installed tarball, supported Node engine and isolated synthetic fixture custody. Required platform evidence remains explicit.

# Notes / Follow-ups

Do not claim these future cases passed from documentation or fast CI results.
