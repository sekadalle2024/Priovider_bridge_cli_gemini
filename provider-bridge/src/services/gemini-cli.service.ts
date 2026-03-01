/**
 * Provider Bridge — Gemini CLI Service
 * Multi-path detection for Windows / Linux / macOS
 *
 * Spawn strategy for non-interactive mode:
 *   Windows — PowerShell: `powershell.exe -Command "& 'gemini.cmd' -m '…' -p '…'"`
 *             Single-quoted PS literals eliminate all cmd.exe quoting issues.
 *             Only the single-quote character needs escaping (→ '').
 *   Unix    — Direct spawn (shell: false), arguments passed as array elements.
 *
 * Why not `shell: true` on Windows?
 *   cmd.exe concatenates args with spaces and does NOT quote individual tokens,
 *   so a prompt like "Reply: CLI OK" becomes three separate positional tokens,
 *   triggering: "Cannot use both a positional prompt and the --prompt (-p) flag"
 *
 * Why not `shell: false` with a .cmd path on Windows?
 *   Node.js cannot CreateProcess a .cmd shim directly → EINVAL.
 */

import { spawn, exec } from 'child_process';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { promisify } from 'util';

const execAsync = promisify(exec);

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: string;
  content: string;
}

export interface ChatOptions {
  model?: string;
  timeout?: number;
}

export interface ChatResult {
  text: string;
  model: string;
  cliPath?: string;
}

export interface GeminiCliStatus {
  available: boolean;
  hasOAuth: boolean;
  version?: string;
  cliPath?: string;
  installHint?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const IS_WINDOWS = os.platform() === 'win32';

// ─── Path resolution ─────────────────────────────────────────────────────────

/**
 * Build an ordered list of candidate paths where the gemini CLI may live.
 * The first existing path is used.
 */
function buildCandidatePaths(): string[] {
  const username = os.userInfo().username;
  const candidates: string[] = [];

  if (IS_WINDOWS) {
    candidates.push(`C:\\Users\\${username}\\AppData\\Roaming\\npm\\gemini.cmd`, `C:\\Users\\${username}\\AppData\\Roaming\\npm\\gemini`, `C:\\Users\\${username}\\AppData\\Roaming\\nvm\\current\\gemini.cmd`, 'C:\\ProgramData\\npm\\gemini.cmd');
  } else {
    candidates.push('/usr/local/bin/gemini', '/usr/bin/gemini', `${os.homedir()}/.nvm/current/bin/gemini`, `${os.homedir()}/.volta/bin/gemini`, `${os.homedir()}/.local/bin/gemini`, '/opt/homebrew/bin/gemini', '/usr/local/opt/gemini-cli/bin/gemini');
  }

  // Project-local node_modules/.bin (resolve from dist/services → project root)
  const projectRoot = path.resolve(__dirname, '..', '..', '..', '..');
  const localBin = IS_WINDOWS ? 'gemini.cmd' : 'gemini';
  candidates.push(path.join(projectRoot, 'node_modules', '.bin', localBin), path.join(projectRoot, '..', 'node_modules', '.bin', localBin));

  return candidates;
}

function findGeminiOnDisk(): string | null {
  for (const p of buildCandidatePaths()) {
    try {
      if (fs.existsSync(p)) return p;
    } catch {
      // ignore permission errors
    }
  }
  return null;
}

async function findGeminiInPath(): Promise<string | null> {
  const cmd = IS_WINDOWS ? 'where gemini' : 'which gemini';
  try {
    const { stdout } = await execAsync(cmd, { timeout: 5000 });
    const first = stdout.trim().split('\n').filter(Boolean)[0];
    return first ? first.trim() : null;
  } catch {
    return null;
  }
}

// ─── Output sanitisation ─────────────────────────────────────────────────────

const ANSI_STRIP = /\x1b\[[0-9;]*[mGKHF]/g;

function sanitizeOutput(raw: string): string {
  return raw
    .replace(ANSI_STRIP, '')
    .replace(/Loaded cached credentials\./g, '')
    .replace(/\r\n/g, '\n')
    .trim();
}

// ─── Windows PowerShell helpers ───────────────────────────────────────────────

/**
 * Escape a string for use inside a PowerShell single-quoted literal ('…').
 * Rules:
 *   • ' → '' (the only special character in PS single-quoted strings)
 *   • Actual newlines are flattened to a space so the -Command argument
 *     stays on one line (multi-line prompts are rare for the -p flag).
 */
function psLiteralEscape(s: string): string {
  return s
    .replace(/\r?\n/g, ' ') // flatten newlines
    .replace(/'/g, "''"); // escape single quotes
}

/**
 * Build the PowerShell -Command string that runs Gemini CLI non-interactively.
 *
 * Example output:
 *   & 'C:\Users\foo\AppData\Roaming\npm\gemini.cmd' -m 'gemini-2.5-pro' -p 'Hello world'
 */
function buildPsCommand(cliPath: string, modelName: string, prompt: string): string {
  return `& '${psLiteralEscape(cliPath)}' -m '${psLiteralEscape(modelName)}' -p '${psLiteralEscape(prompt)}'`;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export class GeminiCliService {
  /** Cached resolved path. `undefined` = not yet resolved. */
  private resolvedPath: string | null | undefined = undefined;

  // ── Path resolution ──────────────────────────────────────────────────────

  async resolvePath(): Promise<string | null> {
    if (this.resolvedPath !== undefined) return this.resolvedPath;

    // 1. Explicit env override
    if (process.env.GEMINI_CLI_PATH) {
      const p = process.env.GEMINI_CLI_PATH;
      if (fs.existsSync(p)) {
        this.resolvedPath = p;
        return p;
      }
      console.warn(`[GeminiCLI] GEMINI_CLI_PATH="${p}" does not exist, ignoring.`);
    }

    // 2. Known disk locations
    const onDisk = findGeminiOnDisk();
    if (onDisk) {
      console.log(`[GeminiCLI] Found at: ${onDisk}`);
      this.resolvedPath = onDisk;
      return onDisk;
    }

    // 3. Shell PATH lookup
    const inPath = await findGeminiInPath();
    if (inPath) {
      console.log(`[GeminiCLI] Found in PATH: ${inPath}`);
      this.resolvedPath = inPath;
      return inPath;
    }

    console.warn('[GeminiCLI] Not found. Install with: npm install -g @google/gemini-cli');
    this.resolvedPath = null;
    return null;
  }

  resetCache(): void {
    this.resolvedPath = undefined;
  }

  // ── Availability ─────────────────────────────────────────────────────────

  async checkAvailability(): Promise<boolean> {
    return (await this.resolvePath()) !== null;
  }

  // ── OAuth credentials ────────────────────────────────────────────────────

  hasOAuthCredentials(): boolean {
    try {
      const credPath = path.join(os.homedir(), '.gemini', 'oauth_creds.json');
      if (!fs.existsSync(credPath)) return false;
      const creds = JSON.parse(fs.readFileSync(credPath, 'utf-8'));
      return !!(creds && (creds.access_token || creds.refresh_token));
    } catch {
      return false;
    }
  }

  // ── Version ──────────────────────────────────────────────────────────────

  async getVersion(): Promise<string | undefined> {
    const cliPath = await this.resolvePath();
    if (!cliPath) return undefined;

    return new Promise((resolve) => {
      // --version is safe to run via shell on Windows (no user content involved)
      const proc = spawn(cliPath, ['--version'], {
        shell: IS_WINDOWS,
        timeout: 6_000,
      });
      let out = '';
      proc.stdout?.on('data', (d: Buffer) => {
        out += d.toString();
      });
      proc.stderr?.on('data', (d: Buffer) => {
        out += d.toString();
      });
      proc.on('close', () => resolve(sanitizeOutput(out) || undefined));
      proc.on('error', () => resolve(undefined));
    });
  }

  // ── Chat ─────────────────────────────────────────────────────────────────

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResult> {
    const cliPath = await this.resolvePath();
    if (!cliPath) {
      throw new Error('Gemini CLI not found. Install with: npm install -g @google/gemini-cli' + (IS_WINDOWS ? '  (run PowerShell as Administrator if needed)' : ''));
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage?.content) {
      throw new Error('No message content provided');
    }

    const modelName = options?.model ?? process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';
    const timeoutMs = options?.timeout ?? 300_000; // 5 min default
    const prompt = lastMessage.content;

    const spawnEnv = {
      ...process.env,
      NO_COLOR: '1',
      TERM: 'dumb',
    };

    // ── Windows: delegate to PowerShell ──────────────────────────────────
    if (IS_WINDOWS) {
      const psCommand = buildPsCommand(cliPath, modelName, prompt);
      console.log(`[GeminiCLI] PowerShell: & '${cliPath}' -m '${modelName}' -p [${prompt.length} chars]`);

      return new Promise((resolve, reject) => {
        const proc = spawn('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', psCommand], {
          shell: false, // call powershell.exe directly — no cmd.exe involved
          stdio: ['ignore', 'pipe', 'pipe'],
          timeout: timeoutMs,
          env: spawnEnv,
        });

        let stdout = '';
        let stderr = '';
        proc.stdout?.on('data', (d: Buffer) => {
          stdout += d.toString();
        });
        proc.stderr?.on('data', (d: Buffer) => {
          stderr += d.toString();
        });

        proc.on('close', (code) => {
          console.log(`[GeminiCLI] PowerShell exit: ${code}`);
          if (code === 0) {
            resolve({ text: sanitizeOutput(stdout), model: modelName, cliPath });
          } else {
            const detail = sanitizeOutput(stderr || stdout);
            reject(new Error(`Gemini CLI (PowerShell) exited with code ${code}` + (detail ? `: ${detail}` : '') + (!detail ? ' — check OAuth credentials: run `gemini auth login`' : '')));
          }
        });

        proc.on('error', (err) => {
          reject(new Error(`Failed to launch PowerShell: ${err.message}`));
        });
      });
    }

    // ── Unix / macOS: spawn directly ──────────────────────────────────────
    console.log(`[GeminiCLI] Spawn: ${cliPath} -m ${modelName} -p [${prompt.length} chars]`);

    return new Promise((resolve, reject) => {
      const proc = spawn(cliPath, ['-m', modelName, '-p', prompt], {
        shell: false, // binary is a real ELF/Mach-O, no shell needed
        stdio: ['ignore', 'pipe', 'pipe'],
        timeout: timeoutMs,
        env: spawnEnv,
      });

      let stdout = '';
      let stderr = '';
      proc.stdout?.on('data', (d: Buffer) => {
        stdout += d.toString();
      });
      proc.stderr?.on('data', (d: Buffer) => {
        stderr += d.toString();
      });

      proc.on('close', (code) => {
        console.log(`[GeminiCLI] Exit: ${code}`);
        if (code === 0) {
          resolve({ text: sanitizeOutput(stdout), model: modelName, cliPath });
        } else {
          const detail = sanitizeOutput(stderr || stdout);
          reject(new Error(`Gemini CLI exited with code ${code}` + (detail ? `: ${detail}` : ' — check OAuth credentials: run `gemini auth login`')));
        }
      });

      proc.on('error', (err) => {
        reject(new Error(`Failed to start Gemini CLI (${cliPath}): ${err.message}`));
      });
    });
  }

  // ── Generate (alias) ─────────────────────────────────────────────────────

  async generate(prompt: string, options?: ChatOptions): Promise<ChatResult> {
    return this.chat([{ role: 'user', content: prompt }], options);
  }

  // ── Status ───────────────────────────────────────────────────────────────

  async getStatus(): Promise<GeminiCliStatus> {
    const cliPath = await this.resolvePath();
    const available = cliPath !== null;
    const version = available ? await this.getVersion() : undefined;
    const installHint = available ? undefined : IS_WINDOWS ? 'npm install -g @google/gemini-cli  (run PowerShell as Administrator)' : 'npm install -g @google/gemini-cli';

    return {
      available,
      hasOAuth: this.hasOAuthCredentials(),
      version,
      cliPath: cliPath ?? undefined,
      installHint,
    };
  }

  // ── Install helper ───────────────────────────────────────────────────────

  async install(): Promise<{ success: boolean; message: string }> {
    console.log('[GeminiCLI] Installing @google/gemini-cli globally...');
    try {
      const { stdout, stderr } = await execAsync('npm install -g @google/gemini-cli', {
        timeout: 120_000,
      });
      this.resetCache();
      const newPath = await this.resolvePath();
      return {
        success: newPath !== null,
        message: newPath ? `Installed at ${newPath}` : `npm reported success but binary not found. stdout: ${stdout} stderr: ${stderr}`,
      };
    } catch (err: any) {
      return { success: false, message: `Installation failed: ${err.message}` };
    }
  }
}

// ─── Singleton ────────────────────────────────────────────────────────────────

let _instance: GeminiCliService | null = null;

export function getGeminiCliService(): GeminiCliService {
  if (!_instance) _instance = new GeminiCliService();
  return _instance;
}
