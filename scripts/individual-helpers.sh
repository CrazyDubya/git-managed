#!/bin/bash

# Individual Developer Helper Functions
# For the experimenter who needs to deliver clean work
# Usage: source scripts/individual-helpers.sh

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Get username for branch naming
get_username() {
    git config user.name | tr ' ' '-' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]//g'
}

# Quick personal branch creation
personal_branch() {
    if [ -z "$1" ]; then
        echo -e "${RED}Usage: personal_branch <experiment-name>${NC}"
        echo -e "${YELLOW}Example: personal_branch \"trying-new-auth\"${NC}"
        return 1
    fi
    
    username=$(get_username)
    branch_name="personal/$username/$1"
    
    git checkout develop 2>/dev/null || git checkout -b develop
    git pull origin develop 2>/dev/null || echo "No remote yet"
    git checkout -b "$branch_name"
    echo -e "${GREEN}Created personal branch: $branch_name${NC}"
    echo -e "${YELLOW}Experiment freely! Use 'messy_commit' for quick saves.${NC}"
}

# Backup current work before cleanup
backup_branch() {
    current=$(git branch --show-current)
    timestamp=$(date +%Y%m%d-%H%M)
    backup_name="backup/${current}-${timestamp}"
    
    git checkout -b "$backup_name"
    git push origin "$backup_name" 2>/dev/null || echo "No remote configured"
    git checkout "$current"
    echo -e "${GREEN}Backed up to: $backup_name${NC}"
    echo -e "${BLUE}Your work is safe! Now you can experiment with cleanup.${NC}"
}

# Quick commit for messy work
messy_commit() {
    if [ -z "$1" ]; then
        echo -e "${RED}Usage: messy_commit <quick-description>${NC}"
        echo -e "${YELLOW}Example: messy_commit \"trying this approach\"${NC}"
        return 1
    fi
    
    git add .
    git commit -m "WIP: $1"
    echo -e "${GREEN}Messy commit saved: WIP: $1${NC}"
}

# Start cleanup process
start_cleanup() {
    if [ -z "$1" ]; then
        echo -e "${RED}Usage: start_cleanup <feature-name>${NC}"
        echo -e "${YELLOW}Example: start_cleanup \"user-authentication\"${NC}"
        return 1
    fi
    
    echo -e "${BLUE}Starting cleanup process...${NC}"
    backup_branch
    
    git checkout develop 2>/dev/null || git checkout -b develop
    git pull origin develop 2>/dev/null || echo "No remote yet"
    git checkout -b "feature/$1"
    
    echo -e "${GREEN}Ready to cherry-pick clean commits to feature/$1${NC}"
    echo -e "${YELLOW}Next steps:${NC}"
    echo "  1. Review your messy commits: git log --oneline -10"
    echo "  2. Cherry-pick good ones: git cherry-pick <commit-hash>"
    echo "  3. Clean up history: git rebase -i HEAD~N"
    echo "  4. Deliver: safe_merge_to_develop"
}

# Show experiment status
experiment_status() {
    echo -e "${BLUE}=== Your Experiment Status ===${NC}"
    echo
    
    echo -e "${YELLOW}Personal branches:${NC}"
    git branch | grep "personal/$(get_username)" || echo "  No personal branches found"
    echo
    
    echo -e "${YELLOW}Experiment branches:${NC}"
    git branch | grep "experiment/" || echo "  No experiment branches found"
    echo
    
    echo -e "${YELLOW}Backup branches:${NC}"
    git branch | grep "backup/" || echo "  No backup branches found"
    echo
    
    echo -e "${YELLOW}Current branch:${NC}"
    current=$(git branch --show-current)
    echo "  $current"
    
    if [[ $current == personal/* ]] || [[ $current == experiment/* ]]; then
        echo -e "${GREEN}  ✅ You're in experiment mode - go wild!${NC}"
    elif [[ $current == feature/* ]]; then
        echo -e "${BLUE}  🎯 You're in delivery mode - keep it clean!${NC}"
    else
        echo -e "${YELLOW}  ⚠️  You're on a shared branch - be careful!${NC}"
    fi
    echo
    
    echo -e "${YELLOW}Recent commits on current branch:${NC}"
    git log --oneline -5 2>/dev/null || echo "  No commits yet"
}

# Find working commits from messy history
find_working_commits() {
    echo -e "${BLUE}=== Finding Your Working Commits ===${NC}"
    echo
    
    echo -e "${YELLOW}Recent commits (look for the good ones):${NC}"
    git log --oneline -20 --color=always
    echo
    
    echo -e "${YELLOW}Commits with 'working' or 'fix' in message:${NC}"
    git log --oneline --grep="working\|fix\|success\|done\|complete" --color=always
    echo
    
    echo -e "${YELLOW}Files changed recently:${NC}"
    git diff --name-only HEAD~10 2>/dev/null || echo "  Not enough commits"
    echo
    
    echo -e "${BLUE}Use 'git show <commit-hash>' to review specific commits${NC}"
    echo -e "${BLUE}Use 'git cherry-pick <commit-hash>' to copy good commits${NC}"
}

# Quick diff between experiments
compare_experiments() {
    if [ -z "$1" ] || [ -z "$2" ]; then
        echo -e "${RED}Usage: compare_experiments <branch1> <branch2>${NC}"
        echo -e "${YELLOW}Example: compare_experiments personal/me/approach1 personal/me/approach2${NC}"
        return 1
    fi
    
    echo -e "${BLUE}=== Comparing $1 vs $2 ===${NC}"
    echo
    
    echo -e "${YELLOW}Files that differ:${NC}"
    git diff --name-only "$1" "$2"
    echo
    
    echo -e "${YELLOW}Commit differences:${NC}"
    echo -e "${GREEN}Only in $1:${NC}"
    git log --oneline "$2".."$1"
    echo -e "${GREEN}Only in $2:${NC}"
    git log --oneline "$1".."$2"
    echo
    
    echo -e "${BLUE}Use 'git diff $1 $2 -- filename' for detailed file comparison${NC}"
}

# Emergency: extract working code from chaos
emergency_extract() {
    if [ -z "$1" ]; then
        echo -e "${RED}Usage: emergency_extract <new-feature-name>${NC}"
        echo -e "${YELLOW}This will copy your current working files to a clean branch${NC}"
        return 1
    fi
    
    echo -e "${YELLOW}⚠️  Emergency extraction mode!${NC}"
    echo -e "${YELLOW}This will copy your current working directory to a clean branch.${NC}"
    read -p "Continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        return 1
    fi
    
    # Backup current state
    backup_branch
    
    # Create clean feature branch
    git checkout develop 2>/dev/null || git checkout -b develop
    git pull origin develop 2>/dev/null || echo "No remote yet"
    git checkout -b "feature/$1"
    
    # Copy working files (excluding git stuff)
    current_dir=$(pwd)
    temp_dir="/tmp/git-extract-$$"
    mkdir -p "$temp_dir"
    
    # Copy files but exclude .git
    rsync -av --exclude='.git' "$current_dir/" "$temp_dir/"
    
    # Clear the feature branch and copy clean files
    git rm -rf . 2>/dev/null || true
    cp -r "$temp_dir/"* . 2>/dev/null || true
    cp -r "$temp_dir/".* . 2>/dev/null || true
    rm -rf "$temp_dir"
    
    git add .
    git commit -m "feat: emergency extraction of working code"
    
    echo -e "${GREEN}✅ Emergency extraction complete!${NC}"
    echo -e "${YELLOW}Review the code and clean up as needed.${NC}"
    echo -e "${BLUE}Your original work is backed up safely.${NC}"
}

# Show individual workflow help
individual_help() {
    echo -e "${BLUE}=== Individual Developer Helper Functions ===${NC}"
    echo
    echo -e "${YELLOW}Experiment Management:${NC}"
    echo "  personal_branch <name>        - Create personal experiment branch"
    echo "  experiment_status             - Show all your experiments"
    echo "  messy_commit <description>    - Quick save of work-in-progress"
    echo
    echo -e "${YELLOW}Cleanup & Delivery:${NC}"
    echo "  backup_branch                 - Backup current work before cleanup"
    echo "  start_cleanup <feature-name>  - Begin process of cleaning up for delivery"
    echo "  find_working_commits          - Help identify good commits from mess"
    echo
    echo -e "${YELLOW}Comparison & Analysis:${NC}"
    echo "  compare_experiments <b1> <b2> - Compare two experiment branches"
    echo
    echo -e "${YELLOW}Emergency:${NC}"
    echo "  emergency_extract <name>      - Copy working files to clean branch"
    echo
    echo -e "${YELLOW}General:${NC}"
    echo "  individual_help               - Show this help"
    echo
    echo -e "${GREEN}Workflow: experiment freely → backup → cleanup → deliver${NC}"
}

echo -e "${GREEN}Individual developer helpers loaded!${NC}"
echo -e "${YELLOW}Type 'individual_help' for available commands.${NC}"
echo -e "${BLUE}Remember: Experiment wildly, deliver cleanly!${NC}"