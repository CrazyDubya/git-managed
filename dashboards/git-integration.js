// Real Git Integration for Dashboard System
// This module handles actual Git command execution and live data

class GitIntegration {
    constructor() {
        this.isElectron = typeof window !== 'undefined' && window.process && window.process.type;
        this.canExecuteCommands = this.isElectron || this.checkNodeAccess();
        this.currentStatus = null;
        this.setupCommandExecution();
    }

    // Check if we can execute Node.js commands (for Electron or Node.js environment)
    checkNodeAccess() {
        try {
            return typeof require !== 'undefined' && require('child_process');
        } catch (e) {
            return false;
        }
    }

    // Setup command execution based on environment
    setupCommandExecution() {
        if (this.canExecuteCommands) {
            this.exec = require('child_process').exec;
            this.spawn = require('child_process').spawn;
            this.fs = require('fs');
            this.path = require('path');
        } else {
            // Fallback for browser environment - use fetch to communicate with a local server
            this.setupBrowserFallback();
        }
    }

    // Setup browser fallback using local server
    setupBrowserFallback() {
        // Check if local Git server is running
        this.serverUrl = 'http://localhost:3000/git';
        this.testServerConnection();
    }

    async testServerConnection() {
        try {
            const response = await fetch(`${this.serverUrl}/status`);
            this.serverAvailable = response.ok;
        } catch (e) {
            this.serverAvailable = false;
            console.warn('Git server not available. Some features will be limited.');
        }
    }

    // Execute Git command
    async executeCommand(command, options = {}) {
        const { showOutput = true, cwd = process.cwd() } = options;
        
        return new Promise((resolve, reject) => {
            if (this.canExecuteCommands) {
                // Direct execution in Node.js/Electron
                this.exec(command, { cwd }, (error, stdout, stderr) => {
                    const result = {
                        command,
                        success: !error,
                        stdout: stdout.trim(),
                        stderr: stderr.trim(),
                        error: error ? error.message : null
                    };
                    
                    if (showOutput) {
                        this.displayCommandResult(result);
                    }
                    
                    if (error) {
                        reject(result);
                    } else {
                        resolve(result);
                    }
                });
            } else if (this.serverAvailable) {
                // Use server endpoint
                this.executeViaServer(command, options).then(resolve).catch(reject);
            } else {
                // Fallback: show command for manual execution
                this.showCommandForManualExecution(command);
                resolve({
                    command,
                    success: true,
                    stdout: 'Command prepared for manual execution',
                    manual: true
                });
            }
        });
    }

    // Execute command via local server
    async executeViaServer(command, options) {
        const response = await fetch(`${this.serverUrl}/execute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command, options })
        });
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }
        
        return await response.json();
    }

    // Display command result in UI
    displayCommandResult(result) {
        const { command, success, stdout, stderr, error } = result;
        
        let message = `Command: ${command}\n\n`;
        
        if (success) {
            message += `✅ Success!\n${stdout}`;
            this.showNotification(message, 'success');
        } else {
            message += `❌ Error!\n${stderr || error}`;
            this.showNotification(message, 'error');
        }
        
        // Log to command history
        this.logToHistory(result);
    }

    // Show command for manual execution
    showCommandForManualExecution(command) {
        const modal = document.createElement('div');
        modal.className = 'command-modal';
        modal.innerHTML = `
            <div class="command-modal-content">
                <h3>🖥️ Execute Command</h3>
                <p>Copy and run this command in your terminal:</p>
                <div class="command-box">
                    <code>${command}</code>
                    <button onclick="navigator.clipboard.writeText('${command}')">📋 Copy</button>
                </div>
                <div class="modal-actions">
                    <button onclick="this.closest('.command-modal').remove()">Close</button>
                    <button onclick="this.closest('.command-modal').remove(); gitIntegration.markCommandAsExecuted('${command}')">Mark as Executed</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Mark command as executed (for manual execution tracking)
    markCommandAsExecuted(command) {
        this.logToHistory({
            command,
            success: true,
            stdout: 'Manually executed',
            manual: true
        });
        this.showNotification('Command marked as executed', 'info');
    }

    // Get current Git status
    async getGitStatus() {
        try {
            const commands = [
                'git branch --show-current',
                'git status --porcelain',
                'git branch -a',
                'git log --oneline -5',
                'git stash list'
            ];
            
            const results = await Promise.all(
                commands.map(cmd => this.executeCommand(cmd, { showOutput: false }))
            );
            
            const [currentBranch, statusFiles, branches, recentCommits, stashes] = results;
            
            this.currentStatus = {
                currentBranch: currentBranch.stdout || 'unknown',
                uncommittedFiles: statusFiles.stdout.split('\n').filter(line => line.trim()).length,
                totalBranches: branches.stdout.split('\n').filter(line => line.trim()).length,
                recentCommits: recentCommits.stdout.split('\n').filter(line => line.trim()),
                stashCount: stashes.stdout.split('\n').filter(line => line.trim()).length,
                isClean: statusFiles.stdout.trim() === '',
                timestamp: new Date().toISOString()
            };
            
            return this.currentStatus;
        } catch (error) {
            console.error('Failed to get Git status:', error);
            return null;
        }
    }

    // Get branch list with details
    async getBranches() {
        try {
            const result = await this.executeCommand(
                'git for-each-ref --format="%(refname:short)|%(committerdate:relative)|%(authorname)|%(subject)" refs/heads/',
                { showOutput: false }
            );
            
            return result.stdout.split('\n')
                .filter(line => line.trim())
                .map(line => {
                    const [name, date, author, subject] = line.split('|');
                    return {
                        name: name.trim(),
                        lastCommit: date.trim(),
                        author: author.trim(),
                        subject: subject.trim(),
                        type: this.getBranchType(name.trim()),
                        isCurrent: name.trim() === this.currentStatus?.currentBranch
                    };
                });
        } catch (error) {
            console.error('Failed to get branches:', error);
            return [];
        }
    }

    // Determine branch type
    getBranchType(branchName) {
        if (['main', 'master', 'staging', 'develop', 'draft'].includes(branchName)) {
            return 'core';
        } else if (branchName.startsWith('feature/')) {
            return 'feature';
        } else if (branchName.startsWith('experiment/')) {
            return 'experiment';
        } else if (branchName.startsWith('personal/')) {
            return 'personal';
        } else if (branchName.startsWith('hotfix/')) {
            return 'hotfix';
        } else {
            return 'other';
        }
    }

    // Create new branch
    async createBranch(branchName, startFrom = 'develop', branchType = 'feature') {
        const fullBranchName = branchType === 'personal' 
            ? `personal/${this.getCurrentUser()}/${branchName}`
            : `${branchType}/${branchName}`;
        
        const commands = [
            `git checkout ${startFrom}`,
            `git pull origin ${startFrom}`,
            `git checkout -b ${fullBranchName}`
        ];
        
        try {
            for (const command of commands) {
                await this.executeCommand(command);
            }
            
            this.showNotification(`✅ Created branch: ${fullBranchName}`, 'success');
            await this.refreshStatus();
            return { success: true, branchName: fullBranchName };
        } catch (error) {
            this.showNotification(`❌ Failed to create branch: ${error.stderr || error.error}`, 'error');
            return { success: false, error };
        }
    }

    // Switch to branch
    async switchToBranch(branchName) {
        try {
            await this.executeCommand(`git checkout ${branchName}`);
            this.showNotification(`✅ Switched to branch: ${branchName}`, 'success');
            await this.refreshStatus();
            return { success: true };
        } catch (error) {
            this.showNotification(`❌ Failed to switch branch: ${error.stderr || error.error}`, 'error');
            return { success: false, error };
        }
    }

    // Commit changes
    async commitChanges(message, type = 'feat', addAll = true) {
        const commitMessage = `${type}: ${message}`;
        
        try {
            if (addAll) {
                await this.executeCommand('git add .');
            }
            
            await this.executeCommand(`git commit -m "${commitMessage}"`);
            this.showNotification(`✅ Committed: ${commitMessage}`, 'success');
            await this.refreshStatus();
            return { success: true };
        } catch (error) {
            this.showNotification(`❌ Commit failed: ${error.stderr || error.error}`, 'error');
            return { success: false, error };
        }
    }

    // Merge branch
    async mergeBranch(sourceBranch, targetBranch = 'develop', strategy = '--no-ff') {
        const commands = [
            `git checkout ${targetBranch}`,
            `git pull origin ${targetBranch}`,
            `git merge ${strategy} ${sourceBranch}`,
            `git push origin ${targetBranch}`
        ];
        
        try {
            for (const command of commands) {
                await this.executeCommand(command);
            }
            
            this.showNotification(`✅ Merged ${sourceBranch} into ${targetBranch}`, 'success');
            await this.refreshStatus();
            return { success: true };
        } catch (error) {
            this.showNotification(`❌ Merge failed: ${error.stderr || error.error}`, 'error');
            return { success: false, error };
        }
    }

    // Delete branch
    async deleteBranch(branchName, force = false) {
        const flag = force ? '-D' : '-d';
        
        try {
            await this.executeCommand(`git branch ${flag} ${branchName}`);
            this.showNotification(`✅ Deleted branch: ${branchName}`, 'success');
            await this.refreshStatus();
            return { success: true };
        } catch (error) {
            this.showNotification(`❌ Failed to delete branch: ${error.stderr || error.error}`, 'error');
            return { success: false, error };
        }
    }

    // Stash changes
    async stashChanges(message = 'Work in progress') {
        try {
            await this.executeCommand(`git stash push -m "${message}"`);
            this.showNotification(`✅ Stashed changes: ${message}`, 'success');
            await this.refreshStatus();
            return { success: true };
        } catch (error) {
            this.showNotification(`❌ Stash failed: ${error.stderr || error.error}`, 'error');
            return { success: false, error };
        }
    }

    // Pull latest changes
    async pullLatest() {
        try {
            const currentBranch = this.currentStatus?.currentBranch || 'main';
            await this.executeCommand(`git pull origin ${currentBranch}`);
            this.showNotification(`✅ Pulled latest changes for ${currentBranch}`, 'success');
            await this.refreshStatus();
            return { success: true };
        } catch (error) {
            this.showNotification(`❌ Pull failed: ${error.stderr || error.error}`, 'error');
            return { success: false, error };
        }
    }

    // Push changes
    async pushChanges() {
        try {
            const currentBranch = this.currentStatus?.currentBranch || 'main';
            await this.executeCommand(`git push origin ${currentBranch}`);
            this.showNotification(`✅ Pushed changes to ${currentBranch}`, 'success');
            await this.refreshStatus();
            return { success: true };
        } catch (error) {
            this.showNotification(`❌ Push failed: ${error.stderr || error.error}`, 'error');
            return { success: false, error };
        }
    }

    // Refresh status and update UI
    async refreshStatus() {
        await this.getGitStatus();
        this.updateStatusDisplay();
        this.triggerStatusUpdate();
    }

    // Update status display in UI
    updateStatusDisplay() {
        if (!this.currentStatus) return;
        
        const elements = {
            'current-branch': this.currentStatus.currentBranch,
            'total-branches': this.currentStatus.totalBranches,
            'uncommitted-files': this.currentStatus.uncommittedFiles,
            'last-update': 'Just now'
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    // Trigger status update event for other components
    triggerStatusUpdate() {
        const event = new CustomEvent('gitStatusUpdate', {
            detail: this.currentStatus
        });
        document.dispatchEvent(event);
    }

    // Get current user
    getCurrentUser() {
        // Try to get from git config, fallback to system user
        return 'user'; // Simplified for now
    }

    // Log command to history
    logToHistory(result) {
        const history = JSON.parse(localStorage.getItem('git-command-history') || '[]');
        history.unshift({
            ...result,
            timestamp: new Date().toISOString(),
            branch: this.currentStatus?.currentBranch || 'unknown'
        });
        
        // Keep only last 50 commands
        if (history.length > 50) {
            history.splice(50);
        }
        
        localStorage.setItem('git-command-history', JSON.stringify(history));
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Use existing notification system or create one
        if (typeof showGlobalNotification === 'function') {
            showGlobalNotification(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }

    // Initialize Git integration
    async initialize() {
        console.log('Initializing Git integration...');
        await this.getGitStatus();
        this.updateStatusDisplay();
        
        // Set up auto-refresh
        setInterval(() => {
            this.refreshStatus();
        }, 30000); // Refresh every 30 seconds
        
        console.log('Git integration initialized');
        return this.currentStatus;
    }
}

// Create global instance
const gitIntegration = new GitIntegration();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        gitIntegration.initialize();
    });
} else {
    gitIntegration.initialize();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GitIntegration;
}