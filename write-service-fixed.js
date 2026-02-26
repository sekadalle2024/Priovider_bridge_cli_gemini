const fs = require('fs');

const content = `const { exec } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

class GeminiServiceStandalone {
  constructor() {
    this.initialized = false;
  }

  async initialize(config = {}) {
    this.modelName = config.model || process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    this.initialized = true;
    console.log('[Gemini] CLI mode - Model: ' + this.modelName);
    return this;
  }

  hasOAuthCredentials() {
    try {
      const credentialsPath = path.join(os.homedir(), '.gemini', 'oauth_creds.json');
      if (!fs.existsSync(credentialsPath)) return false;
      const content = fs.readFileSync(credentialsPath, 'utf-8');
      const creds = JSON.parse(content);
      return !!(creds && (creds.access_token || creds.refresh_token));
    } catch {
      return false;
    }
  }

  async chat(messages, options = {}) {
    if (!this.initialized) throw new Error('Service not initialized');
    
    return new Promise((resolve, reject) => {
      const lastMessage = messages[messages.length - 1];
      const modelName = options.model || this.modelName;
      
      const escapedPrompt = lastMessage.content.replace(/"/g, '\\\\"');
      const command = \`gemini -m \${modelName} -p "\${escapedPrompt}"\`;

      console.log('[Gemini] Executing: gemini -m ' + modelName + ' -p');

      const timeout = setTimeout(() => {
        reject(new Error('Timeout after 300s'));
      }, 300000);

      exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
        clearTimeout(timeout);
        
        if (error) {
          console.log('[Gemini] Exit code: ' + error.code);
          reject(new Error('Gemini CLI exited with code ' + error.code + ': ' + stderr));
        } else {
          console.log('[Gemini] Exit code: 0');
          const cleaned = stdout
            .replace(/\\x1b\\[[0-9;]*m/g, '')
            .replace(/Loaded cached credentials\\./g, '')
            .trim();
          resolve(cleaned);
        }
      });
    });
  }

  async generate(prompt, options = {}) {
    return await this.chat([{ role: 'user', content: prompt }], options);
  }
}

let instance = null;

function getGeminiService() {
  if (!instance) instance = new GeminiServiceStandalone();
  return instance;
}

module.exports = { GeminiServiceStandalone, getGeminiService };
`;

fs.writeFileSync('dist/gemini-service-standalone.js', content, 'utf8');
console.log('✅ Service file written successfully');
console.log('   - Timeout: 300s');
console.log('   - Default model: gemini-2.5-flash');
