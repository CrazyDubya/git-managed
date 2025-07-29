# Git Workflow Troubleshooting Guide

## Common Disasters & Recovery

### "I committed to main by accident!"
```bash
# Don't panic! Move the commit to a proper branch
git reset --soft HEAD~1  # Undo commit but keep changes
git checkout -b hotfix/accidental-commit
git commit -m "fix: move accidental commit to proper branch"

# Now merge properly
git checkout develop
git merge --no-ff hotfix/accidental-commit
```

### "I force-pushed and broke everything!"
```bash
# Find the commit before the force push
git reflog
# Look for the commit hash before the disaster

# Reset to that commit
git reset --hard <commit-hash>
git push --force-with-lease origin branch-name

# Notify team immediately!
```

### "I can't find my work!"
```bash
# Check reflog for lost commits
git reflog --all

# Search for specific content
git log --all --grep="search term"
git log --all -S "code snippet"

# Check stashes
git stash list
git stash show stash@{0}
```

### "Merge conflicts everywhere!"
```bash
# Start fresh with a clean merge
git merge --abort  # Cancel current merge

# Update your branch first
git fetch origin
git rebase origin/develop

# Try merge again
git checkout develop
git merge --no-ff your-branch
```

### "Someone deleted my branch!"
```bash
# Find the deleted branch in reflog
git reflog --all | grep "branch-name"

# Recreate it
git checkout -b branch-name <commit-hash>

# Or check if it exists on remote
git fetch origin
git checkout -b branch-name origin/branch-name
```

## Prevention Strategies

### Daily Habits
- Always `git pull` before starting work
- Use `git_status_overview` when confused
- Commit frequently with good messages
- Push work-in-progress branches daily

### Weekly Habits
- Run `cleanup_merged_branches`
- Review and delete old personal branches
- Update main documentation

### Team Communication
- Announce major changes in team chat
- Use descriptive branch names
- Tag team members in pull requests
- Document decisions in TEAM-NOTES.md

## Emergency Procedures

### Repository Corruption
```bash
# Clone fresh copy
git clone <repository-url> fresh-copy
cd fresh-copy

# Cherry-pick your work from corrupted repo
git remote add corrupted /path/to/corrupted/repo
git fetch corrupted
git cherry-pick <commit-hash>
```

### Lost Remote Connection
```bash
# Re-add remote
git remote add origin <repository-url>
git fetch origin

# Set upstream for current branch
git branch --set-upstream-to=origin/branch-name
```

### Accidental File Deletion
```bash
# Restore from last commit
git checkout HEAD -- filename

# Restore from specific commit
git checkout <commit-hash> -- filename

# Find when file was deleted
git log --oneline --follow -- filename
```

## Team Coordination Issues

### Multiple People on Same Branch
```bash
# Person A pushes first - no problem
git push origin feature/shared-feature

# Person B needs to pull and merge
git pull origin feature/shared-feature
# Resolve any conflicts
git push origin feature/shared-feature
```

### Conflicting Hotfixes
```bash
# Create separate hotfix branches
git checkout main
git checkout -b hotfix/issue-1
# Fix issue 1

git checkout main  
git checkout -b hotfix/issue-2
# Fix issue 2

# Merge in order of priority
git checkout main
git merge --no-ff hotfix/issue-1
git merge --no-ff hotfix/issue-2
```

### Experimental Work Gone Wrong
```bash
# Experiments should be in experiment/ branches
# If experiment breaks develop:

git checkout develop
git reset --hard origin/develop  # Nuclear option
# Or revert specific commits:
git revert <bad-commit-hash>
```

## When All Else Fails

### Nuclear Options (Use with Extreme Caution)
```bash
# Reset branch to match remote exactly
emergency_reset  # Use our helper function

# Or manually:
git fetch origin
git reset --hard origin/branch-name
git clean -fd  # Remove untracked files
```

### Call for Help
1. **Stop making changes** - don't make it worse
2. **Document what happened** - exact commands run
3. **Check reflog** - `git reflog --all`
4. **Contact team lead** - with specific error messages
5. **Share screen** - sometimes easier to debug together

## Recovery Checklist

When disaster strikes:
- [ ] Don't panic
- [ ] Stop making changes
- [ ] Document what happened
- [ ] Check `git reflog`
- [ ] Try simple recovery first
- [ ] Ask for help if needed
- [ ] Update this guide with new scenarios

Remember: Git rarely loses data permanently. Most "disasters" are recoverable with patience and the right commands!