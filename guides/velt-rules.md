# Velt Best Practices Guide

Reference material for Velt SDK patterns. For detailed implementation, read the agent-skill rule files referenced in the MCP installation plan.

---

# Velt Core Setup Rules

## Installation
- Install `@veltdev/react` for React/Next.js apps
- Optional: `@veltdev/types` for TypeScript support
- Requires Node.js v14+, React 16+ (React 19 supported)

## VeltProvider Configuration
- VeltProvider MUST wrap all Velt components
- Pass `apiKey` prop (get from console.velt.dev)
- For Next.js App Router: place VeltProvider in page.tsx, NOT layout.tsx
- File containing VeltProvider MUST have `"use client"` directive at line 1

### Production Setup
```jsx
"use client";
import { VeltProvider } from "@veltdev/react";

export default function App() {
  return (
    <VeltProvider
      apiKey={process.env.NEXT_PUBLIC_VELT_API_KEY}
      authProvider={authProvider}
    >
      {/* App content */}
    </VeltProvider>
  );
}
```

## API Key
- Get from https://console.velt.dev
- Safe to include client-side (identifies app, not admin access)
- Use environment variables: `NEXT_PUBLIC_VELT_API_KEY`

## Domain Safelist
- Add all domains to Velt Console > Settings > Managed Domains
- Include: localhost:3000 (dev), your-app.com (prod), staging URLs
- Requests from non-whitelisted domains are rejected


---

# Velt Authentication Rules

## User Object (Required Fields)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | string | Yes | Unique user identifier |
| organizationId | string | Yes | Organization/tenant scope |
| name | string | Yes | Display name |
| email | string | Yes | Email for notifications |
| photoUrl | string | No | Avatar URL |

## authProvider Pattern (Recommended for Production)
```jsx
const authProvider = {
  user: {
    userId: "user-123",
    organizationId: "org-abc",
    name: "John Doe",
    email: "john@example.com",
  },
  retryConfig: { retryCount: 3, retryDelay: 1000 },
  generateToken: async () => {
    const resp = await fetch("/api/velt/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.userId, organizationId: user.organizationId }),
    });
    const { token } = await resp.json();
    return token;
  },
};

<VeltProvider apiKey="KEY" authProvider={authProvider}>
```

## Auth Provider Mapping
- Firebase: `uid` -> userId, `displayName` -> name
- NextAuth: `session.user.id` -> userId
- Clerk: `user.id` -> userId
- Supabase: `user.id` -> userId

## Key Rules
- Always authenticate BEFORE calling setDocuments
- Do NOT call identify() in the same file as VeltProvider
- For production: ALWAYS implement generateToken (server-side JWT)
- userId must be a non-empty string (convert integers with `String(id)`)


---

# Velt Document Identity Rules

## setDocuments (Required)
The SDK will NOT work without calling setDocuments. No comments, presence, or other features function until a document is set.

### Correct Pattern
```jsx
// components/velt/VeltInitializeDocument.tsx
"use client";
import { useEffect } from "react";
import { useSetDocuments, useCurrentUser } from "@veltdev/react";

export default function VeltInitializeDocument({ documentId, documentName }) {
  const { setDocuments } = useSetDocuments();
  const veltUser = useCurrentUser();

  useEffect(() => {
    if (!veltUser || !documentId) return;
    setDocuments([{ id: documentId, metadata: { documentName } }]);
  }, [veltUser, documentId, documentName, setDocuments]);

  return null;
}
```

## Key Rules
- Call setDocuments AFTER user authentication (after identify)
- Call setDocuments in a CHILD component, not the same component as VeltProvider
- Document ID must be consistent for all users collaborating on the same content
- Wait for useCurrentUser to return a value before setting document

## Document ID Strategies
| Strategy | Example | Use Case |
|----------|---------|----------|
| URL param | `?documentId=doc-abc` | Shareable links |
| Route path | `/projects/123` -> `project-123` | Resource-based apps |
| Database ID | `doc.id` from DB | Persistent documents |
| User-specific | `user-${userId}-draft` | Personal drafts |

## Anti-patterns
- Random ID on every page load (no collaboration possible)
- Hardcoded single value (everyone shares one doc)
- setDocuments in same component as VeltProvider (client not ready)


---

# Velt Comments Rules

## Core Setup
1. VeltProvider with apiKey wraps app
2. User authenticated (authProvider or useIdentify)
3. Document set (setDocuments or useSetDocument)
4. Add VeltComments component

## Comment Modes

### Freestyle (default)
Click anywhere to pin comments. Add VeltCommentTool for the comment button.
```jsx
<VeltComments />
<VeltCommentTool />
```

### Popover (Google Sheets-style)
Comments bound to specific elements via targetElementId.
```jsx
<VeltComments popoverMode={true} />
<VeltCommentTool targetElementId="cell-id" />
<VeltCommentBubble targetElementId="cell-id" />
```

### Text (highlight comments)
Select text to comment. Enabled by default.
```jsx
<VeltComments textMode={true} />
```

### Stream (Google Docs-style)
Comments in a side column, scroll-synced.
```jsx
<VeltComments streamMode={true} streamViewContainerId="scrolling-container" />
```

### Page (page-level sidebar)
```jsx
<VeltComments />
<VeltCommentsSidebar pageMode={true} />
<VeltSidebarButton />
```

### TipTap Editor Integration

"TipTap Comments" = comments INSIDE a TipTap editor using `TiptapVeltComments` extension.
This is NOT freestyle pin comments on a page containing a TipTap editor.

```bash
npm install @veltdev/tiptap-velt-comments
```
```tsx
import { BubbleMenu } from "@tiptap/react/menus"; // SUBPATH EXPORT — only this path works
import { TiptapVeltComments, addComment, renderComments } from "@veltdev/tiptap-velt-comments";
import { useCommentAnnotations } from "@veltdev/react";

// Disable default text mode when using editor
<VeltComments textMode={false} />

// Extensions — TiptapVeltComments BEFORE VeltCrdt (wrong order = FREEZE)
extensions: [
  StarterKit.configure({ undoRedo: false }),
  TiptapVeltComments,              // BEFORE VeltCrdt
  ...(VeltCrdt ? [VeltCrdt] : []), // LAST
]

// renderComments — ALL THREE params required
const commentAnnotations = useCommentAnnotations();
useEffect(() => {
  if (editor && commentAnnotations) {
    renderComments({ editor, editorId, commentAnnotations });
  }
}, [editor, editorId, commentAnnotations]);

// BubbleMenu with onClick (NOT onMouseDown)
<BubbleMenu editor={editor}>
  <button onClick={(e) => {
    e.preventDefault();
    addComment({ editor, editorId });
  }}>Add Comment</button>
</BubbleMenu>
```

## Key Rules
- VeltCommentTool is required for users to initiate freestyle comments
- For editor integrations (TipTap/Lexical/Slate): disable textMode={false}
- BubbleMenu: import from `@tiptap/react/menus` (NOT `@tiptap/react`)
- Use `onClick`, NOT `onMouseDown` for comment buttons
- `addComment` and `renderComments` REQUIRE `editorId` parameter
- Comments sidebar: use VeltCommentsSidebar + VeltSidebarButton


---

# Velt CRDT Rules

## Installation
React: `npm install @veltdev/crdt-react @veltdev/crdt @veltdev/react`
Other: `npm install @veltdev/crdt @veltdev/client`

## Tiptap CRDT Integration
```bash
npm install @veltdev/tiptap-crdt-react @tiptap/react @tiptap/starter-kit @tiptap/extension-collaboration @tiptap/extension-collaboration-cursor
```
```jsx
import { useVeltTiptapCrdtExtension } from '@veltdev/tiptap-crdt-react';

const { VeltCrdt } = useVeltTiptapCrdtExtension({ editorId: 'my-editor' });

const editor = useEditor({
  extensions: [
    StarterKit.configure({ undoRedo: false }), // CRITICAL: Tiptap v3 uses undoRedo, NOT history
    ...(VeltCrdt ? [VeltCrdt] : []),
  ],
}, [VeltCrdt]);
```

## BubbleMenu Import (Tiptap v3)
- CORRECT: `import { BubbleMenu } from "@tiptap/react/menus"` (subpath export — only resolves in bundler, not Node.js shell)
- WRONG: `import { BubbleMenu } from "@tiptap/react"` (removed in v3)
- WRONG: `import { BubbleMenu } from "@tiptap/extension-bubble-menu"` (headless extension, not React component)
- Requires: `npm install @floating-ui/dom`

## Critical Rules
- ALWAYS disable Tiptap undo/redo when using CRDT: `StarterKit.configure({ undoRedo: false })` (Tiptap v3 uses `undoRedo`, NOT `history`)
- VeltProvider must wrap app before creating CRDT stores
- Store ID must be unique per collaborative instance
- Add CSS for collaboration cursors (see `velt-crdt-best-practices` → `tiptap-cursor-css` rule)
- Use editorId to uniquely identify each editor instance
- TiptapVeltComments MUST come BEFORE VeltCrdt in extensions array (wrong order causes freeze)
- renderComments and addComment REQUIRE editorId parameter
- Use onClick (NOT onMouseDown) for comment buttons

## Required Cursor CSS (add to globals.css)
```css
.ProseMirror .ProseMirror-yjs-cursor {
  position: relative;
  border-left: 2px solid #0d0d0d;
  border-right: none;
  margin-left: -1px;
  margin-right: -1px;
  pointer-events: none;
  word-break: normal;
}
.ProseMirror .ProseMirror-yjs-cursor > span {
  display: inline !important;
}
.ProseMirror .ProseMirror-yjs-cursor > div {
  position: absolute;
  top: -1.4em;
  left: -1px;
  font-size: 12px;
  font-weight: 600;
  font-style: normal;
  line-height: normal;
  padding: 0.1rem 0.3rem;
  border-radius: 3px 3px 3px 0;
  color: white;
  white-space: nowrap;
  user-select: none;
}
.ProseMirror .ProseMirror-yjs-selection {
  opacity: 0.3;
}
velt-comment-text[comment-available="true"] {
  background-color: rgba(255, 212, 0, 0.3);
}
```


---

# Velt Notifications Rules

## Setup
1. Enable Notifications in Velt Console (console.velt.dev > Configuration)
2. Add VeltNotificationsTool component
```jsx
import { VeltNotificationsTool } from '@veltdev/react';

<div className="toolbar">
  <VeltNotificationsTool />
</div>
```

## Panel Configuration
```jsx
<VeltNotificationsTool
  tabConfig={{
    forYou: { name: 'Mentions', enable: true },
    all: { name: 'All Activity', enable: true },
    documents: { name: 'By Document', enable: true },
  }}
  panelOpenMode="popover"  // or "sidebar"
/>
```

## React Hooks
```jsx
import { useNotificationsData, useUnreadNotificationsCount } from '@veltdev/react';

const notifications = useNotificationsData();
const forYouData = useNotificationsData({ type: 'forYou' });
const unreadCount = useUnreadNotificationsCount();
// Returns: { forYou: number, all: number }
```

## Embedded Panel (no bell button)
```jsx
import { VeltNotificationsPanel } from '@veltdev/react';
<div className="sidebar"><VeltNotificationsPanel /></div>
```

## Email (SendGrid)
- Configure SendGrid API key in Velt Console > Settings > Email
- Triggered by @mentions and comment replies by default
- Users control preferences via settings channels

## Webhooks
- Configure webhook URL in Velt Console > Settings > Webhooks
- Payload includes: event, actionUser, documentId, notification source
- Use for Slack, Linear, or custom service integration


---
