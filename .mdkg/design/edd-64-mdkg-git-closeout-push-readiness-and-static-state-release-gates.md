---
id: edd-64
type: edd
title: mdkg git closeout push readiness and static state release gates
tags: [0.4.2, git, remote-git, sqlite-closeout, push-readiness, release-gates]
owners: []
links: []
artifacts: []
relates: []
refs: [goal-52, dec-61, dec-62, dec-63, dec-64, edd-62, edd-63]
aliases: []
created: 2026-07-05
updated: 2026-07-05
---
# Overview

Plan the `mdkg git` implementation architecture for remote lifecycle support
without mixing in project-memory semantic query UX.

# Architecture

`mdkg git` v1 uses the system Git CLI for remote operations and mdkg for
semantic evidence. The lifecycle is: resolve source descriptor, clone or fetch,
inspect accepted revision, perform local mdkg work, close mutable state into
reviewable evidence, run push-readiness gates, stage changes, and push to the
explicit remote/branch.

# Data model

- Source descriptor: source id, source kind, repository ref, default ref,
  optional path filters, opaque access ref, visibility, and freshness policy.
- Accepted revision: branch/tag/ref, commit SHA, tree or bundle hash,
  accepted-by ref, accepted-at timestamp, and validation receipt ref.
- Closeout receipt: sealed DB snapshot ref when DB state participated, static
  Markdown/JSON receipt refs, validation status, and included/excluded state.
- Push receipt: remote, branch/ref, pushed commit, validation receipt refs,
  closeout refs, access policy refs, and truncation state.

# APIs / interfaces

Implementation should choose exact flags in `task-651`, but the command family
is `mdkg git`. Required behavior includes clone or init-from-origin, fetch,
inspect/status, closeout, push-readiness, and push. Push must require explicit
remote and branch or an explicitly configured target.

# Failure modes

- Missing external Git auth: fail with actionable Git-auth guidance and no
  credential echo.
- Missing remote or branch target: fail before staging or pushing.
- Dirty or unsealed DB state: fail push-readiness until sealed snapshot and
  static Markdown/JSON receipts exist or the state is explicitly excluded.
- Failed validation or credential-safety audit: fail push-readiness.

# Observability

Receipts should include refs, hashes, validation results, staged-file summaries,
closeout artifact refs, and push result. They should not include raw secrets,
provider payloads, raw prompts, queue bodies, or runtime state roots.

# Security / privacy

Auth is external, credentials are never stored, and generated docs/templates
must use only opaque access refs or policy refs. Public names stay generic and
must not brand the primitives around a downstream product.

# Testing strategy

Use local temp Git remotes for clone/fetch/push safety tests and fixture
coverage for credential-shaped values, sealed DB snapshot proof, static receipt
export, validation failure, and explicit target requirements.

# Rollout plan

Implement through `goal-52` for `mdkg@0.4.2`. Defer project-memory semantic
queries to `goal-53`. Real npm publish, tag, push, provider mutation,
downstream repo mutation, and root bundle refresh remain separately
approval-gated.

# Links / references

- `goal-52`
- `task-654`
- `task-656`
- `test-340`
