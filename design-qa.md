# Goal 63 Design QA

## Comparison Target

- Source visual truth: `.mdkg/artifacts/goal-62/announcement-directions/01-process-rail.png`
- Browser-rendered implementation:
  `.mdkg/artifacts/goal-63/browser/marketing-process-rail-desktop.png`
- Full-view comparison:
  `.mdkg/artifacts/goal-63/browser/process-rail-reference-comparison.png`
- Focused comparison:
  `.mdkg/artifacts/goal-63/browser/process-rail-focused-comparison.png`
- Route: `http://127.0.0.1:4321/`
- State: local active release preview, noindex/nofollow, release manifest still
  committed as `draft`
- Primary viewport: 1488x1058 desktop
- Responsive viewports: 390x844 mobile, 320px reflow, and a 640x400 CSS
  viewport used to inspect 200% layout zoom behavior

## Full-View Evidence

The combined full-view comparison shows that the implementation preserves the
accepted Process Rail direction: an incremental announcement immediately after
the existing quickstart, a clear release qualifier and headline, an ordered
four-step command path, a distinct proof panel, and one dominant security-audit
CTA with a lower-emphasis concept link. The implementation intentionally uses
the current mdkg.dev typography, border, spacing, and blue accent tokens rather
than treating the direction image as a new site-wide visual system.

At desktop width, the announcement uses a stable two-column composition and
keeps the quickstart-to-announcement boundary visible. At 390px it stacks into
one column, keeps both actions reachable, and contains all command text without
horizontal page overflow. The complete mobile section spans about 1.47
viewports, which remains scannable without turning the announcement into a
replacement hero.

## Focused Evidence

The focused comparison makes the command rail, proof composition, and actions
readable at inspection scale. It confirms the intended information order,
consistent command rhythm, supported command syntax, full-width mobile CTA,
and secondary-link hierarchy. A focused comparison was required because these
details were too small to evaluate reliably in the full-page composition.

## Required Fidelity Surfaces

- Fonts and typography: the implementation uses the existing site families,
  weights, line heights, and heading scale. The headline remains subordinate to
  the homepage hero, command text wraps without truncation, and letter spacing
  remains neutral.
- Spacing and layout rhythm: the section aligns with the existing content
  container and quickstart rhythm. Desktop tracks, mobile stacking, proof-panel
  padding, separators, and action spacing remain stable across inspected widths.
- Colors and visual tokens: existing mdkg.dev foreground, surface, border, and
  blue accent tokens are reused. Text and actions passed the repository WCAG AA
  smoke checks; forced-colors mode remains usable.
- Image and asset fidelity: the accepted direction contains no required product
  photography, logo treatment, or custom illustration. No visible source asset
  was replaced with a code-drawn approximation.
- Copy and content: the exact accepted qualifier, headline, security-audit CTA,
  concept link, and four supported commands are present. No unsupported loop
  execution command or npm-availability claim appears.

## Interaction And Accessibility Evidence

- The primary CTA resolves to
  `http://127.0.0.1:4322/loops/security-audit/` and successfully opens the
  purpose-built walkthrough.
- The secondary loop-overview link is keyboard focusable and shows the same
  visible three-pixel focus treatment as the primary CTA.
- The docs mobile menu opens and exposes the top-level Loops group between
  Concepts and Guides; current-page state is present on the security route.
- The homepage and all four loop routes retain one H1, expected landmarks,
  accessible link names, contained code, and no horizontal page overflow.
- Intended docs menu and search targets were corrected to at least 44x44 CSS
  pixels and reverified in the browser.
- Reduced-motion and forced-colors modes were exercised. Starlight light and
  dark themes rendered without overflow. Automated accessibility smoke checks
  19 pages successfully, including all four preview-only loop routes and the
  release-modified install, changelog, and generated-reference surfaces.
- Browser console warnings and errors were checked after the primary marketing
  and docs journeys; none remained.

## Findings

No actionable P0, P1, or P2 finding remains.

One non-blocking P3 fidelity difference remains: the source direction uses a
more illustrative vertical rail and tonal number tiles, while the implementation
uses restrained separators and solid site-blue markers. This is intentional to
keep the incremental release section inside the established mdkg.dev system and
does not change hierarchy, meaning, or interaction.

## Comparison History

1. Initial comparison found a P2 issue in the first command row: the command
   appeared visually clipped at the available width.
2. The command styling was changed to permit safe line wrapping with
   `overflow-wrap: anywhere` and normal white-space behavior.
3. The desktop implementation was recaptured at the same state and recombined
   with the source in both full-view and focused comparisons. The command is now
   fully visible, layout width is stable, and no P0/P1/P2 mismatch remains.

## Implementation Checklist

- [x] Preserve the existing homepage hero and quickstart.
- [x] Place the Process Rail announcement immediately after quickstart.
- [x] Keep the primary and secondary actions functional and accessible.
- [x] Verify mobile reflow, zoom, themes, focus, motion, and forced colors.
- [x] Verify the complete docs journey and four loop routes.
- [x] Correct and recapture the command-clipping regression.
- [x] Preserve draft/noindex release-state boundaries.

final result: passed
