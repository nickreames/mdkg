import { Config, DEFAULT_INDEX_LIMITS } from "../core/config";

// Repository schema input uses existing graph budgets, capped at their default
// safety envelope. Trusted bundled fallback bytes are package assets, not local
// graph input. Direct legacy callers without normalized limits retain defaults.
export function localTemplateLimits(config: Config): Config["index"]["limits"] {
  const result = { ...DEFAULT_INDEX_LIMITS } as Config["index"]["limits"];
  for (const key of Object.keys(result) as (keyof typeof result)[]) {
    const value = config.index.limits?.[key] ?? result[key];
    if (!Number.isSafeInteger(value) || value < 1) throw new Error(`invalid template index.limits.${key}`);
    result[key] = Math.min(value, DEFAULT_INDEX_LIMITS[key]);
  }
  return result;
}
