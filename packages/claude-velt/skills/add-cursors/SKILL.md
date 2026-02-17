---
description: Add live cursor tracking to show real-time cursor positions of other users.
---

# Add Cursors

Add live cursor tracking to a React or Next.js application.

## Trigger
Use when the user wants to show real-time cursor positions of other users on the page.

## Workflow

1. Verify Velt is set up. If not, run /install-velt first.
2. Use the `install_velt_interactive` MCP tool with cursors feature.
3. Follow the guided flow (plan → approve → apply).

## Guardrails
- No dedicated agent-skill exists for cursors. Use velt-docs MCP as primary reference.
- Query velt-docs MCP with: "How to add Velt cursors to a React app?"
- VeltCursor component renders remote user cursors.
- Cursors are scoped to the current document.

## Output
- VeltCursor component added
- Live cursor positions displayed for all active users
- Cursor labels showing user names


---
**Important**: Always consult `guides/velt-rules.md` for embedded best practices before querying external sources.
