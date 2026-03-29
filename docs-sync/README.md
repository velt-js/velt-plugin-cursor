# Docs-to-Skills+Installer Sync Pipeline

Autonomous pipeline that detects documentation changes and propagates them to:
- **agent-skills** — best-practice rule library (4 skills, 112+ rules)
- **velt-mcp-installer** — guided installation MCP server
- **add-velt-next-js** — CLI scaffolding tool (report only)

## How It Works

The pipeline scans the docs repo (source of truth) and compares against downstream artifacts to find drift. It uses a hybrid approach: git diff narrows the scope, content comparison detects actual drift.

```
docs repo ──> Stage 0 (Scope) ──> Stage 1 (Extract)
                                      │
                            ┌─────────┼─────────┐
                            v         v         v
                       Stage 2    Stage 3   Stage 4
                      (Skills)  (Installer)  (CLI)
                            │         │         │
                            └─────────┼─────────┘
                                      v
                                Stage 5 (Plan)
                              ┌───────┼───────┐
                              v       v       v
                         Stage 6   Stage 7  Stage 8
                        (Patch)   (Gated)  (Report)
                              │
                              v
                         Stage 9 (Sync)
```

## Usage

**Recommended — just ask Claude Code:**

```
Run docs-sync                  # Full pipeline
Run docs-sync dry run          # Detect + plan only
Run docs-sync detect only      # Just find drift
Run docs-sync skills only      # Skip installer/CLI
Run docs-sync full scan        # Ignore baseline, scan all docs
```

Claude Code discovers the orchestrator at `.claude/agents/docs-sync-orchestrator.md` and all stage agents at `.claude/agents/stage-{0-9}-*.md`.

**Alternative — shell script:**

```bash
./docs-sync/bin/run-pipeline.sh [--full] [--dry-run] [--skills-only] [--detect-only] [--stage N] [--auto-approve]
```

## Pipeline Stages

| Stage | Name | Model | Purpose |
|-------|------|-------|---------|
| 0 | Scope Resolver | haiku | Determine changed docs, map to targets |
| 1 | Docs Content Extractor | sonnet | Extract structured content from MDX |
| 2 | Skills Drift Detector | opus | Compare docs vs agent-skills rules |
| 3 | Installer Drift Detector | sonnet | Compare docs vs installer logic |
| 4 | CLI Template Drift Detector | sonnet | Compare CLI templates vs docs + sample-apps |
| 5 | Patch Planner | sonnet | Prioritize drifts, produce patch plan |
| 6 | Skills Patch Applier | opus | Apply skill patches with 3 QA gates |
| 7 | Installer Patch Applier | sonnet | Apply installer patches (human-gated) |
| 8 | CLI Drift Reporter | haiku | Generate CLI drift report (no patching) |
| 9 | Downstream Sync | haiku | Sync to velt-plugin, update baseline |

## Auto-Apply vs Human-Gated

| Target | Auto-Apply | Human Review | Report Only |
|--------|-----------|-------------|-------------|
| agent-skills (P0/P1/P2) | Yes | Post-hoc | — |
| agent-skills (P3) | — | — | Logged only |
| velt-mcp-installer | — | Required | — |
| add-velt-next-js | — | — | Always |

## Directory Structure

```
.claude/agents/                            # Claude Code agent definitions
├── docs-sync-orchestrator.md              # Master orchestrator
├── stage-0-scope-resolver.md
├── stage-1-docs-content-extractor.md
├── stage-2-skills-drift-detector.md
├── stage-3-installer-drift-detector.md
├── stage-4-cli-drift-detector.md
├── stage-5-patch-planner.md
├── stage-6-skills-patch-applier.md
├── stage-7-installer-patch-applier.md
├── stage-8-cli-drift-reporter.md
└── stage-9-downstream-sync.md

docs-sync/                                 # Pipeline data and config
├── bin/
│   └── run-pipeline.sh                    # Shell orchestrator (alternative)
├── lib/
│   └── docs-to-targets-map.json           # Static mapping: docs paths -> targets
├── baselines/
│   └── last-sync-state.json               # Updated after each successful run
├── artifacts/
│   └── runs/{timestamp}/                  # Per-run outputs
│       ├── stage-0-scope.json
│       ├── stage-1-extracted.json
│       ├── stage-2-skills-drift.json
│       ├── stage-3-installer-drift.json
│       ├── stage-4-cli-drift.json
│       ├── stage-5-patch-plan.json
│       ├── stage-5-patch-plan-summary.md
│       ├── stage-6-skills-patch-log.md
│       ├── stage-7-installer-patch-log.md
│       └── stage-8-cli-drift-report.md
└── README.md
```

## Repos

| Repo | Role | Path |
|------|------|------|
| docs | Source of truth | /Users/yoenzhang/Downloads/docs |
| agent-skills | Downstream (auto-patched) | /Users/yoenzhang/Downloads/agent-skills |
| velt-mcp-installer | Downstream (human-gated) | /Users/yoenzhang/Downloads/velt-mcp-installer |
| add-velt-next-js | Downstream (report only) | /Users/yoenzhang/Downloads/add-velt-next-js |
| sample-apps | Comparison baseline | /Users/yoenzhang/Downloads/sample-apps |
| velt-plugin | Propagation target | /Users/yoenzhang/Downloads/velt-plugin |

## Quality Gates (Stage 6)

The skills patch applier has 3 mandatory quality gates:

1. **Pre-Write Validation** — Before each file write
2. **Post-Edit QA** — After all patches (7 sub-checks: re-read, completeness, regression, formatting, code examples, cross-references, collateral damage)
3. **Build Regeneration** — `npm run validate && npm run build` in agent-skills

## Relationship to Existing Agent-7/Agent-8

The existing agents in `/docs/.claude/agents/` are release-note-triggered:
- Agent-7 extracts deltas from release notes
- Agent-8 applies patches based on those deltas

This pipeline is docs-content-triggered — it compares the full docs state against skills/installer state, not just release notes. It supersedes Agent-7/8 for comprehensive drift detection but can coexist with them for rapid release-note-driven updates.
