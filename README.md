# Velt Plugin

IDE plugins for the [Velt](https://velt.dev) collaboration SDK. Produces installable plugins for **Cursor** and **Claude Code** that provide AI-assisted setup of real-time collaboration features.

## Pipeline

```
Plugin (this repo)          → context: skills, rules, agents, MCP registration
  ↓ registers
MCP Installer (@velt-js/mcp-installer) → orchestration: guided setup, codebase scanning, validation
  ↓ runs
CLI (@velt-js/add-velt)     → scaffolding: file generation, dependency installation
  ↓ references
Agent Skills (velt-js/agent-skills) → implementation truth: 118 detailed rules for all features
```

## What the Plugin Installs

When a user installs the Cursor or Claude plugin, they get:

| Component | Auto-installed? | Description |
|-----------|:-:|---|
| 8 slash commands | Yes | `/install-velt`, `/add-comments`, `/add-crdt`, `/add-notifications`, `/add-presence`, `/add-cursors`, `/screenshot`, `/velt-help` |
| Embedded rules | Yes | 6 always-on best-practice guides (setup, auth, document identity, comments, CRDT, notifications) |
| Velt Expert agent | Yes | AI persona specialized in Velt architecture |
| MCP Installer | Lazy | Downloaded on-demand via `npx` when a skill runs |
| Velt Docs MCP | Lazy | Documentation search via `docs.velt.dev/mcp` |
| CLI | Lazy | Downloaded on-demand via `npx` when MCP installer runs |
| Agent Skills | Manual | User runs `npx skills add velt-js/agent-skills` for detailed implementation rules |

## Quick Start (Development)

```bash
# Build both plugins from shared source
npm run build

# Validate both plugins
npm run validate

# Or both:
npm run all
```

## Install Locally

### Cursor

Point Cursor at the built plugin directory:

1. Open Cursor Settings → Plugins
2. Add local plugin path: `<repo>/packages/cursor-velt`

### Claude Code

```bash
claude --plugin-dir packages/claude-velt
```

## Architecture

```
velt-plugin/
├── packages/
│   ├── shared/                     # Single source of truth
│   │   ├── skills-src/             # Canonical skill content (8 skills)
│   │   ├── rules-src/              # Canonical rule content (6 rule files)
│   │   └── agents-src/             # Canonical agent persona
│   │
│   ├── cursor-velt/                # Built Cursor plugin (Open Plugins standard)
│   │   ├── .plugin/plugin.json     # Vendor-neutral manifest
│   │   ├── .cursor-plugin/plugin.json  # Cursor-compat manifest
│   │   ├── .mcp.json              # MCP server registration
│   │   ├── skills/*/SKILL.md      # 8 skills
│   │   ├── rules/*.mdc            # 6 embedded rules
│   │   ├── agents/velt-expert.md
│   │   └── assets/velt.svg
│   │
│   ├── claude-velt/                # Built Claude Code plugin
│   │   ├── .claude-plugin/plugin.json
│   │   ├── .mcp.json
│   │   ├── skills/*/SKILL.md      # 8 skills
│   │   ├── agents/velt-expert.md
│   │   └── guides/velt-rules.md   # Combined rules guide
│   │
│   └── claude-marketplace/         # Optional marketplace wrapper
│
└── scripts/
    ├── build.mjs                   # Generates both plugins from shared source
    └── validate.mjs                # Validates both plugins are complete
```

## Related Repositories

| Repository | npm Package | Role |
|-----------|------------|------|
| [velt-js/agent-skills](https://github.com/velt-js/agent-skills) | `npx skills add velt-js/agent-skills` | 118 implementation rules (canonical source of truth) |
| [velt-js/velt-mcp-installer](https://github.com/velt-js/velt-mcp-installer) | `@velt-js/mcp-installer` | MCP server for AI-guided installation |
| [velt-js/add-velt-next-js](https://github.com/velt-js/add-velt-next-js) | `@velt-js/add-velt` | CLI scaffolder for Velt files and dependencies |

## License

MIT
