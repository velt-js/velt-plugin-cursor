# Velt Plugin for Cursor

Add real-time collaboration (comments, presence, cursors, CRDT editing, notifications) to React and Next.js apps using AI-assisted setup.

## What You Get

- **8 slash commands**: `/install-velt`, `/add-comments`, `/add-crdt`, `/add-notifications`, `/add-presence`, `/add-cursors`, `/screenshot`, `/velt-help`
- **4 agent-skills**: 118 implementation rules for setup, comments, CRDT, and notifications
- **Velt Expert agent**: specialized AI persona for Velt architecture guidance
- **6 embedded rules**: always-on best practices for setup, auth, document identity, comments, CRDT, notifications
- **MCP servers**: velt-installer (guided setup) + velt-docs (documentation search)

## Architecture

The plugin is a **combo meal** — each component has a clear, non-overlapping role:

| Component | Role | What it does |
|-----------|------|-------------|
| **MCP Installer** | Orchestrator | WHAT to do, WHEN, in what ORDER. Generates installation plans with "READ FIRST:" directives pointing to specific skill files. |
| **Skills (agent-skills)** | Knowledge base | HOW to implement. Contains exact code patterns, import paths, extension ordering, CSS. Skills are the single source of truth for implementation. |
| **CLI** (`@velt-js/add-velt`) | Scaffolding | Quick-start code generation — login, VeltProvider setup, user auth boilerplate. |
| **Velt Docs MCP** | Fallback only | ONLY used when skills don't cover a topic. Never used during installation if skills exist. |
| **Slash command skills** | Triggers | Thin wrappers that invoke the MCP installer and tell Cursor to follow its plan. |

## Quick Start

1. Install the plugin in Cursor
2. Open a React or Next.js project
3. Type `/install-velt` in the chat
4. Follow the guided setup

## Installing Skills to Cursor

Cursor reads skills from `~/.cursor/skills/`, NOT from the plugin directory. After building the plugin, you must deploy skills to Cursor:

```bash
npm run deploy        # Copy skills to ~/.cursor/skills/
```

Or manually:
```bash
npm run build         # Build plugin from source
npm run deploy        # Deploy to Cursor
```

This also runs automatically as part of `npm run all`.

### Why is this needed?

Cursor does not load skills directly from plugin directories. It reads from `~/.cursor/skills/` which is a separate location. Without deploying, Cursor uses stale copies of the skills.

Agent-skills (velt-setup-best-practices, etc.) are handled separately — they're installed via `npx skills add velt-js/agent-skills` and symlinked into `~/.cursor/skills/` automatically.

## Development

```bash
npm run sync      # Copy agent-skills from ../agent-skills
npm run build     # Build plugin from packages/shared source
npm run deploy    # Deploy skills to ~/.cursor/skills/
npm run validate  # Validate plugin completeness
npm run all       # sync + build + deploy + validate
```

## Issues We Found & Fixed

### 1. Cursor reads skills from `~/.cursor/skills/`, not the plugin directory

**Problem:** After building the plugin, Cursor ignored the updated skills in the repo and used stale copies from `~/.cursor/skills/` (installed separately in Feb 2026). All our changes to skill SKILL.md files had no effect.

**Root cause:** Cursor loads skills from `~/.cursor/skills/`, not from plugin directories. The plugin's `skills/` directory is only used by the build system.

**Fix:** Added `npm run deploy` (scripts/deploy-skills.mjs) which copies built skills to `~/.cursor/skills/`. This is now part of `npm run all`.

### 2. MCP installer was cached via npx

**Problem:** After updating the MCP installer and publishing to npm, Cursor still used the old version because npx caches packages.

**Fix:** Clear the npx cache after publishing: `rm -rf ~/.npm/_npx`

### 3. Skills competed with MCP for orchestration

**Problem:** The install-velt SKILL.md had its own "BLOCKING PREREQUISITE" workflow, priority chain, and rule-reading checklist that competed with the MCP installer's plan output. The velt-expert agent also tried to orchestrate independently. Cursor couldn't follow 4 competing instruction sets.

**Fix:** Simplified all skills to thin MCP wrappers ("call MCP, follow its plan"). MCP is now the single orchestrator, skills are the single knowledge base.

### 4. onMouseDown vs onClick in TipTap BubbleMenu

**Problem:** Cursor generated `onMouseDown` for BubbleMenu comment buttons despite the TipTap-specific rules and MCP code examples all using `onClick`.

**Root cause:** The MCP plan directed Cursor to "READ `AGENTS.md` → look up `mode-tiptap`". When Cursor read the AGENTS.md index, it saw all 12 comment mode rules listed together. 6 of the 7 editor mode rules (Lexical, Slate, Plate, Quill, Ace, CodeMirror) use `onMouseDown` in their code examples — only mode-tiptap uses `onClick`. Cursor picked up the majority pattern from the wrong rules.

**Fix:** Changed the MCP plan to reference **specific rule file paths** (e.g., `skills/velt-crdt-best-practices/rules/shared/tiptap/tiptap-comments-integration.md`) instead of the AGENTS.md index. Added "Do NOT read other editor mode rules" directive to prevent cross-contamination.

### 5. `history: false` vs `undoRedo: false`

**Problem:** Source rule files and the velt-expert agent said `StarterKit.configure({ history: false })` which is the Tiptap v2 API. Tiptap v3 renamed it to `undoRedo: false`.

**Fix:** Updated all source files. Grep for `history: false` returns 0 hits (only appears in "do NOT use" context).

## Structure

```
velt-plugin/                    (repo root = plugin root)
├── .plugin/plugin.json         # Open Plugins manifest
├── .cursor-plugin/plugin.json  # Cursor compat manifest
├── .mcp.json                   # MCP server registration
├── skills/                     # 8 plugin skills + 4 bundled agent-skills
├── rules/                      # 6 embedded .mdc rules
├── agents/                     # velt-expert agent
├── guides/                     # Embedded best practices reference
├── assets/                     # Logo
└── scripts/
    ├── build.mjs               # Generate manifests and MCP config
    ├── deploy-skills.mjs       # Deploy skills to ~/.cursor/skills/
    ├── sync-agent-skills.mjs   # Sync agent-skills from sibling repo
    └── validate.mjs            # Validate plugin completeness
```

## Related

- [Velt Plugin for Claude Code](https://github.com/velt-js/velt-plugin-claude)
- [Velt Agent Skills](https://github.com/velt-js/agent-skills) (118 implementation rules)
- [Velt MCP Installer](https://www.npmjs.com/package/@velt-js/mcp-installer)
- [Velt CLI](https://www.npmjs.com/package/@velt-js/add-velt)
- [Velt Documentation](https://docs.velt.dev)

## License

MIT
