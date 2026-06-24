---
id: dec-41
type: dec
title: analytics DNS production promotion and GitHub metadata changes remain explicit launch actions
status: accepted
tags: [mdkg-dev, launch-boundary, vercel, github, pass-3]
owners: []
links: []
artifacts: []
relates: []
refs: [archive://archive.mdkg-dev-polish-pass-3-2026-06-24]
aliases: [explicit-launch-side-effects]
created: 2026-06-24
updated: 2026-06-24
---
# Decision

Goal 33 may push `main` and validate existing Vercel previews, but analytics activation, DNS cutover, production promotion, npm publish, git tags, public launch announcements, and GitHub repo setting changes require later explicit approval.

# Rationale

Pass-3 is a public-alpha polish and preview-validation pass. External launch state should remain deliberate and separately auditable.

# Consequences

- GitHub metadata changes become a handoff, not an executed setting mutation.
- Vercel Analytics remains production-only and deferred.
- Vercel preview validation records deployment ids and URLs without custom-domain changes.

# Context

# Alternatives considered

# Links / references
