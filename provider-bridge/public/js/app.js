/**
 * Provider Bridge — Frontend SPA Application
 * Single-file SPA with router, API client, login, and admin dashboard
 */

// ============================================================
// API Client
// ============================================================
const API = {
    token: null,
    user: null,

    async request(url, options = {}) {
        const headers = { 'Content-Type': 'application/json', ...options.headers };
        if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

        const res = await fetch(url, { ...options, headers, credentials: 'include' });
        if (res.status === 401) {
            this.token = null;
            this.user = null;
            localStorage.removeItem('pb-token');
            Router.navigate('login');
            throw new Error('Session expired');
        }
        return res;
    },

    async get(url) { return (await this.request(url)).json(); },

    async post(url, data) {
        return (await this.request(url, { method: 'POST', body: JSON.stringify(data) })).json();
    },

    async del(url) {
        return (await this.request(url, { method: 'DELETE' })).json();
    },

    async put(url, data) {
        return (await this.request(url, { method: 'PUT', body: JSON.stringify(data) })).json();
    },

    setToken(token) {
        this.token = token;
        if (token) localStorage.setItem('pb-token', token);
        else localStorage.removeItem('pb-token');
    },

    init() {
        this.token = localStorage.getItem('pb-token');
    }
};

// ============================================================
// Toast Notifications
// ============================================================
const Toast = {
    container: null,

    init() {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    },

    show(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        this.container.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }
};

// ============================================================
// Router
// ============================================================
const Router = {
    currentPage: null,

    navigate(page) {
        this.currentPage = page;
        const app = document.getElementById('app');
        app.innerHTML = '';

        if (page === 'login') {
            LoginPage.render(app);
        } else {
            DashboardPage.render(app, page);
        }
    },

    init() {
        // Check URL params for OAuth callback
        const params = new URLSearchParams(window.location.search);
        if (params.get('login') === 'success') {
            window.history.replaceState({}, '', '/');
        }

        // Check if authenticated
        API.init();
        if (API.token) {
            this.navigate('overview');
        } else {
            this.navigate('login');
        }
    }
};

// ============================================================
// Login Page
// ============================================================
const LoginPage = {
    render(container) {
        container.innerHTML = `
      <div class="login-container">
        <div class="login-card">
          <div class="login-logo">
            <h1>🌉 Provider Bridge</h1>
            <p>Centralized API Gateway</p>
          </div>
          <div id="login-error" class="login-error"></div>
          <form class="login-form" id="login-form">
            <div class="form-group">
              <label for="email">Email / Username</label>
              <input type="text" id="email" name="email" placeholder="admin" autocomplete="username" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" placeholder="••••••••" autocomplete="current-password" required>
            </div>
            <button type="submit" class="btn btn-primary" id="login-btn">Sign In</button>
          </form>
          <div class="divider">or</div>
          <a href="/api/auth/google" class="btn btn-google" style="width:100%">
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path></svg>
            Sign in with Google
          </a>
        </div>
      </div>
    `;

        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('login-btn');
            const errorEl = document.getElementById('login-error');

            btn.textContent = 'Signing in...';
            btn.disabled = true;
            errorEl.style.display = 'none';

            try {
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const result = await API.post('/api/auth/login', { email, password });

                if (result.token) {
                    API.setToken(result.token);
                    API.user = result.user;
                    Toast.show('Welcome back! 🎉');
                    Router.navigate('overview');
                } else {
                    throw new Error(result.error || 'Login failed');
                }
            } catch (err) {
                errorEl.textContent = err.message || 'Login failed';
                errorEl.style.display = 'block';
            } finally {
                btn.textContent = 'Sign In';
                btn.disabled = false;
            }
        });
    }
};

// ============================================================
// Dashboard Page (with sub-pages)
// ============================================================
const DashboardPage = {
    render(container, page = 'overview') {
        container.innerHTML = `
      <div class="dashboard">
        <aside class="sidebar" id="sidebar">
          <div class="sidebar-logo">
            <h2>🌉 Provider Bridge</h2>
            <span>Admin Dashboard</span>
          </div>
          <nav class="sidebar-nav">
            <div class="nav-item ${page === 'overview' ? 'active' : ''}" data-page="overview">
              <span class="nav-icon">📊</span> Overview
            </div>
            <div class="nav-item ${page === 'users' ? 'active' : ''}" data-page="users">
              <span class="nav-icon">👥</span> Users
            </div>
            <div class="nav-item ${page === 'providers' ? 'active' : ''}" data-page="providers">
              <span class="nav-icon">🤖</span> Providers
            </div>
            <div class="nav-item ${page === 'stats' ? 'active' : ''}" data-page="stats">
              <span class="nav-icon">📈</span> Statistics
            </div>
            <div class="nav-item" onclick="window.open('/docs', '_blank')">
              <span class="nav-icon">📚</span> API Docs
            </div>
          </nav>
          <div class="sidebar-footer">
            <div class="user-info">
              <div class="user-avatar" id="user-avatar">A</div>
              <div>
                <div class="user-name" id="user-name">Admin</div>
                <div class="user-role" id="user-role">admin</div>
              </div>
            </div>
            <button class="btn btn-sm btn-google" style="width:100%" id="logout-btn">Logout</button>
          </div>
        </aside>
        <main class="main-content" id="main-content">
          <div class="loading"><div class="spinner"></div></div>
        </main>
      </div>
    `;

        // Navigation
        document.querySelectorAll('.nav-item[data-page]').forEach(item => {
            item.addEventListener('click', () => Router.navigate(item.dataset.page));
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', async () => {
            await API.post('/api/auth/logout', {}).catch(() => { });
            API.setToken(null);
            API.user = null;
            Router.navigate('login');
        });

        // Load user info
        this.loadUserInfo();

        // Render sub page
        const main = document.getElementById('main-content');
        switch (page) {
            case 'overview': this.renderOverview(main); break;
            case 'users': this.renderUsers(main); break;
            case 'providers': this.renderProviders(main); break;
            case 'stats': this.renderStats(main); break;
            default: this.renderOverview(main);
        }
    },

    async loadUserInfo() {
        try {
            const user = await API.get('/api/auth/me');
            API.user = user;
            document.getElementById('user-name').textContent = user.display_name || user.email;
            document.getElementById('user-role').textContent = user.role;
            document.getElementById('user-avatar').textContent = (user.display_name || user.email)[0].toUpperCase();
        } catch (err) {
            // Silently fail
        }
    },

    // ============================================================
    // Overview page
    // ============================================================
    async renderOverview(container) {
        container.innerHTML = `
      <div class="page-header">
        <h1>Dashboard Overview</h1>
        <p>Real-time monitoring of your Provider Bridge endpoints</p>
      </div>
      <div class="stats-grid" id="stats-cards">
        <div class="loading"><div class="spinner"></div></div>
      </div>
      <div class="providers-grid" id="providers-status">
        <div class="loading"><div class="spinner"></div></div>
      </div>
    `;

        // Load stats
        try {
            const stats = await API.get('/api/admin/stats');
            document.getElementById('stats-cards').innerHTML = `
        <div class="stat-card blue fade-in">
          <div class="stat-icon">📨</div>
          <div class="stat-value">${stats.totalRequests.toLocaleString()}</div>
          <div class="stat-label">Total Requests</div>
        </div>
        <div class="stat-card emerald fade-in">
          <div class="stat-icon">🪙</div>
          <div class="stat-value">${stats.totalTokens.toLocaleString()}</div>
          <div class="stat-label">Tokens Used</div>
        </div>
        <div class="stat-card purple fade-in">
          <div class="stat-icon">👤</div>
          <div class="stat-value">${stats.activeUsers}</div>
          <div class="stat-label">Active Users (7d)</div>
        </div>
        <div class="stat-card amber fade-in">
          <div class="stat-icon">🔑</div>
          <div class="stat-value">${stats.apiKeyRotation?.totalKeys || 0}</div>
          <div class="stat-label">API Keys Loaded</div>
        </div>
      `;
        } catch (err) {
            document.getElementById('stats-cards').innerHTML = `
        <div class="stat-card blue fade-in"><div class="stat-icon">📨</div><div class="stat-value">—</div><div class="stat-label">Total Requests</div></div>
        <div class="stat-card emerald fade-in"><div class="stat-icon">🪙</div><div class="stat-value">—</div><div class="stat-label">Tokens Used</div></div>
        <div class="stat-card purple fade-in"><div class="stat-icon">👤</div><div class="stat-value">—</div><div class="stat-label">Active Users</div></div>
        <div class="stat-card amber fade-in"><div class="stat-icon">🔑</div><div class="stat-value">—</div><div class="stat-label">API Keys</div></div>
      `;
        }

        // Load providers
        try {
            const data = await API.get('/api/providers');
            document.getElementById('providers-status').innerHTML = data.providers.map(p => `
        <div class="provider-card fade-in">
          <div class="provider-header">
            <div class="provider-icon ${p.id === 'gemini_cli' ? 'gemini' : p.id === 'kiro_cli' ? 'kiro' : 'apikey'}">
              ${p.id === 'gemini_cli' ? '💎' : p.id === 'kiro_cli' ? '⚡' : '🔄'}
            </div>
            <div>
              <div class="provider-name">${p.name}</div>
              <div class="provider-desc">${p.description}</div>
            </div>
          </div>
          <div class="provider-status">
            <span class="status-dot ${p.available ? 'online' : 'offline'}"></span>
            ${p.available ? 'Online' : 'Offline'}
            ${p.keysLoaded !== undefined ? ` — ${p.keysLoaded} keys` : ''}
          </div>
          <div class="provider-endpoints">
            ${Object.entries(p.endpoints).map(([name, url]) => `
              <div class="endpoint-item">
                <span class="endpoint-method">${name === 'stats' ? 'GET' : 'POST'}</span>${url}
              </div>
            `).join('')}
          </div>
        </div>
      `).join('');
        } catch (err) {
            document.getElementById('providers-status').innerHTML = '<p style="color:var(--text-muted)">Could not load providers</p>';
        }
    },

    // ============================================================
    // Users page
    // ============================================================
    async renderUsers(container) {
        container.innerHTML = `
      <div class="page-header">
        <h1>User Management</h1>
        <p>Manage Google accounts and CLI credentials</p>
      </div>
      <div class="card" id="users-table-card">
        <div class="card-header">
          <h3 class="card-title">Registered Users</h3>
        </div>
        <div class="loading"><div class="spinner"></div></div>
      </div>
    `;

        try {
            const data = await API.get('/api/admin/users');
            const tableCard = document.getElementById('users-table-card');
            tableCard.innerHTML = `
        <div class="card-header">
          <h3 class="card-title">Registered Users (${data.total})</h3>
        </div>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Google</th>
                <th>Requests</th>
                <th>Tokens</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${data.users.map(u => `
                <tr class="fade-in">
                  <td>
                    <strong>${u.display_name || '—'}</strong><br>
                    <span style="color:var(--text-muted);font-size:12px">${u.email}</span>
                  </td>
                  <td><span class="badge badge-${u.role}">${u.role}</span></td>
                  <td>
                    ${u.active_credentials > 0
                    ? '<span class="badge badge-active">Connected</span>'
                    : '<span style="color:var(--text-muted)">—</span>'}
                  </td>
                  <td>${(u.total_requests || 0).toLocaleString()}</td>
                  <td>${(u.total_tokens || 0).toLocaleString()}</td>
                  <td style="color:var(--text-muted);font-size:13px">${u.last_login ? new Date(u.last_login).toLocaleDateString() : '—'}</td>
                  <td>
                    ${u.role !== 'admin' ? `<button class="btn btn-danger btn-sm" onclick="deleteUser('${u.id}')">Delete</button>` : ''}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
        } catch (err) {
            document.getElementById('users-table-card').innerHTML = `<p style="color:var(--text-muted);padding:20px">Could not load users: ${err.message}</p>`;
        }
    },

    // ============================================================
    // Providers page
    // ============================================================
    async renderProviders(container) {
        container.innerHTML = `
      <div class="page-header">
        <h1>Provider Status</h1>
        <p>Monitor all connected AI providers</p>
      </div>
      <div class="providers-grid" id="providers-detail"></div>
      <div class="card" id="api-key-stats">
        <div class="card-header"><h3 class="card-title">API Key Rotation Stats</h3></div>
        <div class="loading"><div class="spinner"></div></div>
      </div>
    `;

        // Providers
        try {
            const data = await API.get('/api/providers');
            document.getElementById('providers-detail').innerHTML = data.providers.map(p => `
        <div class="provider-card fade-in">
          <div class="provider-header">
            <div class="provider-icon ${p.id === 'gemini_cli' ? 'gemini' : p.id === 'kiro_cli' ? 'kiro' : 'apikey'}">
              ${p.id === 'gemini_cli' ? '💎' : p.id === 'kiro_cli' ? '⚡' : '🔄'}
            </div>
            <div>
              <div class="provider-name">${p.name}</div>
              <div class="provider-desc">${p.description}</div>
            </div>
          </div>
          <div class="provider-status">
            <span class="status-dot ${p.available ? 'online' : 'offline'}"></span>
            ${p.available ? 'Online' : 'Offline'}
          </div>
          <div class="provider-endpoints">
            ${Object.entries(p.endpoints).map(([n, u]) => `
              <div class="endpoint-item"><span class="endpoint-method">${n === 'stats' ? 'GET' : 'POST'}</span>${u}</div>
            `).join('')}
          </div>
        </div>
      `).join('');
        } catch (err) {
            document.getElementById('providers-detail').innerHTML = '<p style="color:var(--text-muted)">Error loading providers</p>';
        }

        // API Key stats
        try {
            const stats = await API.get('/api/providers/gemini_api_key_rotative/stats');
            document.getElementById('api-key-stats').innerHTML = `
        <div class="card-header">
          <h3 class="card-title">API Key Rotation — ${stats.totalKeys} keys (${stats.availableKeys} available)</h3>
        </div>
        <div class="table-wrapper">
          <table>
            <thead><tr><th>Key</th><th>Req/min</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              ${(stats.usage || []).map(k => `
                <tr class="fade-in">
                  <td style="font-family:monospace">${k.maskedKey}</td>
                  <td>${k.requestsThisMinute}/5</td>
                  <td>${k.totalRequests}</td>
                  <td><span class="badge ${k.available ? 'badge-active' : 'badge-revoked'}">${k.available ? 'Available' : 'Rate Limited'}</span></td>
                </tr>
              `).join('')}
              ${(stats.usage || []).length === 0 ? '<tr><td colspan="4" style="color:var(--text-muted);text-align:center">No API keys configured</td></tr>' : ''}
            </tbody>
          </table>
        </div>
      `;
        } catch (err) {
            document.getElementById('api-key-stats').innerHTML = `<p style="color:var(--text-muted);padding:20px">No API key stats available</p>`;
        }
    },

    // ============================================================
    // Statistics page
    // ============================================================
    async renderStats(container) {
        container.innerHTML = `
      <div class="page-header">
        <h1>Usage Statistics</h1>
        <p>Detailed analytics by provider, model, and usage over time</p>
      </div>
      <div class="chart-container" id="chart-container">
        <div class="loading"><div class="spinner"></div></div>
      </div>
    `;

        try {
            const stats = await API.get('/api/admin/stats');

            const maxProvider = Math.max(...(stats.byProvider || []).map(p => p.requests), 1);
            const maxModel = Math.max(...(stats.byModel || []).map(m => m.requests), 1);
            const maxDay = Math.max(...(stats.byDay || []).map(d => d.requests), 1);

            const colors = ['blue', 'emerald', 'purple'];

            document.getElementById('chart-container').innerHTML = `
        <div class="chart-card fade-in">
          <h3>📊 Requests by Provider</h3>
          <div class="bar-chart">
            ${(stats.byProvider || []).map((p, i) => `
              <div class="bar-item">
                <span class="bar-label">${p.provider}</span>
                <div class="bar-track"><div class="bar-fill ${colors[i % 3]}" style="width:${(p.requests / maxProvider) * 100}%"></div></div>
                <span class="bar-value">${p.requests.toLocaleString()}</span>
              </div>
            `).join('') || '<p style="color:var(--text-muted)">No data yet</p>'}
          </div>
        </div>
        <div class="chart-card fade-in">
          <h3>🤖 Requests by Model</h3>
          <div class="bar-chart">
            ${(stats.byModel || []).map((m, i) => `
              <div class="bar-item">
                <span class="bar-label">${m.model}</span>
                <div class="bar-track"><div class="bar-fill ${colors[i % 3]}" style="width:${(m.requests / maxModel) * 100}%"></div></div>
                <span class="bar-value">${m.requests.toLocaleString()}</span>
              </div>
            `).join('') || '<p style="color:var(--text-muted)">No data yet</p>'}
          </div>
        </div>
        <div class="chart-card fade-in" style="grid-column:1/-1">
          <h3>📅 Usage Over Last 30 Days</h3>
          <div class="bar-chart">
            ${(stats.byDay || []).slice(-15).map((d, i) => `
              <div class="bar-item">
                <span class="bar-label">${d.day}</span>
                <div class="bar-track"><div class="bar-fill blue" style="width:${(d.requests / maxDay) * 100}%"></div></div>
                <span class="bar-value">${d.requests.toLocaleString()}</span>
              </div>
            `).join('') || '<p style="color:var(--text-muted)">No data yet</p>'}
          </div>
        </div>
      `;
        } catch (err) {
            document.getElementById('chart-container').innerHTML = `<p style="color:var(--text-muted)">Could not load statistics: ${err.message}</p>`;
        }
    }
};

// ============================================================
// Global functions
// ============================================================
window.deleteUser = async function (userId) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
        await API.del(`/api/admin/users/${userId}`);
        Toast.show('User deleted successfully');
        Router.navigate('users');
    } catch (err) {
        Toast.show('Failed to delete user: ' + err.message, 'error');
    }
};

// ============================================================
// Initialize
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    Toast.init();
    Router.init();
});
