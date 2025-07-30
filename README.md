# Git Workflow Management System

A comprehensive Git organization strategy and toolset designed for teams with multiple developers working across different environments (draft, staging, production). This system provides structure for potentially disorganized workflows while maintaining code quality and deployment safety.

## 🚀 What This System Provides

- **Structured Git workflow** with clear branch hierarchy
- **Helper scripts** for common Git operations
- **Interactive dashboards** for workflow visualization
- **Comprehensive documentation** for team onboarding
- **Safety mechanisms** to prevent common Git mistakes

## 📋 Table of Contents

- [Installation & Setup](#installation--setup)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Scripts Usage](#scripts-usage)
- [Dashboard System](#dashboard-system)
- [Branch Structure](#branch-structure)
- [Documentation](#documentation)
- [Contributing](#contributing)

## 🛠 Installation & Setup

### Prerequisites
- Git 2.20+ installed
- Bash shell (Linux/macOS/WSL)
- Web browser for dashboards
- Text editor of choice

### Initial Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd git-managed
   ```

2. **Load helper functions (required):**
   ```bash
   # One-time setup - add to your shell profile
   echo "source $(pwd)/scripts/git-helpers.sh" >> ~/.bashrc
   source ~/.bashrc
   
   # Or load manually each session
   source scripts/git-helpers.sh
   ```

3. **Set up Git hooks (optional but recommended):**
   ```bash
   ./scripts/setup-git-hooks.sh
   ```

4. **Launch dashboards:**
   ```bash
   ./scripts/launch-dashboards.sh
   ```

## ⚡ Quick Start

### For New Team Members

1. **Load the helper functions:**
   ```bash
   source scripts/git-helpers.sh
   ```

2. **Read the essential guides:**
   - [Quick Start Guide](QUICK-START.md) - Daily workflows
   - [Git Organization Strategy](git-organization-strategy.md) - Full system details

3. **Start your first feature:**
   ```bash
   # Create a new feature branch
   create_feature "your-feature-name"
   
   # Make changes and commit
   quick_commit "feat" "add new functionality"
   
   # Merge back safely
   safe_merge_to_develop
   ```

### For Team Leads

1. **Open the team dashboard:** Navigate to `dashboards/team-dashboard.html`
2. **Review the strategy:** Read [Git Organization Strategy](git-organization-strategy.md)
3. **Check troubleshooting:** Review [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

## 📁 Project Structure

```
git-managed/
├── README.md                          # This file - main documentation
├── .gitignore                         # Git ignore rules
├── 
├── 📚 Documentation/
│   ├── QUICK-START.md                 # Daily workflow guide
│   ├── git-organization-strategy.md   # Complete strategy documentation
│   ├── INDIVIDUAL-DEVELOPER-STRATEGY.md # Personal workflow guidance
│   ├── TEAM-NOTES.md                  # Team coordination notes
│   ├── TROUBLESHOOTING.md             # Common issues and solutions
│   ├── DEPLOYMENT-CHECKLIST.md        # Release preparation checklist
│   ├── DASHBOARD-SYSTEM-COMPLETE.md   # Dashboard documentation
│   └── QUICK-REFERENCE-CARD.md        # Command reference
│
├── 🛠 Scripts/
│   ├── git-helpers.sh                 # Core Git helper functions
│   ├── individual-helpers.sh          # Personal workflow functions
│   ├── launch-dashboards.sh           # Dashboard launcher
│   ├── setup-git-hooks.sh             # Git hooks installer
│   └── update-dashboard-data.sh       # Dashboard data updater
│
└── 🖥 Dashboards/
    ├── index.html                     # Main dashboard hub
    ├── team-dashboard.html            # Team overview dashboard
    ├── individual-dashboard.html      # Personal workflow dashboard
    ├── git-workflow-dashboard.html    # Workflow visualizer
    ├── branch-visualizer.html         # Branch structure viewer
    ├── quick-actions-gui.html         # GUI for common actions
    ├── data/                          # Dashboard data storage
    ├── git-integration.js             # Git data integration
    ├── navigation.js                  # Dashboard navigation
    └── real-git-executor.js           # Git command execution
```

## 🔧 Scripts Usage

### Core Helper Functions (`git-helpers.sh`)

```bash
# Feature development
create_feature "feature-name"          # Creates feature/feature-name branch
create_experiment "experiment-name"    # Creates experiment/experiment-name branch
create_hotfix "hotfix-name"           # Creates hotfix/hotfix-name branch

# Quick commits with conventional format
quick_commit "feat" "description"      # Commits with conventional format
quick_commit "fix" "bug description"   # Bug fix commit
quick_commit "docs" "update readme"    # Documentation commit

# Safe merging
safe_merge_to_develop                  # Safely merges current branch to develop
safe_merge_to_staging                  # Safely merges to staging

# Branch management
cleanup_merged_branches                # Removes merged branches
git_status_overview                    # Shows comprehensive repository status
emergency_reset                        # Emergency branch recovery (DANGEROUS)
```

### Personal Workflow Functions (`individual-helpers.sh`)

```bash
# Personal branches
create_personal "your-name" "topic"    # Creates personal/your-name/topic

# Quick workflows
daily_standup                          # Shows your recent work
weekly_cleanup                         # Cleans your branches
my_branches                           # Lists your branches only
```

### Dashboard Management

```bash
# Launch all dashboards
./scripts/launch-dashboards.sh

# Update dashboard data
./scripts/update-dashboard-data.sh

# Setup Git hooks for automatic updates
./scripts/setup-git-hooks.sh
```

## 🖥 Dashboard System

The system includes interactive HTML dashboards for workflow visualization:

### Available Dashboards

1. **Main Hub** (`dashboards/index.html`)
   - Central navigation to all dashboards
   - Quick status overview
   - Direct links to documentation

2. **Team Dashboard** (`dashboards/team-dashboard.html`)
   - Branch overview for entire team
   - Merge conflict detection
   - Team activity timeline

3. **Individual Dashboard** (`dashboards/individual-dashboard.html`)
   - Personal branch management
   - Your recent commits and activity
   - Personal workflow tools

4. **Workflow Visualizer** (`dashboards/git-workflow-dashboard.html`)
   - Interactive branch flow diagram
   - Merge path visualization
   - Strategy compliance checking

5. **Branch Visualizer** (`dashboards/branch-visualizer.html`)
   - Real-time branch structure
   - Relationship mapping
   - Health status indicators

6. **Quick Actions GUI** (`dashboards/quick-actions-gui.html`)
   - GUI wrapper for common Git commands
   - Safe operation interfaces
   - Confirmation dialogs for dangerous operations

### Accessing Dashboards

**Option 1: Local File Access**
```bash
# Open main dashboard
open dashboards/index.html  # macOS
xdg-open dashboards/index.html  # Linux
```

**Option 2: Local Server (Recommended)**
```bash
# Launch with built-in server
./scripts/launch-dashboards.sh
# Access at http://localhost:8080
```

**Option 3: GitHub Pages (if deployed)**
```
https://your-org.github.io/git-managed/dashboards/
```

## 🌳 Branch Structure

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

### Workflow Rules
- **main**: Only accepts merges from release branches
- **staging**: Accepts merges from develop and hotfix branches
- **develop**: Accepts merges from feature and stable experiment branches
- **draft**: Accepts merges from any branch (experimental space)

## 📖 Documentation

### Essential Reading
- [📖 **Quick Start Guide**](QUICK-START.md) - Get started in 5 minutes
- [📋 **Git Organization Strategy**](git-organization-strategy.md) - Complete workflow documentation
- [🔧 **Quick Reference Card**](QUICK-REFERENCE-CARD.md) - Command cheat sheet

### Specialized Guides
- [👤 **Individual Developer Strategy**](INDIVIDUAL-DEVELOPER-STRATEGY.md) - Personal workflow optimization
- [🚀 **Deployment Checklist**](DEPLOYMENT-CHECKLIST.md) - Release preparation steps
- [🖥 **Dashboard System Guide**](DASHBOARD-SYSTEM-COMPLETE.md) - Dashboard usage and customization
- [🐛 **Troubleshooting**](TROUBLESHOOTING.md) - Common issues and solutions

### Team Resources
- [📝 **Team Notes**](TEAM-NOTES.md) - Team-specific coordination information

## 🤝 Contributing

### For Team Members

1. **Follow the workflow:**
   ```bash
   # Always start from develop
   git checkout develop
   git pull origin develop
   
   # Create your feature branch
   create_feature "meaningful-name"
   
   # Work and commit frequently
   quick_commit "feat" "descriptive message"
   
   # Merge back when complete
   safe_merge_to_develop
   ```

2. **Update documentation** when you:
   - Add new scripts or functions
   - Change workflow processes
   - Discover new issues or solutions

3. **Use the dashboards** to:
   - Check team activity before making changes
   - Verify your branch status
   - Coordinate with other developers

### For System Administrators

1. **Customize for your team:**
   - Edit scripts in `scripts/` directory
   - Modify dashboard configurations
   - Update documentation with team-specific information

2. **Monitor system health:**
   - Review dashboard data regularly
   - Check for merge conflicts
   - Ensure all team members are following workflows

3. **Maintain documentation:**
   - Keep guides up-to-date with process changes
   - Add troubleshooting entries for new issues
   - Update reference materials

### Code Style Guidelines

- **Commit messages**: Use conventional commits format (`feat:`, `fix:`, `docs:`, etc.)
- **Branch naming**: Follow the established prefixes (`feature/`, `hotfix/`, etc.)
- **Documentation**: Update relevant docs with any workflow changes
- **Testing**: Verify changes don't break existing workflows

## 📞 Getting Help

1. **Check the documentation:**
   - [Troubleshooting Guide](TROUBLESHOOTING.md)
   - [Quick Reference](QUICK-REFERENCE-CARD.md)

2. **Use the helper functions:**
   ```bash
   git_help                    # Show available commands
   git_status_overview         # Get repository overview
   ```

3. **Open the dashboards:**
   - Team Dashboard for coordination issues
   - Individual Dashboard for personal workflow help

4. **Emergency situations:**
   ```bash
   emergency_reset             # DANGEROUS: Last resort recovery
   ```

---

## 🎯 Quick Commands Reference

| Action | Command |
|--------|---------|
| Start new feature | `create_feature "name"` |
| Quick commit | `quick_commit "type" "message"` |
| Merge to develop | `safe_merge_to_develop` |
| Check status | `git_status_overview` |
| Clean branches | `cleanup_merged_branches` |
| Open dashboards | `./scripts/launch-dashboards.sh` |
| Get help | `git_help` |

---

**Remember**: This system is designed to handle chaos while maintaining order. When in doubt, use `git_status_overview` and the team dashboard to understand what's happening.