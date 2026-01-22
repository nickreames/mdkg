import fs from "fs";
import path from "path";
import { NotFoundError } from "../util/errors";

export type GuideCommandOptions = {
  root: string;
};

export function runGuideCommand(options: GuideCommandOptions): void {
  const guidePath = path.join(options.root, ".mdkg", "core", "guide.md");
  if (!fs.existsSync(guidePath)) {
    throw new NotFoundError(`guide not found: ${guidePath}`);
  }
  const content = fs.readFileSync(guidePath, "utf8");
  const trimmed = content.trimEnd();
  if (trimmed.length === 0) {
    console.log("");
    return;
  }
  console.log(trimmed);
}
