---
name: screenshot
description: Capture a screenshot of the running application for visual reference or comment placement analysis.
---

# Screenshot

Capture a screenshot of the running application for visual reference.

## Trigger
Use when the user wants to see the current state of their app, identify UI areas for comment placement, or verify visual changes after Velt integration.

## Workflow

1. Ensure the app is running (default: localhost:3000).
2. Use the `take_project_screenshot` MCP tool.
3. Display the screenshot to the user.
4. If needed, use `detect_comment_placement` to analyze the UI for optimal comment locations.

## Guardrails
- App must be running on localhost before taking screenshot.
- Default URL is http://localhost:3000 — ask user if their dev server uses a different port.
- Screenshot uses Playwright — it may need to be installed first.

## Output
- Screenshot of the running application
- Optional: recommended comment placement locations
