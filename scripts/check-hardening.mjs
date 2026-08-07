import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const checks = [
  ["reduced-motion CSS", "src/css/foundation/reset.css", /prefers-reduced-motion: reduce/],
  ["media error fallback", "src/js/features/media-fallback.ts", /addEventListener\("error"/],
  ["media failed-load fallback", "src/js/features/media-fallback.ts", /naturalWidth === 0/],
  ["media initialization guard", "src/js/features/media-fallback.ts", /hardyMediaInitialized/],
  ["menu initialization guard", "src/js/features/mobile-menu.ts", /hardyMenuInitialized/],
  [
    "page transition initialization guard",
    "src/js/features/page-transition.ts",
    /hardyPageTransitionInitialized/,
  ],
  [
    "page transition reduced-motion fallback",
    "src/css/foundation/reset.css",
    /prefers-reduced-motion: reduce/,
  ],
  ["rich-content media bound", "src/css/content/prose.css", /iframe, video, audio, svg/],
  ["feature error isolation", "src/js/core/dom.ts", /catch \(error\)/],
];

for (const [label, path, pattern] of checks) {
  const content = await read(path);
  if (!pattern.test(content)) throw new Error(`Missing ${label} contract in ${path}`);
  console.log(`PASS ${label}`);
}
