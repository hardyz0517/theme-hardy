import { readdir, readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const listFiles = async (directory, extension) => {
  const entries = await readdir(new URL(`../${directory}/`, import.meta.url), {
    withFileTypes: true,
  });
  const paths = await Promise.all(
    entries.map((entry) => {
      const path = `${directory}/${entry.name}`;
      if (entry.isDirectory()) return listFiles(path, extension);
      return entry.name.endsWith(extension) ? [path] : [];
    }),
  );
  return paths.flat();
};
const checks = [
  ["reduced-motion CSS", "src/css/foundation/reset.css", /prefers-reduced-motion: reduce/],
  ["media error fallback", "src/js/features/media-fallback.ts", /addEventListener\("error"/],
  ["media failed-load fallback", "src/js/features/media-fallback.ts", /naturalWidth === 0/],
  ["media initialization guard", "src/js/features/media-fallback.ts", /hardyMediaInitialized/],
  ["menu initialization guard", "src/js/features/mobile-menu.ts", /hardyMenuInitialized/],
  ["rich-content media bound", "src/css/content/prose.css", /iframe, video, audio, svg/],
  ["feature error isolation", "src/js/core/dom.ts", /catch \(error\)/],
];

for (const [label, path, pattern] of checks) {
  const content = await read(path);
  if (!pattern.test(content)) throw new Error(`Missing ${label} contract in ${path}`);
  console.log(`PASS ${label}`);
}

const templatePaths = await listFiles("src", ".html");
const templates = await Promise.all(
  templatePaths.map(async (path) => ({ path, content: await read(path) })),
);
const allTemplates = templates.map(({ content }) => content).join("\n");
const menuFinderCalls = allTemplates.match(/menuFinder\.getPrimary\(\)/g)?.length ?? 0;
if (menuFinderCalls !== 1) {
  throw new Error(`Expected one shared menu Finder call, found ${menuFinderCalls}`);
}
console.log("PASS shared menu Finder consolidation");

const searchAvailabilityCalls =
  allTemplates.match(/pluginFinder\.available\('PluginSearchWidget'\)/g)?.length ?? 0;
if (searchAvailabilityCalls !== 1) {
  throw new Error(
    `Expected one shared search availability check, found ${searchAvailabilityCalls}`,
  );
}
console.log("PASS shared search capability consolidation");

const momentCommentTemplates = templates.filter(({ content }) =>
  content.includes('group="moment.halo.run"'),
);
const momentCommentWidgets = allTemplates.match(/group="moment\.halo\.run"/g)?.length ?? 0;
if (
  momentCommentWidgets !== 1 ||
  momentCommentTemplates.length !== 1 ||
  momentCommentTemplates[0]?.path !== "src/moment.html"
) {
  const locations = momentCommentTemplates.map(({ path }) => path).join(", ") || "none";
  throw new Error(
    `Expected one Moment detail comment widget in src/moment.html, found ${momentCommentWidgets} in ${locations}`,
  );
}
console.log("PASS Moment detail-only comment widget");

const momentListItem = await read("src/partials/components/moment-item.html");
if (!momentListItem.includes("/moments/{name}#hardy-moment-comments")) {
  throw new Error("Moment list comment link must target the detail comment anchor");
}
console.log("PASS Moment list comment anchor");

const momentsTemplate = await read("src/moments.html");
const momentsFeature = await read("src/js/features/moments.ts");
const momentTagsContract = [
  "data-hardy-moment-tags-list",
  'placeholder="输入标签后回车"',
  'event.key === "Enter"',
  "const tags = [...tagValues];",
];
if (
  momentTagsContract.some(
    (fragment) => !momentsTemplate.includes(fragment) && !momentsFeature.includes(fragment),
  )
) {
  throw new Error("Moment composer must expose and submit the interactive tag editor");
}
console.log("PASS Moment tag editor contract");

const momentTagDisplayContract = [
  'class="hardy-moment-tags"',
  "moment.spec?.tags",
  'class="hardy-moment-tags__link"',
  'th:href="@{/moments(tag=${tag})}"',
];
if (momentTagDisplayContract.some((fragment) => !momentListItem.includes(fragment))) {
  throw new Error("Moment list items must render saved tags as filter links");
}
console.log("PASS Moment tag display contract");

const momentComposerStyles = await read("src/css/content/moments.css");
const momentComposerAutoGrowContract = [
  'contentInput.style.height = "auto"',
  "contentInput.scrollHeight",
  'contentInput?.addEventListener("input", resizeContentInput)',
  "resize: none",
];
if (
  momentComposerAutoGrowContract.some(
    (fragment) => !momentsFeature.includes(fragment) && !momentComposerStyles.includes(fragment),
  )
) {
  throw new Error("Moment composer must auto-grow its content field without native resizing");
}
console.log("PASS Moment composer auto-grow contract");

const mainEntry = await read("src/js/main.ts");
const shellStyles = await read("src/css/layout/shell.css");
if (mainEntry.includes("page-transition") || shellStyles.includes("is-page-leaving")) {
  throw new Error("Blocking page transition must remain removed");
}
console.log("PASS non-blocking page navigation");

const desktopShellBreakpoint = "900px";
const desktopShellBreakpointContracts = [
  "src/css/foundation/tokens.css",
  "src/css/layout/shell.css",
  "src/css/layout/sidebar.css",
  "src/css/layout/mobile-menu.css",
  "src/css/layout/footer.css",
  "src/css/content/toc.css",
];
const desktopShellStyles = await Promise.all(
  desktopShellBreakpointContracts.map(async (path) => ({ path, content: await read(path) })),
);
for (const { path, content } of desktopShellStyles) {
  const expected = path.endsWith("tokens.css")
    ? `--hardy-shell-breakpoint: ${desktopShellBreakpoint};`
    : `@media (min-width: ${desktopShellBreakpoint})`;
  if (!content.includes(expected)) {
    throw new Error(`Desktop shell breakpoint contract is out of sync in ${path}`);
  }
  const legacy = path.endsWith("tokens.css")
    ? "--hardy-shell-breakpoint: 1024px;"
    : "@media (min-width: 1024px)";
  if (content.includes(legacy)) {
    throw new Error(`Legacy desktop shell breakpoint remains in ${path}`);
  }
}
const mobileMenuFeature = await read("src/js/features/mobile-menu.ts");
if (!mobileMenuFeature.includes(`(min-width: ${desktopShellBreakpoint})`)) {
  throw new Error("Desktop shell breakpoint contract is out of sync in mobile-menu.ts");
}
if (mobileMenuFeature.includes("(min-width: 1024px)")) {
  throw new Error("Legacy desktop shell breakpoint remains in mobile-menu.ts");
}
console.log("PASS synchronized desktop shell breakpoint");

const archivesTemplate = await read("src/archives.html");
const archiveEditContract = [
  "hardyPostEditorHref=${hardyBasic?.new_post_url ?: '/console/posts/editor'}",
  'class="hardy-archive-post__edit"',
  "sec:authorize=\"hasRole('super-role')\"",
  'th:href="@{${hardyPostEditorHref}(name=${post.metadata.name})}"',
];
if (archiveEditContract.some((fragment) => !archivesTemplate.includes(fragment))) {
  throw new Error("Archive edit action must retain its authorized metadata-name URL contract");
}
console.log("PASS archive edit action contract");

const postTemplate = await read("src/post.html");
const detailEditContract = [
  "hardyPostEditorHref=${hardyBasic?.new_post_url ?: '/console/posts/editor'}",
  'class="hardy-detail__meta-item hardy-detail__meta-edit"',
  "sec:authorize=\"hasRole('super-role')\"",
  'th:href="@{${hardyPostEditorHref}(name=${post.metadata.name})}"',
];
if (detailEditContract.some((fragment) => !postTemplate.includes(fragment))) {
  throw new Error("Post detail edit action must retain its authorized metadata-name URL contract");
}
console.log("PASS post detail edit action contract");
