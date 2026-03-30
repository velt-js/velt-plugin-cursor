# Velt Plugin for Cursor

Add real-time collaboration (comments, presence, cursors, CRDT editing, notifications) to React and Next.js apps using AI-assisted setup.

## What You Get

- **8 slash commands**: `/install-velt`, `/add-comments`, `/add-crdt`, `/add-notifications`, `/add-presence`, `/add-cursors`, `/screenshot`, `/velt-help`
- **4 agent-skills**: 118 implementation rules for setup, comments, CRDT, and notifications
- **Velt Expert agent**: specialized AI persona for Velt architecture guidance
- **6 embedded rules**: always-on best practices for setup, auth, document identity, comments, CRDT, notifications
- **MCP servers**: velt-installer (guided setup) + velt-docs (documentation search)

## Quick Start

1. Install the plugin in Cursor
2. Open a React or Next.js project
3. Type `/install-velt` in the chat
4. Follow the guided setup

## Recommended: Install Agent Skills

For the best results, also install the Velt agent-skills library:

```bash
npx skills add velt-js/agent-skills
```

## Development

```bash
npm run sync      # Copy agent-skills from ../agent-skills
npm run build     # Build plugin from packages/shared source
npm run validate  # Validate plugin completeness
npm run all       # All three in sequence
```

## Structure

```
velt-plugin/                    (repo root = plugin root)
├── .plugin/plugin.json         # Open Plugins manifest
├── .cursor-plugin/plugin.json  # Cursor compat manifest
├── .mcp.json                   # MCP server registration
├── skills/                     # 8 plugin skills + 4 bundled agent-skills
├── rules/                      # 6 embedded .mdc rules
├── agents/                     # velt-expert agent
├── assets/                     # Logo
└── packages/shared/            # Source of truth for build
```

## Related

- [Velt Plugin for Claude Code](https://github.com/velt-js/velt-plugin-claude)
- [Velt Agent Skills](https://github.com/velt-js/agent-skills) (118 implementation rules)
- [Velt MCP Installer](https://www.npmjs.com/package/@velt-js/mcp-installer)
- [Velt CLI](https://www.npmjs.com/package/@velt-js/add-velt)
- [Velt Documentation](https://docs.velt.dev)

## License

MIT
