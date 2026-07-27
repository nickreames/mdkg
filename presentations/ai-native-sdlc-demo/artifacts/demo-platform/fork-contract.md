# Deterministic Website-Demo Bootstrap Contract

Status: accepted for the Goal 2 reusable platform
Owner: shared-source writer
Execution root: repository root

## Frozen graph commands

Demo 2:

```text
mdkg graph fork examples/website-demo-template/.mdkg --target presentations/ai-native-sdlc-demo/runs/demo-002 --start-goal goal-1 --json
```

Demo 3:

```text
mdkg graph fork examples/website-demo-template/.mdkg --target presentations/ai-native-sdlc-demo/runs/demo-003 --start-goal goal-1 --json
```

The reusable wrapper is:

```text
node scripts/bootstrap-website-demo-run.js --source examples/website-demo-template --target <run-root> --start-goal goal-1 --manifest presentations/ai-native-sdlc-demo/artifacts/demo-platform/operator-materialization-manifest.json --receipt <run-root>/BOOTSTRAP_RECEIPT.json
```

## First-run transaction

1. Require a repository-contained, absent target.
2. Parse and verify every required manifest source, SHA-256, mode, target path,
   and projection family.
3. Compute a deterministic canonical `.mdkg` source-tree hash.
4. Run the frozen graph-fork command with `goal-1`.
5. Require preserved ids and a valid selected `root:goal-1`.
6. Materialize the exact operator files and both skill-mirror families.
7. Verify each mirror against its target canonical `.mdkg/skills` file.
8. Reject any unexpected generated target.
9. Validate the child with zero warnings and errors.
10. Require clean routing to `root:spike-1`.
11. Build concise and standard dry-run packs with the explicit edge list
    `parent,epic,relates,blocked_by,blocks,prev,next,context_refs,evidence_refs`.
12. Require both packs to contain the complete source work chain, PRD, EDD,
    decisions, current contract checkpoint, and required skills.
13. Write a public-safe receipt excluding itself from the generated inventory.

## Repeat transaction

An existing target is accepted only when its prior bootstrap receipt exists.
The default repeat mode is verify-only:

- do not fork or overwrite;
- reverify the current manifest sources and every materialized target;
- reject missing files, content drift, skill-mirror drift, or unexpected files;
- require the source-tree hash, manifest hash, and complete generated inventory
  to equal the prior receipt;
- rerun validation, routing, and both explicit-edge packs;
- update the receipt only after every check passes.

## Receipt contract

The receipt records:

- source and target roots;
- canonical command and frozen graph-fork command;
- canonical and CLI source-tree hashes;
- manifest path and SHA-256;
- preserved id and selected goal;
- every generated path, SHA-256, and mode;
- validation and routing results;
- concise and standard pack roots, counts, edge list, and included QIDs;
- create versus verify-only mode;
- repeat result and failure classification.

It excludes credentials, tokens, cookies, raw prompts, provider payloads,
private context, deployment state, and unrelated repository data.

## Fail-closed classifications

- `unexpected_target`
- `missing_source_input`
- `manifest_source_hash_mismatch`
- `missing_target_input`
- `target_content_drift`
- `skill_mirror_mismatch`
- `unexpected_target_content`
- `inventory_drift`
- `goal_id_mismatch`
- `validation_failed`
- `routing_failed`
- `pack_failed`

The wrapper emits a compact JSON failure object and does not overwrite or
repair a drifted target.

## Ownership boundary

This contract creates only authored child graph state and deterministic
operator context. Goal 4 owns Demo 2 creation and specialization. Goal 6 owns
Demo 3 creation and specialization. Neither child is root-registered. This
contract does not authorize specialization, website implementation, Git
integration, commit, push, deployment, provider mutation, or publication.
