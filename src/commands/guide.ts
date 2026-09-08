import path from "path";
import { NotFoundError } from "../util/errors";
import { containedPathExists, readContainedFile } from "../core/filesystem_authority";

export const DEFAULT_GUIDE_MAX_BYTES = 8 * 1024 * 1024;

export type GuideCommandOptions = {
  root: string;
};

export function runGuideCommand(options: GuideCommandOptions): void {
  const guidePath = path.join(options.root, ".mdkg", "core", "guide.md");
  const input = { root: options.root, relativePath: ".mdkg/core/guide.md", maxBytes: DEFAULT_GUIDE_MAX_BYTES };
  if (!containedPathExists(input)) {
    throw new NotFoundError(`guide not found: ${guidePath}`);
  }
  const content = readContainedFile(input, "utf8");
  const trimmed = content.trimEnd();
  if (trimmed.length === 0) {
    console.log("");
    return;
  }
  console.log(trimmed);
}
