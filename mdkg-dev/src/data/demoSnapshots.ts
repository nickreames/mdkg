export type DemoGraphNode = {
  id: string;
  type: string;
  title: string;
  status: string;
  detail: string;
};

export type DemoFileSnapshot = {
  path: string;
  kind: string;
  role: string;
  excerpt: string;
};

export type DemoSnapshot = {
  id: string;
  title: string;
  summary: string;
  status: string;
  sourcePath: string;
  outputRoute: string;
  image: string;
  imageAlt: string;
  stack: string[];
  validation: string[];
  graphNodes: DemoGraphNode[];
  files: DemoFileSnapshot[];
  workflow: string[];
  safety: string[];
  outputHighlights: string[];
};

export const demoSnapshots: DemoSnapshot[] = [
  {
    id: "1",
    title: "Agent-ready website demo",
    summary:
      "A forked mdkg graph produced a local Astro plus React Islands website candidate with Ocean Flow design, local validation, and explicit preview boundaries.",
    status: "Accepted local proof",
    sourcePath: "examples/demo-runs/demo-001",
    outputRoute: "/demo/1/output/",
    image: "/demo-001/ocean-flow-map.svg",
    imageAlt:
      "Ocean Flow graph map showing goal, creative direction, Astro plus React, and local proof.",
    stack: ["mdkg graph fork", "Astro", "React Island", "Ocean Flow"],
    validation: [
      "mdkg validation passed with zero warnings in the demo run",
      "local Astro build passed",
      "Browser and Chrome desktop and mobile checks were recorded",
      "no-secret and public-claims review passed for the retained evidence"
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
      "Fork the canonical graph template into a run path.",
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
  }
];

export function getDemoSnapshot(id: string) {
  return demoSnapshots.find((demo) => demo.id === id);
}
