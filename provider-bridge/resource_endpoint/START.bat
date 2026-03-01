@echo off
chcp 65001 >nul 2>&1
title Provider Bridge — Démarrage Rapide

REM ============================================================
REM  Provider Bridge — Script de Démarrage Windows
REM  Lance le serveur en mode développement
REM ============================================================

echo.
echo ════════════════════════════════════════════════════════════
echo    🌉 Provider Bridge — Démarrage
echo ════════════════════════════════════════════════════════════
echo.

REM Vérifier Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Node.js n'est pas installé
    echo          Téléchargez depuis : https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Node.js installé
echo.

REM Vérifier si on est dans le bon dossier
if not exist "package.json" (
    echo [ERREUR] Fichier package.json introuvable
    echo          Assurez-vous d'être dans le dossier provider-bridge
    pause
    exit /b 1
)

REM Vérifier node_modules
if not exist "node_modules\" (
    echo [INFO] Installation des dépendances...
    call npm install
    if errorlevel 1 (
        echo [ERREUR] Installation échouée
        pause
        exit /b 1
    )
    echo [OK] Dépendances installées
    echo.
)

REM Vérifier .env
if not exist ".env" (
    echo [WARN] Fichier .env introuvable
    if exist ".env.example" (
        echo [INFO] Copie de .env.example vers .env...
        copy ".env.example" ".env" >nul
        echo [OK] Fichier .env créé
        echo.
        echo ⚠️  IMPORTANT : Configurez vos clés API dans .env
        echo.
    ) else (
        echo [ERREUR] .env.example introuvable
        pause
        exit /b 1
    )
)

echo ════════════════════════════════════════════════════════════
echo    ✨ Lancement du serveur...
echo ════════════════════════════════════════════════════════════
echo.
echo   📍 URL : http://localhost:25809
echo   📚 Docs : http://localhost:25809/docs
echo   🎛️  Admin : http://localhost:25809 (admin/admin123)
echo.
echo   🔗 Base URLs pour n8n :
echo      Gemini CLI OAuth : http://localhost:25809/cli
echo      API Key Rotative : http://localhost:25809
echo.
echo   ⚡ Mode développement (hot-reload activé)
echo   🛑 Appuyez sur Ctrl+C pour arrêter
echo.
echo ════════════════════════════════════════════════════════════
echo.

REM Lancer le serveur
call npm run dev

if errorlevel 1 (
    echo.
    echo [ERREUR] Le serveur s'est arrêté avec une erreur
    pause
)
