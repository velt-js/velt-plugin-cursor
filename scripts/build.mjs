#!/usr/bin/env node

/**
 * build.mjs
 *
 * Builds packages/cursor-velt and packages/claude-velt from packages/shared.
 * - Copies skills with platform-specific frontmatter
 * - Converts rules to .mdc (Cursor) and guides/velt-rules.md (Claude)
 * - Copies agent persona with platform-specific frontmatter
 * - Copies reference agent-skills into both plugin outputs
 * - Copies assets
 */

import { existsSync, readFileSync, writeFileSync, cpSync, rmSync, mkdirSync, readdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const SHARED = resolve(ROOT, "packages", "shared");
const CURSOR = resolve(ROOT, "packages", "cursor-velt");
const CLAUDE = resolve(ROOT, "packages", "claude-velt");
const MARKETPLACE = resolve(ROOT, "packages", "claude-marketplace");

// ─── Skill definitions ───────────────────────────────────────────────────────

const SKILLS = [
  "install-velt",
  "add-comments",
  "add-crdt",
  "add-notifications",
  "add-presence",
  "add-cursors",
  "screenshot",
  "velt-help",
];

const SKILL_DESCRIPTIONS = {
  "install-velt": "Full guided installation of the Velt collaboration SDK into a React or Next.js project.",
  "add-comments": "Add collaborative commenting features (freestyle, popover, text, stream, page, editor-integrated) to your app.",
  "add-crdt": "Add real-time collaborative editing using Velt CRDT with Tiptap, BlockNote, CodeMirror, or ReactFlow.",
  "add-notifications": "Add in-app notifications, email (SendGrid), and webhook integrations.",
  "add-presence": "Add real-time user presence indicators showing who is active on a page.",
  "add-cursors": "Add live cursor tracking to show real-time cursor positions of other users.",
  "screenshot": "Capture a screenshot of the running application for visual reference or comment placement analysis.",
  "velt-help": "Answer questions about Velt features, best practices, and SDK usage.",
};

// ─── Rule definitions ────────────────────────────────────────────────────────

const RULES_SRC = resolve(SHARED, "rules-src");

const CURSOR_RULE_CONFIG = [
  { file: "velt-core.md", mdc: "velt-core-setup.mdc", alwaysApply: true, globs: null },
  { file: "velt-auth.md", mdc: "velt-auth-patterns.mdc", alwaysApply: true, globs: null },
  { file: "velt-document-identity.md", mdc: "velt-document-identity.mdc", alwaysApply: true, globs: null },
  { file: "velt-comments.md", mdc: "velt-comments-patterns.mdc", alwaysApply: false, globs: '["**/*comment*", "**/*velt*", "**/*Comment*"]' },
  { file: "velt-crdt.md", mdc: "velt-crdt-patterns.mdc", alwaysApply: false, globs: '["**/*editor*", "**/*crdt*", "**/*tiptap*", "**/*Editor*"]' },
  { file: "velt-notifications.md", mdc: "velt-notifications-patterns.mdc", alwaysApply: false, globs: '["**/*notification*", "**/*Notification*"]' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

function readSharedContent(skillName) {
  const contentPath = resolve(SHARED, "skills-src", skillName, "content.md");
  if (!existsSync(contentPath)) {
    console.warn(`[build] WARNING: Missing ${contentPath}`);
    return `# ${skillName}\n\nSkill content not yet generated. Run sync first.`;
  }
  return readFileSync(contentPath, "utf-8");
}

function readRuleContent(filename) {
  const rulePath = resolve(RULES_SRC, filename);
  if (!existsSync(rulePath)) {
    console.warn(`[build] WARNING: Missing ${rulePath}`);
    return `# ${filename}\n\nRule content not yet generated.`;
  }
  return readFileSync(rulePath, "utf-8");
}

function readAgentContent() {
  const agentPath = resolve(SHARED, "agents-src", "velt-expert.md");
  if (!existsSync(agentPath)) {
    console.warn(`[build] WARNING: Missing ${agentPath}`);
    return "# Velt Expert\n\nAgent content not yet generated.";
  }
  return readFileSync(agentPath, "utf-8");
}

// ─── Build Cursor Skills ─────────────────────────────────────────────────────

function buildCursorSkills() {
  console.log("[build] Building Cursor skills...");
  for (const skill of SKILLS) {
    const content = readSharedContent(skill);
    const desc = SKILL_DESCRIPTIONS[skill];
    const frontmatter = `---\nname: ${skill}\ndescription: ${desc}\n---\n\n`;
    const outDir = resolve(CURSOR, "skills", skill);
    ensureDir(outDir);
    writeFileSync(resolve(outDir, "SKILL.md"), frontmatter + content);
  }
}

// ─── Build Cursor Rules ──────────────────────────────────────────────────────

function buildCursorRules() {
  console.log("[build] Building Cursor rules...");
  const rulesDir = resolve(CURSOR, "rules");
  ensureDir(rulesDir);

  for (const rule of CURSOR_RULE_CONFIG) {
    const content = readRuleContent(rule.file);
    let frontmatter = `---\ndescription: Velt best practices - ${rule.file.replace(".md", "").replace("velt-", "")}\nalwaysApply: ${rule.alwaysApply}\n`;
    if (rule.globs) {
      frontmatter += `globs: ${rule.globs}\n`;
    }
    frontmatter += `---\n\n`;
    writeFileSync(resolve(rulesDir, rule.mdc), frontmatter + content);
  }
}

// ─── Build Cursor Agent ──────────────────────────────────────────────────────

function buildCursorAgent() {
  console.log("[build] Building Cursor agent...");
  const agentContent = readAgentContent();
  const frontmatter = `---\nname: velt-expert\ndescription: Velt collaboration SDK expert for architecture, setup, and integration guidance.\n---\n\n`;
  const agentsDir = resolve(CURSOR, "agents");
  ensureDir(agentsDir);
  writeFileSync(resolve(agentsDir, "velt-expert.md"), frontmatter + agentContent);
}

// ─── Build Claude Skills ─────────────────────────────────────────────────────

function buildClaudeSkills() {
  console.log("[build] Building Claude skills...");
  const rulesRef = "\n\n---\n**Important**: Always consult `guides/velt-rules.md` for embedded best practices before querying external sources.\n";

  for (const skill of SKILLS) {
    const content = readSharedContent(skill);
    const desc = SKILL_DESCRIPTIONS[skill];
    const frontmatter = `---\ndescription: ${desc}\n---\n\n`;
    const outDir = resolve(CLAUDE, "skills", skill);
    ensureDir(outDir);
    writeFileSync(resolve(outDir, "SKILL.md"), frontmatter + content + rulesRef);
  }
}

// ─── Build Claude Agent ──────────────────────────────────────────────────────

function buildClaudeAgent() {
  console.log("[build] Building Claude agent...");
  const agentContent = readAgentContent();
  const frontmatter = `---\nname: velt-expert\ndescription: Velt collaboration SDK expert for architecture, setup, and integration guidance.\n---\n\n`;
  const agentsDir = resolve(CLAUDE, "agents");
  ensureDir(agentsDir);
  writeFileSync(resolve(agentsDir, "velt-expert.md"), frontmatter + agentContent + "\n\n**Important**: Always consult `guides/velt-rules.md` for embedded best practices.\n");
}

// ─── Build Claude Rules Guide ────────────────────────────────────────────────

function buildClaudeRulesGuide() {
  console.log("[build] Building Claude rules guide...");
  const guidesDir = resolve(CLAUDE, "guides");
  ensureDir(guidesDir);

  let combined = "# Velt Best Practices Guide\n\n";
  combined += "This guide contains distilled best practices from the Velt agent-skills. ";
  combined += "All skills and the velt-expert agent should consult this guide as the primary source of truth.\n\n";
  combined += "## Priority Chain\n";
  combined += "1. **This guide** (embedded rules) — always check first\n";
  combined += "2. **Installed agent-skills** (velt-setup-best-practices, velt-comments-best-practices, velt-crdt-best-practices, velt-notifications-best-practices) — detailed patterns\n";
  combined += "3. **velt-docs MCP** — query for anything not covered above\n\n";
  combined += "---\n\n";

  for (const rule of CURSOR_RULE_CONFIG) {
    const content = readRuleContent(rule.file);
    combined += content + "\n\n---\n\n";
  }

  writeFileSync(resolve(guidesDir, "velt-rules.md"), combined);
}

// ─── Copy References ─────────────────────────────────────────────────────────

function copyReferences() {
  console.log("[build] Copying reference agent-skills...");
  const sharedRef = resolve(SHARED, "references", "agent-skills");

  if (!existsSync(sharedRef)) {
    console.warn("[build] WARNING: No reference agent-skills found. Run 'npm run sync' first.");
    return;
  }

  // Copy to Cursor
  const cursorRef = resolve(CURSOR, "references", "agent-skills");
  if (existsSync(cursorRef)) rmSync(cursorRef, { recursive: true, force: true });
  ensureDir(cursorRef);
  cpSync(sharedRef, cursorRef, { recursive: true });

  // Copy to Claude
  const claudeRef = resolve(CLAUDE, "references", "agent-skills");
  if (existsSync(claudeRef)) rmSync(claudeRef, { recursive: true, force: true });
  ensureDir(claudeRef);
  cpSync(sharedRef, claudeRef, { recursive: true });
}

// ─── Copy Assets ─────────────────────────────────────────────────────────────

function copyAssets() {
  console.log("[build] Copying assets...");
  // Logo is already in cursor-velt/assets/ (static file, not generated)
}

// ─── Build Claude Marketplace ────────────────────────────────────────────────

function buildClaudeMarketplace() {
  console.log("[build] Building Claude marketplace...");
  const marketplacePluginDir = resolve(MARKETPLACE, "plugins", "velt");
  if (existsSync(marketplacePluginDir)) rmSync(marketplacePluginDir, { recursive: true, force: true });
  ensureDir(marketplacePluginDir);
  cpSync(CLAUDE, marketplacePluginDir, { recursive: true });
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  console.log("[build] Starting build...\n");

  buildCursorSkills();
  buildCursorRules();
  buildCursorAgent();

  buildClaudeSkills();
  buildClaudeAgent();
  buildClaudeRulesGuide();

  // NOTE: Reference agent-skills are no longer bundled in the plugin.
  // Users install them via `npx skills add velt-js/agent-skills`.
  // Skills reference them by name, not by bundled path.
  copyAssets();
  buildClaudeMarketplace();

  console.log("\n[build] Build complete.");
  console.log("[build] Cursor plugin: packages/cursor-velt/");
  console.log("[build] Claude plugin: packages/claude-velt/");
  console.log("[build] Claude marketplace: packages/claude-marketplace/");
}

main();
