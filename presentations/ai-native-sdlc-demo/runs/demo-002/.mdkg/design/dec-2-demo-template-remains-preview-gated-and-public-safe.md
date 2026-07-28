---
id: dec-2
type: dec
title: Demo 2 separates local integration from publication authority
status: accepted
tags: [demo, demo-002, authority, publication-gate, no-secret]
owners: [demo-002-agent]
links: []
artifacts: []
relates: []
refs: [goal-1, prd-2]
aliases: []
created: 2026-06-29
updated: 2026-07-26
---
# Context

The template is designed to generate reviewable website candidates, but Git
integration, publication, and provider operations belong to the invoking
workflow.

# Decision

Goal 4 may implement and locally validate the run, integrate it through the
accepted canonical adapter, and seal offline evidence. It must pause `goal-1`
with `task-3` next. Goal 5 alone may resume after a separate human publication
approval binds the candidate, complete push range, and allowlist.

Even under later approval, force push, history rewrite, project creation, DNS,
manual deployment, analytics, package publication, and provider configuration
remain forbidden.

# Alternatives considered

- Deploy directly from the template: rejected because it would blur authority and
  provider boundaries.
- Store deployment credentials in the template: rejected because mdkg evidence
  must not contain secrets.

# Consequences

- Generated candidates can be reviewed safely.
- Local canonical integration is reviewable without implying publication.
- Publication and live proof have an explicit future owner and cannot be
  inferred from local success.

# Links / references

- `goal-1`
- `prd-2`
- `test-1`
