# Git Workflow Project

This project demonstrates a comprehensive Git organization strategy for teams with multiple developers working across different environments.

## Quick Start

1. Load the helper functions: `source scripts/git-helpers.sh`
2. Read the [Git Organization Strategy](git-organization-strategy.md) for full details
3. Check the [Quick Start Guide](QUICK-START.md) for daily workflows

## Branch Structure

- **main** - Production-ready code
- **staging** - Pre-production testing  
- **develop** - Integration branch
- **draft** - Early development and experiments

## Getting Started

```bash
# Load helper functions
source scripts/git-helpers.sh

# Create a new feature
create_feature "your-feature-name"

# Work and commit
quick_commit "feat" "add new functionality"

# Merge back safely
safe_merge_to_develop
```

See the documentation files for complete workflows and best practices.