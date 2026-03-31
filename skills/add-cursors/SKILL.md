---
name: add-cursors
description: Add live cursor tracking to show real-time cursor positions of other users.
---

# Add Cursors

Add live cursor tracking to a React or Next.js application.

## Trigger
Use when the user wants to show real-time cursor positions of other users on the page.

## Workflow

1. Verify Velt is set up. If not, run /install-velt first.
2. Use the `install_velt_interactive` MCP tool with cursors feature.
3. Follow the MCP plan — it tells you which skill files to read.

## Cursor Types
There are two distinct cursor types — make sure you implement the right one:

- **Page-level cursors** (`VeltCursor` component): Shows mouse cursor positions of other users anywhere on the page. Use the MCP plan for setup.
- **Editor cursors** (Tiptap CRDT): Shows text cursor positions inside a Tiptap editor. The CSS for these is in `velt-crdt-best-practices` → `tiptap-cursor-css` rule. If the user has a Tiptap editor, read that rule and add the CSS to `globals.css`.

## Output
- VeltCursor component added (page-level cursors)
- And/or editor cursor CSS added (if Tiptap CRDT is in use)
- Live cursor positions displayed for all active users
