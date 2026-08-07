const baseUrl = process.env.HALO_TEST_BASE_URL;

if (!baseUrl) {
  throw new Error("HALO_TEST_BASE_URL is required");
}

const base = new URL(baseUrl);
const homeResponse = await fetch(new URL("/", base));
const homeHtml = await homeResponse.text();
const postPath = [...homeHtml.matchAll(/href=["']([^"']+)["']/g)]
  .map((match) => new URL(match[1], base))
  .find(
    (url) => url.origin === base.origin && /^\/archives\/[^/]+\/?$/.test(url.pathname),
  )?.pathname;

if (!postPath) {
  throw new Error("Unable to discover a published post route from the home page");
}

const routes = [
  ["home", "/"],
  ["archives", "/archives/"],
  ["categories", "/categories/"],
  ["category", "/categories/default"],
  ["tags", "/tags/"],
  ["tag", "/tags/halo"],
  ["page", "/about"],
  ["post", postPath],
  ["links", "/links"],
  ["moments", "/moments"],
  ["photos", "/photos"],
];

const results = [];

for (const [name, path] of routes) {
  const url = new URL(path, baseUrl);
  const response = await fetch(url);
  const html = await response.text();
  const themeAsset = /\/themes\/theme-hardy\/assets\/main-[^"']+\.(?:css|js)/.test(html);

  results.push({
    name,
    path,
    status: response.status,
    contentType: response.headers.get("content-type") ?? "",
    themeAsset,
    ok: response.ok && themeAsset,
  });
}

for (const result of results) {
  const state = result.ok ? "PASS" : "FAIL";
  console.log(
    `${state} ${result.name.padEnd(10)} ${String(result.status).padStart(3)} ${result.path} ${result.themeAsset ? "theme-asset" : "missing-theme-asset"}`,
  );
}

if (results.some((result) => !result.ok)) {
  process.exitCode = 1;
}
