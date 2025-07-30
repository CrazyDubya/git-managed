# Branch Protection Rules Setup

## 🛡️ Recommended Branch Protection Settings

### **Main Branch Protection**
```
Branch: main
✅ Restrict pushes that create files larger than 100MB
✅ Require a pull request before merging
  ✅ Require approvals: 2
  ✅ Dismiss stale reviews when new commits are pushed
  ✅ Require review from code owners
✅ Require status checks to pass before merging
  ✅ Require branches to be up to date before merging
  ✅ Required status checks:
    - branch-protection-check
    - update-dashboard-data
✅ Require conversation resolution before merging
✅ Require signed commits
✅ Require linear history
✅ Include administrators
```

### **Staging Branch Protection**
```
Branch: staging
✅ Restrict pushes that create files larger than 100MB
✅ Require a pull request before merging
  ✅ Require approvals: 1
  ✅ Dismiss stale reviews when new commits are pushed
✅ Require status checks to pass before merging
  ✅ Required status checks:
    - branch-protection-check
✅ Allow force pushes (for environment resets)
✅ Allow deletions (for environment resets)
```

### **Develop Branch Protection**
```
Branch: develop
✅ Restrict pushes that create files larger than 100MB
✅ Require a pull request before merging
  ✅ Require approvals: 1
✅ Require status checks to pass before merging
  ✅ Required status checks:
    - branch-protection-check
✅ Require conversation resolution before merging
```

## 🔧 How to Apply These Rules

### **Via GitHub Web Interface:**

1. **Go to Repository Settings**
   - Navigate to your repository
   - Click "Settings" tab
   - Click "Branches" in left sidebar

2. **Add Branch Protection Rule**
   - Click "Add rule"
   - Enter branch name pattern (e.g., `main`)
   - Configure settings as shown above
   - Click "Create"

3. **Repeat for Each Branch**
   - Create separate rules for `staging` and `develop`

### **Via GitHub CLI:**

```bash
# Install GitHub CLI if not already installed
# https://cli.github.com/

# Main branch protection
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["branch-protection-check","update-dashboard-data"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":2,"dismiss_stale_reviews":true,"require_code_owner_reviews":true}' \
  --field restrictions=null

# Staging branch protection
gh api repos/:owner/:repo/branches/staging/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["branch-protection-check"]}' \
  --field enforce_admins=false \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field restrictions=null \
  --field allow_force_pushes=true \
  --field allow_deletions=true

# Develop branch protection
gh api repos/:owner/:repo/branches/develop/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["branch-protection-check"]}' \
  --field enforce_admins=false \
  --field required_pull_request_reviews='{"required_approving_review_count":1}' \
  --field restrictions=null
```

## 🎯 **What These Rules Achieve**

### **Security & Quality**
- **No direct commits** to protected branches
- **Required code reviews** before merging
- **Automated checks** must pass
- **Large file prevention**
- **Conversation resolution** required

### **Team Coordination**
- **Enforced workflow** through pull requests
- **Status check requirements** ensure CI passes
- **Stale review dismissal** keeps reviews current
- **Linear history** on main branch

### **Flexibility**
- **Staging resets** allowed for environment management
- **Different approval requirements** per branch
- **Emergency procedures** still possible

## 🚨 **Emergency Override Procedures**

### **For Repository Administrators:**

1. **Temporary Rule Disable**
   - Go to Settings > Branches
   - Edit protection rule
   - Uncheck "Include administrators"
   - Make emergency change
   - Re-enable protection

2. **Emergency Hotfix Process**
   ```bash
   # Create emergency hotfix
   git checkout main
   git checkout -b hotfix/emergency-fix
   
   # Make fix and push
   git commit -m "hotfix: emergency security fix"
   git push origin hotfix/emergency-fix
   
   # Create emergency PR
   gh pr create --title "EMERGENCY: Security Fix" --body "Emergency hotfix for critical issue"
   
   # Request immediate review
   gh pr review --approve  # If you have admin override
   gh pr merge --squash
   ```

## 📊 **Monitoring & Compliance**

### **GitHub Insights**
- Monitor pull request metrics
- Track review response times
- Analyze branch protection violations

### **Automated Reports**
- Weekly branch health reports
- Protection rule compliance checks
- Security scan summaries

## 🔄 **Regular Maintenance**

### **Monthly Review**
- [ ] Review protection rule effectiveness
- [ ] Update required status checks
- [ ] Adjust approval requirements based on team size
- [ ] Review emergency override usage

### **Quarterly Assessment**
- [ ] Evaluate workflow efficiency
- [ ] Update rules based on team feedback
- [ ] Review security incident reports
- [ ] Plan rule improvements

---

**Note**: These rules balance security with development velocity. Adjust based on your team's specific needs and risk tolerance.