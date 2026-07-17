import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { publicReleasePaths } from "../../../release/public-release.mjs";
import { publicRelease } from "./publicRelease.mjs";

const releaseNotesPath = join(
  dirname(publicReleasePaths.manifest),
  "..",
  "docs",
  "_generated",
  "release-notes.json",
);

function fail(message) {
  throw new Error(`Invalid current release projection: ${message}`);
}

function expectObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail(`${label} must be an object`);
  }
  return value;
}

function expectNonEmptyString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    fail(`${label} must be a non-empty string`);
  }
  return value;
}

function expectItemCount(value, label) {
  if (!Number.isInteger(value) || value < 0) {
    fail(`${label} must be a non-negative integer`);
  }
  return value;
}

function validateSections(value, label) {
  const sections = expectObject(value, label);
  for (const [section, items] of Object.entries(sections)) {
    expectNonEmptyString(section, `${label} section name`);
    if (!Array.isArray(items)) {
      fail(`${label}.${section} must be an array`);
    }
    items.forEach((item, index) => {
      expectNonEmptyString(item, `${label}.${section}[${index}]`);
    });
  }
  return sections;
}

function sectionItems(sections) {
  return Object.values(sections).flat();
}

function validateReleaseNotes(value) {
  const notes = expectObject(value, "release notes");
  expectNonEmptyString(notes.package_version, "release notes package_version");
  expectNonEmptyString(notes.latest_release, "release notes latest_release");
  if (!Array.isArray(notes.releases)) {
    fail("release notes releases must be an array");
  }

  const unreleased = expectObject(notes.unreleased, "release notes unreleased");
  const unreleasedSections = validateSections(
    unreleased.sections,
    "release notes unreleased sections",
  );
  const unreleasedItemCount = expectItemCount(
    unreleased.item_count,
    "release notes unreleased item_count",
  );
  if (sectionItems(unreleasedSections).length !== unreleasedItemCount) {
    fail("release notes unreleased item_count does not match its sections");
  }

  return {
    ...notes,
    unreleased: {
      sections: unreleasedSections,
      item_count: unreleasedItemCount,
    },
  };
}

function validatePublishedRelease(release, targetVersion) {
  expectObject(release, `release notes entry for ${targetVersion}`);
  if (release.version !== targetVersion) {
    fail(`release notes entry version must equal ${targetVersion}`);
  }
  if (typeof release.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(release.date)) {
    fail(`release notes entry for ${targetVersion} must have a YYYY-MM-DD date`);
  }
  const sections = validateSections(
    release.sections,
    `release notes entry ${targetVersion} sections`,
  );
  const itemCount = expectItemCount(
    release.item_count,
    `release notes entry ${targetVersion} item_count`,
  );
  if (sectionItems(sections).length !== itemCount) {
    fail(`release notes entry ${targetVersion} item_count does not match its sections`);
  }
  if (!Array.isArray(release.highlights) || release.highlights.length > 3) {
    fail(`release notes entry ${targetVersion} highlights must contain at most three items`);
  }
  release.highlights.forEach((item, index) => {
    expectNonEmptyString(
      item,
      `release notes entry ${targetVersion} highlights[${index}]`,
    );
  });
  if (release.highlights.some((item) => !sectionItems(sections).includes(item))) {
    fail(`release notes entry ${targetVersion} highlights must come from its sections`);
  }
  return {
    date: release.date,
    sections,
    item_count: itemCount,
    highlights: [...release.highlights],
  };
}

export function projectCurrentRelease({ releaseProjection, releaseNotes }) {
  const projection = expectObject(releaseProjection, "public release projection");
  const manifest = expectObject(projection.manifest, "public release manifest");
  const version = expectNonEmptyString(manifest.target_version, "target_version");
  const qualifier = expectNonEmptyString(manifest.qualifier, "qualifier");

  if (!projection.visible) {
    return Object.freeze({
      visible: false,
      published: false,
      preview: false,
      version,
      qualifier,
    });
  }

  const notes = validateReleaseNotes(releaseNotes);
  if (projection.published) {
    if (projection.package_version !== version || notes.package_version !== version) {
      fail(
        `published target ${version} must match package versions ` +
          `${projection.package_version} and ${notes.package_version}`,
      );
    }
    if (notes.latest_release !== version) {
      fail(`published target ${version} must match latest release ${notes.latest_release}`);
    }
    const selected = notes.releases.find((release) => release?.version === version);
    if (!selected) {
      fail(`published target ${version} has no generated release entry`);
    }
    const release = validatePublishedRelease(selected, version);
    return Object.freeze({
      visible: true,
      published: true,
      preview: false,
      version,
      qualifier,
      label: `v${version} · ${qualifier}`,
      date: release.date,
      sections: release.sections,
      item_count: release.item_count,
      highlights: Object.freeze(release.highlights),
    });
  }

  if (!projection.preview_visible) {
    fail("visible draft release must be an enabled preview");
  }
  const highlights = sectionItems(notes.unreleased.sections).slice(0, 3);
  return Object.freeze({
    visible: true,
    published: false,
    preview: true,
    version,
    qualifier,
    label: `Target v${version} · ${qualifier} preview`,
    date: null,
    sections: notes.unreleased.sections,
    item_count: notes.unreleased.item_count,
    highlights: Object.freeze(highlights),
  });
}

export function loadCurrentReleaseProjection({
  releaseProjection = publicRelease,
  notesPath = releaseNotesPath,
} = {}) {
  let releaseNotes;
  try {
    releaseNotes = JSON.parse(readFileSync(notesPath, "utf8"));
  } catch (error) {
    fail(`generated release notes could not be read: ${error.message}`);
  }
  return projectCurrentRelease({ releaseProjection, releaseNotes });
}

export const currentRelease = loadCurrentReleaseProjection();
