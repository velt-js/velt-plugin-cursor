#!/usr/bin/env bash
set -euo pipefail

#
# docs-sync pipeline orchestrator
#
# Runs the autonomous docs-to-skills+installer sync pipeline.
# Each stage is a Claude Code agent definition that runs sequentially,
# reading the previous stage's output from the artifacts directory.
#
# Usage:
#   ./docs-sync/bin/run-pipeline.sh [options]
#
# Options:
#   --full          Force full scan (ignore baselines)
#   --dry-run       Run Stages 0-5 only (detection + planning, no patching)
#   --skills-only   Only run skills drift detection and patching (skip installer/CLI)
#   --detect-only   Run Stages 0-4 only (detection, no planning or patching)
#   --stage N       Run a single stage (for debugging)
#   --auto-approve  Skip human gates for installer patches (use with caution)
#   --help          Show this help
#

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PIPELINE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
VELT_PLUGIN_ROOT="$(cd "$PIPELINE_ROOT/.." && pwd)"

# Repo paths
DOCS_REPO="/Users/yoenzhang/Downloads/docs"
AGENT_SKILLS_REPO="/Users/yoenzhang/Downloads/agent-skills"
INSTALLER_REPO="/Users/yoenzhang/Downloads/velt-mcp-installer"
CLI_REPO="/Users/yoenzhang/Downloads/add-velt-next-js"
SAMPLE_APPS_REPO="/Users/yoenzhang/Downloads/sample-apps"
CLAUDE_PLUGIN_ROOT="/Users/yoenzhang/Downloads/velt-plugin-claude"

# Artifact paths
TIMESTAMP=$(date -u +"%Y-%m-%dT%H-%M-%S")
RUN_DIR="$PIPELINE_ROOT/artifacts/runs/$TIMESTAMP"
BASELINES_DIR="$PIPELINE_ROOT/baselines"
STAGES_DIR="$VELT_PLUGIN_ROOT/.claude/agents"
LIB_DIR="$PIPELINE_ROOT/lib"

# Default options
FULL_SCAN=false
DRY_RUN=false
SKILLS_ONLY=false
DETECT_ONLY=false
SINGLE_STAGE=""
AUTO_APPROVE=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --full)
      FULL_SCAN=true
      shift
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --skills-only)
      SKILLS_ONLY=true
      shift
      ;;
    --detect-only)
      DETECT_ONLY=true
      shift
      ;;
    --stage)
      SINGLE_STAGE="$2"
      shift 2
      ;;
    --auto-approve)
      AUTO_APPROVE=true
      shift
      ;;
    --help|-h)
      head -25 "$0" | tail -17
      exit 0
      ;;
    *)
      echo "[docs-sync] Unknown option: $1"
      exit 1
      ;;
  esac
done

# Setup
echo "[docs-sync] ============================================"
echo "[docs-sync] Docs-to-Skills+Installer Sync Pipeline"
echo "[docs-sync] ============================================"
echo "[docs-sync] Timestamp: $TIMESTAMP"
echo "[docs-sync] Run directory: $RUN_DIR"
echo "[docs-sync] Options: full=$FULL_SCAN dry-run=$DRY_RUN skills-only=$SKILLS_ONLY"
echo ""

mkdir -p "$RUN_DIR"

# Verify repos exist
for repo in "$DOCS_REPO" "$AGENT_SKILLS_REPO" "$INSTALLER_REPO" "$CLI_REPO" "$SAMPLE_APPS_REPO"; do
  if [ ! -d "$repo" ]; then
    echo "[docs-sync] ERROR: Repo not found: $repo"
    exit 1
  fi
done

if [ ! -d "$CLAUDE_PLUGIN_ROOT" ]; then
  echo "[docs-sync] WARNING: Claude plugin repo not found at $CLAUDE_PLUGIN_ROOT"
  echo "[docs-sync] Stage 9 will skip Claude plugin sync"
fi

# If --full, remove baseline to force full scan
if [ "$FULL_SCAN" = true ]; then
  echo "[docs-sync] --full: Removing baseline to force full scan"
  rm -f "$BASELINES_DIR/last-sync-state.json"
fi

# Helper: run a stage agent
run_stage() {
  local stage_num=$1
  local stage_name=$2
  local stage_file="$STAGES_DIR/stage-${stage_num}-${stage_name}.md"

  if [ ! -f "$stage_file" ]; then
    echo "[docs-sync] ERROR: Stage file not found: $stage_file"
    exit 1
  fi

  echo ""
  echo "[docs-sync] ──────────────────────────────────────────"
  echo "[docs-sync] Stage $stage_num: $stage_name"
  echo "[docs-sync] ──────────────────────────────────────────"
  echo "[docs-sync] Agent: $stage_file"
  echo "[docs-sync] Output: $RUN_DIR/"
  echo ""

  # The actual agent execution would be done by Claude Code.
  # This script provides the framework; each stage runs as a
  # Claude Code agent invocation reading the stage definition
  # and the previous stage's artifacts.
  #
  # In practice, you would invoke each stage like:
  #   claude --agent "$stage_file" \
  #     --context "Run timestamp: $TIMESTAMP, Artifacts: $RUN_DIR"
  #
  # For now, this script documents the execution order and
  # validates prerequisites.

  echo "[docs-sync] Stage $stage_num ready. Invoke agent definition at: $stage_file"
  echo "[docs-sync] Context: timestamp=$TIMESTAMP artifacts=$RUN_DIR"
}

# Execution order
if [ -n "$SINGLE_STAGE" ]; then
  echo "[docs-sync] Running single stage: $SINGLE_STAGE"
  case $SINGLE_STAGE in
    0) run_stage 0 "scope-resolver" ;;
    1) run_stage 1 "docs-content-extractor" ;;
    2) run_stage 2 "skills-drift-detector" ;;
    3) run_stage 3 "installer-drift-detector" ;;
    4) run_stage 4 "cli-drift-detector" ;;
    5) run_stage 5 "patch-planner" ;;
    6) run_stage 6 "skills-patch-applier" ;;
    7) run_stage 7 "installer-patch-applier" ;;
    8) run_stage 8 "cli-drift-reporter" ;;
    9) run_stage 9 "downstream-sync" ;;
    *) echo "[docs-sync] Invalid stage: $SINGLE_STAGE (valid: 0-9)"; exit 1 ;;
  esac
  exit 0
fi

# Full pipeline execution order
echo "[docs-sync] Running pipeline stages..."

# Phase 1: Scope & Extraction
run_stage 0 "scope-resolver"
run_stage 1 "docs-content-extractor"

# Phase 2: Drift Detection
run_stage 2 "skills-drift-detector"

if [ "$SKILLS_ONLY" = false ]; then
  run_stage 3 "installer-drift-detector"
  run_stage 4 "cli-drift-detector"
fi

if [ "$DETECT_ONLY" = true ]; then
  echo ""
  echo "[docs-sync] --detect-only: Stopping after drift detection"
  echo "[docs-sync] Review drift reports in: $RUN_DIR/"
  exit 0
fi

# Phase 3: Planning
run_stage 5 "patch-planner"

if [ "$DRY_RUN" = true ]; then
  echo ""
  echo "[docs-sync] --dry-run: Stopping after planning"
  echo "[docs-sync] Review patch plan: $RUN_DIR/stage-5-patch-plan-summary.md"
  exit 0
fi

# Phase 4: Patching
run_stage 6 "skills-patch-applier"

if [ "$SKILLS_ONLY" = false ]; then
  if [ "$AUTO_APPROVE" = true ]; then
    echo "[docs-sync] WARNING: --auto-approve enabled for installer patches"
    run_stage 7 "installer-patch-applier"
  else
    echo ""
    echo "[docs-sync] ⏸  Installer patches require human approval"
    echo "[docs-sync] Review: $RUN_DIR/stage-5-patch-plan-summary.md"
    echo "[docs-sync] After approval, run: $0 --stage 7"
  fi

  run_stage 8 "cli-drift-reporter"
fi

# Phase 5: Downstream Sync
run_stage 9 "downstream-sync"

echo ""
echo "[docs-sync] ============================================"
echo "[docs-sync] Pipeline complete"
echo "[docs-sync] Artifacts: $RUN_DIR/"
echo "[docs-sync] ============================================"
