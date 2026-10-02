// Read-only custody admission for a reviewed local npm artifact. This is not
// an untrusted archive extractor or a substitute for source/security review.
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");
const { assertDirectoryChain, readRegularJsonFile, within } = require("./qualification-output");
const { assertSameArtifact, verifyArtifactFile, withVerifiedArtifact } = require("./qualification-artifact");

const digest = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const INPUT_ROOTS = ["src", "assets/init", "assets/skills", ".mdkg/templates", ".mdkg/skills", ".agents/skills", ".claude/skills"];
const INPUT_FILES = ["package.json", "package-lock.json", "tsconfig.json", "tsconfig.build.json",
  "README.md", "CLI_COMMAND_MATRIX.md", "CHANGELOG.md", "CONTRIBUTING.md", "LICENSE",
  "scripts/postinstall.js", "scripts/add-shebang.js", "scripts/copy-init-assets.js",
  "scripts/clean-build-output.js", "scripts/public-core-seed.js", "scripts/repository-skill-policy.js",
  "scripts/generate-command-contract.js", "scripts/cli_help_targets.js"];

function safeRelative(value) {
  if (typeof value !== "string" || !value || /[\\\x00-\x1f\x7f:*?\[\]{}]/.test(value) ||
      path.posix.isAbsolute(value) || value.split("/").some((part) => !part || part === "." || part === "..")) {
    throw new Error(`invalid candidate relative path: ${value}`);
  }
  return value;
}

function inventory(root, roots) {
  root = assertDirectoryChain(root);
  const files = new Map();
  function visit(relative) {
    relative = safeRelative(relative.replace(/\/$/, ""));
    const absolute = path.join(root, relative);
    assertDirectoryChain(path.dirname(absolute));
    const stat = fs.lstatSync(absolute);
    if (stat.isDirectory()) {
      for (const child of fs.readdirSync(absolute).sort()) visit(`${relative}/${child}`);
    } else if (stat.isFile() && stat.nlink === 1) {
      files.set(relative, { path: relative, sha256: digest(fs.readFileSync(absolute)), mode: stat.mode & 0o777 });
    } else throw new Error(`candidate input must be an independent regular file: ${relative}`);
  }
  for (const relative of roots) visit(relative);
  const sorted = [...files.values()].sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
  return { sha256: digest(JSON.stringify(sorted)), files: sorted };
}

function capturePackageInputs(root) {
  // Optional seed roots are part of identity if present; adding/removing one
  // changes the inventory. Never follow a link to decide an optional root.
  const roots = INPUT_ROOTS.filter((relative) => {
    try { fs.lstatSync(path.join(root, relative)); return true; }
    catch (error) { if (error.code === "ENOENT") return false; throw error; }
  });
  return inventory(root, [...roots, ...INPUT_FILES]);
}

function captureQualificationInputs(root) {
  // Qualification-only changes are independently bound, not part of the npm
  // payload identity. Overlapping build scripts legitimately bind both sets.
  return inventory(root, ["scripts", "tests", "tsconfig.test.json", ".github/workflows/release-readiness.yml"]);
}

function builtPayload(root) {
  const pkg = readRegularJsonFile(path.join(root, "package.json"));
  if (!Array.isArray(pkg.files) || pkg.files.some((entry) => typeof entry !== "string")) {
    throw new Error("candidate requires explicit package files allowlist");
  }
  const payload = inventory(root, [...pkg.files, "package.json", "README.md", "LICENSE"]);
  // npm normalizes read/write bits. Preserve executable identity, while the
  // tarball hash separately binds every actual archive byte and header mode.
  return payload.files.map((file) => ({ path: file.path, sha256: file.sha256, executable: Boolean(file.mode & 0o111) }));
}

function archivePayload(tarball, expectedHash) {
  return withVerifiedArtifact(tarball, expectedHash, () => {
    if (fs.statSync(tarball).size > 32 * 1024 * 1024) throw new Error("candidate archive exceeds qualification bound");
    const bytes = zlib.gunzipSync(fs.readFileSync(tarball), { maxOutputLength: 128 * 1024 * 1024 });
    const entries = new Map();
    let offset = 0, ended = false;
    const string = (buffer) => buffer.toString("utf8").replace(/\0.*$/s, "");
    const octal = (buffer) => {
      const value = string(buffer).trim();
      if (!/^[0-7]+$/.test(value)) throw new Error("unsupported candidate tar number");
      const number = Number.parseInt(value, 8);
      if (!Number.isSafeInteger(number)) throw new Error("candidate tar number exceeds safe range");
      return number;
    };
    while (offset + 512 <= bytes.length) {
      const header = bytes.subarray(offset, offset + 512);
      if (header.every((byte) => byte === 0)) {
        if (bytes.length - offset < 1024 || !bytes.subarray(offset).every((byte) => byte === 0)) {
          throw new Error("invalid candidate tar trailer");
        }
        ended = true; break;
      }
      let checksum = 0;
      for (let i = 0; i < 512; i++) checksum += i >= 148 && i < 156 ? 32 : header[i];
      if (checksum !== octal(header.subarray(148, 156))) throw new Error("candidate tar checksum mismatch");
      if (![0, 48].includes(header[156]) || string(header.subarray(257, 263)) !== "ustar") {
        throw new Error("candidate tar must contain plain regular USTAR files only");
      }
      const prefix = string(header.subarray(345, 500)), name = string(header.subarray(0, 100));
      const archiveName = `${prefix ? prefix + "/" : ""}${name}`;
      if (!archiveName.startsWith("package/")) throw new Error("candidate tar path is outside package");
      const relative = safeRelative(archiveName.slice(8));
      if (entries.has(relative)) throw new Error("duplicate candidate tar path");
      const size = octal(header.subarray(124, 136)), next = offset + 512 + Math.ceil(size / 512) * 512;
      if (next > bytes.length) throw new Error("truncated candidate tar payload");
      entries.set(relative, { path: relative, sha256: digest(bytes.subarray(offset + 512, offset + 512 + size)),
        executable: Boolean(octal(header.subarray(100, 108)) & 0o111) });
      offset = next;
    }
    if (!ended || entries.size === 0) throw new Error("incomplete candidate archive");
    return [...entries.values()].sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
  }).result;
}

function candidateInputs(root, tarball, expectedHash) {
  const payload = archivePayload(tarball, expectedHash);
  if (!same(payload, builtPayload(root))) throw new Error("retained package payload does not match current build");
  return { schema_version: 1, kind: "retained-release-candidate-inputs", version: readRegularJsonFile(path.join(root, "package.json")).version,
    artifact_sha256: expectedHash, package_inputs: capturePackageInputs(root), payload };
}

function retainedOptions(env = process.env) {
  const keys = ["MDKG_RELEASE_TARBALL", "MDKG_RELEASE_TARBALL_SHA256", "MDKG_RELEASE_INPUTS", "MDKG_RELEASE_INPUTS_SHA256"];
  if (!keys.some((key) => env[key] !== undefined)) return null;
  if (keys.some((key) => typeof env[key] !== "string" || !env[key]) ||
      !/^[a-f0-9]{64}$/.test(env[keys[1]]) || !/^[a-f0-9]{64}$/.test(env[keys[3]])) {
    throw new Error("retained candidate requires explicit tarball, inputs manifest and both SHA-256 identities");
  }
  return { tarball: path.resolve(env[keys[0]]), sha256: env[keys[1]], inputs: path.resolve(env[keys[2]]), inputsSha256: env[keys[3]] };
}

function admitRetainedCandidate(root, options, { verifyBuild = true, previous } = {}) {
  if (!options) throw new Error("retained candidate options required");
  const mutableOutputs = ["dist", "docs/dist", "docs/.astro", "mdkg-dev/dist", "mdkg-dev/.astro", "node_modules"];
  const mutableDirectories = mutableOutputs.flatMap(relative => {
    try {
      const stat = fs.lstatSync(path.resolve(root, relative));
      return stat.isDirectory() ? [{ dev: stat.dev, ino: stat.ino }] : [];
    } catch (error) { if (error.code === "ENOENT") return []; throw error; }
  });
  for (const file of [options.tarball, options.inputs]) {
    if (mutableOutputs.some((relative) => within(path.resolve(root, relative), path.resolve(file)))) {
      throw new Error("retained candidate or input manifest overlaps mutable build output");
    }
    // Lexical containment alone misses filesystem-equivalent spellings, such
    // as DIST on a case-insensitive volume. Compare existing ancestor objects.
    assertDirectoryChain(path.dirname(file));
    for (let directory = path.resolve(path.dirname(file)); ; directory = path.dirname(directory)) {
      const stat = fs.lstatSync(directory);
      if (mutableDirectories.some(entry => entry.dev === stat.dev && entry.ino === stat.ino)) {
        throw new Error("retained candidate or input manifest overlaps mutable build output");
      }
      if (directory === path.dirname(directory)) break;
    }
  }
  assertDirectoryChain(path.dirname(options.tarball));
  const artifact = verifyArtifactFile(options.tarball, options.sha256);
  const inputs = verifyArtifactFile(options.inputs, options.inputsSha256);
  if (previous) {
    assertSameArtifact(previous.artifact, artifact);
    assertSameArtifact(previous.inputs, inputs);
  }
  const manifest = readRegularJsonFile(options.inputs, 4 * 1024 * 1024);
  if (manifest.schema_version !== 1 || manifest.kind !== "retained-release-candidate-inputs" ||
      manifest.artifact_sha256 !== options.sha256 || manifest.version !== readRegularJsonFile(path.join(root, "package.json")).version ||
      !same(manifest.package_inputs, capturePackageInputs(root))) {
    throw new Error("retained candidate package-input identity mismatch");
  }
  const payload = archivePayload(options.tarball, options.sha256);
  if (!same(payload, manifest.payload) || (verifyBuild && !same(payload, builtPayload(root)))) {
    throw new Error("retained candidate payload identity mismatch");
  }
  assertSameArtifact(inputs, verifyArtifactFile(options.inputs, options.inputsSha256));
  assertSameArtifact(artifact, verifyArtifactFile(options.tarball, options.sha256));
  return { artifact, inputs, inputs_sha256: options.inputsSha256, package_inputs_sha256: manifest.package_inputs.sha256,
    payload_sha256: digest(JSON.stringify(payload)), payload_count: payload.length, repacked: false };
}

module.exports = { admitRetainedCandidate, archivePayload, builtPayload, candidateInputs, capturePackageInputs,
  captureQualificationInputs, retainedOptions };
