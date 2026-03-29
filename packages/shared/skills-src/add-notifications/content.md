# Add Notifications

Add in-app notifications to a React or Next.js application.

## Trigger
Use when the user wants notification features: bell icon, notification panel, email notifications, or webhook integrations.

## Workflow

1. Verify Velt is set up. If not, run /install-velt first.
2. Use the `install_velt_interactive` MCP tool with notifications feature.
3. Follow the guided flow (plan → approve → apply).
4. Ask if they want email (SendGrid) or webhook integrations configured.

## Guardrails
- Notifications must be enabled in Velt Console FIRST (console.velt.dev > Configuration).
- VeltNotificationsTool provides the bell icon — place it in the toolbar/header.
- Use tabConfig to customize which tabs appear (forYou, all, documents).
- For email: requires SendGrid API key configured in Velt Console.
- Consult the installed **velt-notifications-best-practices** skill for detailed implementation patterns.

## Output
- VeltNotificationsTool added to UI
- Notification panel configured with appropriate tabs
- Email/webhook delivery set up (if requested)
