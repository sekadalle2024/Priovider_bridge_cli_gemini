@echo off
REM ============================================================================
REM Script de test rapide - Kiro CLI avec Claude Sonnet 4.5
REM ============================================================================

title Test Kiro CLI - Claude Sonnet 4.5

echo.
echo ========================================================================
echo   Test Kiro CLI avec Claude Sonnet 4.5
echo ========================================================================
echo.

REM Vérifier si Node.js est installé
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Node.js n'est pas installe
    pause
    exit /b 1
)

echo [OK] Node.js est installe
echo.

REM Exécuter le script de test
echo Execution des tests...
echo.
node scripts/test-kiro-claude.js

echo.
echo ========================================================================
echo   Tests termines
echo ========================================================================
echo.
pause
