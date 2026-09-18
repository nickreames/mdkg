import path from "path";
import { Config } from "../core/config";
import { normalizeEventConfig } from "../core/event_limits";
import { containedPathExists, forEachContainedFileChunk } from "../core/filesystem_authority";
import { workspaceDocumentRelativePath } from "../core/workspace_path";

class EventValidationLimit extends Error {}

export function validateEventsJsonl(root: string, config: Config, errors: string[], graphBytes = 0): void {
  const limits = normalizeEventConfig(config.events).validation;
  let bytes = 0, lines = 0, records = 0, diagnostics = 0;
  const addError = (message: string) => {
    if (diagnostics >= limits.max_errors) throw new EventValidationLimit(`events.validation.max_errors exceeded (${limits.max_errors}); validation incomplete`);
    errors.push(message); diagnostics += 1;
  };
  try {
    for (const [alias, workspace] of Object.entries(config.workspaces)) {
      if (!workspace.enabled) continue;
      const relativePath = workspaceDocumentRelativePath(workspace.path, workspace.mdkg_dir, "work", "events", "events.jsonl");
      const eventsPath = path.resolve(root, relativePath);
      const authority = { root, relativePath };
      const budgets = [
        { name: "events.validation.max_file_bytes", remaining: limits.max_file_bytes },
        { name: "events.validation.max_total_bytes", remaining: limits.max_total_bytes - bytes },
        { name: "index.limits.max_total_bytes shared graph/event budget", remaining: config.index.limits.max_total_bytes - graphBytes - bytes },
      ].sort((a, b) => a.remaining - b.remaining);
      let localLine = 0;
      const parseLine = (content: Buffer) => {
        localLine += 1; lines += 1;
        if (lines > limits.max_lines) throw new EventValidationLimit(`events.validation.max_lines exceeded (${limits.max_lines})`);
        const raw = content.toString("utf8").trim();
        if (!raw) return;
        records += 1;
        if (records > limits.max_records) throw new EventValidationLimit(`events.validation.max_records exceeded (${limits.max_records})`);
        const label = `${eventsPath}:${localLine}`;
        let parsed: unknown;
        try { parsed = JSON.parse(raw); }
        catch { addError(`${label}: invalid JSON`); return; }
        if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
          addError(`${label}: event must be a JSON object`); return;
        }
        const event = parsed as Record<string, unknown>;
        for (const key of ["ts", "run_id", "workspace", "agent", "kind", "status"]) {
          const value = event[key];
          if (typeof value !== "string" || value.trim().length === 0) addError(`${label}: ${key} is required and must be a non-empty string`);
        }
        if (!Array.isArray(event.refs)) addError(`${label}: refs is required and must be a list`);
        if (!Array.isArray(event.artifacts)) addError(`${label}: artifacts is required and must be a list`);
        if (typeof event.notes !== "string") addError(`${label}: notes is required and must be a string`);
        if (typeof event.workspace === "string" && event.workspace !== alias) addError(`${label}: workspace must match ${alias}`);
      };
      try {
        if (!containedPathExists(authority)) continue;
        let parts: Buffer[] = [], lineBytes = 0;
        forEachContainedFileChunk({ ...authority, maxBytes: Math.max(0, budgets[0].remaining) }, (chunk) => {
          bytes += chunk.length;
          let offset = 0;
          while (offset < chunk.length) {
            const newline = chunk.indexOf(10, offset);
            const end = newline === -1 ? chunk.length : newline;
            const part = chunk.subarray(offset, end);
            lineBytes += part.length;
            if (lineBytes > limits.max_line_bytes) throw new EventValidationLimit(`events.validation.max_line_bytes exceeded (${limits.max_line_bytes}) at ${eventsPath}:${localLine + 1}`);
            parts.push(part);
            if (newline !== -1) { parseLine(Buffer.concat(parts, lineBytes)); parts = []; lineBytes = 0; }
            offset = newline === -1 ? end : end + 1;
          }
        });
        if (lineBytes > 0) parseLine(Buffer.concat(parts, lineBytes));
      } catch (error) {
        if (error instanceof EventValidationLimit) throw error;
        addError(`${eventsPath}: event read failed (${budgets[0].name}): ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  } catch (error) {
    if (!(error instanceof EventValidationLimit)) throw error;
    errors.push(error.message);
  }
}
