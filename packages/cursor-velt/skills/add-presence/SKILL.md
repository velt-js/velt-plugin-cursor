---
name: add-presence
description: Add real-time user presence indicators showing who is active on a page.
---

# Add Presence

Add real-time user presence indicators to a React or Next.js application.

## Trigger
Use when the user wants to show who is currently viewing or active on a page/document.

## Workflow

1. Verify Velt is set up. If not, run /install-velt first.
2. Use the `install_velt_interactive` MCP tool with presence feature.
3. Follow the guided flow (plan → approve → apply).

## Guardrails
- No dedicated agent-skill exists for presence. Use velt-docs MCP as primary reference.
- Query velt-docs MCP with: "How to add Velt presence to a React app?"
- VeltPresence component shows user avatars of active users.
- Presence is scoped to the current document (set via setDocuments).

## Output
- VeltPresence component added to UI
- Active user avatars displayed
- Presence updates in real-time
