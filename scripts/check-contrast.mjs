import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../src/css/foundation/tokens.css", import.meta.url), "utf8");

const token = (name, scope) => {
  const block = scope
    ? source.match(new RegExp(`${scope}[^}]+}`))?.[0]
    : source.match(/:root\s*\{[^}]+}/)?.[0];
  const value = block?.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`))?.[1];
  if (!value) throw new Error(`Missing ${name} in ${scope || ":root"}`);
  return value;
};

const rgb = (hex) =>
  [0, 2, 4].map((offset) => Number.parseInt(hex.slice(1 + offset, 3 + offset), 16) / 255);
const luminance = (hex) =>
  rgb(hex)
    .map((channel) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4))
    .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
const contrast = (foreground, background) => {
  const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
};

const checks = [
  ["light muted", token("--hardy-color-muted"), "#ffffff"],
  ["light subtle", token("--hardy-color-subtle"), "#ffffff"],
  ["dark muted", token("--hardy-color-muted", 'html\\[data-color-scheme="dark"\\]'), "#111418"],
  ["dark subtle", token("--hardy-color-subtle", 'html\\[data-color-scheme="dark"\\]'), "#111418"],
];

for (const [label, foreground, background] of checks) {
  const ratio = contrast(foreground, background);
  if (ratio < 4.5) throw new Error(`${label} contrast ${ratio.toFixed(2)}:1 is below 4.5:1`);
  console.log(`PASS ${label} ${ratio.toFixed(2)}:1`);
}
