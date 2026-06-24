---
id: dec-48
type: dec
title: diagrams are deterministic accessible HTML CSS SVG and generated image assets are deferred
status: accepted
tags: [mdkg-dev, diagrams, accessibility, creative-production]
owners: []
links: []
artifacts: [archive://archive.mdkg-dev-preview-audit-pass-5-2026-06-24]
relates: []
refs: [archive://archive.mdkg-dev-preview-audit-pass-5-2026-06-24]
aliases: []
created: 2026-06-24
updated: 2026-06-24
---
# Context

The site needs clearer visual explanation, but launch-ready polish should not introduce opaque generated assets that are hard to test or maintain.

# Decision

Diagrams in this pass should be deterministic accessible HTML/CSS/SVG. Generated final image, video, or production art assets are deferred unless a later explicit task rescope approves them.

# Alternatives considered

- Generate final imagery or videos during pass 5.
- Use deterministic accessible diagrams now and plan generated assets later.

# Consequences

Creative Production review is used for direction and hierarchy, while implementation remains accessible and source-controlled.

# Links / references

- `goal-35`
- `edd-53`
- `task-559`
