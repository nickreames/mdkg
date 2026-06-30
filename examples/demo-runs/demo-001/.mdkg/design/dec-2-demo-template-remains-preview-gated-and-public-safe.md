---
id: dec-2
type: dec
title: demo template remains preview gated and public safe
status: accepted
tags: [demo, preview, boundary, no-secret]
owners: []
links: []
artifacts: []
relates: []
refs: [goal-1]
aliases: []
created: 2026-06-29
updated: 2026-06-29
---
# Context

The template is designed to generate shareable website candidates, but preview
deployment and durable hosting are parent-repo responsibilities.

# Decision

Keep the template local-first and public-safe by default. The template may
recommend Vercel preview approval during closeout, but it must not deploy,
change DNS, activate analytics, publish packages, push commits, or promote
durable hosting on its own.

# Alternatives considered

- Deploy directly from the template: rejected because it would blur approval and
  provider boundaries.
- Store deployment credentials in the template: rejected because mdkg evidence
  must not contain secrets.

# Consequences

- Generated candidates can be reviewed safely.
- Parent `goal-44` owns preview deployment approval and evidence.
- Parent `goal-46` owns durable `demo-N.mdkg.dev` hosting.

# Links / references

- `goal-1`
- `test-1`
