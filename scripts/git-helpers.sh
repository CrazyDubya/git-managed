#!/bin/bash

# Git Helper Scripts for Multi-Developer Environment
# Usage: source scripts/git-helpers.sh

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Quick branch creation with proper naming
create_feature() {
    if [ -z "$1" ]; then
        echo -e "${RED}Usage: create_feature <feature-name>${NC}"
        return 1
    fi
    
    git checkout develop 2>/dev/null || git checkout -b develop
    git pull origin develop 2>/dev/null || echo "No remote yet"
    git checkout -b "feature/$1"
    echo -e "${GREEN}Created feature branch: feature/$1${NC}"
}

create_experiment() {
    if [ -z "$1" ]; then
        echo -e "${RED}Usage: create_experiment <experiment-name>${NC}"
        return 1
    fi
    
    git checkout draft 2>/dev/null || git checkout -b draft
    git pull origin draft 2>/dev/null || echo "No remote yet"
    git checkout -b "experiment/$1"
    echo -e "${GREEN}Created experiment branch: experiment/$1${NC}"
}

create_personal() {
    if [ -z "$1" ] || [ -z "$2" ]; then
        echo -e "${RED}Usage: create_personal <your-name> <branch-purpose>${NC}"
        return 1
    fi
    
    git checkout develop 2>/dev/null || git checkout -b develop
    git pull origin develop 2>/dev/null || echo "No remote yet"
    git checkout -b "personal/$1/$2"
    echo -e "${GREEN}Created personal branch: personal/$1/$2${NC}"
}

create_hotfix() {
    if [ -z "$1" ]; then
        echo -e "${RED}Usage: create_hotfix <fix-description>${NC}"
        return 1
    fi
    
    git checkout main
    git pull origin main 2>/dev/null || echo "No remote yet"
    git checkout -b "hotfix/$1"
    echo -e "${GREEN}Created hotfix branch: hotfix/$1${NC}"
}

# Safe merge helpers
safe_merge_to_develop() {
    current_branch=$(git branch --show-current)
    
    if [[ $current_branch != feature/* ]] && [[ $current_branch != experiment/* ]]; then
        echo -e "${RED}Warning: You're not on a feature or experiment branch${NC}"
        echo -e "${YELLOW}Current branch: $current_branch${NC}"
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            return 1
        fi
    fi
    
    git checkout develop 2>/dev/null || git checkout -b develop
    git pull origin develop 2>/dev/null || echo "No remote yet"
    git merge --no-ff "$current_branch"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Successfully merged $current_branch to develop${NC}"
        read -p "Delete the merged branch? (Y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Nn]$ ]]; then
            git branch -d "$current_branch"
            echo -e "${GREEN}Deleted branch: $current_branch${NC}"
        fi
    else
        echo -e "${RED}Merge failed. Please resolve conflicts.${NC}"
    fi
}

# Quick commit with conventional format
quick_commit() {
    if [ -z "$1" ] || [ -z "$2" ]; then
        echo -e "${RED}Usage: quick_commit <type> <message>${NC}"
        echo -e "${YELLOW}Types: feat, fix, docs, style, refactor, test, chore, experiment${NC}"
        return 1
    fi
    
    git add .
    git commit -m "$1: $2"
    echo -e "${GREEN}Committed with message: $1: $2${NC}"
}

# Branch cleanup
cleanup_merged_branches() {
    echo -e "${BLUE}Cleaning up merged branches...${NC}"
    
    # Delete local branches that have been merged to develop
    git branch --merged develop 2>/dev/null | grep -E "(feature/|experiment/|personal/)" | xargs -n 1 git branch -d 2>/dev/null
    
    # Delete remote tracking branches that no longer exist
    git remote prune origin 2>/dev/null
    
    echo -e "${GREEN}Cleanup complete${NC}"
}

# Status overview
git_status_overview() {
    echo -e "${BLUE}=== Git Status Overview ===${NC}"
    echo
    
    echo -e "${YELLOW}Current branch:${NC}"
    git branch --show-current
    echo
    
    echo -e "${YELLOW}Recent commits:${NC}"
    git log --oneline -5 2>/dev/null || echo "No commits yet"
    echo
    
    echo -e "${YELLOW}Working directory status:${NC}"
    git status --short
    echo
    
    echo -e "${YELLOW}All branches:${NC}"
    git branch -a
    echo
    
    echo -e "${YELLOW}Stashes:${NC}"
    git stash list
}

# Emergency recovery
emergency_reset() {
    echo -e "${RED}WARNING: This will reset your current branch to match origin${NC}"
    echo -e "${RED}All local changes will be lost!${NC}"
    
    current_branch=$(git branch --show-current)
    echo -e "${YELLOW}Current branch: $current_branch${NC}"
    
    read -p "Are you absolutely sure? Type 'RESET' to continue: " confirmation
    
    if [ "$confirmation" = "RESET" ]; then
        git fetch origin 2>/dev/null || echo "No remote configured"
        git reset --hard "origin/$current_branch" 2>/dev/null || git reset --hard HEAD
        git clean -fd
        echo -e "${GREEN}Branch reset${NC}"
    else
        echo -e "${BLUE}Reset cancelled${NC}"
    fi
}

# Show help
git_help() {
    echo -e "${BLUE}=== Git Helper Functions ===${NC}"
    echo
    echo -e "${YELLOW}Branch Creation:${NC}"
    echo "  create_feature <name>     - Create feature branch from develop"
    echo "  create_experiment <name>  - Create experiment branch from draft"
    echo "  create_personal <user> <purpose> - Create personal sandbox"
    echo "  create_hotfix <name>      - Create hotfix branch from main"
    echo
    echo -e "${YELLOW}Merging:${NC}"
    echo "  safe_merge_to_develop     - Safely merge current branch to develop"
    echo
    echo -e "${YELLOW}Maintenance:${NC}"
    echo "  cleanup_merged_branches   - Clean up merged feature branches"
    echo "  git_status_overview       - Show comprehensive status"
    echo
    echo -e "${YELLOW}Emergency:${NC}"
    echo "  emergency_reset           - Reset branch to origin (DANGEROUS)"
    echo
    echo -e "${YELLOW}Utilities:${NC}"
    echo "  quick_commit <type> <msg> - Quick conventional commit"
    echo "  git_help                  - Show this help"
}

echo -e "${GREEN}Git helper functions loaded. Type 'git_help' for available commands.${NC}"