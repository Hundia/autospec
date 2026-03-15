#!/bin/bash
# MealMap Demo Environment Setup
# Run this before the presentation to verify everything works

set -e

MEALMAP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
echo "=== MealMap Demo Setup ==="
echo "Project dir: $MEALMAP_DIR"
echo ""

# 1. Check Docker
echo "--- Step 1: Docker ---"
if docker-compose -f "$MEALMAP_DIR/docker-compose.yml" ps 2>/dev/null | grep -q "Up"; then
    echo "✅ PostgreSQL is running"
else
    echo "🔄 Starting PostgreSQL..."
    cd "$MEALMAP_DIR" && docker-compose up -d
    echo "✅ PostgreSQL started"
fi

# 2. Check API dependencies
echo ""
echo "--- Step 2: API Dependencies ---"
if [ -d "$MEALMAP_DIR/api/node_modules" ]; then
    echo "✅ API dependencies installed"
else
    echo "🔄 Installing API dependencies..."
    cd "$MEALMAP_DIR/api" && npm install
    echo "✅ API dependencies installed"
fi

# 3. Check Web dependencies
echo ""
echo "--- Step 3: Web Dependencies ---"
if [ -d "$MEALMAP_DIR/web/node_modules" ]; then
    echo "✅ Web dependencies installed"
else
    echo "🔄 Installing Web dependencies..."
    cd "$MEALMAP_DIR/web" && npm install
    echo "✅ Web dependencies installed"
fi

# 4. Check Viewer dependencies + build
echo ""
echo "--- Step 4: Viewer ---"
if [ -d "$MEALMAP_DIR/viewer/node_modules" ]; then
    echo "✅ Viewer dependencies installed"
else
    echo "🔄 Installing Viewer dependencies..."
    cd "$MEALMAP_DIR/viewer" && npm install
    echo "✅ Viewer dependencies installed"
fi

echo "🔄 Building viewer..."
cd "$MEALMAP_DIR/viewer" && npm run build 2>&1 | tail -3
echo "✅ Viewer built"

# 5. Verify key files exist
echo ""
echo "--- Step 5: Key Files ---"
FILES=(
    "specs/backlog.md"
    "specs/01_product_manager.md"
    "specs/02_backend_lead.md"
    "specs/03_frontend_lead.md"
    "specs/04_db_architect.md"
    "specs/05_qa_lead.md"
    "requirements/srs.md"
    "docs/architecture.md"
    "docs/api.md"
    "docs/setup.md"
    ".github/copilot-instructions.md"
    "CLAUDE.md"
    "QUICKSTART.md"
)

ALL_OK=true
for f in "${FILES[@]}"; do
    if [ -f "$MEALMAP_DIR/$f" ]; then
        echo "✅ $f"
    else
        echo "❌ MISSING: $f"
        ALL_OK=false
    fi
done

# 6. Summary
echo ""
echo "=== Demo Readiness ==="
if $ALL_OK; then
    echo "✅ All checks passed! Ready for demo."
    echo ""
    echo "Next steps:"
    echo "  1. Open VSCode:  code $MEALMAP_DIR"
    echo "  2. Start viewer: cd $MEALMAP_DIR/viewer && npm run dev"
    echo "  3. Open browser:  http://localhost:5173"
    echo "  4. Open Copilot Chat in VSCode"
    echo "  5. Increase font size: Cmd+= (or Ctrl+=)"
else
    echo "❌ Some checks failed. Fix issues above before demo."
fi
