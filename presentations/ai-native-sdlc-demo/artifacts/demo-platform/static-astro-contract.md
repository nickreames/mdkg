# Static Astro and Zero-Client-JavaScript Contract

Status: accepted for the reusable website-demo source template
Owner: shared-source writer
Applies to: specialized Demo 2 and Demo 3 website output
Source graph: `examples/website-demo-template/.mdkg/`

## Fixed implementation boundary

- Astro emits static semantic HTML and CSS.
- Demo pages use zero client-side JavaScript.
- `client:*` directives, framework hydration metadata, generated JavaScript,
  inline or external runtime scripts, remote fonts, and third-party runtime
  assets are forbidden.
- `application/ld+json` metadata is allowed when its payload is static,
  public-safe, and contains no executable code.
- CSS-only motion must respect `prefers-reduced-motion`.
- Keyboard navigation, visible focus, semantic landmarks, responsive rendering,
  and WCAG AA contrast are required.
- Initial page transfer must not exceed 500 KiB, and no raster asset may exceed
  250 KiB.

## Creative latitude

The specialized agent may choose composition, visual metaphor, section order,
typographic hierarchy, imagery, and bounded source-backed marketing copy. It may
also use CSS-only motion and static proof modules. Creative latitude does not
override the stack, accessibility, public-safety, asset, claim, or authority
boundaries.

## Built-output assertion

Validation must fail when a demo detail or output route contains any of:

- a generated `.js`, `.mjs`, or `.cjs` asset;
- an executable or externally sourced `<script>` element;
- Astro hydration markers such as `astro-island`, component URLs, or renderer
  URLs;
- client directives in demo source;
- remote fonts, stylesheets, images, frames, scripts, or CSS imports;
- missing required routes or non-static output.

Static `application/ld+json` metadata and ordinary outbound anchor links are not
runtime assets and are explicitly distinguished from the forbidden cases.

## Authority boundary

The reusable source goal is local-only. It may build, test, and return an
accepted candidate to its caller. It may not integrate, stage, commit, push,
deploy, publish, mutate providers or DNS, activate analytics, create tags, or
release packages. Each later side effect requires a separate caller-owned
authority gate.

## Compatibility and provenance

- Stable ids `dec-1` and `task-1` are preserved under truthful filenames.
- Historical `chk-1` and its event remain unchanged.
- `chk-2` supersedes the historical seed contract for current operator routing;
  it does not claim that the reusable `goal-1` has been executed.
- `examples/demo-runs/demo-001/**` and `mdkg-dev/public/demo-001/**` remain
  immutable historical evidence.

## Required local proof

1. Regenerate and validate the template graph with zero warnings and errors.
2. Confirm `goal-1` routes first to `spike-1`.
3. Confirm an explicit-edge concise pack includes the complete source work
   chain, EDD, decisions, latest checkpoint, and required skills.
4. Build the canonical Astro site and verify `/demo/1/` and
   `/demo/1/output/`.
5. Scan built demo routes for scripts, hydration, runtime assets, and generated
   JavaScript using the exception above.
6. Run the existing mdkg.dev and SEO smoke checks.
7. Confirm historical Demo 1 paths have no diff.
