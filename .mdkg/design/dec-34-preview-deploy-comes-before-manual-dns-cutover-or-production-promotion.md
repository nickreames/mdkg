---
id: dec-34
type: dec
title: preview deploy comes before manual DNS cutover or production promotion
status: proposed
tags: [mdkg-dev, vercel, dns]
owners: []
links: []
artifacts: []
relates: []
refs: []
aliases: []
created: 2026-06-22
updated: 2026-06-22
---
# Context

The site is useful enough to deploy for critique, but public launch still needs polish, Starlight docs work, and manual DNS coordination.

# Decision

Deploy previews first. Do not update DNS, promote production, or treat the preview as public launch until Browser/Chrome evidence and human review accept the result.

# Alternatives considered

- Cut over DNS immediately: rejected because current docs are not yet Starlight and polish work remains.
- Keep local only until perfect: rejected because live preview feedback is valuable and low-risk when DNS is not changed.

# Consequences

- The next implementation pass may create Vercel preview projects.
- DNS remains a separate later approval gate.
- Preview URLs become critique artifacts, not canonical public launch artifacts.

# Links / references

- `goal-27`
- `task-467`
- `test-216`
- related tasks
