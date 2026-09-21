import { observeGit } from "./git_observation";

const URL_PROTOCOLS = new Set(["http:", "https:", "ssh:", "git:", "file:", "ftp:", "ftps:"]);
const REDACTED = "<redacted remote descriptor>";
const HELPER = "<redacted remote helper descriptor>";

/** Display/provenance only: never return these descriptors to a Git transport. */
export function redactRemoteRef(value: string, opaqueHelper = false): string {
  // remote.<name>.vcs can interpret even a bare string as a helper payload.
  if (opaqueHelper) return HELPER;
  if (/[\x00-\x1f\x7f]/.test(value)) return REDACTED;
  if (/^[a-z]:[\\/]/i.test(value) || value.startsWith("\\\\")) return value;
  if (/^[^/\\:]+::/.test(value)) return HELPER;
  const scheme = /^([a-z][a-z0-9+.-]*:)\/\//i.exec(value);
  if (!scheme) {
    // Preserve ordinary SCP/local syntax, not malformed known URL schemes.
    const prefix = /^([a-z][a-z0-9+.-]*:)/i.exec(value)?.[1].toLowerCase();
    return value.includes("://") || (prefix && URL_PROTOCOLS.has(prefix)) ? REDACTED : value;
  }
  // Unknown transports invoke opaque remote helpers. Their payload is not
  // constrained by URL credential semantics, so even the path is withheld.
  if (!URL_PROTOCOLS.has(scheme[1].toLowerCase())) return HELPER;
  try {
    const parsed = new URL(value);
    if (!parsed.host && parsed.protocol !== "file:") return REDACTED;
    const authority = value.slice(scheme[0].length).split(/[\/\\?#]/, 1)[0];
    // WHATWG can reinterpret extra leading slashes as an authority. Never
    // retain userinfo when the authored and parsed authority boundaries differ.
    if ((parsed.username || parsed.password) && !authority.includes("@")) return REDACTED;
    // Drop all userinfo/query/fragment data, not only known secret key names.
    // Keep encoded path delimiters and the authored spelling of safe paths.
    return scheme[0] + authority.replace(/^.*@/, "<redacted>@") +
      value.slice(scheme[0].length + authority.length).split(/[?#]/, 1)[0];
  } catch {
    return REDACTED;
  }
}

export function remoteUsesOpaqueHelper(root: string, name: string): boolean {
  // Presence is enough to withhold an arbitrary helper payload. Never invoke
  // the helper or echo its configuration in diagnostics.
  return observeGit(root, ["config", "--get", `remote.${name}.vcs`], { allowedFailures: [1] }).status === 0;
}
