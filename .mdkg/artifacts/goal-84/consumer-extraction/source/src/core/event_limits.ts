export const DEFAULT_EVENT_VALIDATION_LIMITS = {
  max_file_bytes: 64 * 1024 * 1024,
  max_total_bytes: 128 * 1024 * 1024,
  max_line_bytes: 1024 * 1024,
  max_records: 1_000_000,
  max_lines: 2_000_000,
  max_errors: 1_000,
} as const;

export type EventValidationLimits = { -readonly [K in keyof typeof DEFAULT_EVENT_VALIDATION_LIMITS]: number };

export const MAX_EVENT_VALIDATION_LIMITS: EventValidationLimits = {
  max_file_bytes: 512 * 1024 * 1024,
  max_total_bytes: 512 * 1024 * 1024,
  max_line_bytes: 8 * 1024 * 1024,
  max_records: 5_000_000,
  max_lines: 10_000_000,
  max_errors: 10_000,
};

export function normalizeEventConfig(raw: unknown): { validation: EventValidationLimits } {
  const result: EventValidationLimits = { ...DEFAULT_EVENT_VALIDATION_LIMITS };
  if (raw === undefined) return { validation: result };
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("events must be an object");
  const validation = (raw as Record<string, unknown>).validation;
  if (validation === undefined) return { validation: result };
  if (!validation || typeof validation !== "object" || Array.isArray(validation)) throw new Error("events.validation must be an object");
  for (const [key, value] of Object.entries(validation)) {
    if (!Object.prototype.hasOwnProperty.call(result, key)) throw new Error(`unknown events.validation limit: ${key}`);
    const name = key as keyof EventValidationLimits;
    if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 1 || value > MAX_EVENT_VALIDATION_LIMITS[name]) {
      throw new Error(`events.validation.${key} must be a positive safe integer <= ${MAX_EVENT_VALIDATION_LIMITS[name]}`);
    }
    result[name] = value;
  }
  return { validation: result };
}
