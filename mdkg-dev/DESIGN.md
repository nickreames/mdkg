# mdkg.dev Design System

## Direction

mdkg.dev should feel like serious local-first developer infrastructure: clear, inspectable, technical, and calm. The visual system should support fast comprehension of Markdown, Git, graph state, packs, handoffs, and validation without drifting into generic AI glow or enterprise dashboard clutter.

## Principles

- Static content first. Core pages must read correctly without client JavaScript.
- Markdown and Git are the visual anchors. Use file paths, command snippets, node IDs, and graph refs as first-class interface elements.
- Use depth sparingly. Prefer borders, spacing, and structured diagrams over decorative effects.
- Keep advanced alpha surfaces visible but secondary.
- Every public claim should be supportable by shipped CLI behavior or an explicit alpha caveat.

## Tokens

- Font stack: system sans for body and UI, system mono for commands and node IDs.
- Surfaces: white, zinc, and soft sky-tinted bands.
- Text: zinc-950 primary, zinc-700 secondary, zinc-500 tertiary.
- Accents: blue, sky, and teal.
- Gradient: Ocean Flow only for primary CTAs, selected states, and diagram highlights.
- Radius: 8px for cards, buttons, badges, and code surfaces.
- Spacing: dense enough for developer scanning, never cramped.

## Required Components

- ButtonLink
- Card
- CodeBlock
- TerminalBlock
- FeatureCard
- SectionHeader
- CTAGroup
- Badge
- NavBar
- Footer
- DiagramCard
- ClaimEvidenceCard

## Required Diagrams

- Hero architecture: Markdown/frontmatter in Git to mdkg index/validate to pack/handoff to human or AI agent to checkpoint/evidence.
- Golden loop: init, index, status, pack, execute, checkpoint, validate.
- Work/context/evidence triad: scope refs, context refs, evidence refs.
- Trust boundary: local repo and CLI, rebuildable indexes, no hosted index, no daemon, read-only MCP.

## Accessibility

- One H1 per page.
- Semantic headings and landmarks.
- Keyboard reachable links and controls.
- Visible focus states.
- Sufficient contrast on text and controls.
- Code blocks must wrap or scroll without breaking mobile layout.
- No meaning conveyed only by color.
- Reduced motion respected; avoid animation unless it serves comprehension.

## Performance

- Static HTML output.
- No client JavaScript until a real island interaction is required.
- No external fonts or third-party scripts in the scaffold.
- Lightweight SVG/favicon only.
- Image-heavy or video assets are deferred until source assets are reviewed.

## Review Notes

- Product Design audit evidence should include current local screenshots for the marketing home, marketing quickstart, docs home, and docs quickstart before large public-copy or layout changes are accepted.
- Short terminal examples must size to content. Avoid stretched dark panels that add visual weight without more proof.
- Creative Production direction for public alpha is deterministic and inspectable: use HTML/CSS/SVG diagrams, command cards, node refs, and file-path motifs before introducing generated image or video assets.
- The strongest visual proof is the Plan -> Work -> Evidence loop. Keep it as the main model and avoid competing diagrams that imply autonomous execution.
- Marketing pages can use more whitespace than docs, but docs should prioritize dense scanning, code readability, and visible next steps.

## Safety

- Do not include raw secrets, tokens, private graph dumps, raw prompts, provider payloads, or local absolute paths.
- State that handoff warnings and no-secret checks are safety aids, not comprehensive data-loss prevention.
- Keep public docs honest about deferred worker execution, hosted services, and advanced alpha surfaces.
