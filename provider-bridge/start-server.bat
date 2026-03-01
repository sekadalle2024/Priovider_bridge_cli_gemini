@echo off
title Provider Bridge - API Gateway
color 0A

echo.
echo ======================================================================
echo   Provider Bridge - Demarrage du serveur
echo ======================================================================
echo.
echo   Port    : 25809
echo   URL     : http://localhost:25809
echo   Docs    : http://localhost:25809/docs
echo   Sante   : http://localhost:25809/health
echo   Cles    : 13 cles Gemini actives (195 req/min)
echo.
echo   Pour arreter : Ctrl+C
echo ======================================================================
echo.

cd /d "%~dp0"

if not exist ".env" (
    echo ERREUR : fichier .env introuvable dans %~dp0
    echo Copiez .env.example en .env et configurez vos cles API.
    pause
    exit /b 1
)

where npx >nul 2>&1
if %errorlevel% neq 0 (
    echo ERREUR : npx introuvable. Installez Node.js depuis https://nodejs.org
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo Installation des dependances...
    call npm install
    echo.
)

echo Lancement du serveur...
echo.
npx tsx src/server.ts

if %errorlevel% neq 0 (
    echo.
    echo Le serveur s'est arrete avec une erreur (code %errorlevel%).
    pause
)
