# Ocean Flow V2 Prototype Review Receipt

Status: accepted  
Goal node: `task-12`  
V1 generated: 2026-07-26  
V2 regenerated: 2026-07-27  
Full-deck production: authorized by the recorded V2 acceptance

## Review set

1. Capability progression — a loose, overlapping timeline from autocomplete to long-horizon work.
2. Plan → Work → Evidence — the core operating model and What / Why / Next questions.
3. Reusable → specialized specification — the source-versus-executed reveal structure.

Current contact sheet: `deck/rendered/prototypes/contact-sheet-v2.png`  
Current editable prototype deck: `deck/assets/prototypes/ai-native-sdlc-visual-prototypes-v2.pptx`  
Current Artifact Tool source: `deck/assets/prototypes/visual-prototypes-v2.mjs`  
Accessibility review: `deck/rendered/prototypes/accessibility-report-v2.md`

The V1 source, deck, renders, and contact sheet remain available for
comparison. V2 is the current approval candidate.

## Proposed direction

- Use a pale blue-white canvas and white surfaces as the dominant Ocean Flow
  stage, with one deliberate dark anchor band where it materially improves
  hierarchy.
- Use deep navy typography, dark teal and blue accents, and visibly stronger
  functional boundaries.
- Reserve coral for evidence caveats, hard boundaries, and the final
  long-horizon emphasis.
- Use oversized navy claims, compact dark-teal eyebrows, and high-contrast
  blue-gray supporting text.
- Keep diagrams editable and functional: currents, cards, arrows, and evidence bands rather than decorative illustrations.
- Carry the alternating timeline cards, asymmetric Plan / Work / Evidence flow, and source-versus-executed split through the final deck.
- Use small numbered evidence markers on-slide and complete `[Sources]` blocks in notes.
- Keep the reveal visually honest: the prototype is labeled as an illustrative structure, not a live Demo 2 or Demo 3 receipt.

## Rejected alternatives

- Generic corporate or vendor-branded template: too interchangeable and inconsistent with the approved custom Ocean Flow direction.
- Strict chronological eras: visually simple but factually misleading because product dates and capabilities overlap.
- Vendor comparison grid: distracts from architecture, planning, and durable context.
- CLI-first visual language: risks turning the presentation into a command tutorial.
- Decorative stock imagery: adds visual noise without improving the three technical relationships.
- Animation or Remotion dependency: outside Goal 3 and unnecessary for the approved offline PowerPoint path.

## Visual QA

- Artifact Tool rendered all three V2 slides at 2560 × 1440.
- The exported PPTX rendered successfully at 1920 × 1080 through the presentation render helper.
- `slides_test.py` passed with no overflow detected.
- Every V2 Artifact Tool render was inspected individually at full size.
- All three V2 PPTX-rendered slides were inspected individually at full size
  for cross-render parity.
- The V2 contact sheet was inspected only after the individual slide pass and
  shows a coherent light-mode system.
- The first V2 full-size pass found an orphaned final letter in
  `AUTOCOMPLETE`; the label field was widened and every affected output was
  regenerated.
- Final labels use deliberate wrapping and remain legible at projection
  distance.
- The exported deck contains three speaker-note records, each with a complete `[Sources]` block.
- The PPTX ZIP integrity test passed with no compressed-data errors.
- The package contains exactly three slide XML files and three corresponding notes-slide XML files.
- Slide relationships resolve only to the local layout and local notes slides; no remote media, font, or runtime asset relationship is present.

## Contrast QA

V2 text pairs were measured using the WCAG 2.2 relative-luminance formula:

| Pair | Ratio | Rating |
|---|---:|---|
| Navy primary text on light canvas | 14.96:1 | AAA normal text |
| Blue-gray secondary text on light canvas | 7.48:1 | AAA normal text |
| Dark-teal accent text on light canvas | 7.66:1 | AAA normal text |
| Dark-blue accent text on light canvas | 7.90:1 | AAA normal text |
| Coral warning text on light canvas | 7.23:1 | AAA normal text |
| Light text on the dark anchor band | 14.96:1 | AAA normal text |
| Functional boundary on light canvas | 3.93:1 | Passes 3:1 non-text target |

All tested V2 text pairings meet the AAA normal-text target. Functional
boundaries meet the 3:1 non-text target. The smallest V2 text is 16 pt.
The full pair matrix, caveats, and light-mode comparison are in
`deck/rendered/prototypes/accessibility-report-v2.md`.

V2 averages 87.2% pixels at or above 80% luminance and 91.1% mean display
luminance. V1 averaged 0.6% and 13.2%, respectively. This confirms that V2 is
materially light-mode; this luminance-distribution measure is not itself a
WCAG criterion.

## Deterministic regeneration

Two consecutive V2 Artifact Tool regenerations produced:

- three slides;
- three speaker-note records;
- 124 normalized inspect rows;
- identical normalized content hash `a79a28955326d055b9845b82a73cbb03b343f1f1fb6d174ec8af3d87046d4fbb`;
- identical PNG hashes:
  - slide 1: `0a466c7e842d5bfcdef070412e17e47ddc1ad2cb4f6a2bbad924ba1642950598`
  - slide 2: `6b34955c90d29c40135b8aa318aa8c94cd2d4ee37e52ec520e64ea1d908ce063`
  - slide 3: `71443bb811db543c1d2288154e3927af9b0915f0da9c7ac6c49725cb67d4218b`

Artifact Tool allocates fresh internal object identifiers and package metadata when exporting, so raw PPTX and raw layout JSON files are not byte-identical. Slide count, names, text, geometry, notes, and rendered pixels are equivalent. This is the required deterministic-content boundary.

## Commands and receipts

- Artifact Tool generation used the bundled workspace Node runtime and `@oai/artifact-tool`.
- The persistent Node host could not load Artifact Tool’s signed native canvas module because the host and native module had different macOS Team IDs. The bundled workspace Node loaded the same Artifact Tool package successfully; no alternative deck library was used.
- Contact sheet generation:
  - `create_montage.py --input_dir .../slides --output_file .../contact-sheet.png --num_col 3`
- Overflow:
  - `slides_test.py .../ai-native-sdlc-visual-prototypes.pptx`
  - Result: `Test passed. No overflow detected.`
- Cross-render:
  - `render_slides.py .../ai-native-sdlc-visual-prototypes.pptx --width 1920 --height 1080`
- Nested changed-only validation and `git diff --check` passed before the review gate.

## Human approval gate

Approval should answer one question:

> Accept V2—the light canvas, navy typography, high-contrast current-line
> diagrams, coral boundary accents, one dark hierarchy anchor, and compact
> evidence treatment—as the direction for the full deck?

If accepted, record the approval here and complete `task-12`. If revisions are requested, keep `task-12` in review, revise only these prototypes, and repeat the full render and inspection pass. Do not start `task-13` before explicit acceptance.

## Approval record

Accepted by the user on 2026-07-27 with the explicit instruction:
`Approve V2`.

Approved direction: light canvas, navy typography, high-contrast current-line
diagrams, coral boundary accents, one dark hierarchy anchor, and compact
evidence treatment. This acceptance clears `task-13` to begin; it does not
authorize a commit, push, deployment, provider mutation, or any work outside
Goal 3's local presentation allowlist.
