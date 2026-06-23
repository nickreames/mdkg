---
id: epic-132
type: epic
title: apex www redirect and manual DNS cutover plan
status: backlog
priority: 1
tags: [mdkg-dev, dns, domain]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
---
# Goal

Define a manual DNS and domain cutover plan that keeps preview hosting separate from public launch.

# Scope

- Future canonical marketing host: `https://mdkg.dev`.
- Future redirect: `https://www.mdkg.dev` to apex.
- Future canonical docs host: `https://docs.mdkg.dev`.
- DNS updates remain manual and external to this repo.

# Milestones

- Confirm current nameservers and records before cutover.
- Capture Vercel-provided DNS targets during the later execution pass.
- Require Browser/Chrome preview proof before any manual DNS update.

# Out of Scope

- DNS changes.
- Registrar changes.
- Nameserver moves.
- Production promotion.

# Risks

- Premature DNS cutover could expose an unpolished public site.
- Multiple hosting targets could split SEO canonical signals.

# Links / Artifacts

- `task-468`
- `test-215`
- `dec-33`
- `dec-34`
- https://vercel.com/docs/domains/working-with-domains/add-a-domain
