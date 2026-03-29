# Install Velt

Full guided installation of the Velt collaboration SDK into a React or Next.js project.

## Trigger
Use when the user wants to set up Velt from scratch, add Velt to an existing project, or install multiple Velt features at once.

## Workflow

1. Ask the user which features they want: Comments, Presence, Cursors, Notifications, Recorder, CRDT (collaborative editing). If unsure, recommend starting with Comments + Presence.
2. Use the `install_velt_interactive` MCP tool in **guided** mode with `stage: "plan"`.
   - If the tool returns `awaiting_discovery_consent`: ask the user YES/NO for codebase scanning.
   - If the tool returns `awaiting_discovery_verification`: show scan results, ask the user to verify.
   - If the tool returns `awaiting_manual_wiring_answers`: present the questionnaire to the user.
   - If the tool returns `plan_generated`: show the plan and ask for approval.
3. Once approved, call `install_velt_interactive` with `stage: "apply"` and the verified wiring data.
4. After installation, run validation and report results.

## Guardrails
- ALWAYS ask ONE question at a time — never batch questions.
- If codebase scan is unsure about DocumentId or User identity, DO NOT guess. Ask the user explicitly:
  - Where should DocumentId come from? (route param, database ID, slug, etc.)
  - How is user identity determined? (auth provider, userId field, email, etc.)
  - Any multi-tenant/org context needed?
- Prefer embedded agent-skills guidance FIRST. Only query velt-docs MCP for missing info.
- VeltProvider goes in page.tsx, NOT layout.tsx for Next.js App Router.
- Ensure "use client" directive on all files importing from @veltdev/react.

## Priority Chain
1. Embedded rules (velt-core, velt-auth, velt-document-identity) — use these first
2. Installed agent-skills (velt-setup-best-practices, velt-comments-best-practices, velt-crdt-best-practices, velt-notifications-best-practices) — consult for detailed patterns
3. velt-docs MCP — query only for follow-up questions or features without embedded coverage

## Output
- Fully installed and configured Velt SDK
- Working VeltProvider with auth
- Document identity configured
- Selected features integrated
- Validation results
