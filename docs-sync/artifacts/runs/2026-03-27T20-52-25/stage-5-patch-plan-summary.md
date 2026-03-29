# Patch Plan Summary

**Run**: 2026-03-27T20:52:25Z
**Scan Mode**: full (first run, no baseline)

## Overview

| Target | Auto-Apply | Human Review | Report Only | Skipped |
|--------|-----------|-------------|-------------|---------|
| Skills | 31 | — | — | 5 (P3) |
| Installer | — | 4 | — | — |
| CLI | — | — | (not run) | — |
| **Total** | **31** | **4** | **0** | **5** |

---

## Auto-Apply: Skills (31 patches)

### P0 — High Severity, High Confidence (6)

1. **[UPDATE] velt-setup/rules/shared/identity/identity-jwt-generation.md**
   - JWT endpoint URL: rule uses `/v2/auth/token/get`, docs use `/v2/auth/generate_token`
   - Would cause real API failures

2. **[UPDATE] velt-setup/rules/shared/config/config-auth-token-security.md**
   - Same JWT endpoint URL mismatch

3. **[UPDATE] velt-setup/rules/shared/identity/identity-jwt-generation.md**
   - JWT request body structure: rule wraps in `{data: {...}}` with `organizationId` inside `userProperties`; docs send flat body with `permissions.resources` array

4. **[UPDATE] velt-crdt/rules/shared/core/core-webhooks.md**
   - Uses callback-style `crdtElement.on('updateData', (data) => {...})` but docs show Observable `crdtElement.on("updateData").subscribe(...)`

5. **[UPDATE] velt-notifications/rules/shared/panel/panel-tabs.md**
   - Says "four tabs: forYou, all, documents, and people" but docs say "three tabs" — no `people` tab in tabConfig API

6. **[UPDATE] velt-notifications/rules/shared/panel/panel-display.md**
   - Shows only `client.getNotificationElement()` for React; docs recommend `useNotificationUtils()` hook

### P1 — High Severity, Medium Confidence (2)

7. **[UPDATE] velt-crdt/rules/react/core/core-store-create-react.md**
   - Missing `versions`, `getVersionById`, `restoreVersion` from `useVeltCrdtStore` return table

8. **[UPDATE] velt-comments/rules/shared/permissions/...**
   - `onCommentAdd` callback pattern: rule shows return-value pattern, docs use `event.addContext()` with mandatory `commentType: 'manual'`

### P2 — Medium Severity (23)

**Setup skill (4):**
9. JWT body structure mismatch in config-auth-token-security.md
10. Stale `useSetDocuments` (plural) vs docs `useSetDocument` (singular)
11. Debug verification rule references stale JWT endpoint
12. renderComments parameter naming difference

**Comments skill (7):**
13. **[CREATE] rules/react/mode/mode-plate.md** — Plate editor integration documented, no rule
14. **[CREATE] rules/react/mode/mode-quill.md** — Quill editor integration documented, no rule
15. **[CREATE] rules/react/mode/mode-codemirror-comments.md** — CodeMirror comments documented, no rule
16. **[CREATE] rules/react/mode/mode-ace.md** — Ace editor integration documented, no rule
17. useCommentUtils vs useVeltClient pattern mismatch
18. Hook import naming: singular vs plural hooks
19. CSS selector differences in wireframe rules

**CRDT skill (7):**
20. Webhook debounce: rule says min 3000ms, docs say min 5000ms
21. **[CREATE] rules/react/core/core-crdt-utils-hooks.md** — `useCrdtUtils()` and `useCrdtEventCallback()` undocumented in skills
22. **[CREATE] rules/shared/core/core-event-subscription.md** — `on('updateData')` pattern and `CrdtUpdateDataEvent` type
23. **[CREATE] rules/shared/core/core-store-lifecycle.md** — `destroy()`, `getDoc()`, `getProvider()` etc.
24. Message stream: `state`/`vector` typed as `number[]` in rule, docs show `Uint8Array`
25. core-rest-api.md only covers Get endpoint; docs also document Add and Update
26. Activity debounce: rule describes "inactivity timeout" but docs describe "batching window"

**Notifications skill (5):**
27. `settings-channels.md`: `useNotificationSettings()` return shape mismatch
28. `settings-channels.md`: shows undocumented `setSettingsLayout()` method
29. **[CREATE] rules/shared/panel/panel-current-document-only.md** — `enableCurrentDocumentOnly()` / `disableCurrentDocumentOnly()`
30. **[CREATE] rules/shared/triggers/triggers-self-notifications.md** — `enableSelfNotifications` API
31. **[CREATE] rules/shared/data/data-notification-actions.md** — `markNotificationAsReadById()`, `setAllNotificationsAsRead()`, `onNotificationClick`

### P3 — Skipped (5)

- drift-low-001: Import naming singular/plural (stylistic, low severity)
- drift-low-002: Undocumented `useDocument` hook reference (low confidence)
- drift-low-003: CSS selector differences (stylistic)
- drift-low-004: `maxDays` / `setMaxDays` prop (low priority)
- drift-low-005: `muteAllNotifications()` document-scoping (minor)

---

## Human Review Required: Installer (4 patches)

> All installer patches require explicit approval before applying.

1. **[BLOCKING] plan-formatter.js:408,457,1264,1313** — JWT token endpoint hardcoded as `/v2/auth/token/get` in 4 locations. Correct endpoint: `/v2/auth/generate_token`. Users following the plan will get 404s on token generation.

2. **[MEDIUM] velt-docs-urls.js:64** — CRDT overview URL points to `/multiplayer-editing/overview` which no longer exists. Should be `/realtime-collaboration/crdt/overview`.

3. **[MEDIUM] velt-docs-urls.js** — Missing `stream` comment type URL. `VELT_DOCS_URLS.comments.setup` has no `stream` entry, causing fallback to generic quickstart when stream comments are selected.

4. **[LOW] plan-formatter.js:1647** — CLI-only report links to `/async-collaboration/comments/setup` (directory, not page). Should link to `.../comments/overview`.

---

## Key Themes

**JWT is the biggest cross-cutting issue.** The endpoint URL `/v2/auth/token/get` is wrong in 3 skill rule files AND 4 installer locations. The request body structure is also stale. This is the highest-priority fix.

**4 text editor integrations have docs but no rules.** Plate, Quill, CodeMirror (comments), and Ace are fully documented but missing from agent-skills. These are P2 creates.

**Notification skill has the most missing API coverage.** 7 documented APIs/features have no corresponding rules. The existing rules also have accuracy issues with tab counts and hook recommendations.

**CRDT webhook pattern is fundamentally wrong.** Rule shows callback-style, docs use Observable `.subscribe()` pattern.
