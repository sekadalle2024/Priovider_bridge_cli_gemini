@echo off
REM ============================================================================
REM Script de démarrage rapide - Kiro CLI avec Claude Sonnet 4.5
REM ============================================================================

title Kiro CLI - Claude Sonnet 4.5

echo.
echo ========================================================================
echo   Kiro CLI avec Claude Sonnet 4.5 - Demarrage
echo ========================================================================
echo.

REM Vérifier si Node.js est installé
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Node.js n'est pas installe ou n'est pas dans le PATH
    echo.
    echo Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js est installe
node --version
echo.

REM Vérifier si Kiro CLI est installé
where kiro >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ATTENTION] Kiro CLI n'est pas installe
    echo.
    echo Installation de Kiro CLI...
    call npm install -g @kirodotdev/cli
    
    if %ERRORLEVEL% NEQ 0 (
        echo [ERREUR] Echec de l'installation de Kiro CLI
        pause
        exit /b 1
    )
    
    echo [OK] Kiro CLI installe avec succes
    echo.
)

echo [OK] Kiro CLI est installe
kiro --version
echo.

REM Vérifier l'authentification
echo Verification de l'authentification Kiro...
kiro auth status >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ATTENTION] Vous n'etes pas authentifie
    echo.
    echo Lancement de l'authentification...
    echo Suivez les instructions dans votre navigateur
    echo.
    kiro auth login
    
    if %ERRORLEVEL% NEQ 0 (
        echo [ERREUR] Echec de l'authentification
        pause
        exit /b 1
    )
    
    echo [OK] Authentification reussie
    echo.
)

echo [OK] Authentification valide
echo.

REM Vérifier si le fichier .env existe
if not exist ".env" (
    echo [ATTENTION] Fichier .env non trouve
    echo.
    if exist ".env.example" (
        echo Copie de .env.example vers .env...
        copy .env.example .env
        echo [OK] Fichier .env cree
        echo.
        echo IMPORTANT: Verifiez la configuration dans .env
        echo.
    ) else (
        echo [ERREUR] Fichier .env.example non trouve
        pause
        exit /b 1
    )
)

REM Vérifier si node_modules existe
if not exist "node_modules" (
    echo [ATTENTION] node_modules non trouve
    echo.
    echo Installation des dependances...
    call npm install
    
    if %ERRORLEVEL% NEQ 0 (
        echo [ERREUR] Echec de l'installation des dependances
        pause
        exit /b 1
    )
    
    echo [OK] Dependances installees
    echo.
)

REM Créer le dossier workspace s'il n'existe pas
if not exist "workspace" (
    echo Creation du dossier workspace...
    mkdir workspace
    echo [OK] Dossier workspace cree
    echo.
)

echo ========================================================================
echo   Demarrage du serveur Kiro CLI
echo ========================================================================
echo.
echo Base URL: http://localhost:25810/v1/kiro-cli
echo.
echo Endpoints disponibles:
echo   - Chat: http://localhost:25810/v1/kiro-cli/chat/completions
echo   - Models: http://localhost:25810/v1/kiro-cli/models
echo   - Status: http://localhost:25810/api/kiro-cli/status
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.
echo ========================================================================
echo.

REM Démarrer le serveur
call npm run start:assistants

REM Si le serveur s'arrête
echo.
echo ========================================================================
echo   Serveur arrete
echo ========================================================================
echo.
pause
