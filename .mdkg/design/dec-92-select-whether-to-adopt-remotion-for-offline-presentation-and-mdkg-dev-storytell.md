---
id: dec-92
type: dec
title: Select whether to adopt Remotion for offline presentation and mdkg.dev storytelling
status: accepted
tags: [remotion, presentation, mdkg-dev, offline]
owners: [root-integration-owner]
links: []
artifacts: [artifact://remotion/options-comparison, artifact://remotion/evaluation-rubric, artifact://remotion/feasibility-receipt, artifact://remotion/decision-receipt, .mdkg/artifacts/goal-79/remotion/options-comparison.md, .mdkg/artifacts/goal-79/remotion/evaluation-rubric.md, .mdkg/artifacts/goal-79/remotion/feasibility-receipt.md, .mdkg/artifacts/goal-79/remotion/decision-receipt.md]
relates: []
refs: [goal-79, spike-35, task-814, test-473, task-815, goal-80, task-519, test-248, ai_native_sdlc_demo:goal-3, chk-562]
aliases: []
created: 2026-07-26
updated: 2026-07-27
---
# Context

The AI-native SDLC presentation may benefit from motion for capability evolution, source-to-specialized specification contrast, or Plan -> Work -> Evidence storytelling. Remotion could provide deterministic offline composition, but it adds dependency, rendering, caption, accessibility, performance, asset-retention, and maintenance boundaries. The canonical mdkg.dev site also has static and zero-client-JavaScript expectations that must not be weakened by implication.

# Decision

**Defer Remotion adoption with high confidence.**

Remotion is technically plausible for one future isolated scene, but current
evidence does not satisfy the accepted proceed contract. `test-473` records
only 2/12 proceed gates passing, ten failing for proceed, and no waiver.
Remotion's evidence-backed readiness score for the strongest candidate is
32.0/100, below the 80-point threshold and without the required human A/B
advantage.

The named candidate is reusable source goal -> specialized goal -> accepted
evidence, proposed at 12–16 seconds. It has a credible temporal hypothesis but
no empirical proof that motion improves comprehension over the accepted slide
17, the retained 16:9 static reveal, or a staged PowerPoint/HTML alternative.

The presentation continues with its accepted PowerPoint/static assets. Any
future reconsideration is limited to a separately authorized, isolated,
presentation-only pilot with an independent keep/discard result.

Canonical mdkg.dev usage is not accepted:

- no Remotion dependency, Player, runtime, or client-side JavaScript;
- no generated MP4 or still from this decision;
- no publication or asset-retention obligation from Goal 79; and
- any future public media requires a separate decision plus task-519/test-248.

Goal 80 remains paused with empty scope.

# Alternatives considered

- PowerPoint and static assets.
- HTML/CSS motion captured or presented offline.
- Offline Remotion rendering.
- No motion.

PowerPoint/static remains the current ready baseline. HTML/CSS remains a
possible lower-dependency comparison in a future pilot. Remotion is deferred,
not rejected, because primary documentation supports local rendering primitives
and the named scene could still merit a bounded experiment.

# Consequences

- Goal 80 remains paused, childless, unselected, and empty.
- No dependency installation, browser download, composition, render, media,
  deck/site change, public asset, provider action, or remote Git action is
  authorized.
- The accepted deck, retained fallback, rehearsal, and event remain
  non-blocking.
- Reconsideration requires a new explicit planning/authority pass that
  re-verifies the then-current package/license, legal entity/use class, isolated
  ownership, bootstrap authority, event machine, empirical render/playback,
  accessibility, retention, no-secret, and human A/B contract.
- A future presentation pilot cannot authorize canonical-site integration.

# Evidence

- `root:spike-35`
- `root:task-814`
- `root:test-473`
- `.mdkg/artifacts/goal-79/remotion/options-comparison.md`
- `.mdkg/artifacts/goal-79/remotion/evaluation-rubric.md`
- `.mdkg/artifacts/goal-79/remotion/feasibility-receipt.md`
- `.mdkg/artifacts/goal-79/remotion/decision-receipt.md`

# Review trigger

Reopen only when an explicit pass provides the legal entity/use
classification, then-current exact version/license, isolated pilot owner/path,
dependency and browser-bootstrap authority, target event Mac/PowerPoint,
network-denied render/playback authority, frozen A/B method, and acceptance
that an unsuccessful pilot is discarded without blocking the presentation.

# Links / references

- task-519
- test-248
- ai_native_sdlc_demo:goal-3
- goal-79
- goal-80
- spike-35
- task-814
- test-473
- task-815
