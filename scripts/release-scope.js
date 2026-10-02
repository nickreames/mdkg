// Repository-owned release profiles, not mdkg CLI/runtime policy.
function releaseScope(value = process.env.MDKG_RELEASE_SCOPE, fallback = "repository") {
  const scope = value ?? fallback;
  if (scope !== "package" && scope !== "repository") {
    throw new Error(`unsupported release scope: ${scope}`);
  }
  return scope;
}

function scopeForMode(mode, value = process.env.MDKG_RELEASE_SCOPE) {
  // Hosted modes retain their complete repository topology. Never let an
  // inherited package profile silently narrow a hosted shard or preparation.
  return mode === "prepublish" ? releaseScope(value, "package") : "repository";
}

module.exports = { releaseScope, scopeForMode };
