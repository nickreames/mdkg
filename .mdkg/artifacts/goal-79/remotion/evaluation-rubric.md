# Remotion candidate scenes and evaluation rubric

Status: accepted input to `root:task-814` and `root:test-473`
Frozen: 2026-07-27, before feasibility scoring
Decision universe: exactly `proceed`, `defer`, or `reject`
Current recommendation: `defer`

## Purpose

This rubric prevents an attractive motion concept from compensating for a
missing legal, offline, accessibility, safety, or retention boundary. It is
candidate-specific: scores below apply to the strongest scene, not to Remotion
as a general product.

Evidence means a primary source, a current repository receipt, or an empirical
receipt from an explicitly authorized pilot. A plausible assertion is not
evidence. Missing evidence scores zero and fails any associated gate.

## Candidate schema

Every candidate must bind all of these fields:

- `candidate_id`
- `title`
- `narrative_job`
- `audience_value`
- `information_change_over_time`
- `duration_seconds`
- `caption_and_transcript_contract`
- `reduced_motion_behavior`
- `still_fallback`
- `retained_inputs_and_outputs`
- `presentation_boundary`
- `canonical_site_boundary`
- `risk_of_false_inference`
- `comparison_evidence`

## Named candidates

### Candidate R1: reusable source -> specialized goal -> accepted evidence

- `candidate_id`: `source-specialized-evidence`
- `title`: Reusable specification becomes bounded execution
- `narrative_job`: Prepare the audience to read the reveal as a reusable
  contract becoming a specific, executed, and evidenced result without teaching
  graph mechanics.
- `audience_value`: Make invariant guardrails, specialized values, output, and
  accepted evidence distinguishable in one short sequence.
- `information_change_over_time`:
  1. show the reusable source goal;
  2. keep invariant fields visually fixed;
  3. resolve only the specialized fields;
  4. introduce the bounded output; and
  5. attach accepted evidence as the terminal state.
- `duration_seconds`: 12–16 at 1920x1080 and 30 fps.
- `caption_and_transcript_contract`: Visible labels carry all essential
  information. If the clip includes narration or meaningful audio, retain
  synchronized burned-in captions plus SRT and the equivalent speaker-note
  transcript. If silent under live narration, retain the speaker-note
  transcript and do not use audio-only cues.
- `reduced_motion_behavior`: Replace interpolated movement with discrete
  appear/highlight states, or use the still fallback.
- `still_fallback`:
  `presentations/ai-native-sdlc-demo/artifacts/demo-002/production-reveal/source-vs-specialized-16x9.png`
  plus the accepted slide 17.
- `retained_inputs_and_outputs`: exact package/lock manifest, browser build,
  local fonts/assets/captions, composition source, render command and
  environment allowlist, frame fingerprints, media metadata, MP4, still PNG,
  SRT/transcript, license notices, no-secret receipt, and event-playback
  receipt.
- `presentation_boundary`: eligible only for a separately authorized isolated
  presentation pilot.
- `canonical_site_boundary`: no player, runtime, package, or generated asset.
  Any future public MP4 is a separate `task-519`/`test-248` and canonical-site
  decision.
- `risk_of_false_inference`: The sequence must label illustrative versus
  accepted states and may not imply that an authored animation is current run
  evidence.
- `comparison_evidence`: current static slide and retained 16:9 image exist;
  no Remotion or HTML/CSS A/B receipt exists.
- Priority: 1.

### Candidate R2: Plan -> Work -> Evidence

- `candidate_id`: `plan-work-evidence`
- `title`: Plan becomes scoped work and accepted proof
- `narrative_job`: Connect requirements and decisions to execution and
  validation.
- `audience_value`: Reinforce causality and the closed-loop model.
- `information_change_over_time`: Plan artifacts appear; work is bounded and
  executed; tests/checkpoints attach evidence and state what comes next.
- `duration_seconds`: 8–12 at 1920x1080 and 30 fps.
- `caption_and_transcript_contract`: same contract as R1.
- `reduced_motion_behavior`: three discrete states or the static slide.
- `still_fallback`: accepted presentation slide 14.
- `retained_inputs_and_outputs`: same manifest family as R1.
- `presentation_boundary`: presentation-only pilot.
- `canonical_site_boundary`: separate public-asset decision; no runtime/player
  authority.
- `risk_of_false_inference`: avoid implying that all work is linear or that a
  visual checkpoint itself proves execution.
- `comparison_evidence`: the accepted static slide already communicates the
  sequence; staged PowerPoint reveals may satisfy the same need at lower cost.
- Priority: 2.

### Candidate R3: AI coding capability accumulation

- `candidate_id`: `capability-accumulation`
- `title`: Capabilities accumulate; context engineering remains
- `narrative_job`: Show autocomplete, conversational generation, reasoning,
  tool use, conditional context, and long-horizon goal pursuit as overlapping
  capabilities.
- `audience_value`: Make accumulation and layering visible.
- `information_change_over_time`: each capability joins the system without
  replacing the previous capability.
- `duration_seconds`: 18–24 at 1920x1080 and 30 fps.
- `caption_and_transcript_contract`: same contract as R1.
- `reduced_motion_behavior`: discrete layered stills or the accepted slide.
- `still_fallback`: accepted capability-progression slide.
- `retained_inputs_and_outputs`: same manifest family as R1.
- `presentation_boundary`: presentation-only.
- `canonical_site_boundary`: no current use.
- `risk_of_false_inference`: high; motion may imply strict chronology,
  replacement, or clean product handoffs that the accepted claim contract
  deliberately avoids.
- `comparison_evidence`: static narrative is already accepted; no motion A/B
  evidence exists.
- Priority: 3; unsuitable for the first pilot.

The live reveal is explicitly excluded because pre-authored motion could be
mistaken for current execution evidence and undermine the accepted success,
still-running, and hard-blocker branches.

## Non-compensable gates

Every gate must pass for `proceed`. `Conditional`, `unknown`, `not run`, or
`source-inspected only` is a failure for proceed.

| Gate | Passing evidence |
|---|---|
| G1 exact dependency boundary | Isolated presentation-tooling owner and path; then-current `remotion`/`@remotion/*` packages pinned to one exact version; lockfile and browser build retained; no root/docs/mdkg-dev dependency change |
| G2 license and distribution | Accepted legal-entity/use classification for the exact version; Company/Free/evaluation eligibility recorded; FFmpeg/x264/x265 and font/asset notices retained; engineering evidence clearly marked non-legal advice |
| G3 offline render | Browser bootstrapped only under explicit network authority; two subsequent renders pass with outbound network denied and only local bundle/assets/fonts/captions |
| G4 offline playback | MP4 and still play from the actual PowerPoint on the event machine three times without network, browser, local server, dropped content, or presenter-timing regression |
| G5 captions and transcript | Meaningful prerecorded audio has synchronized captions; SRT and transcript retained; visible labels and notes cover silent/live-narrated use |
| G6 still fallback | A legible 16:9 still preserves every essential fact, state, and source; presenter can skip the clip without losing meaning |
| G7 accessibility and motion | No motion-only or color-only meaning; contrast/readability pass; pause/skip path exists; reduced-motion path uses discrete states/still; flash threshold reviewed |
| G8 performance | Candidate meets the frozen target-machine render, memory, output-size, and event-playback budgets below |
| G9 reproducibility and retention | Composition inputs, exact versions, commands, environment allowlist, frame fingerprints, media metadata, outputs, captions, notices, and receipts are retained; rerun comparison passes |
| G10 no-secret and local-input safety | Constructed environment excludes `.env`, credentials, private prompts/payloads/identifiers, remote assets, providers, telemetry, analytics, and network fetches; bounded scan passes |
| G11 material audience benefit | Human A/B evaluation on the named scene confirms a material comprehension or recall improvement over both static/staged PowerPoint and HTML/CSS alternatives |
| G12 canonical-site boundary | Decision explicitly says presentation-only; no Remotion runtime, player, dependency, or media publication reaches canonical mdkg.dev without a separate decision plus `task-519`/`test-248` |

## Frozen pilot budgets

These are proposed future acceptance budgets, not current receipts:

- candidate: R1 only;
- output: H.264 MP4, 1920x1080, 30 fps, 12–16 seconds;
- output size: at most 15 MiB;
- render wall time: at most 10 minutes after bootstrap on the designated event
  Mac;
- peak resident memory: at most 4 GiB for the render process family;
- concurrency: benchmark `1`, `25%`, and `50%`; retain the fastest stable value
  rather than accepting the default;
- network: zero outbound connections during each of two measured renders;
- repeatability: same duration, dimensions, FPS, codec, asset manifest, and
  designated beginning/middle/end PNG frame hashes on two consecutive renders;
  record the encoded-file hash but do not claim it is cross-platform stable;
- playback: three offline PowerPoint runs on the event Mac with no missing
  frames, unreadable text, unwanted autoplay, or timing overrun;
- accessibility: static/reduced-motion path and transcript available at the
  same rehearsal boundary;
- retention: source, exact lock, browser identifier, local assets/fonts,
  captions, commands, environment allowlist, notices, MP4, still, frame hashes,
  media metadata, and test receipts retained together.

## Weighted score

Each dimension is scored 0–5, then multiplied by `weight / 5`.

- `0`: absent, not applicable to the comparison, or unsupported by evidence;
- `1`: evidence materially argues against readiness;
- `2`: partially specified or source-supported but not exercised;
- `3`: credible source-backed design with material limitations;
- `4`: one successful current local/target receipt;
- `5`: repeated target-environment proof and, where applicable, human
  confirmation.

| Dimension | Weight |
|---|---:|
| narrative clarity | 18 |
| material benefit over the accepted static scene | 22 |
| offline determinism | 12 |
| authoring and rehearsal cost, where higher means lower cost | 10 |
| dependency and license safety | 10 |
| captions and transcript | 5 |
| accessibility and reduced motion | 6 |
| render and playback performance | 5 |
| reproducibility | 5 |
| maintenance ownership | 3 |
| asset retention | 2 |
| no-secret safety | 2 |
| **Total** | **100** |

For `material benefit`, only a human A/B comparison against both alternatives
may score 4 or 5. A design hypothesis without that comparison scores zero.

## Outcome algorithm

### Proceed

Choose `proceed` only if:

1. all 12 gates pass;
2. Remotion scores at least 80/100;
3. Remotion scores at least 10 points above both current alternatives for the
   same named scene;
4. the human comparison identifies the specific improvement rather than
   preferring novelty; and
5. a separate scope-population/activation pass for Goal 80 is authorized.

Proceed still authorizes no canonical-site use and no implementation inside
Goal 79.

### Defer

Choose `defer` when:

- Remotion is technically plausible;
- at least one proceed gate remains unresolved or failed;
- a bounded, separately authorized pilot could resolve the missing evidence;
  and
- no hard repository, legal, accessibility, or event boundary has ruled the
  option out.

Defer leaves Goal 80 paused and empty.

### Reject

Choose `reject` when:

- a hard boundary makes the contemplated use ineligible or unsafe;
- a completed pilot fails a non-compensable gate;
- Remotion scores below 80 or lacks the 10-point advantage after equivalent
  evidence is available; or
- the accepted static/staged alternative communicates the scene adequately
  without comparable cost.

Reject leaves Goal 80 paused and empty.

## Current evidence-backed scores for R1

These scores use only evidence available on 2026-07-27. They are not forecasts.

| Dimension | Weight | PowerPoint/static | HTML/CSS motion | Remotion |
|---|---:|---:|---:|---:|
| narrative clarity | 18 | 4 | 4 | 4 |
| material benefit over static | 22 | 0 | 0 | 0 |
| offline determinism | 12 | 5 | 3 | 2 |
| authoring/rehearsal cost | 10 | 5 | 3 | 1 |
| dependency/license safety | 10 | 5 | 4 | 0 |
| captions/transcript | 5 | 4 | 3 | 3 |
| accessibility/reduced motion | 6 | 5 | 3 | 2 |
| performance | 5 | 5 | 3 | 0 |
| reproducibility | 5 | 5 | 3 | 2 |
| maintenance | 3 | 5 | 3 | 1 |
| retention | 2 | 5 | 4 | 3 |
| no-secret | 2 | 5 | 4 | 4 |
| **Weighted total** | **100** | **73.4** | **53.2** | **32.0** |

Interpretation:

- PowerPoint/static has strong current receipts but receives zero for
  *additional* benefit over itself.
- HTML/CSS has an architectural path but no candidate artifact, capture,
  playback, or A/B receipt.
- Remotion has strong theoretical narrative control and documented local
  primitives, but its proceed-defining material-benefit, license, performance,
  and target-environment evidence is missing.
- The low Remotion readiness score supports `defer`, not automatic `reject`,
  because a bounded R1 pilot could still generate the missing comparable
  evidence.

## Re-scoring rules

- Freeze this rubric before any pilot.
- Bind every score to an evidence path and date.
- Re-score all three alternatives with equivalent candidate-specific evidence.
- Never convert `not run`, `not applicable`, or a product-doc capability into a
  target-environment pass.
- A gate result overrides a weighted total.
- Any version, license, event-machine, deck, or canonical-site boundary change
  invalidates the affected scores and requires a new decision input.
