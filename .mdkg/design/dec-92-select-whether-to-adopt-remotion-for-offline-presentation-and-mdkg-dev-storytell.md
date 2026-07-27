---
id: dec-92
type: dec
title: Select whether to adopt Remotion for offline presentation and mdkg.dev storytelling
status: proposed
tags: [remotion, presentation, mdkg-dev, offline]
owners: [root-integration-owner]
links: []
artifacts: [artifact://remotion/options-comparison, artifact://remotion/evaluation-rubric, artifact://remotion/feasibility-receipt, artifact://remotion/decision-receipt]
relates: [goal-79, spike-35, task-814, test-473, task-815, goal-80]
refs: [task-519, test-248, ai_native_sdlc_demo:goal-3]
aliases: []
created: 2026-07-26
updated: 2026-07-26
---
# Context

The AI-native SDLC presentation may benefit from motion for capability evolution, source-to-specialized specification contrast, or Plan -> Work -> Evidence storytelling. Remotion could provide deterministic offline composition, but it adds dependency, rendering, caption, accessibility, performance, asset-retention, and maintenance boundaries. The canonical mdkg.dev site also has static and zero-client-JavaScript expectations that must not be weakened by implication.

# Decision

Proposed; unresolved until task-815. The accepted outcome must be exactly:

- `proceed`: one named scene materially benefits from motion and every test-473 gate passes;
- `defer`: evidence is promising but a named prerequisite or timing boundary remains;
- `reject`: static PowerPoint/assets or HTML/CSS better satisfy the need.

The resolution must separately state whether usage is presentation-only, a future canonical-site candidate requiring another decision, or forbidden on the canonical site.

# Alternatives considered

- PowerPoint and static assets.
- HTML/CSS motion captured or presented offline.
- Offline Remotion rendering.
- No motion.

# Consequences

- Proceed permits only a separate scope-population and activation pass for goal-80; it does not install or implement anything.
- Defer or reject leaves goal-80 paused with empty scope.
- Canonical-site use requires explicit acceptance and preservation of static, accessibility, performance, reduced-motion, privacy, and retention constraints.
- The presentation, rehearsal, and event remain non-blocking regardless of outcome.

# Links / references

- task-519
- test-248
- ai_native_sdlc_demo:goal-3
- goal-79
- goal-80
