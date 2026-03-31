---
name: add-comments
description: Add collaborative commenting features (freestyle, popover, text, stream, page, editor-integrated) to your app.
---

# Add Comments

Add collaborative commenting to a React or Next.js application.

## Trigger
Use when the user wants to add any type of comment feature: freestyle (click-anywhere), popover (cell/element-bound), text (highlight), stream (Google Docs-style), page (sidebar), or editor-integrated (TipTap, Lexical, Slate).

## Workflow

1. Ask which comment mode the user wants. Explain the options briefly:
   - **Freestyle**: Click anywhere to pin comments (default, good for design feedback)
   - **Popover**: Google Sheets-style, bound to specific elements
   - **Text**: Highlight text to comment (Google Docs-style)
   - **Stream**: Comments in side column, scroll-synced with content
   - **Page**: Page-level comments via sidebar
   - **TipTap/Lexical/Slate**: Editor-integrated text comments
2. Verify Velt is set up (VeltProvider, auth, document). If not, run /install-velt first.
3. Call the `install_velt_interactive` MCP tool with the selected comment type.
4. Follow the MCP plan — it tells you which skill files to read and in what order.
5. Validate the installation.

## Disambiguation
- "TipTap Comments" = `TiptapVeltComments` extension with BubbleMenu inside the editor. Users select text and add comments within the editor.
- "Freestyle" = `VeltComments + VeltCommentTool` (click anywhere on page to pin a comment). Comments float on top of the page.
- These are completely different implementations. If the user says both "TipTap" and "freestyle", ask which they mean.

## Output
- VeltComments component added with correct mode
- Comment tool/trigger added to UI
- Comment sidebar configured (if applicable)
- Working comment creation and display
