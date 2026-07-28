# Remotion adoption decision receipt

Decision: `root:dec-92`
Accepted outcome: **defer**
Accepted date: 2026-07-27
Owner: `root-integration-owner`
Confidence: high
Waivers: none

## Decision

Defer Remotion adoption.

Remotion is technically plausible for one isolated, presentation-only scene,
but the current evidence does not justify adding it to this repository. Keep
the accepted PowerPoint/static presentation and retained Demo 2 fallback as the
event path. Keep Goal 80 paused with empty scope.

## Named candidate

The only candidate eligible for a future first pilot is:

`source-specialized-evidence` — reusable source goal -> specialized goal ->
accepted evidence, 12–16 seconds at 1920x1080/30 fps.

Its temporal hypothesis is credible: invariant fields can remain visible while
specialized values resolve, output appears, and evidence closes the sequence.
That hypothesis has not received a human A/B comparison and therefore does not
establish a material benefit over the accepted slide 17 or retained 16:9 still.

The Plan -> Work -> Evidence and capability-accumulation scenes remain lower
priority. The live reveal is forbidden as a motion candidate because authored
motion could be mistaken for current execution evidence.

## Evidence

- `root:spike-35` accepted the current primary-source option comparison:
  `.mdkg/artifacts/goal-79/remotion/options-comparison.md`.
- `root:task-814` froze three candidate contracts, 12 non-compensable gates,
  100 weighted points, explicit outcome thresholds, and pilot budgets:
  `.mdkg/artifacts/goal-79/remotion/evaluation-rubric.md`.
- `root:test-473` evaluated all eight cases and all 12 gates:
  `.mdkg/artifacts/goal-79/remotion/feasibility-receipt.md`.
- Current R1 readiness scores:
  - PowerPoint/static: 73.4/100;
  - HTML/CSS motion: 53.2/100;
  - Remotion: 32.0/100.
- Proceed gates: 2/12 pass. Ten fail for proceed. No waiver exists.
- Passing gates: retained still fallback and presentation-only/no-canonical-site
  boundary.
- Root/docs/mdkg-dev package and lock hashes match the activation baseline, and
  none contains a Remotion dependency.
- The accepted deck is already editable, visually and accessibility
  QA-reviewed, offline-rehearsed to 33:55, and backed by a retained static Demo
  2 reveal.

## Why defer instead of proceed

Proceed requires all 12 gates, at least 80/100, at least a 10-point advantage
over both alternatives, and human A/B evidence. Current evidence lacks:

- accepted legal entity/use and then-current license classification;
- an isolated exact package/lock and browser-build receipt;
- two outbound-network-denied renders;
- event-machine PowerPoint playback;
- captions/SRT/transcript synchronization;
- clip-level accessibility, reduced-motion, and flash review;
- render time, memory, output-size, and playback measurements;
- repeated frame/media reproducibility;
- an accepted maintenance owner;
- implemented no-secret input/output scans; and
- material audience-benefit evidence.

Source documentation cannot substitute for those target-environment receipts.

## Why defer instead of reject

- Official documentation supports local bundle rendering, local assets/fonts,
  local captions, explicit frame timing, seeded randomness, and preinstalled
  Chrome Headless Shell.
- Candidate R1 has a real temporal story rather than motion for decoration.
- A small, isolated pilot could resolve the missing evidence without changing
  the current deck, canonical site, or event path.
- No accepted evidence shows a hard technical incompatibility.

Defer preserves the option without treating promise as proof.

## Presentation boundary

Any future reconsideration is presentation-only:

- isolated presentation-tooling workspace;
- exact same-version Remotion package family;
- local assets, fonts, captions, and bundle;
- one separately authorized package/browser bootstrap;
- subsequent network-denied renders;
- retained static fallback and complete manifest;
- no providers, cloud render, analytics, remote assets, or secrets;
- independent keep/discard result.

Goal 79 grants none of this implementation authority.

## Canonical mdkg.dev boundary

Canonical mdkg.dev receives:

- no Remotion dependency;
- no Remotion Player or runtime;
- no client-side JavaScript by implication;
- no generated MP4 or still from this decision; and
- no publication or asset-retention obligation from Goal 79.

Any future public media is a distinct `root:task-519`/`root:test-248` lane and
requires its own canonical-site decision, source brief, accessibility and
responsive review, no-secret scan, performance/retention proof, and publication
authority. A presentation-only pilot cannot satisfy that lane.

## Goal 80 consequence

`root:goal-80` remains:

- `goal_state: paused`;
- `status: backlog`;
- `scope_refs: []`;
- childless;
- unselected; and
- unauthorized for package, code, render, deck, site, Git, publication, or
  provider work.

The `defer` decision does not populate or activate Goal 80.

## Review trigger

Reopen only through a new, explicit mdkg planning/authority pass after all of
the following are available:

1. legal entity/use and then-current Remotion/FFmpeg/font/asset license
   classification;
2. accepted isolated pilot owner, path, exact package version, and retention
   boundary;
3. explicit one-time dependency and browser-bootstrap authority;
4. authority to implement only R1 without changing the canonical deck/site;
5. target event Mac and PowerPoint version;
6. frozen A/B participants, questions, and comprehension/recall measures;
7. authority for two network-denied renders and three offline PowerPoint
   playback runs; and
8. acceptance that failure discards the pilot without blocking the
   presentation.

At that point, re-read the current package documentation and license. Do not
reuse 4.0.500 or this 4.x license analysis without verification.

## Actions explicitly not authorized

- installing or resolving dependencies;
- downloading a browser;
- adding Remotion code;
- rendering or embedding media;
- changing the deck, presentation program, or canonical site;
- populating or activating Goal 80;
- advancing task-519 or test-248;
- refreshing the presentation bundle/subgraph;
- selecting another root goal;
- calling providers or registries;
- commit publication, push, tag, deploy, or release.

## Final decision test

The decision is unambiguous and independently traceable:

- exact outcome: `defer`;
- confidence: high;
- unresolved risks: enumerated;
- owner: `root-integration-owner`;
- review trigger: enumerated;
- presentation boundary: future isolated pilot only;
- canonical-site boundary: no current usage;
- Goal 80: paused and empty;
- implementation/publication authority: none.
