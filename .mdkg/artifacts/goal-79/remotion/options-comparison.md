# Remotion option comparison

Status: accepted input to `root:spike-35`
Research date: 2026-07-27
Authority: read-only research plus mdkg evidence; no install, render, deck, site,
package, lockfile, publication, or provider mutation
Recommendation: **defer Remotion adoption**

## Executive finding

Remotion is technically capable of producing a deterministic, local video from
local inputs, and one presentation scene has a credible reason to use temporal
composition. It is not adoption-ready for this repository.

The current PowerPoint/static path is already source-backed, visually
QA-accepted, editable, and rehearsed to 33:55. Remotion would add an exact-version
package family, a managed headless-browser bootstrap, FFmpeg distribution
considerations, a license/entity classification, caption and accessibility
work, render benchmarking, offline playback validation, and retained source plus
output contracts. None of those implementation-time gates has been exercised in
this research-only lane.

The right outcome is therefore `defer`, not `reject`:

- `defer` because a bounded, presentation-only pilot could still prove a
  material storytelling advantage;
- not `proceed` because the legal classification, empirical render/playback
  evidence, human A/B comparison, and maintenance owner are unresolved;
- not `reject` because primary documentation supports a local-input,
  local-render architecture and the source-to-specialized story is a plausible
  temporal sequence.

## Current repository baseline

The comparison starts from the accepted repository state, not from a generic
video-tool benchmark.

- `ai_native_sdlc_demo:goal-3` is achieved and non-stale at source commit
  `58b44d719cd3155730c78354c90588a1c4f70a93`.
- The presentation is a 20-slide editable PowerPoint with a rendered contact
  sheet, visual QA, accessibility review, speaker notes, and an offline
  rehearsal receipt.
- The rehearsed content path finishes at 33:55, below the 35-minute hard stop.
- Slide 14 already communicates Plan -> Work -> Evidence as a static visual.
- Slide 17 already communicates reusable source specification -> specialized
  bounded execution.
- Demo 2 retains a production 16:9
  `source-vs-specialized-16x9.png` fallback and accepted live-route receipts.
- `mdkg-dev/astro.config.mjs` declares static output. The presentation's accepted
  site decision requires static Astro, zero generated client JavaScript, local
  assets, reduced-motion behavior, and bounded performance.
- `task-519` and `test-248` intentionally defer public generated media and keep
  any future media additive, rejectable, source-backed, accessible, and
  no-secret.
- No Remotion package is present in the root, docs, or mdkg-dev package or lock
  files. Those files were inspected, not changed.
- `root:goal-80` is paused with empty scope and grants no implementation
  authority.

## Options

| Medium | Audience value | Offline and repeatability | Cost and risk | Current fit |
|---|---|---|---|---|
| PowerPoint plus retained static assets | Strong presenter control; the accepted slides already explain all required concepts; static stills make state and evidence easy to inspect | Native event format; no new runtime; already rehearsed and retained | Lowest incremental cost; ordinary deck QA and source retention still apply | **Ready now and the comparison baseline** |
| HTML/CSS motion, then present or capture | Good for lightweight reveals and state transitions; CSS-only motion can align with the existing visual language | Conditional: a capture adds a media-production lane, while live HTML adds browser and event-environment risk | New capture/playback and reduced-motion QA; canonical mdkg.dev still forbids implied runtime JavaScript | **Possible future alternative, not currently evidenced for this scene** |
| Offline Remotion render embedded in PowerPoint | Best theoretical control over frame-by-frame sequencing, exact timing, reusable components, still frames, and caption artifacts | Architecturally feasible with pinned packages, preinstalled Chrome Headless Shell, local `staticFile()` assets/fonts, seeded randomness, network denial, and local H.264 output | Highest incremental dependency, browser, FFmpeg, license, accessibility, benchmark, playback, retention, and maintenance burden | **Promising but not adoption-ready; defer** |
| No motion | Preserves the accepted deck and lets the speaker control emphasis | Strongest offline reliability | No incremental cost | **Acceptable default** |

## Current Remotion facts and implications

### Toolchain and versions

The current official docs, accessed 2026-07-27, describe Remotion 4.0.500. The
brownfield and Player installation guides require `remotion` and all
`@remotion/*` packages to use the same exact version and warn against range
prefixes that can create version conflicts. The getting-started page requires
Node 16 or newer, macOS 15 or newer, or Linux with glibc 2.35 or newer and
additional system packages.

An authorized pilot should therefore use a separate presentation-tooling
workspace and, on the day of implementation, re-resolve the current supported
version and pin every Remotion package exactly. It should not add Remotion to
the root, docs, or canonical mdkg.dev dependency graph.

For a CLI-only pilot, the documented brownfield baseline is `remotion` plus
`@remotion/cli`; `@remotion/captions` and `@remotion/fonts` are required only if
the candidate uses their APIs. Direct programmatic rendering would add the
documented renderer/bundler packages and is unnecessary for the first pilot.
This proposed package boundary has not been installed or lock-resolved.

### Browser and offline boundary

Remotion uses Chrome Headless Shell for rendering and installs it under
`node_modules`. The docs recommend ensuring the browser ahead of rendering.
`renderMedia()` can consume a local bundle path, but it may detect or download a
browser if one is not already available. Remote audio/video/assets can also
introduce network access.

For this repository, "offline" must mean:

1. one separately authorized bootstrap installs exact packages and the pinned
   browser while network access is allowed;
2. the package lock, browser build, asset manifest, fonts, caption source, and
   license manifest are retained;
3. every render input is local and referenced through `staticFile()` or a local
   bundle;
4. Google Fonts loaders, remote images/media, Lambda, Cloud Run, telemetry,
   analytics, and provider APIs are excluded;
5. two subsequent renders execute with outbound network denied; and
6. the resulting H.264 video and static still play from the actual PowerPoint
   on the event machine without a browser, server, or network.

Primary documentation supports this architecture, but this lane did not run it.

### Determinism and performance

Remotion exposes frame-based composition, explicit dimensions/FPS/duration,
controlled concurrency, local assets, seeded `random()`, and sample-frame
rendering. These support repeatability by design. They do not prove that a
particular composition is reproducible or fast. The performance guide calls
video rendering a heavy workload, states that hardware and composition code
matter, and recommends benchmarking concurrency.

No current evidence establishes render duration, peak memory, output size,
frame stability, PowerPoint playback, or repeatability for the candidate scene.
Those remain proceed-blocking empirical gates.

### Captions and accessibility

Remotion supports local SRT import, burned-in captions, and SRT export. That
capability does not automatically make a composition accessible. Remotion's own
accessibility page says user-authored composition accessibility remains the
user's responsibility, and its web Player only partially supports modern
accessibility standards.

For an embedded prerecorded clip:

- narration and meaningful sound require synchronized captions;
- the slide notes retain an equivalent transcript;
- all meaning remains visible in the static fallback and is not encoded only by
  motion, color, position, or timing;
- no flashing pattern exceeds the relevant WCAG threshold;
- the presenter can pause or skip the clip;
- a reduced-motion path uses the still or discrete, non-moving states; and
- the clip is not used as an autoplaying canonical-site player.

### Security and public safety

Remotion executes npm code in a browser context. Its security guide states that
`.env` and `REMOTION_` environment variables are passed to the headless browser.
A pilot must therefore run with a constructed allowlist environment, no `.env`,
no credentials, no private prompts, no provider payloads, no private repository
identifiers, and no remote assets. Inputs, logs, manifests, frames, captions,
and outputs require a bounded no-secret review before retention.

### License boundary

The current repository license file for Remotion v4 states that individuals,
nonprofits, evaluation use, and for-profit organizations with up to three
employees qualify for the free license; other for-profit organizations require
the applicable company license. Remotion also distributes a compiled FFmpeg
binary under GPLv2+, with x264/x265 under GPL.

The legal entity and exact contemplated use for this presentation have not been
classified in Goal 79. This receipt is engineering research, not legal advice.
The entity/use classification, retained notices, and distribution implications
must be accepted before a pilot can satisfy the license gate.

The published Remotion 5.0 terms are explicitly marked upcoming and do not
govern the current 4.x version. They are still a maintenance signal: any future
pilot must re-check the then-current license, package version, reporting or
telemetry behavior, and entity/use class instead of carrying this 4.x analysis
forward.

## Candidate scene ranking

### 1. Reusable source -> specialized goal -> accepted evidence

- Existing anchor: presentation slide 17, slide 18 reveal cue, and the retained
  Demo 2 16:9 source-versus-specialized production image.
- Narrative job: show which constraints persist from the reusable goal, which
  fields specialize for one bounded run, and how output plus evidence turns the
  specification into accepted proof.
- Information change over time: source contract appears; invariant fields stay
  fixed; specialized values resolve; output appears; evidence locks the state.
- Proposed duration: 12–16 seconds at 1920x1080, 30 fps.
- Material-motion hypothesis: temporal persistence versus specialization may be
  easier to follow than simultaneous columns.
- Static alternative: the existing slide 17 plus
  `artifacts/demo-002/production-reveal/source-vs-specialized-16x9.png`.
- Boundary: presentation-only pilot. It must not imply that the illustrative
  source state is current execution evidence.
- Rank: **best candidate**, but material benefit remains unproved without human
  A/B review.

### 2. Plan -> Work -> Evidence

- Existing anchor: presentation slide 14.
- Narrative job: connect requirements and decisions to scoped work and accepted
  receipts.
- Information change over time: plan artifacts enter; bounded tasks execute;
  test/checkpoint evidence closes the loop.
- Proposed duration: 8–12 seconds.
- Risk: simple staged PowerPoint reveals can already express this sequence with
  lower cost.
- Static alternative: the accepted slide 14.
- Boundary: presentation-only unless a separate `task-519`/`test-248` public
  asset decision is accepted.
- Rank: second.

### 3. AI coding capability accumulation

- Existing anchor: the presentation capability progression.
- Narrative job: show capabilities accumulating rather than one generation
  replacing another.
- Information change over time: autocomplete, conversation, reasoning,
  tool-use, conditional context, and long-horizon goal pursuit layer together.
- Proposed duration: 18–24 seconds.
- Risk: motion can falsely imply a strict chronology or clean handoff where the
  deck deliberately describes overlapping product dates and capabilities.
- Static alternative: the accepted capability slide and speaker narration.
- Boundary: presentation-only.
- Rank: third; not recommended for a first pilot.

The live reveal itself is not a candidate. Animating it could make an authored
sequence look like current run evidence and weaken the presentation's
fail-closed branch semantics.

## Decision recommendation

Record `defer` with high confidence.

Remotion may be reconsidered only after a new, explicitly authorized,
presentation-only pilot pass:

1. confirms the legal entity/use classification and then-current license;
2. resolves and pins the then-current exact package family outside canonical
   mdkg.dev;
3. grants the one-time package/browser bootstrap and local render authority;
4. implements only the named source-to-specialized scene;
5. proves two network-denied renders, performance budgets, retained manifests,
   captions/transcript, static fallback, no-secret output, and event-machine
   playback;
6. obtains human A/B evidence that Remotion improves comprehension by the
   rubric margin over both the current static slide and an HTML/CSS or staged
   PowerPoint alternative; and
7. makes an independent keep/discard decision.

Until then, use the accepted static deck and retained production fallback. Goal
80 remains paused and empty.

## Primary sources

All URLs were accessed 2026-07-27.

- Remotion getting started and system requirements:
  https://www.remotion.dev/docs
- Brownfield install, exact version alignment, and CLI rendering:
  https://www.remotion.dev/docs/brownfield
- Player install and exact package alignment:
  https://www.remotion.dev/docs/player/installation
- Local/programmatic render inputs and browser selection:
  https://www.remotion.dev/docs/renderer/render-media
- Chrome Headless Shell bootstrap:
  https://www.remotion.dev/docs/miscellaneous/chrome-headless-shell
- Local assets and `staticFile()`:
  https://www.remotion.dev/docs/assets
  and https://www.remotion.dev/docs/staticfile
- Local font loading:
  https://www.remotion.dev/docs/fonts-api/load-font
- Captions, SRT import, and burned-in/SRT export:
  https://www.remotion.dev/docs/captions/
  https://www.remotion.dev/docs/captions/importing
  https://www.remotion.dev/docs/captions/exporting
- Rendering performance and concurrency benchmarking:
  https://www.remotion.dev/docs/performance
- Security and environment-variable exposure:
  https://www.remotion.dev/docs/security
- Seeded randomness:
  https://www.remotion.dev/docs/random
- Remotion product accessibility and user-code responsibility:
  https://www.remotion.dev/docs/accessibility
- Current v4 repository license:
  https://raw.githubusercontent.com/remotion-dev/remotion/main/LICENSE.md
- FFmpeg/x264/x265 license notes:
  https://www.remotion.dev/docs/miscellaneous/ffmpeg-license
- Upcoming Remotion 5 terms:
  https://www.remotion.dev/docs/license/terms
- WCAG 2.2 prerecorded captions:
  https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded
- WCAG pause/stop/hide and motion guidance:
  https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
  and
  https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html

## Repository evidence

- `root:task-519`
- `root:test-248`
- `ai_native_sdlc_demo:goal-3`
- `presentations/ai-native-sdlc-demo/deck/rendered/contact-sheet.png`
- `presentations/ai-native-sdlc-demo/deck/rendered/qa-report.md`
- `presentations/ai-native-sdlc-demo/deck/rendered/rehearsal-receipt.md`
- `presentations/ai-native-sdlc-demo/artifacts/demo-002/rehearsal-receipt.json`
- `presentations/ai-native-sdlc-demo/artifacts/demo-002/production-reveal/source-vs-specialized-16x9.png`
- `presentations/ai-native-sdlc-demo/.mdkg/design/dec-3-use-static-astro-ocean-flow-demo-outputs-with-bounded-creative-freedom.md`
- `mdkg-dev/astro.config.mjs`

## Confidence and limitations

Confidence in `defer`: high.

Primary documentation and current repository receipts establish architectural
feasibility and the stronger static baseline. This lane intentionally did not
establish install resolution, browser bootstrap, render behavior, license
eligibility for the intended legal entity/use, performance, playback, or human
comprehension. Those limitations are the reason for defer and must not be
rephrased as passes.
