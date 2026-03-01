@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul 2>&1
title Provider Bridge — Development Server

REM ============================================================
REM  Provider Bridge — Windows Dev Launcher
REM  Launches the server in development mode (hot-reload via tsx)
REM ============================================================

set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR=%SCRIPT_DIR%"
set "ENV_FILE=%PROJECT_DIR%.env"
set "PORT=25809"

REM ── Banner ────────────────────────────────────────────────────────────────────
echo.
echo ================================================================
echo    🌉  Provider Bridge  ^|  Development Mode
echo ================================================================
echo.

REM ── Node.js check ─────────────────────────────────────────────────────────────
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found in PATH.
    echo         Download from: https://nodejs.org  (v22 recommended)
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node -v 2^>nul') do set NODE_VER=%%v
echo [OK]   Node.js %NODE_VER%

where npm >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm not found. Reinstall Node.js.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('npm -v 2^>nul') do set NPM_VER=%%v
echo [OK]   npm %NPM_VER%
echo.

REM ── .env file check ───────────────────────────────────────────────────────────
if not exist "%ENV_FILE%" (
    echo [WARN]  .env not found — creating from .env.example ...
    if exist "%PROJECT_DIR%.env.example" (
        copy "%PROJECT_DIR%.env.example" "%ENV_FILE%" >nul
        echo [OK]   .env created. Please fill in your API keys before continuing.
        echo.
        echo        Open %ENV_FILE% and set:
        echo          GEMINI_API_KEY_1=AIza...
        echo          GEMINI_API_KEY_2=AIza...
        echo          ... (up to GEMINI_API_KEY_40)
        echo          DATABASE_URL=...
        echo          JWT_SECRET=...
        echo.
        pause
    ) else (
        echo [ERROR] .env.example not found. Cannot create .env automatically.
        echo         Create %ENV_FILE% manually.
        pause
        exit /b 1
    )
) else (
    echo [OK]   .env found
)

REM ── Count API keys ────────────────────────────────────────────────────────────
set KEY_COUNT=0
for /f "tokens=1,2 delims==" %%a in ('type "%ENV_FILE%" 2^>nul ^| findstr /r "^GEMINI_API_KEY_[0-9]"') do (
    set /a KEY_COUNT+=1
)
if %KEY_COUNT% gtr 0 (
    echo [OK]   Gemini API keys found: %KEY_COUNT%
) else (
    echo [WARN]  No GEMINI_API_KEY_* found in .env
    echo         Add GEMINI_API_KEY_1=AIza... to enable API key rotation
)

REM ── DATABASE_URL check ────────────────────────────────────────────────────────
findstr /c:"DATABASE_URL=" "%ENV_FILE%" >nul 2>&1
if not errorlevel 1 (
    echo [OK]   DATABASE_URL configured
) else (
    echo [WARN]  DATABASE_URL not set in .env
)

REM ── JWT_SECRET check ──────────────────────────────────────────────────────────
findstr /c:"JWT_SECRET=" "%ENV_FILE%" >nul 2>&1
if not errorlevel 1 (
    echo [OK]   JWT_SECRET configured
) else (
    echo [WARN]  JWT_SECRET not set — using default (change for production!)
)
echo.

REM ── Gemini CLI check ──────────────────────────────────────────────────────────
echo [....] Checking Gemini CLI ...
where gemini >nul 2>&1
if not errorlevel 1 (
    for /f "tokens=*" %%v in ('gemini --version 2^>nul') do (
        echo [OK]   Gemini CLI found: %%v
        goto :gemini_found
    )
    echo [OK]   Gemini CLI found (version check timed out)
    goto :gemini_found
)
REM Try Windows npm path
set "GEMINI_CMD=%APPDATA%\npm\gemini.cmd"
if exist "%GEMINI_CMD%" (
    echo [OK]   Gemini CLI found at %GEMINI_CMD%
    goto :gemini_found
)
echo [WARN]  Gemini CLI not found in PATH.
echo         Install with:  npm install -g @google/gemini-cli
echo         Then run:      gemini   (to authenticate with Google)
echo.

:gemini_found

REM ── Install node_modules if missing ──────────────────────────────────────────
if not exist "%PROJECT_DIR%node_modules\" (
    echo [....] Installing npm dependencies ...
    cd /d "%PROJECT_DIR%"
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
    echo [OK]   Dependencies installed
) else (
    echo [OK]   node_modules present
)
echo.

REM ── Port check ────────────────────────────────────────────────────────────────
netstat -ano 2>nul | findstr ":%PORT% " >nul 2>&1
if not errorlevel 1 (
    echo [WARN]  Port %PORT% is already in use.
    echo         Another process may be running. The server will try to bind anyway.
    echo         To free the port: taskkill /F /PID ^<pid^>
    echo.
)

REM ── Startup banner ────────────────────────────────────────────────────────────
echo ================================================================
echo    ✨  Starting Provider Bridge in development mode ...
echo ================================================================
echo.
echo   Dashboard:   http://localhost:%PORT%
echo   API:         http://localhost:%PORT%/api/providers
echo   Docs:        http://localhost:%PORT%/docs
echo   Health:      http://localhost:%PORT%/health
echo   Models:      http://localhost:%PORT%/v1/models
echo   OpenAI chat: POST http://localhost:%PORT%/v1/chat/completions
echo.
echo   Admin login: admin / admin123
echo.
echo   Hot-reload ON — save any .ts file to restart automatically.
echo   Press Ctrl+C to stop.
echo ================================================================
echo.

REM ── Launch ───────────────────────────────────────────────────────────────────
cd /d "%PROJECT_DIR%"
call npm run dev

if errorlevel 1 (
    echo.
    echo [ERROR] Server exited with an error (code %errorlevel%).
    echo         Check the output above for details.
    pause
)

endlocal
