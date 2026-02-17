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
