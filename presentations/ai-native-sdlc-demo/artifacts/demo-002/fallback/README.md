# Demo 2 offline fallback

This directory is the immutable local fallback sealed by program Goal 4. It
contains the canonical Demo 2 detail/output HTML, every required local asset,
the reusable and specialized goal snapshots, four route captures, and the
16:9 reveal composition.

It proves a local candidate only. It does not imply a commit, push, deployment,
public URL, provider inspection, or production success.

## Serve the fallback

From the repository root:

```sh
python3 -m http.server 8000 \
  --directory presentations/ai-native-sdlc-demo/artifacts/demo-002/fallback/site
```

Then open:

- `http://127.0.0.1:8000/demo/2/`
- `http://127.0.0.1:8000/demo/2/output/`

The two pages and their CSS, favicon, inline preview SVG, graph evidence, and
route structure work without a network or provider. External navigation and
CTA links still target mdkg.dev, docs.mdkg.dev, GitHub, and npm; those
destinations naturally require network access.

## Reveal assets

- `reveal/source-vs-specialized-16x9.png` is the 1600 x 900 full-screen
  comparison visual.
- `reveal/detail-desktop.png` and `reveal/output-desktop.png` are 1280 x 720
  local route captures.
- `reveal/detail-mobile.png` and `reveal/output-mobile.png` are 390 x 720 local
  route captures.
- The SVG beside the 16:9 PNG is the deterministic editable source.

The Browser connector's full-page stitching repeated some long-page capture
segments, so the retained route images use clean viewport captures. Complete
route acceptance is separately recorded with DOM dimensions, semantic checks,
and responsive no-overflow evidence.

## Verify the seal

From this fallback directory:

```sh
shasum -a 256 -c manifest.sha256
```

The manifest is stable-path ordered and intentionally excludes itself. An
added file is not automatically trusted; a missing or changed listed file must
fail verification. Any later candidate change requires a new candidate
receipt and a new fallback manifest rather than silently replacing this seal.
