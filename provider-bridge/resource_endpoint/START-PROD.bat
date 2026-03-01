@echo off
chcp 65001 >nul 2>&1
title Provider Bridge — Mode Production

REM ============================================================
REM  Provider Bridge — Script de Démarrage Production
REM  Build et lance le serveur en mode production
REM ============================================================

echo.
echo ════════════════════════════════════════════════════════════
echo    🌉 Provider Bridge — Mode Production
echo ════════════════════════════════════════════════════════════
echo.

REM Vérifier Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Node.js n'est pas installé
    pause
    exit /b 1
)

echo [OK] Node.js installé
echo.

REM Vérifier node_modules
if not exist "node_modules\" (
    echo [INFO] Installation des dépendances...
    call npm install
    if errorlevel 1 (
        echo [ERREUR] Installation échouée
        pause
        exit /b 1
    )
)

REM Build TypeScript
echo [INFO] Build du projet TypeScript...
call npm run build
if errorlevel 1 (
    echo [ERREUR] Build échoué
    pause
    exit /b 1
)

echo [OK] Build réussi
echo.

echo ════════════════════════════════════════════════════════════
echo    ✨ Lancement du serveur en production...
echo ════════════════════════════════════════════════════════════
echo.
echo   📍 URL : http://localhost:25809
echo   📚 Docs : http://localhost:25809/docs
echo   🎛️  Admin : http://localhost:25809
echo.
echo   🔗 Base URLs pour n8n :
echo      Gemini CLI OAuth : http://localhost:25809/cli
echo      API Key Rotative : http://localhost:25809
echo.
echo   🚀 Mode production
echo   🛑 Appuyez sur Ctrl+C pour arrêter
echo.
echo ════════════════════════════════════════════════════════════
echo.

REM Lancer le serveur
call npm start

if errorlevel 1 (
    echo.
    echo [ERREUR] Le serveur s'est arrêté avec une erreur
    pause
)
