#!/usr/bin/env node

/**
 * build.mjs
 *
 * Generates plugin manifests and MCP config.
 * Skills, rules, and agents are maintained directly — no intermediary source.
 */

import { existsSync, writeFileSync, rmSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

function buildManifestAndMcp() {
  console.log("[build] Generating manifests and MCP config...");

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
  const pluginDir = resolve(ROOT, ".plugin");
  ensureDir(pluginDir);
  writeFileSync(resolve(pluginDir, "plugin.json"), JSON.stringify(manifest, null, 2) + "\n");

  // Write backward-compat Cursor manifest (.cursor-plugin/plugin.json)
  const cursorPluginDir = resolve(ROOT, ".cursor-plugin");
  ensureDir(cursorPluginDir);
  writeFileSync(resolve(cursorPluginDir, "plugin.json"), JSON.stringify(manifest, null, 2) + "\n");

  // Write MCP config
  writeFileSync(resolve(ROOT, ".mcp.json"), JSON.stringify(mcpConfig, null, 2) + "\n");

  // Remove old mcp.json if it exists
  const oldMcp = resolve(ROOT, "mcp.json");
  if (existsSync(oldMcp)) {
    rmSync(oldMcp);
  }
}

function main() {
  console.log("[build] Starting build...\n");
  buildManifestAndMcp();
  console.log("\n[build] Build complete.");
}

main();
