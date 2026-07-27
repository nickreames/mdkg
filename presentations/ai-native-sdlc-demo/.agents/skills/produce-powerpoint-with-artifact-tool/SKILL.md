---
name: Produce PowerPoint with Artifact Tool
description: Plan, build, render, and visually verify a source-backed editable PowerPoint with Artifact Tool when Goal 3 or another approved presentation task requires a deterministic local deck.
tags: [stage:execute, writer:patch-only, presentation, powerpoint, artifact-tool]
version: 0.1.0
authors: [mdkg]
links: [AGENT_START.md]
---

# Purpose

Produce an editable, source-backed 16:9 PowerPoint through a deterministic local
Artifact Tool workflow, then render and inspect every slide before handoff.

## When To Use

- Use for Goal 3 narrative planning, visual prototyping, deck construction, and
  rendered visual QA.
- Use for a later presentation task only when it explicitly adopts this
  program's Ocean Flow and evidence contracts.
- Do not use for Google Slides-native editing, website implementation, Remotion,
  or a user-supplied PowerPoint template.

## Inputs

- Selected presentation work node and its context/evidence-complete mdkg pack.
- Accepted narrative, claim matrix, visual-prototype review, and artifact
  allowlist.
- Available presentation workspace dependencies and Artifact Tool runtime.
- Local public-safe images, icons, logos, and generated visual assets.
- Required output paths for editable source, notes, renders, and final PPTX.

## Outputs

- Editable JavaScript ES module source using `@oai/artifact-tool`.
- Locally retained public-safe assets, claim matrix, and speaker notes.
- Final 16:9 PPTX, one render per slide, contact sheet, and visual QA report.
- Deterministic regeneration, source-provenance, and scan-tested QR evidence.

## Required Capabilities

- Runtime-provided presentation workspace dependencies.
- `@oai/artifact-tool` importable from JavaScript ES modules.
- Slide rendering, contact-sheet generation, and overflow detection.
- Full-size visual inspection of every rendered slide.
- Local QR generation and scan verification for approved HTTPS destinations.

## Resources Touched

- `deck/source/ai-native-sdlc.mjs`
- `deck/citations/claim-matrix.md`
- `deck/speaker-notes.md`
- `deck/assets/`
- `deck/rendered/`
- `deck/ai-native-sdlc.pptx`
- A disposable writable build directory outside the durable artifact tree.

## Steps

1. Load the selected-node pack with `context_refs,evidence_refs`, automatic
   skills, and full skill bodies. Confirm the accepted claim, narrative,
   prototype, timing, and path contracts before writing.
2. Load the available presentation workspace dependencies. Stop if Artifact
   Tool or required render/inspection helpers are unavailable; do not install a
   substitute or switch to another deck library.
3. Define one communication job and one primary claim per slide. Use the
   accepted loose capability progression, mixed engineering/leadership
   audience, and brief creator transition.
4. Use one coherent custom Ocean Flow visual system in 16:9. Use at least 50 pt
   deck titles, 35 pt slide titles, 24 pt subheadings, and 16 pt body text.
   Shorten copy or change layout before shrinking type.
5. Build `deck/source/ai-native-sdlc.mjs` as a JavaScript ES module with
   `@oai/artifact-tool`. Do not use `python-pptx` or TypeScript-only syntax.
6. Keep slides editable where practical. Use native slide shapes only for
   simple functional diagrams; use sourced or generated local assets for
   imagery. Do not use Python or programmatic drawing to create visual art.
7. Keep all assets local and public-safe. Do not use remote runtime assets,
   analytics, trackers, credentials, raw prompts, or unrelated private
   context.
8. Give claim-heavy slides compact numbered source markers. Add one unspoken
   appendix sources slide, and add complete claim and asset `[Sources]` blocks
   to the corresponding speaker notes. Keep full URLs in speaker notes and the
   claim matrix.
9. Generate closing QR codes locally for the approved mdkg quickstart and
   GitHub Issues URLs, retain readable text URLs, and scan-test both codes.
10. Export the PPTX, render every slide, run overflow detection, and inspect
    every slide individually at full size. Use the contact sheet only to review
    sequence, pacing, and visual consistency.
11. Fix unintended overlap, clipping, wrapping, broken connectors, weak
    contrast, unreadable citations, inconsistent markers, and asset-quality
    problems. Never dismiss an automated warning without visual evidence.
12. Regenerate from the accepted source and confirm the same slide count and
    equivalent content/layout before recording closeout evidence.

## Validation Checks

- Artifact Tool workspace initialization and ES-module execution pass.
- PPTX generation succeeds without `python-pptx`, Remotion, or a substituted
  presentation library.
- Every slide has a render and passes individual full-size inspection.
- Overflow, wrapping, minimum typography, contrast, hierarchy, connectors,
  citations, and asset provenance pass.
- Claim markers map to the appendix, speaker-note `[Sources]` blocks, and claim
  matrix.
- Both QR codes scan to the approved readable HTTPS destinations.
- Deterministic regeneration preserves slide count and equivalent
  content/layout.
- Nested mdkg validation and changed-surface checks pass before closeout.

## Closeout Evidence

- Exact source, notes, citations, assets, PPTX, render, contact-sheet, and QA
  paths.
- Tool/runtime availability receipt and commands executed.
- Prototype approval reference when full-deck production occurred.
- Per-slide visual review and automated overflow results.
- Claim/source mapping and QR scan results.
- Regeneration comparison, warnings, and unresolved blockers.

## Failure Modes

- Artifact Tool or rendering helpers unavailable: block without installing or
  substituting another library.
- Missing prototype approval: stop before full-deck construction.
- Unsupported or ambiguous claim: remove, soften, or hold the slide.
- Unreadable or overflowing content: shorten copy or change composition.
- Missing local asset provenance or unsafe content: reject the asset.
- QR destination mismatch or scan failure: block the closing slide.
- Non-equivalent regeneration: keep the build task open and record the delta.

## Safety Rules

- Keep Goal 3 local-only: no push, deployment, provider mutation, run-graph
  creation, or canonical website/documentation change.
- Do not store secrets, tokens, cookies, raw prompts, provider payloads, or
  unrelated private context.
- Do not claim Demo 2, Demo 3, exact-SHA deployment, or live-route success from
  fixture-backed presentation work.
- Treat the contact sheet as supplementary; it never replaces full-size slide
  inspection.
- Preserve source and asset provenance and do not invent claims, benchmarks,
  quotes, dates, or outcomes.

## Related Manifests

- None. This skill consumes runtime-provided capabilities without defining a
  new mdkg runtime or provider manifest.

## Projection Targets

- `.agents/skills/produce-powerpoint-with-artifact-tool/SKILL.md`
- `.claude/skills/produce-powerpoint-with-artifact-tool/SKILL.md`

## Open Questions

- None for Goal 3. Later presentation-template or canonical-site reuse requires
  a separately accepted decision.
