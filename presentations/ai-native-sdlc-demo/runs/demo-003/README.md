# Website Demo Template

This is the canonical semantic source release for forked mdkg website demos.
The graph owns reusable work topology and invariant requirements. A validated
run binding supplies identity and bounded run-specific values without rewriting
the authored child graph after the fork.

## Start From One Explicit Root

Replace `<run-root>` with the materialized run directory:

```bash
mdkg --root <run-root> validate --json
mdkg --root <run-root> goal next goal-1 --json
mdkg --root <run-root> pack spike-1 --profile concise \
  --edges context_refs,evidence_refs --skills auto --dry-run --stats
```

The first actionable node must be `spike-1`. Before execution, inspect
`RUN_BINDING.json`, `CHILD_INTERFACE.json`, `IMMUTABLE_CHILD_CONTRACT.json`,
`DEMO_HANDOFF_PROMPT.md`, `DESIGN.md`, `WEBSITE_DEMO_TEMPLATE_BRIEF.md`,
`CREATIVE_PRODUCTION_INTAKE.md`, `prd-2`, `edd-1`, `dec-1`, and `dec-2`.

## Reusable Contract

- Ocean Flow is the baseline design system.
- Static Astro emits semantic HTML and CSS with zero client-side JavaScript.
- Each run selects its own audience promise, composition, visual metaphor,
  hierarchy, imagery, and bounded marketing copy in `spike-1`.
- `task-1` produces one portable `DemoOutput.astro`; later integration uses a
  thin caller-owned wrapper and registry binding.
- Shared build output is built once and checked serially.
- The complete authored chain is:
  `spike-1 → task-1 → test-1 → task-2 → test-2 → task-3 → test-3`.
- Runtime statuses, events, indexes, packs, evidence, checkpoints, and outputs
  are mutable execution state and are excluded from semantic source identity.
- The accepted semantic source release, immutable run binding, child interface,
  and authored child-contract seal are generated before work starts.

## Authority Boundary

The source graph contains integration, publication, and production-verification
topology, but it grants no external authority. `task-2` requires a caller-owned
shared-source lease. `task-3` requires a separate matching human authority
receipt before any commit or normal non-force push. `test-3` performs only
authorized read-only provider and public-route verification.

Without valid caller authority, fail closed with an evidence receipt. Never
infer permission from the source graph, run binding, local success, a previous
run, or a checkpoint. Force push, history rewrite, DNS, project configuration,
manual redeploy, analytics, package publication, credentials, and unrelated
integration remain forbidden.

## Operator Lifecycle

For each routed node:

```bash
mdkg --root <run-root> goal claim goal-1 <node-id> --json
mdkg --root <run-root> task start <node-id> --json
mdkg --root <run-root> pack <node-id> --profile standard \
  --edges context_refs,evidence_refs --skills auto --skills-depth full
# Execute only the selected node and run its required checks.
mdkg --root <run-root> task done <node-id> --json
mdkg --root <run-root> goal evaluate goal-1 --json
```

Create the final accepted execution checkpoint only after `test-3` passes and
goal evidence consistently names the completed chain and receipts.

## Expected Pack Coverage

Concise and standard first-node packs contain `goal-1`, `epic-1`, `spike-1`,
`task-1`, `test-1`, `task-2`, `test-2`, `task-3`, `test-3`, `prd-2`, `edd-1`,
`dec-1`, `dec-2`, `chk-3`, and all required skills without truncation.

## Public-Safety Boundary

Do not retain raw prompts, secrets, credentials, tokens, cookies, provider
payloads, unrelated private context, or bulky traces. Do not add client
directives, hydration, runtime scripts, remote fonts, analytics, forms,
trackers, third-party runtime assets, or unsupported product claims.
