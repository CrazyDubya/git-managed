# Git Organization Strategy for Multi-Developer Environment

## Overview
This document outlines a Git branching strategy designed for a team with multiple developers working across different environments (draft, staging, production) with experimental features and potentially disorganized workflows.

## Branch Structure

### Core Environment Branches
- **`main`** - Production-ready code, always deployable
- **`staging`** - Pre-production testing environment
- **`develop`** - Integration branch for ongoing development
- **`draft`** - Early development and proof-of-concept work

### Supporting Branch Types
- **`feature/*`** - Individual feature development
- **`experiment/*`** - Experimental features and research
- **`hotfix/*`** - Critical production fixes
- **`release/*`** - Release preparation
- **`personal/*`** - Individual developer sandboxes

## Workflow Rules

### 1. Main Branch (`main`)
- **Purpose**: Production-ready code only
- **Protection**: Requires pull request reviews, CI/CD passes
- **Merges from**: `release/*` branches only
- **Direct commits**: NEVER allowed

### 2. Staging Branch (`staging`)
- **Purpose**: Pre-production testing
- **Merges from**: `develop`, `hotfix/*`
- **Auto-deploys to**: Staging environment
- **Reset frequency**: Weekly or after major releases

### 3. Develop Branch (`develop`)
- **Purpose**: Integration of completed features
- **Merges from**: `feature/*`, `experiment/*` (when stable)
- **Merges to**: `staging`, `release/*`
- **Stability**: Should always build successfully

### 4. Draft Branch (`draft`)
- **Purpose**: Early development, proof-of-concepts
- **Merges from**: Any branch
- **Stability**: No guarantees, experimental code allowed
- **Usage**: Quick prototyping, sharing early ideas

## Daily Workflow Examples

### Feature Development
```bash
create_feature "user-authentication"
# Work on feature
quick_commit "feat" "add login form"
safe_merge_to_develop
```

### Experimental Work
```bash
create_experiment "ml-recommendation"
# Try different approaches
quick_commit "experiment" "testing neural network approach"
# If successful, cherry-pick to develop
```

### Emergency Fixes
```bash
create_hotfix "security-patch"
quick_commit "fix" "patch XSS vulnerability"
# Merge to main and develop
```

## Handling Chaos

### For Disorganized Teams
- Use `personal/*` branches for individual exploration
- Regular cleanup with `cleanup_merged_branches`
- Emergency recovery with `emergency_reset` (use carefully)
- Status overview with `git_status_overview`

### Branch Protection
- Main: Requires 2 reviews, all checks pass
- Staging: Requires 1 review, allows force push for resets
- Develop: Requires 1 review, dismisses stale reviews

### Recovery Procedures
```bash
# Lost work recovery
git reflog
git cherry-pick <commit-hash>

# Branch corruption
emergency_reset  # DANGEROUS - use only when necessary

# Wrong branch commits
git cherry-pick <commit>  # Move to correct branch
git reset --hard HEAD~1   # Remove from wrong branch
```

## Naming Conventions

- `feature/JIRA-123-user-auth`
- `experiment/ml-recommendations`
- `hotfix/security-vulnerability`
- `personal/john-doe/api-refactor`

## Commit Message Format
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation
- `experiment:` - Experimental work
- `chore:` - Maintenance

## Notes Section for Team Updates

### Recent Changes
- [Date] - Updated branch protection rules
- [Date] - Added personal branch cleanup automation

### Team Decisions
- Weekly staging resets on Fridays
- Feature branches deleted after merge
- Experiments kept for 30 days max

### Pain Points & Solutions
- **Issue**: Too many abandoned branches
- **Solution**: Automated cleanup script runs weekly

- **Issue**: Direct commits to main
- **Solution**: Branch protection + education

### Future Improvements
- [ ] Add pre-commit hooks
- [ ] Implement automated testing
- [ ] Set up branch auto-deletion
- [ ] Create release automation

---
*Last updated: $(date)*
*Next review: Quarterly*