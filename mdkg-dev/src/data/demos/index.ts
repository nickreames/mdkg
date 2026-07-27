import { demo1 } from "./demo-1";
import type { DemoRouteInventory, DemoSnapshot } from "./types";

const records = [demo1] satisfies DemoSnapshot[];

function assertDemoRegistry(items: readonly DemoSnapshot[]) {
  const ids = new Set<string>();
  const forbiddenKeys = /^(rawPrompt|rawPrompts|credentials|tokens|cookies|providerPayload|providerPayloads|privateContext)$/i;

  const assertPublicSafeShape = (value: unknown, path: string) => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => assertPublicSafeShape(item, `${path}[${index}]`));
      return;
    }
    if (!value || typeof value !== "object") {
      return;
    }
    for (const [key, item] of Object.entries(value)) {
      if (forbiddenKeys.test(key)) {
        throw new Error(`Demo record contains forbidden field: ${path}.${key}`);
      }
      assertPublicSafeShape(item, `${path}.${key}`);
    }
  };

  for (const demo of items) {
    if (!/^[1-9]\d*$/.test(demo.id)) {
      throw new Error(`Demo id must be a positive integer string: ${demo.id || "<missing>"}`);
    }
    if (ids.has(demo.id)) {
      throw new Error(`Duplicate demo id: ${demo.id}`);
    }
    ids.add(demo.id);

    const expectedOutputRoute = `/demo/${demo.id}/output/`;
    if (demo.outputRoute !== expectedOutputRoute) {
      throw new Error(`Demo ${demo.id} output route must be ${expectedOutputRoute}`);
    }
    if (!demo.title || !demo.summary || !demo.sourcePath || !demo.outputComponent) {
      throw new Error(`Demo ${demo.id} is missing required record data`);
    }
    for (const [label, goal] of [
      ["sourceGoal", demo.sourceGoal],
      ["executedGoal", demo.executedGoal]
    ] as const) {
      if (
        !goal.id ||
        !goal.title ||
        !goal.condition ||
        !goal.summary ||
        goal.requirements.length === 0 ||
        goal.authority.length === 0 ||
        goal.tests.length === 0 ||
        !goal.checkpoint.id ||
        !goal.checkpoint.title ||
        !/^sha256:[a-f0-9]{64}$/.test(goal.sourceHash)
      ) {
        throw new Error(`Demo ${demo.id} has incomplete ${label} provenance`);
      }
    }
    if (demo.sourceGoal.sourceHash === demo.executedGoal.sourceHash) {
      throw new Error(`Demo ${demo.id} source and executed goal provenance must be distinct`);
    }
    if (demo.work.length === 0 || demo.evidence.length === 0) {
      throw new Error(`Demo ${demo.id} is missing work or evidence`);
    }
    if (demo.evidence.some((item) => item.status === "pending")) {
      throw new Error(`Demo ${demo.id} contains unsupported pending public evidence`);
    }
    assertPublicSafeShape(demo, `demo[${demo.id}]`);
  }
}

assertDemoRegistry(records);

export const demoSnapshots: readonly DemoSnapshot[] = Object.freeze(records);
export const listedDemos = Object.freeze(demoSnapshots.filter((demo) => demo.listed));
export const indexableDemos = Object.freeze(demoSnapshots.filter((demo) => !demo.noindex));

export const demoRouteInventory: readonly DemoRouteInventory[] = Object.freeze(
  demoSnapshots.map((demo) => ({
    id: demo.id,
    detailRoute: `/demo/${demo.id}/`,
    outputRoute: demo.outputRoute,
    listed: demo.listed,
    noindex: demo.noindex
  }))
);

export function getDemoSnapshot(id: string) {
  return demoSnapshots.find((demo) => demo.id === id);
}

export { assertDemoRegistry };
export type {
  DemoEvidenceSnapshot,
  DemoFileSnapshot,
  DemoGoalSnapshot,
  DemoGraphNode,
  DemoOutputComponentKey,
  DemoRouteInventory,
  DemoSnapshot,
  DemoWorkSnapshot
} from "./types";
