# Velt Help

Answer questions about Velt's collaboration SDK, features, and best practices.

## Trigger
Use when the user asks general questions about Velt, needs clarification on features, or wants to understand how Velt components work.

## Workflow

1. Check if the question is covered by embedded rules (velt-core, velt-auth, velt-document-identity, velt-comments, velt-crdt, velt-notifications). If so, answer from embedded knowledge.
2. Check installed agent-skills (velt-setup-best-practices, velt-comments-best-practices, velt-crdt-best-practices, velt-notifications-best-practices) for detailed patterns and code examples.
3. If neither source covers the question, query the velt-docs MCP server for the answer.
4. Provide a clear, concise answer with code examples where applicable.

## Priority Chain
1. Embedded rules — always check first
2. Reference agent-skills — detailed patterns with code examples
3. velt-docs MCP — query for anything not covered above

## Guardrails
- Always cite which source the answer came from.
- If the answer involves setup, refer the user to /install-velt instead.
- For feature-specific questions, refer to the relevant /add-* skill.

## Output
- Clear answer to the user's Velt question
- Code examples where applicable
- Links to relevant Velt documentation
