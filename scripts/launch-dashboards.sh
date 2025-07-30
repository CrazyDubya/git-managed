#!/bin/bash

# Launch Git Workflow Dashboards
# Opens all dashboards in browser tabs for easy access

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Launching Git Workflow Dashboards${NC}"
echo

# Check if we're in the right directory
if [ ! -d "dashboards" ]; then
    echo -e "${RED}❌ Error: dashboards directory not found${NC}"
    echo -e "${YELLOW}Please run this script from the git-workflow-project directory${NC}"
    exit 1
fi

# Update dashboard data first
echo -e "${YELLOW}📊 Updating dashboard data...${NC}"
if [ -f "scripts/update-dashboard-data.sh" ]; then
    ./scripts/update-dashboard-data.sh
else
    echo -e "${YELLOW}⚠️  Warning: update-dashboard-data.sh not found, skipping data update${NC}"
fi

echo
echo -e "${BLUE}🌐 Opening dashboards in browser...${NC}"

# Function to open URL in default browser
open_url() {
    local url="$1"
    local name="$2"
    
    echo -e "${GREEN}  📱 Opening: $name${NC}"
    
    # Detect OS and open browser accordingly
    if command -v open >/dev/null 2>&1; then
        # macOS
        open "$url"
    elif command -v xdg-open >/dev/null 2>&1; then
        # Linux
        xdg-open "$url"
    elif command -v start >/dev/null 2>&1; then
        # Windows (Git Bash/WSL)
        start "$url"
    else
        echo -e "${YELLOW}    ⚠️  Could not auto-open. Please manually open: $url${NC}"
    fi
    
    # Small delay between opens
    sleep 1
}

# Get the absolute path to dashboards directory
DASHBOARD_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../dashboards" && pwd)"

# Dashboard URLs (file:// protocol for local files)
DASHBOARD_HUB="file://$DASHBOARD_DIR/index.html"
TEAM_DASHBOARD="file://$DASHBOARD_DIR/team-dashboard.html"
INDIVIDUAL_DASHBOARD="file://$DASHBOARD_DIR/individual-dashboard.html"
BRANCH_VISUALIZER="file://$DASHBOARD_DIR/branch-visualizer.html"
QUICK_ACTIONS="file://$DASHBOARD_DIR/quick-actions-gui.html"

# Open dashboards
open_url "$DASHBOARD_HUB" "Dashboard Hub"
open_url "$TEAM_DASHBOARD" "Team Dashboard"
open_url "$INDIVIDUAL_DASHBOARD" "Individual Dashboard"
open_url "$BRANCH_VISUALIZER" "Branch Visualizer"
open_url "$QUICK_ACTIONS" "Quick Actions GUI"

echo
echo -e "${GREEN}✅ All dashboards launched successfully!${NC}"
echo
echo -e "${BLUE}📋 Dashboard URLs:${NC}"
echo -e "  🏠 Dashboard Hub: $DASHBOARD_HUB"
echo -e "  👥 Team Dashboard: $TEAM_DASHBOARD"
echo -e "  🧪 Individual Dashboard: $INDIVIDUAL_DASHBOARD"
echo -e "  🌳 Branch Visualizer: $BRANCH_VISUALIZER"
echo -e "  ⚡ Quick Actions: $QUICK_ACTIONS"
echo
echo -e "${YELLOW}💡 Tips:${NC}"
echo -e "  • Use ${BLUE}Ctrl+Shift+D${NC} to return to Dashboard Hub from any page"
echo -e "  • Use ${BLUE}Ctrl+R${NC} to refresh dashboard data"
echo -e "  • All dashboards have cross-navigation built in"
echo -e "  • Run ${BLUE}./scripts/update-dashboard-data.sh${NC} to refresh data manually"
echo
echo -e "${YELLOW}🔧 Troubleshooting:${NC}"
echo -e "  • If dashboards don't open automatically, copy the URLs above into your browser"
echo -e "  • For best experience, use Chrome, Firefox, or Safari"
echo -e "  • Some features may not work in Internet Explorer"
echo
echo -e "${GREEN}🎉 Happy Git workflow management!${NC}"