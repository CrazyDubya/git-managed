#!/bin/bash

# Setup Git Hooks for Team Safety
# Run this once per repository to install protective hooks

HOOKS_DIR=".git/hooks"

echo "Setting up Git hooks for team safety..."

# Pre-commit hook - prevents commits to protected branches
cat > "$HOOKS_DIR/pre-commit" << 'EOF'
#!/bin/bash

# Prevent direct commits to main and staging
current_branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')

if [ "$current_branch" = "main" ] || [ "$current_branch" = "staging" ]; then
    echo "🚫 Direct commits to $current_branch are not allowed!"
    echo "Please create a feature branch or use a hotfix branch."
    echo ""
    echo "Quick fix:"
    echo "  git reset --soft HEAD~1"
    echo "  git checkout -b feature/your-feature-name"
    echo "  git commit"
    exit 1
fi

# Run basic checks
if ! git diff --cached --quiet; then
    echo "✅ Pre-commit checks passed"
fi
EOF

# Pre-push hook - warns about force pushes
cat > "$HOOKS_DIR/pre-push" << 'EOF'
#!/bin/bash

# Warn about force pushes
if [[ "$*" == *"--force"* ]] || [[ "$*" == *"-f"* ]]; then
    echo "⚠️  WARNING: You are about to force push!"
    echo "This can overwrite other people's work."
    read -p "Are you sure? (type 'yes' to continue): " confirm
    if [ "$confirm" != "yes" ]; then
        echo "Push cancelled."
        exit 1
    fi
fi
EOF

# Post-merge hook - cleanup suggestions
cat > "$HOOKS_DIR/post-merge" << 'EOF'
#!/bin/bash

echo "🎉 Merge completed!"
echo "💡 Don't forget to run 'cleanup_merged_branches' periodically"

# Check if we're on develop and suggest pushing to staging
current_branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')
if [ "$current_branch" = "develop" ]; then
    echo "💡 Consider merging to staging for testing:"
    echo "   git checkout staging && git merge develop"
fi
EOF

# Make hooks executable
chmod +x "$HOOKS_DIR/pre-commit"
chmod +x "$HOOKS_DIR/pre-push"
chmod +x "$HOOKS_DIR/post-merge"

echo "✅ Git hooks installed successfully!"
echo ""
echo "Hooks installed:"
echo "  - pre-commit: Prevents direct commits to main/staging"
echo "  - pre-push: Warns about force pushes"
echo "  - post-merge: Provides helpful suggestions"