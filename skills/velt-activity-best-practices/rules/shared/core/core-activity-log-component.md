---
title: Use VeltActivityLog Component to Display Activity Feed UI
impact: HIGH
impactDescription: Drop-in activity feed UI with date grouping, filtering, and wireframe customization
tags: VeltActivityLog, velt-activity-log, component, darkMode, shadowDom, useDummyData, variant, wireframe
---

## Use VeltActivityLog Component to Display Activity Feed UI

The `VeltActivityLog` / `<velt-activity-log>` component renders a prebuilt activity feed that groups entries by calendar date, supports filtering by feature type, and displays loading and empty states. Without it, you must build all feed UI from scratch using raw subscription data.

**Incorrect (rendering raw subscription data without the component):**

```jsx
import { useAllActivities } from '@veltdev/react';

function ActivityFeed() {
  const activities = useAllActivities();
  // No date grouping, no loading state, no empty state
  return (
    <ul>
      {activities?.map(a => <li key={a.id}>{a.displayMessage}</li>)}
    </ul>
  );
}
```

**Correct (React — drop-in component with props):**

```jsx
import { VeltActivityLog } from '@veltdev/react';

function ActivitySidebar() {
  return (
    <VeltActivityLog
      darkMode={false}
      useDummyData={false}
      variant="sidebar"
    />
  );
}
```

**Correct (HTML — web component):**

```html
<!-- Basic usage -->
<velt-activity-log></velt-activity-log>

<!-- With dummy data for development -->
<velt-activity-log use-dummy-data="true"></velt-activity-log>
```

**Component props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `darkMode` | `boolean` | `false` | Enable dark mode styling |
| `shadowDom` | `boolean` | `false` | Render inside a shadow DOM |
| `useDummyData` | `boolean` | `false` | Show placeholder data for development/testing |
| `variant` | `string` | `undefined` | Layout variant (e.g. `"sidebar"`); consult docs for available values |

**Wireframe customization:**

The component supports full structural customization via `VeltActivityLogWireframe` / `<velt-activity-log-wireframe>`. It exposes 27 standalone primitive components, each accepting a `defaultCondition` prop to control render conditions. Exact primitive names and hierarchy are not enumerated in this rule — refer to the Velt docs for the complete wireframe API.

<!-- TODO (v5.0.2-beta.10): Verify the full list of 27 wireframe primitive component names and the accepted variant values. Release note confirms 27 primitives and wireframe support but does not enumerate them. See https://docs.velt.dev/async-collaboration/activity/customize-ui for the complete wireframe primitive reference. -->

### Common Mistakes — DO NOT

**1. DO NOT replace `VeltActivityLog` with a custom `useAllActivities()` implementation.** The component handles date grouping, filtering, icons, loading states, and all activity types automatically. If it appears empty or shows a loading skeleton, that is NORMAL — it means either Activity Logs aren't enabled in the Console yet or no activities have been recorded on this document. Do NOT rewrite it as a custom component.

**2. DO NOT conditionally render `VeltActivityLog` with `{show && <VeltActivityLog />}`.** The component is a web component that needs to stay mounted to maintain its connection to the Velt backend. Mounting and unmounting it on toggle causes it to re-initialize each time, showing a loading state. Instead, always render it and toggle visibility with `display: none`:

```jsx
// WRONG — remounts on every toggle, loses connection
{showPanel && <VeltActivityLog />}

// CORRECT — always mounted, toggle visibility
<div style={{ display: showPanel ? "flex" : "none" }}>
  <VeltActivityLog />
</div>
```

**3. DO NOT pass `style` or `className` as props to `VeltActivityLog`.** It is a Velt web component, not a standard React element. Styling props are silently ignored and can prevent the component from rendering. To control sizing/positioning, wrap it in a `<div>` with your styles:

```jsx
// WRONG — style prop is ignored, component may not render
<VeltActivityLog style={{ flex: 1 }} />

// CORRECT — wrap in a styled div
<div style={{ flex: 1 }}>
  <VeltActivityLog />
</div>
```

**Verification:**
- [ ] `VeltActivityLog` imported from `'@veltdev/react'` (React) or used as `<velt-activity-log>` (HTML)
- [ ] NO `style` or `className` props passed directly to `VeltActivityLog`
- [ ] Component is always mounted (use `display: none` to hide, NOT conditional rendering)
- [ ] Activity Logs enabled in Velt Console (see `core-setup` rule)
- [ ] `useDummyData` used only during development, not in production
- [ ] Wireframe customization references Velt docs for primitive component names

**Source Pointer:** https://docs.velt.dev/async-collaboration/activity/customize-ui - VeltActivityLog Component
