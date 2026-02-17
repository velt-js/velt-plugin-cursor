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
