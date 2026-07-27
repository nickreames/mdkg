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

export type DemoGoalSnapshot = {
  id: string;
  title: string;
  status: string;
  condition: string;
  summary: string;
  requirements: string[];
  authority: string[];
  tests: string[];
  checkpoint: {
    id: string;
    title: string;
    status: string;
  };
  sourceHash: `sha256:${string}`;
};

export type DemoWorkSnapshot = {
  id: string;
  type: string;
  title: string;
  status: string;
  why: string;
};

export type DemoEvidenceSnapshot = {
  label: string;
  status: "pass" | "recorded" | "pending";
  detail: string;
};

export type DemoOutputComponentKey = "demo-1" | "demo-2" | "demo-3";

export type DemoSnapshot = {
  id: string;
  title: string;
  summary: string;
  status: string;
  sourcePath: string;
  outputRoute: string;
  listed: boolean;
  noindex: boolean;
  outputComponent: DemoOutputComponentKey;
  image: string;
  imageAlt: string;
  stack: string[];
  validation: string[];
  sourceGoal: DemoGoalSnapshot;
  executedGoal: DemoGoalSnapshot;
  work: DemoWorkSnapshot[];
  evidence: DemoEvidenceSnapshot[];
  graphNodes: DemoGraphNode[];
  files: DemoFileSnapshot[];
  workflow: string[];
  safety: string[];
  outputHighlights: string[];
};

export type DemoRouteInventory = {
  id: string;
  detailRoute: string;
  outputRoute: string;
  listed: boolean;
  noindex: boolean;
};
