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
3. Use the `install_velt_interactive` MCP tool with the selected comment type.
4. Follow the guided installation flow (plan → approve → apply).
5. Validate the installation.

## Guardrails
- Follow embedded velt-comments rules for correct component placement.
- For popover mode: every commentable element needs a unique ID + matching targetElementId.
- For editor integrations: MUST set `textMode={false}` on VeltComments.
- VeltCommentTool is required for freestyle mode — users can't initiate comments without it.
- Consult reference agent-skills at /references/agent-skills/skills/velt-comments-best-practices/ for detailed patterns.

## Output
- VeltComments component added with correct mode
- Comment tool/trigger added to UI
- Comment sidebar configured (if applicable)
- Working comment creation and display
