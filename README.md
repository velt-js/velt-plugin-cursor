# Velt Plugin

A plugin framework that produces **two installable plugins** for the [Velt](https://velt.dev) collaboration SDK:

1. **Cursor plugin** (`packages/cursor-velt/`) — installable via the Cursor marketplace
2. **Claude Code plugin** (`packages/claude-velt/`) — installable via Claude Code's plugin system

Both plugins bundle:
- **Skills** (slash commands): `/install-velt`, `/add-comments`, `/add-crdt`, `/add-notifications`, `/add-presence`, `/add-cursors`, `/screenshot`, `/velt-help`
- **Agent persona**: `velt-expert` — a Velt SDK expert for architecture and integration guidance
- **MCP servers**:
  - `velt-installer` — guided Velt installation via `@velt-js/mcp-installer`
  - `velt-docs` — Velt documentation search via `https://docs.velt.dev/mcp`
- **Embedded rules** — distilled best practices from the [Velt agent-skills](https://github.com/velt-js/agent-skills) (105 rules condensed into 6 high-signal guides)
- **Reference agent-skills** — vendored snapshot of the full agent-skills repository for deep lookup

## Quick Start

```bash
# 1. Sync the agent-skills reference (one-time, or when agent-skills updates)
npm run sync

# 2. Build both plugins from shared source
npm run build

# 3. Validate both plugins
npm run validate

# Or run all three:
npm run all
```

## Install Locally

### Cursor

Point Cursor at the built plugin directory:

1. Open Cursor Settings
2. Go to Plugins
3. Add local plugin path: `<repo>/packages/cursor-velt`

Or via the marketplace CLI:
```
# From within Cursor
/plugin marketplace add ./packages/cursor-velt
```

### Claude Code

**Option A: Direct plugin directory**
```bash
claude --plugin-dir packages/claude-velt
```

**Option B: Via local marketplace**
```bash
# Inside Claude Code:
/plugin marketplace add ./packages/claude-marketplace
/plugin install velt@velt-plugin
```

## Architecture

```
velt-plugin/
├── packages/
│   ├── shared/                     # Single source of truth
│   │   ├── skills-src/             # Canonical skill content (8 skills)
│   │   ├── rules-src/              # Canonical rule content (6 rule files)
│   │   ├── agents-src/             # Canonical agent persona
│   │   └── references/
│   │       └── agent-skills/       # Vendored snapshot (synced from source)
│   │
│   ├── cursor-velt/                # Built Cursor plugin
│   │   ├── .cursor-plugin/plugin.json
│   │   ├── mcp.json                # Both MCP servers
│   │   ├── skills/*/SKILL.md       # 8 skills with Cursor frontmatter
│   │   ├── rules/*.mdc             # 6 rules with Cursor frontmatter
│   │   ├── agents/velt-expert.md
│   │   ├── assets/logo.svg
│   │   └── references/agent-skills/
│   │
│   ├── claude-velt/                # Built Claude Code plugin
│   │   ├── .claude-plugin/plugin.json
│   │   ├── .mcp.json               # Both MCP servers
│   │   ├── skills/*/SKILL.md       # 8 skills with Claude frontmatter
│   │   ├── agents/velt-expert.md
│   │   ├── guides/velt-rules.md    # Combined rules guide
│   │   └── references/agent-skills/
│   │
│   └── claude-marketplace/         # Optional marketplace wrapper
│       ├── .claude-plugin/marketplace.json
│       └── plugins/velt/           # Copy of claude-velt
│
└── scripts/
    ├── sync-agent-skills.mjs       # Copies agent-skills repo into shared/references
    ├── build.mjs                   # Generates both plugins from shared source
    └── validate.mjs                # Validates both plugins are complete
```

## Skills Reference

| Skill | Description | MCP Tool Used |
|-------|-------------|---------------|
| `/install-velt` | Full guided Velt SDK installation | `install_velt_interactive` |
| `/add-comments` | Add comments (freestyle, popover, text, stream, page, editor) | `install_velt_interactive` |
| `/add-crdt` | Add CRDT collaborative editing (Tiptap, BlockNote, CodeMirror, ReactFlow) | `install_velt_interactive` |
| `/add-notifications` | Add in-app notifications, email, webhooks | `install_velt_interactive` |
| `/add-presence` | Add real-time user presence indicators | `install_velt_interactive` |
| `/add-cursors` | Add live cursor tracking | `install_velt_interactive` |
| `/screenshot` | Capture app screenshot for visual reference | `take_project_screenshot` |
| `/velt-help` | Answer questions about Velt SDK | velt-docs MCP |

## Priority Chain

All skills and the velt-expert agent follow this priority chain when answering questions or making decisions:

1. **Embedded rules** (always loaded) — distilled best practices from 105 agent-skills rules
2. **Reference agent-skills** (`/references/agent-skills/`) — full detailed patterns with code examples
3. **velt-docs MCP** — query for anything not covered above, or for the latest API details

## Embedded Rules

| Rule | Covers | Always Active |
|------|--------|:------------:|
| `velt-core-setup` | Installation, VeltProvider, API key, domain safelist | Yes |
| `velt-auth-patterns` | User object, authProvider, JWT, provider mapping | Yes |
| `velt-document-identity` | setDocuments, document ID strategies, anti-patterns | Yes |
| `velt-comments-patterns` | All comment modes, component placement | Glob-triggered |
| `velt-crdt-patterns` | CRDT stores, Tiptap integration, history disable | Glob-triggered |
| `velt-notifications-patterns` | Setup, panel config, hooks, email, webhooks | Glob-triggered |

## Scripts

### `npm run sync`
Copies the agent-skills repository into `packages/shared/references/agent-skills/`.

Default source: `../agent-skills` (sibling directory). Override with:
```bash
node scripts/sync-agent-skills.mjs /path/to/agent-skills
```

### `npm run build`
Generates both plugin outputs from shared source:
- Adds platform-specific frontmatter to skills and agents
- Converts rules to `.mdc` (Cursor) and `guides/velt-rules.md` (Claude)
- Copies reference agent-skills into both plugins
- Builds the Claude marketplace wrapper

### `npm run validate`
Checks both plugins for completeness:
- All 8 skills present in both
- Both MCP servers configured in both
- Agent persona present in both
- JSON manifests valid and free of path traversal
- Reference agent-skills present

## License

MIT
