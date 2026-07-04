---
id: dec-62
type: dec
title: authenticated Git access is represented only by opaque access and policy refs
status: accepted
tags: [remote-git, credential-safety, generic-capability]
owners: []
links: []
artifacts: []
relates: []
refs: [goal-51, task-650, test-338, dec-61]
aliases: []
created: 2026-07-03
updated: 2026-07-03
---
# Context

Remote Git graph discovery may need authenticated repository access. mdkg must
make that access addressable without becoming a secret store or recording live
credentials.

# Decision

Authenticated Git access is represented only by opaque access refs, capability
refs, policy refs, or proof hashes.

Allowed fields include references such as `access_ref`,
`credential_policy_ref`, `git_capability_ref`, `secret_grant_ref`, or
`access_proof_hash`. These identify external authority without revealing the
secret, token, SSH key, agent socket path, provider payload, or live runtime
state.

mdkg may validate the shape, presence, linkage, visibility, and redaction class
of these refs. mdkg must not store or print raw Git credentials, PATs, SSH key
material, agent socket paths, bearer tokens, provider auth payloads, or live
secret values.

# Alternatives considered

- Store tokens or deploy keys in mdkg. Rejected; mdkg is durable project memory,
  not a secret vault.
- Store local SSH agent socket paths. Rejected; they are live machine-local
  runtime state and can become sensitive operational data.
- Require public repos only. Rejected; authenticated sources are valid, but
  their access must be represented by safe refs.

# Consequences

- Future source, docs, templates, and fixtures must use placeholder refs and
  hashes, not credential-shaped example values.
- Validators should treat raw credential-like fields or values as errors or
  high-severity warnings before release.
- Downstream runtimes own vault integration, grant minting, key usage, and
  revocation policy.

# Links / references

- `goal-51`
- `task-650`
- `test-338`
- `service-boundary-ownership-check`
