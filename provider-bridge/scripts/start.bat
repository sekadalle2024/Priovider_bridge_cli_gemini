@echo off
REM ============================================================
REM Provider Bridge — Windows Startup Script
REM Launches the server with environment validation
REM ============================================================

setlocal enabledelayedexpansion
cd /d "%~dp0\.."

set PORT=25809
set MODE=%1
if "%MODE%"=="" set MODE=dev

REM Colors (using findstr for colored output)
set RED=[91m
set GREEN=[92m
set YELLOW=[93m
set BLUE=[94m
set NC=[0m

cls
echo.
echo ===============================================================
echo   🌉 Provider Bridge Endpoint — Windows Startup Script
echo ===============================================================
echo.

REM Check Node.js
echo 📦 Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Node.js not found. Please install Node.js 22+
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✓ Node.js %NODE_VERSION%

npm --version >nul 2>&1
if errorlevel 1 (
    echo ✗ npm not found
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✓ npm %NPM_VERSION%
echo.

REM Check .env file
echo 📋 Checking environment...
if not exist ".env" (
    echo ✗ .env file not found
    echo   Please run: copy .env.example .env
    exit /b 1
)
echo ✓ .env file found

REM Count API keys
for /f "tokens=*" %%i in ('findstr /c:"GEMINI_API_KEY_" .env 2^>nul ^| find /c "GEMINI_API_KEY_"') do set KEY_COUNT=%%i
if !KEY_COUNT! equ 0 (
    echo ⚠ Warning: No GEMINI_API_KEY_ found in .env
) else (
    echo ✓ API Keys configured: %KEY_COUNT% keys
)

REM Check critical variables
findstr /c:"DATABASE_URL" .env >nul 2>&1
if errorlevel 1 (
    echo ⚠ Warning: DATABASE_URL not found in .env
) else (
    echo ✓ Database configuration found
)

findstr /c:"JWT_SECRET" .env >nul 2>&1
if errorlevel 1 (
    echo ⚠ Warning: JWT_SECRET not configured
) else (
    echo ✓ JWT_SECRET configured
)
echo.

REM Check dependencies
echo 📚 Checking dependencies...
if not exist "node_modules" (
    echo Installing npm packages...
    call npm install
    if errorlevel 1 (
        echo ✗ npm install failed
        exit /b 1
    )
)
echo ✓ Dependencies ready
echo.

REM Check port
echo 🔍 Checking port %PORT%...
netstat -ano | findstr ":%PORT%" >nul 2>&1
if not errorlevel 1 (
    echo ✗ Port %PORT% is already in use
    echo   Kill the process using: taskkill /PID [PID] /F
    exit /b 1
)
echo ✓ Port %PORT% is available
echo.

REM Print startup info
echo ===============================================================
echo   ✨ Provider Bridge is Starting...
echo ===============================================================
echo.
echo 🌐 Server URLs:
echo   Dashboard:  http://localhost:%PORT%
echo   API:        http://localhost:%PORT%/api
echo   Docs:       http://localhost:%PORT%/docs
echo   Health:     http://localhost:%PORT%/health
echo.
echo 🤖 Endpoints:
echo   POST /api/providers/gemini_api_key_rotative/chat
echo   GET  /api/providers/gemini_api_key_rotative/stats
echo   POST /v1/chat/completions (OpenAI compatible)
echo   GET  /v1/models
echo.
echo Mode: %MODE%
echo Stop: Ctrl+C
echo.
echo ===============================================================
echo.

REM Launch server
if "%MODE%"=="dev" (
    echo Starting in development mode (with hot-reload)...
    echo.
    call npm run dev
) else if "%MODE%"=="build" (
    echo Building TypeScript...
    echo.
    call npm run build
    if errorlevel 0 (
        echo ✓ Build complete
        echo   Run: npm start
    )
) else if "%MODE%"=="prod" (
    echo Starting in production mode...
    echo.
    call npm run build
    if errorlevel 0 (
        call npm start
    )
) else if "%MODE%"=="remote" (
    echo Starting in remote access mode (LAN accessible)...
    echo.
    call npm run build
    if errorlevel 0 (
        call npm start -- --remote
    )
) else (
    echo ✗ Unknown mode: %MODE%
    echo.
    echo Usage: start.bat [dev^|prod^|build^|remote]
    echo.
    echo Modes:
    echo   dev     - Development with hot-reload (default)
    echo   build   - Build TypeScript only
    echo   prod    - Production build ^& run
    echo   remote  - Production with network access
    exit /b 1
)

endlocal
pause
