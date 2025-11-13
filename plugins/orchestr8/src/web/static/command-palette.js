// Command Palette - Modern ⌘K Search Interface
// Inspired by Linear, VSCode, Raycast

class CommandPalette {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.isOpen = false;
        this.selectedIndex = 0;
        this.actions = [];
        this.filteredActions = [];
        this.recentActions = this.loadRecent();

        this.init();
    }

    init() {
        this.createDOM();
        this.setupKeyboardShortcuts();
        this.buildActions();
    }

    createDOM() {
        const html = `
            <div id="commandPalette" class="command-palette">
                <div class="command-palette-overlay"></div>
                <div class="command-palette-content">
                    <div class="command-palette-search">
                        <span class="command-palette-icon">⌘</span>
                        <input
                            type="text"
                            id="commandPaletteInput"
                            placeholder="Type a command or search..."
                            autocomplete="off"
                            spellcheck="false"
                        />
                        <span class="command-palette-hint">ESC to close</span>
                    </div>
                    <div class="command-palette-results" id="commandPaletteResults">
                        <div class="command-palette-empty">Type to search...</div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);

        this.palette = document.getElementById('commandPalette');
        this.input = document.getElementById('commandPaletteInput');
        this.results = document.getElementById('commandPaletteResults');
        this.overlay = this.palette.querySelector('.command-palette-overlay');

        // Event listeners
        this.input.addEventListener('input', (e) => this.handleInput(e.target.value));
        this.overlay.addEventListener('click', () => this.close());

        // Keyboard navigation in results
        this.input.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // ⌘K or Ctrl+K to open
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.toggle();
            }

            // ESC to close
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    buildActions() {
        this.actions = [
            // Navigation
            {
                id: 'nav-overview',
                label: 'Go to Overview',
                icon: '📊',
                category: 'Navigation',
                keywords: ['home', 'dashboard', 'stats'],
                action: () => this.dashboard.switchView('overview')
            },
            {
                id: 'nav-testing',
                label: 'Go to Testing',
                icon: '🧪',
                category: 'Navigation',
                keywords: ['test', 'try', 'execute', 'run'],
                action: () => this.dashboard.switchView('testing')
            },
            {
                id: 'nav-resources',
                label: 'Go to Resources',
                icon: '🗂️',
                category: 'Navigation',
                keywords: ['browse', 'explore', 'agents', 'skills'],
                action: () => this.dashboard.switchView('explorer')
            },
            {
                id: 'nav-activity',
                label: 'Go to Activity',
                icon: '📡',
                category: 'Navigation',
                keywords: ['logs', 'history', 'events'],
                action: () => this.dashboard.switchView('activity')
            },
            {
                id: 'nav-providers',
                label: 'Go to Providers',
                icon: '🔌',
                category: 'Navigation',
                keywords: ['sources', 'integrations'],
                action: () => this.dashboard.switchView('providers')
            },

            // Actions
            {
                id: 'action-refresh',
                label: 'Refresh Data',
                icon: '↻',
                category: 'Actions',
                keywords: ['reload', 'update', 'sync'],
                action: () => this.dashboard.refreshData()
            },
            {
                id: 'action-clear-logs',
                label: 'Clear Activity Logs',
                icon: '🗑️',
                category: 'Actions',
                keywords: ['delete', 'clean', 'reset'],
                action: () => this.dashboard.clearActivityLog()
            },
            {
                id: 'action-export',
                label: 'Export Dashboard Data',
                icon: '💾',
                category: 'Actions',
                keywords: ['download', 'save', 'backup'],
                action: () => this.exportDashboard()
            },
            {
                id: 'action-search-agents',
                label: 'Search Agents',
                icon: '🤖',
                category: 'Search',
                keywords: ['find', 'agent', 'expert'],
                action: () => this.quickSearch('agents')
            },
            {
                id: 'action-search-skills',
                label: 'Search Skills',
                icon: '⚡',
                category: 'Search',
                keywords: ['find', 'skill', 'technique'],
                action: () => this.quickSearch('skills')
            },
            {
                id: 'action-search-workflows',
                label: 'Search Workflows',
                icon: '🔄',
                category: 'Search',
                keywords: ['find', 'workflow', 'process'],
                action: () => this.quickSearch('workflows')
            },

            // Quick Tests
            {
                id: 'test-list-resources',
                label: 'Test: List All Resources',
                icon: '▶️',
                category: 'Quick Tests',
                keywords: ['run', 'execute', 'try'],
                action: () => this.runQuickTest('list-resources')
            },
            {
                id: 'test-match-query',
                label: 'Test: Match Query',
                icon: '🔍',
                category: 'Quick Tests',
                keywords: ['search', 'find', 'query'],
                action: () => this.runQuickTest('match')
            },
        ];

        // Add recent actions
        this.recentActions.forEach(actionId => {
            const action = this.actions.find(a => a.id === actionId);
            if (action) {
                action.recent = true;
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        this.palette.classList.add('active');
        this.input.focus();
        this.input.value = '';
        this.showRecent();

        // Animate in
        requestAnimationFrame(() => {
            this.palette.querySelector('.command-palette-content').style.transform = 'translateY(0)';
        });
    }

    close() {
        this.isOpen = false;
        this.palette.classList.remove('active');
        this.input.value = '';
        this.selectedIndex = 0;
    }

    showRecent() {
        const recentActions = this.actions.filter(a => a.recent).slice(0, 5);

        if (recentActions.length === 0) {
            this.results.innerHTML = '<div class="command-palette-empty">Type to search commands...</div>';
            return;
        }

        const html = `
            <div class="command-palette-section">
                <div class="command-palette-section-title">Recent</div>
                ${recentActions.map((action, index) => this.renderAction(action, index)).join('')}
            </div>
        `;

        this.results.innerHTML = html;
        this.filteredActions = recentActions;
    }

    handleInput(query) {
        if (!query.trim()) {
            this.showRecent();
            return;
        }

        // Fuzzy search
        this.filteredActions = this.fuzzySearch(query);

        if (this.filteredActions.length === 0) {
            this.results.innerHTML = '<div class="command-palette-empty">No results found</div>';
            return;
        }

        // Group by category
        const grouped = this.groupByCategory(this.filteredActions);

        const html = Object.entries(grouped).map(([category, actions]) => `
            <div class="command-palette-section">
                <div class="command-palette-section-title">${category}</div>
                ${actions.map((action, index) => this.renderAction(action, index)).join('')}
            </div>
        `).join('');

        this.results.innerHTML = html;
        this.selectedIndex = 0;
        this.updateSelection();
    }

    fuzzySearch(query) {
        query = query.toLowerCase();

        return this.actions
            .map(action => {
                let score = 0;
                const label = action.label.toLowerCase();
                const keywords = action.keywords.join(' ').toLowerCase();

                // Exact match
                if (label === query) score += 100;

                // Starts with
                if (label.startsWith(query)) score += 50;

                // Contains
                if (label.includes(query)) score += 25;

                // Keywords match
                if (keywords.includes(query)) score += 20;

                // Fuzzy match - check if all characters appear in order
                if (this.fuzzyMatch(query, label)) score += 10;

                return { ...action, score };
            })
            .filter(action => action.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 20);
    }

    fuzzyMatch(query, text) {
        let queryIndex = 0;
        for (let i = 0; i < text.length && queryIndex < query.length; i++) {
            if (text[i] === query[queryIndex]) {
                queryIndex++;
            }
        }
        return queryIndex === query.length;
    }

    groupByCategory(actions) {
        const grouped = {};
        actions.forEach(action => {
            if (!grouped[action.category]) {
                grouped[action.category] = [];
            }
            grouped[action.category].push(action);
        });
        return grouped;
    }

    renderAction(action, index) {
        return `
            <div class="command-palette-item" data-index="${index}" data-action-id="${action.id}">
                <span class="command-palette-item-icon">${action.icon}</span>
                <span class="command-palette-item-label">${action.label}</span>
                ${action.recent ? '<span class="command-palette-item-badge">Recent</span>' : ''}
            </div>
        `;
    }

    handleKeyboard(e) {
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, this.filteredActions.length - 1);
                this.updateSelection();
                break;

            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
                this.updateSelection();
                break;

            case 'Enter':
                e.preventDefault();
                this.executeSelected();
                break;
        }
    }

    updateSelection() {
        const items = this.results.querySelectorAll('.command-palette-item');
        items.forEach((item, index) => {
            item.classList.toggle('selected', index === this.selectedIndex);
        });

        // Scroll into view
        const selected = items[this.selectedIndex];
        if (selected) {
            selected.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }

    executeSelected() {
        if (this.filteredActions.length === 0) return;

        const action = this.filteredActions[this.selectedIndex];
        this.execute(action);
    }

    execute(action) {
        // Save to recent
        this.saveRecent(action.id);

        // Close palette
        this.close();

        // Execute action
        action.action();

        // Show toast
        this.dashboard.showToast(`Executed: ${action.label}`, 'success');
    }

    saveRecent(actionId) {
        this.recentActions = [actionId, ...this.recentActions.filter(id => id !== actionId)].slice(0, 10);
        localStorage.setItem('commandPaletteRecent', JSON.stringify(this.recentActions));
    }

    loadRecent() {
        try {
            return JSON.parse(localStorage.getItem('commandPaletteRecent') || '[]');
        } catch {
            return [];
        }
    }

    // Helper methods
    exportDashboard() {
        const data = {
            stats: this.dashboard.stats,
            resources: this.dashboard.resources,
            activityLog: this.dashboard.activityLog,
            timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orchestr8-dashboard-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    quickSearch(category) {
        this.dashboard.switchView('explorer');
        setTimeout(() => {
            const searchInput = document.getElementById('resourceSearch');
            if (searchInput) {
                searchInput.focus();
                searchInput.value = category;
                searchInput.dispatchEvent(new Event('input'));
            }
        }, 300);
    }

    runQuickTest(testType) {
        this.dashboard.switchView('testing');
        setTimeout(() => {
            if (testType === 'list-resources') {
                document.getElementById('requestType').value = 'resources/list';
            } else if (testType === 'match') {
                document.getElementById('requestType').value = 'resources/read';
                document.getElementById('resourceUri').value = 'orchestr8://match?query=api&categories=agent,skill';
            }
            this.dashboard.updateTestingForm();
        }, 300);
    }
}

// Initialize when dashboard is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.dashboard) {
            window.commandPalette = new CommandPalette(window.dashboard);
        }
    }, 100);
});
