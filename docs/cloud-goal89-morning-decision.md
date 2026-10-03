# Goal89 decision record — superseded request

Nick resolved the product direction: immediate use after fresh init and an
explicit safe path for existing legacy graphs, with indefinite quarantine,
explicit recovery/purge and no automatic deletion. No further owner product
choice is pending for this bounded implementation.

The old H1 mandatory-v2 prerequisite was independently reviewed for its binding
premise but was not accepted as the product direction. It is superseded by
**working-host-anchor-v1** in [the current contract](cloud-goal89-design.md) and
[contract delta](cloud-goal89-contract-delta.md). Historical proposal/evidence
remain bound to their original commits, including dbbe7974.

The new marker lives outside ignored working storage and supplies independent
legacy host binding without migrating canonical nodes. V2 uses its existing
canonical ID. Neither path authenticates owners or proves checkout origin.
Copies cannot bootstrap host identity. Local persistence is not backup.

Independent exact-patch review at Chk675 remains pending. This record does not
mark it complete or authorize merges, publication, tags, deployment or adoption.
The parent coordinates review before continuing the sequential Goal90 branch.
