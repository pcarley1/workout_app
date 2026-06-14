import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const standaloneRoot = join(root, ".next", "standalone");
const standaloneNext = join(standaloneRoot, ".next");
const staticSource = join(root, ".next", "static");
const staticTarget = join(standaloneNext, "static");
const publicSource = join(root, "public");
const publicTarget = join(standaloneRoot, "public");

if (!existsSync(standaloneRoot)) {
  throw new Error("Missing .next/standalone. Run next build before copying standalone assets.");
}

mkdirSync(standaloneNext, { recursive: true });

if (existsSync(staticSource)) {
  rmSync(staticTarget, { recursive: true, force: true });
  cpSync(staticSource, staticTarget, { recursive: true });
}

if (existsSync(publicSource)) {
  rmSync(publicTarget, { recursive: true, force: true });
  cpSync(publicSource, publicTarget, { recursive: true });
}

console.log("Copied Next static assets into standalone runtime.");
