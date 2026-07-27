# Website Demo Design System

## Ocean Flow

Ocean Flow is the baseline visual system for this template. Each forked demo run
may choose different structure, pacing, imagery, and static visual metaphors, but it
should preserve this core feel:

- clear technical confidence;
- fluid visual rhythm and layered depth;
- bright ocean blues and teals balanced by neutral surfaces;
- crisp text and readable contrast;
- purposeful CSS-only motion rather than decorative noise.

## Palette

- Deep blue: `#0f5fd6`
- Electric blue: `#2476f2`
- Cyan: `#12aeea`
- Teal: `#20c7b5`
- Ink: `#102033`
- Slate: `#526173`
- Mist: `#eef7fb`
- White: `#ffffff`

Primary CTAs should use an Ocean Flow gradient such as
`linear-gradient(135deg, #0f5fd6 0%, #12aeea 55%, #20c7b5 100%)`.

## Interface Rules

- Use Astro components and layouts to emit static semantic HTML and CSS.
- Do not use `client:*` directives, framework hydration, inline or external
  runtime scripts, remote fonts, or third-party runtime assets.
- Keep content readable on mobile before adding visual density.
- Prefer real section structure, concrete examples, and inspectable proof over
  generic marketing claims.
- Keep keyboard navigation, focus visibility, reduced-motion support, and WCAG
  AA contrast intact.
- Avoid unsupported claims about mdkg capabilities.
- Avoid storing raw creative prompts in committed files.

## Creative Latitude

Creative Production and the coding agent may vary:

- page structure;
- hero concept;
- CSS-only motion style;
- section order;
- static proof modules;
- supporting imagery or generated assets;
- tone and rhythm.

They may not vary:

- the stack decision;
- the no-secret boundary;
- the caller-gated integration and publication boundary;
- the requirement that public claims remain source-backed.
