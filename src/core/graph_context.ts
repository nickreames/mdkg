import { AsyncLocalStorage } from "async_hooks";
import type { WorkingHost } from "./working_host";

export type GraphVisibility = "private" | "internal" | "public";
/** Existing handlers receive root, never a translated/persisted virtual path. */
export type GraphContext = Readonly<{
  host_root: string;
  root: string;
  name?: string;
  binding?: Readonly<WorkingHost>;
  visibility?: GraphVisibility;
}>;
const context = new AsyncLocalStorage<GraphContext>();
export function withGraphContext<T>(selected: GraphContext, invoke: () => T): T {
  return context.run(selected, invoke);
}
export function currentGraphContext(): GraphContext | undefined { return context.getStore(); }

export function graphNameError(name: string): string | undefined {
  if (name === "default") return undefined;
  if (!/^[a-z][a-z0-9-]{0,47}$/.test(name) || name === "root" ||
      /^[0-9a-f]{8}-[0-9a-f-]{27}$/.test(name))
    return "--graph requires an exact lowercase name (1–48 characters); numeric, path and UUID selectors are unsupported";
  return undefined;
}
