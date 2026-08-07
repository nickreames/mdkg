# Remotion research feasibility receipt

Node: `root:test-473`
Date: 2026-07-27
Mode: source and repository evidence review only
Overall result: **PASS for a decision of `defer`; FAIL for `proceed`**
Implementation authority exercised: none

## Interpretation

`test-473` is complete when every case has a source-backed disposition. It is
not an implementation test and does not require every adoption gate to pass.
An unresolved adoption gate must produce `defer` or `reject`, never a waived
pass.

Result vocabulary:

- `PASS`: current evidence satisfies the research case and the corresponding
  proceed gate.
- `PASS-RESEARCH / FAIL-PROCEED`: the case is decision-ready and supports a
  defer outcome, but implementation evidence required for proceed is absent.
- `FAIL-PROCEED`: a required adoption fact or empirical receipt is absent.
- No waiver status exists.

## Environment and unchanged dependency surface

- Inspected runtime: Node `v24.18.0`, npm `11.16.0`.
- Current Remotion docs require Node 16 or newer, so the inspected runtime is
  compatible in principle. No Remotion process was executed.
- Case-insensitive package/lock search across root, docs, and mdkg-dev returned
  no Remotion dependency.
- Baseline and current hashes are identical:

| Path | SHA-256 |
|---|---|
| `package.json` | `4cee961fe2cfa16e6c08c09ec50ba327cfded0d700bc16633e3a534ef79e3403` |
| `package-lock.json` | `5625b8b9422af460209395f1f4f4c72615d23c5acadc57efae5cac56e1e09957` |
| `docs/package.json` | `05f0f5ba569371c7fc517223cd91337411c1b146005be7119cfb07b41ae921f6` |
| `docs/package-lock.json` | `5b28b767ac1cda7c2ba27473ee49bde6f2241e68de4a7375011eb2705f9e937c` |
| `mdkg-dev/package.json` | `3c43588815a905232f0a99f6bb8b5e3a6db7b96434fa379737bdda562f12c8bf` |
| `mdkg-dev/package-lock.json` | `4988e006ace3eab2b1ce8ef5566fe2d4ae89c3566b1357288d776d4cf28120e5` |

- Git changes at case start were limited to Goal 79 mdkg records plus the
  pre-existing unrelated Demo 2 pack directory. The unrelated pack remained
  unmodified and excluded.

## Case results

### 1. `dependency-boundary`

Result: **PASS-RESEARCH / FAIL-PROCEED**

Evidence:

- Official brownfield docs current on 2026-07-27 identify exact-version
  `remotion` and `@remotion/cli` as the CLI baseline and say every
  `@remotion/*` package must use the same version without range prefixes.
- The current docs describe version 4.0.500. Version is time-sensitive and must
  be re-resolved on an authorized pilot day.
- Candidate R1 would add `@remotion/captions` and `@remotion/fonts` only if
  their APIs are used. A CLI-only first pilot does not need a direct
  programmatic renderer/bundler integration.
- Rendering uses Chrome Headless Shell installed under `node_modules`; an
  authorized pilot must retain the browser identity and ensure it before
  network denial.
- The accepted ownership boundary is an isolated presentation-tooling
  workspace. Root, docs, and mdkg-dev package/lock files are forbidden.

Missing for proceed:

- no dependency solver or lockfile has been run;
- no exact transitive tree or vulnerability scan exists;
- no browser binary has been installed or hashed;
- no long-term maintenance owner has accepted upgrades; and
- no implementation path has been authorized.

Source:

- https://www.remotion.dev/docs/brownfield
- https://www.remotion.dev/docs/player/installation
- https://www.remotion.dev/docs/miscellaneous/chrome-headless-shell

### 2. `license-compatibility`

Result: **FAIL-PROCEED**

Evidence:

- The current Remotion v4 repository license says individuals, nonprofits,
  evaluation use, and for-profit organizations with up to three employees are
  eligible for the free license. Other for-profit organizations require the
  applicable company license.
- Remotion distributes a compiled FFmpeg binary under GPLv2+; x264 and x265 are
  GPL components.
- Remotion's v5 terms are explicitly marked upcoming and apply only when 5.0 is
  released. They are a future re-review trigger, not the current 4.x contract.

Missing for proceed:

- the legal entity and exact use class for the presentation are not recorded;
- no applicable Company/Free/evaluation determination has been accepted;
- retained notice/distribution obligations have not been reviewed for the
  proposed MP4 and tooling archive; and
- this engineering receipt is not legal advice.

No pilot may turn source-level evaluation permission into commercial or
distribution authority by implication.

Source:

- https://raw.githubusercontent.com/remotion-dev/remotion/main/LICENSE.md
- https://www.remotion.dev/docs/miscellaneous/ffmpeg-license
- https://www.remotion.dev/docs/license/terms
- https://www.remotion.dev/docs/license/faq

### 3. `offline-rendering`

Result: **PASS-RESEARCH / FAIL-PROCEED**

Evidence:

- `renderMedia()` accepts a local bundle path.
- `staticFile()` and local font loading support local assets.
- Remotion provides explicit frame/FPS/duration inputs and seeded randomness.
- Chrome Headless Shell can be ensured ahead of the render.
- The accepted future architecture forbids remote assets, providers, Google
  Fonts loaders, Lambda, Cloud Run, analytics, and runtime fetches.

Missing for proceed:

- no browser bootstrap occurred;
- no render occurred;
- no outbound-network-denied receipt exists;
- no two-run frame fingerprint comparison exists;
- no local H.264 artifact exists; and
- no event-machine PowerPoint playback receipt exists.

Documentation establishes feasibility, not target-environment determinism.

Source:

- https://www.remotion.dev/docs/renderer/render-media
- https://www.remotion.dev/docs/miscellaneous/chrome-headless-shell
- https://www.remotion.dev/docs/assets
- https://www.remotion.dev/docs/staticfile
- https://www.remotion.dev/docs/fonts-api/load-font
- https://www.remotion.dev/docs/random

### 4. `captions`

Result: **PASS-RESEARCH / FAIL-PROCEED**

Evidence:

- Remotion documents local SRT import, burned-in captions, and separate SRT
  export.
- The candidate contract requires synchronized captions for meaningful
  prerecorded audio, a retained SRT and transcript, and visible labels plus
  speaker notes for silent/live-narrated use.
- WCAG 2.2 guidance identifies missing captions for meaningful prerecorded
  synchronized media as a failure.

Missing for proceed:

- no narration/audio decision is frozen;
- no SRT, burned-in caption, transcript, sync review, or event playback exists.

Source:

- https://www.remotion.dev/docs/captions/
- https://www.remotion.dev/docs/captions/importing
- https://www.remotion.dev/docs/captions/exporting
- https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded

### 5. `still-fallback`

Result: **PASS**

Evidence:

- Candidate R1 has the accepted slide 17.
- The retained production still exists at
  `presentations/ai-native-sdlc-demo/artifacts/demo-002/production-reveal/source-vs-specialized-16x9.png`.
- Demo 2 rehearsal evidence explicitly recommends that image as the first
  reveal beat.
- The static slide/still preserve source, specialization, output/evidence
  semantics without playback, network, browser, or motion.

Limitation:

- A future clip must verify that its final wording and state labels remain
  equivalent to the fallback. The current fallback is sufficient to skip
  Remotion entirely.

Repository evidence:

- `ai_native_sdlc_demo:goal-3`
- `presentations/ai-native-sdlc-demo/artifacts/demo-002/rehearsal-receipt.json`
- `presentations/ai-native-sdlc-demo/deck/rendered/inspect.ndjson`

### 6. `accessibility`

Result: **PASS-RESEARCH / FAIL-PROCEED**

Evidence:

- Candidate R1 defines a reduced-motion still/discrete-state path, pause/skip
  behavior, contrast/readability requirements, no motion-only/color-only
  meaning, transcript/captions, and flash review.
- Remotion's accessibility page says user code remains the user's
  responsibility and the Remotion Player only partially supports current
  accessibility standards.
- W3C guidance requires appropriate captioning and control/alternatives for
  moving content.
- Canonical-site Player use is explicitly excluded.

Missing for proceed:

- no composition, clip, caption, contrast, motion, flash, pause/skip, or
  reduced-motion artifact has been reviewed;
- no assistive-technology or actual-deck playback receipt exists.

Source:

- https://www.remotion.dev/docs/accessibility
- https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded
- https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
- https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html

### 7. `performance`

Result: **FAIL-PROCEED**

Evidence:

- The official guide calls rendering a heavy workload and says hardware,
  composition code, GPU effects, and concurrency affect performance.
- It recommends benchmarking concurrency rather than assuming a default.
- The rubric freezes a 12–16 second, 1080p30 H.264 candidate; <=15 MiB output;
  <=10-minute post-bootstrap render; <=4 GiB peak RSS; `1`/`25%`/`50%`
  concurrency comparison; and three actual event-machine playback runs.

Missing for proceed:

- every empirical measurement above.

The budgets are decision criteria, not proof.

Source:

- https://www.remotion.dev/docs/performance
- https://www.remotion.dev/docs/renderer/render-media

### 8. `no-secret`

Result: **PASS-RESEARCH / FAIL-PROCEED**

Evidence:

- Current Goal 79 artifacts contain public docs, repository paths, hashes,
  bounded summaries, and public-safe presentation evidence only.
- No dependency, browser, composition, media, or raw log was produced.
- The future contract constructs an allowlist environment; excludes `.env`,
  credentials, private prompts, provider payloads, private identifiers, remote
  assets, telemetry, analytics, and providers; and requires a bounded output
  scan.
- Remotion documents that `.env` and `REMOTION_` variables are passed to the
  headless browser, making the explicit environment boundary necessary.

Missing for proceed:

- no implemented input manifest, environment capture, frame/media scan, or
  output receipt exists.

Source:

- https://www.remotion.dev/docs/security
- `root:task-519`
- `root:test-248`

## Frozen-gate rollup

| Gate | Current result |
|---|---|
| G1 exact dependency boundary | fail for proceed |
| G2 license and distribution | fail for proceed |
| G3 offline render | fail for proceed |
| G4 offline playback | fail for proceed |
| G5 captions and transcript | fail for proceed |
| G6 still fallback | pass |
| G7 accessibility and motion | fail for proceed |
| G8 performance | fail for proceed |
| G9 reproducibility and retention | fail for proceed |
| G10 no-secret and local-input safety | fail for proceed |
| G11 material audience benefit | fail for proceed |
| G12 canonical-site boundary | pass: presentation-only research; no canonical use |

Proceed gates passed: 2/12.
Waivers: 0.
Current Remotion readiness score for R1: 32.0/100.
Proceed threshold: all gates, >=80/100, and >=10 points above both alternatives.

## Decision support

The evidence requires `defer`:

- The strongest candidate and local-only architecture are concrete enough for a
  future pilot.
- Ten proceed gates are not satisfied.
- The two passed gates—the retained still and canonical-site exclusion—also
  ensure that deferring does not block the current presentation or mdkg.dev.
- No hard technical incompatibility justifies `reject` before a bounded pilot,
  but no source-only inference justifies `proceed`.

## Commands and inspections

- `PATH="/opt/homebrew/opt/node@24/bin:$PATH" node -v`
  -> `v24.18.0`
- `PATH="/opt/homebrew/opt/node@24/bin:$PATH" npm -v`
  -> `11.16.0`
- `shasum -a 256` over root/docs/mdkg-dev package and lock files
  -> hashes recorded above and equal to activation baseline
- case-insensitive `rg` over those six files for Remotion
  -> no matches
- `git status --short --branch`
  -> only Goal 79 mdkg changes plus the preserved unrelated Demo 2 pack

No install, package resolution, browser ensure, render, playback, site/deck
mutation, provider call, publication, or remote Git operation was run.

## Sources and confidence

Primary sources were accessed 2026-07-27 and are enumerated per case and in
`.mdkg/artifacts/goal-79/remotion/options-comparison.md`.

Confidence:

- high that current evidence cannot support proceed;
- high that defer is consistent with the frozen rubric;
- medium-high that an isolated offline R1 pilot is technically feasible;
- intentionally no conclusion on legal eligibility, empirical performance, or
  audience benefit until those gates are independently accepted.
