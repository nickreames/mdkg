---
id: task-281
type: task
title: define final 0.3.0 acceptance matrix and semver release boundary
status: done
priority: 1
epic: epic-53
parent: goal-9
prev: task-280
next: task-282
tags: [release, semver, acceptance]
owners: []
links: []
artifacts: []
relates: [goal-9, epic-53]
blocked_by: [task-280]
blocks: [task-282, task-301, task-302]
refs: [edd-15, dec-28]
aliases: [0-3-0-acceptance-matrix]
skills: [select-work-and-ground-context]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Lock the release boundary so implementation cannot shrink into a patch release
or expand into runtime execution.

# Acceptance Criteria

- Explain why optional SPEC indexing plus work invocation qualifies as 0.3.0.
- List all required implementation, docs, test, smoke, pack, and dry-run gates.
- Explicitly state that actual npm publish is out of scope.

# Files Affected

- Goal and release planning evidence.

# Implementation Notes

- Keep release boundary explicit before package metadata changes.

# Test Plan

- `node dist/cli.js capability search "mdkg-0-3-0-foundation" --json`
- `node dist/cli.js validate`

# Links / Artifacts

- `goal-9`

# 0.3.0 Acceptance Matrix

Recorded on 2026-06-06 after the `task-280` current-state audit.

## Release Boundary

`0.3.0` is the correct next source release line because this goal introduces a
new capability track, not a patch to the public queue work:

- `0.2.0` made project DB queue delivery public under `mdkg db queue ...`.
- `0.3.0` makes optional `SPEC.md` records concrete capability surfaces and
  connects them to `WORK.md`, `WORK_ORDER.md`, and `RECEIPT.md` semantic
  mirrors.
- The new public command surface is expected to include `mdkg spec ...` and
  deterministic `mdkg work trigger`, `mdkg work order status`, and
  `mdkg work receipt verify` helpers.
- mdkg still does not become a runtime. It records semantic mirrors, refs,
  hashes, receipts, and optional local queue delivery messages; humans,
  services, or external agents execute the work elsewhere.

Actual `npm publish`, git tagging, and remote pushing are out of scope for
goal-9 unless a separate explicit publish or commit request is made.

## Implementation Requirements

| Area | Required Outcome | Owning Nodes |
| --- | --- | --- |
| Optional SPEC semantics | Repos with no `SPEC.md` remain valid; present SPEC files describe reusable capability surfaces, not planning documents. | `task-282`, `task-283`, `test-107`, `test-108` |
| SPEC kind contract | New SPEC templates and validation support explicit `spec_kind` values for CLI tools, APIs, agents, runtime agents, capabilities, tools, models, runtime images, integrations, and project services. | `task-282`, `task-283`, `task-287`, `test-108`, `test-116` |
| Dogfood mdkg CLI SPEC | The mdkg repo contains at least one concrete mdkg CLI `SPEC.md` record and matching `WORK.md` contract. | `task-284`, `task-285`, `task-295`, `test-109`, `test-110`, `test-115` |
| Public SPEC helpers | `mdkg spec list`, `mdkg spec show`, and `mdkg spec validate` expose deterministic inspection and validation output. | `task-286`, `test-110` |
| WORK schema hardening | Work contracts preserve reusable invocation metadata, required capabilities, inputs, outputs, and semantic-mirror boundaries. | `task-288`, `test-111` |
| WORK_ORDER schema hardening | Work orders preserve deterministic trigger refs, input refs, payload hashes, status, queue refs, and artifact policy without becoming runtime state. | `task-289`, `test-111`, `test-112` |
| RECEIPT schema hardening | Receipts verify final outcome, proof refs, artifact/archive refs, hashes, attestation refs, and redaction boundaries. | `task-290`, `task-293`, `test-113`, `test-117` |
| Work trigger loop | `mdkg work trigger <work-or-capability-ref>` creates a deterministic `WORK_ORDER.md` semantic mirror and emits JSON. | `task-291`, `test-112`, `task-297` |
| Work status and receipt verification | `mdkg work order status` and `mdkg work receipt verify` expose deterministic JSON receipts for review and automation. | `task-292`, `task-293`, `test-113`, `task-297` |
| Optional queue bridge | Triggered work orders can optionally enqueue local project DB queue delivery messages without executing work. | `task-294`, `test-114` |
| Capability discovery linkage | Capability search/show connects SPEC, WORK, WORK_ORDER, and RECEIPT surfaces without loading graph bodies. | `task-295`, `test-115` |
| Docs/templates/assets | README, command matrix, AGENT_START, help snapshots, templates, init assets, and upgrade assets describe 0.3.0 behavior. | `task-287`, `task-298`, `task-299`, `test-116` |
| Security boundary | SPEC/WORK/ORDER/RECEIPT files must not store raw secrets, credentials, auth headers, live payment state, ledger mutations, marketplace inventory, fulfillment state, or canonical runtime execution state. | `task-300`, `test-117` |
| Package readiness | Package metadata and changelog move to `0.3.0`; full local prepublish, pack dry-run, and publish dry-run pass. | `task-301`, `task-302`, `task-304`, `test-118` |

## Required Checks Before Goal Closeout

The closeout ladder must include:

- `node dist/cli.js index`
- `node dist/cli.js validate`
- `node dist/cli.js goal show goal-9 --json`
- `node dist/cli.js goal next goal-9 --json`
- `node dist/cli.js capability list --kind spec --json`
- `node dist/cli.js capability search "mdkg cli tool spec" --json`
- `node dist/cli.js spec list --json`
- `node dist/cli.js spec show <dogfood-spec-ref> --json`
- `node dist/cli.js spec validate <dogfood-spec-ref> --json`
- `node dist/cli.js work trigger <dogfood-work-or-capability-ref> --json`
- `node dist/cli.js work order status <created-order> --json`
- `node dist/cli.js work receipt verify <created-receipt> --json`
- `npm run test`
- `npm run cli:check`
- `npm run smoke:capabilities`
- `npm run smoke:archive-work`
- `npm run smoke:db-queue-cli`
- a packed or temp-repo smoke covering SPEC-to-WORK-to-ORDER-to-RECEIPT
  verification
- `npm run prepublishOnly`
- `npm pack --dry-run --json`
- `npm publish --dry-run`
- `git diff --check`

## Out Of Scope

- No actual `npm publish`.
- No npm dist-tag mutation.
- No git tag.
- No git push unless separately requested by the operator.
- No LLM, agent runtime, payment, ledger, marketplace, fulfillment, or
  production application state execution inside mdkg.
- No product-specific naming in canonical mdkg docs or package assets.

## Current Gaps Carried Forward

- `capability list --kind spec` still returns zero records.
- `mdkg spec ...` commands do not exist yet.
- `mdkg work trigger`, `work order status`, and `work receipt verify` do not
  exist yet.
- Existing goal selector warnings for design/decision docs in `goal-9` scope
  are non-blocking, but should be cleaned during recursive-loop contract
  validation.

## Verification

- `node dist/cli.js capability search "mdkg-0-3-0-foundation" --json` should
  resolve the design anchor for this release lane.
- `node dist/cli.js validate` must pass before closing this task.
