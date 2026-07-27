import type { DemoSnapshot } from "./types";

export const demo1: DemoSnapshot = {
  id: "1",
  title: "Agent-ready website demo",
  summary:
    "A historical mdkg run specialized a reusable website specification into an Ocean Flow candidate with local validation and explicit preview boundaries.",
  status: "Accepted local proof",
  sourcePath: "examples/demo-runs/demo-001",
  outputRoute: "/demo/1/output/",
  listed: true,
  noindex: false,
  outputComponent: "demo-1",
  image: "/demo-001/ocean-flow-map.svg",
  imageAlt:
    "Ocean Flow graph map showing goal, creative direction, Astro plus React, and local proof.",
  stack: ["Reusable goal", "Astro", "React Island", "Ocean Flow"],
  validation: [
    "mdkg validation passed with zero warnings in the demo run",
    "local Astro build passed",
    "Browser and Chrome desktop and mobile checks were recorded",
    "no-secret and public-claims review passed for the retained evidence"
  ],
  sourceGoal: {
    id: "goal-1",
    title: "Build a complete differentiated website demo from the canonical mdkg template",
    status: "reusable source",
    condition:
      "Build a complete local website from the reusable template, record creative direction and validation evidence, and stop before publication.",
    summary:
      "The reusable starting specification fixed the workflow and boundaries while leaving the audience, offer, structure, and visual direction open.",
    requirements: [
      "Choose an audience, offer, structure, and creative direction before implementation.",
      "Use the Ocean Flow design baseline and keep public claims source-backed.",
      "Build and validate a complete local website candidate."
    ],
    authority: [
      "Local graph, source, build, and browser validation only.",
      "No push, deployment, DNS, analytics, provider mutation, or publication."
    ],
    tests: [
      "Graph validation and first-node routing.",
      "Local build and responsive browser review.",
      "No-secret and public-claims checks."
    ],
    checkpoint: {
      id: "chk-1",
      title: "website demo template seed accepted",
      status: "recorded"
    },
    sourceHash: "sha256:fd50a8dd10dde457c8e1eb2e17966ac6457d6e0eaa82f3ca5efee8bd56ba9495"
  },
  executedGoal: {
    id: "goal-1",
    title: "Build the Ocean Flow website-demo candidate",
    status: "achieved",
    condition:
      "Produce the selected Ocean Flow Astro candidate, validate its focused island and public-safe evidence locally, and record a preview recommendation.",
    summary:
      "The executed specification narrowed the open brief into a concrete creative direction, implementation, local test record, and checkpoint.",
    requirements: [
      "Use the selected Ocean Flow map and product-engineering audience.",
      "Build the historical Astro candidate with one focused interactive proof.",
      "Retain only sanitized graph, file, build, and browser evidence."
    ],
    authority: [
      "Local implementation and validation were allowed.",
      "Publication and provider changes remained outside the run."
    ],
    tests: [
      "Graph validation passed with zero warnings.",
      "The Astro build and desktop/mobile browser checks passed.",
      "No-secret and public-claims review passed."
    ],
    checkpoint: {
      id: "chk-4",
      title: "demo-001 validation passed for optional preview",
      status: "recorded"
    },
    sourceHash: "sha256:7a4728a1cfcf383afc25dbbb91e5db385318ab90965768543807ac7e3d3f1ff8"
  },
  work: [
    {
      id: "spike-1",
      type: "spike",
      title: "Choose audience offer structure and creative direction",
      status: "done",
      why: "Turn an open-ended website brief into an implementation-ready Ocean Flow direction."
    },
    {
      id: "task-1",
      type: "task",
      title: "Build complete Astro React Islands website demo",
      status: "done",
      why: "Implement the selected historical demo composition and focused interactive proof."
    },
    {
      id: "test-1",
      type: "test",
      title: "Complete website demo validation and handoff contract",
      status: "done",
      why: "Decide from local build, browser, claims, and no-secret evidence whether the candidate could advance."
    }
  ],
  evidence: [
    {
      label: "Graph validation",
      status: "pass",
      detail: "The retained Demo 1 graph validated with zero warnings."
    },
    {
      label: "Local website build",
      status: "pass",
      detail: "The historical Astro candidate built locally from its preserved run."
    },
    {
      label: "Public-safety review",
      status: "pass",
      detail: "The retained snapshot excludes credentials, private prompts, and provider payloads."
    },
    {
      label: "Next",
      status: "recorded",
      detail: "The historical checkpoint recommended a separately authorized preview decision; it did not publish the candidate."
    }
  ],
  graphNodes: [
    {
      id: "goal-1",
      type: "goal",
      title: "Build a complete differentiated website demo from the canonical mdkg template",
      status: "achieved",
      detail: "The run starts from one selected goal and closes with local proof before any optional preview deployment."
    },
    {
      id: "spike-1",
      type: "spike",
      title: "Choose audience offer structure and creative direction",
      status: "done",
      detail: "Creative direction is summarized into durable graph state instead of retained as private prompt text."
    },
    {
      id: "task-1",
      type: "task",
      title: "Build complete Astro React Islands website demo",
      status: "done",
      detail: "The source output is a differentiated static Astro site with one focused React island."
    },
    {
      id: "test-1",
      type: "test",
      title: "Complete website demo validation and handoff contract",
      status: "done",
      detail: "Build, rendering, public-claims, and no-secret evidence decide whether the run should advance."
    },
    {
      id: "chk-4",
      type: "checkpoint",
      title: "demo-001 validation passed for optional preview",
      status: "recorded",
      detail: "The checkpoint records local proof before the run is considered for an optional preview."
    }
  ],
  files: [
    {
      path: "DEMO_RUN_RECEIPT.md",
      kind: "receipt",
      role: "Fork and validation provenance",
      excerpt:
        "Run id: demo-001\nSource template: examples/website-demo-template/\nTarget path: examples/demo-runs/demo-001/\nValidation: ok true, zero warnings."
    },
    {
      path: ".mdkg/work/goal-1-build-a-complete-differentiated-website-demo-from-the-canonical-mdkg-template.md",
      kind: "goal",
      role: "Run contract",
      excerpt:
        "A complete, local, differentiated Astro plus React Islands website demo is built from this template, follows Ocean Flow, records creative direction and validation evidence."
    },
    {
      path: ".mdkg/work/chk-4-demo-001-validation-passed-and-preview-approval-recommended.md",
      kind: "checkpoint",
      role: "Closeout evidence",
      excerpt:
        "The generated site builds locally, validates in mdkg, renders cleanly in Browser and Chrome desktop/mobile captures, and is ready for optional preview deployment."
    },
    {
      path: "src/pages/index.astro",
      kind: "source",
      role: "Generated site shell",
      excerpt:
        "The page describes mdkg graph, pack, validation, and preview boundaries without inventing production claims."
    },
    {
      path: "src/components/GoalRunConsole.tsx",
      kind: "source",
      role: "Focused React Island",
      excerpt:
        "A small island shows the selected stage, command, node, and evidence posture without turning the whole page into a client app."
    }
  ],
  workflow: [
    "Start from the reusable website specification.",
    "Select one goal and pack the first work node.",
    "Shape the creative direction with Ocean Flow as the baseline.",
    "Build the Astro site locally with a focused React island.",
    "Validate locally before any optional preview deployment."
  ],
  safety: [
    "No credentials, cookies, private prompts, provider data, or private artifacts are included.",
    "The public snapshot is intentionally bounded to selected graph, file, and output evidence.",
    "The output route is noindexed as a preview surface even though the demo detail page is public.",
    "The snapshot does not imply deployment, DNS, publishing, analytics, or provider-side changes."
  ],
  outputHighlights: [
    "Ocean Flow visual map",
    "sticky local demo navigation",
    "structured workflow cards",
    "focused stage console",
    "public-safety closeout section"
  ]
};
