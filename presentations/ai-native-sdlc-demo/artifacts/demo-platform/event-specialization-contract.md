# Website Demo Source Release, Run Binding, and Event Authority Contract

Status: accepted reusable contract; no event authority instantiated here

## Ownership Model

The reusable workflow has four non-overlapping owners:

1. The semantic source release owns authored graph topology, invariant
   requirements, operator files, and skills.
2. The immutable run binding owns run identity and bounded specialization
   values.
3. The child owns mutable execution state, outputs, evidence, and runtime
   checkpoints.
4. The caller owns shared-source leases, Git authority, provider visibility,
   validity windows, repair limits, and fallback selection.

No post-fork authored graph editing belongs to the normal path.

## Deterministic Materialization

The bootstrap consumes:

```text
source root + semantic release manifest + operator manifest +
immutable run binding
```

and emits:

```text
exact authored child graph + deterministic operator files + RUN_BINDING.json +
CHILD_INTERFACE.json + IMMUTABLE_CHILD_CONTRACT.json + bootstrap receipt
```

The source release inventories authored graph, operator, skill, README, and
ignore inputs. It excludes generated indexes, SQLite, events, packs, selected
state, runtime receipts/checkpoints, and outputs.

The binding includes only:

- run ID and target root;
- detail/output routes and component key;
- bounded positioning brief and creative latitude;
- one designated harness and timing profile hash;
- portable output and deterministic receipt destinations;
- declared immutable and runtime-mutable field classes.

It contains no credentials, provider payloads, approval, origin observation,
lease, quiet window, allowlist, or self-issued authority.

The child interface resolves source, binding, routes, component, chain, and
receipt identities. The authored contract seal hashes semantic authored child
content, operator inventory, binding, interface, topology, and immutable
requirements. Normal statuses, events, indexes, packs, evidence, outputs, and
runtime checkpoints remain mutable.

## Complete Generic Chain

`spike-1 → task-1 → test-1 → task-2 → test-2 → task-3 → test-3 → accepted runtime checkpoint`

- `spike-1` records the run's public-safe creative decision.
- `task-1` produces one portable `DemoOutput.astro`.
- `test-1` validates the local static candidate.
- `task-2` performs thin canonical integration only under a caller lease.
- `test-2` builds once and runs shared-output checks serially.
- `task-3` publishes only under a separate matching human authority receipt.
- `test-3` verifies exact-SHA deployments and bound public routes read-only.

The presence of later topology is not authority.

## Event-Specific Caller Artifacts

Goal 6 later creates these outside the child:

- `artifacts/demo-003/run-binding.json`
- `artifacts/demo-003/preparation-baseline-handoff.json`
- `artifacts/demo-003/event-authority-policy.json`
- `artifacts/demo-003/event-authority.json`
- exact path-and-operation allowlist and writer lease receipts
- sealed Demo 2 fallback identity

The child consumes their hashes only. Any source, binding, child seal,
allowlist, baseline, origin, lease, authority, owner, or validity drift fails
closed.

## Timed Event Boundary

The accepted profile is single-harness and approximately 30 minutes. It is not
a multi-harness comparison or endurance demonstration.

- T0: immediately before exact child dispatch, no later than P0+00:45
- positioning: T+02
- portable implementation: T+13
- local validation: T+16
- canonical integration and validation: T+20
- normal push: T+22
- no production repair after T+24
- exact-SHA deployments READY: T+26
- routes and child checkpoint: T+28:30
- consolidated reveal receipt: T+29:15
- success/fallback selection: T+29:30
- global stop/fallback visible: T+30

At most two pre-publication repairs and one production repair are allowed. The
global deadline overrides remaining attempts.

## Frozen Event Allowlist Shape

Event authority later binds exact hashes for:

- the materialized run directory and child-local evidence;
- one demo data record and registry row;
- one portable output component, thin wrapper, and static output registration;
- evidence-backed claim map rows;
- exact smoke fixtures and checks required for the bound routes;
- Goal 7 compact event receipts.

No package, lockfile, docs, deployment configuration, DNS, analytics, provider
configuration, tag, force push, history rewrite, or unrelated source is
implied.

## Activation Gate

Live execution starts only after:

- Goal 6 readiness is accepted;
- the preparation baseline is already published and its writer lease released;
- the semantic release, binding, child interface, and authored seal verify;
- the branch/origin/allowlist/range preflight is fresh and zero behind;
- the quiet window excludes parallel root/Git writers;
- credentials and provider read visibility are available without storing them;
- the normative sendoff, timed-run profile, event authority, and fallback
  hashes all match.

## Reveal and Failure Honesty

The reveal shows the reusable source specification, bound/executed child,
landing page, Plan → Work → Evidence, what completed/why/next, and exact-SHA
route receipts. It does not teach graph-fork mechanics.

On a hard blocker, seal precise evidence, stop side effects, reveal the
caller-named fallback, and state that the current run did not complete.
