# Patch Plan Summary

**Run**: 2026-03-31T00:16:12Z
**Scan Mode**: full (baseline commit not in shallow clone)

## Overview

| Target | Auto-Apply | Human Review | Report Only | Skipped |
|--------|-----------|-------------|-------------|---------|
| Skills | 15 | — | — | 0 |
| Installer | — | 4 | — | 0 |
| CLI | — | — | 8 | 0 |
| **Total** | **15** | **4** | **8** | **0** |

## Auto-Apply: Skills (15 patches)

### P0 — Critical, High Confidence (5)

1. **[UPDATE] velt-setup/identity-jwt-generation.md** — JWT endpoint URL `/v2/auth/token/get` → `/v2/auth/generate_token` (7 occurrences across 3 files)
2. **[UPDATE] velt-setup/config-auth-token-security.md** — Same JWT endpoint fix (change group with #1)
3. **[UPDATE] velt-setup/identity-user-object-shape.md** — User `name`/`email` fields marked Required but docs say Optional
4. **[UPDATE] velt-setup/document-set-document.md** — `setDocuments` signature: wrong return type (`void` → `Promise<void>`), missing `options` param, wrong type name (`DocumentConfig` → `Document`)
5. **[UPDATE] velt-crdt/tiptap-disable-history.md** — Tiptap history disable key `undoRedo` → `history` (v2 syntax, what docs target)

### P2 — Medium Severity (10)

6. **[UPDATE] velt-setup/document-set-document.md** — `metadata` marked optional but docs say required
7. **[UPDATE] velt-setup/document-set-document.md** — Add `useSetDocuments` hook API with full signature
8. **[UPDATE] velt-setup/document-set-document.md** — Add document count limits (30 docs, 50 with folder)
9. **[CREATE] velt-setup/events-client-lifecycle.md** — New rule for `client.on()` and `useVeltEventCallback`
10. **[CREATE] velt-setup/lifecycle-init-state.md** — New rule for `useVeltInitState` hook
11. **[UPDATE] velt-setup/debug-setup-verification.md** — Add `fetchDebugInfo()`/`getDebugInfo()` APIs
12. **[CREATE] velt-setup/document-folders.md** — New rule for folder-based document org and `fetchFolders`
13. **[UPDATE] velt-crdt/core-debug-storemap.md** — Verify VeltCrdtStoreMap coverage (may be mapping gap)
14. **[UPDATE] velt-crdt/core-message-stream.md** — Verify message stream API coverage (may be mapping gap)
15. **[UPDATE] velt-crdt/core-webhooks.md** — Add `setActivityDebounceTime` reference

## Human Review Required: Installer (4 patches)

> All installer patches require explicit approval before Stage 7 applies them.

1. **[BLOCKING] velt-docs-urls.js:64** — CRDT overview URL stale → would 404
2. **[BLOCKING] validation.js:402-434** — VeltProvider check looks in `layout.tsx` but docs say `page.tsx`
3. **[NON-BLOCKING] velt-docs-urls.js** — Missing `stream` comment mode URL
4. **[NON-BLOCKING] validation.js:470-495** — VeltCommentsSidebar check in wrong file

## Report Only: CLI (8 items)

> Informational. CLI is a published npm package; changes go through its own release process.

### P0 — Critical (6)
1. `@veltdev/react` pinned to ^4.0.0 — sample-apps on v5.x (MAJOR version gap)
2. `@veltdev/reactflow-crdt` pinned to ^4.0.0 — sample-apps on 5.0.0
3. `@veltdev/tiptap-crdt` pinned to ^4.0.0 — sample-apps on 5.0.0
4. `@veltdev/codemirror-crdt` pinned to ^4.0.0 — needs v5 peer compat check
5. `VeltInitializeDocument` template missing `"use client"` — compile failure in Next.js
6. Auto-wiring injects `"use client"` mid-file — silently ignored by Next.js

### P2 — Medium (2)
7. Tiptap CRDT installs `@tiptap/extension-collaboration-caret` instead of `cursor` for React
8. `VeltHuddleTool` included without required `VeltHuddle` companion
