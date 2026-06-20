# External Runtime Integration Upgrade Megaprompt

You are a repo-scoped Codex agent working in the runtime integration repo:

- Target repo: `/Users/nick/omni-chat-rooms/projects/omni-room-runtime`
- Reference source repo: `/Users/nick/omni-chat-rooms/projects/mdkg`
- Do not edit the mdkg source repo during this runtime pass.
- Do not store raw prompts, provider payloads, queue payloads, cookies, tokens, credentials, or bulky execution traces in mdkg files.

## Mission

Upgrade the runtime repo's mdkg graph and adapter usage to consume the new generic mdkg integration UX capabilities once the mdkg version containing `goal-22` work is installed or otherwise available. Treat this as runtime-owned integration work, not an mdkg feature implementation.

The runtime repo should continue to use mdkg as durable semantic memory and graph state. Runtime-owned queues, events, receipts, and artifacts remain runtime-local evidence unless they are represented in mdkg as refs, hashes, checkpoints, archive links, or sanitized summaries.

## Hard Boundaries

- Do not mutate sibling repos.
- Do not publish npm packages, push, tag, or deploy unless separately requested.
- Do not weaken mdkg validation to hide real graph errors.
- Do not copy raw model prompts, raw model output, raw provider payloads, raw queue payloads, secrets, or credentials into mdkg nodes, checkpoints, receipts, packs, or handoffs.
- Keep backend-owned identity, policy, billing, ledger, and canonical persistence out of mdkg.
- Keep sandbox/provider lease lifecycle and provider receipts in their owning systems; use mdkg refs and summaries only.

## Preflight

Run these commands from the runtime repo and record evidence in the runtime mdkg graph:

```bash
git status --short --branch
mdkg --version
mdkg status --json
mdkg doctor --strict --json
mdkg validate --json
mdkg goal current --json
mdkg goal next --json
mdkg db queue contract --json
```

If `mdkg db queue contract --json`, `mdkg graph refs`, `mdkg handoff create`, `mdkg work validate`, `mdkg format --headings`, or `context_refs` / `evidence_refs` support is missing, stop and upgrade mdkg before continuing.

## Runtime mdkg Goal To Create

Create one active runtime-owned umbrella goal, with generic product wording appropriate for the runtime repo:

```bash
mdkg new goal "Adopt mdkg integration UX and adapter contract hardening" --json
```

Recommended goal shape:

- `goal_state: active`
- `priority: 1`
- `goal_condition`: runtime graph, adapter code, queue contract usage, workflow mirrors, checkpoints, warning hygiene, and handoff packaging are aligned with the new mdkg integration UX surfaces.
- Required checks:
  - `mdkg status --json`
  - `mdkg doctor --strict --json`
  - `mdkg validate --json`
  - `mdkg work validate --json`
  - `mdkg db queue contract --json`
  - `mdkg graph refs <active-goal-id> --json`
  - repo test/build commands for runtime, including adapter tests
  - `git diff --check`

Suggested epics:

- `mdkg graph upgrade and warning hygiene`
- `runtime adapter queue contract alignment`
- `workflow mirror validation and semantic refs`
- `checkpoint and handoff closeout UX`
- `integration E2E and root refresh handoff`

Suggested tasks:

- Audit current mdkg version, graph health, selected goal state, and warning categories.
- Run `mdkg upgrade --dry-run --json`; apply only after reviewing the receipt.
- Replace stale completed-goal `active_node` conventions with upgraded `last_active_node` semantics.
- Move contextual refs and evidence refs out of executable `scope_refs` where appropriate.
- Add or update runtime adapter tests against `mdkg db queue contract --json`.
- Add `mdkg work validate --json` to runtime closeout checks for SPEC, WORK, WORK_ORDER, and RECEIPT mirrors.
- Add checkpoint kinds for implementation milestones, test proof, goal closeout, audits, and cross-repo handoffs.
- Add `mdkg handoff create <goal-id> --out .mdkg/handoffs/<safe-name>.md --json` to closeout.
- Write a sanitized root-orchestrator handoff prompt after runtime validation passes.

Suggested tests:

- Completed or achieved runtime goals do not produce stale active-node warnings.
- Runtime goals can reference context/evidence nodes without treating them as executable queue items.
- `mdkg graph refs` explains inbound/outbound refs, blockers, and semantic refs for the active runtime goal.
- Checkpoint templates include command evidence, pass/fail status, known warnings, changed surfaces, boundaries, and follow-up refs.
- `mdkg work validate --json` checks runtime SPEC/WORK/WORK_ORDER/RECEIPT mirrors and emits warnings, not hard failures, for obvious raw markers.
- Runtime adapter queue behavior matches the public queue contract for payload hashing, dedupe, oldest-ready claim order, lease-owner checked settlement, retry, dead-letter, release-expired, pause/resume, and stats.
- `mdkg handoff create` excludes raw markers and includes goal state, checkpoint summaries, required checks, and scope boundaries.

## Adapter Alignment Notes

Inspect `crates/omni-mdkg-adapter/src/lib.rs` and related tests. Keep the adapter on a fixed-command allowlist rather than arbitrary SQL or broad shell execution.

Use `mdkg db queue contract --json` as the durable contract source. The adapter may continue to use SQLite-backed queue delivery, but its tests should assert these mdkg semantics:

- Payload JSON is canonicalized before hashing and storage.
- Dedupe is scoped by queue name plus non-null dedupe key.
- Claim selects the oldest ready or expired leased message by `available_at_ms`, `created_at_ms`, then `message_id`.
- `ack`, `fail`, and `dead-letter` validate the lease owner.
- Retry delay and max-attempt dead-letter behavior are deterministic.
- `release-expired` makes expired leased messages ready without incrementing attempts.
- Paused queues reject enqueue and claim while allowing settlement, release-expired, stats, list, and show.
- Snapshot policy is drain by default; paused queues are only commit-safe under the explicit paused policy.

Do not make mdkg store every raw runtime receipt or queue payload as durable graph memory. Store refs, hashes, redacted envelopes, archive links, and semantic closeout checkpoints.

## Workflow Mirror Alignment

Use mdkg workflow files as semantic mirrors:

- `SPEC.md` describes reusable capabilities.
- `WORK.md` describes invocable work contracts.
- `WORK_ORDER.md` describes execution requests.
- `RECEIPT.md` describes closeout evidence.
- `FEEDBACK.md`, `DISPUTE.md`, and `PROPOSAL.md` remain semantic coordination records.

Run:

```bash
mdkg work validate --json
mdkg work validate --type spec --json
mdkg work validate --type work --json
mdkg work validate --type work_order --json
mdkg work validate --type receipt --json
```

Any raw-content warnings should be reviewed. Prefer removing raw content or replacing it with `proof://`, `artifact://`, `archive://`, commit hashes, receipt hashes, and bounded summaries.

## Semantic Refs Guidance

Use these fields intentionally:

- `scope_refs`: executable local goal queue.
- `context_refs`: background specs, decisions, checkpoints, subgraph nodes, docs, and URI refs.
- `evidence_refs`: proof nodes, checkpoints, receipts, archive refs, artifact refs, hashes, and external proof URIs.

Run:

```bash
mdkg graph refs <goal-or-task-id> --json
mdkg pack <goal-or-task-id> --edges context_refs,evidence_refs --format json --out .mdkg/pack/<safe-name>.json
mdkg handoff create <goal-or-task-id> --out .mdkg/handoffs/<safe-name>.md --json
```

Subgraph nodes are read-only planning context. If a runtime goal is blocked by a root or sibling graph node, record that as contextual planning evidence rather than trying to mutate the external graph.

## Warning Hygiene

Use warning filters to reduce historical noise without hiding real errors:

```bash
mdkg validate --json
mdkg validate --changed-only --json
mdkg format --headings --dry-run --json
```

Only apply heading formatting after reviewing the dry-run receipt:

```bash
mdkg format --headings --apply --json
mdkg index
mdkg validate --json
```

## Closeout

Before closing the runtime goal:

```bash
mdkg status --json
mdkg doctor --strict --json
mdkg validate --json
mdkg work validate --json
mdkg db queue contract --json
mdkg handoff create <runtime-goal-id> --out .mdkg/handoffs/runtime-integration-closeout.md --json
git diff --check
```

Record a goal closeout checkpoint:

```bash
mdkg task done <final-task-id> \
  --checkpoint "runtime integration mdkg UX adoption readiness" \
  --checkpoint-kind goal-closeout \
  --json
```

The closeout handoff should include:

- mdkg version and runtime repo commit.
- Graph health and selected goal state.
- Adapter contract evidence.
- Workflow validation evidence.
- Warning categories reviewed.
- Tests run and pass/fail status.
- Root-orchestrator refresh recommendation.
- Any remaining deferred work with explicit refs.
