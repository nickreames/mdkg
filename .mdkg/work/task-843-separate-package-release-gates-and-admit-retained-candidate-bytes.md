---
id: task-843
type: task
title: Separate package release gates and admit retained candidate bytes
status: done
priority: 1
tags: [release-0.6.0, qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/task-843-final-qualification.json, .mdkg/artifacts/goal-86/task-843-isolated-package-gates.cjs]
relates: []
blocked_by: []
blocks: []
refs: [dec-100, task-829, task-830, test-490]
context_refs: [goal-86]
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-09-28
updated: 2026-09-28
---
# Overview

Goal: Separate package-local release acceptance from deferred website/hosted
qualification and consume retained candidate bytes with exact input admission.
Context: Dec100; all46 canonical smoke definitions survive,37 gate the package.
Owner: mdkg-project-agent, one repository writer under the approved Goal86 run.

# Acceptance Criteria

- Package and repository profiles partition37/9 smoke membership without dropping
  aliases, site profiles or hosted fail-closed state. Package builds/preflight/
  packing/readiness need no website dependency installation or site execution.
- Retained admission verifies explicit artifact SHA256, source/package-input and
  payload identity; rejects stale, missing, replaced, linked or malformed inputs;
  rehashes before/after consumption. Original candidate and capture are immutable.
- Keep package/harness evidence separate and preserve Git staging and protected
  state. No public mdkg API or graph/runtime capability changes.
- Test490 passes focused source/harness controls. Task828 and final Task829 remain
  separate acceptance gates; completing this task is not release clearance.

# Files Affected

Owned release scripts/manifest, dependency and artifact admission helpers, focused
tests, required mdkg evidence/projections. Package metadata/inputs remain unchanged
unless a demonstrated necessity is explicitly recorded and requalified.

# Implementation Notes

Reuse existing release runner/context and artifact helpers. Default prepublish is
package scope; repository/hosted modes retain full definitions. Scope must propagate
to nested build/prepack/dependency/assertion calls. Invalid profiles fail closed.
Do not change the hosted stub to green or make local receipts imply hosted proof.
Preserve the accepted 186-path baseline and runtime/selection/bundle bookends.
Use scoped claims, no fabricated lease CLI or DB initialization. No external writes.

# Test Plan

Exact membership, repository preservation, missing-site package preflight, nested
scope propagation, retained-artifact success, stale/source/payload/hash/link refusal,
no replacement/repack, unchanged staging, and affected positive controls. Use
focused tests while iterating; full package ladder is Task829 after independent review.

# Links / Artifacts

- `.mdkg/artifacts/goal-86/package-closeout-custody.json`; Dec100; Test490.

# Qualification result - 2026-09-28

The package profile requires37 smokes and root dependencies; all46 definitions,
nine site smokes/profiles and the honest hosted stub remain. Exact retained
admission binds269 package inputs and234 actual payload files, rejects mutable
output aliases and same-byte replacement, and independently binds341 harness
inputs. The original6154e4ea tarball and its original capture remain unchanged.

73 focused subsystem/shared-helper tests pass on Node24.18/macOS arm64. Actual
isolated offline prepack passes with zero site dependency trees/site builds and
identical234-file payload. The real-runner mechanical controls prove37 routing,
no repack and unchanged staging; their mocked external gates are not release
qualification. Four bounded review findings were fixed and independently read
back. Full graph validation has zero errors/three preserved stale-bundle warnings;
changed-only has zero errors/warnings. Later Task828/829/830 remain required.

Evidence: `.mdkg/artifacts/goal-86/task-843-final-qualification.json`.
