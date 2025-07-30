#!/bin/bash

# Update Dashboard Data Script
# Collects current Git status and updates dashboard data files

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Updating Dashboard Data ===${NC}"

# Create data directory if it doesn't exist
mkdir -p dashboards/data

# Get current Git status
echo -e "${YELLOW}Collecting Git status...${NC}"

# Current branch
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")

# Branch count
TOTAL_BRANCHES=$(git branch -a 2>/dev/null | wc -l | tr -d ' ')

# Uncommitted files
UNCOMMITTED_FILES=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')

# Commits ahead of origin
COMMITS_AHEAD=$(git rev-list --count HEAD ^origin/$CURRENT_BRANCH 2>/dev/null || echo "0")

# Commits behind origin
COMMITS_BEHIND=$(git rev-list --count origin/$CURRENT_BRANCH ^HEAD 2>/dev/null || echo "0")

# Last commit info
LAST_COMMIT=$(git log -1 --format="%h - %s (%cr)" 2>/dev/null || echo "No commits")

# Repository status
if [ "$UNCOMMITTED_FILES" -eq 0 ]; then
    REPO_STATUS="clean"
else
    REPO_STATUS="modified"
fi

# Branch list with details
echo -e "${YELLOW}Collecting branch information...${NC}"
BRANCH_DATA=$(git for-each-ref --format='%(refname:short)|%(committerdate:relative)|%(authorname)|%(subject)' refs/heads/ 2>/dev/null)

# Remote information
REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "No remote")

# Stash count
STASH_COUNT=$(git stash list 2>/dev/null | wc -l | tr -d ' ')

# Generate JSON data file
echo -e "${YELLOW}Generating dashboard data...${NC}"

cat > dashboards/data/git-status.json << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "currentBranch": "$CURRENT_BRANCH",
  "totalBranches": $TOTAL_BRANCHES,
  "uncommittedFiles": $UNCOMMITTED_FILES,
  "commitsAhead": $COMMITS_AHEAD,
  "commitsBehind": $COMMITS_BEHIND,
  "repositoryStatus": "$REPO_STATUS",
  "lastCommit": "$LAST_COMMIT",
  "remoteUrl": "$REMOTE_URL",
  "stashCount": $STASH_COUNT,
  "branches": [
EOF

# Add branch data
FIRST=true
while IFS='|' read -r branch date author subject; do
    if [ ! -z "$branch" ]; then
        if [ "$FIRST" = true ]; then
            FIRST=false
        else
            echo "," >> dashboards/data/git-status.json
        fi
        
        # Determine branch type
        if [[ $branch == feature/* ]]; then
            BRANCH_TYPE="feature"
        elif [[ $branch == experiment/* ]]; then
            BRANCH_TYPE="experiment"
        elif [[ $branch == personal/* ]]; then
            BRANCH_TYPE="personal"
        elif [[ $branch == hotfix/* ]]; then
            BRANCH_TYPE="hotfix"
        elif [[ $branch == "main" || $branch == "staging" || $branch == "develop" || $branch == "draft" ]]; then
            BRANCH_TYPE="core"
        else
            BRANCH_TYPE="other"
        fi
        
        # Determine status (simplified)
        if [ "$branch" = "$CURRENT_BRANCH" ]; then
            BRANCH_STATUS="active"
        else
            BRANCH_STATUS="inactive"
        fi
        
        cat >> dashboards/data/git-status.json << EOF
    {
      "name": "$branch",
      "type": "$BRANCH_TYPE",
      "status": "$BRANCH_STATUS",
      "lastCommit": "$date",
      "author": "$author",
      "subject": "$subject"
    }
EOF
    fi
done <<< "$BRANCH_DATA"

cat >> dashboards/data/git-status.json << EOF

  ]
}
EOF

# Generate individual experiment data
echo -e "${YELLOW}Generating individual experiment data...${NC}"

cat > dashboards/data/experiments.json << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "personalBranches": [
EOF

# Find personal branches
PERSONAL_BRANCHES=$(git branch | grep "personal/" 2>/dev/null || echo "")
FIRST=true

if [ ! -z "$PERSONAL_BRANCHES" ]; then
    while read -r branch; do
        branch=$(echo "$branch" | sed 's/^[* ] //')
        if [ ! -z "$branch" ]; then
            if [ "$FIRST" = true ]; then
                FIRST=false
            else
                echo "," >> dashboards/data/experiments.json
            fi
            
            COMMIT_COUNT=$(git rev-list --count "$branch" 2>/dev/null || echo "0")
            LAST_COMMIT_DATE=$(git log -1 --format="%cr" "$branch" 2>/dev/null || echo "unknown")
            
            cat >> dashboards/data/experiments.json << EOF
    {
      "name": "$branch",
      "commitCount": $COMMIT_COUNT,
      "lastActivity": "$LAST_COMMIT_DATE",
      "status": "active"
    }
EOF
        fi
    done <<< "$PERSONAL_BRANCHES"
fi

cat >> dashboards/data/experiments.json << EOF

  ],
  "experimentBranches": [
EOF

# Find experiment branches
EXPERIMENT_BRANCHES=$(git branch | grep "experiment/" 2>/dev/null || echo "")
FIRST=true

if [ ! -z "$EXPERIMENT_BRANCHES" ]; then
    while read -r branch; do
        branch=$(echo "$branch" | sed 's/^[* ] //')
        if [ ! -z "$branch" ]; then
            if [ "$FIRST" = true ]; then
                FIRST=false
            else
                echo "," >> dashboards/data/experiments.json
            fi
            
            COMMIT_COUNT=$(git rev-list --count "$branch" 2>/dev/null || echo "0")
            LAST_COMMIT_DATE=$(git log -1 --format="%cr" "$branch" 2>/dev/null || echo "unknown")
            
            cat >> dashboards/data/experiments.json << EOF
    {
      "name": "$branch",
      "commitCount": $COMMIT_COUNT,
      "lastActivity": "$LAST_COMMIT_DATE",
      "status": "active"
    }
EOF
        fi
    done <<< "$EXPERIMENT_BRANCHES"
fi

cat >> dashboards/data/experiments.json << EOF

  ]
}
EOF

# Generate team activity data
echo -e "${YELLOW}Generating team activity data...${NC}"

cat > dashboards/data/team-activity.json << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "recentCommits": [
EOF

# Get recent commits
RECENT_COMMITS=$(git log --oneline -10 --format='%h|%s|%an|%cr' 2>/dev/null)
FIRST=true

if [ ! -z "$RECENT_COMMITS" ]; then
    while IFS='|' read -r hash subject author date; do
        if [ ! -z "$hash" ]; then
            if [ "$FIRST" = true ]; then
                FIRST=false
            else
                echo "," >> dashboards/data/team-activity.json
            fi
            
            cat >> dashboards/data/team-activity.json << EOF
    {
      "hash": "$hash",
      "subject": "$subject",
      "author": "$author",
      "date": "$date"
    }
EOF
        fi
    done <<< "$RECENT_COMMITS"
fi

cat >> dashboards/data/team-activity.json << EOF

  ]
}
EOF

# Update dashboard HTML files with current data
echo -e "${YELLOW}Updating dashboard HTML files...${NC}"

# Update index.html with current status
if [ -f "dashboards/index.html" ]; then
    # This is a simplified update - in a real implementation, you'd use a more sophisticated method
    sed -i.bak "s/id=\"current-branch\">[^<]*/id=\"current-branch\">$CURRENT_BRANCH/" dashboards/index.html 2>/dev/null
    sed -i.bak "s/id=\"total-branches\">[^<]*/id=\"total-branches\">$TOTAL_BRANCHES/" dashboards/index.html 2>/dev/null
    sed -i.bak "s/id=\"uncommitted-files\">[^<]*/id=\"uncommitted-files\">$UNCOMMITTED_FILES/" dashboards/index.html 2>/dev/null
    rm -f dashboards/index.html.bak 2>/dev/null
fi

# Create a simple status summary
echo -e "${YELLOW}Creating status summary...${NC}"

cat > dashboards/data/status-summary.txt << EOF
Git Workflow Dashboard Status Summary
Generated: $(date)

Repository Status:
- Current Branch: $CURRENT_BRANCH
- Total Branches: $TOTAL_BRANCHES
- Uncommitted Files: $UNCOMMITTED_FILES
- Commits Ahead: $COMMITS_AHEAD
- Commits Behind: $COMMITS_BEHIND
- Repository Status: $REPO_STATUS
- Stash Count: $STASH_COUNT

Last Commit: $LAST_COMMIT
Remote URL: $REMOTE_URL

Branch Breakdown:
$(git branch | sed 's/^/  /')

Recent Activity:
$(git log --oneline -5 | sed 's/^/  /')
EOF

echo -e "${GREEN}✅ Dashboard data updated successfully!${NC}"
echo -e "${BLUE}Data files created:${NC}"
echo -e "  📄 dashboards/data/git-status.json"
echo -e "  📄 dashboards/data/experiments.json"
echo -e "  📄 dashboards/data/team-activity.json"
echo -e "  📄 dashboards/data/status-summary.txt"
echo
echo -e "${YELLOW}💡 Tip: Run this script regularly or set up a cron job for automatic updates${NC}"
echo -e "${YELLOW}💡 You can also call this from the dashboard refresh buttons${NC}"