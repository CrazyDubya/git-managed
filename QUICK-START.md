# Quick Start Guide for Git Organization

## Initial Setup (One Time)

```bash
# Navigate to project
cd git-workflow-project

# Load helper functions (add to your .bashrc/.zshrc for permanent access)
source scripts/git-helpers.sh

# Set up your git identity if not already done
git config --global user.name "Your Name"
git config --global user.email "your.email@company.com"
```

## Daily Workflow

### Starting New Work

```bash
# For new features
create_feature "user-authentication"

# For experiments
create_experiment "ml-recommendation-engine"

# For personal exploration
create_personal "john-doe" "api-refactor"
```

### Making Changes

```bash
# Quick commit with conventional format
quick_commit "feat" "add user login functionality"

# Or traditional way
git add .
git commit -m "feat: add user login functionality"
```

### Finishing Work

```bash
# Merge feature to develop safely
safe_merge_to_develop

# Push to staging for testing
git checkout staging
git merge develop
```

### Emergency Fixes

```bash
# Create hotfix
create_hotfix "security-vulnerability"

# Fix and commit
quick_commit "fix" "patch security vulnerability"

# Merge to main and develop
git checkout main
git merge --no-ff hotfix/security-vulnerability
git checkout develop
git merge --no-ff hotfix/security-vulnerability
```

## Branch Purpose Quick Reference

- **main** - Production code only
- **staging** - Pre-production testing
- **develop** - Integration of features
- **draft** - Early development, proof-of-concepts
- **feature/*** - Individual features
- **experiment/*** - Research and experiments
- **personal/*** - Individual sandboxes
- **hotfix/*** - Critical production fixes

## Weekly Maintenance

```bash
# Clean up old branches
cleanup_merged_branches

# Check overall status
git_status_overview
```

## Emergency Commands

```bash
# If you're lost, get overview
git_status_overview

# If branch is corrupted (DANGEROUS)
emergency_reset

# Get help
git_help
```

## Tips for Disorganized Teams

1. **Use personal branches** for exploration: `create_personal "your-name" "trying-stuff"`
2. **Commit often** with descriptive messages
3. **Clean up weekly** with `cleanup_merged_branches`
4. **When in doubt** use `git_status_overview`
5. **Emergency recovery** available but use carefully

Remember: This system is designed to handle chaos while maintaining some order!