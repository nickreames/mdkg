---
id: dec-64
type: dec
title: git auth stays external and mdkg stores only opaque access evidence
status: accepted
tags: [0.4.2, git, auth, credential-safety, access-ref]
owners: []
links: []
artifacts: []
relates: []
refs: [goal-52, dec-62, task-653, task-654, task-656, test-339, test-340]
aliases: []
created: 2026-07-05
updated: 2026-07-05
---
# Context

`mdkg git` needs real remote clone/fetch/push support, but mdkg must remain
durable project memory rather than a secret store.

# Decision

Git auth stays external in v1. The system Git CLI may use credential helpers,
SSH configuration, `gh`, CI/runtime environment, or user shell state. mdkg must
not store or print tokens, SSH keys, agent socket paths, bearer tokens, provider
auth payloads, or live secret values.

mdkg may store opaque access refs, credential policy refs, capability refs,
accepted revision refs, validation receipt refs, and proof hashes.

# Alternatives considered

- Store credentials in mdkg config. Rejected because mdkg graph state is durable
  and reviewable.
- Require public repositories only. Rejected because authenticated repositories
  are valid if auth remains external.
- Runtime-only auth abstraction. Rejected for `mdkg git` v1 because the command
  should work directly from a developer or agent shell.

# Consequences

- Source descriptor and receipt fixtures must use opaque refs and hashes.
- Validators and release gates must reject credential-shaped values.
- Real push behavior is permitted only when external Git auth succeeds and
  push-readiness gates pass.

# Links / references

- `goal-52`
- `dec-62`
- `test-339`
- `test-340`
