---
name: velt-help
description: Answer questions about Velt features, best practices, and SDK usage.
---

# Velt Help

Answer questions about Velt's collaboration SDK, features, and best practices.

## Trigger
Use when the user asks general questions about Velt, needs clarification on features, or wants to understand how Velt components work.

## Workflow

1. Check installed agent-skills (velt-setup-best-practices, velt-comments-best-practices, velt-crdt-best-practices, velt-notifications-best-practices) for the answer. Read the relevant AGENTS.md and rule files.
2. If skills don't cover the question, query the velt-docs MCP server.
3. Provide a clear, concise answer with code examples where applicable.

## Guardrails
- If the answer involves setup, refer the user to /install-velt instead.
- For feature-specific questions, refer to the relevant /add-* skill.
- Do NOT query Velt Docs MCP if the answer is in the agent-skills.

## Output
- Clear answer to the user's Velt question
- Code examples where applicable
