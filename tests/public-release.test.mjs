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
import {
  currentRelease,
  projectCurrentRelease,
} from "../docs/src/data/currentRelease.mjs";

const canonicalManifest = JSON.parse(readFileSync(publicReleasePaths.manifest, "utf8"));
const canonicalPackage = JSON.parse(readFileSync(publicReleasePaths.package, "utf8"));
const canonicalReleaseNotes = JSON.parse(
  readFileSync(new URL("../docs/_generated/release-notes.json", import.meta.url), "utf8"),
);
const draftManifest = { ...canonicalManifest, state: "draft" };

function canonicalProjection(overrides = {}) {
  return {
    manifest: canonicalManifest,
    package_version: canonicalPackage.version,
    published: true,
    preview_visible: false,
    visible: true,
    ...overrides,
  };
}

function sha256(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

test("canonical manifest is strict and published", () => {
  const before = sha256(publicReleasePaths.manifest);
  const projection = loadPublicReleaseProjection({ env: {} });
  const after = sha256(publicReleasePaths.manifest);

  assert.deepEqual(projection.manifest, canonicalManifest);
  assert.equal(projection.package_version, canonicalPackage.version);
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
    { ...canonicalManifest, release_id: "INVALID RELEASE ID" },
    { ...canonicalManifest, target_version: "invalid-version" },
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
    packageVersion: canonicalPackage.version,
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
      packageVersion: canonicalPackage.version,
      env: { PUBLIC_MDKG_RELEASE_PREVIEW: "1", VERCEL_ENV: "production" },
    }),
    /cannot expose a draft release in Vercel production/,
  );
});

test("published release requires package version parity", () => {
  const projection = projectPublicRelease({
    manifest: canonicalManifest,
    packageVersion: canonicalPackage.version,
    env: {},
  });

  assert.equal(projection.published, true);
  assert.equal(projection.visible, true);
  assert.equal(projection.indexable, true);
  assert.equal(projection.site_noindex, false);
  assert.throws(
    () => projectPublicRelease({ manifest: canonicalManifest, packageVersion: "mismatch", env: {} }),
    /package version must be a valid semantic version/,
  );
});

test("deployment previews retain site-wide noindex behavior", () => {
  const projection = projectPublicRelease({
    manifest: canonicalManifest,
    packageVersion: canonicalPackage.version,
    env: { VERCEL_ENV: "preview" },
  });

  assert.equal(projection.visible, true);
  assert.equal(projection.indexable, true);
  assert.equal(projection.site_noindex, true);
});

test("release preview flag does not de-index a published release", () => {
  const projection = projectPublicRelease({
    manifest: canonicalManifest,
    packageVersion: canonicalPackage.version,
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
      packageVersion: canonicalPackage.version,
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
  writeFileSync(packagePath, JSON.stringify({ version: canonicalPackage.version }), "utf8");
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

test("current release projection selects exact published release facts", () => {
  const projected = projectCurrentRelease({
    releaseProjection: canonicalProjection(),
    releaseNotes: canonicalReleaseNotes,
  });
  const selected = canonicalReleaseNotes.releases.find(
    (release) => release.version === canonicalManifest.target_version,
  );

  assert.equal(projected.visible, true);
  assert.equal(projected.published, true);
  assert.equal(projected.version, canonicalManifest.target_version);
  assert.equal(projected.label, `v${canonicalManifest.target_version} · ${canonicalManifest.qualifier}`);
  assert.equal(projected.date, selected.date);
  assert.equal(projected.item_count, selected.item_count);
  assert.deepEqual(projected.highlights, selected.highlights);
  assert.deepEqual(currentRelease, projected);
});

test("current release projection uses Unreleased notes for enabled draft previews", () => {
  const projected = projectCurrentRelease({
    releaseProjection: canonicalProjection({
      manifest: draftManifest,
      published: false,
      preview_visible: true,
    }),
    releaseNotes: canonicalReleaseNotes,
  });
  const expectedHighlights = Object.values(canonicalReleaseNotes.unreleased.sections).flat().slice(0, 3);

  assert.equal(projected.visible, true);
  assert.equal(projected.published, false);
  assert.equal(projected.preview, true);
  assert.match(projected.label, /preview$/);
  assert.equal(projected.item_count, canonicalReleaseNotes.unreleased.item_count);
  assert.deepEqual(projected.highlights, expectedHighlights);
});

test("hidden drafts render no current release supplement without resolving notes", () => {
  const projected = projectCurrentRelease({
    releaseProjection: canonicalProjection({
      manifest: draftManifest,
      published: false,
      preview_visible: false,
      visible: false,
    }),
    releaseNotes: null,
  });

  assert.deepEqual(projected, {
    visible: false,
    published: false,
    preview: false,
    version: canonicalManifest.target_version,
    qualifier: canonicalManifest.qualifier,
  });
});

test("current release projection fails closed on inconsistent generated data", () => {
  const withoutTarget = {
    ...canonicalReleaseNotes,
    releases: canonicalReleaseNotes.releases.filter(
      (release) => release.version !== canonicalManifest.target_version,
    ),
  };
  assert.throws(
    () => projectCurrentRelease({
      releaseProjection: canonicalProjection(),
      releaseNotes: withoutTarget,
    }),
    /has no generated release entry/,
  );

  assert.throws(
    () => projectCurrentRelease({
      releaseProjection: canonicalProjection(),
      releaseNotes: { ...canonicalReleaseNotes, latest_release: "mismatch" },
    }),
    /must match latest release/,
  );

  const selected = canonicalReleaseNotes.releases.find(
    (release) => release.version === canonicalManifest.target_version,
  );
  assert.throws(
    () => projectCurrentRelease({
      releaseProjection: canonicalProjection(),
      releaseNotes: {
        ...canonicalReleaseNotes,
        releases: canonicalReleaseNotes.releases.map((release) =>
          release === selected ? { ...release, item_count: release.item_count + 1 } : release,
        ),
      },
    }),
    /item_count does not match/,
  );
});

test("current release component and generator contain no release-version literals", () => {
  const component = readFileSync(
    new URL("../docs/src/components/CurrentReleaseSupplement.astro", import.meta.url),
    "utf8",
  );
  const generator = readFileSync(
    new URL("../scripts/generate-release-notes-data.js", import.meta.url),
    "utf8",
  );
  const footer = readFileSync(
    new URL("../docs/src/components/Footer.astro", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(component, /\bv?\d+\.\d+\.\d+\b/);
  assert.doesNotMatch(component, /release-v\d+/i);
  assert.doesNotMatch(generator, /ReleaseV\d+Supplement/);
  assert.doesNotMatch(footer, /ReleaseV\d+Supplement/);
  assert(footer.includes("CurrentReleaseSupplement"));
});
