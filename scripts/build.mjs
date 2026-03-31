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
const CURSOR = ROOT; // Output directly to repo root

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
  { file: "velt-core.md", mdc: "velt-core-setup.mdc", alwaysApply: true, globs: null, description: "Velt SDK setup, VeltProvider configuration, API key, and domain safelist patterns" },
  { file: "velt-auth.md", mdc: "velt-auth-patterns.mdc", alwaysApply: true, globs: null, description: "Velt authentication patterns including user object shape, authProvider, and JWT generation" },
  { file: "velt-document-identity.md", mdc: "velt-document-identity.mdc", alwaysApply: true, globs: null, description: "Velt document identity patterns including setDocuments, document ID strategies" },
  { file: "velt-comments.md", mdc: "velt-comments-patterns.mdc", alwaysApply: true, globs: null, description: "Velt Comments patterns for all modes including TipTap editor integration with BubbleMenu" },
  { file: "velt-crdt.md", mdc: "velt-crdt-patterns.mdc", alwaysApply: true, globs: null, description: "Velt CRDT + Tiptap integration patterns including complete editor component, cursor CSS, and critical rules" },
  { file: "velt-notifications.md", mdc: "velt-notifications-patterns.mdc", alwaysApply: false, globs: '["**/*notification*", "**/*Notification*"]', description: "Velt Notifications setup including panel configuration, email, and webhooks" },
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
    const desc = rule.description || `Velt best practices - ${rule.file.replace(".md", "").replace("velt-", "")}`;
    let frontmatter = `---\ndescription: ${desc}\nalwaysApply: ${rule.alwaysApply}\n`;
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

// ─── Build Cursor Manifest & MCP Config ─────────────────────────────────────

function buildCursorManifestAndMcp() {
  console.log("[build] Building Cursor manifest and MCP config...");

  const manifest = {
    name: "velt",
    version: "1.0.0",
    description: "Add real-time collaboration (comments, presence, cursors, CRDT editing, notifications) to React and Next.js apps.",
    author: {
      name: "Velt",
      email: "support@velt.dev",
      url: "https://velt.dev",
    },
    homepage: "https://docs.velt.dev",
    repository: "https://github.com/velt-js/velt-plugin",
    license: "MIT",
    logo: "assets/velt.svg",
    keywords: [
      "velt", "collaboration", "comments", "presence", "cursors",
      "crdt", "real-time", "react", "nextjs", "tiptap",
      "codemirror", "notifications",
    ],
    skills: "./skills/",
    rules: "./rules/",
    agents: "./agents/",
    mcpServers: ".mcp.json",
  };

  const mcpConfig = {
    mcpServers: {
      "velt-installer": {
        command: "npx",
        args: ["-y", "@velt-js/mcp-installer"],
      },
      "velt-docs": {
        url: "https://docs.velt.dev/mcp",
      },
    },
  };

  // Write vendor-neutral manifest (.plugin/plugin.json)
  const pluginDir = resolve(CURSOR, ".plugin");
  ensureDir(pluginDir);
  writeFileSync(resolve(pluginDir, "plugin.json"), JSON.stringify(manifest, null, 2) + "\n");

  // Write backward-compat Cursor manifest (.cursor-plugin/plugin.json)
  const cursorPluginDir = resolve(CURSOR, ".cursor-plugin");
  ensureDir(cursorPluginDir);
  writeFileSync(resolve(cursorPluginDir, "plugin.json"), JSON.stringify(manifest, null, 2) + "\n");

  // Write MCP config as .mcp.json (Open Plugins standard)
  writeFileSync(resolve(CURSOR, ".mcp.json"), JSON.stringify(mcpConfig, null, 2) + "\n");

  // Remove old mcp.json if it exists
  const oldMcp = resolve(CURSOR, "mcp.json");
  if (existsSync(oldMcp)) {
    rmSync(oldMcp);
  }
}

// ─── Copy Assets ─────────────────────────────────────────────────────────────

function copyAssets() {
  console.log("[build] Copying assets...");
  // Logo is already in cursor-velt/assets/velt.svg (static file, not generated)
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  console.log("[build] Starting build...\n");

  buildCursorSkills();
  buildCursorRules();
  buildCursorAgent();
  buildCursorManifestAndMcp();
  copyAssets();

  console.log("\n[build] Build complete.");
  console.log("[build] Cursor plugin output: repo root");
}

main();
