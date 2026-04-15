---
name: install-velt
description: Full guided installation of the Velt collaboration SDK into a React or Next.js project.
---

# Install Velt

Full guided installation of the Velt collaboration SDK into a React or Next.js project.

## Trigger
Use when the user wants to set up Velt from scratch, add Velt to an existing project, or install multiple Velt features at once.

## Workflow

1. Ask the user which features they want: Comments, Presence, Cursors, Notifications, Recorder, CRDT (collaborative editing), Single Editor Mode, Self-Hosting Data, Activity Logs, Huddle. If unsure, recommend starting with Comments + Presence.
2. Call the `install_velt_interactive` MCP tool in **guided** mode with `stage: "plan"`.
   - If the tool returns `awaiting_discovery_consent`: ask the user YES/NO for codebase scanning.
   - If the tool returns `awaiting_discovery_verification`: show scan results, ask the user to verify.
   - If the tool returns `awaiting_manual_wiring_answers`: present the questionnaire to the user.
   - If the tool returns `plan_generated`: show the plan and ask for approval.
3. Follow the MCP plan exactly — it will tell you which skills to use. Each step has a "Use the X skill" directive. Invoke that skill, then implement following its rule patterns.
4. After implementing, run `npm run build` to verify. If the build fails, read the error, fix it, and rebuild.
5. Call `install_velt_interactive` with `stage: "apply"` for final validation.
6. Report validation results.

## Key Clarifications
- "TipTap Comments" = TiptapVeltComments extension with BubbleMenu (editor-integrated). This is NOT freestyle pin comments on a page with TipTap.
- VeltProvider goes in page.tsx, NOT layout.tsx (Next.js App Router).
- If unsure about DocumentId or auth source, ask the user — never guess.
- ALWAYS ask ONE question at a time — never batch questions.

## Feature-Specific Post-Install Verification

### Single Editor Mode (SEM)

After implementing SEM, verify ALL of the following before reporting success. The `core-setup` rule has 4 required sections — partial implementation breaks SEM:

**VeltCollaboration.tsx MUST contain:**
- [ ] `useLiveStateSyncUtils()` AND `useVeltInitState()` hooks
- [ ] `enableSingleEditorMode({ customMode: false, singleTabEditor: true })`
- [ ] `enableDefaultSingleEditorUI()`
- [ ] `singleEditorModeContainerIds(['document-content'])` — scopes SEM to content area
- [ ] `enableAutoSyncState()` — enables live content sync
- [ ] `setUserAsEditor()` auto-claim effect with all 3 error codes handled
- [ ] `<VeltSingleEditorModePanel shadowDom={false} />`
- [ ] Toolbar div uses `className="velt-toolbar"` (CSS class, not inline styles)

**Document page MUST contain:**
- [ ] `DocumentContent` as a SEPARATE inner component rendered INSIDE VeltProvider
- [ ] `useUserEditorState()` + `useEditor()` hooks inside DocumentContent
- [ ] Editor status banner — green (#dcfce7) when editor, yellow (#fef3c7) when viewer
- [ ] `<article id="document-content" contentEditable suppressContentEditableWarning data-velt-sync-access="true" data-velt-sync-state="true">`

**Playground page MUST exist:**
- [ ] `/app/playground/page.tsx` with side-by-side iframes for Alice (user-1) and Bob (user-2)

**CSS MUST include:**
- [ ] `.velt-toolbar` class with fixed positioning in globals.css
- [ ] Scoped background overrides: `.velt-toolbar velt-*-container { background: transparent !important; }`

If any item above is missing, go back and implement it before proceeding to the "apply" stage.

### Self-Hosting Data

After implementing self-hosting, verify ALL of the following:

**VeltDataProviders.ts MUST contain:**
- [ ] Comment provider with get/save/delete functions
- [ ] User provider with get function (read-only)
- [ ] Attachment provider with save/delete functions + base64 conversion
- [ ] Reaction provider with get/save/delete functions
- [ ] All providers return `{ data, success, statusCode }` format

**VeltProvider MUST have:**
- [ ] `dataProviders={{ comment, user, attachment, reaction }}` prop
- [ ] dataProviders set BEFORE identify() is called

**API routes MUST exist:**
- [ ] `app/api/velt/comments/get/route.ts`, `comments/save/route.ts`, `comments/delete/route.ts`
- [ ] `app/api/velt/users/get/route.ts` and `app/api/velt/users/save/route.ts` (save persists user PII on login)
- [ ] `app/api/velt/attachments/save/route.ts` and `attachments/delete/route.ts`
- [ ] `app/api/velt/attachments/get/[attachmentId]/route.ts` (serves stored files as binary)
- [ ] `app/api/velt/reactions/get/route.ts`, `reactions/save/route.ts`, `reactions/delete/route.ts`

**Database store MUST have:**
- [ ] PostgreSQL connection pool in `app/api/velt/store.ts`
- [ ] UPSERT semantics (ON CONFLICT DO UPDATE)
- [ ] Tables: comment_annotations, reaction_annotations, attachments, users
- [ ] Indexes on annotation_id, document_id, organization_id

**Environment:**
- [ ] `DATABASE_URL` in `.env.local`

If any item above is missing, go back and implement it before proceeding to the "apply" stage.

### Activity Logs

After implementing activity logs, verify:

**Activity Log MUST use the pre-built component:**
- [ ] `<VeltActivityLog />` imported from `@veltdev/react` — do NOT build a custom feed from `useAllActivities`
- [ ] Component placed in a toggleable right-side panel on the document page
- [ ] Toggle button ("View Activity Log" or similar) in the document page header
- [ ] `@veltdev/react` version is `5.0.2-beta.13` or later (required for `VeltActivityLog`)

**Console MUST be configured:**
- [ ] Activity Logs enabled in Velt Console (console.velt.dev > Configuration)

If any item above is missing, go back and implement it before proceeding to the "apply" stage.

## Output
- Fully installed and configured Velt SDK
- Working VeltProvider with auth
- Document identity configured
- Selected features integrated
- Validation results
