import { loadPublicReleaseProjection } from "../../../release/public-release.mjs";

export const publicRelease = loadPublicReleaseProjection({ env: process.env });
