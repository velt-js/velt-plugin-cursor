# Velt Plugin (Cursor)

Cursor plugin for Velt SDK collaboration features. Packages skills, rules, agents, and MCP servers into the Cursor plugin format. Also syncs agent-skills to the sibling Claude plugin repo.

## Key Commands

```bash
npm run sync     # Copy agent-skills into cursor and claude plugins
npm run build    # Build the Cursor plugin from shared source
npm run validate # Validate the Cursor plugin output
```

## Docs-Sync Pipeline

Autonomous pipeline that detects docs drift and updates agent-skills + installer. Agent definitions live in `.claude/agents/`, data/config in `docs-sync/`.

### Running the Pipeline

Ask Claude to **"run docs-sync"** — it will use the orchestrator agent at `.claude/agents/docs-sync-orchestrator.md`.

Common invocations:
- `"Run docs-sync"` — full pipeline (detect + patch + sync)
- `"Run docs-sync dry run"` — detect + plan only, no patching
- `"Run docs-sync detect only"` — just find drift, no planning
- `"Run docs-sync skills only"` — skip installer/CLI checks
- `"Run docs-sync full scan"` — ignore baseline, scan all 419 docs files

### Pipeline Repos

| Repo | Path | Role |
|------|------|------|
| docs | `../docs` | Source of truth (419 MDX files) |
| agent-skills | `../agent-skills` | Auto-patched (4 skills, 121+ rules) |
| velt-mcp-installer | `../velt-mcp-installer` | Human-gated patches |
| add-velt-next-js | `../add-velt-next-js` | Report only (published npm) |
| sample-apps | `../sample-apps` | Comparison baseline |
| velt-plugin-claude | `../velt-plugin-claude` | Propagation target (agent-skills sync) |

### Pipeline Outputs

Run artifacts go to `docs-sync/artifacts/runs/{timestamp}/`. Key outputs:
- `stage-5-patch-plan-summary.md` — human-readable drift + patch plan
- `stage-6-skills-patch-log.md` — what was patched and QA results
- `stage-8-cli-drift-report.md` — CLI drift report for maintainer
