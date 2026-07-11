---
id: dec-68
type: dec
title: Target AI coding teams with package first evidence gated loop release messaging
status: accepted
tags: [release, audience, messaging, package-first]
owners: []
links: []
artifacts: []
relates: [goal-62, goal-63, goal-64]
refs: [goal-61, goal-62, goal-63, goal-64, edd-71, dec-73, prd-11]
aliases: [package-first-loop-release-messaging]
created: 2026-07-10
updated: 2026-07-10
---
# Context

The loop release needs a coherent audience, evidence standard, design process,
and activation order before public implementation begins.

# Decision

- Primary audience: AI coding teams and agent-harness engineers. Maintainers
  adopting mdkg are secondary.
- Value story: loops are durable reusable processes that can span goals, retain
  provenance, recover from blockers, and pursue a high definition of done.
- Claims use Known, Inferred, Assumed, and Missing labels; no invented ROI or
  unsupported competitive claims.
- Product Design audits current surfaces first, then presents exactly three
  visual directions for operator selection.
- Public promotion stays dormant behind one source-controlled activation flag.
- Package publication and verification precede website activation.
- `dec-73` owns the accepted incremental announcement placement, security-first
  walkthrough, top-level Loops docs, and dormant-route behavior.

# Alternatives considered

- Lead with broad knowledge-graph positioning. Rejected because it obscures the
  concrete loop release and weakens source-backed proof.
- Publish the website announcement before npm. Rejected because install claims
  would temporarily outrun registry truth.
- Allow the design agent to choose a direction autonomously. Rejected because
  this goal is intentionally collaborative.

# Consequences

Goal 2 must collect explicit design and messaging decisions. Goal 3 implements
the accepted direction locally with promotion dormant. Goal 4 uses the
package-first, two-phase activation sequence. Detailed surface decisions remain
separate in `dec-73` so this audience and evidence policy stays stable.

# Links / references

- `edd-71`
- `prd-11`
- `dec-73`
- `goal-62`
- `goal-63`
- `goal-64`
