import type { DemoSnapshot } from "./types";

const demo2Preview =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 980 620'%3E%3Crect width='980' height='620' fill='%23f6fbfd'/%3E%3Cg stroke='%23bfdde7' stroke-width='1'%3E%3Cpath d='M0 100h980M0 200h980M0 300h980M0 400h980M0 500h980M140 0v620M280 0v620M420 0v620M560 0v620M700 0v620M840 0v620'/%3E%3C/g%3E%3Cpath d='M180 440C320 420 350 330 480 320s180-130 330-150' fill='none' stroke='%230f5fd6' stroke-width='12' stroke-linecap='round'/%3E%3Cpath d='M180 440C320 420 350 330 480 320s180-130 330-150' fill='none' stroke='%231cc7b5' stroke-width='4' stroke-linecap='round'/%3E%3Cg font-family='system-ui,sans-serif' font-weight='800'%3E%3Cg transform='translate(120 390)'%3E%3Crect width='210' height='94' rx='8' fill='white' stroke='%23bfdde7'/%3E%3Ctext x='24' y='38' font-size='18' fill='%230f5fd6'%3E01 / PLAN%3C/text%3E%3Ctext x='24' y='68' font-size='24' fill='%230d2033'%3EDurable intent%3C/text%3E%3C/g%3E%3Cg transform='translate(385 270)'%3E%3Crect width='210' height='94' rx='8' fill='white' stroke='%23bfdde7'/%3E%3Ctext x='24' y='38' font-size='18' fill='%230f5fd6'%3E02 / WORK%3C/text%3E%3Ctext x='24' y='68' font-size='24' fill='%230d2033'%3ERouted action%3C/text%3E%3C/g%3E%3Cg transform='translate(650 120)'%3E%3Crect width='230' height='94' rx='8' fill='white' stroke='%23bfdde7'/%3E%3Ctext x='24' y='38' font-size='18' fill='%23087f78'%3E03 / EVIDENCE%3C/text%3E%3Ctext x='24' y='68' font-size='24' fill='%230d2033'%3EInspectable proof%3C/text%3E%3C/g%3E%3C/g%3E%3Ctext x='58' y='70' font-family='system-ui,sans-serif' font-size='24' font-weight='850' fill='%230d2033'%3EKEEP THE PLAN WHEN THE AGENT CHANGES%3C/text%3E%3Ctext x='58' y='102' font-family='system-ui,sans-serif' font-size='16' font-weight='700' fill='%235f7485'%3Egoal-1 / demo-002 / local candidate%3C/text%3E%3C/svg%3E";

export const demo2: DemoSnapshot = {
  id: "2",
  title: "Keep the plan when the agent changes",
  summary:
    "A reusable mdkg website specification became a locally validated static Astro landing page that keeps requirements, work, evidence, and the next authority gate inspectable.",
  status: "Accepted local candidate",
  sourcePath: "presentations/ai-native-sdlc-demo/runs/demo-002",
  outputRoute: "/demo/2/output/",
  listed: false,
  noindex: true,
  outputComponent: "demo-2",
  image: demo2Preview,
  imageAlt:
    "Ocean Flow navigation chart connecting Plan, Work, and Evidence for Demo 2.",
  stack: ["Reusable goal", "Static Astro", "Zero client JavaScript", "Ocean Flow"],
  validation: [
    "the specialized Demo 2 graph validated with zero unresolved warnings",
    "the run-local and canonical Astro builds passed",
    "desktop and mobile routes rendered without horizontal overflow",
    "built output contained zero client JavaScript, remote fonts, forms, trackers, or raster assets",
    "measured small-text color pairs met WCAG 2.x AA"
  ],
  sourceGoal: {
    id: "goal-1",
    title: "Build a complete differentiated website demo from the canonical mdkg template",
    status: "reusable source",
    condition:
      "Build a differentiated local Astro candidate within fixed design and safety boundaries while leaving audience, positioning, composition, and bounded marketing copy open.",
    summary:
      "The reusable specification fixes the lifecycle, authority, tests, and public-safety contract without deciding the final landing-page idea.",
    requirements: [
      "Choose an audience, positioning, structure, and visual direction before implementation.",
      "Use static Astro, Ocean Flow, semantic HTML, reduced motion, and zero client JavaScript.",
      "Record local build and public-safety evidence, then stop before publication."
    ],
    authority: [
      "Local graph, site implementation, and local validation only.",
      "No commit, push, provider action, deployment, or publication."
    ],
    tests: [
      "Deterministic fork and first-node routing.",
      "Static build, responsive browser review, accessibility, and transfer budget.",
      "No-secret, zero-JavaScript, and public-claims checks."
    ],
    checkpoint: {
      id: "chk-1",
      title: "canonical website-demo source accepted",
      status: "recorded"
    },
    sourceHash: "sha256:06397e1a338bfb855c40fba65f8daaaf4f56f0a3aec669d3253886a7ed243c2c"
  },
  executedGoal: {
    id: "goal-1",
    title: "Build and publish the Demo 2 durable-continuity landing page",
    status: "paused at publication",
    condition:
      "Build the durable-continuity landing page, integrate and validate it locally through the canonical adapter, then stop with the publication task untouched and next.",
    summary:
      "The specialized specification narrows the reusable brief to AI-native builders, the promise “Keep the plan when the agent changes,” a navigation-chart visual metaphor, an explicit local allowlist, and a separate publication approval.",
    requirements: [
      "Show the Plan → Work → Evidence lifecycle and answer what completed, why, and what comes next.",
      "Contrast the reusable source goal with the specialized executed goal.",
      "Keep both canonical routes unlisted and noindexed with static Astro and zero client JavaScript."
    ],
    authority: [
      "Run-local implementation and canonical adapter integration were allowed.",
      "Goal 4 forbids staging, commit, push, provider inspection, deployment, and publication.",
      "A separate Goal 5 human approval is required before any rehearsal publication."
    ],
    tests: [
      "Run-local Astro build and public-safety scan passed.",
      "Canonical detail and output route builds and responsive checks passed.",
      "The child graph stops paused with the publication task next."
    ],
    checkpoint: {
      id: "test-2",
      title: "canonical Demo 2 routes accepted locally",
      status: "recorded"
    },
    sourceHash: "sha256:3fda685d8ab74c741e78143625978919bf22533ff51cd7cfce855ba9682176b1"
  },
  work: [
    {
      id: "spike-1",
      type: "spike",
      title: "Choose the Demo 2 audience and creative direction",
      status: "done",
      why: "Turn the open website brief into a clear durable-continuity position for AI-native builders."
    },
    {
      id: "task-1",
      type: "task",
      title: "Build the local Demo 2 Astro site",
      status: "done",
      why: "Express the selected position as a complete, differentiated, static landing page."
    },
    {
      id: "test-1",
      type: "test",
      title: "Verify the local candidate and public-safety contract",
      status: "done",
      why: "Prove the candidate is static, responsive, accessible, bounded, and safe before integration."
    },
    {
      id: "task-2",
      type: "task",
      title: "Integrate Demo 2 through the canonical static Astro adapter",
      status: "done",
      why: "Make the sanitized graph and distinct output available through the generalized local route contract."
    },
    {
      id: "test-2",
      type: "test",
      title: "Verify canonical detail and output routes locally",
      status: "done",
      why: "Prove the accepted local surfaces without crossing the separate publication gate."
    }
  ],
  evidence: [
    {
      label: "Deterministic fork",
      status: "recorded",
      detail:
        "The bootstrap receipt binds the canonical source snapshot to Demo 2 while preserving goal-1."
    },
    {
      label: "Graph validation",
      status: "pass",
      detail: "The specialized child graph validated with zero errors and zero unresolved warnings."
    },
    {
      label: "Local candidate",
      status: "pass",
      detail:
        "The run-local Astro output is 30,205 bytes with no client JavaScript, runtime scripts, remote fonts, forms, trackers, or raster assets."
    },
    {
      label: "Canonical routes",
      status: "pass",
      detail:
        "The canonical static build generated /demo/2/ and /demo/2/output/ as unlisted, noindexed routes with distinct output composition."
    },
    {
      label: "Next",
      status: "recorded",
      detail:
        "Request the separate Goal 5 rehearsal publication approval; task-3 remains untouched and no Git or provider action has occurred."
    }
  ],
  graphNodes: [
    {
      id: "goal-1",
      type: "goal",
      title: "Build and publish the Demo 2 durable-continuity landing page",
      status: "paused at publication",
      detail:
        "The goal retains the complete local-to-production chain while Goal 4 stops after canonical local proof."
    },
    {
      id: "spike-1",
      type: "spike",
      title: "Choose audience and creative direction",
      status: "done",
      detail: "Selected AI-native builders, durable continuity, and an Ocean Flow navigation chart."
    },
    {
      id: "task-1",
      type: "task",
      title: "Build the local static Astro candidate",
      status: "done",
      detail: "Implemented the complete run-local landing page with zero client JavaScript."
    },
    {
      id: "test-1",
      type: "test",
      title: "Verify local public-safety and accessibility",
      status: "done",
      detail: "Recorded build, responsive, semantic, contrast, budget, and static-output evidence."
    },
    {
      id: "task-2",
      type: "task",
      title: "Integrate through the canonical adapter",
      status: "done",
      detail: "Registered an unlisted Demo 2 record and a distinct static Astro output component."
    },
    {
      id: "test-2",
      type: "test",
      title: "Verify canonical routes locally",
      status: "done",
      detail: "Validated detail and output surfaces locally before any publication authority."
    },
    {
      id: "task-3",
      type: "task",
      title: "Publish the accepted Demo 2 candidate",
      status: "next",
      detail: "Requires separate human approval under Goal 5."
    },
    {
      id: "test-3",
      type: "test",
      title: "Verify the exact pushed SHA and live routes",
      status: "backlog",
      detail: "Cannot begin until an approved commit is pushed and existing deployments are inspected."
    }
  ],
  files: [
    {
      path: "BOOTSTRAP_RECEIPT.json",
      kind: "receipt",
      role: "Deterministic fork provenance",
      excerpt:
        "Source and initial Demo 2 goal snapshots share sha256:06397e… before specialization; operator files were materialized without overwrites."
    },
    {
      path: ".mdkg/work/goal-1-build-a-complete-differentiated-website-demo-from-the-canonical-mdkg-template.md",
      kind: "goal",
      role: "Specialized execution contract",
      excerpt:
        "The child goal binds the local build, canonical integration, separate publication approval, exact-SHA verification, and hard stop conditions."
    },
    {
      path: "artifacts/creative-direction.md",
      kind: "decision",
      role: "Public-safe creative direction",
      excerpt:
        "Position: Keep the plan when the agent changes. Visual metaphor: a bright Ocean Flow navigation chart connecting Plan, Work, and Evidence."
    },
    {
      path: "artifacts/local-validation.json",
      kind: "test receipt",
      role: "Run-local proof",
      excerpt:
        "One static page; 30,205 bytes; zero scripts, client directives, remote fonts, forms, trackers, secret assignments, or raster assets."
    },
    {
      path: "artifacts/canonical-route-validation.json",
      kind: "test receipt",
      role: "Canonical local proof",
      excerpt:
        "The unlisted, noindexed detail and output routes build and render locally with the publication task still untouched."
    }
  ],
  workflow: [
    "Fork the reusable source graph while preserving goal-1.",
    "Specialize audience, promise, requirements, authority, work chain, and tests.",
    "Build and validate the run-local static Astro candidate.",
    "Integrate sanitized graph evidence and a distinct output through the canonical adapter.",
    "Stop with publication task-3 next and request a separate Goal 5 approval."
  ],
  safety: [
    "The snapshot contains no credentials, cookies, private prompts, provider payloads, or unrelated context.",
    "The detail and output routes remain unlisted and noindexed.",
    "Both surfaces use static Astro with zero client JavaScript and no third-party runtime scripts.",
    "This local record does not imply a commit, push, deployment, public URL, or provider-side success.",
    "Publication requires a separate Goal 5 human approval."
  ],
  outputHighlights: [
    "durable-continuity hero promise",
    "Ocean Flow navigation chart",
    "Plan → Work → Evidence route",
    "source-versus-specialized goal proof",
    "what completed, why, and what comes next",
    "explicit separate publication gate"
  ]
};
