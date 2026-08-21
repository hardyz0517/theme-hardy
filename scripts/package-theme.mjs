import { spawn } from "node:child_process";
import { copyFile, cp, mkdir, mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const staging = await mkdtemp(join(tmpdir(), "theme-hardy-package-"));
const cli = join(root, "node_modules", "@halo-dev", "theme-package-cli", "index.js");

const run = (command, args, options) =>
  new Promise((resolveRun, reject) => {
    const child = spawn(command, args, { ...options, stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolveRun();
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });

try {
  const sourceTemplates = (await readdir(join(root, "src"), { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
    .map((entry) => entry.name);
  const stagedTemplates = join(staging, "templates");
  await mkdir(stagedTemplates, { recursive: true });
  await Promise.all(
    sourceTemplates.map((name) =>
      copyFile(join(root, "templates", name), join(stagedTemplates, name)),
    ),
  );
  await cp(join(root, "templates", "assets"), join(stagedTemplates, "assets"), {
    recursive: true,
  });
  for (const file of ["theme.yaml", "settings.yaml", "README.md", "LICENSE"]) {
    await copyFile(join(root, file), join(staging, file));
  }
  try {
    await cp(join(root, "i18n"), join(staging, "i18n"), { recursive: true });
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  await run(process.execPath, [cli], { cwd: staging });
  const themeYaml = await readFile(join(root, "theme.yaml"), "utf8");
  const name = /^  name:\s*([^\s]+)\s*$/m.exec(themeYaml)?.[1];
  const version = /^  version:\s*([^\s]+)\s*$/m.exec(themeYaml)?.[1];
  if (!name || !version) throw new Error("Unable to determine theme package name and version");
  const artifact = join(staging, "dist", `${name}-${version}.zip`);
  await mkdir(join(root, "dist"), { recursive: true });
  await copyFile(artifact, join(root, "dist", `${name}-${version}.zip`));
  console.log(`Packaged successfully: ${join(root, "dist", `${name}-${version}.zip`)}`);
} finally {
  await rm(staging, { recursive: true, force: true });
}
