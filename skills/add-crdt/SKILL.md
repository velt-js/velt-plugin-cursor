---
name: add-crdt
description: Add real-time collaborative editing using Velt CRDT with Tiptap, BlockNote, CodeMirror, or ReactFlow.
---

# Add CRDT

Add real-time collaborative editing using Velt CRDT (Yjs-backed).

## Trigger
Use when the user wants collaborative editing with Tiptap, BlockNote, CodeMirror, ReactFlow, or custom CRDT stores.

## Workflow

1. Ask which editor the user wants to make collaborative:
   - **Tiptap**: Rich text editor
   - **BlockNote**: Block-based editor
   - **CodeMirror**: Code editor
   - **ReactFlow**: Node-based diagrams
   - **Custom CRDT store**: Raw text/array/map/xml stores
2. Verify Velt is set up. If not, run /install-velt first.
3. Call the `install_velt_interactive` MCP tool with CRDT feature and the selected editor type.
4. Follow the MCP plan — it tells you which skill files to read (from `velt-crdt-best-practices`).

## Key Rules
- When using Tiptap, MUST disable undo/redo: `StarterKit.configure({ undoRedo: false })` (NOT `history`)
- Each editor instance needs a unique `editorId`.
- Add CSS for collaboration cursors (see `velt-crdt-best-practices` → `tiptap-cursor-css` rule).
- Choose the correct store type: text for plain text, xml for rich text editors, map for key-value, array for lists.

## Output
- CRDT packages installed
- Editor configured with Velt CRDT extension
- Collaboration cursors styled
- Real-time sync working between users
