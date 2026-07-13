import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  loadPublicReleaseProjection,
  projectPublicRelease,
  publicReleasePaths,
  validatePublicReleaseManifest,
} from "../release/public-release.mjs";

const canonicalManifest = {
  schema_version: 1,
  release_id: "mdkg-v0.5.0-loops",
  target_version: "0.5.0",
  state: "published",
  qualifier: "Pre-v1 public alpha",
};
const draftManifest = { ...canonicalManifest, state: "draft" };

function sha256(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

test("canonical manifest is strict and published", () => {
  const before = sha256(publicReleasePaths.manifest);
  const projection = loadPublicReleaseProjection({ env: {} });
  const after = sha256(publicReleasePaths.manifest);

  assert.deepEqual(projection.manifest, canonicalManifest);
  assert.equal(projection.package_version, "0.5.0");
  assert.equal(projection.published, true);
  assert.equal(projection.preview_visible, false);
  assert.equal(projection.visible, true);
  assert.equal(projection.indexable, true);
  assert.equal(projection.site_noindex, false);
  assert.equal(after, before);
});

test("manifest validation rejects missing, unknown, and malformed values", () => {
  assert.deepEqual(validatePublicReleaseManifest(canonicalManifest), canonicalManifest);

  const invalidManifests = [
    null,
    [],
    { ...canonicalManifest, schema_version: 2 },
    { ...canonicalManifest, release_id: "MDKG 0.5.0" },
    { ...canonicalManifest, target_version: "v0.5" },
    { ...canonicalManifest, state: "active" },
    { ...canonicalManifest, qualifier: "" },
    { ...canonicalManifest, unexpected: true },
    Object.fromEntries(Object.entries(canonicalManifest).filter(([key]) => key !== "state")),
  ];

  for (const manifest of invalidManifests) {
    assert.throws(() => validatePublicReleaseManifest(manifest), /Invalid public release configuration/);
  }
});

test("local release preview is visible but never indexable", () => {
  const projection = projectPublicRelease({
    manifest: draftManifest,
    packageVersion: "0.4.2",
    env: { PUBLIC_MDKG_RELEASE_PREVIEW: "1" },
  });

  assert.equal(projection.preview_visible, true);
  assert.equal(projection.visible, true);
  assert.equal(projection.indexable, false);
  assert.equal(projection.site_noindex, true);
});

test("draft release preview fails closed in Vercel production", () => {
  assert.throws(
    () => projectPublicRelease({
      manifest: draftManifest,
      packageVersion: "0.4.2",
      env: { PUBLIC_MDKG_RELEASE_PREVIEW: "1", VERCEL_ENV: "production" },
    }),
    /cannot expose a draft release in Vercel production/,
  );
});

test("published release requires package version parity", () => {
  const projection = projectPublicRelease({
    manifest: canonicalManifest,
    packageVersion: "0.5.0",
    env: {},
  });

  assert.equal(projection.published, true);
  assert.equal(projection.visible, true);
  assert.equal(projection.indexable, true);
  assert.equal(projection.site_noindex, false);
  assert.throws(
    () => projectPublicRelease({ manifest: canonicalManifest, packageVersion: "0.4.2", env: {} }),
    /targets 0\.5\.0, but package\.json is 0\.4\.2/,
  );
});

test("deployment previews retain site-wide noindex behavior", () => {
  const projection = projectPublicRelease({
    manifest: canonicalManifest,
    packageVersion: "0.5.0",
    env: { VERCEL_ENV: "preview" },
  });

  assert.equal(projection.visible, true);
  assert.equal(projection.indexable, true);
  assert.equal(projection.site_noindex, true);
});

test("release preview flag does not de-index a published release", () => {
  const projection = projectPublicRelease({
    manifest: canonicalManifest,
    packageVersion: "0.5.0",
    env: { PUBLIC_MDKG_RELEASE_PREVIEW: "1" },
  });

  assert.equal(projection.published, true);
  assert.equal(projection.preview_visible, false);
  assert.equal(projection.visible, true);
  assert.equal(projection.indexable, true);
  assert.equal(projection.site_noindex, false);
});

test("preview flag accepts only explicit binary values", () => {
  assert.throws(
    () => projectPublicRelease({
      manifest: draftManifest,
      packageVersion: "0.4.2",
      env: { PUBLIC_MDKG_RELEASE_PREVIEW: "true" },
    }),
    /must be unset, 0, or 1/,
  );
});

test("loader reports malformed external fixtures without mutating them", () => {
  const root = mkdtempSync(join(tmpdir(), "mdkg-public-release-"));
  const manifestPath = join(root, "release.json");
  const packagePath = join(root, "package.json");
  writeFileSync(manifestPath, "{ not json\n", "utf8");
  writeFileSync(packagePath, JSON.stringify({ version: "0.4.2" }), "utf8");
  const before = readFileSync(manifestPath, "utf8");

  try {
    assert.throws(
      () => loadPublicReleaseProjection({ manifestPath, packagePath, env: {} }),
      /release manifest is not valid JSON/,
    );
    assert.equal(readFileSync(manifestPath, "utf8"), before);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
