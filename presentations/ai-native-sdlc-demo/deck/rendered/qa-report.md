# AI-Native SDLC Deck QA Report

Status: PASS for the audience-facing stage-readiness enhancement  
Build: V3 light-mode Ocean Flow core-polish pass  
Artifact: `deck/ai-native-sdlc.pptx`  
Slides: 20, including one unspoken sources appendix  

## Build and package integrity

- Generated from `deck/source/ai-native-sdlc.mjs` with `@oai/artifact-tool` using the bundled JavaScript ES-module runtime.
- No `python-pptx`, Remotion, remote font, or runtime network dependency is present.
- `unzip -t deck/ai-native-sdlc.pptx` passed with no archive errors.
- The package contains 20 slide XML parts and 20 speaker-note XML parts.
- Both closing QR codes are embedded as local PNG assets.
- The bundled presentation overflow test passed: `Test passed. No overflow detected.`

## Deterministic regeneration

Two consecutive final-source builds produced:

- slide count: `20` and `20`;
- aggregate source-render pixel hash: `37f54383c1b7be406e53912f565412916df63c5d6ec51d6e7707fa17da8c0609` and the same value on the second build;
- final PPTX-render aggregate pixel hash: `f846f71184370d6cc3315ca4e2b5df208aec8d89ccc847b6fadb92d8cdc74b4f`;
- final PPTX SHA-256: `7cf122ccea42a98ab2538f103dc80678d093ba32719c6a5039f85e5fdc91bdcc`;
- final contact-sheet SHA-256: `3ade0971a8042bf6a479bcb5f452b2f09f0d788034575337c787f2ae821a69ec`.

Generated container identifiers and package metadata may vary between PPTX exports, so binary equality is not used as the determinism criterion. Equivalent slide count and pixel-identical source renders prove reproducible visible content and layout from the checked source and local assets.

## Visual and layout inspection

- Every final PPTX slide was rendered independently and inspected individually at full size.
- The final contact sheet was inspected only after the individual review to verify deck-level rhythm, hierarchy, and color consistency.
- The stage-readiness pass made the following audience-facing improvements:
  - removed visible timing scaffolding and changed the opening cue to “Live coding goal starts now”;
  - replaced slide 8's repeated timeline with concrete Codex usage-study and multi-context-window evidence;
  - changed internal section labels such as “creator transition” and “recovery contract” into audience-facing language;
  - removed the duplicate What / Why / Next treatment from slide 14 so slide 15 owns those questions;
  - removed fixture warnings and unearned completion language from slide 17 while retaining an accurate accepted specialization contract;
  - replaced slide 18's visible success/running/blocker decision tree with a clean browser-reveal transition;
  - replaced “unspoken appendix” and the repository-local path on slide 20 with audience-facing source language.
- Three defects found during the final full-size review were corrected before the accepted render:
  - capability labels read too tightly on slide 2;
  - the slide 14 conclusion was unnecessarily indirect;
  - the source-specification badge wrapped on slide 17.
- The corrected slides were re-rendered and re-inspected at full size.
- Slide titles, body copy, source footnotes, the appendix, and readable QR fallback URLs remain legible at presentation resolution.
- The V3 system maintains one primary claim and one narrative job per slide, with consistent folios, source markers, content margins, and footer placement.
- A final inspection of visible textbox content found no remaining “opening minute,” timing-budget, “creator transition,” “illustrative structure,” fixture-success, event-instruction, “unspoken appendix,” or visible reveal-branch language.

## Accessibility assessment

The visual system was checked with WCAG 2.2 relative-luminance calculations:

| Use | Contrast | Rating |
| --- | ---: | --- |
| Primary text on canvas | 14.96:1 | AAA |
| Primary text on white surface | 15.57:1 | AAA |
| Secondary text on canvas | 7.48:1 | AAA |
| Teal accent text on canvas | 7.66:1 | AAA |
| Blue accent text on canvas | 7.90:1 | AAA |
| Coral boundary text on canvas | 7.23:1 | AAA |
| Light text on dark anchor | 14.96:1 | AAA |
| Cyan text on dark anchor | 9.48:1 | AAA |
| Aqua text on dark anchor | 7.30:1 | AAA |
| Functional boundary on canvas | 3.93:1 | AA non-text |
| Functional boundary on white | 4.09:1 | AA non-text |

- Minimum body and source text size is 16 pt.
- Deck title is 58 pt; slide titles are 38 pt; supporting headings are 24 pt or larger.
- Meaning is not encoded by color alone: stages and states also use text labels, numbering, position, and distinct shapes.
- QR destinations are repeated as readable text, so the CTA does not depend on successful scanning.
- This is a visual-accessibility assessment, not a claim that the exported PPTX has passed Microsoft PowerPoint's application-level Accessibility Checker. The deck uses native editable shapes and text wherever practical; QR images have adjacent textual equivalents.

## Claims and citations

- The claim matrix contains 14 approved claims, each with source owner, URL, publication date, milestone date, exact support, approved paraphrase, confidence, slide use, and limitations.
- All 14 claim sources were re-opened or verified against their pinned repository commit before finalization. Cursor's living Agent documentation remains a supporting example and is not used as a dated milestone.
- The timeline explicitly states that capability stages overlap and accumulate.
- Slide 8 now presents the 25.6% Codex usage-study result next to the long-running harness continuity pattern, with the explicit statement that human-equivalent task size is not elapsed agent runtime.
- Unsupported stronger claims remain in the matrix's held-or-rejected section and do not appear as slide claims.
- All 20 slides contain a complete `[Sources]` speaker-note block.
- Claim-heavy slides use compact numbered markers, and slide 20 maps markers `[1]` through `[14]` to the claim matrix.

## Asset provenance and QR validation

- All visuals are editable native shapes except the two locally generated QR images.
- QR source: `deck/source/generate-qr.py` using ReportLab `QrCodeWidget`.
- PNG rendering: `deck/source/render-qr.mjs` using the bundled local `sharp` runtime.
- Independent local scan: `deck/source/scan-qr.m` using Vision `VNDetectBarcodesRequest`.
- Quickstart decoded exactly to `https://docs.mdkg.dev/start-here/quickstart/`.
- Feedback decoded exactly to `https://github.com/nickreames/mdkg/issues`.
- Both displayed fallback URLs match their decoded payloads.
- Detailed dimensions and SHA-256 values are retained in `deck/assets/qr/scan-receipt.json`.

## Offline timing contract

- Narrated slides 1–17: 31:05.
- Reveal branch target: 2:05, maximum 2:15.
- CTA maximum: 0:45.
- Planned content total: 33:55.
- Hard stop: minute 35; audience Q&A begins afterward.
- The context-engineering conclusion, reveal, and CTA are protected from timing cuts.
- The deck and notes distinguish success, still-running, and hard-blocker reveal branches without claiming that Demo 2 or Demo 3 exists.

## Final result

PASS. The revised deck is stage-ready as a presentation artifact: visible copy is audience-facing, the narrative contains concrete evidence instead of a repeated timeline, and the live-reveal slide cleanly hands off to the browser. The browser reveal must still use current run evidence or the honest fallback branch; this deck does not claim that Demo 2 or Demo 3 exists.
