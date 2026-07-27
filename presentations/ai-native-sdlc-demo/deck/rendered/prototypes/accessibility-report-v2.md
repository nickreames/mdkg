# Ocean Flow V2 Accessibility Review

Status: review candidate  
Goal node: `task-12`  
Reviewed: 2026-07-27  
Scope: three representative light-mode prototypes, their Artifact Tool renders, and their exported-PPTX renders

## Overall rating

| Dimension | Rating | Evidence |
|---|---|---|
| Normal text contrast | WCAG AAA target met | Every tested text pair is at least 7.23:1 |
| Large text contrast | WCAG AAA target met | Every tested text pair exceeds 4.5:1 |
| Functional diagram contrast | 3:1 target met | Boundaries are 3.93:1 on the canvas and 4.09:1 on white |
| Minimum type size | Program contract met | Smallest text is 16 pt; slide titles are 38 pt |
| Light-mode direction | Met | 87.2% of sampled pixels are at or above 80% luminance |
| Color independence | Manual review passed | Labels, shape, position, and borders carry meaning in addition to color |
| Render fidelity | Passed | All three Artifact Tool renders and all three PPTX renders were inspected at full size |
| Full assistive-technology conformance | Not rated | Reading order, screen-reader narration, and PowerPoint's desktop accessibility checker remain full-deck QA work |

This review applies WCAG 2.2 contrast mathematics as a presentation-readability
guardrail. A slide deck is not a web page, so these results are not a formal
WCAG conformance certification.

## Contrast ratings

WCAG 2.2 uses 4.5:1 for Level AA normal text, 7:1 for Level AAA normal
text, 3:1 for Level AA large text, 4.5:1 for Level AAA large text, and 3:1
for functional non-text graphics.

| Use | Pair | Ratio | Rating |
|---|---|---:|---|
| Primary text on light canvas | `#08263A` on `#F7FBFD` | 14.96:1 | AAA normal text |
| Primary text on white surface | `#08263A` on `#FFFFFF` | 15.57:1 | AAA normal text |
| Secondary text on light canvas | `#36566A` on `#F7FBFD` | 7.48:1 | AAA normal text |
| Secondary text on white surface | `#36566A` on `#FFFFFF` | 7.79:1 | AAA normal text |
| Teal accent text | `#005B57` on `#F7FBFD` | 7.66:1 | AAA normal text |
| Blue accent text | `#00566D` on `#F7FBFD` | 7.90:1 | AAA normal text |
| Coral warning text | `#9B2C2C` on `#F7FBFD` | 7.23:1 | AAA normal text |
| Light text on the dark anchor band | `#F7FBFD` on `#08263A` | 14.96:1 | AAA normal text |
| Cyan text on the dark anchor band | `#3EDBFF` on `#08263A` | 9.48:1 | AAA normal text |
| Aqua text on the dark anchor band | `#13C7B3` on `#08263A` | 7.30:1 | AAA normal text |
| Functional boundary on light canvas | `#5E8392` on `#F7FBFD` | 3.93:1 | Passes 3:1 non-text target |
| Functional boundary on white surface | `#5E8392` on `#FFFFFF` | 4.09:1 | Passes 3:1 non-text target |
| Dark text on cyan marker | `#08263A` on `#3EDBFF` | 9.48:1 | AAA normal text |
| Dark text on aqua marker | `#08263A` on `#13C7B3` | 7.30:1 | AAA normal text |
| Dark text on seafoam marker | `#08263A` on `#5EEAD4` | 10.53:1 | AAA normal text |

The generator writes the complete machine-readable receipt to
`deck/rendered/prototypes/v2/accessibility-palette.json` and fails generation
if any tested text pair falls below 7:1 or if a functional boundary falls below
3:1.

## Light-mode comparison

The comparison samples the three 2560 × 1440 Artifact Tool renders after
downscaling them consistently. It measures the share of pixels with relative
display luminance at or above 80% and the mean display luminance. This is a
design-direction metric, not a WCAG criterion.

| Version | Pixels at or above 80% luminance | Mean display luminance |
|---|---:|---:|
| V1 dark field | 0.6% | 13.2% |
| V2 light canvas | 87.2% | 91.1% |

V2 therefore reads as a light-mode system while retaining one intentional dark
anchor band on the Plan → Work → Evidence slide.

## Typography and projection review

- The smallest rendered text is 16 pt.
- Eyebrows and evidence footers are 16 pt.
- Supporting copy is 17–20 pt.
- Diagram titles are 29–34 pt.
- Slide titles are 38 pt.
- All three slides were inspected individually at 2560 × 1440.
- All three exported-PPTX slides were inspected individually at 1920 × 1080.
- The first V2 pass exposed an orphaned final letter in `AUTOCOMPLETE`; the
  label field was widened and the deck was regenerated before this receipt.
- `slides_test.py` reports no overflow.

## Structural and packaging review

- The deck uses editable native PowerPoint shapes and text.
- Each slide has a complete `[Sources]` block in speaker notes.
- The PPTX contains three slides and three notes slides.
- The PPTX ZIP integrity check passes.
- Slide relationships contain no external target.
- Meaning is not encoded by color alone: every stage, state, and transition has
  a text label and a distinct shape or position.

## Deterministic regeneration

Two consecutive Artifact Tool runs produced 124 normalized inspection rows,
the same normalized content hash
`a79a28955326d055b9845b82a73cbb03b343f1f1fb6d174ec8af3d87046d4fbb`,
and identical slide PNG hashes:

- slide 1: `0a466c7e842d5bfcdef070412e17e47ddc1ad2cb4f6a2bbad924ba1642950598`
- slide 2: `6b34955c90d29c40135b8aa318aa8c94cd2d4ee37e52ec520e64ea1d908ce063`
- slide 3: `71443bb811db543c1d2288154e3927af9b0915f0da9c7ac6c49725cb67d4218b`

## Standards references

- WCAG 2.2 Contrast Minimum:
  https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- WCAG 2.2 Contrast Enhanced:
  https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html
- WCAG 2.2 Non-text Contrast:
  https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html

