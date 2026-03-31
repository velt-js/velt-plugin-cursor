---
name: install-velt
description: Full guided installation of the Velt collaboration SDK into a React or Next.js project.
---

# Install Velt

Full guided installation of the Velt collaboration SDK into a React or Next.js project.

## Trigger
Use when the user wants to set up Velt from scratch, add Velt to an existing project, or install multiple Velt features at once.

## Workflow

1. Ask the user which features they want: Comments, Presence, Cursors, Notifications, Recorder, CRDT (collaborative editing). If unsure, recommend starting with Comments + Presence.
2. Call the `install_velt_interactive` MCP tool in **guided** mode with `stage: "plan"`.
   - If the tool returns `awaiting_discovery_consent`: ask the user YES/NO for codebase scanning.
   - If the tool returns `awaiting_discovery_verification`: show scan results, ask the user to verify.
   - If the tool returns `awaiting_manual_wiring_answers`: present the questionnaire to the user.
   - If the tool returns `plan_generated`: show the plan and ask for approval.
3. Follow the MCP plan exactly — it will tell you which skill files to READ and in what order. Each step has a "READ FIRST:" directive pointing to a specific skill rule file. Read that file, then implement following its patterns.
4. After implementing, run `npm run build` to verify. If the build fails, read the error, fix it, and rebuild.
5. Call `install_velt_interactive` with `stage: "apply"` for final validation.
6. Report validation results.

## Key Clarifications
- "TipTap Comments" = TiptapVeltComments extension with BubbleMenu (editor-integrated). This is NOT freestyle pin comments on a page with TipTap.
- VeltProvider goes in page.tsx, NOT layout.tsx (Next.js App Router).
- If unsure about DocumentId or auth source, ask the user — never guess.
- ALWAYS ask ONE question at a time — never batch questions.

## Output
- Fully installed and configured Velt SDK
- Working VeltProvider with auth
- Document identity configured
- Selected features integrated
- Validation results
