---
id: dec-85
type: dec
title: Package publication requires a dedicated release goal and current approval
status: accepted
tags: [lifecycle, release, authority, skills]
owners: []
links: []
artifacts: []
relates: [edd-79, epic-254, goal-74]
refs: [edd-79, epic-254, goal-74]
aliases: [explicit-package-release-authority, no-publish-ordinary-closeout]
created: 2026-07-16
updated: 2026-07-16
---
# Context

The portable goal lifecycle must be safe for ordinary implementation, docs,
policy, and graph work. Package publication has a different blast radius and
requires registry, release, Git, and downstream upgrade decisions that are not
implied by finishing a normal goal. Keeping publication steps in ordinary
goal-pursuit guidance would blur those authority levels and would expose
registry behavior in public default seeds.

# Decision

Package publication is owned by a dedicated repository-local
`release-mdkg-package` skill. The skill may be used only when all of the
following are true:

- an explicit package release goal QID is supplied;
- `mdkg goal show <release-goal-qid>` confirms release scope;
- current operator approval covers package publication;
- required local validation is complete; and
- push, tag, deploy, and downstream upgrade actions are separately authorized.

The public default seed contains `pursue-mdkg-goal` but never
`release-mdkg-package`. Ordinary lifecycle closeout records checkpoint evidence,
evaluates the explicit goal, marks it done only when supported, and may create a
path-specific local commit. It does not inspect registry credentials, publish a
package, push, tag, deploy, or mutate a provider.

# Alternatives considered

- Keep publication instructions in ordinary closeout. Rejected because goal
  completion is not publication authority.
- Add the release skill to public defaults. Rejected because package release is
  repository-owned, not a portable consumer workflow.
- Publish as part of this policy change. Rejected because this lane authorizes
  one local commit only and the release handoff has no current publication
  approval.

# Consequences

- `pursue-mdkg-goal` remains generic, portable, and safe by default.
- Package release procedure is discoverable to repository maintainers without
  entering initialized consumer projects.
- `goal-75` preserves the future release handoff in paused state.
- Publication, Git push, tag, deploy, and managed consumer upgrade remain
  separate approval and execution boundaries.

# Links / references

- `edd-79`
- `epic-254`
- `goal-74`
- `goal-75`
