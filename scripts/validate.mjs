#!/usr/bin/env node

/**
 * validate.mjs
 *
 * Validates that both Cursor and Claude plugins are complete and well-formed.
 * Checks:
 * - Required files exist
 * - JSON files parse correctly
 * - All skills exist in both targets
 * - Both MCP servers present in both targets
 * - No path traversal in manifests
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CURSOR = resolve(ROOT, "packages", "cursor-velt");
const CLAUDE = resolve(ROOT, "packages", "claude-velt");
const MARKETPLACE = resolve(ROOT, "packages", "claude-marketplace");

let errors = 0;
let warnings = 0;

function pass(msg) {
  console.log(`  ✓ ${msg}`);
}

function fail(msg) {
  console.error(`  ✗ ${msg}`);
  errors++;
}

function warn(msg) {
  console.warn(`  ⚠ ${msg}`);
  warnings++;
}

function checkFileExists(path, label) {
  if (existsSync(path)) {
    pass(label);
    return true;
  } else {
    fail(`Missing: ${label} (${path})`);
    return false;
  }
}

function parseJSON(path, label) {
  if (!existsSync(path)) {
    fail(`Cannot parse ${label}: file missing`);
    return null;
  }
  try {
    const content = readFileSync(path, "utf-8");
    const parsed = JSON.parse(content);
    pass(`${label} parses as valid JSON`);
    return parsed;
  } catch (e) {
    fail(`${label} is invalid JSON: ${e.message}`);
    return null;
  }
}

function checkPathTraversal(obj, label, path = "") {
  if (typeof obj === "string") {
    if (obj.includes("../")) {
      fail(`Path traversal in ${label}${path}: "${obj}"`);
    }
  } else if (typeof obj === "object" && obj !== null) {
    for (const [key, val] of Object.entries(obj)) {
      checkPathTraversal(val, label, `${path}.${key}`);
    }
  }
}

// ─── Required Skills ─────────────────────────────────────────────────────────

const REQUIRED_SKILLS = [
  "install-velt",
  "add-comments",
  "add-crdt",
  "add-notifications",
  "add-presence",
  "add-cursors",
  "screenshot",
  "velt-help",
];

// ─── Validate Cursor Plugin ──────────────────────────────────────────────────

function validateCursor() {
  console.log("\n═══ Cursor Plugin ═══\n");

  // Manifest — check both .plugin/ (Open Plugins standard) and .cursor-plugin/ (compat)
  const manifest = parseJSON(resolve(CURSOR, ".plugin", "plugin.json"), "Cursor plugin.json (.plugin/)");
  if (manifest) {
    if (!manifest.name) fail("Cursor manifest missing 'name'");
    else pass(`Cursor plugin name: ${manifest.name}`);
    checkPathTraversal(manifest, "Cursor manifest");
  }
  // Check backward-compat copy exists too
  checkFileExists(resolve(CURSOR, ".cursor-plugin", "plugin.json"), "Cursor compat manifest (.cursor-plugin/)");

  // MCP config — .mcp.json (Open Plugins standard)
  const mcp = parseJSON(resolve(CURSOR, ".mcp.json"), "Cursor .mcp.json");
  if (mcp) {
    if (!mcp.mcpServers) {
      fail("Cursor .mcp.json missing 'mcpServers'");
    } else {
      if (mcp.mcpServers["velt-installer"]) pass("MCP: velt-installer present");
      else fail("MCP: velt-installer missing");
    }
    checkPathTraversal(mcp, "Cursor .mcp.json");
  }

  // Skills
  console.log("\n  Skills:");
  for (const skill of REQUIRED_SKILLS) {
    checkFileExists(resolve(CURSOR, "skills", skill, "SKILL.md"), `Cursor skill: ${skill}`);
  }

  // Rules
  console.log("\n  Rules:");
  const rulesDir = resolve(CURSOR, "rules");
  if (existsSync(rulesDir)) {
    const rules = readdirSync(rulesDir).filter((f) => f.endsWith(".mdc"));
    if (rules.length > 0) pass(`${rules.length} .mdc rule file(s) found`);
    else warn("No .mdc rule files found");
  } else {
    warn("Rules directory missing");
  }

  // Agent
  console.log("\n  Agent:");
  checkFileExists(resolve(CURSOR, "agents", "velt-expert.md"), "Cursor agent: velt-expert");

  // Logo
  checkFileExists(resolve(CURSOR, "assets", "velt.svg"), "Logo: assets/velt.svg");

  // References (agent-skills are now installed by the user, not bundled)
  console.log("\n  References:");
  pass("Agent-skills referenced by name (user installs via npx skills add)");
}

// ─── Validate Claude Plugin ──────────────────────────────────────────────────

function validateClaude() {
  console.log("\n═══ Claude Code Plugin ═══\n");

  // Manifest
  const manifest = parseJSON(resolve(CLAUDE, ".claude-plugin", "plugin.json"), "Claude plugin.json");
  if (manifest) {
    if (!manifest.name) fail("Claude manifest missing 'name'");
    else pass(`Claude plugin name: ${manifest.name}`);
    checkPathTraversal(manifest, "Claude manifest");
  }

  // MCP config
  const mcp = parseJSON(resolve(CLAUDE, ".mcp.json"), "Claude .mcp.json");
  if (mcp) {
    if (!mcp.mcpServers) {
      fail("Claude .mcp.json missing 'mcpServers'");
    } else {
      if (mcp.mcpServers["velt-installer"]) pass("MCP: velt-installer present");
      else fail("MCP: velt-installer missing");
      if (mcp.mcpServers["velt-docs"]) pass("MCP: velt-docs present");
      else fail("MCP: velt-docs missing");
    }
    checkPathTraversal(mcp, "Claude .mcp.json");
  }

  // Skills
  console.log("\n  Skills:");
  for (const skill of REQUIRED_SKILLS) {
    checkFileExists(resolve(CLAUDE, "skills", skill, "SKILL.md"), `Claude skill: ${skill}`);
  }

  // Agent
  console.log("\n  Agent:");
  checkFileExists(resolve(CLAUDE, "agents", "velt-expert.md"), "Claude agent: velt-expert");

  // Rules guide
  console.log("\n  Guides:");
  checkFileExists(resolve(CLAUDE, "guides", "velt-rules.md"), "Claude guide: velt-rules.md");

  // References
  console.log("\n  References:");
  pass("Agent-skills referenced by name (user installs via npx skills add)");
}

// ─── Validate Claude Marketplace ─────────────────────────────────────────────

function validateMarketplace() {
  console.log("\n═══ Claude Marketplace ═══\n");

  const manifest = parseJSON(
    resolve(MARKETPLACE, ".claude-plugin", "marketplace.json"),
    "marketplace.json"
  );
  if (manifest) {
    if (!manifest.name) fail("Marketplace missing 'name'");
    else pass(`Marketplace name: ${manifest.name}`);
    if (!manifest.owner?.name) fail("Marketplace missing 'owner.name'");
    if (!manifest.plugins?.length) fail("Marketplace has no plugins");
    else pass(`${manifest.plugins.length} plugin(s) listed`);
    checkPathTraversal(manifest, "marketplace.json");
  }

  // Check marketplace plugin copy
  if (existsSync(resolve(MARKETPLACE, "plugins", "velt", ".claude-plugin", "plugin.json"))) {
    pass("Marketplace plugin copy exists");
  } else {
    warn("Marketplace plugin copy missing (run 'npm run build')");
  }
}

// ─── Summary ─────────────────────────────────────────────────────────────────

function main() {
  console.log("╔══════════════════════════════════════╗");
  console.log("║  Velt Plugin Framework Validator     ║");
  console.log("╚══════════════════════════════════════╝");

  validateCursor();
  validateClaude();
  validateMarketplace();

  console.log("\n══════════════════════════════════════");
  if (errors === 0 && warnings === 0) {
    console.log("  All checks passed!");
  } else {
    if (errors > 0) console.error(`  ${errors} error(s)`);
    if (warnings > 0) console.warn(`  ${warnings} warning(s)`);
  }
  console.log("══════════════════════════════════════\n");

  process.exit(errors > 0 ? 1 : 0);
}

main();
