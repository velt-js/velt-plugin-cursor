#!/usr/bin/env node

/**
 * deploy-skills.mjs
 *
 * Deploys plugin skills and rules to Cursor's local directories.
 *
 * Cursor reads skills from ~/.cursor/skills/ and rules from ~/.cursor/rules/,
 * NOT from the plugin directory. This script copies them to those locations.
 *
 * Agent-skills (velt-setup-best-practices, etc.) are NOT deployed by this script —
 * they're installed via `npx skills add velt-js/agent-skills` and symlinked separately.
 *
 * Usage:
 *   npm run deploy
 *   node scripts/deploy-skills.mjs
 */

import { existsSync, cpSync, readdirSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const CURSOR_HOME = resolve(homedir(), ".cursor");
const CURSOR_SKILLS = resolve(CURSOR_HOME, "skills");
const CURSOR_RULES = resolve(CURSOR_HOME, "rules");

// Plugin-specific skills to deploy
const SKILLS_TO_DEPLOY = [
  "install-velt",
  "velt-help",
];

function main() {
  // Deploy skills
  console.log("[deploy] Deploying skills to Cursor...\n");

  mkdirSync(CURSOR_SKILLS, { recursive: true });

  let deployed = 0;
  for (const skill of SKILLS_TO_DEPLOY) {
    const src = resolve(ROOT, "skills", skill, "SKILL.md");
    const destDir = resolve(CURSOR_SKILLS, skill);
    const dest = resolve(destDir, "SKILL.md");

    if (!existsSync(src)) {
      console.warn(`[deploy] WARNING: Source not found: ${src}`);
      continue;
    }

    mkdirSync(destDir, { recursive: true });
    cpSync(src, dest);
    console.log(`[deploy] ✓ skill: ${skill}`);
    deployed++;
  }

  // Deploy rules
  console.log("");
  mkdirSync(CURSOR_RULES, { recursive: true });

  const rulesDir = resolve(ROOT, "rules");
  if (existsSync(rulesDir)) {
    const rules = readdirSync(rulesDir).filter(f => f.endsWith(".mdc"));
    for (const rule of rules) {
      cpSync(resolve(rulesDir, rule), resolve(CURSOR_RULES, rule));
      console.log(`[deploy] ✓ rule: ${rule}`);
      deployed++;
    }
  }

  console.log(`\n[deploy] Deployed ${deployed} files to ${CURSOR_HOME}`);
  console.log("[deploy] Restart Cursor to pick up changes.");
}

main();
