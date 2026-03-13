#!/bin/bash
# verify.sh — Smoke test for autospec-starter template structure
#
# Verifies that all required files exist in the autospec-starter template.
# Exits 0 if all checks pass, exits 1 if any check fails.
#
# Usage:
#   bash scripts/verify.sh
#   bash scripts/verify.sh /path/to/autospec-starter

set -euo pipefail

# ── Configuration ────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AUTOSPEC_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMPLATE_DIR="${1:-$AUTOSPEC_ROOT/autospec-starter}"

# ── Colours ──────────────────────────────────────────────────────────────────

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
RESET='\033[0m'

PASS="${GREEN}✓ PASS${RESET}"
FAIL="${RED}✗ FAIL${RESET}"

pass_count=0
fail_count=0

# ── Helpers ──────────────────────────────────────────────────────────────────

check_file() {
  local label="$1"
  local path="$2"
  if [ -f "$path" ]; then
    echo -e "  $PASS  $label"
    pass_count=$((pass_count + 1))
  else
    echo -e "  $FAIL  $label"
    echo -e "         ${YELLOW}Expected: $path${RESET}"
    fail_count=$((fail_count + 1))
  fi
}

check_dir() {
  local label="$1"
  local path="$2"
  if [ -d "$path" ]; then
    echo -e "  $PASS  $label"
    pass_count=$((pass_count + 1))
  else
    echo -e "  $FAIL  $label"
    echo -e "         ${YELLOW}Expected: $path${RESET}"
    fail_count=$((fail_count + 1))
  fi
}

section() {
  echo ""
  echo -e "${BOLD}$1${RESET}"
}

# ── Main ─────────────────────────────────────────────────────────────────────

echo ""
echo -e "${BOLD}AutoSpec Starter Template — Verification${RESET}"
echo "Template directory: $TEMPLATE_DIR"
echo "────────────────────────────────────────"

# Check the template directory itself exists
if [ ! -d "$TEMPLATE_DIR" ]; then
  echo -e "${RED}ERROR: Template directory not found: $TEMPLATE_DIR${RESET}"
  echo "Run from the autospec root, or pass the path as an argument:"
  echo "  bash scripts/verify.sh /path/to/autospec-starter"
  exit 1
fi

# ── Section 1: Root files ────────────────────────────────────────────────────
section "1. Root files"
check_file "QUICKSTART.md" "$TEMPLATE_DIR/QUICKSTART.md"
check_file "README.md"     "$TEMPLATE_DIR/README.md"
check_file "CLAUDE.md"     "$TEMPLATE_DIR/CLAUDE.md"
check_file ".gitignore"    "$TEMPLATE_DIR/.gitignore"

# ── Section 2: AutoSpec config ───────────────────────────────────────────────
section "2. AutoSpec config"
check_dir  ".autospec/ directory"      "$TEMPLATE_DIR/.autospec"
check_file ".autospec/config.yml"      "$TEMPLATE_DIR/.autospec/config.yml"

# ── Section 3: Claude Code skills ────────────────────────────────────────────
section "3. Claude Code skills (.claude/commands/)"
check_dir  ".claude/commands/ directory"            "$TEMPLATE_DIR/.claude/commands"
check_file "create-spec.md"                         "$TEMPLATE_DIR/.claude/commands/create-spec.md"
check_file "create-sprint-docs.md"                  "$TEMPLATE_DIR/.claude/commands/create-sprint-docs.md"
check_file "execute-ticket.md"                      "$TEMPLATE_DIR/.claude/commands/execute-ticket.md"
check_file "help.md"                                "$TEMPLATE_DIR/.claude/commands/help.md"
check_file "plan-presentation.md"                   "$TEMPLATE_DIR/.claude/commands/plan-presentation.md"
check_file "plan-sprint.md"                         "$TEMPLATE_DIR/.claude/commands/plan-sprint.md"
check_file "qa-review.md"                           "$TEMPLATE_DIR/.claude/commands/qa-review.md"
check_file "sprint-close.md"                        "$TEMPLATE_DIR/.claude/commands/sprint-close.md"
check_file "sprint-run.md"                          "$TEMPLATE_DIR/.claude/commands/sprint-run.md"
check_file "sprint-status.md"                       "$TEMPLATE_DIR/.claude/commands/sprint-status.md"
check_file "update-backlog.md"                      "$TEMPLATE_DIR/.claude/commands/update-backlog.md"

# Count skill files
skill_count=$(find "$TEMPLATE_DIR/.claude/commands" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
if [ "$skill_count" -eq 11 ]; then
  echo -e "  $PASS  skill count = $skill_count (expected 11)"
  pass_count=$((pass_count + 1))
else
  echo -e "  $FAIL  skill count = $skill_count (expected 11)"
  fail_count=$((fail_count + 1))
fi

# ── Section 4: Requirements templates ────────────────────────────────────────
section "4. Requirements templates"
check_dir  "requirements/ directory"    "$TEMPLATE_DIR/requirements"
check_file "requirements/project-brief.md"  "$TEMPLATE_DIR/requirements/project-brief.md"
check_file "requirements/example-srs.md"    "$TEMPLATE_DIR/requirements/example-srs.md"
check_file "requirements/README.md"         "$TEMPLATE_DIR/requirements/README.md"

# ── Section 5: Cursor integration ────────────────────────────────────────────
section "5. Cursor integration"
check_dir  ".cursor/rules/ directory"   "$TEMPLATE_DIR/.cursor/rules"
check_file ".cursor/rules/autospec.md"  "$TEMPLATE_DIR/.cursor/rules/autospec.md"

# ── Section 6: Windsurf integration ──────────────────────────────────────────
section "6. Windsurf integration"
check_dir  ".windsurf/ directory"       "$TEMPLATE_DIR/.windsurf"
check_file ".windsurf/rules.md"         "$TEMPLATE_DIR/.windsurf/rules.md"

# ── Section 7: GitHub Copilot integration ────────────────────────────────────
section "7. GitHub Copilot integration"
check_dir  ".github/ directory"                   "$TEMPLATE_DIR/.github"
check_file ".github/copilot-instructions.md"      "$TEMPLATE_DIR/.github/copilot-instructions.md"

# ── Summary ──────────────────────────────────────────────────────────────────
echo ""
echo "────────────────────────────────────────"
total=$((pass_count + fail_count))
echo -e "${BOLD}Results: $pass_count/$total checks passed${RESET}"

if [ "$fail_count" -eq 0 ]; then
  echo -e "${GREEN}${BOLD}All checks passed. Template is complete.${RESET}"
  echo ""
  exit 0
else
  echo -e "${RED}${BOLD}$fail_count check(s) failed. Template is incomplete.${RESET}"
  echo ""
  exit 1
fi
