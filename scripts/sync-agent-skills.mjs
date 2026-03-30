#!/usr/bin/env node

/**
 * sync-agent-skills.mjs
 *
 * Copies the 4 agent-skills from the agent-skills repo directly into
 * both plugin output directories as bundled skills.
 *
 * This ensures the AI always has access to the full rule files
 * without needing a separate `npx skills add` step.
 *
 * Usage:
 *   npm run sync
 *   node scripts/sync-agent-skills.mjs [source-path]
 *
 * Default source: ../agent-skills (sibling directory)
 */

import { existsSync, cpSync, rmSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const defaultSource = resolve(ROOT, "..", "agent-skills", "skills");
const source = process.argv[2] ? resolve(process.argv[2]) : defaultSource;

const CURSOR = resolve(ROOT, "packages", "cursor-velt", "skills");
const CLAUDE = resolve(ROOT, "packages", "claude-velt", "skills");

const AGENT_SKILLS = [
  "velt-setup-best-practices",
  "velt-comments-best-practices",
  "velt-crdt-best-practices",
  "velt-notifications-best-practices",
];

console.log(`[sync] Source: ${source}`);

if (!existsSync(source)) {
  console.error(`[sync] ERROR: Source not found at ${source}`);
  console.error(`[sync] Usage: node scripts/sync-agent-skills.mjs [path-to-agent-skills/skills]`);
  process.exit(1);
}

function copySkill(skillName, targetDir) {
  const src = resolve(source, skillName);
  const dest = resolve(targetDir, skillName);

  if (!existsSync(src)) {
    console.warn(`[sync]   WARNING: ${skillName} not found at ${src}`);
    return false;
  }

  // Clean existing copy
  if (existsSync(dest)) {
    rmSync(dest, { recursive: true, force: true });
  }

  mkdirSync(dest, { recursive: true });
  cpSync(src, dest, {
    recursive: true,
    filter: (path) => {
      // Skip .git, node_modules, and AGENTS.full.md (too large for context)
      if (path.includes("/.git/") || path.includes("/node_modules/")) return false;
      if (path.endsWith("/.git") || path.endsWith("/node_modules")) return false;
      if (path.endsWith("/AGENTS.full.md")) return false;
      return true;
    },
  });

  return true;
}

// Copy to Cursor plugin
console.log(`[sync] Copying agent-skills to Cursor plugin...`);
for (const skill of AGENT_SKILLS) {
  const ok = copySkill(skill, CURSOR);
  console.log(`[sync]   ${ok ? "✓" : "✗"} ${skill}`);
}

// Copy to Claude plugin
console.log(`[sync] Copying agent-skills to Claude plugin...`);
for (const skill of AGENT_SKILLS) {
  const ok = copySkill(skill, CLAUDE);
  console.log(`[sync]   ${ok ? "✓" : "✗"} ${skill}`);
}

console.log(`[sync] Done.`);
