import crypto from "crypto";
import { UsageError } from "../util/errors";

export const INSTRUCTION_START = "<!-- mdkg:instructions:start -->";
export const INSTRUCTION_END = "<!-- mdkg:instructions:end -->";

export function instructionHash(text: string): string {
  return crypto.createHash("sha256").update(text).digest("hex");
}

/** Only the marked unit is managed; surrounding user bytes are never owned. */
export function instructionSection(text: string): { start: number; end: number; text: string } | undefined {
  const starts = text.split(INSTRUCTION_START).length - 1;
  const ends = text.split(INSTRUCTION_END).length - 1;
  if (!starts && !ends) return undefined;
  const start = text.indexOf(INSTRUCTION_START);
  const end = text.indexOf(INSTRUCTION_END) + INSTRUCTION_END.length;
  if (starts !== 1 || ends !== 1 || end <= start + INSTRUCTION_START.length) {
    throw new UsageError("malformed or duplicate mdkg instruction markers; preserve content and repair explicitly");
  }
  return { start, end, text: text.slice(start, end) };
}

export function instructionSeed(text: string): string {
  return instructionSection(text)?.text ?? `${INSTRUCTION_START}\n${text.trim()}\n${INSTRUCTION_END}`;
}

export function appendInstructions(existing: string, seed: string): string {
  if (instructionSection(existing)) return existing;
  const newline = existing.includes("\r\n") ? "\r\n" : "\n";
  const section = instructionSeed(seed).replace(/\r?\n/g, newline);
  const separator = existing.length === 0 ? "" : existing.endsWith("\n") ? newline : newline + newline;
  return existing + separator + section + newline;
}

export function replaceInstructions(existing: string, seed: string): string {
  const section = instructionSection(existing);
  if (!section) throw new UsageError("missing managed instruction section");
  const newline = section.text.includes("\r\n") ? "\r\n" : "\n";
  return existing.slice(0, section.start) + instructionSeed(seed).replace(/\r?\n/g, newline) + existing.slice(section.end);
}
