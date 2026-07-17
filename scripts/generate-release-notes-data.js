#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const changelogPath = path.join(root, "CHANGELOG.md");
const packagePath = path.join(root, "package.json");
const publicReleasePath = path.join(root, "release", "public-release.json");
const outputPath = path.join(root, "docs", "_generated", "release-notes.json");
const publicChangelogPaths = [
  path.join(root, "docs", "src", "content", "docs", "project", "changelog.md"),
  path.join(root, "docs", "project", "changelog.md"),
];

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function fail(message) {
  throw new Error(message);
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function sectionItems(release) {
  return Object.values(release.sections).flat();
}

function normalizeContinuation(value) {
  return value.trim().replace(/\s+/g, " ");
}

function parseChangelog(markdown) {
  const lines = markdown.split(/\r?\n/);
  const releases = [];
  let unreleased = { title: "Unreleased", sections: {} };
  let current = null;
  let currentSection = null;

  for (const rawLine of lines) {
    const heading = rawLine.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      const title = heading[1].trim();
      currentSection = null;
      if (title.toLowerCase() === "unreleased") {
        current = unreleased;
        continue;
      }
      const versionMatch = title.match(/^(\d+\.\d+\.\d+)\s+-\s+(\d{4}-\d{2}-\d{2})$/);
      const legacyVersionMatch = title.match(/^(\d+\.\d+\.\d+)(?:\s+and earlier)?$/);
      if (!versionMatch && !legacyVersionMatch) {
        fail(`CHANGELOG.md has unsupported release heading: ${title}`);
      }
      current = {
        version: versionMatch ? versionMatch[1] : legacyVersionMatch[1],
        date: versionMatch ? versionMatch[2] : null,
        legacy: !versionMatch,
        sections: {},
      };
      releases.push(current);
      continue;
    }

    const section = rawLine.match(/^###\s+(.+?)\s*$/);
    if (section && current) {
      currentSection = section[1].trim();
      if (!current.sections[currentSection]) {
        current.sections[currentSection] = [];
      }
      continue;
    }

    const bullet = rawLine.match(/^-\s+(.+?)\s*$/);
    if (bullet && current) {
      const sectionName = currentSection || "Notes";
      if (!current.sections[sectionName]) {
        current.sections[sectionName] = [];
      }
      current.sections[sectionName].push(bullet[1].trim());
      continue;
    }

    const continuation = rawLine.match(/^\s{2,}(.+?)\s*$/);
    if (continuation && current) {
      const items = current.sections[currentSection || "Notes"];
      if (items && items.length > 0) {
        items[items.length - 1] = `${items[items.length - 1]} ${normalizeContinuation(continuation[1])}`;
      }
    }
  }

  return { unreleased, releases };
}

function buildReleaseNotesData() {
  const pkg = JSON.parse(readText(packagePath));
  const parsed = parseChangelog(readText(changelogPath));
  const seen = new Set();
  for (const release of parsed.releases) {
    if (seen.has(release.version)) {
      fail(`CHANGELOG.md has duplicate release heading for ${release.version}`);
    }
    seen.add(release.version);
    if (sectionItems(release).length === 0) {
      fail(`CHANGELOG.md release ${release.version} has no release-note bullets`);
    }
  }
  if (!seen.has(pkg.version)) {
    fail(`CHANGELOG.md is missing package version ${pkg.version}`);
  }

  const latestRelease = parsed.releases[0] || null;
  if (!latestRelease || latestRelease.version !== pkg.version) {
    fail(`CHANGELOG.md latest release ${latestRelease?.version || "none"} does not match package.json ${pkg.version}`);
  }

  return {
    generated_from: "CHANGELOG.md",
    package_version: pkg.version,
    latest_release: latestRelease.version,
    unreleased: {
      sections: parsed.unreleased.sections,
      item_count: sectionItems(parsed.unreleased).length,
    },
    releases: parsed.releases.map((release) => ({
      version: release.version,
      date: release.date,
      legacy: Boolean(release.legacy),
      sections: release.sections,
      item_count: sectionItems(release).length,
      highlights: sectionItems(release).slice(0, 3),
    })),
  };
}

function verifyPublicChangelogMentions(data) {
  const publicRelease = JSON.parse(readText(publicReleasePath));
  const gatedDraftVersion =
    publicRelease.state === "draft" && publicRelease.target_version === data.package_version
      ? data.package_version
      : null;
  const requiredVersions = data.releases
    .filter((release) => release.version !== gatedDraftVersion)
    .slice(0, Math.min(5, data.releases.length))
    .map((release) => release.version);
  for (const filePath of publicChangelogPaths) {
    const content = readText(filePath);
    for (const version of requiredVersions) {
      if (!content.includes(`\`${version}\``)) {
        fail(`${path.relative(root, filePath)} is missing public changelog summary for ${version}`);
      }
    }
  }
}

function main() {
  const check = process.argv.includes("--check");
  const data = buildReleaseNotesData();
  verifyPublicChangelogMentions(data);
  const rendered = `${JSON.stringify(data, null, 2)}\n`;

  if (check) {
    const current = fs.existsSync(outputPath) ? readText(outputPath) : "";
    if (current !== rendered) {
      fail("generated release notes data is stale; run npm run docs:release-notes");
    }
    console.log(JSON.stringify({ ok: true, action: "release-notes-check", output: outputPath }, null, 2));
    return;
  }

  ensureDir(outputPath);
  fs.writeFileSync(outputPath, rendered, "utf8");
  console.log(JSON.stringify({ ok: true, action: "release-notes-generate", output: outputPath }, null, 2));
}

try {
  main();
} catch (err) {
  console.error(`release notes generation failed: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
}
