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
