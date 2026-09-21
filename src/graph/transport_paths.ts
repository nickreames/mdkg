import path from "path";
import { ValidationError } from "../util/errors";

const key = (value: string) => value.normalize("NFC").toLowerCase();
function fail(message: string): never { throw new ValidationError(`transport path admission failed: ${message}`); }

// Graph transport never installs Git administration, even inside an otherwise
// owned graph root. Reject aliases instead of converting them into authority.
export function assertTransportPath(file: string): void {
  if (!file || file.includes("\\") || file.includes("\0") || path.posix.isAbsolute(file) || /^[a-z]:/i.test(file) ||
    file.split("/").some(part => !part || part === "." || part === "..")) fail(`expected an exact portable relative path: ${file}`);
  for (const part of file.split("/")) {
    // HFS-ignorable characters and Windows suffix/stream spellings cannot make
    // an administrative filename portable. This does not qualify Windows.
    const admin = key(part).replace(/[\u200c-\u200f\u202a-\u202e\u206a-\u206f\ufeff]/g, "").split(":")[0].replace(/[. ]+$/, "");
    if (admin === ".git" || /^git~[1-9]$/.test(admin)) fail(`Git administrative paths are not graph payloads: ${file}`);
  }
}

// Validate the complete inventory before creating a target or temporary tree.
// File/directory and case/normalization aliases must not fail halfway through
// extraction on a different filesystem from the producer's filesystem.
export function assertTransportInventory(files: Iterable<string>): void {
  const seen = new Map<string, { spelling: string; directory: boolean }>();
  for (const file of files) {
    assertTransportPath(file);
    const parts = file.split("/");
    for (let i = 1; i <= parts.length; i++) {
      const spelling = parts.slice(0, i).join("/"), directory = i < parts.length;
      const previous = seen.get(key(spelling));
      if (previous && (previous.spelling !== spelling || !previous.directory || !directory)) {
        fail(`ambiguous file or directory spelling: ${previous.spelling} and ${spelling}`);
      }
      seen.set(key(spelling), { spelling, directory });
    }
  }
}
