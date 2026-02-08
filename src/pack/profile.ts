import { PackBodyMode, PackNode, PackProfile, PackResult } from "./types";

export type ResolvePackProfileInput = {
  profile?: string;
  concise?: boolean;
  stripCode?: boolean;
  maxCodeLines?: number;
};

export type ResolvedPackProfile = {
  profile: PackProfile;
  bodyMode: PackBodyMode;
  stripCode: boolean;
  maxCodeLines?: number;
  summaryMaxLines: number;
};

export type ShapePackOptions = {
  resolved: ResolvedPackProfile;
  templateHeadingMap: Record<string, string[]>;
};

export type PackProfileCatalogEntry = {
  profile: PackProfile;
  bodyMode: PackBodyMode;
  description: string;
  defaults: string[];
};

const PACK_PROFILE_CATALOG: PackProfileCatalogEntry[] = [
  {
    profile: "standard",
    bodyMode: "full",
    description: "Keep full node bodies (current default behavior).",
    defaults: [],
  },
  {
    profile: "concise",
    bodyMode: "summary",
    description: "Use summary-first excerpts for each node body.",
    defaults: ["strip_code=true"],
  },
  {
    profile: "headers",
    bodyMode: "none",
    description: "Frontmatter/metadata only; remove all node body content.",
    defaults: [],
  },
];

const CODE_FENCE_RE = /^(```|~~~)/;

function normalizeHeading(value: string): string {
  return value.trim().toLowerCase();
}

function removeCodeBlocks(body: string): string {
  const lines = body.split(/\r?\n/);
  const result: string[] = [];
  let inFence = false;
  for (const line of lines) {
    if (CODE_FENCE_RE.test(line.trimStart())) {
      inFence = !inFence;
      if (!inFence) {
        result.push("[code block omitted]");
      }
      continue;
    }
    if (!inFence) {
      result.push(line);
    }
  }
  return result.join("\n");
}

function capCodeBlocks(body: string, maxCodeLines: number): string {
  const lines = body.split(/\r?\n/);
  const result: string[] = [];
  let inFence = false;
  let kept = 0;
  let truncated = false;
  for (const line of lines) {
    if (CODE_FENCE_RE.test(line.trimStart())) {
      if (inFence && truncated) {
        result.push("[code lines truncated]");
      }
      inFence = !inFence;
      kept = 0;
      truncated = false;
      result.push(line);
      continue;
    }
    if (!inFence) {
      result.push(line);
      continue;
    }
    if (kept < maxCodeLines) {
      result.push(line);
      kept += 1;
      continue;
    }
    truncated = true;
  }
  if (inFence && truncated) {
    result.push("[code lines truncated]");
  }
  return result.join("\n");
}

function applyCodeTransform(
  body: string,
  stripCode: boolean,
  maxCodeLines: number | undefined
): string {
  if (body.length === 0) {
    return body;
  }
  if (stripCode) {
    return removeCodeBlocks(body);
  }
  if (maxCodeLines !== undefined) {
    return capCodeBlocks(body, maxCodeLines);
  }
  return body;
}

type Section = {
  heading?: string;
  headingLine?: string;
  lines: string[];
};

function splitSections(body: string): Section[] {
  const lines = body.split(/\r?\n/);
  const sections: Section[] = [{ lines: [] }];
  let current = sections[0];
  let inFence = false;

  for (const line of lines) {
    const trimmed = line.trimStart();
    if (CODE_FENCE_RE.test(trimmed)) {
      inFence = !inFence;
      current.lines.push(line);
      continue;
    }
    if (!inFence) {
      const match = /^#+\s+(.*)$/.exec(line);
      if (match) {
        current = {
          heading: normalizeHeading(match[1] ?? ""),
          headingLine: line,
          lines: [],
        };
        sections.push(current);
        continue;
      }
    }
    current.lines.push(line);
  }

  return sections;
}

function firstNonEmptyLines(lines: string[], maxLines: number): string[] {
  const result: string[] = [];
  for (const line of lines) {
    if (line.trim().length === 0) {
      continue;
    }
    result.push(line);
    if (result.length >= maxLines) {
      break;
    }
  }
  return result;
}

function extractSummary(
  body: string,
  preferredHeadings: string[],
  summaryMaxLines: number
): string {
  if (body.trim().length === 0) {
    return "";
  }
  const sections = splitSections(body);
  for (const heading of preferredHeadings) {
    const section = sections.find((candidate) => candidate.heading === heading);
    if (!section) {
      continue;
    }
    const excerpt = firstNonEmptyLines(section.lines, summaryMaxLines);
    if (excerpt.length === 0) {
      continue;
    }
    const summaryLines = section.headingLine ? [section.headingLine, ...excerpt] : excerpt;
    return summaryLines.join("\n").trimEnd();
  }

  const fallback = firstNonEmptyLines(body.split(/\r?\n/), summaryMaxLines);
  return fallback.join("\n").trimEnd();
}

function shapeNodeBody(node: PackNode, options: ShapePackOptions): string {
  const { resolved, templateHeadingMap } = options;
  let shaped = node.body;

  if (resolved.bodyMode === "none") {
    shaped = "";
  } else if (resolved.bodyMode === "summary") {
    const preferred = templateHeadingMap[node.type] ?? [];
    shaped = extractSummary(node.body, preferred, resolved.summaryMaxLines);
  }

  shaped = applyCodeTransform(shaped, resolved.stripCode, resolved.maxCodeLines);
  return shaped.trimEnd();
}

export function listPackProfiles(): PackProfileCatalogEntry[] {
  return PACK_PROFILE_CATALOG.map((entry) => ({
    profile: entry.profile,
    bodyMode: entry.bodyMode,
    description: entry.description,
    defaults: [...entry.defaults],
  }));
}

export function resolvePackProfile(input: ResolvePackProfileInput): ResolvedPackProfile {
  if (input.maxCodeLines !== undefined && (!Number.isInteger(input.maxCodeLines) || input.maxCodeLines < 0)) {
    throw new Error("--max-code-lines must be a non-negative integer");
  }

  let profileRaw = input.profile;
  if (input.concise) {
    if (profileRaw && profileRaw.toLowerCase() !== "concise") {
      throw new Error("--concise conflicts with --pack-profile");
    }
    profileRaw = "concise";
  }

  const normalized = (profileRaw ?? "standard").toLowerCase();
  if (normalized !== "standard" && normalized !== "concise" && normalized !== "headers") {
    throw new Error("--pack-profile must be one of standard, concise, headers");
  }
  const profile = normalized as PackProfile;

  let bodyMode: PackBodyMode = "full";
  let defaultStripCode = false;
  if (profile === "concise") {
    bodyMode = "summary";
    defaultStripCode = true;
  } else if (profile === "headers") {
    bodyMode = "none";
  }

  return {
    profile,
    bodyMode,
    stripCode: input.stripCode || defaultStripCode,
    maxCodeLines: input.maxCodeLines,
    summaryMaxLines: 12,
  };
}

export function shapePackBodies(pack: PackResult, options: ShapePackOptions): PackResult {
  const nodes = pack.nodes.map((node) => ({
    ...node,
    body: shapeNodeBody(node, options),
  }));
  return {
    meta: {
      ...pack.meta,
      node_count: nodes.length,
      profile: options.resolved.profile,
      body_mode: options.resolved.bodyMode,
    },
    nodes,
  };
}
