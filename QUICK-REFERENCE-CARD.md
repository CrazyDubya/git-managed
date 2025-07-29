# Git Workflow Quick Reference Card

*Print this out and keep it handy!*

## Setup (One Time)
```bash
cd git-workflow-project
source scripts/git-helpers.sh
source scripts/individual-helpers.sh
./scripts/setup-git-hooks.sh
```

## Individual Developer: Chaos to Clean

### 🧪 Experiment Mode
```bash
personal_branch "crazy-idea"          # Start experimenting
messy_commit "trying this thing"      # Save progress frequently
messy_commit "breakthrough!"          # Document discoveries
experiment_status                     # Check what you have
```

### 🎯 Delivery Mode
```bash
backup_branch                         # Safety first!
start_cleanup "user-authentication"   # Begin cleanup
find_working_commits                  # Identify good stuff
git cherry-pick abc123f               # Copy good commits
git rebase -i HEAD~3                  # Clean up history
safe_merge_to_develop                 # Deliver to team
```

### 🚨 Emergency
```bash
emergency_extract "working-solution"  # Nuclear option: copy files to clean branch
```

## Team Coordination

### 🌿 Branch Creation
```bash
create_feature "feature-name"         # Team features
create_experiment "research-topic"    # Shared experiments  
create_hotfix "urgent-fix"           # Production fixes
create_personal "name" "purpose"     # Individual work
```

### 🔄 Daily Workflow
```bash
git_status_overview                   # Where am I?
quick_commit "feat" "description"     # Professional commits
safe_merge_to_develop                # Safe integration
cleanup_merged_branches              # Weekly maintenance
```

### 🆘 Disaster Recovery
```bash
git_help                             # Show all commands
emergency_reset                      # Reset branch (CAREFUL!)
# See TROUBLESHOOTING.md for specific disasters
```

## Branch Strategy at a Glance

| Branch | Purpose | Who Uses | Stability |
|--------|---------|----------|-----------|
| `main` | Production | DevOps only | 🟢 Rock solid |
| `staging` | Testing | QA team | 🟡 Should work |
| `develop` | Integration | Everyone | 🟡 Builds pass |
| `draft` | Proof of concept | Experimenters | 🔴 Anything goes |
| `feature/*` | New features | Developers | 🟡 Feature complete |
| `experiment/*` | Research | Anyone | 🔴 May not work |
| `personal/*` | Individual chaos | You | 🔴 Total freedom |
| `hotfix/*` | Emergency fixes | Senior devs | 🟢 Tested fixes |

## Commit Message Cheat Sheet

### For Team Delivery
- `feat: add user authentication`
- `fix: resolve login timeout issue`
- `docs: update API documentation`
- `test: add unit tests for auth module`
- `refactor: simplify user validation logic`

### For Personal Experiments
- `WIP: trying JWT approach`
- `experiment: testing Redis caching`
- `broken but saving progress`
- `EUREKA! This actually works`

## The Golden Rules

### Individual Rules
1. **Experiment freely** in personal branches
2. **Backup before cleanup** - always!
3. **Cherry-pick good commits** to clean branches
4. **Tell a story** with your final commits
5. **Test before delivering** to the team

### Team Rules
1. **Never commit directly** to main/staging
2. **Pull before pushing** always
3. **Use descriptive branch names** 
4. **Clean up merged branches** weekly
5. **Ask for help** when confused

## Emergency Contacts

### "I Broke Everything"
1. **STOP** - don't make it worse
2. **Check** `git reflog` for recent history
3. **Try** simple recovery first
4. **Ask** team lead for help
5. **Document** what happened

### "I'm Lost"
```bash
git_status_overview    # Where am I?
individual_help        # What can I do?
git_help              # Team functions
```

## File Quick Access

- **Strategy**: `git-organization-strategy.md`
- **Individual Guide**: `INDIVIDUAL-DEVELOPER-STRATEGY.md`
- **Troubleshooting**: `TROUBLESHOOTING.md`
- **Team Notes**: `TEAM-NOTES.md`
- **Quick Start**: `QUICK-START.md`

## Daily Mantras

### For Experimenters
*"Experiment wildly, deliver cleanly"*

### For Teams  
*"Commit often, merge safely, clean up regularly"*

### For Everyone
*"When in doubt, backup first"*

---

**Remember**: This system is designed to handle chaos while teaching better practices. The goal is progress, not perfection!