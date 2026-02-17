#!/usr/bin/env node

/**
 * sync-agent-skills.mjs
 *
 * Copies the agent-skills repo into packages/shared/references/agent-skills.
 * Performs a clean re-copy each time (deletes existing, then copies fresh).
 *
 * Usage:
 *   node scripts/sync-agent-skills.mjs [source-path]
 *
 * Default source: ../agent-skills (sibling directory)
 */

import { existsSync, cpSync, rmSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const defaultSource = resolve(ROOT, "..", "agent-skills");
const source = process.argv[2] ? resolve(process.argv[2]) : defaultSource;
const target = resolve(ROOT, "packages", "shared", "references", "agent-skills");

console.log(`[sync] Source: ${source}`);
console.log(`[sync] Target: ${target}`);

if (!existsSync(source)) {
  console.error(`[sync] ERROR: Source not found at ${source}`);
  console.error(`[sync] Usage: node scripts/sync-agent-skills.mjs [path-to-agent-skills]`);
  process.exit(1);
}

// Clean existing target
if (existsSync(target)) {
  console.log(`[sync] Removing existing reference copy...`);
  rmSync(target, { recursive: true, force: true });
}

// Copy fresh
console.log(`[sync] Copying agent-skills...`);
mkdirSync(target, { recursive: true });

cpSync(source, target, {
  recursive: true,
  filter: (src) => {
    // Skip .git directory and node_modules
    if (src.includes("/.git/") || src.includes("/node_modules/")) return false;
    if (src.endsWith("/.git") || src.endsWith("/node_modules")) return false;
    return true;
  },
});

console.log(`[sync] Done. Agent-skills synced to ${target}`);
