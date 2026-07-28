# Demo 2 golden fallback recovery

This is the read-only recovery path for the AI-Native SDLC presentation.
Demo 2 is the accepted production rehearsal at exact Git SHA
`f6af6410cf03ae222c4ee102844a678373b35d93`.

Do not edit, regenerate, overwrite, recommit, push, redeploy, or change provider
configuration while using this fallback. A changed artifact is a new fallback
version and requires a fresh Goal 5 acceptance boundary.

## Verify before the event

From the repository root:

```sh
sha256sum -c presentations/ai-native-sdlc-demo/artifacts/demo-002/golden-fallback.sha256
```

On macOS without GNU `sha256sum`:

```sh
shasum -a 256 -c presentations/ai-native-sdlc-demo/artifacts/demo-002/golden-fallback.sha256
```

Then confirm that `golden-fallback.json` still names:

- commit `f6af6410cf03ae222c4ee102844a678373b35d93`;
- production project `mdkg-dev`, deployment
  `dpl_21o234sZhwAeTxQYUjaHEhGKbUJY`;
- docs project `mdkg-docs`, deployment
  `dpl_589fWNWwJEEUa7DGnwz738S8kPeF`;
- `https://mdkg.dev/demo/2/`;
- `https://mdkg.dev/demo/2/output/`.

The local hash seal verifies retained evidence. The remote identities are
time-stamped observations; rechecking a live URL or provider is read-only and
must not be confused with changing a deployment.

## Live reveal

1. Show
   `production-reveal/source-vs-specialized-16x9.png`.
2. Say: “This is the same local goal ID specialized from a reusable starting
   specification into a bounded execution contract.”
3. Open `https://mdkg.dev/demo/2/output/` and show Plan → Work → Evidence.
4. Open `https://mdkg.dev/demo/2/` only if more graph detail is useful; the page
   is intentionally long, so do not spend reveal time scrolling by default.
5. Show the consolidated deployment/live-route receipt and identify exact SHA
   `f6af6410`.
6. Close with what completed, why it was done, and what comes next.

The static comparison shows the specialized goal at its governed
pre-publication handoff and says “paused at publication.” Follow it immediately
with the Goal 5 publication receipt. That sequence makes the authority
transition explicit rather than pretending the candidate could publish itself.

## Offline reveal

If the browser, network, or display handoff fails:

1. Show
   `production-reveal/source-vs-specialized-16x9.png`.
2. Show `screenshots/output-desktop.png`.
3. Use `screenshots/detail-desktop.png` only for deeper graph evidence.
4. Use the mobile screenshots if responsive behavior is questioned.
5. Read the two production URLs aloud or display them as text.
6. State that the retained images are exact-SHA production captures and that
   the live route could not be rechecked in the room.

The original Goal 4 offline site remains available under `fallback/`. It proves
the accepted local candidate and can be served without provider access:

```sh
python3 -m http.server 8000 \
  --directory presentations/ai-native-sdlc-demo/artifacts/demo-002/fallback/site
```

Open:

- `http://127.0.0.1:8000/demo/2/`
- `http://127.0.0.1:8000/demo/2/output/`

Do not describe the offline site as a fresh production observation.

## Demo 3 recovery wording

If Demo 3 is still running:

> The live goal is still running, so I am not going to call it complete. I will
> show the sealed Demo 2 rehearsal, which passed the same exact-SHA and
> live-route contract.

If Demo 3 stops at a hard blocker:

> The agent stopped at the authority boundary we set. That is a controlled
> outcome, not a successful Demo 3 deployment. Here is the sealed Demo 2
> rehearsal and its production evidence.

If provider visibility is unavailable:

> I cannot verify the production state, so I will not call the live run
> complete. I will use the retained exact-SHA evidence capture.

If a deployment is READY but its SHA does not match:

> A ready deployment without the approved SHA is not proof of this run.

## Recovery boundaries

- No force push, history rewrite, tag, package publication, manual deployment,
  redeploy, DNS, alias, analytics, environment-variable, or project-setting
  change is part of recovery.
- Do not modify a sealed artifact to make verification pass.
- A missing or changed file fails closed.
- A new Demo 2 version requires a new manifest, new receipts, and fresh Goal 5
  acceptance; never overwrite this seal in place.
