// Provider Bridge - Main Application
const API_BASE = window.location.origin;

// State Management
const state = {
    user: null,
    accounts: [],
    stats: null,
    loading: false
};

// Router
class Router {
    constructor() {
        this.routes = {
            '/': this.renderLogin,
            '/dashboard': this.renderDashboard
        };
        this.init();
    }

    init() {
        window.addEventListener('popstate', () => this.route());
        this.route();
    }

    navigate(path) {
        window.history.pushState({}, '', path);
        this.route();
    }

    route() {
        const path = window.location.pathname;
        const handler = this.routes[path] || this.routes['/'];
        handler.call(this);
    }

    renderLogin() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="login-container">
                <div class="login-card">
                    <h1>🌉 Provider Bridge</h1>
                    <p>Centralisez vos CLI Gemini, Kiro et API Keys</p>
                    <button class="google-btn" onclick="handleGoogleLogin()">
                        <svg class="google-icon" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Se connecter avec Google
                    </button>
                    <div id="login-message" style="margin-top: 20px;"></div>
                </div>
            </div>
        `;
    }

    renderDashboard() {
        if (!state.user) {
            this.navigate('/');
            return;
        }

        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="dashboard">
                <nav class="navbar">
                    <div class="container navbar-content">
                        <h1>🌉 Provider Bridge</h1>
                        <div class="navbar-actions">
                            <span style="color: var(--text-secondary);">${state.user.email}</span>
                            <button class="btn btn-secondary" onclick="handleLogout()">Déconnexion</button>
                        </div>
                    </div>
                </nav>
                
                <div class="container">
                    <div id="alert-container"></div>
                    
                    <!-- Stats -->
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-icon">👥</div>
                            <div class="stat-label">Comptes Google</div>
                            <div class="stat-value" id="stat-accounts">-</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">🤖</div>
                            <div class="stat-label">Modèles Actifs</div>
                            <div class="stat-value" id="stat-models">-</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">💬</div>
                            <div class="stat-label">Requêtes (24h)</div>
                            <div class="stat-value" id="stat-requests">-</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">🔑</div>
                            <div class="stat-label">API Keys</div>
                            <div class="stat-value" id="stat-keys">-</div>
                        </div>
                    </div>

                    <!-- Accounts Table -->
                    <div class="accounts-section">
                        <div class="section-header">
                            <h2>Comptes Google Intégrés</h2>
                            <input type="text" class="search-box" placeholder="Rechercher..." 
                                   onkeyup="filterAccounts(this.value)">
                        </div>
                        
                        <div id="accounts-table-container">
                            <div class="loading">
                                <div class="spinner"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Usage Stats -->
                    <div class="accounts-section" style="margin-top: 30px;">
                        <div class="section-header">
                            <h2>Statistiques d'Utilisation</h2>
                            <button class="btn btn-secondary" onclick="refreshStats()">🔄 Actualiser</button>
                        </div>
                        <div id="usage-stats-container">
                            <div class="loading">
                                <div class="spinner"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Load data
        loadDashboardData();
    }
}

// API Functions
async function apiCall(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: { ...headers, ...options.headers }
    });

    if (response.status === 401) {
        localStorage.removeItem('token');
        router.navigate('/');
        throw new Error('Session expirée');
    }

    return response.json();
}

// Login Handler
async function handleGoogleLogin() {
    const messageEl = document.getElementById('login-message');
    messageEl.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    try {
        // Simulate Google OAuth flow
        // In production, this would redirect to Google OAuth
        const response = await apiCall('/api/auth/google', {
            method: 'POST',
            body: JSON.stringify({
                // Mock data - replace with actual OAuth response
                email: 'user@example.com',
                name: 'Test User'
            })
        });

        if (response.token) {
            localStorage.setItem('token', response.token);
            state.user = response.user;
            router.navigate('/dashboard');
        } else {
            throw new Error('Échec de l\'authentification');
        }
    } catch (error) {
        messageEl.innerHTML = `<div class="alert alert-error">${error.message}</div>`;
    }
}

// Logout Handler
function handleLogout() {
    localStorage.removeItem('token');
    state.user = null;
    router.navigate('/');
}

// Dashboard Data Loading
async function loadDashboardData() {
    try {
        // Load stats
        const stats = await apiCall('/api/admin/stats');
        updateStats(stats);

        // Load accounts
        const accounts = await apiCall('/api/admin/accounts');
        state.accounts = accounts;
        renderAccountsTable(accounts);

        // Load usage stats
        const usage = await apiCall('/api/admin/usage');
        renderUsageStats(usage);
    } catch (error) {
        showAlert('Erreur lors du chargement des données', 'error');
    }
}

// Update Stats
function updateStats(stats) {
    document.getElementById('stat-accounts').textContent = stats.totalAccounts || 0;
    document.getElementById('stat-models').textContent = stats.activeModels || 0;
    document.getElementById('stat-requests').textContent = stats.requests24h || 0;
    document.getElementById('stat-keys').textContent = stats.apiKeys || 0;
}

// Render Accounts Table
function renderAccountsTable(accounts) {
    const container = document.getElementById('accounts-table-container');
    
    if (accounts.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Aucun compte intégré</p>';
        return;
    }

    const html = `
        <table class="table">
            <thead>
                <tr>
                    <th>Email</th>
                    <th>Nom</th>
                    <th>CLI Gemini</th>
                    <th>Dernière Utilisation</th>
                    <th>Requêtes</th>
                    <th>Statut</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${accounts.map(account => `
                    <tr>
                        <td>${account.email}</td>
                        <td>${account.name || '-'}</td>
                        <td><span class="badge ${account.geminiCliEnabled ? 'badge-success' : 'badge-warning'}">
                            ${account.geminiCliEnabled ? 'Actif' : 'Inactif'}
                        </span></td>
                        <td>${formatDate(account.lastUsed)}</td>
                        <td>${account.requestCount || 0}</td>
                        <td><span class="badge ${account.status === 'active' ? 'badge-success' : 'badge-danger'}">
                            ${account.status === 'active' ? 'Actif' : 'Inactif'}
                        </span></td>
                        <td>
                            <button class="btn btn-danger" onclick="deleteAccount('${account.id}')">
                                🗑️ Supprimer
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
}

// Render Usage Stats
function renderUsageStats(usage) {
    const container = document.getElementById('usage-stats-container');
    
    const html = `
        <table class="table">
            <thead>
                <tr>
                    <th>Compte</th>
                    <th>Modèle</th>
                    <th>Requêtes</th>
                    <th>Tokens Utilisés</th>
                    <th>Limite Tokens</th>
                    <th>Utilisation</th>
                </tr>
            </thead>
            <tbody>
                ${usage.map(stat => {
                    const percentage = (stat.tokensUsed / stat.tokenLimit * 100).toFixed(1);
                    return `
                        <tr>
                            <td>${stat.email}</td>
                            <td>${stat.model}</td>
                            <td>${stat.requests}</td>
                            <td>${formatNumber(stat.tokensUsed)}</td>
                            <td>${formatNumber(stat.tokenLimit)}</td>
                            <td>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <div style="flex: 1; height: 8px; background: var(--bg-color); border-radius: 4px; overflow: hidden;">
                                        <div style="width: ${percentage}%; height: 100%; background: ${percentage > 80 ? 'var(--danger-color)' : 'var(--success-color)'}"></div>
                                    </div>
                                    <span>${percentage}%</span>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
}

// Delete Account
async function deleteAccount(accountId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
        return;
    }

    try {
        await apiCall(`/api/admin/accounts/${accountId}`, { method: 'DELETE' });
        showAlert('Compte supprimé avec succès', 'success');
        loadDashboardData();
    } catch (error) {
        showAlert('Erreur lors de la suppression du compte', 'error');
    }
}

// Filter Accounts
function filterAccounts(query) {
    const filtered = state.accounts.filter(account => 
        account.email.toLowerCase().includes(query.toLowerCase()) ||
        (account.name && account.name.toLowerCase().includes(query.toLowerCase()))
    );
    renderAccountsTable(filtered);
}

// Refresh Stats
function refreshStats() {
    loadDashboardData();
    showAlert('Données actualisées', 'success');
}

// Show Alert
function showAlert(message, type) {
    const container = document.getElementById('alert-container');
    const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
    container.innerHTML = `<div class="alert ${alertClass}">${message}</div>`;
    setTimeout(() => container.innerHTML = '', 3000);
}

// Utility Functions
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR');
}

function formatNumber(num) {
    return new Intl.NumberFormat('fr-FR').format(num);
}

// Initialize Router
const router = new Router();

// Check authentication on load
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token && window.location.pathname === '/') {
        router.navigate('/dashboard');
    }
});
