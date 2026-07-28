import Demo1Output from "./Demo1Output.astro";
import Demo2Output from "./Demo2Output.astro";
import type { DemoOutputComponentKey, DemoSnapshot } from "../../data/demos";

export const outputComponentRegistry = {
  "demo-1": Demo1Output,
  "demo-2": Demo2Output
} as const;

export type RegisteredOutputComponentKey = keyof typeof outputComponentRegistry;

export function getDemoOutputComponent(key: DemoOutputComponentKey) {
  const component = outputComponentRegistry[key as RegisteredOutputComponentKey];
  if (!component) {
    throw new Error(`Missing static Astro output component registration: ${key}`);
  }
  return component;
}

export function assertOutputRegistry(demos: readonly DemoSnapshot[]) {
  const registeredKeys = Object.keys(outputComponentRegistry);
  if (new Set(registeredKeys).size !== registeredKeys.length) {
    throw new Error("Duplicate output component registration");
  }

  for (const demo of demos) {
    getDemoOutputComponent(demo.outputComponent);
  }
}
