---
id: dec-82
type: dec
title: Local workspaces exclusively own archive compression mutations
status: accepted
tags: [archive, ownership, read-only, subgraph, decision]
owners: []
links: []
artifacts: []
relates: [goal-70, edd-76, dec-29, edd-11, dec-80]
refs: [goal-70, edd-76, dec-29, edd-11, dec-80]
aliases: []
created: 2026-07-14
updated: 2026-07-14
---
# Context

The merged index intentionally exposes imported subgraph nodes with virtual
`<bundle>.zip#<internal-path>` locations. Archive compression currently treats
all indexed archives as local files, ignores `--ws` under `--all`, and can
mutate earlier local archives before a later imported projection fails.

# Decision

- Enabled configured local workspaces exclusively own archive mutations.
- Imported/read-only archives remain visible to discovery but are excluded from
  `--all` and rejected for direct mutation before path derivation.
- `--all --ws <local>` is supported; `--all --ws <imported>` fails with an
  actionable read-only-workspace error and zero writes.
- Exact workspace-qualified archive qids are accepted. A conflicting `--ws`
  fails deterministically.
- The entire selected local set passes ownership, identity, containment,
  symlink, raw-input, and destination preflight before the first write.
- Existing JSON fields remain stable. Add sorted selection/exclusion evidence.
- Existing per-file atomic replacement remains the apply guarantee; this does
  not introduce cross-archive rollback for unexpected I/O failure.

# Stable error contract

Direct imported target: `cannot compress read-only archive <qid> from imported
workspace <alias>; run compression in the source workspace and refresh the
subgraph bundle`.

Imported `--ws`: `cannot compress archives in read-only imported workspace
<alias>; run compression in the source workspace and refresh the subgraph
bundle`.

# Alternatives considered

- Filter paths containing `#`. Rejected because ownership metadata, not lexical
  path parsing, is authoritative and future transports may use other forms.
- Hide imported archives. Rejected because read-only discovery is valuable.
- Make all archives transactional. Deferred because the defect requires
  complete invalid-selection preflight, not a new cross-file storage protocol.

# Consequences

Single-repository and multi-local-workspace behavior remain compatible. Unsafe
targets fail earlier and more clearly. Receipts make mutation boundaries visible
to humans and agents. Source child repositories remain the only place imported
archive content can be recompressed.

# References

- `goal-70`
- `edd-76`
- `dec-29`
- `edd-11`
- `dec-80`

What is the situation? Why do we need a decision?

# Decision

What we decided and why.

# Alternatives considered

- alternative 1
- alternative 2

# Consequences

What changes because of this decision?

# Links / references

- related docs
- related tasks
