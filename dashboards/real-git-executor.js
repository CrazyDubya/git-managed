// Real Git Command Executor with Tutorial System
// Enhances existing git-integration.js with actual command execution

class RealGitExecutor {
    constructor() {
        this.commandHistory = [];
        this.tutorialActive = false;
        this.currentTutorialStep = 0;
        this.setupRealExecution();
    }

    setupRealExecution() {
        // Check if we're in a Node.js/Electron environment
        this.canExecuteDirectly = typeof require !== 'undefined';
        
        if (this.canExecuteDirectly) {
            this.exec = require('child_process').exec;
            this.spawn = require('child_process').spawn;
        } else {
            // Browser environment - use Web APIs or local server
            this.setupWebExecution();
        }
    }

    setupWebExecution() {
        // For browser environment, we'll use a simple approach:
        // 1. Show commands for copy-paste
        // 2. Use localStorage for state management
        // 3. Simulate some operations
        console.log('Running in browser mode - commands will be shown for manual execution');
    }

    // Execute Git command with real feedback
    async executeGitCommand(command, options = {}) {
        const { 
            showCommand = true, 
            autoExecute = false, 
            tutorial = false,
            description = ''
        } = options;

        // Log command
        this.logCommand(command, description);

        if (showCommand && !autoExecute) {
            return this.showCommandDialog(command, description, tutorial);
        }

        if (this.canExecuteDirectly && autoExecute) {
            return this.executeDirectly(command);
        } else {
            return this.simulateExecution(command);
        }
    }

    // Show command dialog with option to execute
    showCommandDialog(command, description, tutorial = false) {
        return new Promise((resolve) => {
            const modal = this.createCommandModal(command, description, tutorial);
            document.body.appendChild(modal);

            // Handle execution
            modal.querySelector('.execute-btn').onclick = async () => {
                const result = await this.executeDirectly(command);
                this.updateModalWithResult(modal, result);
                resolve(result);
            };

            // Handle copy
            modal.querySelector('.copy-btn').onclick = () => {
                navigator.clipboard.writeText(command);
                this.showNotification('Command copied to clipboard!', 'success');
            };

            // Handle close
            modal.querySelector('.close-btn').onclick = () => {
                modal.remove();
                resolve({ cancelled: true });
            };
        });
    }

    createCommandModal(command, description, tutorial) {
        const modal = document.createElement('div');
        modal.className = 'git-command-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🚀 Execute Git Command</h3>
                    <button class="close-btn">×</button>
                </div>
                <div class="modal-body">
                    ${description ? `<p class="command-description">${description}</p>` : ''}
                    <div class="command-preview">
                        <code>${command}</code>
                    </div>
                    <div class="command-actions">
                        <button class="execute-btn btn-primary">▶️ Execute</button>
                        <button class="copy-btn btn-secondary">📋 Copy</button>
                        <button class="close-btn btn-secondary">❌ Cancel</button>
                    </div>
                    <div class="command-result" style="display: none;">
                        <h4>Result:</h4>
                        <pre class="result-output"></pre>
                    </div>
                    ${tutorial ? '<div class="tutorial-tip">💡 This is part of the guided tutorial</div>' : ''}
                </div>
            </div>
        `;
        return modal;
    }

    // Execute command directly (Node.js/Electron)
    executeDirectly(command) {
        return new Promise((resolve) => {
            if (!this.canExecuteDirectly) {
                resolve(this.simulateExecution(command));
                return;
            }

            this.exec(command, { cwd: process.cwd() }, (error, stdout, stderr) => {
                const result = {
                    command,
                    success: !error,
                    stdout: stdout.trim(),
                    stderr: stderr.trim(),
                    error: error ? error.message : null,
                    timestamp: new Date().toISOString()
                };

                this.logResult(result);
                resolve(result);
            });
        });
    }

    // Simulate execution for browser environment
    simulateExecution(command) {
        // Simulate common Git commands
        const simulations = {
            'git status': {
                success: true,
                stdout: 'On branch develop\nYour branch is up to date with \'origin/develop\'.\n\nnothing to commit, working tree clean'
            },
            'git branch': {
                success: true,
                stdout: '  main\n* develop\n  feature/user-auth'
            },
            'git log --oneline -5': {
                success: true,
                stdout: 'abc123f feat: add user authentication\ndef456a fix: resolve login timeout\nghi789b docs: update README'
            }
        };

        const result = simulations[command] || {
            success: true,
            stdout: `Simulated execution of: ${command}`,
            stderr: '',
            simulated: true
        };

        result.command = command;
        result.timestamp = new Date().toISOString();
        
        this.logResult(result);
        return Promise.resolve(result);
    }

    // Real Git status reader
    async getRealGitStatus() {
        try {
            const statusResult = await this.executeGitCommand('git status --porcelain', { autoExecute: true });
            const branchResult = await this.executeGitCommand('git branch --show-current', { autoExecute: true });
            const remoteResult = await this.executeGitCommand('git rev-list --count HEAD ^origin/$(git branch --show-current)', { autoExecute: true });

            return {
                currentBranch: branchResult.stdout || 'unknown',
                uncommittedFiles: statusResult.stdout ? statusResult.stdout.split('\n').length : 0,
                isClean: !statusResult.stdout,
                commitsAhead: parseInt(remoteResult.stdout) || 0,
                lastUpdated: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error getting Git status:', error);
            return this.getFallbackStatus();
        }
    }

    getFallbackStatus() {
        return {
            currentBranch: 'develop',
            uncommittedFiles: 0,
            isClean: true,
            commitsAhead: 0,
            lastUpdated: new Date().toISOString(),
            fallback: true
        };
    }

    // Real branch operations
    async createBranch(branchName, startFrom = 'develop') {
        const commands = [
            `git checkout ${startFrom}`,
            `git pull origin ${startFrom}`,
            `git checkout -b ${branchName}`
        ];

        const results = [];
        for (const command of commands) {
            const result = await this.executeGitCommand(command, {
                description: `Creating branch ${branchName} from ${startFrom}`,
                showCommand: true
            });
            results.push(result);
            
            if (!result.success && !result.cancelled) {
                break;
            }
        }

        return results;
    }

    async commitChanges(type, message, files = '.') {
        const commands = [
            `git add ${files}`,
            `git commit -m "${type}: ${message}"`
        ];

        const results = [];
        for (const command of commands) {
            const result = await this.executeGitCommand(command, {
                description: `Committing changes: ${type}: ${message}`,
                showCommand: true
            });
            results.push(result);
            
            if (!result.success && !result.cancelled) {
                break;
            }
        }

        return results;
    }

    async mergeBranch(sourceBranch, targetBranch = 'develop') {
        const commands = [
            `git checkout ${targetBranch}`,
            `git pull origin ${targetBranch}`,
            `git merge --no-ff ${sourceBranch}`,
            `git push origin ${targetBranch}`
        ];

        const results = [];
        for (const command of commands) {
            const result = await this.executeGitCommand(command, {
                description: `Merging ${sourceBranch} to ${targetBranch}`,
                showCommand: true
            });
            results.push(result);
            
            if (!result.success && !result.cancelled) {
                break;
            }
        }

        return results;
    }

    // Tutorial System
    startTutorial(tutorialName) {
        this.tutorialActive = true;
        this.currentTutorialStep = 0;
        
        const tutorials = {
            'basic-workflow': this.getBasicWorkflowTutorial(),
            'individual-chaos': this.getIndividualChaosTutorial(),
            'team-coordination': this.getTeamCoordinationTutorial()
        };

        this.currentTutorial = tutorials[tutorialName] || tutorials['basic-workflow'];
        this.showTutorialStep();
    }

    getBasicWorkflowTutorial() {
        return [
            {
                title: "Welcome to Git Workflow Tutorial!",
                content: "Let's learn the basic Git workflow with real commands.",
                action: null,
                highlight: '.dashboard-nav'
            },
            {
                title: "Check Current Status",
                content: "First, let's see what's happening in your repository.",
                action: () => this.executeGitCommand('git status', { tutorial: true }),
                highlight: '.status-bar'
            },
            {
                title: "Create a Feature Branch",
                content: "Now let's create a new feature branch for our work.",
                action: () => this.createBranch('tutorial/my-first-feature'),
                highlight: '.action-card:first-child'
            },
            {
                title: "Make Some Changes",
                content: "In a real workflow, you'd edit files here. For the tutorial, we'll simulate this.",
                action: null,
                highlight: null
            },
            {
                title: "Commit Your Changes",
                content: "Let's commit our changes with a good commit message.",
                action: () => this.commitChanges('feat', 'add tutorial feature'),
                highlight: '.action-card:nth-child(2)'
            },
            {
                title: "Tutorial Complete!",
                content: "Great! You've completed the basic workflow. Try the other tutorials next.",
                action: null,
                highlight: null
            }
        ];
    }

    getIndividualChaosTutorial() {
        return [
            {
                title: "Individual Developer Workflow",
                content: "Learn how to manage personal experiments and chaos!",
                action: null,
                highlight: null
            },
            {
                title: "Create Personal Branch",
                content: "Personal branches are your playground - experiment freely!",
                action: () => this.createBranch('personal/tutorial/crazy-experiment'),
                highlight: '.individual-tools'
            },
            {
                title: "Make Messy Commits",
                content: "In personal branches, commit often with any message.",
                action: () => this.commitChanges('WIP', 'trying this approach'),
                highlight: null
            },
            {
                title: "Backup Your Work",
                content: "Always backup before cleanup!",
                action: () => this.executeGitCommand('git checkout -b backup/personal-tutorial-$(date +%Y%m%d)', { tutorial: true }),
                highlight: null
            },
            {
                title: "Clean Up for Delivery",
                content: "Now create a clean feature branch and cherry-pick good commits.",
                action: () => this.createBranch('feature/tutorial-cleaned-up'),
                highlight: null
            }
        ];
    }

    getTeamCoordinationTutorial() {
        return [
            {
                title: "Team Coordination",
                content: "Learn how teams work together effectively!",
                action: null,
                highlight: '.team-dashboard'
            },
            {
                title: "Check Team Status",
                content: "Always check what the team is doing before starting work.",
                action: () => this.executeGitCommand('git fetch --all', { tutorial: true }),
                highlight: null
            },
            {
                title: "Coordinate Branch Creation",
                content: "Create branches with clear, descriptive names.",
                action: () => this.createBranch('feature/team-tutorial-coordination'),
                highlight: null
            },
            {
                title: "Safe Merge Process",
                content: "Always merge safely with proper review process.",
                action: () => this.mergeBranch('feature/team-tutorial-coordination'),
                highlight: null
            }
        ];
    }

    showTutorialStep() {
        if (!this.tutorialActive || this.currentTutorialStep >= this.currentTutorial.length) {
            this.endTutorial();
            return;
        }

        const step = this.currentTutorial[this.currentTutorialStep];
        this.showTutorialPopup(step);
    }

    showTutorialPopup(step) {
        // Remove existing tutorial popup
        const existing = document.querySelector('.tutorial-popup');
        if (existing) existing.remove();

        const popup = document.createElement('div');
        popup.className = 'tutorial-popup';
        popup.innerHTML = `
            <div class="tutorial-content">
                <div class="tutorial-header">
                    <h4>📚 ${step.title}</h4>
                    <span class="tutorial-progress">${this.currentTutorialStep + 1}/${this.currentTutorial.length}</span>
                </div>
                <div class="tutorial-body">
                    <p>${step.content}</p>
                </div>
                <div class="tutorial-actions">
                    ${step.action ? '<button class="tutorial-action-btn btn-primary">Try It!</button>' : ''}
                    <button class="tutorial-next-btn btn-secondary">Next</button>
                    <button class="tutorial-skip-btn btn-secondary">Skip Tutorial</button>
                </div>
            </div>
        `;

        document.body.appendChild(popup);

        // Highlight element if specified
        if (step.highlight) {
            this.highlightElement(step.highlight);
        }

        // Handle actions
        if (step.action) {
            popup.querySelector('.tutorial-action-btn').onclick = async () => {
                await step.action();
                this.nextTutorialStep();
            };
        }

        popup.querySelector('.tutorial-next-btn').onclick = () => {
            this.nextTutorialStep();
        };

        popup.querySelector('.tutorial-skip-btn').onclick = () => {
            this.endTutorial();
        };
    }

    highlightElement(selector) {
        // Remove existing highlights
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });

        // Add highlight to target element
        const element = document.querySelector(selector);
        if (element) {
            element.classList.add('tutorial-highlight');
        }
    }

    nextTutorialStep() {
        this.currentTutorialStep++;
        this.showTutorialStep();
    }

    endTutorial() {
        this.tutorialActive = false;
        this.currentTutorialStep = 0;
        
        // Remove tutorial popup and highlights
        const popup = document.querySelector('.tutorial-popup');
        if (popup) popup.remove();
        
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });

        this.showNotification('Tutorial completed! 🎉', 'success');
    }

    // Utility functions
    logCommand(command, description) {
        this.commandHistory.push({
            command,
            description,
            timestamp: new Date().toISOString(),
            type: 'command'
        });
    }

    logResult(result) {
        this.commandHistory.push({
            ...result,
            type: 'result'
        });
        
        // Keep only last 100 entries
        if (this.commandHistory.length > 100) {
            this.commandHistory = this.commandHistory.slice(-100);
        }
    }

    updateModalWithResult(modal, result) {
        const resultDiv = modal.querySelector('.command-result');
        const outputPre = modal.querySelector('.result-output');
        
        resultDiv.style.display = 'block';
        outputPre.textContent = result.success ? result.stdout : result.stderr || result.error;
        outputPre.className = `result-output ${result.success ? 'success' : 'error'}`;
    }

    showNotification(message, type) {
        // Use existing notification system
        if (typeof showGlobalNotification === 'function') {
            showGlobalNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Initialize real Git executor
const realGit = new RealGitExecutor();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RealGitExecutor;
}