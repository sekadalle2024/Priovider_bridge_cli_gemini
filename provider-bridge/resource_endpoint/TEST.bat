@echo off
chcp 65001 >nul 2>&1
title Provider Bridge — Tests

REM ============================================================
REM  Provider Bridge — Script de Test
REM  Teste tous les endpoints
REM ============================================================

echo.
echo ════════════════════════════════════════════════════════════
echo    🧪 Provider Bridge — Tests
echo ════════════════════════════════════════════════════════════
echo.

REM Vérifier Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Node.js n'est pas installé
    pause
    exit /b 1
)

echo [INFO] Lancement des tests...
echo.

REM Lancer les tests
node scripts/test-gemini-cli-openai.js

echo.
echo ════════════════════════════════════════════════════════════
echo    Tests terminés
echo ════════════════════════════════════════════════════════════
echo.

pause
