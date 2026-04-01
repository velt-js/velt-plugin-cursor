#!/usr/bin/env node

/**
 * deploy-skills.mjs
 *
 * Deploys built plugin skills to ~/.cursor/skills/ so Cursor can find them.
 *
 * Cursor reads skills from ~/.cursor/skills/, NOT from the plugin directory.
 * This script copies the 8 plugin skills (SKILL.md files) to that location.
 *
 * Agent-skills (velt-setup-best-practices, etc.) are NOT deployed by this script —
 * they're installed via `npx skills add velt-js/agent-skills` and symlinked separately.
 *
 * Usage:
 *   npm run deploy
 *   node scripts/deploy-skills.mjs
 */

import { existsSync, cpSync, mkdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const PLUGIN_SKILLS = resolve(ROOT, "skills");
const CURSOR_SKILLS = resolve(homedir(), ".cursor", "skills");

// Only deploy plugin-specific skills (not bundled agent-skills)
const SKILLS_TO_DEPLOY = [
  "install-velt",
  "add-comments",
  "add-crdt",
  "add-notifications",
  "add-presence",
  "add-cursors",
  "screenshot",
  "velt-help",
];

function main() {
  console.log("[deploy] Deploying skills to Cursor...\n");

  if (!existsSync(CURSOR_SKILLS)) {
    console.log(`[deploy] Creating ${CURSOR_SKILLS}`);
    mkdirSync(CURSOR_SKILLS, { recursive: true });
  }

  let deployed = 0;
  let skipped = 0;

  for (const skill of SKILLS_TO_DEPLOY) {
    const src = resolve(PLUGIN_SKILLS, skill, "SKILL.md");
    const destDir = resolve(CURSOR_SKILLS, skill);
    const dest = resolve(destDir, "SKILL.md");

    if (!existsSync(src)) {
      console.warn(`[deploy] WARNING: Source not found: ${src}`);
      skipped++;
      continue;
    }

    mkdirSync(destDir, { recursive: true });
    cpSync(src, dest);
    console.log(`[deploy] ✓ ${skill}`);
    deployed++;
  }

  console.log(`\n[deploy] Deployed ${deployed} skills to ${CURSOR_SKILLS}`);
  if (skipped > 0) {
    console.log(`[deploy] Skipped ${skipped} (source not found — run npm run build first)`);
  }
  console.log("[deploy] Restart Cursor to pick up changes.");
}

main();
