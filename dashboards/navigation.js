// Global Navigation System for Git Workflow Dashboards
// Include this script in all dashboard pages for consistent navigation

(function() {
    'use strict';

    // Navigation configuration
    const DASHBOARDS = {
        'index.html': { name: 'Dashboard Hub', icon: '🏠' },
        'team-dashboard.html': { name: 'Team Dashboard', icon: '👥' },
        'individual-dashboard.html': { name: 'Individual Dashboard', icon: '🧪' },
        'branch-visualizer.html': { name: 'Branch Visualizer', icon: '🌳' },
        'quick-actions-gui.html': { name: 'Quick Actions', icon: '⚡' }
    };

    // Create navigation bar
    function createNavigationBar() {
        const nav = document.createElement('nav');
        nav.className = 'dashboard-nav';
        nav.innerHTML = `
            <div class="nav-container">
                <div class="nav-brand">
                    <a href="index.html">🚀 Git Workflow</a>
                </div>
                <div class="nav-links">
                    ${Object.entries(DASHBOARDS).map(([url, info]) => `
                        <a href="${url}" class="nav-link" data-page="${url}">
                            <span class="nav-icon">${info.icon}</span>
                            <span class="nav-text">${info.name}</span>
                        </a>
                    `).join('')}
                </div>
                <div class="nav-actions">
                    <button class="nav-btn" onclick="refreshCurrentDashboard()" title="Refresh Data">
                        🔄
                    </button>
                    <button class="nav-btn" onclick="showQuickHelp()" title="Quick Help">
                        ❓
                    </button>
                    <button class="nav-btn" onclick="toggleTheme()" title="Toggle Theme">
                        🌙
                    </button>
                </div>
            </div>
        `;

        // Insert at the beginning of body
        document.body.insertBefore(nav, document.body.firstChild);

        // Highlight current page
        highlightCurrentPage();

        // Add keyboard shortcuts
        setupGlobalKeyboardShortcuts();
    }

    // Highlight current page in navigation
    function highlightCurrentPage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            if (link.getAttribute('data-page') === currentPage) {
                link.classList.add('active');
            }
        });
    }

    // Global keyboard shortcuts
    function setupGlobalKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Ctrl+Shift+D - Return to dashboard hub
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                window.location.href = 'index.html';
            }
            
            // Ctrl+Shift+T - Team dashboard
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                window.location.href = 'team-dashboard.html';
            }
            
            // Ctrl+Shift+I - Individual dashboard
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                window.location.href = 'individual-dashboard.html';
            }
            
            // Ctrl+Shift+B - Branch visualizer
            if (e.ctrlKey && e.shiftKey && e.key === 'B') {
                e.preventDefault();
                window.location.href = 'branch-visualizer.html';
            }
            
            // Ctrl+Shift+A - Quick actions
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                window.location.href = 'quick-actions-gui.html';
            }
            
            // Ctrl+R - Refresh current dashboard
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                refreshCurrentDashboard();
            }
        });
    }

    // Global functions
    window.refreshCurrentDashboard = function() {
        showGlobalNotification('Refreshing dashboard data...', 'info');
        
        // Call page-specific refresh function if it exists
        if (typeof window.refreshDashboard === 'function') {
            window.refreshDashboard();
        } else {
            // Generic refresh
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    };

    window.showQuickHelp = function() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const helpContent = getHelpContent(currentPage);
        
        showGlobalModal('Quick Help', helpContent);
    };

    window.toggleTheme = function() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('dashboard-theme', isDark ? 'dark' : 'light');
        
        showGlobalNotification(`Switched to ${isDark ? 'dark' : 'light'} theme`, 'info');
    };

    // Get help content for current page
    function getHelpContent(page) {
        const helpMap = {
            'index.html': `
                <h4>🏠 Dashboard Hub</h4>
                <ul>
                    <li>Central navigation for all dashboards</li>
                    <li>Quick status overview</li>
                    <li>Global actions and settings</li>
                </ul>
                <h4>⌨️ Keyboard Shortcuts</h4>
                <ul>
                    <li><kbd>Ctrl+Shift+T</kbd> - Team Dashboard</li>
                    <li><kbd>Ctrl+Shift+I</kbd> - Individual Dashboard</li>
                    <li><kbd>Ctrl+Shift+B</kbd> - Branch Visualizer</li>
                    <li><kbd>Ctrl+Shift+A</kbd> - Quick Actions</li>
                    <li><kbd>Ctrl+R</kbd> - Refresh Data</li>
                </ul>
            `,
            'team-dashboard.html': `
                <h4>👥 Team Dashboard</h4>
                <ul>
                    <li>Monitor overall project health</li>
                    <li>Track team activity and collaboration</li>
                    <li>View branch status and conflicts</li>
                    <li>Manage deployment pipeline</li>
                </ul>
            `,
            'individual-dashboard.html': `
                <h4>🧪 Individual Dashboard</h4>
                <ul>
                    <li>Track personal experiments</li>
                    <li>Manage cleanup pipeline</li>
                    <li>Monitor delivery readiness</li>
                    <li>Organize personal branches</li>
                </ul>
            `,
            'branch-visualizer.html': `
                <h4>🌳 Branch Visualizer</h4>
                <ul>
                    <li>Click branches for detailed information</li>
                    <li>Use filter buttons to focus on specific types</li>
                    <li>Hover for quick branch stats</li>
                    <li>Interactive merge and delete actions</li>
                </ul>
            `,
            'quick-actions-gui.html': `
                <h4>⚡ Quick Actions GUI</h4>
                <ul>
                    <li>Form-based Git operations</li>
                    <li>Live command preview</li>
                    <li>Command history tracking</li>
                    <li>Emergency recovery tools</li>
                </ul>
                <h4>⌨️ Shortcuts</h4>
                <ul>
                    <li><kbd>Ctrl+H</kbd> - Command History</li>
                    <li><kbd>Ctrl+?</kbd> - Detailed Help</li>
                </ul>
            `
        };

        return helpMap[page] || '<p>No specific help available for this page.</p>';
    }

    // Global notification system
    window.showGlobalNotification = function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `global-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-message">${message.replace(/\n/g, '<br>')}</div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    };

    // Global modal system
    window.showGlobalModal = function(title, content) {
        // Remove existing modal if any
        const existingModal = document.getElementById('global-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'global-modal';
        modal.className = 'global-modal';
        modal.innerHTML = `
            <div class="global-modal-content">
                <div class="global-modal-header">
                    <h3>${title}</h3>
                    <span class="global-modal-close" onclick="closeGlobalModal()">&times;</span>
                </div>
                <div class="global-modal-body">
                    ${content}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';

        // Close on outside click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeGlobalModal();
            }
        });
    };

    window.closeGlobalModal = function() {
        const modal = document.getElementById('global-modal');
        if (modal) {
            modal.remove();
        }
    };

    // Load saved theme
    function loadSavedTheme() {
        const savedTheme = localStorage.getItem('dashboard-theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }

    // Initialize navigation when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            createNavigationBar();
            loadSavedTheme();
        });
    } else {
        createNavigationBar();
        loadSavedTheme();
    }

    // Add global styles
    const globalStyles = document.createElement('style');
    globalStyles.textContent = `
        /* Global Navigation Styles */
        .dashboard-nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .nav-container {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 20px;
        }

        .nav-brand a {
            font-size: 1.2em;
            font-weight: bold;
            color: #2c3e50;
            text-decoration: none;
        }

        .nav-links {
            display: flex;
            gap: 5px;
        }

        .nav-link {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            border-radius: 8px;
            color: #7f8c8d;
            text-decoration: none;
            transition: all 0.3s ease;
            font-size: 0.9em;
        }

        .nav-link:hover,
        .nav-link.active {
            background: #3498db;
            color: white;
        }

        .nav-icon {
            font-size: 1.1em;
        }

        .nav-actions {
            display: flex;
            gap: 5px;
        }

        .nav-btn {
            width: 36px;
            height: 36px;
            border: none;
            border-radius: 8px;
            background: #ecf0f1;
            cursor: pointer;
            font-size: 1.1em;
            transition: all 0.3s ease;
        }

        .nav-btn:hover {
            background: #3498db;
            color: white;
        }

        /* Global Modal Styles */
        .global-modal {
            display: none;
            position: fixed;
            z-index: 2000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
        }

        .global-modal-content {
            background: white;
            margin: 10% auto;
            padding: 0;
            border-radius: 15px;
            width: 90%;
            max-width: 600px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .global-modal-header {
            padding: 20px 30px;
            border-bottom: 1px solid #ecf0f1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border-radius: 15px 15px 0 0;
        }

        .global-modal-header h3 {
            margin: 0;
            font-size: 1.5em;
        }

        .global-modal-close {
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            color: white;
            transition: opacity 0.3s ease;
        }

        .global-modal-close:hover {
            opacity: 0.7;
        }

        .global-modal-body {
            padding: 30px;
        }

        .global-modal-body h4 {
            color: #2c3e50;
            margin-bottom: 10px;
            font-size: 1.2em;
        }

        .global-modal-body ul {
            list-style: none;
            padding-left: 0;
            margin-bottom: 20px;
        }

        .global-modal-body li {
            padding: 5px 0;
            border-bottom: 1px solid #ecf0f1;
        }

        .global-modal-body li:last-child {
            border-bottom: none;
        }

        .global-modal-body kbd {
            background: #ecf0f1;
            border: 1px solid #bdc3c7;
            border-radius: 3px;
            padding: 2px 6px;
            font-family: monospace;
            font-size: 0.9em;
        }

        /* Global Notification Styles */
        .global-notification {
            position: fixed;
            top: 70px;
            right: 20px;
            z-index: 2000;
            max-width: 400px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            animation: slideIn 0.3s ease;
        }

        .notification-success {
            background: linear-gradient(135deg, #27ae60, #229954);
            color: white;
        }

        .notification-error {
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
        }

        .notification-warning {
            background: linear-gradient(135deg, #f39c12, #e67e22);
            color: white;
        }

        .notification-info {
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
        }

        .notification-content {
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .notification-message {
            flex: 1;
            margin-right: 10px;
        }

        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
        }

        /* Dark theme styles */
        .dark-theme .dashboard-nav {
            background: rgba(44, 62, 80, 0.95);
        }

        .dark-theme .nav-brand a {
            color: #ecf0f1;
        }

        .dark-theme .nav-link {
            color: #bdc3c7;
        }

        .dark-theme .nav-btn {
            background: #34495e;
            color: #ecf0f1;
        }

        .dark-theme .global-modal-content {
            background: #2c3e50;
            color: #ecf0f1;
        }

        .dark-theme .global-modal-body h4 {
            color: #ecf0f1;
        }

        /* Adjust body padding for navigation */
        body {
            padding-top: 60px !important;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
            .nav-container {
                padding: 8px 15px;
            }

            .nav-links {
                display: none;
            }

            .nav-text {
                display: none;
            }

            .nav-link {
                padding: 8px;
            }

            .global-modal-content {
                width: 95%;
                margin: 5% auto;
            }

            .global-notification {
                right: 10px;
                left: 10px;
                max-width: none;
            }
        }

        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;

    document.head.appendChild(globalStyles);

})();