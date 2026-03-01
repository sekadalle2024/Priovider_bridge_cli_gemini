# Intégration des Assistants avec Electron

Ce guide explique comment intégrer le serveur des assistants avec l'application Electron AionUI.

## 🎯 Objectif

Démarrer automatiquement le serveur des assistants lorsque l'application Electron démarre, et l'arrêter proprement lors de la fermeture.

## 📋 Options d'intégration

### Option 1: Processus intégré (Recommandé)

Le serveur tourne dans le même processus que l'application Electron.

**Avantages:**
- Démarrage/arrêt automatique
- Partage de la configuration
- Pas de processus externe à gérer

**Inconvénients:**
- Si le serveur crash, l'application peut être affectée

### Option 2: Processus séparé

Le serveur tourne dans un processus Node.js séparé.

**Avantages:**
- Isolation complète
- Peut être redémarré indépendamment
- Meilleure stabilité

**Inconvénients:**
- Gestion plus complexe
- Communication inter-processus nécessaire

## 🔧 Implémentation

### Option 1: Processus intégré

Modifier `src/main/index.ts` :

```typescript
import { app, BrowserWindow } from 'electron';
import { startServer as startAssistantsServer } from '../webserver/server-assistants';
import { getAssistantsConfig } from '../webserver/config/assistants';

let mainWindow: BrowserWindow | null = null;
let assistantsServerStarted = false;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
}

async function startServices() {
  const config = getAssistantsConfig();

  // Démarrer le serveur des assistants si activé
  if (config.enabled && config.autoStart) {
    try {
      console.log('🚀 Démarrage du serveur des assistants...');
      await startAssistantsServer();
      assistantsServerStarted = true;
      console.log(`✅ Serveur des assistants démarré sur le port ${config.port}`);
    } catch (error) {
      console.error('❌ Erreur lors du démarrage du serveur des assistants:', error);
      // Ne pas bloquer le démarrage de l'application
    }
  }
}

app.whenReady().then(async () => {
  // Démarrer les services
  await startServices();

  // Créer la fenêtre principale
  await createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  console.log('🛑 Arrêt de l\'application...');
  // Le serveur Express s'arrêtera automatiquement avec le processus
});
```

### Option 2: Processus séparé

Modifier `src/main/index.ts` :

```typescript
import { app, BrowserWindow } from 'electron';
import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import { getAssistantsConfig } from '../webserver/config/assistants';

let mainWindow: BrowserWindow | null = null;
let assistantsServerProcess: ChildProcess | null = null;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
}

async function startAssistantsServer() {
  const config = getAssistantsConfig();

  if (!config.enabled || !config.autoStart) {
    return;
  }

  try {
    console.log('🚀 Démarrage du serveur des assistants...');

    const serverScript = path.join(__dirname, '../webserver/server-assistants.js');
    
    assistantsServerProcess = spawn('node', [serverScript], {
      env: {
        ...process.env,
        ASSISTANT_PORT: config.port.toString(),
        ASSISTANTS_PATH: config.assistantsPath,
        GEMINI_CLI_PATH: config.geminiCliPath,
        GEMINI_DEFAULT_MODEL: config.defaultModel
      },
      stdio: 'inherit'
    });

    assistantsServerProcess.on('error', (error) => {
      console.error('❌ Erreur du serveur des assistants:', error);
    });

    assistantsServerProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`❌ Le serveur des assistants s'est arrêté avec le code ${code}`);
      }
      assistantsServerProcess = null;
    });

    console.log(`✅ Serveur des assistants démarré sur le port ${config.port}`);
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur des assistants:', error);
  }
}

function stopAssistantsServer() {
  if (assistantsServerProcess) {
    console.log('🛑 Arrêt du serveur des assistants...');
    assistantsServerProcess.kill('SIGTERM');
    assistantsServerProcess = null;
  }
}

app.whenReady().then(async () => {
  // Démarrer le serveur des assistants
  await startAssistantsServer();

  // Créer la fenêtre principale
  await createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  stopAssistantsServer();
});

app.on('will-quit', () => {
  stopAssistantsServer();
});
```

## 🔗 Communication avec le renderer

### Exposer l'API au renderer

Créer `src/preload/assistants.ts` :

```typescript
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('assistantsApi', {
  // Obtenir la liste des assistants
  getAssistants: () => ipcRenderer.invoke('assistants:list'),

  // Exécuter un assistant
  executeAssistant: (name: string, request: any) => 
    ipcRenderer.invoke('assistants:execute', name, request),

  // Obtenir les infos d'un assistant
  getAssistantInfo: (name: string) => 
    ipcRenderer.invoke('assistants:info', name),

  // Health check
  healthCheck: () => ipcRenderer.invoke('assistants:health')
});
```

### Gérer les IPC dans le main process

Ajouter dans `src/main/index.ts` :

```typescript
import { ipcMain } from 'electron';
import { getAssistantService } from '../webserver/services/AssistantService';

// Enregistrer les handlers IPC
function registerAssistantsHandlers() {
  const service = getAssistantService();

  ipcMain.handle('assistants:list', async () => {
    return await service.discoverAssistants();
  });

  ipcMain.handle('assistants:execute', async (event, name, request) => {
    return await service.executeAssistant(name, request);
  });

  ipcMain.handle('assistants:info', async (event, name) => {
    const assistants = await service.discoverAssistants();
    return assistants.find(a => a.name === name);
  });

  ipcMain.handle('assistants:health', async () => {
    const geminiAvailable = await service.checkGeminiCli();
    const assistants = await service.discoverAssistants();
    return {
      status: 'ok',
      geminiCli: geminiAvailable ? 'available' : 'unavailable',
      assistantsCount: assistants.length
    };
  });
}

app.whenReady().then(async () => {
  await startServices();
  registerAssistantsHandlers();
  await createWindow();
});
```

### Utiliser l'API dans le renderer

Dans votre composant React :

```typescript
// src/renderer/components/AssistantsList.tsx
import React, { useEffect, useState } from 'react';

interface Assistant {
  name: string;
  displayName: string;
  description: string;
  endpoint: string;
  capabilities: string[];
}

export function AssistantsList() {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssistants();
  }, []);

  async function loadAssistants() {
    try {
      const result = await (window as any).assistantsApi.getAssistants();
      setAssistants(result);
    } catch (error) {
      console.error('Erreur lors du chargement des assistants:', error);
    } finally {
      setLoading(false);
    }
  }

  async function executeAssistant(name: string, prompt: string) {
    try {
      const result = await (window as any).assistantsApi.executeAssistant(name, {
        prompt,
        model: 'gemini-2.0-flash-exp'
      });
      console.log('Résultat:', result);
    } catch (error) {
      console.error('Erreur lors de l\'exécution:', error);
    }
  }

  if (loading) {
    return <div>Chargement des assistants...</div>;
  }

  return (
    <div>
      <h2>Assistants disponibles ({assistants.length})</h2>
      <div className="assistants-grid">
        {assistants.map(assistant => (
          <div key={assistant.name} className="assistant-card">
            <h3>{assistant.displayName}</h3>
            <p>{assistant.description}</p>
            <button onClick={() => executeAssistant(assistant.name, 'Test')}>
              Tester
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 🎨 Interface utilisateur

### Ajouter un menu pour les assistants

```typescript
import { Menu } from 'electron';

function createMenu() {
  const template = [
    {
      label: 'Assistants',
      submenu: [
        {
          label: 'Ouvrir le panneau des assistants',
          click: () => {
            mainWindow?.webContents.send('show-assistants-panel');
          }
        },
        {
          label: 'Ouvrir la documentation API',
          click: () => {
            const config = getAssistantsConfig();
            require('electron').shell.openExternal(
              `http://localhost:${config.port}/api-docs`
            );
          }
        },
        { type: 'separator' },
        {
          label: 'Redémarrer le serveur',
          click: async () => {
            stopAssistantsServer();
            await startAssistantsServer();
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template as any);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createMenu();
  // ...
});
```

## 🔔 Notifications

### Notifier l'utilisateur du statut

```typescript
import { Notification } from 'electron';

async function startAssistantsServer() {
  try {
    await startServer();
    
    new Notification({
      title: 'AionUI Assistants',
      body: 'Le serveur des assistants est démarré',
      icon: path.join(__dirname, '../assets/icon.png')
    }).show();
  } catch (error) {
    new Notification({
      title: 'AionUI Assistants',
      body: 'Erreur lors du démarrage du serveur',
      icon: path.join(__dirname, '../assets/icon.png')
    }).show();
  }
}
```

## 📊 Monitoring

### Ajouter un indicateur de statut

```typescript
// Dans le renderer
import React, { useEffect, useState } from 'react';

export function AssistantsStatus() {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Vérifier toutes les 30s
    return () => clearInterval(interval);
  }, []);

  async function checkStatus() {
    try {
      const result = await (window as any).assistantsApi.healthCheck();
      setStatus(result);
    } catch (error) {
      setStatus({ status: 'error' });
    }
  }

  if (!status) return null;

  return (
    <div className="assistants-status">
      <span className={`status-indicator ${status.status}`}>
        {status.status === 'ok' ? '🟢' : '🔴'}
      </span>
      <span>
        Assistants: {status.assistantsCount || 0} | 
        Gemini CLI: {status.geminiCli || 'unknown'}
      </span>
    </div>
  );
}
```

## 🧪 Tests

### Tester l'intégration

```typescript
// tests/integration/assistants.test.ts
import { app } from 'electron';
import { getAssistantService } from '../../src/webserver/services/AssistantService';

describe('Assistants Integration', () => {
  beforeAll(async () => {
    await app.whenReady();
  });

  test('should discover assistants', async () => {
    const service = getAssistantService();
    const assistants = await service.discoverAssistants();
    expect(assistants.length).toBeGreaterThan(0);
  });

  test('should check Gemini CLI availability', async () => {
    const service = getAssistantService();
    const available = await service.checkGeminiCli();
    expect(typeof available).toBe('boolean');
  });
});
```

## 📝 Configuration utilisateur

### Permettre à l'utilisateur de configurer

Créer une page de paramètres :

```typescript
// src/renderer/components/AssistantsSettings.tsx
import React, { useState } from 'react';

export function AssistantsSettings() {
  const [config, setConfig] = useState({
    enabled: true,
    port: 25810,
    autoStart: true,
    geminiCliPath: 'gemini',
    defaultModel: 'gemini-2.0-flash-exp'
  });

  async function saveConfig() {
    await (window as any).assistantsApi.updateConfig(config);
  }

  return (
    <div className="settings-panel">
      <h2>Configuration des Assistants</h2>
      
      <label>
        <input
          type="checkbox"
          checked={config.enabled}
          onChange={e => setConfig({...config, enabled: e.target.checked})}
        />
        Activer le serveur des assistants
      </label>

      <label>
        Port:
        <input
          type="number"
          value={config.port}
          onChange={e => setConfig({...config, port: parseInt(e.target.value)})}
        />
      </label>

      <label>
        <input
          type="checkbox"
          checked={config.autoStart}
          onChange={e => setConfig({...config, autoStart: e.target.checked})}
        />
        Démarrer automatiquement
      </label>

      <label>
        Chemin Gemini CLI:
        <input
          type="text"
          value={config.geminiCliPath}
          onChange={e => setConfig({...config, geminiCliPath: e.target.value})}
        />
      </label>

      <label>
        Modèle par défaut:
        <select
          value={config.defaultModel}
          onChange={e => setConfig({...config, defaultModel: e.target.value})}
        >
          <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash</option>
          <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
          <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
        </select>
      </label>

      <button onClick={saveConfig}>Sauvegarder</button>
    </div>
  );
}
```

## 🚀 Prochaines étapes

1. ✅ Intégration de base avec Electron
2. ⏳ Interface utilisateur pour les assistants
3. ⏳ Gestion des erreurs et retry
4. ⏳ Logs et monitoring
5. ⏳ Configuration utilisateur
6. ⏳ Tests d'intégration
7. ⏳ Documentation utilisateur

## 📞 Support

Pour toute question sur l'intégration :

- GitHub Issues : https://github.com/iOfficeAI/AionUi/issues
- Discord : https://discord.gg/2QAwJn7Egx
