# Velt Plugin for Cursor

Add real-time collaboration (comments, presence, cursors, CRDT editing, notifications) to React and Next.js apps using AI-assisted setup.

## What You Get

When you install this plugin, Cursor gains:

- **8 slash commands**: `/install-velt`, `/add-comments`, `/add-crdt`, `/add-notifications`, `/add-presence`, `/add-cursors`, `/screenshot`, `/velt-help`
- **Velt Expert agent**: specialized AI persona for Velt architecture and integration guidance
- **Embedded best practices**: 6 always-on rules covering setup, auth, document identity, comments, CRDT, and notifications
- **MCP servers** (auto-registered):
  - `velt-installer` — AI-guided installation and codebase analysis
  - `velt-docs` — Velt documentation search

## Quick Start

1. Install the plugin in Cursor
2. Open a React or Next.js project
3. Type `/install-velt` in the chat
4. Follow the guided setup (API key, features, approval)

The installer will scaffold files, configure your project, and apply best practices automatically.

## Recommended: Install Agent Skills

For the best results, also install the Velt agent-skills library:

```bash
npx skills add velt-js/agent-skills
```

This gives the AI access to 118 detailed implementation rules covering Tiptap CRDT setup, cursor styling, SSR safety, JWT authentication, and more. Without it, the plugin falls back to its embedded rules (which are concise summaries).

## Available Commands

| Command | What it does |
|---------|-------------|
| `/install-velt` | Full guided Velt SDK installation |
| `/add-comments` | Add commenting (freestyle, popover, text, stream, page, editor-integrated) |
| `/add-crdt` | Add collaborative editing (Tiptap, BlockNote, CodeMirror, ReactFlow) |
| `/add-notifications` | Add in-app notifications, email, webhooks |
| `/add-presence` | Add user presence indicators |
| `/add-cursors` | Add live cursor tracking |
| `/screenshot` | Capture app screenshot for visual reference |
| `/velt-help` | Ask questions about Velt features and best practices |

## How It Works

```
You type /install-velt
    ↓
Plugin activates the install-velt skill
    ↓
Skill calls the velt-installer MCP server (auto-downloaded via npx)
    ↓
MCP server runs the Velt CLI to scaffold files
    ↓
MCP server scans your codebase for integration points
    ↓
AI generates an implementation plan referencing agent-skills rules
    ↓
You approve → AI applies the plan → validation runs
```

## Links

- [Velt Documentation](https://docs.velt.dev)
- [Velt Console](https://console.velt.dev) (get your API key)
- [Agent Skills](https://github.com/velt-js/agent-skills) (detailed implementation rules)
- [Velt MCP Installer](https://www.npmjs.com/package/@velt-js/mcp-installer)
- [Velt CLI](https://www.npmjs.com/package/@velt-js/add-velt)

## License

MIT
