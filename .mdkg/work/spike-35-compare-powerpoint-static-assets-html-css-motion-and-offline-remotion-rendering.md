---
id: spike-35
type: spike
title: Compare PowerPoint/static assets, HTML/CSS motion, and offline Remotion rendering
status: done
priority: 1
epic: epic-255
next: task-814
tags: [remotion, presentation, research, offline]
owners: [root-integration-owner]
links: []
artifacts: [artifact://remotion/options-comparison, .mdkg/artifacts/goal-79/remotion/options-comparison.md]
relates: [goal-79]
blocked_by: []
blocks: [task-814]
refs: [goal-79, epic-255, task-519, test-248, ai_native_sdlc_demo:goal-3, dec-92]
context_refs: [goal-79, epic-255, task-519, test-248, ai_native_sdlc_demo:goal-3, dec-92]
evidence_refs: [chk-561]
aliases: []
skills: [select-work-and-ground-context, service-boundary-ownership-check]
created: 2026-07-26
updated: 2026-07-27
---
# Research Question

Which medium—PowerPoint/static assets, HTML/CSS motion, or offline Remotion rendering—best communicates the AI coding evolution and Plan -> Work -> Evidence story under the presentation's offline, accessibility, timing, and maintenance constraints?

# Context And Constraints

- Research-only; no installation, code, render, deck, or site changes.
- Primary/current package, license, and rendering documentation is required for external claims.
- The presentation path must work offline with captions, reduced motion, and still fallbacks.
- Canonical-site use is a separate decision and may not introduce runtime scripts by implication.

# Search Plan

- Re-read task-519, test-248, dec-92, and the read-only presentation goal projection.
- Compare narrative value, authoring cost, reproducibility, offline behavior, accessibility, performance, dependency/license boundaries, maintenance, and retention.
- Identify which scenes materially benefit from motion and which are better as static deck assets.

# Findings

- The current PowerPoint/static path is the ready baseline: the 20-slide deck
  has accepted visual/accessibility QA, a retained static Demo 2 reveal, and a
  33:55 offline rehearsal receipt.
- Current Remotion 4.0.500 documentation supports local bundle rendering,
  local assets and fonts, captions, fixed frame/FPS/duration inputs, seeded
  randomness, and a preinstalled Chrome Headless Shell. Those are architectural
  capabilities, not empirical proof for this repository.
- A pilot would require an isolated presentation-tooling package boundary,
  exact same-version Remotion packages, one authorized browser bootstrap,
  network-denied renders, benchmarked concurrency, retained manifests, and
  actual PowerPoint playback verification.
- Current v4 license eligibility depends on legal entity and use. That
  classification is not established here. Remotion's distributed FFmpeg binary
  is GPLv2+ and its x264/x265 components are GPL.
- Remotion's own accessibility guidance does not guarantee user-authored
  compositions, while WCAG requires captions for meaningful prerecorded audio
  and control or alternatives for motion. Captions, transcript, a still
  fallback, non-motion comprehension, and a reduced-motion path remain
  mandatory.
- Remotion passes `.env` and `REMOTION_` variables to the headless browser, so a
  future pilot must use a constructed no-secret environment and local-only
  assets.
- The strongest motion candidate is reusable source goal -> specialized goal
  -> accepted evidence. Plan -> Work -> Evidence is second; the capability
  progression is third because motion could falsely imply strict chronology.
- The live reveal is not a candidate because authored motion could be mistaken
  for current run evidence.

# Options And Tradeoffs

- PowerPoint/static assets: lowest dependency and strongest presenter control; limited procedural motion.
- HTML/CSS motion: lightweight web-native storytelling; separate offline capture and zero-JavaScript constraints require care.
- Offline Remotion: deterministic frame/video composition and reuse; adds dependency, render, caption, asset, and maintenance costs.

The full comparison and source ledger are retained in
`.mdkg/artifacts/goal-79/remotion/options-comparison.md`.

# Recommendation

**Defer Remotion adoption with high confidence.** The technology is feasible
enough to justify a separately authorized one-scene pilot later, but current
evidence does not establish license eligibility, empirical offline rendering,
event-machine playback, performance, repeatability, maintenance ownership, or a
material comprehension gain over the accepted static deck.

Keep Goal 80 paused and empty. Any later pilot should be presentation-only and
must independently earn a keep/discard decision. Canonical mdkg.dev remains
outside this adoption decision and receives no Remotion runtime, player, or
dependency by implication.

# Follow-Up Nodes To Create

- None. The complete planned chain already exists.

# Skill Candidates

- None unless research exposes a repeatable offline-media workflow.

# Data Structures And Algorithms Notes

- Record inputs, weights, assumptions, and evidence independently so task-814 can define a reproducible rubric.

# UX Notes

- Prefer motion only where sequence or state change is materially clearer than a static slide.

# Security Notes

- No secrets, private prompts, provider payloads, remote tracking, or unreviewed third-party assets in evidence.

# mdkg.dev Launch Implications

- Canonical-site usage remains unapproved unless dec-92 explicitly selects it and preserves site performance/accessibility/static constraints.

# Evidence And Sources

- Accepted comparison:
  `.mdkg/artifacts/goal-79/remotion/options-comparison.md`
- Current primary Remotion documentation accessed 2026-07-27:
  getting started/system requirements, brownfield install, Player install,
  renderer, Chrome Headless Shell, assets/static files, local fonts, captions,
  performance, security, randomness, accessibility, v4 license, FFmpeg license,
  and upcoming v5 terms.
- Current primary W3C guidance accessed 2026-07-27: WCAG 2.2 prerecorded
  captions, pause/stop/hide, and animation-from-interactions.
- Repository receipts: `ai_native_sdlc_demo:goal-3`, `root:task-519`,
  `root:test-248`, deck visual/rehearsal evidence, Demo 2 retained still, and
  the accepted static-Astro boundary.
- Confidence: high for defer; no install/render/legal advice or empirical
  performance claim was made.
